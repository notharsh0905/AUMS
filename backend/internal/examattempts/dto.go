package examattempts

type CreateExamAttemptRequest struct {
	ExamRegistrationID string `json:"exam_registration_id" binding:"required"`

	AttemptNumber int32 `json:"attempt_number" binding:"required"`

	MarksObtained float64 `json:"marks_obtained" binding:"required"`

	EvaluatorID string `json:"evaluator_id" binding:"required"`

	EvaluatedAt string `json:"evaluated_at" binding:"required"`
	// RFC3339 format

	Remarks string `json:"remarks"`
}
