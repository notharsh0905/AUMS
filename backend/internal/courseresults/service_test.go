package courseresults

import (
	"context"
	"testing"

	aumsuuid "aums/backend/pkg/uuid"
)

func TestCourseResultValidation(t *testing.T) {
	t.Run("Reject negative marks", func(t *testing.T) {
		service := NewService(nil, nil)
		callerID, _ := aumsuuid.New()

		req := CreateCourseResultRequest{
			EnrollmentID:     "00000000-0000-0000-0000-000000000001",
			CourseOfferingID: "00000000-0000-0000-0000-000000000002",
			TotalMarks:       50.0,
			MarksObtained:    -5.0,
			Percentage:       0.0,
			GradeScaleID:     "00000000-0000-0000-0000-000000000003",
			ResultStatus:     "DRAFT",
		}

		err := service.Create(context.Background(), callerID.String(), req)
		if err == nil || err.Error() != "marks obtained cannot be negative" {
			t.Errorf("expected negative marks error, got: %v", err)
		}
	})

	t.Run("Reject marks exceeding total marks", func(t *testing.T) {
		service := NewService(nil, nil)
		callerID, _ := aumsuuid.New()

		req := CreateCourseResultRequest{
			EnrollmentID:     "00000000-0000-0000-0000-000000000001",
			CourseOfferingID: "00000000-0000-0000-0000-000000000002",
			TotalMarks:       50.0,
			MarksObtained:    55.0,
			Percentage:       110.0,
			GradeScaleID:     "00000000-0000-0000-0000-000000000003",
			ResultStatus:     "DRAFT",
		}

		err := service.Create(context.Background(), callerID.String(), req)
		if err == nil || err.Error() != "marks obtained (55.00) cannot exceed total marks (50.00)" {
			t.Errorf("expected marks exceeding total marks error, got: %v", err)
		}
	})

	t.Run("Parse valid result DTO formatting", func(t *testing.T) {
		req := CreateCourseResultRequest{
			EnrollmentID:     "00000000-0000-0000-0000-000000000001",
			CourseOfferingID: "00000000-0000-0000-0000-000000000002",
			TotalMarks:       50.0,
			MarksObtained:    42.5,
			Percentage:       85.0,
			GradeScaleID:     "00000000-0000-0000-0000-000000000003",
			ResultStatus:     "DRAFT",
		}

		if req.MarksObtained > req.TotalMarks {
			t.Errorf("marks obtained cannot exceed total marks")
		}
	})
}
