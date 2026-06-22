package cache

import (
	"context"
	"fmt"
	"time"

	"aums/backend/configs"

	"github.com/redis/go-redis/v9"
)

func New(cfg configs.RedisConfig) (*redis.Client, error) {

	addr := fmt.Sprintf(
		"%s:%d",
		cfg.Host,
		cfg.Port,
	)

	client := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: cfg.Password,
		DB:       cfg.DB,
	})

	ctx, cancel := context.WithTimeout(
		context.Background(),
		5*time.Second,
	)
	defer cancel()

	if err := client.Ping(ctx).Err(); err != nil {
		return nil, err
	}

	return client, nil
}
