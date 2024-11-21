import type { Handle } from '@sveltejs/kit';
import handleAuth from '$lib/auth/handle';
import { i18n } from '$lib/i18n';
import { sequence } from '@sveltejs/kit/hooks';

const handleParaglide: Handle = i18n.handle();

export const handle: Handle = sequence(handleAuth, handleParaglide);
