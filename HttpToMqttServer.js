const _ = require('lodash');

const WebServer = require('./App/Web/Server.js');

module.exports = class HttpToMqttServer{
    constructor(config){
        this.Config = config;
           
        // Setup the web server and distance sensor
        this.WebServer = new WebServer(this.Config.Web.ListenOnPort, this.Config.Mqtt);
    }
}