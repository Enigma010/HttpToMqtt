module.exports = class Error{
    constructor(errorCode, message){
        this.ErrorCode = errorCode;
        this.Message = message;
    }
}