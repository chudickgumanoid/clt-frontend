<template>
  <div class="layout-wrapper">
    <MainHeader />
    <main class="content">
      <slot />
    </main>
    <LazyMainFooter />
  </div>
</template>

<script setup>
import { LazyMainFooter } from "#components";
</script>

<style scoped>
.layout-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  background-image: url("/img/background.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

@media (max-width: 500px) {
  .layout-wrapper {
    background-image: url("/img/background-mobile.jpg");
  }
}
.content {
  flex: 1;
  padding: 60px 0 24px 0;
}
</style>
