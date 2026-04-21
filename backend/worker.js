const amqp = require("amqplib");
require("dotenv").config();

async function startWorker() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();

    const queues = ["authQueue", "bookingQueue", "packageQueue"];

    console.log("Worker started...");

    for (const queue of queues) {
      await channel.assertQueue(queue);

      channel.consume(queue, (msg) => {
        if (msg !== null) {
          const data = JSON.parse(msg.content.toString());

          console.log(`📥 Received from ${queue}:`, data);

          setTimeout(() => {
            console.log(`✅ Processed from ${queue}:`, data.email || data);
            channel.ack(msg);
          }, 2000);
        }
      });
    }

  } catch (err) {
    console.error("Worker error:", err.message);
  }
}

startWorker();