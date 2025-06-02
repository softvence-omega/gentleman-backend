export default () => ({
  port: parseInt(process.env.PORT as string, 10),
  node_env: process.env.NODE_ENV,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_secret: process.env.JWT_SECRET,
  jwt_expires_in: process.env.JWT_EXPIRES_IN,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
  client_url: process.env.CLIENT_URL,
  database: {
    url: process.env.DATABASE_URL
  }
    url: process.env.DATABASE_URL,
    name: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  },
});
