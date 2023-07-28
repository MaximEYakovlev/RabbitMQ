const amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", (error0, connection) => {
  if (error0) {
    throw error0;
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }

    const queue = "task_queue";

    // This makes sure the queue is declared before attempting to consume from it
    channel.assertQueue(queue, {
      // message durability
      durable: true,
    });

    // don't dispatch a new message to a worker until it has processed and acknowledged the previous one
    channel.prefetch(1);

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    channel.consume(
      queue,
      (msg) => {
        const secs = msg.content.toString().split(".").length - 1;

        console.log(" [x] Received %s", msg.content.toString());
        setTimeout(() => {
          console.log(" [x] Done");
          channel.ack(msg);
        }, secs * 1000);
      },
      {
        // manual acknowledgment mode
        noAck: false,
      }
    );
  });
});
