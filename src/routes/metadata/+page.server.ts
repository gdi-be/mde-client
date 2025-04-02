import { error, redirect } from '@sveltejs/kit';
import { getAccessToken } from '$lib/auth/cookies';
import { queryMetadata } from '$lib/api/metadata';
import type { PageableProps, QueryConfig } from '$lib/models/api.js';

export async function load({ cookies, url }) {
  const page = Number(url.searchParams.get('page') || 1);
  const size = Number(url.searchParams.get('size') || 20);
  const query = url.searchParams.get('query') || undefined;
  const statusfilter = url.searchParams.get('statusfilter') || undefined;

  let pagingOptions: PageableProps | undefined;
  if (page && size) {
    pagingOptions = {
      page: Number(page) - 1,
      size: Math.min(Number(size), 100)
    };
  }

  const token = await getAccessToken(cookies);
  if (!token) return redirect(302, '/login');

  const queryConfig: QueryConfig = {
    searchTerm: query || ''
  };

  if (statusfilter?.includes('ASSIGNED_TO_ME')) {
    queryConfig.isAssignedToMe = true;
  }

  if (statusfilter?.includes('TEAM_MEMBER')) {
    queryConfig.isTeamMember = true;
  }

  if (statusfilter?.includes('READY_FOR_RELEASE')) {
    queryConfig.isValid = true;
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
    queryConfig.assignedRoles = roleFilter;
  }

  const queryResponse = await queryMetadata(token, queryConfig, pagingOptions);
  if (queryResponse) return { queryResponse };

  error(404, 'Not found');
}
