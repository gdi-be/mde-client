<script lang="ts">
  import type { DownloadInfo } from '$lib/models/metadata';
  import IconButton from '@smui/icon-button';
  import Checkmark from '../Checkmark.svelte';
  import DownloadTitle_68 from './Field/DownloadTitle_68.svelte';
  import DownloadFiletype_69 from './Field/DownloadFiletype_69.svelte';
  import DownloadHref_70 from './Field/DownloadHref_70.svelte';
  import DownloadFilesize_71 from './Field/DownloadFilesize_71.svelte';

  type Tab = {
    title: string;
  };

  export type DownloadFormProps = {
    value?: DownloadInfo[];
    onChange?: (downloads: DownloadInfo[]) => void;
  };

  let { value: initialDownloads, onChange = () => {} }: DownloadFormProps = $props();

  let downloads = $state(initialDownloads || []);
  let tabs = $derived<Tab[]>(
    downloads.map((download) => {
      return {
        title: download.title || 'Unbekannter Download'
      };
    })
  );

  let activeTabIndex: number | undefined = $state(initialDownloads?.length ? 0 : undefined);
  let activeDownload = $derived(activeTabIndex ? downloads[activeTabIndex] : downloads[0]);
  let visibleCheckmarks = $state<Record<string, boolean>>({});

  function addDownload() {
    const title = 'Neuer Download' + downloads.length;
    downloads = [
      ...downloads,
      {
        title
      }
    ];
    activeTabIndex = downloads.length - 1;
  }

  function removeDownload(index: number) {
    downloads = downloads.filter((_, i) => i !== index);
    if (activeTabIndex === index) {
      activeTabIndex = downloads.length - 1;
    }
    onChange(downloads);
  }

  function set(key: string, value: DownloadInfo[keyof DownloadInfo]) {
    downloads = downloads.map((download, i) => {
      if (i === activeTabIndex) {
        return {
          ...download,
          [key]: value
        };
      }
      return download;
    });
    onChange(downloads);
  }
</script>

<fieldset class="downloads-form">
  <legend>Downloads</legend>
  <nav>
    {#each tabs as tab, i}
      <div class="tab-container" class:active={activeTabIndex === i}>
        <button id={tab.title} class="tab" title={tab.title} onclick={() => (activeTabIndex = i)}>
          {tab.title}
        </button>
        {#if visibleCheckmarks[tab.title]}
          <Checkmark bind:running={visibleCheckmarks[tab.title]} />
        {/if}
        <IconButton
          class="material-icons"
          onclick={() => removeDownload(i)}
          size="button"
          title="Download entfernen"
        >
          delete
        </IconButton>
      </div>
    {/each}
    <IconButton
      class="material-icons"
      onclick={() => addDownload()}
      size="button"
      title="Download hinzufügen"
    >
      add
    </IconButton>
  </nav>
  <div class="content">
    {#if activeTabIndex !== undefined}
      <DownloadTitle_68 value={activeDownload?.title} onChange={(title) => set('title', title)} />
      <DownloadFiletype_69 value={activeDownload?.type} onChange={(type) => set('type', type)} />
      <DownloadHref_70 value={activeDownload?.href} onChange={(href) => set('href', href)} />
      <DownloadFilesize_71
        value={activeDownload?.fileSize}
        onChange={(fileSize) => set('fileSize', fileSize)}
      />
    {/if}
  </div>
</fieldset>

<style lang="scss">
  fieldset.downloads-form {
    flex: 1;
    border-radius: 0.25em;

    > legend {
      font-size: 1.5em;
    }

    nav {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.25em;
    }

    .content {
      display: flex;
      flex-direction: column;
      padding-top: 1em;
      gap: 1em;

      :global(.text-input),
      :global(.number-input) {
        border: none;
        background-color: rgba(244, 244, 244, 0.7);
      }

      :global(.text-input > legend),
      :global(.number-input > legend) {
        font-size: 1.2em;
        background-color: white;
        border-radius: 0.25em;
        padding: 0 0.25em;
      }
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
      white-space: nowrap;
      text-overflow: ellipsis;
      max-width: 200px;
      overflow: hidden;
    }
  }
</style>
