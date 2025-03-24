import { error, redirect } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies';
import { searchForMetadata } from '$lib/api/metadata';
import type { SearchConfig } from '../../lib/models/api.js';

export async function load({ cookies, url }) {
  const page = Number(url.searchParams.get('page') || 1);
  const size = Number(url.searchParams.get('size') || 10);
  const query = url.searchParams.get('query') || undefined;
  const statusfilter = url.searchParams.get('statusfilter') || undefined;

  const token = await getAccessToken(cookies);
  if (!token) return redirect(302, '/login');

  const searchConfig: SearchConfig = {
    searchTerm: query || '',
    offset: (page - 1) * size,
    limit: size
  };

  if (statusfilter?.includes('ASSIGNED_TO_ME')) {
    searchConfig.isAssignedToMe = true;
  }

  if (statusfilter?.includes('TEAM_MEMBER')) {
    searchConfig.isTeamMember = true;
  }

  if (statusfilter?.includes('READY_FOR_RELEASE')) {
    searchConfig.isValid = true;
  }

  if (statusfilter?.includes('ROLE')) {
    const roleFilter = [];
    if (statusfilter?.includes('ROLE_DataOwner')) {
      roleFilter.push('DataOwner');
    }
    if (statusfilter?.includes('ROLE_Editor')) {
      roleFilter.push('Editor');
    }
    if (statusfilter?.includes('ROLE_QualityAssurance')) {
      roleFilter.push('QualityAssurance');
    }
    searchConfig.assignedRoles = roleFilter;
  }

  // TODO get total size of results

  const searchResponse = await searchForMetadata(token, searchConfig);
  if (searchResponse) return { searchResponse };

  error(404, 'Not found');
}
