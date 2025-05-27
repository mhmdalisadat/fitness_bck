module.exports = {
  apps: [
    {
      name: "fitness-backend",
      script: "./dist/index.js",
      env_production: {
        NODE_ENV: "production",
        PORT: 7076,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
    },
  ],
};
