import {createLogger, format, transports} from 'winston';

export const logger = createLogger({
	level: 'debug',
	format: format.combine(format.colorize(), format.simple()),
	transports: [
		new transports.File({filename: 'ink.log'})
	]
});
