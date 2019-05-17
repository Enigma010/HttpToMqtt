const _ = require('lodash');

const GenericController = require('./GenericController.js');
const MqttClient = require('./../../Mqtt/Client');

module.exports = class HttpToMqttController extends GenericController{
    constructor(server, config){
        super(server);

        // Setup the route handling for http
        this.Setup();

        this.MqttClient = new MqttClient(config.Url, config.Options);
    }

    Publish(request, response){
        let thrownError = null;
        try{
            let options = {};
            if(!_.isUndefined(request.body.options) && !_.isNull(request.body.options)){
                options = request.options;
            }
            let value = '';
            if(!_.isUndefined(request.body.value) && !_.isNull(request.body.value)){
                value = request.body.value;
            }
            else if(!_.isUndefined(request.body.currentTime) && !_.isNull(request.body.currentTime)){
                value = new Date();
            }
            this.MqttClient.Publish(request.body.topic, value, options);
        }
        catch(error){
            thrownError = error;
        }

        // Send the distance back to the requestor
        this.SendResponseFunc(response)(thrownError, {});
    }

    Setup(){
        // Setup the route to read from the distance sensor
        this.SetupHandleRequest('/', _.bind(this.Publish, this), 'POST');
    }
}