module.exports = {
  apps: [{
    name: 'codebility-bot',
    script: 'dist/index.js',
    cwd: '/home/ec2-user/codebility-plus/apps/bot',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
