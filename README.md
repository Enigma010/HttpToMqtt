# HttpToMqtt
A passthrough to take HTTP posts and publish them to a MQTT channel.

## Parameters
When you start the program you can supply it various parameters. The syntax for a parameter is the following:

--parameterName parameterValue

All the parameters have a default value if not specified. There are certain parameters that are required for the program to start, if these parameters are not specified it will use the default values. If the parameter is not required and not specified the option will be turned off.

## Startup
The following command is used to start the program:

```
sudo node index.js --mqttUrl "mqttUrl" --webListenOnPort "webListenOnPort" &
```

Note you need to supply values for the following:

Parameter|Description|Required|Default
---------|-----------|--------|-------
--mqttUrl|The URL for the MQTT server, example mqtt://mqttServer note that you can also specify the port like mqtt://mqttServer:mqttPort.|Yes|mqtt://localhost:1883
--webListenOnPort|The socket number to use for the web server|Yes|3000

## Usage
### Publish a Value
Use the following method to publish a value to MQTT. Create a HTTP post command to the URL:

```
http://serverName:webListenOnPort/Publish
```

Note you need to set *serverName* to the name of the server hosting the HttpToMqtt program, and set *webListenOnPort* to the port the web server is listening on. Set the body to be of type *JSON (applicaiton/json)*, with the post command create a JSON object and specify a property with the name *Topic* and set the value to be the channel name you want to publish to, also specify a property with the name of *Value* and set the value to be the value that you want to publish to the MQTT channel. As an example to publish to the topic *foo* the value of *1* use the following:

```javascript
{
    "Topic": "foo",
    "Value": "1"
}
```
Run the HTTP post and the value specified will be published to the channel specified.

### Presence
A specialized usage of the passthrough used to track presence. Usage depends on periodically running the HTTP post to signal the presence of a thing. If a HTTP post is not received within a set period of time the precence is considered to be gone and a message is published to signal that the thing is gone.

To use the presence option create a HTTP post create a HTTP post command to the URL:

```
http://serverName:webListenOnPort/Presence
```

Note you need to set *serverName* to the name of the server hosting the HttpToMqtt program, and set *webListenOnPort* to the port the web server is listening on. Set the body to be of type *JSON (applicaiton/json)*, with the post command create a JSON object and specify the following properties:

Property|Description|Default
--------|-----------|-------
Topic|The channel to publish the presence value to|
PresentValue|The value to publish when the thing is present|1
AwayValue|The value to publish when the thing is away|0
ExpirationInSeconds|The number of seconds after which if no heartbeat is detected the thing is considered away|60
Heartbeat|Set this to true|

Example:
``` javascript
{
    "Topic": "foo",
    "ExpirationInSeconds": "60",
    "Heartbeat": "true"
}
```

## Complete Parameter List
Here is a complete list of the parameters that can be specified when starting the program:

Parameter|Description|Required|Default
---------|-----------|--------|-------
--mqttUrl|The URL for the MQTT server, example mqtt://mqttServer note that you can also specify the port like mqtt://mqttServer:mqttPort.|Yes|mqtt://localhost:1883
--webListenOnPort|The socket number to use for the web server|Yes|3000
--mqttOptions|Options to pass into the MQTT client, JSON format. See [Mqtt.js](https://www.npmjs.com/package/mqtt) for details.|No|
--databaseFileName|The relative or absolute path (directory and filename) of the place to store presence information|No|instance/Database.sqlite