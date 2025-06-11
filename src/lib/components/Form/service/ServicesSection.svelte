<script lang="ts">
  import IconButton from '@smui/icon-button';
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import type { Service } from '$lib/models/metadata';
  import ServiceForm from './ServiceForm.svelte';
  import Checkmark from '../Checkmark.svelte';
  import FieldHint from '../FieldHint.svelte';

  type Tab = {
    title: string;
    id: string;
  };

  const KEY = 'isoMetadata.services';

  let initialServices = getValue<Service[]>(KEY);

  let services = $state(initialServices || []);

  let tabs = $derived<Tab[]>(
    services.map((service) => {
      const mappingService = service.serviceType === 'WMS' || service.serviceType === 'WMTS';
      const titlePrefix = mappingService ? '🌎 ' : '📥 ';

      return {
        title: titlePrefix + (service.title || service.serviceIdentification),
        id: service.serviceIdentification
      };
    })
  );
  let activeTab: string = $state(initialServices?.[0]?.serviceIdentification || '');
  let activeService = $derived(
    services.find((service) => service.serviceIdentification === activeTab)
  );

  let visibleCheckmarks = $state<Record<string, boolean>>({});

  const persistServices = async (id: string) => {
    const response = await persistValue(KEY, services);
    if (response.ok) {
      visibleCheckmarks[id] = true;
    }
    return response;
  };

  function addService() {
    const serviceIdentification = crypto.randomUUID();
    services = [
      ...services,
      {
        serviceIdentification: serviceIdentification,
        title: 'Neuer Dienst' + services.length
      }
    ];
    activeTab = serviceIdentification;
  }

  function removeService(id: string) {
    services = services.filter((service) => service.serviceIdentification !== id);
    if (activeTab === id) {
      activeTab = services[0].serviceIdentification || '';
    }
    persistValue(KEY, services);
  }

  async function updateService(id: string, newService: Service) {
    if (!id || !newService) {
      return Promise.reject('Invalid parameters');
    }
    services = services.map((service) => {
      if (service.serviceIdentification === id) {
        return newService;
      }
      return service;
    });
    return persistServices(id);
  }

  $effect(() => {
    const el = document.getElementById(activeTab);
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  });
</script>

<FieldHint fieldConfig={getFieldConfig('isoMetadata.services')} />
<nav class="tabs">
  {#each tabs as tab}
    <div class="tab-container" class:active={activeTab === tab.id}>
      <button id={tab.id} class="tab" title={tab.title} onclick={() => (activeTab = tab.id)}>
        {tab.title}
      </button>
      {#if visibleCheckmarks[tab.id]}
        <Checkmark bind:running={visibleCheckmarks[tab.id]} />
      {/if}
      {#if services.length > 1 && !visibleCheckmarks[tab.id]}
        <IconButton
          class="material-icons"
          onclick={() => removeService(tab.id)}
          size="button"
          title="Dienst entfernen"
        >
          delete
        </IconButton>
      {/if}
    </div>
  {/each}
  <IconButton
    class="material-icons"
    onclick={() => addService()}
    size="button"
    title="Dienst hinzufügen"
  >
    add
  </IconButton>
</nav>
<div class="content">
  {#if activeService}
    <span>
      <ServiceForm
        service={activeService}
        onChange={(newService) => {
          return updateService(activeService?.serviceIdentification, newService);
        }}
      />
    </span>
  {/if}
</div>

<style lang="scss">
  nav.tabs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.25em;
  }

  .tab-container {
    display: flex;
    align-items: center;
    position: relative;
    background-color: #f0f0f0;
    border-radius: var(--mdc-shape-medium, 4px) var(--mdc-shape-medium, 4px) 0 0;

    :global(svg) {
      margin: 10px;
    }

    &:hover {
      background-color: #f0f0f0;
      border-color: var(--mdc-theme-primary);
    }

    &.active {
      font-weight: bold;
      background-color: var(--primary-90);
    }
  }

  .tab {
    padding: 0.5rem 1rem;
    background-color: transparent;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    border-radius: 5px;
    transition: background-color 0.3s;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 200px;
    overflow: hidden;
  }
</style>
