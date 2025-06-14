<template>
  <img
    :src="`${BASE_API_URL}/image?imageId=${imageId}`"
    alt=""
  />
</template>

<script setup>
import { BASE_API_URL } from "~/shared/utils/constants";
defineProps({
  imageId: String,
});

const config = useRuntimeConfig();
</script>

<style scoped></style>
