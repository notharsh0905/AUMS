package app

import (
	"aums/backend/configs"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/minio/minio-go/v7"
	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"
)

type Application struct {
	Config *configs.Config

	Logger *zap.Logger

	DB *pgxpool.Pool

	Redis *redis.Client

	MinIO *minio.Client
}
