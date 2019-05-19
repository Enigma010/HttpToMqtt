const _ = require('lodash');
const MqttClient = require('../Mqtt/Client.js');

module.exports = class Config{
    constructor(argv){
        this.Web = {
            ListenOnPort: argv.webListenOnPort
        };

        this.Database = {
            FileName: argv.databaseFileName
        };

        this.Mqtt = {
            Url: argv.mqttUrl
        }

        // Parse MQTT optional parameters if supplied
        if(!_.isUndefined(argv.mqttOptions)){
            this.Mqtt.Options = JSON.parse(argv.mqttOptions);
        }
        else{
            this.Mqtt.Options = {};
        }

        // This section either uses the values passed in or sets them to default values
        if(_.isUndefined(this.Web.ListenOnPort) || _.isNull(this.Web.ListenOnPort)){
            this.Web.ListenOnPort = 3000;
        }

        if(_.isUndefined(this.Mqtt.Url) || _.isNull(this.Mqtt.Url)){
            this.Mqtt.Url = 'mqtt://localhost:1883';
        }

        if(_.isUndefined(this.Database.FileName) || _.isNull(this.Database.FileName)){
            this.Database.FileName = "instance/Database.sqlite";
        }
        // end section of setting defaults
    }
}