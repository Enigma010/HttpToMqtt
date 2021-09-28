const sqlite = require('sqlite3');
const _ = require('lodash');

const Generic = require('./Generic.js');
const PresenceModel = require('../Models/Presence.js');

module.exports = class Presence extends Generic{
    constructor(database){
        super(database, 
            {
                Create: 'insert into Presences (Id, Topic, PresentValue, AwayValue, LastHeartBeatTime, ExpirationInSeconds, CurrentPresenceValue, LastTransmitTime) values ($Id, $Topic, $PresentValue, $AwayValue, $LastHeartBeatTime, $ExpirationInSeconds, $CurrentPresenceValue, $LastTransmitTime)',
                Read: 'select * from Presences where Id = $Id',
                Update: 'update Presences set Topic = $Topic, PresentValue = $PresentValue, AwayValue = $AwayValue, LastHeartBeatTime = $LastHeartBeatTime, ExpirationInSeconds = $ExpirationInSeconds, CurrentPresenceValue = $CurrentPresenceValue, LastTransmitTime = $LastTransmitTime where Id = $Id',
                Delete: 'delete from Presences where Id = $Id',
                Setup: 'create table if not exists Presences (Id text not null, Topic text, PresentValue text, AwayValue text, LastHeartBeatTime text, ExpirationInSeconds int, CurrentPresenceValue text, LastTransmitTime text, primary key (Id))'
            }
        );
    }

    DeleteCreate(presence, callback){
        this.Delete(presence, _.bind(function(error){
            if(error){
                callback(error)
            }
            this.Create(presence, callback);
        }, this));
    }

    ReadAll(callback){
        this.ReadByQuery({}, "select * from Presences", _.bind(function (error, presencesData){
            if(error){
                callback(error, []);
            }
            let presences = [];
            _.forEach(presencesData, function(presenceData){
                var presence = new PresenceModel();
                _.merge(presence, presenceData);
                presence.LastHeartBeatTime = new Date(parseFloat(presence.LastHeartBeatTime));
                presence.LastTransmitTime = new Date(parseFloat(presence.LastTransmitTime));
                presences.push(presence);
            });
            callback(error, presences);
        }, this));
    }
}