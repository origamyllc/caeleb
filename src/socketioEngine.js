
/**
 * Created by prashun on 9/16/16.
 */
const Promise = require('bluebird');
const  abstactPublishSubscribeEngine = require('./abstractPublishSubscribeEngine');

const app = require('express')();
const  http = require('http').Server(app);
const io = require( 'socket.io' ).listen( http );
const ioc = require( 'socket.io-client' );
const port = process.env.SOCKET_IO_PORT || 3000;
http.listen(port);

class socketioEngine extends abstactPublishSubscribeEngine {
    publish(channel,msg ) {
        var _socket = io
            .of('/' + channel)
            .on('connection', (socket) => {
                _socket.emit(channel,msg);
            });
    }

    subscribe(options,channel,callback){
        const socket = ioc.connect( "http://"+ options.host +":" + options.port + "/" + channel );
            socket.on( channel,  (msg) => {
                callback(msg)
            });
    }
}

module.exports = new socketioEngine();