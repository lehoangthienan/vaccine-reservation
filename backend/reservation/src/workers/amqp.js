import amqp from 'amqp'
import underscore from 'underscore';
import logger from '../utils/logger'

const defaultExchangeOptions =
{
  type: 'topic',
  durable: true,
  autoDelete: false,
  confirm: true
}
const defaultQueueOptions = {
  durable: true,
  autoDelete: false
};
const defaultMessageOptions = {
  contentType: 'application/json',
  deliveryMode: 2
}
const defaultConnectionOptions = {
  reconnect: true
}
const defaultSubscribeOptions = {
  ack: true,
  prefetchCount: 1,
  schema: ''
};

class Amqp {
	static get_connection(opts, impl) {
		return new Promise((resolve, reject) => {
      const implOptions = underscore.defaults(impl || {},defaultConnectionOptions)

			amqp.createConnection(opts, implOptions, (connection) => {
				let amqp_host = opts.host;

				logger.info(`Connect AMQP at ${amqp_host} successfully`);
				if (implOptions.reconnect) {
					connection.on('error', (err) => {
						logger.error('Amqp Connection Error', err);
					});
				}

				resolve(connection);
			});
		});
	}

	static exchange(connection, exchangeName, options) {
		const exchangeOptions = underscore.defaults(options || {},defaultExchangeOptions)
    if (connection.exchanges && connection.exchanges[exchangeName]) {
      let exchange = connection.exchanges[exchangeName]
      logger.info('exchange.state', exchange.state)
      if (exchange.state == 'open') {
        logger.info('exchange open already', exchangeName)
        return Promise.resolve(exchange)
      } else {
        logger.info('wait for exchange event')
        return new Promise((resolve, reject) => {
          exchange.on('open', () => {
            logger.info('on open exchange event')
            return resolve(exchange)
          })
        })
      }
    }
    logger.info('Create exchange with options:', exchangeName, exchangeOptions)
    return new Promise((resolve, reject) => {
			connection.exchange(exchangeName, exchangeOptions, (exchange) => {
				resolve(exchange);
			});
		});
	}

	static queue(connection, queueName, options) {
    const queueOptions = underscore.defaults((options || {}),defaultQueueOptions)
    logger.info('Create queue with options:', queueName, queueOptions)
		return new Promise((resolve, reject) => {
			connection.queue(queueName, queueOptions, (queue) => {
        logger.info('Created queue success:', queueName)
				resolve(queue);
			});
		});
	}

  static publish(connection, exchangeOptions, routingKey, message, options) {
    let exchangeName = exchangeOptions
    let _exchangeOptions = {}

    if (typeof exchangeOptions === 'object') {
      exchangeName = exchangeOptions.name
      _exchangeOptions = exchangeOptions.options
    }
    let _message_options = underscore.defaults(options || {},defaultMessageOptions)
    logger.info('Publish message with options:', _message_options)

    return new Promise((resolve, reject) => {
      this.exchange(connection, exchangeName,_exchangeOptions).then((exchange) => {
        exchange.publish(routingKey, message, _message_options, (res, err) => {
          if (err) {
            logger.error('Error publish AMQP', message, err);
            reject(err);
          } else {
            logger.info('Published Message', exchangeName, message);
            resolve();
          }
        });
      });
    });
  }

	static subscribe(connection, options, process_message) {
    // declare best practice queue declare
    let queueOptions = options.queue.options || {}
    if (!queueOptions.arguments) {
      logger.info('Setting default queue argument')
      queueOptions.arguments = {
        'x-dead-letter-exchange': options.exchange.name,
        'x-dead-letter-routing-key': `${options.routingKey}.dead`
      }
    }

		Promise.all([
			this.exchange(connection, options.exchange.name, options.exchange.options),
			this.queue(connection, options.queue.name, queueOptions),
			this.queue(connection, options.deadQueueName || `${options.queue.name}.dead`)
		]).then((data) => {
			let exchange = data[0];
			let queue = data[1];
			let dead_queue = data[2];
			if (queueOptions.arguments['x-dead-letter-routing-key'])
        dead_queue.bind(exchange, queueOptions.arguments['x-dead-letter-routing-key']);
			queue.bind(exchange, options.routingKey);
      const subOptions = underscore.defaults(options.subOptions || {},defaultSubscribeOptions)

      logger.info('Subscribing to queue with options:',subOptions)
			queue.subscribe(subOptions, (message, headers, deliveryInfo, ack) => {
        try {
          logger.info('Received message:', deliveryInfo.contentType, message.data)
  				if (deliveryInfo.parseError) {
  					logger.error('Schema', deliveryInfo.rawData, deliveryInfo.parseError);
  					ack.reject(false);
  				}
  				else if (deliveryInfo.contentType) {
    					switch (deliveryInfo.contentType) {
    						case 'text/plain':
                  try {
                    process_message(JSON.parse(message.data.toString()), deliveryInfo, ack);
                  } catch (error) {
                      process_message(message.data.toString(), deliveryInfo, ack);
                  }

    							break;
                case 'text/json':
                case 'application/json':
    							process_message(message, deliveryInfo, ack);
    							break;
    						default:
    								process_message(JSON.parse(message.data.toString()), deliveryInfo, ack);
                    break;
    					}
    				} else {
    					process_message(JSON.parse(message.data.toString()), deliveryInfo, ack);
    				}
        } catch(error) {
          ack.reject(false);
          logger.error('Cannot parse message', message, error);
        }
			});
		});
	}
}

export default Amqp;
