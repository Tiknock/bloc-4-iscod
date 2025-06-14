module.exports = {
  apps: [
    {
      name: "app",
      script: "./www/app.js",
      env_production: {
        NODE_ENV: "production",
      },
      logs: "./logs/err.log",
      maxmemory_restart: "200M",
      pm2: true,
      instances: 3,
      exec_mode: "cluster",
    },
  ],
};
