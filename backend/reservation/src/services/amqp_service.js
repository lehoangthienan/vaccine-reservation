import Amqp from '../workers/amqp'
import configs from '../configs'

var ampqConnection = (function() {
  var instance;
  async function init() {
    const connection = await Amqp.get_connection(configs.RABBIT_CONFIG)
    return connection
  }

  return {
    getInstance : async function() {
      if (!instance) instance = await init();
      return instance;
    }
  }
})();

export default ampqConnection;