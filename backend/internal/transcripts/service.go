package transcripts

import (
	"context"
	"strconv"
	"time"

	"aums/backend/internal/userroles"
	aumsuuid "aums/backend/pkg/uuid"

	"github.com/jackc/pgx/v5/pgtype"
)

type Service struct {
	repository       *Repository
	userRolesService *userroles.Service
}

func NewService(
	repository *Repository,
	userRolesService *userroles.Service,
) *Service {
	return &Service{
		repository:       repository,
		userRolesService: userRolesService,
	}
}

func (s *Service) CanAccessStudent(
	ctx context.Context,
	callerUserID pgtype.UUID,
	studentProfileID pgtype.UUID,
) (bool, error) {
	if s.userRolesService == nil {
		return true, nil
	}

	// Administrators and Deans/HODs have institutional oversight
	isSuperAdmin, _ := s.userRolesService.HasRole(ctx, callerUserID, "SUPER_ADMIN")
	isInstAdmin, _ := s.userRolesService.HasRole(ctx, callerUserID, "INSTITUTION_ADMIN")
	isDean, _ := s.userRolesService.HasRole(ctx, callerUserID, "DEAN")
	isHOD, _ := s.userRolesService.HasRole(ctx, callerUserID, "HOD")
	if isSuperAdmin || isInstAdmin || isDean || isHOD {
		return true, nil
	}

	// Students may only view their own transcript
	isStudent, _ := s.userRolesService.HasRole(ctx, callerUserID, "STUDENT")
	if isStudent {
		studentProfile, err := s.repository.queries.GetStudentProfileByUserID(ctx, callerUserID)
		if err == nil && studentProfile.StudentProfileID == studentProfileID {
			return true, nil
		}
		return false, nil
	}

	// Parents may only view their linked wards' transcripts
	isParent, _ := s.userRolesService.HasRole(ctx, callerUserID, "PARENT")
	if isParent {
		wards, err := s.repository.queries.ListParentWards(ctx, callerUserID)
		if err == nil {
			for _, w := range wards {
				if w.StudentProfileID == studentProfileID {
					return true, nil
				}
			}
		}
		return false, nil
	}

	return true, nil
}

func (s *Service) GetTranscript(ctx context.Context, studentIDStr string) (TranscriptResponse, error) {
	studentProfileID, err := aumsuuid.Parse(studentIDStr)
	if err != nil {
		return TranscriptResponse{}, err
	}

	info, err := s.repository.GetStudentInfo(ctx, studentProfileID)
	if err != nil {
		return TranscriptResponse{}, err
	}

	enrollmentID := info.EnrollmentID

	semesters, err := s.GetTranscriptSemesters(ctx, enrollmentID.String())
	if err != nil {
		return TranscriptResponse{}, err
	}

	courses, err := s.GetTranscriptCourses(ctx, enrollmentID.String())
	if err != nil {
		return TranscriptResponse{}, err
	}

	cgpaSummary, err := s.GetTranscriptSummary(ctx, enrollmentID.String())
	if err != nil {
		// If program result record is not found, fallback to empty/calculated CGPA
		cgpaSummary = TranscriptCGPASummary{
			Cgpa:                  0,
			TotalCredits:          0,
			EarnedCredits:         0,
			CreditsRemaining:      120.0,
			OverallPercentage:     0,
			DegreeClassification:  "Fail",
			GraduationEligibility: "INELIGIBLE",
			AcademicStanding:      "Academic Probation",
			DegreeCompleted:       false,
		}
	}

	var enrollmentDateStr, graduationDateStr, dateOfBirthStr, admissionDateStr string
	if info.EnrollmentDate.Valid {
		enrollmentDateStr = info.EnrollmentDate.Time.Format("2006-01-02")
	}
	if info.GraduationDate.Valid {
		graduationDateStr = info.GraduationDate.Time.Format("2006-01-02")
	}
	if info.DateOfBirth.Valid {
		dateOfBirthStr = info.DateOfBirth.Time.Format("2006-01-02")
	}
	if info.AdmissionDate.Valid {
		admissionDateStr = info.AdmissionDate.Time.Format("2006-01-02")
	}

	return TranscriptResponse{
		Student: StudentDetails{
			StudentID:        info.StudentProfileID.String(),
			EnrollmentID:     info.EnrollmentID.String(),
			EnrollmentNumber: info.EnrollmentNumber,
			EnrollmentDate:   enrollmentDateStr,
			GraduationDate:   graduationDateStr,
			AdmissionDate:    admissionDateStr,
			FirstName:        info.FirstName,
			LastName:         info.LastName.String,
			Email:            info.Email,
			Gender:           info.Gender.String,
			DateOfBirth:      dateOfBirthStr,
			Nationality:      info.Nationality.String,
			BloodGroup:       info.BloodGroup.String,
		},
		Program: ProgramDetails{
			ProgramID:      info.ProgramID.String(),
			ProgramCode:    info.ProgramCode,
			ProgramName:    info.ProgramName,
			DegreeType:     string(info.DegreeType),
			DepartmentName: info.DepartmentName,
		},
		Semesters:   semesters,
		Courses:     courses,
		CGPA:        cgpaSummary,
		GeneratedAt: time.Now().Format(time.RFC3339),
	}, nil
}

func (s *Service) GetTranscriptSummary(ctx context.Context, enrollmentIDStr string) (TranscriptCGPASummary, error) {
	enrollmentID, err := aumsuuid.Parse(enrollmentIDStr)
	if err != nil {
		return TranscriptCGPASummary{}, err
	}

	pr, err := s.repository.GetCGPASummary(ctx, enrollmentID)
	if err != nil {
		return TranscriptCGPASummary{}, err
	}

	var cgpaVal float64
	if pr.Cgpa.Valid {
		var str string
		if err := pr.Cgpa.Scan(&str); err == nil {
			if val, err := strconv.ParseFloat(str, 64); err == nil {
				cgpaVal = val
			}
		}
	}

	var totalCreditsVal float64
	if pr.TotalCredits.Valid {
		var str string
		if err := pr.TotalCredits.Scan(&str); err == nil {
			if val, err := strconv.ParseFloat(str, 64); err == nil {
				totalCreditsVal = val
			}
		}
	}

	var earnedCreditsVal float64
	if pr.EarnedCredits.Valid {
		var str string
		if err := pr.EarnedCredits.Scan(&str); err == nil {
			if val, err := strconv.ParseFloat(str, 64); err == nil {
				earnedCreditsVal = val
			}
		}
	}

	requiredCredits := 120.0
	creditsRemaining := requiredCredits - earnedCreditsVal
	if creditsRemaining < 0 {
		creditsRemaining = 0
	}

	degreeCompleted := pr.DegreeCompleted

	degreeClassification := "Pass"
	academicStanding := "Good Standing"
	graduationEligibility := "INELIGIBLE"

	if cgpaVal >= 3.75 {
		degreeClassification = "First Class with Distinction"
	} else if cgpaVal >= 3.0 {
		degreeClassification = "First Class"
	} else if cgpaVal >= 2.0 {
		degreeClassification = "Second Class"
	} else {
		degreeClassification = "Fail"
		academicStanding = "Academic Probation"
	}

	if degreeCompleted && earnedCreditsVal >= requiredCredits && cgpaVal >= 2.0 {
		graduationEligibility = "ELIGIBLE"
	}

	return TranscriptCGPASummary{
		Cgpa:                  cgpaVal,
		TotalCredits:          totalCreditsVal,
		EarnedCredits:         earnedCreditsVal,
		CreditsRemaining:      creditsRemaining,
		OverallPercentage:     cgpaVal * 9.5, // Standard university CGPA conversion
		DegreeClassification:  degreeClassification,
		GraduationEligibility: graduationEligibility,
		AcademicStanding:      academicStanding,
		DegreeCompleted:       degreeCompleted,
	}, nil
}

func (s *Service) GetTranscriptSemesters(ctx context.Context, enrollmentIDStr string) ([]TranscriptSemester, error) {
	enrollmentID, err := aumsuuid.Parse(enrollmentIDStr)
	if err != nil {
		return nil, err
	}

	summaries, err := s.repository.GetSemesterSummary(ctx, enrollmentID)
	if err != nil {
		return nil, err
	}

	result := make([]TranscriptSemester, 0, len(summaries))
	for _, sem := range summaries {
		var sgpaVal float64
		if sem.Sgpa.Valid {
			var str string
			if err := sem.Sgpa.Scan(&str); err == nil {
				if val, err := strconv.ParseFloat(str, 64); err == nil {
					sgpaVal = val
				}
			}
		}

		var totalCreditsVal float64
		if sem.TotalCredits.Valid {
			var str string
			if err := sem.TotalCredits.Scan(&str); err == nil {
				if val, err := strconv.ParseFloat(str, 64); err == nil {
					totalCreditsVal = val
				}
			}
		}

		var earnedCreditsVal float64
		if sem.EarnedCredits.Valid {
			var str string
			if err := sem.EarnedCredits.Scan(&str); err == nil {
				if val, err := strconv.ParseFloat(str, 64); err == nil {
					earnedCreditsVal = val
				}
			}
		}

		var publishedAtStr string
		if sem.PublishedAt.Valid {
			publishedAtStr = sem.PublishedAt.Time.Format(time.RFC3339)
		}

		result = append(result, TranscriptSemester{
			SemesterResultID: sem.SemesterResultID.String(),
			SemesterID:       sem.SemesterID.String(),
			SemesterNumber:   sem.SemesterNumber,
			SemesterName:     sem.SemesterName,
			TotalCredits:     totalCreditsVal,
			EarnedCredits:    earnedCreditsVal,
			Sgpa:             sgpaVal,
			ResultStatus:     string(sem.ResultStatus),
			PublishedAt:      publishedAtStr,
		})
	}

	return result, nil
}

func (s *Service) GetTranscriptCourses(ctx context.Context, enrollmentIDStr string) ([]TranscriptCourse, error) {
	enrollmentID, err := aumsuuid.Parse(enrollmentIDStr)
	if err != nil {
		return nil, err
	}

	rows, err := s.repository.GetCourseSummary(ctx, enrollmentID)
	if err != nil {
		return nil, err
	}

	result := make([]TranscriptCourse, 0, len(rows))
	for _, c := range rows {
		var creditsVal float64
		if c.Credits.Valid {
			var str string
			if err := c.Credits.Scan(&str); err == nil {
				if val, err := strconv.ParseFloat(str, 64); err == nil {
					creditsVal = val
				}
			}
		}

		var totalMarksVal float64
		if c.TotalMarks.Valid {
			var str string
			if err := c.TotalMarks.Scan(&str); err == nil {
				if val, err := strconv.ParseFloat(str, 64); err == nil {
					totalMarksVal = val
				}
			}
		}

		var marksObtainedVal float64
		if c.MarksObtained.Valid {
			var str string
			if err := c.MarksObtained.Scan(&str); err == nil {
				if val, err := strconv.ParseFloat(str, 64); err == nil {
					marksObtainedVal = val
				}
			}
		}

		var percentageVal float64
		if c.Percentage.Valid {
			var str string
			if err := c.Percentage.Scan(&str); err == nil {
				if val, err := strconv.ParseFloat(str, 64); err == nil {
					percentageVal = val
				}
			}
		}

		var gradePointVal float64
		if c.GradePoint.Valid {
			var str string
			if err := c.GradePoint.Scan(&str); err == nil {
				if val, err := strconv.ParseFloat(str, 64); err == nil {
					gradePointVal = val
				}
			}
		}

		var publishedAtStr string
		if c.PublishedAt.Valid {
			publishedAtStr = c.PublishedAt.Time.Format(time.RFC3339)
		}

		var isPassingBool bool
		if c.IsPassing.Valid {
			isPassingBool = c.IsPassing.Bool
		}

		result = append(result, TranscriptCourse{
			CourseResultID:   c.CourseResultID.String(),
			CourseOfferingID: c.CourseOfferingID.String(),
			CourseID:         c.CourseID.String(),
			CourseCode:       c.CourseCode,
			CourseName:       c.CourseName,
			Credits:          creditsVal,
			SemesterID:       c.SemesterID.String(),
			SemesterNumber:   c.SemesterNumber,
			TotalMarks:       totalMarksVal,
			MarksObtained:    marksObtainedVal,
			Percentage:       percentageVal,
			GradeCode:        c.GradeCode.String,
			GradePoint:       gradePointVal,
			IsPassing:        isPassingBool,
			ResultStatus:     string(c.ResultStatus),
			PublishedAt:      publishedAtStr,
		})
	}

	return result, nil
}
