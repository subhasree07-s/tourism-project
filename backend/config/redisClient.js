const redis = require("redis");

let client;

if (process.env.REDIS_URL) {
  client = redis.createClient({
    url: process.env.REDIS_URL
  });

  client.connect()
    .then(() => console.log("✅ Redis Connected"))
    .catch(err => console.error("Redis Error:", err));

} else {
  console.log("⚠️ Redis not connected (no REDIS_URL)");
}

module.exports = client;