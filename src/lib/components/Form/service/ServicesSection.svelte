<script lang="ts">
  import { page } from "$app/stores";
  import IconButton from "@smui/icon-button";
  import { getValue } from "../FormContext.svelte";
  import type { Service } from "$lib/models/metadata";
  import ServiceForm from "./ServiceForm.svelte";
  import { invalidateAll } from "$app/navigation";
  import Checkmark from "../Checkmark.svelte";

  type Tab = {
    title: string;
    id: string;
  };

  const KEY = 'isoMetadata.services';

  let initialServices = getValue<Service[]>(KEY);

  let services = $state(initialServices || []);
  let tabs = $derived<Tab[]>(services.map((service) => {
    const titlePrefix = service.serviceType === 'WMS' || service.serviceType === 'WMTS' ? '🗺️ ' : '🗃️ ';
    return {
      title: titlePrefix + (service.title || service.serviceIdentification)!,
      id: service.serviceIdentification!
    };
  }));
  let activeTab: string = $state(initialServices?.[0].serviceIdentification || '');
  let activeService = $derived(services.find(service => service.serviceIdentification === activeTab));

  let visibleCheckmarks = $state<Record<string, boolean>>({});

  const persistServices = async (id: string) => {
    // TODO: fix setting of service type
    const response = await fetch($page.url, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        key: KEY,
        value: services
      })
    });
    if (response.ok) {
      visibleCheckmarks[id] = true;
      invalidateAll();
    }
  }

  function addService() {
    const serviceIdentification = `new_service_${services.length + 1}`;
    services = [...services, {
      serviceIdentification: serviceIdentification
    }];
    activeTab = serviceIdentification;
  }

  function removeService(id: string) {
    services = services.filter(service => service.serviceIdentification !== id);
    if (activeTab === id) {
      activeTab = services[0].serviceIdentification || '';
    }
  }

  function updateService(id: string, newService: Service) {
    services = services.map(service => {
      if (service.serviceIdentification === id) {
        return newService;
      }
      return service;
    });
    persistServices(id);
  }

</script>

<nav class="tabs">
  {#each tabs as tab}
    <div
      class="tab-container"
      class:active={activeTab === tab.id}
    >
      <button
        class="tab"
        onclick={() => (activeTab = tab.id)}
      >
        {tab.title}
      </button>
      {#if visibleCheckmarks[tab.id]}
        <Checkmark
          bind:running={visibleCheckmarks[tab.id]}
        />
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
    title="Kontakt hinzufügen"
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
          updateService(activeService.serviceIdentification!, newService);
        }}
      />
    </span>
  {/if}
</div>

<style lang="scss">
  .tabs {
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem;
  }

  .tab-container {
    display: flex;
    align-items: center;
    position: relative;
    background-color: #f0f0f0;
    border-bottom: 3px solid transparent;
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
      border-color: #0078d7;
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
  }
</style>
