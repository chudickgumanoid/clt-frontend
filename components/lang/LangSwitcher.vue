<template>
  <div
    ref="dropdownRef"
    class="language-selector"
    :title="locale"
  >
    <div
      class="lang-button"
      :class="{ active: isOpen }"
      @click="toggleDropdown"
    >
      <div class="text-lg uppercase px-2 py-1">
        {{ locale.toUpperCase() }}
      </div>

      <!-- <ArrowTriangleIcon
        class="arrow"
        :class="{ open: isOpen }"
      /> -->
    </div>

    <div
      v-if="isOpen"
      class="dropdown-menu"
    >
      <div
        v-for="lang in languages"
        :key="lang"
        :class="{ active: lang === locale }"
        class="dropdown-item"
        @click="changeLang(lang)"
      >
        {{ lang.toUpperCase() }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { onClickOutside } from "@vueuse/core";

const { locale, setLocale } = useI18n();
const isOpen = ref(false);
const dropdownRef = ref(null);
const languages = ["ru", "kz"];

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const changeLang = (lang) => {
  setLocale(lang);
  isOpen.value = false;
};

onClickOutside(dropdownRef, () => {
  isOpen.value = false;
});
</script>

<style scoped>
.language-selector {
  position: relative;
  display: inline-block;
}

.lang-button {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  border-radius: 8px;
  background: #c5942e;
}

.lang-button:hover {
  background-color: #c5942e !important;
}

.lang-button.active {
  color: #fff;
  background: #c5942e;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  margin-top: 0.25rem;
  z-index: 1000;
  width: 100%;
}

.dropdown-item {
  text-align: center;
  padding: 8px 4px;
  cursor: pointer;
  background: #313131;
}

.dropdown-item:first-child {
  border-radius: 8px 8px 0 0;
}

.dropdown-item:last-child {
  border-radius: 0 0 8px 8px;
}

.dropdown-item.active {
  background-color: #c5942e;
  color: #fff;
}

.arrow {
  transition: all 0.3s ease;
}

.open {
  transform: rotate(180deg);
  color: #fff;
}
</style>
