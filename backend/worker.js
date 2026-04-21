const amqp = require("amqplib");

async function startWorker() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();

    const queue = "authQueue";

    await channel.assertQueue(queue);

    console.log("Worker started");

    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());

        console.log("Received:", data);

        setTimeout(() => {
          console.log("Processed:", data.email);
          channel.ack(msg);
        }, 2000);
      }
    });

  } catch (err) {
    console.error("Worker error:", err.message);
  }
}

startWorker();