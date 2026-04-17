const amqp = require("amqplib");

async function startService() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queue = "packageQueue";

    await channel.assertQueue(queue);

    console.log("📦 Package Service listening...");

    channel.consume(queue, (msg) => {
      const data = JSON.parse(msg.content.toString());

      console.log("📦 Package event received:", data);

      channel.ack(msg);
    });

  } catch (err) {
    console.error("❌ Package Service Error:", err.message);
  }
}

startService();