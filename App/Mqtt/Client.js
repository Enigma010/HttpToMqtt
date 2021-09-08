var mqtt = require('mqtt');
const _ = require('lodash');
const Logger = require('./../Logger.js');

module.exports = class Client{
    constructor(server, url, options){
        this.Server = server;
        this.Url = url;
        this.Options = options;
        this.MqttClient = mqtt.connect(this.Url, this.Options);
    }

    //Invoked when the distance sensor detects a change in distance to update the mqtt channel
    Publish(topic, value, options){
        Logger.Log("app", "debug", "MqttClient::Publish - Begin", { topic: topic, value: value, options: options });
        // If we're not connected then try to connect to MQTT
        if(!this.MqttClient.connected){
            Logger.Log("app", "debug", "MqttClient::Publish - Not connected, connecting");
            this.MqttClient = mqtt.connect(this.Url, this.Options);
        }

        // Only if we're connected publish the distance
        if(this.MqttClient.connected){
            Logger.Log("app", "debug", "MqttClient::Publish - Begin MQTT client");
            this.MqttClient.publish(topic, value.toString(), options);
            Logger.Log("app", "debug", "MqttClient::Publish - End MQTT client");
        }
        Logger.Log("app", "debug", "MqttClient::Publish - End");
    }
};