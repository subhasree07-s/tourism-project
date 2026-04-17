const amqp = require("amqplib");

async function consume() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  await channel.assertQueue("bookingQueue");

  console.log("📥 Waiting for messages...");

  channel.consume("bookingQueue", (msg) => {
    const data = JSON.parse(msg.content.toString());

    console.log("Processing booking:", data);

    // 🔥 Simulate background task
    console.log("✅ Booking processed:", data.bookingId);

    channel.ack(msg);
  });
}

consume();