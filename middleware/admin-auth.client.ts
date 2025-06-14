export default defineNuxtRouteMiddleware((to) => {
  if (process.client) {
    const token = localStorage.getItem("token");

    if (to.path.startsWith("/admin") && to.path !== "/admin/login" && !token) {
      return navigateTo("/admin/login");
    }
  }
});
