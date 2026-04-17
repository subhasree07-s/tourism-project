const amqp = require("amqplib");

let channel;

async function connectQueue() {
  if (!process.env.RABBITMQ_URL) {
    console.log("⚠️ RabbitMQ not connected (no RABBITMQ_URL)");
    return;
  }

  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertQueue("bookingQueue");

  console.log("✅ RabbitMQ Connected");
}

function sendToQueue(queueName, data) {
  if (!channel) {
    console.log("⚠️ RabbitMQ not ready");
    return;
  }

  channel.sendToQueue(
    queueName,
    Buffer.from(JSON.stringify(data))
  );

  console.log(`📤 Sent to ${queueName}:`, data);
}

module.exports = { connectQueue, sendToQueue };