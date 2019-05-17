var mqtt = require('mqtt');
const _ = require('lodash');

module.exports = class Client{
    constructor(url, options){
        this.Url = url;
        this.Options = options;
        this.MqttClient = mqtt.connect(this.Url, this.Options);
    }

    //Invoked when the distance sensor detects a change in distance to update the mqtt channel
    Publish(topic, value, options){
        // If we're not connected then try to connect to MQTT
        if(!this.MqttClient.connected){
            this.MqttClient = mqtt.connect(this.Url, this.Options);
        }

        // Only if we're connected publish the distance
        if(this.MqttClient.connected){
            this.MqttClient.publish(topic, value.toString(), options);
        }
    }
};