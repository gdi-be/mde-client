<script lang="ts">
  import IconButton from "@smui/icon-button";
  import { getValue } from "../FormContext.svelte";
  import type { Service } from "$lib/models/metadata";
  import ServiceForm from "./ServiceForm.svelte";

  const KEY = 'isoMetadata.services';

  let initialServices = getValue<Service[]>(KEY);

  let services = $state(initialServices || []);
  let tabs = $derived(services.map((service) => {
    return {
      title: service.title || service.serviceIdentification,
      id: service.serviceIdentification
    };
  }));
  let activeTab: string = $state('');
  let activeService = $derived(services.find(service => service.serviceIdentification === activeTab));

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
        onclick={() => (activeTab = tab.id!)}
      >
        {tab.title}
      </button>
      {#if services.length > 1}
        <IconButton
          class="material-icons"
          onclick={() => removeService(tab.id!)}
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

    &:hover {
      background-color: #f0f0f0;
    }

    &.active {
      font-weight: bold;
      border-bottom: 2px solid #0078d7;
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
