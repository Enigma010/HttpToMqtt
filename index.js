const HttpToMqttServer = require('./HttpToMqttServer.js');
const Config = require('./App/Config/Config.js');
let argv = require('yargs').argv;
const Logger = require('./App/Logger.js');

let config = new Config(argv);

Logger.Level = config.Log.LogLevel;
Logger.LogFileName = config.Log.LogFileName;

// Create and start the web server and the distance sensor
let server = new HttpToMqttServer(config);