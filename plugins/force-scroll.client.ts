// plugins/force-scroll.client.ts
export default defineNuxtPlugin(() => {
  const router = useRouter();

  router.beforeResolve(() => {
    // Сразу скролл без анимации
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  });
});
