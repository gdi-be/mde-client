<script lang="ts">
  import Textfield from "@smui/textfield";
  import type { Comment, MetadataJson } from "$lib/models/metadata";
  import Paper from "@smui/paper";
  import CharacterCounter from "@smui/textfield/character-counter";
  import IconButton, { Icon } from "@smui/icon-button";
  import { page } from "$app/state";
  import { invalidateAll } from "$app/navigation";
  import { getContext } from "svelte";
  import type { Token } from "$lib/models/keycloak";
  import { fly } from "svelte/transition";
  import { popconfirm } from "$lib/context/PopConfirmContex.svelte";

  type CommentsPanelProps = {
    metadata?: MetadataJson;
  }

  let {
    metadata
  }: CommentsPanelProps = $props();

  const token = getContext<Token>('user_token');

  let value = $state('');
  let comments = $derived<Comment[]>(metadata?.clientMetadata?.comments as Comment[]);
  let myUserId = $derived(token.sub)
  let inputRows =$derived(Math.min(value.split('\n').length, 4));

  async function sendComment() {
    const response = await fetch(page.url.pathname + '/comment', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        text: value
      })
    });

    if (response.ok) {
      value = '';
      invalidateAll();
    }
  }

  async function onDelete(id: string, evt: MouseEvent) {
    const targetEl = evt.currentTarget as HTMLElement;
    popconfirm(targetEl, async () => {
      const response = await fetch(page.url.pathname + '/comment', {
        method: 'DELETE',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          id
        })
      });

      if (response.ok) {
        invalidateAll();
      }
    }, {
      text: 'Möchten Sie diesen Kommentar wirklich löschen?',
      confirmButtonText: 'Löschen'
    });
  }

  function isDeletable(comment: Comment, index: number) {
    const now = new Date();
    const commentDate = new Date(comment.date);
    const diff = now.getTime() - commentDate.getTime();
    const notOlderThenTenMinutes = diff < 10 * 60 * 1000;
    return comment.userId === myUserId && index === comments.length - 1 && notOlderThenTenMinutes;
  }

</script>

<div
  class="comments-panel-container"
  in:fly={{ y: 500, x: -200, duration: 150 }}
  out:fly={{ y: 500, x: -200, duration: 150 }}
>
<Paper
  elevation={6}
  class="comments-panel"
>
  <div class="comments-panel-content">
    <h2>Kommentare</h2>
    {#if comments?.length > 0}
      <ul class="comments">
        {#each comments as comment, index}
        <li class="comment {comment.userId === myUserId ? 'my-comment' : ''}">
            {#if isDeletable(comment, index)}
              <Icon
                class="material-icons delete-icon"
                onclick={(evt) => onDelete(comment.id, evt)}
              >
                delete
              </Icon>
            {/if}
            <span class="user-name">
              <Icon class="material-icons">account_circle</Icon>
              {comment.userName}
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
          bind:value
          label="Neuer Kommentar"
        >
          {#snippet helper()}
            <CharacterCounter/>
          {/snippet}
        </Textfield>
      </div>
      <IconButton
        class="material-icons"
        title="Absenden"
      >
        send
      </IconButton>
    </form>
  </div>
</Paper>
</div>

<style lang="scss">
  .comments-panel-container {
    position: fixed;
    width: 30%;
    z-index: 1;
    bottom: 4.5em;
    left: 1em;
  }

  :global(div.smui-paper.comments-panel) {
    background-color: white;
    padding: 0.5em 1em;

    .comments-panel-content {
      display: flex;
      flex-direction: column;

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

            :global(.delete-icon) {
              position: absolute;
              top: 0.5em;
              left: 0.5em;
              color: #797979;
              cursor: pointer;

              &:hover {
                color: red;
              }
            }

            .user-name {
                display: flex;
                gap: 0.25rem;
                align-items: center;
                font-weight: bold;
                margin-bottom: 0.25rem;
                font-size: 0.875rem;
            }

            .comment-text {
              white-space: pre-wrap;
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
