import { getContext, setContext } from 'svelte';

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

export const eventState = $state<EventState>({
  generic: [],
  heartbeat: [],
  validation: []
});

const createSseListener = () => {
  let eventSource: EventSource | null = null;
  let isConnected = false;

  const setSseContext = () => {
    setContext<EventState>(CONTEXT_KEY, eventState);
  };

  const getSseContext = () => {
    return getContext<EventState>(CONTEXT_KEY);
  };

  const connect = (url: string) => {
    if (isConnected) {
      console.warn('[SSE] Already connected.');
      return;
    }

    isConnected = true;

    const initConnection = () => {
      eventSource = new EventSource(url);

      eventSource.onopen = () => {
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

      eventSource.onerror = () => {
        console.warn('[SSE] Connection lost. Retrying in 3s…');
        eventSource?.close();
        setTimeout(initConnection, 3000);
      };
    };

    initConnection();
  };

  const listenTo = (eventName: SseEvent) => {
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

  const disconnect = () => {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
      isConnected = false;

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
