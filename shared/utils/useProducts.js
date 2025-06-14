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
        .filter(Boolean)
        .join(", "),
    }))

  })

  return { dataProducts };
}

export const useProductsRef = (products) => {
  const dataProducts = computed(() => {

    if (!products.value) return []
    return products.value.map((p) => ({
      ...p,
      image: p.images?.[0],
      description: [
        p.mark,
        p.model !== "-" ? p.model : null,
        p.generation !== "-" ? p.generation : null,
        p.vincode !== "-" ? `VIN: ${p.vincode}` : null,
        p.part_number !== "-" ? `Part: ${p.part_number}` : null,
      ]
        .filter(Boolean)
        .join(", "),
    }))

  })

  return { dataProducts };
}
