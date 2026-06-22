package storage

import (
	"aums/backend/configs"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

func New(cfg configs.MinIOConfig) (*minio.Client, error) {

	client, err := minio.New(
		cfg.Endpoint,
		&minio.Options{
			Creds: credentials.NewStaticV4(
				cfg.AccessKey,
				cfg.SecretKey,
				"",
			),
			Secure: cfg.UseSSL,
		},
	)

	if err != nil {
		return nil, err
	}

	return client, nil
}
