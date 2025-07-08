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
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  z-index: 1;
}

.layout-wrapper::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("/img/background.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
  pointer-events: none;
}

@media (max-width: 500px) {
  .layout-wrapper::before {
    background-image: url("/img/background-mobile.jpg");
  }
}

.content {
  flex: 1;
  padding: 60px 0 24px 0;
}
</style>
