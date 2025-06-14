<template>
  <slot />
  <div class="notification-container fixed top-4 right-4 z-50 space-y-2">
    <transition-group
      name="fade"
      tag="div"
    >
      <div
        v-for="n in notifications"
        :key="n.id"
        class="bg-white shadow-lg text-black rounded px-4 py-2 border flex items-center space-x-2 mb-2"
        :class="{
          'bg-green-50 text-green-800 border-green-300': n.type === 'success',
          'bg-red-50 text-red-800 border-red-300': n.type === 'error',
          'bg-blue-50 text-blue-800 border-blue-300': n.type === 'info',
        }"
      >
        <span v-if="n.type === 'success'">✅</span>
        <span v-else-if="n.type === 'error'">❌</span>
        <span v-else>ℹ️</span>
        <div>{{ n.message }}</div>
        <button @click="remove(n.id)">✕</button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { provide, ref } from "vue";

const notifications = ref([]);

const notify = (options) => {
  const id = Date.now();
  notifications.value.push({ ...options, id, type: options.type || "info" });
  if (!options.sticky) {
    setTimeout(() => remove(id), options.duration || 3000);
  }
};

const remove = (id) => {
  notifications.value = notifications.value.filter((n) => n.id !== id);
};

provide("notify", notify);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
