package configs

import (
	"errors"
	"os"

	"github.com/spf13/viper"
)

type AppConfig struct {
	Name        string `mapstructure:"name"`
	Environment string `mapstructure:"environment"`
	Port        int    `mapstructure:"port"`
}

type DatabaseConfig struct {
	Host     string `mapstructure:"host"`
	Port     int    `mapstructure:"port"`
	User     string `mapstructure:"user"`
	Password string `mapstructure:"password"`
	Name     string `mapstructure:"name"`
	SSLMode  string `mapstructure:"sslmode"`
}

type LoggingConfig struct {
	Level string `mapstructure:"level"`
}

type RedisConfig struct {
	Host     string `mapstructure:"host"`
	Port     int    `mapstructure:"port"`
	Password string `mapstructure:"password"`
	DB       int    `mapstructure:"db"`
}

type MinIOConfig struct {
	Endpoint  string `mapstructure:"endpoint"`
	AccessKey string `mapstructure:"access_key"`
	SecretKey string `mapstructure:"secret_key"`
	UseSSL    bool   `mapstructure:"use_ssl"`
}

type Config struct {
	App      AppConfig      `mapstructure:"app"`
	Database DatabaseConfig `mapstructure:"database"`
	Redis    RedisConfig    `mapstructure:"redis"`
	MinIO    MinIOConfig    `mapstructure:"minio"`
	JWT      JWTConfig      `mapstructure:"jwt"`
	Logging  LoggingConfig  `mapstructure:"logging"`
}

type JWTConfig struct {
	Secret                     string `mapstructure:"secret"`
	Issuer                     string `mapstructure:"issuer"`
	AccessTokenDurationMinutes int    `mapstructure:"access_token_duration_minutes"`
	RefreshTokenDurationHours  int    `mapstructure:"refresh_token_duration_hours"`
}

func (c *Config) Validate() error {
	if c.App.Name == "" {
		return errors.New("app name is required")
	}
	if c.App.Port <= 0 {
		return errors.New("app port must be positive")
	}
	if c.Database.Host == "" || c.Database.Name == "" || c.Database.User == "" {
		return errors.New("database host, name, and user are required")
	}
	if c.Redis.Host == "" {
		return errors.New("redis host is required")
	}
	if c.MinIO.Endpoint == "" {
		return errors.New("minio endpoint is required")
	}
	if c.JWT.Secret == "" {
		return errors.New("jwt secret is required")
	}
	return nil
}

func Load() (*Config, error) {
	env := os.Getenv("APP_ENV")
	if env == "" {
		env = "development"
	}

	viper.SetConfigName(env)
	viper.SetConfigType("yaml")
	viper.AddConfigPath("./configs")

	if err := viper.ReadInConfig(); err != nil {
		return nil, err
	}

	var cfg Config

	if err := viper.Unmarshal(&cfg); err != nil {
		return nil, err
	}

	if err := cfg.Validate(); err != nil {
		return nil, err
	}

	return &cfg, nil
}
