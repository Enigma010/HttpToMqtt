const log4js = require("log4js");

module.exports = class Logger{
    static Loggers = [];
    static IsSetup = false;
    static Level = '';
    static LogFileName = '';
    
    static Log(name, logType, msg, obj){
        this.Setup();
        let msgObjStr = JSON.stringify(this.LogMsgObj(msg, obj));
        let logger = this.Logger(name);
        switch(logType){
            case "trace":
                logger.trace(msgObjStr);
                break;
            case "info":
                logger.info(msgObjStr);
                break;
            case "warn":
                logger.warn(msgObjStr);
                break;
            case "error":
                logger.error(msgObjStr);
                break;
            case "fatal":
                logger.fatal(msgObjStr);
                break;
            case "debug":
                logger.debug(msgObjStr);
                break;
            default:
                logger.trace(msgObjStr);
                break;
        }
    }

    static LogMsgObj(msg, obj){
        var msgObj = {};
        if(msg){
            msgObj.Msg = msg;
        }
        if(obj){
            msgObj.Obj = obj;
        }
        return msgObj;
    }

    static Logger(name){
        this.Setup();
        if(this.Loggers[name]){
            this.Loggers[name].level = this.Level;
            return this.Loggers[name];
        }
        this.Loggers[name] = log4js.getLogger(name);
        this.Loggers[name].level = this.Level;
        return this.Loggers[name];
    }

    static Setup(){
        if(this.IsSetup){
            return;
        }
        log4js.configure({
            appenders: { app: { type: "file", filename: this.LogFileName, maxLogSize: 10485760, backups: 3, compress: true } },
            categories: { default: { appenders: ["app"], level: "error" } }
        });
        this.IsSetup = true;
    }
}