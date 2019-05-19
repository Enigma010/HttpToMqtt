const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const HttpToMqttController = require('./Controller/HttpToMqttController.js');

const Database = require('../Data/Database.js');
const Presence = require('../Data/Presence.js');

module.exports = class Server{
    constructor(listenOnPort, httpToMqttConfig, databaseConfig){

        // Setup the Web Server
        this.ListenOnPort = listenOnPort;
        this.Server = express();
        this.Server.use(bodyParser.json());
        this.Listener = this.Server.listen(this.ListenOnPort);
        this.Controllers = [];
        this.DataModels = [];
        this.HttpToMqttConfig = httpToMqttConfig;
        this.DatabaseConfig = databaseConfig;
        this.Database = new Database(this.DatabaseConfig.FileName);

        // Finish setup
        this.Setup();
    }

    Setup(){
        // Setup all data models
        this.SetupDataModels();

        // Setup all the controllers
        this.SetupControllers();
    }
    
    SetupDataModels(){
        // Setup the models
        this.DataModels['Presence'] = new Presence(this.Database);
    }

    SetupControllers(){
        // Setup the controllers
        this.Controllers['HttpToMqttController'] = new HttpToMqttController(this.Server, this.HttpToMqttConfig, this.DataModels['Presence']);
    }
}