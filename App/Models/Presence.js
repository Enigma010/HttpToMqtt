const uuidv4 = require('uuid/v4');
const _ = require('lodash');

const Generic = require('./Generic.js');

module.exports = class Presence{
    constructor(id){

        // Assign an ID if not specified
        Generic.AddGuidId(this, id);
    }

    Update(presence){

        // Push the values of a different presence into this one
        this.PresentValue = presence.PresentValue;
        this.AwayValue = presence.AwayValue;
        this.ExpirationInSeconds = presence.ExpirationInSeconds;
        this.HeartBeat = presence.HeartBeat;
        
        // Update the last heart beat time to now
        this.LastHeartBeatTime = new Date();
    }

    SetDefaults(){
        
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
    }

    Validate(){
        
        // Set the defaults before we try to validate
        this.SetDefaults();
        
        // Topic is required, if it's not here throw and error
        if(!this.Topic){
            let error = "Topic is required";
            throw error;
        }
    }
}