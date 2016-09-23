'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by prashun on 9/16/16.
 */
var Promise = require('bluebird');
var abstactPublishSubscribeEngine = require('./abstractPublishSubscribeEngine');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);
var ioc = require('socket.io-client');
var port = process.env.SOCKET_IO_PORT || 3000;
http.listen(port);

var socketioEngine = function (_abstactPublishSubscr) {
    _inherits(socketioEngine, _abstactPublishSubscr);

    function socketioEngine() {
        _classCallCheck(this, socketioEngine);

        return _possibleConstructorReturn(this, (socketioEngine.__proto__ || Object.getPrototypeOf(socketioEngine)).apply(this, arguments));
    }

    _createClass(socketioEngine, [{
        key: 'publish',
        value: function publish(channel, msg) {
            var _socket = io.of('/' + channel).on('connection', function (socket) {
                _socket.emit(channel, msg);
            });
        }
    }, {
        key: 'subscribe',
        value: function subscribe(options, channel, callback) {
            var socket = ioc.connect("http://" + options.host + ":" + options.port + "/" + channel);
            socket.on(channel, function (msg) {
                callback(msg);
            });
        }
    }]);

    return socketioEngine;
}(abstactPublishSubscribeEngine);

module.exports = new socketioEngine();