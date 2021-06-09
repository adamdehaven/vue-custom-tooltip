<template>
  <p>This is the Vue app.</p>
  <p>
    This sentence has a
    <vue-custom-tooltip label="This is a tooltip" abbreviation>tooltip in the middle</vue-custom-tooltip>.
  </p>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
})
</script>
