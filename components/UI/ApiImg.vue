<template>
  <img
    :src="`https://98da63106715be00063abd3281040a13.serveo.net/api/image?imageId=${imageId}`"
    alt=""
  />
</template>

<script setup>
defineProps({
  imageId: String,
});

const config = useRuntimeConfig();
</script>

<style scoped></style>
