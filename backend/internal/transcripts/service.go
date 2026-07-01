package transcripts

import (
	"context"
	"strconv"
	"time"

	aumsuuid "aums/backend/pkg/uuid"
)

type Service struct {
	repository *Repository
}

func NewService(repository *Repository) *Service {
	return &Service{
		repository: repository,
	}
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

	overallPercentage := cgpaVal * 10.0

	degreeClassification := "Fail"
	if cgpaVal >= 8.5 {
		degreeClassification = "First Class with Distinction"
	} else if cgpaVal >= 6.5 {
		degreeClassification = "First Class"
	} else if cgpaVal >= 5.0 {
		degreeClassification = "Second Class"
	} else if cgpaVal >= 4.0 {
		degreeClassification = "Pass Class"
	}

	graduationEligibility := "INELIGIBLE"
	if earnedCreditsVal >= requiredCredits && cgpaVal >= 4.0 {
		graduationEligibility = "ELIGIBLE"
	}

	academicStanding := "Academic Probation"
	if cgpaVal >= 8.5 {
		academicStanding = "Excellent"
	} else if cgpaVal >= 6.5 {
		academicStanding = "Good"
	} else if cgpaVal >= 4.0 {
		academicStanding = "Satisfactory"
	}

	var completionDateStr string
	if pr.CompletionDate.Valid {
		completionDateStr = pr.CompletionDate.Time.Format("2006-01-02")
	}

	return TranscriptCGPASummary{
		Cgpa:                  cgpaVal,
		TotalCredits:          totalCreditsVal,
		EarnedCredits:         earnedCreditsVal,
		CreditsRemaining:      creditsRemaining,
		OverallPercentage:     overallPercentage,
		DegreeClassification:  degreeClassification,
		GraduationEligibility: graduationEligibility,
		AcademicStanding:      academicStanding,
		DegreeCompleted:       pr.DegreeCompleted,
		CompletionDate:        completionDateStr,
	}, nil
}

func (s *Service) GetTranscriptSemesters(ctx context.Context, enrollmentIDStr string) ([]TranscriptSemester, error) {
	enrollmentID, err := aumsuuid.Parse(enrollmentIDStr)
	if err != nil {
		return nil, err
	}

	rows, err := s.repository.GetSemesterSummary(ctx, enrollmentID)
	if err != nil {
		return nil, err
	}

	res := make([]TranscriptSemester, 0, len(rows))
	for _, row := range rows {
		var totalCredits float64
		if row.TotalCredits.Valid {
			var str string
			if err := row.TotalCredits.Scan(&str); err == nil {
				if val, err := strconv.ParseFloat(str, 64); err == nil {
					totalCredits = val
				}
			}
		}

		var earnedCredits float64
		if row.EarnedCredits.Valid {
			var str string
			if err := row.EarnedCredits.Scan(&str); err == nil {
				if val, err := strconv.ParseFloat(str, 64); err == nil {
					earnedCredits = val
				}
			}
		}

		var sgpa float64
		if row.Sgpa.Valid {
			var str string
			if err := row.Sgpa.Scan(&str); err == nil {
				if val, err := strconv.ParseFloat(str, 64); err == nil {
					sgpa = val
				}
			}
		}

		var publishedAtStr string
		if row.PublishedAt.Valid {
			publishedAtStr = row.PublishedAt.Time.Format(time.RFC3339)
		}

		res = append(res, TranscriptSemester{
			SemesterResultID: row.SemesterResultID.String(),
			SemesterID:       row.SemesterID.String(),
			SemesterNumber:   row.SemesterNumber,
			SemesterName:     row.SemesterName,
			TotalCredits:     totalCredits,
			EarnedCredits:    earnedCredits,
			Sgpa:             sgpa,
			ResultStatus:     string(row.ResultStatus),
			PublishedAt:      publishedAtStr,
		})
	}

	return res, nil
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

	res := make([]TranscriptCourse, 0, len(rows))
	for _, row := range rows {
		var credits float64
		if row.Credits.Valid {
			var str string
			if err := row.Credits.Scan(&str); err == nil {
				if val, err := strconv.ParseFloat(str, 64); err == nil {
					credits = val
				}
			}
		}

		var totalMarks float64
		if row.TotalMarks.Valid {
			var str string
			if err := row.TotalMarks.Scan(&str); err == nil {
				if val, err := strconv.ParseFloat(str, 64); err == nil {
					totalMarks = val
				}
			}
		}

		var marksObtained float64
		if row.MarksObtained.Valid {
			var str string
			if err := row.MarksObtained.Scan(&str); err == nil {
				if val, err := strconv.ParseFloat(str, 64); err == nil {
					marksObtained = val
				}
			}
		}

		var percentage float64
		if row.Percentage.Valid {
			var str string
			if err := row.Percentage.Scan(&str); err == nil {
				if val, err := strconv.ParseFloat(str, 64); err == nil {
					percentage = val
				}
			}
		}

		var gradePoint float64
		if row.GradePoint.Valid {
			var str string
			if err := row.GradePoint.Scan(&str); err == nil {
				if val, err := strconv.ParseFloat(str, 64); err == nil {
					gradePoint = val
				}
			}
		}

		var publishedAtStr string
		if row.PublishedAt.Valid {
			publishedAtStr = row.PublishedAt.Time.Format(time.RFC3339)
		}

		res = append(res, TranscriptCourse{
			CourseResultID:   row.CourseResultID.String(),
			CourseOfferingID: row.CourseOfferingID.String(),
			CourseID:         row.CourseID.String(),
			CourseCode:       row.CourseCode,
			CourseName:       row.CourseName,
			Credits:          credits,
			SemesterID:       row.SemesterID.String(),
			SemesterNumber:   row.SemesterNumber,
			TotalMarks:       totalMarks,
			MarksObtained:    marksObtained,
			Percentage:       percentage,
			GradeCode:        row.GradeCode.String,
			GradePoint:       gradePoint,
			IsPassing:        row.IsPassing.Bool,
			ResultStatus:     string(row.ResultStatus),
			PublishedAt:      publishedAtStr,
		})
	}

	return res, nil
}
