const _ = require('lodash');
const fs = require('fs');
const path = require('path');

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
        };

        this.Log = {
            DirectoryName: argv.logDirectory,
            LogLevel: argv.logLevel
        };

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

        let instanceDirectory = 'instance';
        let defaultDatabaseFileName = path.join(instanceDirectory, 'Database.sqlite');
        let defaultLogDirectory = path.join(instanceDirectory, 'log');

        if(_.isUndefined(this.Database.FileName) || _.isNull(this.Database.FileName)){
            this.Database.FileName = defaultDatabaseFileName;
        }

        if(_.isUndefined(this.Log.DirectoryName) || _.isNull(this.Log.DirectoryName)){
            this.Log.DirectoryName = defaultLogDirectory;
        }

        if (!fs.existsSync(this.Log.DirectoryName)){
            fs.mkdirSync(this.Log.DirectoryName);
        }

        this.Log.LogFileName = path.join(this.Log.DirectoryName, 'app.log');
        // end section of setting defaults
    }
}