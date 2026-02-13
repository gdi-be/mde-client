import { env } from '$env/dynamic/public';
import { setLogLevel, type LogLevel } from 'loggisch';

setLogLevel((env.PUBLIC_BROWSER_LOG_LEVEL as LogLevel) || 'info');
