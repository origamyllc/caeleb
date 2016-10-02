/**
 * Created by prashun on 9/19/16.
 */

'use strict';

//https://gist.github.com/kusor/402761
/**
 * Created by prashun on 9/16/16.
 */
const Promise = require('bluebird');
const  abstactPublishSubscribeEngine = require('./abstractPublishSubscribeEngine');
const  amqp = require('amqp');

const defaults ={
    rabbitmq:{
        options: {
              host: 'localhost'
            , port: 5672
            , login: 'guest'
            , password: 'guest', connectionTimeout: 10000
            , authMechanism: 'AMQPLAIN'
            , noDelay: true
            , ssl: { enabled : false
            }
        }
}};

let config = process.env.CONFIG_PATH || defaults ;
let options = {};

if(config &&  config.rabbitmq && config.rabbitmq.options){
    options = config.rabbitmq.options;
}
else{
    throw new Error('no rabbitmq config found please set the path for the config file')
}

const  connection = amqp.createConnection(options);
let exchanges = {};
let queues = {};
let _queues = {};

    class rabbitmqEngine extends abstactPublishSubscribeEngine {

        init(exchanges,queues){
            let exchange_key;
            for (exchange_key in exchanges ){
                let key;
                let _queue = queues[exchange_key];
                for(  key in _queue ){
                    let queue = _queue[key];
                    let q = connection.queue(queue.name);
                    q.bind(exchange_key, queue.routing_key);
                }
            }
        }

        createExchange(name, options) {
            return new Promise( (resolve) => {
                exchanges[name] = connection.exchange(name, options,  (exchange) => {});
                resolve(exchanges);
            });
        }

        registerQueue(queue_name, exchange_name, routing_key) {
            return new Promise( (resolve) => {
                let value = { name: queue_name, routing_key: routing_key };
                let key = exchange_name;
                _queues[value.name] = value;
                queues[key] = _queues;
                resolve(queues);
            });
        }

        publish(routing_key, body) {
            return new Promise((resolve) => {
                    connection.publish(routing_key, body, null, () => {
                        // console.log('publish')
                        resolve(body);
                    });

            });
        }

        subscribe(queue_name,routing_key) {
            return new Promise( (resolve) => {
                    // Use the default 'amq.topic' exchange
                    connection.queue(queue_name,  (q) => {
                        // Catch all messages
                        q.bind(routing_key);

                        // Receive messages
                        q.subscribe( (message) => {
                            // Print messages to stdout
                            resolve(message);
                        });
                    });
                });
        }
    }

module.exports = new rabbitmqEngine();

