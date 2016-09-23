/**
 * Created by prashun on 9/19/16.
 */

'use strict';

//https://gist.github.com/kusor/402761
/**
 * Created by prashun on 9/16/16.
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Promise = require('bluebird');
var abstactPublishSubscribeEngine = require('./abstractPublishSubscribeEngine');
var amqp = require('amqp');

var defaults = {
    rabbitmq: {
        options: {
            host: 'localhost',
            port: 5672,
            login: 'guest',
            password: 'guest', connectionTimeout: 10000,
            authMechanism: 'AMQPLAIN',
            noDelay: true,
            ssl: { enabled: false
            }
        }
    } };

var config = process.env.CONFIG_PATH || defaults;
var options = {};

if (config && config.rabbitmq && config.rabbitmq.options) {
    options = config.rabbitmq.options;
} else {
    throw new Error('no rabbitmq config found please set the path for the config file');
}

var connection = amqp.createConnection(options);

var exchanges = {};
var queues = {};

var rabbitmqEngine = function (_abstactPublishSubscr) {
    _inherits(rabbitmqEngine, _abstactPublishSubscr);

    function rabbitmqEngine() {
        _classCallCheck(this, rabbitmqEngine);

        return _possibleConstructorReturn(this, (rabbitmqEngine.__proto__ || Object.getPrototypeOf(rabbitmqEngine)).apply(this, arguments));
    }

    _createClass(rabbitmqEngine, [{
        key: 'init',
        value: function init() {
            connection.on('ready', function () {
                // puts("connected to " + connection.serverProperties.product);
                // There is no need to declare type, 'topic' is the default:
                Object.keys(exchanges).forEach(function (exchange_name) {

                    var _exchange = exchanges[exchange_name];

                    // Consumer:
                    Object.keys(queues).forEach(function (key) {

                        var _queues = null;

                        if (key === exchange_name) {
                            _queues = queues[key];
                        }

                        _queues.forEach(function (queue) {

                            var q = connection.queue(queue.name);
                            q.bind(_exchange.name, queue.routing_key);
                        });
                    });
                });
            });
        }
    }, {
        key: 'createExchange',
        value: function createExchange(name, options) {
            return new Promise(function (resolve) {
                connection.on('ready', function () {
                    exchanges[name] = connection.exchange(name, options, function (exchange) {
                        resolve(exchange.name);
                    });
                });
            });
        }
    }, {
        key: 'registerQueue',
        value: function registerQueue(queue_name, exchange_name, routing_key) {
            return new Promise(function (resolve) {
                connection.on('ready', function () {
                    var value = { name: queue_name, routing_key: routing_key };
                    var key = exchange_name;

                    // if no queues are bound to the exchange prep for binding
                    if (typeof queues[exchange_name] === "undefined") {
                        queues[exchange_name] = [value];
                    } else {
                        // if there are  queues that  are bound to the exchange check whether queue is bound
                        queues[exchange_name].push(value);
                    }

                    resolve(queues[exchange_name]);
                });
            });
        }
    }, {
        key: 'publish',
        value: function publish(routing_key, body) {
            return new Promise(function (resolve) {
                connection.on('ready', function () {
                    connection.publish(routing_key, body, null, function () {
                        // console.log('publish')
                    });
                });
                resolve(body);
            });
        }
    }, {
        key: 'subscribe',
        value: function subscribe(queue_name, routing_key) {
            return new Promise(function (resolve) {
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
    }]);

    return rabbitmqEngine;
}(abstactPublishSubscribeEngine);

module.exports = new rabbitmqEngine();