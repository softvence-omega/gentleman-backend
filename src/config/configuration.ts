export default () => ({
  port: parseInt(process.env.PORT as string, 10),
  node_env: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
});
