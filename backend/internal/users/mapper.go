package users

import "aums/backend/internal/db/generated"

func ToResponse(
	user generated.User,
) UserResponse {

	return UserResponse{
		UserID: user.UserID.String(),

		Username: user.Username.String,

		Email: user.Email,

		PhoneNumber: user.PhoneNumber.String,

		FirstName: user.FirstName,

		MiddleName: user.MiddleName.String,

		LastName: user.LastName.String,

		Status: string(user.Status),
	}
}

func ToResponses(
	users []generated.User,
) []UserResponse {

	response := make(
		[]UserResponse,
		0,
		len(users),
	)

	for _, user := range users {
		response = append(
			response,
			ToResponse(user),
		)
	}

	return response
}
