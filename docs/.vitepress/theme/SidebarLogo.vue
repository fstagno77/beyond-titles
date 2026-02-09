<script setup>
import { withBase } from 'vitepress'
</script>

<template>
  <div class="sidebar-logo">
    <img :src="withBase('/logo_subsense.png')" alt="SubSense" />
  </div>
</template>

<style scoped>
.sidebar-logo {
  padding: 24px 20px 16px;
  margin-top: auto;
  border-top: 1px solid var(--vp-c-divider);
  text-align: left;
}

.sidebar-logo img {
  width: 100%;
  max-width: 160px;
  opacity: 0.7;
  transition: opacity 0.25s;
}

.sidebar-logo img:hover {
  opacity: 1;
}
</style>
