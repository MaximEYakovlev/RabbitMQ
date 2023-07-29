// require the library
const amqp = require("amqplib/callback_api");

// connect to RabbitMQ server
amqp.connect("amqp://localhost", (error0, connection) => {
  if (error0) {
    throw error0;
  }

  // create a channel
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }

    // declare a queue
    const queue = "hello";
    const msg = "Hello world";

    channel.assertQueue(queue, {
      durable: false,
    });

    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(" [x] Sent %s", msg);
  });

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
});
