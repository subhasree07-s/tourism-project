const express = require("express");
const amqp = require("amqplib");

const app = express();

async function startService() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  await channel.assertQueue("authQueue");

  console.log("🔐 Auth Service listening...");

  channel.consume("authQueue", (msg) => {
    const data = JSON.parse(msg.content.toString());

    console.log("🔐 Auth request:", data);

    console.log("✅ Auth processed for:", data.email);

    channel.ack(msg);
  });
}

startService();

app.listen(6001, () => {
  console.log("🚀 Auth Service running on 6001");
});