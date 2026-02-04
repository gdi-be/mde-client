import { getContext, setContext } from 'svelte';
import type { Token } from '$lib/models/keycloak';
import type { Option } from '$lib/models/form';
import { getHighestRole } from '$lib/util';

export const STATUSES_CONTEXT = Symbol('statuses');

export type StatusesState = {
  statuses: Option[];
};

const defaultState = {
  statuses: [
    {
      key: 'ASSIGNED_TO_ME',
      label: 'zu bearbeiten'
    },
    {
      key: 'TEAM_MEMBER',
      label: 'Meine Metadaten'
    },
    {
      key: 'READY_FOR_RELEASE',
      label: 'Geprüft'
    },
    {
      key: 'ROLE_MdeDataOwner',
      label: 'Datenhaltende Stelle'
    },
    {
      key: 'ROLE_MdeEditor',
      label: 'Redaktion'
    },
    {
      key: 'ROLE_MdeQualityAssurance',
      label: 'Qualitätssicherung'
    }
  ]
};

export function initializeStatusesContext() {
  const statutesState = $state<{ state: StatusesState }>({ state: defaultState });
  setContext(STATUSES_CONTEXT, statutesState);
}

export function getAvailableStatuses(token: Token) {
  const statutesState = getContext<{ state: StatusesState }>(STATUSES_CONTEXT);
  if (!token || !statutesState) return [];
  const highestRole = getHighestRole(token);
  return statutesState.state.statuses.filter((status) => {
    if (highestRole === 'MdeAdministrator') {
      return true;
    } else if (highestRole === 'MdeEditor') {
      return !['ROLE_MdeQualityAssurance', 'ROLE_MdeDataOwner'].includes(status.key);
    } else if (highestRole === 'MdeQualityAssurance') {
      return !['ROLE_MdeEditor', 'ROLE_MdeDataOwner'].includes(status.key);
    } else if (highestRole === 'MdeDataOwner') {
      return ![
        'ROLE_MdeEditor',
        'ROLE_MdeQualityAssurance',
        'ROLE_MdeDataOwner',
        'READY_FOR_RELEASE'
      ].includes(status.key);
    }
  });
}

export function getStatusName(key: string) {
  const statutesState = getContext<{ state: StatusesState }>(STATUSES_CONTEXT);
  if (!key || !statutesState) return [];
  return statutesState.state.statuses.find((status) => status.key === key)?.label;
}
