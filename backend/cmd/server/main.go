// @title AUMS API
// @version 1.0
// @description AI Powered Autonomous Management System API
// @BasePath /api/v1

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization

package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"aums/backend/configs"
	"aums/backend/pkg/app"
	"aums/backend/pkg/cache"
	"aums/backend/pkg/database"
	"aums/backend/pkg/logger"
	"aums/backend/pkg/server"
	"aums/backend/pkg/storage"

	"github.com/gin-gonic/gin"
)

func main() {

	cfg, err := configs.Load()
	if err != nil {
		log.Fatal(err)
	}

	// Set Gin mode based on environment
	if cfg.App.Environment == "production" || cfg.App.Environment == "staging" {
		gin.SetMode(gin.ReleaseMode)
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
	defer func() {
		db.Close()
		l.Info("database connection closed")
	}()

	l.Info("database connected")

	redisClient, err := cache.New(cfg.Redis)
	if err != nil {
		log.Fatal(err)
	}
	defer func() {
		redisClient.Close()
		l.Info("redis connection closed")
	}()

	l.Info("redis connected")

	minioClient, err := storage.New(cfg.MinIO)
	if err != nil {
		log.Fatal(err)
	}

	l.Info("minio connected")

	application := &app.Application{
		Config: cfg,
		Logger: l,
		DB:     db,
		Redis:  redisClient,
		MinIO:  minioClient,
	}

	router := server.New(application)

	l.Info("server initialized")

	fmt.Println("=================================")
	fmt.Println(cfg.App.Name)
	fmt.Println("Environment:", cfg.App.Environment)
	fmt.Println("=================================")

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", cfg.App.Port),
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Initializing the server in a goroutine so that
	// it won't block the graceful shutdown handling below
	go func() {
		l.Info(fmt.Sprintf("server listening on port %d", cfg.App.Port))
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			l.Fatal(fmt.Sprintf("listen: %s", err))
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server with
	// a timeout of 10 seconds.
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	l.Info("shutting down server...")

	// The context is used to inform the server it has 10 seconds to finish
	// the request it is currently handling
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		l.Fatal(fmt.Sprintf("server forced to shutdown: %s", err))
	}

	l.Info("server exiting")
}
