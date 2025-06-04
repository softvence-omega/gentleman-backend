export default () => ({
  port: parseInt(process.env.PORT as string, 10),
  node_env: process.env.NODE_ENV,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_secret: process.env.JWT_SECRET,
  jwt_expired_in: process.env.JWT_EXPIRED_IN,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  client_url: process.env.ClIENT_URL,
  stripe_webhook_secret:process.env.STRIPE_WEBHOOK_SECRET,
  database: {
    url: process.env.DATABASE_URL
  }
});
