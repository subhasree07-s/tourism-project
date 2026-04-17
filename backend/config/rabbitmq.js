const amqp = require("amqplib");

let channel;

async function connectQueue() {
  const connection = await amqp.connect("amqp://localhost");
  channel = await connection.createChannel();
  await channel.assertQueue("bookingQueue");
  console.log("✅ RabbitMQ Connected");
}

function sendToQueue(queueName, data) {
  if (!channel) {
    console.error("waiting for Rabbitmq...");
    return;
  }

  channel.sendToQueue(
    queueName,
    Buffer.from(JSON.stringify(data))
  );

  console.log(`📤 Sent to ${queueName}:`, data);
}
module.exports = { connectQueue, sendToQueue };
