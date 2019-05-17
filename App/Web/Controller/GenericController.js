const express = require('express');
const _ = require('lodash');
const Response = require('./../Response.js');

module.exports = class GenericController{
    constructor(server){
        this.Server = server;
    }

    SetupHandleRequest(route, handler, requestType){

        // Create an enclosure for the handler passed in bound to this context
        let handleFunc = _.bind(function(request, response){
            handler(request, response);
        }, this);

        // Create another enclosure to the handle request which will enclose the request
        // in a try catch block
        let handleRequestFunc = _.bind(function(request, response){
            this.HandleRequest(request, response, handleFunc);
        }, this);

        // Post the responses back to the client
        if(requestType == 'GET'){
            this.Server.get(route, handleRequestFunc);
        }
        else if(requestType == 'POST'){
            this.Server.post(route, handleRequestFunc);
        }
        else{
            this.Server.post(route, handleRequestFunc);
        }
    }

    HandleRequest(request, response, handler){
        try{
            handler(request, response);
        }
        catch(error){
            this.SendResponse(error);
        }
    }

    SendResponseFunc(response){
        return _.bind(function(error, data){
            // Sends a generic data and error response back to the client
            let errorResponse = this.GetErrorResponse(error);
            
            // If there's no data then set the data to a default value
            if(_.isUndefined(data) || _.isNull(data)){
                data = [];
            }

            // Set the data in the response
            errorResponse.Data = data;

            // Serialize the data out
            response.json(errorResponse);
        }, this);
    }

    SendResponse(error, data){
        // Sends a generic data and error response back to the client
        let errorResponse = this.GetErrorResponse(error);

        // If there's no data then set the data to a default value
        if(_.isUndefined(data) || _.isNull(data)){
            data = [];
        }

        // Set the data in the response
        errorResponse.Data = data;

        // Serialize the data out
        this.Response.json(errorResponse);
    }

    GetErrorResponse(error){   
        let response = null;
        if(error === null){
            response = new Response();
        }
        else{
            response = new Response(1, error);
        }
        return response;
    }
}