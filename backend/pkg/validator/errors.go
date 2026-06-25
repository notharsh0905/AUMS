package validator

import (
	"strings"

	"github.com/go-playground/validator/v10"
)

func FormatErrors(err error) map[string]string {

	errors := make(map[string]string)

	validationErrors, ok := err.(validator.ValidationErrors)
	if !ok {
		errors["error"] = err.Error()
		return errors
	}

	for _, field := range validationErrors {

		name := toSnakeCase(field.Field())

		switch field.Tag() {

		case "required":
			errors[name] = "is required"

		case "uuid":
			errors[name] = "must be a valid UUID"

		case "oneof":
			errors[name] = "contains an invalid value"

		default:
			errors[name] = field.Error()
		}
	}

	return errors
}

func toSnakeCase(s string) string {

	var result []rune

	for i, r := range s {

		if i > 0 && r >= 'A' && r <= 'Z' {
			result = append(result, '_')
		}

		result = append(result, r)
	}

	return strings.ToLower(string(result))
}
