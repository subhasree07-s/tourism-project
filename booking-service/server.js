const express = require("express");
const amqp = require("amqplib");

const app = express();

async function startService() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertQueue("bookingQueue");

    console.log("📥 Booking Microservice listening for messages...");

    channel.consume("bookingQueue", (msg) => {
      const data = JSON.parse(msg.content.toString());

      console.log("📦 Received booking in microservice:", data);

      // simulate processing
      console.log("✅ Booking processed by microservice:", data.bookingId);

      channel.ack(msg);
    });

  } catch (err) {
    console.error("RabbitMQ Error:", err);
  }
}

startService();

app.listen(6000, () => {
  console.log("🚀 Booking Microservice running on port 6000");
});