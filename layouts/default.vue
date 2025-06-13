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

  background-image: url("/img/background.png");
  /** background: #000; **/
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.content {
  flex: 1;
  padding: 60px 0 24px 0;
}
</style>
