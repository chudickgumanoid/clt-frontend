<template>
  <div
    class="auth-form max-w-md mx-auto mt-20 p-8 bg-gray-800 text-white rounded-xl shadow-lg"
  >
    <h1 class="text-2xl font-bold mb-6">Вход</h1>

    <form
      class="flex flex-col gap-4"
      @submit.prevent="handleLogin"
    >
      <div>
        <label class="block mb-1 text-sm">Email</label>
        <input
          v-model="login"
          type="login"
          class="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
          placeholder="Введите login"
          required
        />
      </div>

      <div>
        <label class="block mb-1 text-sm">Пароль</label>
        <input
          v-model="password"
          type="password"
          class="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
          placeholder="Введите пароль"
          required
        />
      </div>

      <button
        type="submit"
        class="bg-primary hover:bg-green-600 transition-all text-white font-semibold py-2 rounded mt-2"
      >
        Войти
      </button>

      <p
        v-if="error"
        class="text-red-400 text-sm mt-2"
      >
        {{ error }}
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const { $axios } = useNuxtApp();

const login = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();

const handleLogin = async () => {
  error.value = "";
  try {
    const response = await $axios.get("/admin/auth", {
      params: {
        login: login.value,
        password: password.value,
      },
    });

    localStorage.setItem("token", response.data.token);

    router.push("/admin");
  } catch (err) {
    error.value = "Неверный login или пароль";
  }
};
</script>

<style scoped>
.auth-form {
  background-color: #2e2e2e;
}
</style>
