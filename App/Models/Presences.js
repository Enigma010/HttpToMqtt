const uuidv4 = require('uuid/v4');
const _ = require('lodash');

module.exports = class Presences{
    constructor(){
        this.Presences = [];
    }

    Run(){

        // Check for expired presences every second
        setInterval(_.bind(function(){
            this.CheckExpiration(); 
        }, this), 1000);
    }

    Add(presence){
        let foundPresence = null;

        // Go through the presences and look for any matching the topic sent in
        _.forEach(this.Presences, function(checkPresence){
            if(checkPresence.Topic == presence.Topic){
                foundPresence = checkPresence;
            }
        });

        // The variable added will signify that we need to publish again
        let update = false;
        if(!foundPresence){

            // We didn't find a presence add it to the list and mark it for publish
            foundPresence = presence;
            this.Presences.push(foundPresence);
            update = true;
        }
        else{
            if(foundPresence.PresentValue != presence.PresentValue || presence.HeartBeat){

                // We found the topic but the present value isn't what we have
                // do another publish, or if the presence is told to heartbeat
                update = true;
            }

            // Update all the properties on the found presence so if it has changed
            // values since the first publish that we have the most recent version
            foundPresence.Update(presence);
            if(!_.isUndefined(this.UpdateHandler) && (typeof this.UpdateHandler == 'function')){
                this.UpdateHandler(foundPresence);
            }
        }

        if(update && (!_.isUndefined(this.PresentHandler) && (typeof this.PresentHandler == 'function'))){

            // The presence was added or changed and there is a handler function to call when the
            // presence value changes so invoke it now
            this.PresentHandler(foundPresence);
        }
    }

    Delete(presence){
        for(let position = 0; position < this.Presences.length; position++){
            if(presence.Topic == this.Presences[position].Topic){
                if(!_.isUndefined(this.DeleteHandler) && typeof this.DeleteHandler == 'function'){
                    this.DeleteHandler(this.Presences[position]);
                }
                this.Presences.splice(position, 1);
                break;
            }
        }
    }

    CheckExpiration(){
        let now = Date.now();
        let expiring = [];

        _.forEach(this.Presences, function(checkPresence){
            
            // Subtract the last heart beat time with the current time and see if it's greater than the expiration in seconds
            if(Math.round((now - checkPresence.LastHeartBeatTime) / 1000) > checkPresence.ExpirationInSeconds){
                
                // The presence has expired add it to the list to remove
                expiring.push(checkPresence);
            }
        });

        _.forEach(expiring, _.bind(function(expired){
            
            // Check to see if we have an away handler and it's the appropriate type
            if(!_.isUndefined(this.AwayHandler) && typeof this.AwayHandler == 'function'){
                
                // Invoke the away handler for the expired presence
                this.AwayHandler(expired);
            }
            // Delete the expired presence from the internal store
            this.Delete(expired);
        }, this));
    }
}