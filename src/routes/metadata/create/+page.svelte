<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { type MetadataProfile } from '$lib/models/metadata';
  import Button from '@smui/button';
  import Textfield from '@smui/textfield';
  import { logger } from 'loggisch';
  import type { Option } from '$lib/models/form';
  import Card, { Content } from '@smui/card';
  import MetadataSearchField from '$lib/components/MetadataSearchField.svelte';
  import CharacterCounter from '@smui/textfield/character-counter';
  import toast from 'svelte-french-toast';
  import { resolve } from '$app/paths';

  const t = $derived(page.data.t);
  let title = $state<string>('');
  let metadataProfile = $state<MetadataProfile>('ISO');
  let cloneMetadataId = $state<Option>();

  const allFieldsValid = $derived.by(() => {
    return title.length > 0 && metadataProfile.length;
  });

  const onCreateClick = async () => {
    const response = await fetch(page.url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        title,
        metadataProfile,
        cloneMetadataId: cloneMetadataId?.key
      })
    });

    if (response.ok) {
      const { metadataId } = await response.json();

      if (metadataId) {
        goto(resolve(`/metadata/${metadataId}`));
      } else {
        logger.error('No metadataId in response');
      }
    } else if (response.status === 409) {
      toast.error('Ein Datensatz mit diesem Titel existiert bereits.');
    } else {
      toast.error('Fehler beim Anlegen der Metadaten.');
      logger.error('Error creating metadata', await response.text());
    }
  };
</script>

<div class="create-metadata">
  <Card>
    <Content>
      <h1>{t('metadata_create.title')}</h1>
      <p>{t('metadata_create.intro')}</p>
      <div class={[title.length > 100 ? 'long-text' : '']}>
        <Textfield
          bind:value={title}
          label={t('metadata_create.fieldTitle')}
          required
          input$maxlength={250}
        >
          {#snippet helper()}
            <CharacterCounter>{title.length} / 250</CharacterCounter>
          {/snippet}
        </Textfield>
      </div>
      <p>{t('metadata_create.templateHint')}</p>
      <MetadataSearchField
        bind:value={cloneMetadataId}
        label={t('metadata_create.templateLabel')}
      />
      <Button variant="raised" onclick={onCreateClick} disabled={!allFieldsValid} type="button">
        {t('metadata_create.createButton')}
      </Button>
    </Content>
  </Card>
</div>

<style lang="scss">
  .create-metadata {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    gap: 1em;

    div.long-text {
      :global(.mdc-text-field-character-counter) {
        font-weight: bold;
        color: var(--mdc-theme-error);
      }
    }

    p {
      width: 80%;
      text-align: start;
      line-height: 1.5;
    }

    :global(.smui-card__content) {
      width: 30em;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1em;
    }

    :global(.mdc-text-field),
    :global(.mdc-select),
    :global(.mdc-menu) {
      width: 25em;
    }
  }
</style>
