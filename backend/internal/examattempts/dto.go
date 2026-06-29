package examattempts

// CreateExamAttemptRequest represents the request payload to record an exam attempt.
type CreateExamAttemptRequest struct {
	ExamRegistrationID string `json:"exam_registration_id" validate:"required,uuid"`

	AttemptNumber int32 `json:"attempt_number" validate:"required,gte=1"`

	MarksObtained float64 `json:"marks_obtained" validate:"required"`

	EvaluatorID string `json:"evaluator_id" validate:"required,uuid"`

	EvaluatedAt string `json:"evaluated_at" validate:"required"`
	// RFC3339 format

	Remarks string `json:"remarks"`
}
