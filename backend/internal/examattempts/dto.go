package examattempts

type CreateExamAttemptRequest struct {
	ExamRegistrationID string  `json:"exam_registration_id" validate:"required,uuid"`
	AttemptNumber      int32   `json:"attempt_number" validate:"required,gte=1"`
	MarksObtained      float64 `json:"marks_obtained" validate:"required,gte=0"`
	EvaluatorID        string  `json:"evaluator_id" validate:"required,uuid"`
	EvaluatedAt        string  `json:"evaluated_at" validate:"required"` // RFC3339 format
	Remarks            string  `json:"remarks"`
}

type UpdateExamAttemptRequest struct {
	MarksObtained float64 `json:"marks_obtained" validate:"required,gte=0"`
	EvaluatorID   string  `json:"evaluator_id" validate:"required,uuid"`
	EvaluatedAt   string  `json:"evaluated_at" validate:"required"` // RFC3339 format
	Remarks       string  `json:"remarks"`
}

type ExamAttemptResponse struct {
	ExamAttemptID      string  `json:"exam_attempt_id"`
	ExamRegistrationID string  `json:"exam_registration_id"`
	AttemptNumber      int32   `json:"attempt_number"`
	MarksObtained      float64 `json:"marks_obtained"`
	EvaluatorID        string  `json:"evaluator_id"`
	EvaluatedAt        string  `json:"evaluated_at"`
	Remarks            string  `json:"remarks"`
	CreatedAt          string  `json:"created_at"`
	UpdatedAt          string  `json:"updated_at"`
}
