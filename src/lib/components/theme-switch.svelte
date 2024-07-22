<script>
  import { preferences } from '~/store';
  export let label = 'System default';
  export let value = '';
</script>


<input
  type="radio"
  name="theme-dropdown"
  class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
  aria-label="{label}"
  checked={$preferences.theme === value}
  on:change={() => ($preferences.theme = value)}
  value="{value}"
  {...$$restProps}
/>
