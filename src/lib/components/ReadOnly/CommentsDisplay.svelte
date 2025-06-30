<script lang="ts">
  import { getValue } from '$lib/context/FormContext.svelte';
  import type { Comment } from '$lib/models/metadata';

  const comments = $derived(getValue<Comment[]>('clientMetadata.comments'));
</script>

<div class="comments-display">
  {#if comments?.length}
    <div class="blank-space"></div>
    <ul class="comments-list">
      {#each comments as comment (comment.id)}
        <li class="comment">
          <span class="date">{new Date(comment.date).toLocaleString()}:</span>
          <span class="username">{comment.userName}</span>
          <span class="content">{comment.text}</span>
        </li>
      {/each}
    </ul>
  {:else}
    <span class="comments">Keine Kommentare</span>
  {/if}
</div>

<style lang="scss">
  .comments-display {
    display: flex;
    gap: 2em;
    padding: 1em 0;

    .blank-space {
      flex: 1;
    }

    .comments-list {
      flex: 4;
      list-style: none;
      padding: 0;
      margin: 0;

      .username {
        font-weight: bold;
      }
      .date {
        color: gray;
        font-size: 0.9em;
      }
    }
  }
</style>
