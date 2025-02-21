import { env } from '$env/dynamic/private';
import type { Handle } from '@sveltejs/kit';
import handleAuth from '$lib/auth/handle';
import { setLogLevel, type LogLevel } from 'loggisch';

export const handle: Handle = handleAuth;

setLogLevel((env.CLIENT_LOG_LEVEL as LogLevel) || 'info');
