<template>
  <img
    :src="`${config.public.apiBaseUrl}/image?imageId=${imageId}`"
    alt=""
  />
</template>

<script setup>
defineProps({
  imageId: String,
});

const config = useRuntimeConfig();
</script>

<style lang="scss" scoped></style>
