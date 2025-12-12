<script lang="ts">
  /* eslint-disable svelte/no-at-html-tags */
  import Textfield from '@smui/textfield';
  import type { Comment } from '$lib/models/metadata';
  import Paper from '@smui/paper';
  import CharacterCounter from '@smui/textfield/character-counter';
  import IconButton, { Icon } from '@smui/icon-button';
  import { page } from '$app/state';
  import { invalidateAll } from '$app/navigation';
  import { getContext, onMount } from 'svelte';
  import { popconfirm } from '$lib/context/PopConfirmContext.svelte';
  import { FORMSTATE_CONTEXT, type FormState } from '$lib/context/FormContext.svelte';
  import { toast } from 'svelte-french-toast';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';
  import Dialog, { Actions, Content, Title } from '@smui/dialog';
  import Button, { Label } from '@smui/button';

  const formState = getContext<FormState>(FORMSTATE_CONTEXT);
  const metadata = $derived(formState.metadata);

  const token = $derived(getAccessToken());

  let value = $state('');
  let comments = $derived<Comment[]>(metadata?.clientMetadata?.comments as Comment[]);
  let myUserId = $derived(token?.sub);
  let inputRows = $derived(Math.min(value.split('\n').length, 4));
  let helpActive = $state(false);

  onMount(() => {
    scrollToBottom();
  });

  const getHelpMarkdown = async () => {
    const response = await fetch(`/help/clientMetadata.comments`);
    if (!response.ok) {
      toast.error('Fehler beim Abrufen der Hilfe');
      return Promise.reject('Failed to fetch help markdown');
    }
    return response.text();
  };

  async function sendComment() {
    const metadataId = metadata?.metadataId;
    const url = `${page.url.origin}/metadata/${metadataId}/comment`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        text: value
      })
    });

    if (!response.ok) {
      toast.error('Fehler beim Senden des Kommentars');
      return;
    }

    value = '';
    await invalidateAll();
    scrollToBottom();
  }

  async function onDelete(id: string, evt: MouseEvent) {
    const targetEl = evt.currentTarget as HTMLElement;
    evt.preventDefault();
    popconfirm(
      targetEl,
      async () => {
        const metadataId = metadata?.metadataId;
        const url = `${page.url.origin}/metadata/${metadataId}/comment`;
        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            id
          })
        });

        if (!response.ok) {
          toast.error('Fehler beim Löschen des Kommentars');
          return;
        }

        invalidateAll();
      },
      {
        text: 'Möchten Sie diesen Kommentar wirklich löschen?',
        confirmButtonText: 'Löschen'
      }
    );
  }

  function isDeletable(comment: Comment, index: number) {
    const now = new Date();
    const commentDate = new Date(comment.date);
    const diff = now.getTime() - commentDate.getTime();
    const notOlderThenTenMinutes = diff < 10 * 60 * 1000;
    return comment.userId === myUserId && index === comments.length - 1 && notOlderThenTenMinutes;
  }

  async function scrollToBottom() {
    await new Promise((resolve) => setTimeout(resolve, 0));
    const commentsList = document.querySelector('.comments');
    if (commentsList) {
      commentsList.scrollTop = commentsList.scrollHeight;
    }
  }
</script>

<div class="comments-panel-container">
  <Paper elevation={6} class="comments-panel">
    <div class="comments-panel-content">
      <div class="comments-panel-header">
        <h2>Kommentare</h2>
        <IconButton
          title="Hilfe zu Kommentaren anzeigen"
          type="button"
          toggle
          size="button"
          pressed={helpActive}
          onclick={() => (helpActive = !helpActive)}
        >
          <Icon class="material-icons">help</Icon>
          <Icon class="material-icons-filled" on>help</Icon>
        </IconButton>
      </div>
      {#if comments?.length > 0}
        <ul class="comments">
          {#each comments as comment, index}
            <li class="comment {comment.userId === myUserId ? 'my-comment' : ''}">
              <span class="user">
                {#if isDeletable(comment, index)}
                  <Icon
                    class="material-icons delete-icon"
                    onclick={(evt) => onDelete(comment.id, evt)}
                  >
                    delete
                  </Icon>
                {/if}
                <Icon class="material-icons">account_circle</Icon>
                <span class="user-name" title={comment.userName}>
                  {comment.userName}
                </span>
              </span>
              <span class="comment-text">
                {comment.text}
              </span>
              <span class="comment-time">
                {new Date(comment.date).toLocaleString()}
              </span>
            </li>
          {/each}
        </ul>
      {:else}
        <p>Bisher keine Kommentare vorhanden.</p>
      {/if}
      <form onsubmit={sendComment}>
        <div class="comment-input">
          <Textfield
            textarea
            variant="outlined"
            input$maxlength={500}
            input$rows={inputRows}
            input$resizable={false}
            bind:value
            label="Neuer Kommentar"
          >
            {#snippet helper()}
              <CharacterCounter />
            {/snippet}
          </Textfield>
        </div>
        <IconButton class="material-icons" title="Absenden" type="button">send</IconButton>
      </form>
    </div>
  </Paper>
</div>

<Dialog
  bind:open={helpActive}
  aria-labelledby="comments-help-title"
  aria-describedby="comments-help-content"
>
  <Title id="comments-help-title">Hilfe zu Kommentaren</Title>
  <Content id="comments-help-content">
    {#await getHelpMarkdown()}
      <p>Loading...</p>
    {:then parsed}
      {@html parsed}
    {:catch}
      <h2>Die Hilfe konnte nicht geladen werden.</h2>
    {/await}
  </Content>
  <Actions>
    <Button type="button" onclick={() => (helpActive = false)}>
      <Label>Schließen</Label>
    </Button>
  </Actions>
</Dialog>

<style lang="scss">
  .comments-panel-container {
    position: fixed;
    width: min(75%, 500px);
    z-index: 1;
    bottom: 4.5em;
    left: 1em;

    :global(.mdc-text-field) {
      align-items: stretch;
    }
  }

  :global(div.smui-paper.comments-panel) {
    background-color: white;
    padding: 0.5em 1em;

    .comments-panel-content {
      display: flex;
      flex-direction: column;

      .comments-panel-header {
        display: flex;
        align-items: center;
        gap: 0.5em;

        h2 {
          flex: 1;
          margin: 0.5em 0;
          font-size: 1.25rem;
        }
      }

      p {
        color: var(--mdc-theme-secondary);
      }

      ul.comments {
        list-style-type: none;
        padding: 0 1em;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        overflow: auto;
        max-height: 40dvh;

        li.comment {
          display: flex;
          position: relative;
          flex-direction: column;
          align-items: flex-start;
          padding: 0.5rem;
          border-radius: 5px;
          margin-bottom: 0.5rem;
          background-color: var(--chat-other-color);
          max-width: 80%;

          &.my-comment {
            background-color: var(--chat-self-color);
            align-self: flex-end;
            align-items: flex-end;
          }

          .user {
            display: flex;
            gap: 0.25rem;
            align-self: stretch;
            align-items: center;
            font-weight: bold;
            margin-bottom: 0.25rem;
            font-size: 0.875rem;

            :global(.delete-icon) {
              color: #797979;
              cursor: pointer;
              flex: 1;

              &:hover {
                color: red;
              }
            }

            .user-name {
              max-width: 200px;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }

          .comment-text {
            white-space: pre-wrap;
            line-break: anywhere;
            font-size: 0.875rem;
            text-align: left;
          }

          .comment-time {
            color: #797979;
            font-size: 0.75rem;
            align-self: flex-end;
          }
        }
      }

      form {
        display: flex;
        width: 100%;
        justify-content: space-between;
        .comment-input {
          flex: 1;
          :global(label) {
            width: 100%;
          }
        }
      }
    }
  }
</style>
