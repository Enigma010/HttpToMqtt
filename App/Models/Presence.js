const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

const Generic = require('./Generic.js');
const Logger = require('../Logger.js');

module.exports = class Presence{
    constructor(id){

        // Assign an ID if not specified
        Generic.AddGuidId(this, id);
    }

    Update(presence){
        Logger.Log("app", "debug", "Presence::Update - Begin", {this: this, presence: presence});
        // Push the values of a different presence into this one
        this.PresentValue = presence.PresentValue;
        this.AwayValue = presence.AwayValue;
        this.ExpirationInSeconds = presence.ExpirationInSeconds;
        this.HeartBeat = presence.HeartBeat;
        
        // Update the last heart beat time to now
        this.LastHeartBeatTime = new Date();
        Logger.Log("app", "debug", "Presence::Update - End", {this: this, presence: presence});
    }

    SetDefaults(){
        Logger.Log("app", "debug", "Presence::SetDefaults - Begin", {this: this});
        // Set the default values for any property that wasn't specified or is inaccurate
        if(_.isUndefined(this.PresentValue) || _.isNull(this.PresentValue)){
            this.PresentValue = 1;
        }
        if(_.isUndefined(this.AwayValue) || _.isNull(this.AwayValue)){
            this.AwayValue = 0;
        }
        if(_.isUndefined(this.LastHeartBeatTime) || _.isNull(this.LastHeartBeatTime)){
            this.LastHeartBeatTime = new Date();
        }
        if(_.isUndefined(this.ExpirationInSeconds) || _.isNull(this.ExpirationInSeconds) || this.ExpirationInSeconds < 1){
            this.ExpirationInSeconds = 60;
        }
        Logger.Log("app", "debug", "Presence::SetDefaults - End", {this: this});
    }

    Validate(){
        Logger.Log("app", "debug", "Presence::Validate - Begin", {this: this});
        // Set the defaults before we try to validate
        this.SetDefaults();
        
        // Topic is required, if it's not here throw and error
        if(!this.Topic){
            let error = "Topic is required";
            Logger.Log("app", "error", "Presence::Validate - Error", {error: error});
            throw error;
        }
        Logger.Log("app", "debug", "Presence::Validate - End", {this: this});
    }
}