import { createLogger,  format, transports } from "winston";
const logger = createLogger({
    transports:[
        new transports.Console(),
        new transports.File({
            level: 'info',
            filename: 'AllResponse.log'
        }),
        new transports.Console(),
        new transports.File({
            level: 'user',
            filename: 'userStatus.log'
        }),
    ],
    format: format.combine(
        format.json(),
        format.timestamp(),
        format.metadata(),
        format.prettyPrint()
    ),
        
})
export default logger;