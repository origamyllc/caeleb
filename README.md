#Caeleb

![Image of Grunth](https://d13yacurqjgara.cloudfront.net/users/541438/screenshots/2156836/untitled-3_1x.png)

##A middleware abstration layer  

Caeleb simplifies managing Middleware abstracting away publish subscribe and streaming thus allowing the ability to handle back pressure and realtime communication with client current abstractions supported are 

* **Rabbitmq**
* **Socket.io**

built over known and proven libraries it is a battle hardened library being used at monkeypatched.

##Rabbitmq API

###Create The Middleware

creating the middleware consists of three steps

* **Create the exchanges**

```js
rabbit.createExchange("jibreel.exchange.electric",{"type": "topic"});
```

* **Create the queues**
* **Bind the queues to the exchanges **



we are actively adding more features to the library and will inform you of new releases
as and when they are made

