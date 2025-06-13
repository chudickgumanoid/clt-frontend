import { computed } from "vue";

export const useProducts = (products) => {
  const dataProducts = computed(() => {

    if (!products) return []
    return products.map((p) => ({
      ...p,
      image: p.images?.[0],
      description: [
        p.mark,
        p.model !== "-" ? p.model : null,
        p.generation !== "-" ? p.generation : null,
        p.vincode !== "-" ? `VIN: ${p.vincode}` : null,
        p.part_number !== "-" ? `Part: ${p.part_number}` : null,
      ]
        .filter(Boolean) // удаляем null
        .join(", "),
    }))

  })

  return { dataProducts };
}
