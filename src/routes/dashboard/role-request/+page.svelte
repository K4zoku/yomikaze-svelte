<script lang="ts">
  import http from '$utils/http.js';

  export let data;
  let { token } = data;
  http.defaults.headers.common.Authorization = 'Bearer ' + token;
</script>
