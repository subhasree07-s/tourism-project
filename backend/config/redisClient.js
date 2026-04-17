const redis = require("redis");

const client = redis.createClient({
  url: "redis://localhost:6379"
});

client.connect()
  .then(() => console.log("✅ Redis Connected"))
  .catch(err => console.error("Redis Error:", err));

module.exports = client;