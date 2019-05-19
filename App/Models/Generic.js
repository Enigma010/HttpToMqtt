const uuidv4 = require('uuid/v4');
const _ = require('lodash');

module.exports = class Generic{
    static AddGuidId(model, id){
        model.Id = id;
        if(!model.hasOwnProperty('Id') || _.isNull(model.Id) || _.isUndefined(model.Id)){
            model.Id = uuidv4();
        }
    }

    static ChangeId(model, idName){
        if(!idName){
            idName = 'Id';
        }
        if(model.hasOwnProperty(idName)){
            delete model[idName];
        }
        model[idName] = uuidv4();
    }
}