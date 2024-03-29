const _ = require('lodash');

const GenericController = require('./GenericController.js');
const MqttClient = require('./../../Mqtt/Client');
const PresenceModel = require('./../../Models/Presence.js');
const PresencesModel = require('./../../Models/Presences.js');
const Logger = require('./../../Logger.js');

module.exports = class HttpToMqttController extends GenericController{
    constructor(server, config, presenceDatabase){
        super(server);

        // Setup the route handling for http
        this.Setup();

        // Setup the Mqtt client
        this.MqttClient = new MqttClient(server, config.Url, config.Options);

        // Setup the presences model and hook up the Mqtt client to handle updating
        // the presence as present or away
        this.Presences = new PresencesModel();

        this.PresenceDatabase = presenceDatabase;

        // Create a handler to publish present events
        this.PresentHandler = _.bind(function(presence){
            this.MqttClient.Publish(presence.Topic, presence.PresentValue, {retain: true});
        }, this);

        // Create a handler to publish away events
        this.AwayHandler = _.bind(function(presence){
            this.MqttClient.Publish(presence.Topic, presence.AwayValue, {retain: true});
        }, this);

        // Create a handler to invoke when presences are created or updated
        this.UpdateHandler = _.bind(function(presence){
            this.PresenceDatabase.DeleteCreate(presence, function(error, result) { });
        }, this);

        // Create a handler to invoke when a presences are deleted
        this.DeleteHandler = _.bind(function(presence){
            this.PresenceDatabase.Delete(presence, function(error, result){ });
        }, this);

        this.PresenceDatabase.ReadAll(_.bind(function(error, presences){

            // Add the presences from the database to the list of active presences
            // Note that they're added here prior to hooking up the handlers
            // so that they don't trigger updates or addes to be sent out
            if(presences){
                _.forEach(presences, _.bind(function(presence){
                    this.Presences.Add(presence);
                }, this));
            }
            
            // Add the handlers
            this.Presences.PresentHandler = this.PresentHandler;
            this.Presences.AwayHandler = this.AwayHandler;
            this.Presences.UpdateHandler = this.UpdateHandler;
            this.Presences.DeleteHandler = this.DeleteHandler;

            // Start the presence run to mark presences as away
            this.Presences.Run();
        }, this));
    }

    Publish(request, response){
        Logger.Log("app", "debug", "HttpToMqttController::Publish - Begin", request.body);
        let thrownError = null;
        try{

            // Figure out what to do with options to be sent to the Mqtt client
            let options = {};
            if(!_.isUndefined(request.body.Options) && !_.isNull(request.body.Options)){
                options = request.Options;
            }

            // Figure out what to do with the value to be sent to the Mqtt client
            let value = '';
            if(!_.isUndefined(request.body.Value) && !_.isNull(request.body.Value)){
                value = request.body.Value;
            }

            // Publish to the Mqtt client
            this.MqttClient.Publish(request.body.Topic, value, options);
        }
        catch(error){
            Logger.Log("app", "error", "HttpToMqttController::Publish - Error", error);
            thrownError = error;
        }

        // Send the response back to the requestor
        this.SendResponseFunc(response)(thrownError, {});
        Logger.Log("app", "debug", "HttpToMqttController::Publish - End");
    }

    Presence(request, response){
        Logger.Log("app", "debug", "HttpToMqttController::Presence - Begin", request.body);
        let thrownError = null;
        try{

            // Get the presence values from the request and put them into
            // a presence model
            let presenceJson = request.body;

            let presence = new PresenceModel();
            _.merge(presence, presenceJson);

            // Validate the presence, if not this will throw an error
            presence.Validate();

            // Add or update the presence, in turn this will invoke
            // the Mqtt publish if necessary
            this.Presences.Add(presence);
        }
        catch(error){
            Logger.Log("app", "error", "HttpToMqttController::Presence - Error", error);
            thrownError = error;
        }

        // Send the distance back to the requestor
        this.SendResponseFunc(response)(thrownError, {});
        Logger.Log("app", "debug", "HttpToMqttController::Presence - End");
    }

    DeleteExpiredPresences(request, response){
        Logger.Log("app", "debug", "HttpToMqttController::DeleteExpiredPresences - Begin", request.body);
        let thrownError = null;
        try{
            this.Presences.DeleteExpiring();
        }
        catch(error){
            Logger.Log("app", "error", "HttpToMqttController::DeleteExpiredPresences - Error", error);
            thrownError = error;
        }

        // Send the distance back to the requestor
        this.SendResponseFunc(response)(thrownError, {});
        Logger.Log("app", "debug", "HttpToMqttController::DeleteExpiredPresences - End");
    }

    Setup(){
        
        // Setup the route to read from the distance sensor
        this.SetupHandleRequest('/Publish', _.bind(this.Publish, this), 'POST');

        // Setup the route to read from the distance sensor
        this.SetupHandleRequest('/Presence', _.bind(this.Presence, this), 'POST');

        // Setup the route to read from the distance sensor
        this.SetupHandleRequest('/DeleteExpiredPresences', _.bind(this.DeleteExpiredPresences, this), 'POST');
    }
}