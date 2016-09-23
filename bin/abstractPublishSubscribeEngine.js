/**
 * Created by prashun on 9/19/16.
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Promise = require('bluebird');
var Boom = require('boom');

var abstactPublishSubscribeEngine = function () {
    _createClass(abstactPublishSubscribeEngine, [{
        key: 'notImplemented',
        value: function notImplemented(name) {
            return Promise.reject(Boom.notImplemented('Method ' + name + ' not implemented in subclass of AbstractCacheEngine'));
        }
    }]);

    function abstactPublishSubscribeEngine() {
        _classCallCheck(this, abstactPublishSubscribeEngine);

        if (this.publish === undefined) {
            notImplemented('publish');
        }

        if (this.subscribe === undefined) {
            notImplemented('subscribe');
        }
    }

    return abstactPublishSubscribeEngine;
}();

module.exports = abstactPublishSubscribeEngine;