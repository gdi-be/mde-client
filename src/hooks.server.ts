import { env } from '$env/dynamic/private';
import type { Handle } from '@sveltejs/kit';
import handleAuth from '$lib/auth/handle';
import { i18n } from '$lib/i18n';
import { sequence } from '@sveltejs/kit/hooks';
import { setLogLevel, type LogLevel } from 'loggisch';

const handleParaglide: Handle = i18n.handle();

export const handle: Handle = sequence(handleAuth, handleParaglide);

setLogLevel(env.CLIENT_LOG_LEVEL as LogLevel || 'info');
