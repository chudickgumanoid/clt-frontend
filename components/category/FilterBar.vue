<template>
  <div class="flex gap-4 flex-wrap">
    <div
      v-for="filter in filters"
      :key="filter.filter"
      :ref="(el) => setFilterRef(filter.filter, el)"
      class="relative"
    >
      <button
        class="px-4 py-2 rounded-full bg-[#7E7D7D] text-white flex items-center gap-2"
        :class="{
          'opacity-50 pointer-events-none':
            filter.filter === 'Модель' && !hasSelected('Марка авто'),
        }"
        @click="toggleOpen(filter.filter)"
      >
        <input
          type="checkbox"
          disabled
          :checked="hasSelected(filter.filter)"
        />
        {{ filter.filter }}
      </button>

      <div
        v-show="open === filter.filter"
        :ref="(el) => setDropdownRef(filter.filter, el)"
        class="absolute mt-2 bg-[#7E7D7D] text-white rounded-xl shadow-lg px-4 z-50 min-w-[200px] max-h-[300px] overflow-auto hide-scrollbar"
      >
        <div v-if="Array.isArray(filter.options)">
          <div
            v-if="filter.filter === 'Марка авто'"
            class="py-4 sticky top-0 bg-[#7E7D7D] z-50"
          >
            <input
              v-model="search"
              type="text"
              placeholder="поиск"
              class="w-full px-2 py-1 rounded-full bg-[#5D5D5D] text-white placeholder-gray-300"
            />
          </div>

          <div
            v-if="filter.filter === 'Модель' && !hasSelected('Марка авто')"
            class="py-2 text-sm text-gray-200 italic"
          >
            Сначала выберите марку авто
          </div>

          <label
            v-for="option in filteredOptions(filter)"
            :key="option.mark + '-' + option.id"
            class="flex items-center gap-2 py-1"
          >
            <input
              type="checkbox"
              :value="option.value"
              :checked="isChecked(filter.filter, option.value)"
              @change="toggleFilter(filter.filter, option.value)"
            />
            <span class="font-bold">{{ option.mark }}</span> {{ option.value }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onClickOutside } from "@vueuse/core";
import { onUnmounted, ref } from "vue";

const props = defineProps({
  filters: Array,
  modelValue: Object,
});

const emit = defineEmits(["update:modelValue"]);

const open = ref(null);
const search = ref("");
const filterRefs = ref({});
const dropdownRefs = ref({});

const setFilterRef = (key, el) => {
  if (el) filterRefs.value[key] = el;
};

const clickOutsideCleanups = ref({});
const initializedRefs = ref({});
const setDropdownRef = (key, el) => {
  if (!el || initializedRefs.value[key]) return;

  dropdownRefs.value[key] = el;

  const cleanup = onClickOutside(el, () => {
    if (open.value === key) {
      open.value = null;
      search.value = "";
    }
  });

  clickOutsideCleanups.value[key] = cleanup;
  initializedRefs.value[key] = true;
};

const toggleOpen = (key) => {
  if (key === "Модель" && !hasSelected("Марка авто")) return;

  if (open.value === key) {
    open.value = null;
    search.value = "";
  } else {
    open.value = key;
    search.value = "";
  }
};

const isChecked = (filterName, value) => {
  const current = props.modelValue?.[getFilterKey(filterName)] || [];
  return current.includes(value);
};

const hasSelected = (filterName) => {
  return (
    Array.isArray(props.modelValue?.[getFilterKey(filterName)]) &&
    props.modelValue[getFilterKey(filterName)].length > 0
  );
};

const toggleFilter = (filterName, value) => {
  const key = getFilterKey(filterName);
  const current = props.modelValue?.[key] || [];
  let updated = [];

  if (current.includes(value)) {
    updated = current.filter((v) => v !== value);
  } else {
    updated = [...current, value];
  }

  emit("update:modelValue", {
    ...props.modelValue,
    [key]: updated,
  });
};

const getFilterKey = (label) => {
  switch (label) {
    case "Марка авто":
      return "mark";
    case "Модель":
      return "model";
    case "Поколение":
      return "generation";
    case "Качество":
      return "quality";
    case "Состояние":
      return "state";
    default:
      return label.toLowerCase();
  }
};

const filteredOptions = (filter) => {
  if (filter.filter === "Марка авто") {
    return filter.options.filter((o) =>
      o.value.toLowerCase().includes(search.value.toLowerCase())
    );
  }

  if (filter.filter === "Модель") {
    const raw = filter.options[0];
    const selectedMarks = props.modelValue?.mark || [];

    if (!selectedMarks.length) {
      return [];
    }

    const flatModels = [];

    for (const mark of selectedMarks) {
      const models = raw[mark] || [];
      for (const model of models) {
        flatModels.push({
          ...model,
          mark,
        });
      }
    }

    return flatModels;
  }

  return filter.options;
};

onUnmounted(() => {
  for (const cleanup of Object.values(clickOutsideCleanups.value)) {
    cleanup?.();
  }
});
</script>

<style scoped>
.hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
