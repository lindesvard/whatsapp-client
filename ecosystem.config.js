module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    {
      name: "chat-client",
      // script: "app.js",
      // interpreter: "node@8.1.2",
      // exec_interpreter: "/home/web/.nvm/versions/node/v8.1.2/bin/node",
      env: {
        // COMMON_VARIABLE: "true"
      },
      env_production : {
        NODE_ENV: "production"
      }
    }
  ],

  deploy : {
    production : {
      user : "web",
      host : "146.185.175.11",
      port : "22123",
      ref  : "origin/master",
      repo : "git@github.com:lindesvard/whatsapp-client.git",
      path : "/home/web/webroot/chat-client",
      'post-deploy': 'npm install && npm run build && pm2 startOrRestart ecosystem.config.js --env production'
    }
  }
};
