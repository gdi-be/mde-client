import { error } from '@sveltejs/kit';
import { getAccessToken, parseToken } from '$lib/auth/cookies.js';
import { parse as parseYaml } from 'yaml';
import { parse } from 'marked';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies, params }) {
  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  const {
    fieldKey
  } = params;

  if (!fieldKey) return error(404, 'Not Found');

  const helpConfigFile = Bun.file('/data/codelists/help/config.yaml');
  const helpConfig = await helpConfigFile.text();
  const config = parseYaml(helpConfig);

  if (!config) return error(404, 'Not Found');

  const [topic, field] = fieldKey.split('.');
  const fieldConfig = config[topic]?.[field];

  if (!fieldConfig) return error(404, 'Not Found');

  const helpFileConfigs = Object.entries(fieldConfig);
  const userRoles = parseToken(token).realm_access.roles;
  let helpFilePath = `/data/codelists/help/${fieldConfig.default}`;

  for (const [role, path] of helpFileConfigs) {
    if (role === 'Administrator' && userRoles.includes('Administrator')) {
      helpFilePath = `/data/codelists/help/${path}`;
      break;
    };
    if (role === 'Editor' && userRoles.includes('Editor')) {
      helpFilePath = `/data/codelists/help/${path}`;
      break;
    };
    if (role === 'QualityAssurance' && userRoles.includes('QualityAssurance')) {
      helpFilePath = `/data/codelists/help/${path}`;
      break;
    };
    if (role === 'DataOwner' && userRoles.includes('DataOwner')) {
      helpFilePath = `/data/codelists/help/${path}`;
      break;
    };
  }

  if (!helpFilePath) return error(404, 'Not Found');

  const helpFile = Bun.file(helpFilePath);
  const helpMarkdown = await helpFile.text();
  const help = await parse(helpMarkdown);

  return new Response(help, {
    headers: {
      'Content-Type': 'text/html'
    }
  });
}
