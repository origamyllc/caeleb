/**
 * Created by prashun on 9/19/16.
 */
"use strict";

const Promise = require('bluebird');
const Boom = require('boom');

class abstactPublishSubscribeEngine {

    notImplemented(name) {
        return Promise.reject(Boom.notImplemented('Method ' + name + ' not implemented in subclass of AbstractCacheEngine'));
    }

    constructor() {
        if (this.publish === undefined) {
            notImplemented('publish');
        }

        if (this.subscribe === undefined) {
            notImplemented('subscribe');
        }

    }

}

module.exports = abstactPublishSubscribeEngine;