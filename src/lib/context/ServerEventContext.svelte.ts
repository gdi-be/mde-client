import { SvelteSet } from 'svelte/reactivity';
import { getContext, setContext } from 'svelte';
import { invalidateAll } from '$app/navigation';

import { EventSource } from 'eventsource';

const CONTEXT_KEY = Symbol('SSE');

export type SseEvent = 'generic' | 'validation' | 'heartbeat';

export type SseEventData = {
  message: string;
  timestamp: string;
};

export type HeartbeatData = {} & SseEventData;

export type MetadataValidationStatus = 'RUNNING' | 'FINISHED' | 'FAILED';

export type MetadataValidationData = SseEventData & {
  status: MetadataValidationStatus;
  metadataId: string;
};

export type EventState = {
  generic: SseEventData[];
  heartbeat: HeartbeatData[];
  validation: MetadataValidationData[];
};

export type EventCallback<T = SseEvent> = T extends 'validation'
  ? (data: MetadataValidationData) => void
  : T extends 'heartbeat'
    ? (data: HeartbeatData) => void
    : (data: SseEventData) => void;

export type EventData<T = SseEvent> = T extends 'validation'
  ? MetadataValidationData
  : T extends 'heartbeat'
    ? HeartbeatData
    : SseEventData;

const createSseListener = () => {
  const eventState = $state<EventState>({
    generic: [],
    heartbeat: [],
    validation: []
  });

  let eventSource: EventSource | null = null;
  let isConnected = false;
  let connectionUrl: string | null = null;
  let tokenGetter: (() => string | undefined) | undefined;
  const subscribedEvents = new SvelteSet<SseEvent>();
  let reconnectAttempts = 0;

  const setSseContext = () => {
    setContext<EventState>(CONTEXT_KEY, eventState);
  };

  const getSseContext = () => {
    return getContext<EventState>(CONTEXT_KEY);
  };

  const connect = (url: string, getToken?: () => string | undefined) => {
    if (isConnected) {
      console.warn('[SSE] Already connected.');
      return;
    }

    connectionUrl = url;
    tokenGetter = getToken;
    isConnected = true;

    const initConnection = () => {
      const token = tokenGetter?.();
      const customHeaders: HeadersInit = {};

      if (token) {
        customHeaders['Authorization'] = `Bearer ${token}`;
      }

      eventSource = new EventSource(url, {
        fetch: (input, init) =>
          fetch(input, {
            ...init,
            headers: {
              ...init?.headers,
              ...customHeaders
            }
          })
      });

      eventSource.onopen = () => {
        reconnectAttempts = 0;
        console.log('[SSE] Connected');
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as SseEventData;
          eventState.generic.push(data);
        } catch (e) {
          console.error('[SSE] Invalid data for event type generic:', e);
        }
      };

      eventSource.onerror = async () => {
        reconnectAttempts += 1;

        if (reconnectAttempts === 1) {
          console.info('[SSE] Connection interrupted. Reconnecting in 3s…');
        } else {
          console.warn(`[SSE] Connection interrupted. Retry ${reconnectAttempts} in 3s…`);
        }

        eventSource?.close();
        isConnected = false;
        await invalidateAll();
        setTimeout(() => {
          if (connectionUrl) {
            connect(connectionUrl, tokenGetter);
          }
        }, 3000);
      };

      for (const eventName of subscribedEvents) {
        attachEventListener(eventName);
      }
    };

    initConnection();
  };

  const attachEventListener = (eventName: SseEvent) => {
    if (!eventSource) {
      return;
    }

    eventSource.addEventListener(eventName, (event) => {
      try {
        const data: EventData<typeof eventName> = JSON.parse(event.data);
        // TODO Add in backend?
        data.timestamp = new Date().toISOString();

        switch (eventName) {
          case 'validation':
            eventState.validation.push(data as MetadataValidationData);
            break;
          case 'heartbeat':
            eventState.heartbeat.push(data as HeartbeatData);
            break;
          default:
            eventState.heartbeat.push(data as SseEventData);
            break;
        }
      } catch (e) {
        console.error(`[SSE] Invalid data for event type ${eventName}:`, e);
      }
    });
  };

  const listenTo = (eventName: SseEvent) => {
    subscribedEvents.add(eventName);
    attachEventListener(eventName);
  };

  const disconnect = () => {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
      isConnected = false;
      connectionUrl = null;
      tokenGetter = undefined;

      eventState.generic = [];
      eventState.heartbeat = [];
      eventState.validation = [];
    }
  };

  return {
    setSseContext,
    getSseContext,
    connect,
    disconnect,
    listenTo
  };
};

export const sseContext = createSseListener();
