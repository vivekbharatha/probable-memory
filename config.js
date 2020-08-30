module.exports = {
  MONGO_DB_URL: process.env.MONGO_DB_URL || 'mongodb://localhost:27017/probable-memory',
  SECRET_KEY: process.env.SECRET_KEY || "It'sNotSecretForNow",
};
