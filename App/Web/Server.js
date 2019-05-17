const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const HttpToMqttController = require('./Controller/HttpToMqttController.js');

module.exports = class Server{
    constructor(listenOnPort, httpToMqttConfig){

        // Setup the Web Server
        this.ListenOnPort = listenOnPort;
        this.Server = express();
        this.Server.use(bodyParser.json());
        this.Listener = this.Server.listen(this.ListenOnPort);
        this.Controllers = [];
        this.HttpToMqttConfig = httpToMqttConfig;

        // Finish setup
        this.Setup();
    }

    Setup(){
        // Setup all the controllers
        this.SetupControllers();
    }
    
    SetupControllers(){
        // Setup the distance controller
        this.Controllers.push(new HttpToMqttController(this.Server, this.HttpToMqttConfig));
    }
}