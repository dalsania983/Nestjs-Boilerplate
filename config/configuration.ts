export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  JWT_SECRET: process.env.SECRET,
});
