const express = require('express');
const _ = require('lodash');
const Response = require('./../Response.js');
const Logger = require('./../../Logger.js');

module.exports = class GenericController{
    constructor(server){
        this.Server = server;
    }

    SetupHandleRequest(route, handler, requestType){
        Logger.Log("app", "debug", "GenericController::SetupHandleRequest - Begin", {route: route, handler: handler, requestType: requestType});

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
            Logger.Log("app", "debug", "GenericController::SetupHandleRequest - Begin Get");
            this.Server.WebServer.get(route, handleRequestFunc);
            Logger.Log("app", "debug", "GenericController::SetupHandleRequest - End Get");
        }
        else if(requestType == 'POST'){
            Logger.Log("app", "debug", "GenericController::SetupHandleRequest - Begin Post");
            this.Server.WebServer.post(route, handleRequestFunc);
            Logger.Log("app", "debug", "GenericController::SetupHandleRequest - End Post");
        }
        else{
            Logger.Log("app", "debug", "GenericController::SetupHandleRequest - Begin Post");
            this.Server.WebServer.post(route, handleRequestFunc);
            Logger.Log("app", "debug", "GenericController::SetupHandleRequest - End Post");
        }
        Logger.Log("app", "debug", "GenericController::SetupHandleRequest - End");
    }

    HandleRequest(request, response, handler){
        Logger.Log("app", "debug", "GenericController::HandleRequest - Begin", request.body);
        try{
            handler(request, response);
        }
        catch(error){
            Logger.Log("app", "error", "GenericController::HandleRequest - Error", error);
            this.SendResponse(error);
        }
        Logger.Log("app", "debug", "GenericController::HandleRequest - End");
    }

    SendResponseFunc(response){
        Logger.Log("app", "debug", "GenericController::SendResponseFunc - Begin");
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
            Logger.Log("app", "debug", "GenericController::SendResponseFunc - End");
        }, this);
    }

    SendResponse(error, data){
        Logger.Log("app", "debug", "GenericController::SendResponse - Begin", {error: error, data: data});
        // Sends a generic data and error response back to the client
        let errorResponse = this.GetErrorResponse(error);

        // If there's no data then set the data to a default value
        if(_.isUndefined(data) || _.isNull(data)){
            data = [];
        }

        // Set the data in the response
        errorResponse.Data = data;

        // Serialize the data out
        Logger.Log("app", "debug", "GenericController::SendResponse - End");
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