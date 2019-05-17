
const Error = require('./Error.js');

module.exports = class Response{
    constructor(errorCode, message, data){
        this.Response = {};
        this.Response.Data = data;
        this.Response.Error = new Error(errorCode, message);
    }
}