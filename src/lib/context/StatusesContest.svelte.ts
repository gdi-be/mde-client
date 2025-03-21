import { setContext } from 'svelte';
import type { Token } from '$lib/models/keycloak';
import type { Option } from '$lib/models/form';
import { getHighestRole } from '$lib/util';

export const STATUSES_CONTEXT = Symbol('statuses');

export type StatusesState = {
  statuses: Option[];
};

const defaultState = {
  statuses: [{
    key: 'ASSIGNED_TO_ME',
    label: 'Mir zugewiesen'
  }, {
    key: 'ASSIGNED_TO_TEAM',
    label: 'Ich bin im Team'
  }, {
    key: 'READY_FOR_RELEASE',
    label: 'Geprüft'
  }, {
    key: 'ROLE_DataOwner',
    label: 'Datenhaltende Stelle'
  }, {
    key: 'ROLE_Editor',
    label: 'Redakteur'
  },{
    key: 'ROLE_QualityAssurance',
    label: 'Qualitätssicherung'
  }]
};

const statutesState = $state<{ state: StatusesState }>({ state: defaultState });

export function initializePopconfimContext() {
  setContext(STATUSES_CONTEXT, statutesState);
}

export function getStatusesState() {
  return statutesState;
}

export function getAvailableStatuses(token: Token) {
  const highestRole = getHighestRole(token);
  return statutesState.state.statuses.filter(status => {
    if (highestRole === 'Administrator') {
      return true;
    } else if (highestRole === 'Editor') {
      return !['ROLE_QualityAssurance', 'ROLE_DataOwner'].includes(status.key);
    } else if (highestRole === 'QualityAssurance') {
      return !['ROLE_Editor', 'ROLE_DataOwner'].includes(status.key);
    } else if (highestRole === 'DataOwner') {
      return !['ROLE_Editor', 'ROLE_QualityAssurance', 'READY_FOR_RELEASE'].includes(status.key);
    }
  });
}

export function getStatusName(key: string) {
  return statutesState.state.statuses.find(status => status.key === key)?.label;
}
