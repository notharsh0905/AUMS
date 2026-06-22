package main

import (
	"fmt"
	"log"

	"aums/backend/configs"
	"aums/backend/pkg/cache"
	"aums/backend/pkg/database"
	"aums/backend/pkg/logger"
	"aums/backend/pkg/server"
	"aums/backend/pkg/storage"
)

func main() {

	cfg, err := configs.Load()
	if err != nil {
		log.Fatal(err)
	}

	l, err := logger.New()
	if err != nil {
		log.Fatal(err)
	}
	defer l.Sync()

	db, err := database.New(cfg.Database)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	l.Info("database connected")

	redisClient, err := cache.New(cfg.Redis)
	if err != nil {
		log.Fatal(err)
	}
	defer redisClient.Close()

	l.Info("redis connected")

	minioClient, err := storage.New(cfg.MinIO)
	if err != nil {
		log.Fatal(err)
	}

	_ = minioClient

	l.Info("minio connected")

	router := server.New()

	l.Info("server initialized")

	fmt.Println("=================================")
	fmt.Println(cfg.App.Name)
	fmt.Println("Environment:", cfg.App.Environment)
	fmt.Println("=================================")

	if err := router.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}
