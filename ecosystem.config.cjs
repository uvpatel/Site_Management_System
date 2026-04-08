module.exports = {
  apps: [
    {
      name: "siteos-api",
      script: "./backend/server.js",
      cwd: __dirname,
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      watch: false,
      max_memory_restart: "500M",
      error_file: "./logs/api-error.log",
      out_file: "./logs/api-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
    },
  ],
};
