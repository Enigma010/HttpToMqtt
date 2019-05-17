const HttpToMqttServer = require('./HttpToMqttServer.js');
const Config = require('./App/Config/Config.js');
let argv = require('yargs').argv;

let config = new Config(argv);

// Create and start the web server and the distance sensor
let server = new HttpToMqttServer(config);