#Caeleb

![Image of Grunth](https://d13yacurqjgara.cloudfront.net/users/541438/screenshots/2156836/untitled-3_1x.png)

##A middleware abstration layer  

Caeleb simplifies managing Middleware abstracting away publish subscribe and streaming thus allowing the ability to handle back pressure and realtime communication with client current abstractions supported are 

* **Rabbitmq**
* **Socket.io**

built over known and proven libraries it is a battle hardened library being used at monkeypatched.

##Rabbitmq API

### 1) Creating The Middleware

creating the middleware consists of three steps

 **1.1 Create the exchange**

```js
const exchange = rabbit.createExchange(exchange_name,options);
```
for available options checkout the amqp library 

 **example**

```js
const exchange = rabbit.createExchange("jibreel.exchange.electric",{"type": "topic"});
```

 **1.2 Create the queue**

```js
const exchange = rabbit.registerQueue(queue_name,exchange_name,routing_key);
```
 **example**
 
```js
const queue = rabbit.registerQueue("jibreel.queue.tesla","jibreel.exchange.electric","tesla");
```

**1.3 Bind the queues to the exchanges**

```js
rabbit.init(exchange,queue);
```

### 2) Publishing to an exchange

```js
rabbit.publish(routing_key,message);
```
 **example**
 
```js
rabbit.publish("tesla",{"ping":"yo"});
```

### 3) Subscribing from a queue

```js
rabbit.subscribe(queue_name,routing_key);
```
 **example**
 
```js
rabbit.subscribe("jibreel.queue.tesla","tesla");

```



we are actively adding more features to the library and will inform you of new releases
as and when they are made

