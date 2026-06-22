package jwt

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID string `json:"user_id"`

	jwt.RegisteredClaims
}

func GenerateAccessToken(
	userID string,
	secret string,
	issuer string,
	duration time.Duration,
) (string, error) {

	claims := Claims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:  issuer,
			Subject: userID,
			ExpiresAt: jwt.NewNumericDate(
				time.Now().Add(duration),
			),
			IssuedAt: jwt.NewNumericDate(
				time.Now(),
			),
		},
	}

	token := jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		claims,
	)

	return token.SignedString(
		[]byte(secret),
	)
}
