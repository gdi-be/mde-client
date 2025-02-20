<script lang="ts">
  import type { Role } from "$lib/models/keycloak";
  import { getRoleName } from "../util";

  type RoleTagProps = {
    role: Role;
  }

  const {
    role
  }: RoleTagProps = $props();

  const roleName = $derived(getRoleName(role));
</script>


<div
  class={["role-tag", `${role.toLowerCase()}-tag`]}
  title={roleName}
>
  {roleName}
</div>

<style lang="scss">
  .role-tag {
    cursor: default;
    font-size: 0.75em;
    margin-left: 12px;
    background-color: var(--mdc-theme-secondary);
    padding: 0.5em 0.75em;
    border-radius: 1em;
    color: white;

    &.editor-tag {
      background-color: #37803a;
    }

    &.dataowner-tag {
      background-color: #1b72b9;
    }

    &.qualityassurance-tag {
      background-color: #0e6a72;
    }
  }
</style>
