import { error } from '@sveltejs/kit';
import { getAccessToken, parseToken } from '$lib/auth/cookies.js';
import { parse as parseYaml } from 'yaml';
import { parse } from 'marked';
import { getNestedValue } from '$lib/util.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies, params }) {
  const token = await getAccessToken(cookies);
  if (!token) return error(401, 'Unauthorized');

  const { fieldKey } = params;

  if (!fieldKey) return error(404, 'Not Found');

  const helpConfigFile = Bun.file('/data/codelists/help/config.yaml');
  const helpConfig = await helpConfigFile.text();
  const config = parseYaml(helpConfig);

  if (!config) return new Response(null, { status: 204 });

  const fieldConfig = getNestedValue(config, fieldKey);

  if (!fieldConfig) return new Response(null, { status: 204 });

  const helpFileConfigs = Object.entries(fieldConfig);
  const userRoles = parseToken(token).realm_access.roles;
  let helpFilePath = `/data/codelists/help/${fieldConfig.default}`;

  for (const [role, path] of helpFileConfigs) {
    if (role === 'MdeAdministrator' && userRoles.includes('MdeAdministrator')) {
      helpFilePath = `/data/codelists/help/${path}`;
      break;
    }
    if (role === 'MdeEditor' && userRoles.includes('MdeEditor')) {
      helpFilePath = `/data/codelists/help/${path}`;
      break;
    }
    if (role === 'MdeQualityAssurance' && userRoles.includes('MdeQualityAssurance')) {
      helpFilePath = `/data/codelists/help/${path}`;
      break;
    }
    if (role === 'MdeDataOwner' && userRoles.includes('MdeDataOwner')) {
      helpFilePath = `/data/codelists/help/${path}`;
      break;
    }
  }

  if (!helpFilePath) return new Response(null, { status: 204 });

  try {
    const helpFile = Bun.file(helpFilePath);
    const helpMarkdown = await helpFile.text();
    const help = await parse(helpMarkdown);
    return new Response(help, {
      headers: {
        'Content-Type': 'text/html'
      }
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e.code === 'ENOENT') {
      return error(404, `Configured help file not found: ${helpFilePath}`);
    }
  }

}
