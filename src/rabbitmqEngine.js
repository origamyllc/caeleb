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
   let _queues = [];

    class rabbitmqEngine extends abstactPublishSubscribeEngine {

        init(){
            connection.on('ready', () => {
                // puts("connected to " + connection.serverProperties.product);
                // There is no need to declare type, 'topic' is the default:
                Object.keys(exchanges).forEach((exchange_name) => {

                    let _exchange = exchanges[exchange_name];

                    // Consumer:
                    Object.keys(queues).forEach((key) => {

                        let _queues = null;

                        if(key === exchange_name){
                            _queues = queues[key]
                        }

                        _queues.forEach(function(queue){

                            let q  = connection.queue(queue.name);
                            q.bind(_exchange.name, queue.routing_key);

                        });
                    });
                });
            });
        }

        createExchange(name, options) {
            return new Promise((resolve) => {
                connection.on('ready', function () {
                    exchanges[name] = connection.exchange(name, options, (exchange) => {
                        resolve(exchange.name);
                    });
                });
            });
        }

        registerQueue(queue_name, exchange_name, routing_key) {
         return new Promise(function (resolve) {
                    let value = { name: queue_name, routing_key: routing_key };
                    let key = exchange_name;
                    let obj = {};
                    _queues[ value.name ] = value;
                    queues[key] = _queues;
                    resolve(queues);
                });
        }

        publish(routing_key, body) {
            return new Promise((resolve) => {
                connection.on('ready', () => {
                    connection.publish(routing_key, body, null , () => {
                       // console.log('publish')
                    })
                })
                resolve(body);
            });
        }

        subscribe(queue_name,routing_key) {
            return new Promise((resolve) => {
                // Wait for connection to become established.
                connection.on('ready', function () {
                    // Use the default 'amq.topic' exchange
                    connection.queue(queue_name, function (q) {
                        // Catch all messages
                        q.bind(routing_key);

                        // Receive messages
                        q.subscribe(function (message) {
                            // Print messages to stdout
                            resolve(message);
                        });
                    });
                });
            });
        }
    }

module.exports = new rabbitmqEngine();

