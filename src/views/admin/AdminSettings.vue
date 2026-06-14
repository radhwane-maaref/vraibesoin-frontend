<template>
  <div class="min-h-screen bg-[#F8F6F2] font-sans pb-24 flex justify-center">
    <div class="w-full max-w-3xl px-4 sm:px-6 py-6 sm:py-8">
      <header class="flex items-center justify-between mb-8 relative">
        <h1 class="absolute w-full text-center text-xl font-bold text-gray-900">
          Paramètres
        </h1>
      </header>

      <div class="space-y-4 sm:space-y-6">
        <section
          class="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100"
        >
          <div class="flex items-center gap-3 mb-5 sm:mb-6">
            <div class="p-2.5 bg-gray-50 rounded-xl shrink-0">
              <svg
                class="w-5 h-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2
              class="text-base sm:text-lg font-bold text-gray-900 leading-tight"
            >
              Modifier le mot de passe
            </h2>
          </div>

          <form @submit.prevent="updatePassword" class="space-y-4">
            <div
              v-if="successMessage"
              class="p-3.5 sm:p-4 bg-green-50 text-green-700 rounded-xl text-sm font-medium animate-fade-in"
            >
              {{ successMessage }}
            </div>

            <div
              v-if="errorMessage"
              class="p-3.5 sm:p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium animate-fade-in"
            >
              {{ errorMessage }}
            </div>

            <div class="space-y-1.5">
              <label class="block text-xs sm:text-sm font-bold text-gray-700"
                >Ancien mot de passe</label
              >
              <input
                type="password"
                autocomplete="current-password"
                v-model="pwdForm.current_password"
                class="w-full px-4 py-3.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B8C85] outline-none text-sm transition-all"
                required
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="block text-xs sm:text-sm font-bold text-gray-700"
                  >Nouveau mot de passe</label
                >
                <input
                  type="password"
                  autocomplete="new-password"
                  v-model="pwdForm.new_password"
                  class="w-full px-4 py-3.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B8C85] outline-none text-sm transition-all"
                  placeholder="Min. 8 caractères"
                  required
                />
              </div>
              <div class="space-y-1.5">
                <label class="block text-xs sm:text-sm font-bold text-gray-700"
                  >Confirmer le nouveau</label
                >
                <input
                  type="password"
                  autocomplete="new-password"
                  v-model="pwdForm.confirm_password"
                  class="w-full px-4 py-3.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B8C85] outline-none text-sm transition-all"
                  required
                />
              </div>
            </div>

            <div class="pt-4 flex flex-col sm:flex-row sm:justify-end">
              <button
                type="submit"
                :disabled="isLoading || !isPasswordValid"
                class="w-full sm:w-auto px-6 py-3.5 sm:py-3 bg-[#5B8C85] text-white font-bold rounded-xl hover:bg-[#4a736d] disabled:opacity-50 transition-all shadow-sm flex justify-center items-center gap-2"
              >
                <svg
                  v-if="isLoading"
                  class="animate-spin h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {{ isLoading ? "Mise à jour..." : "Mettre à jour" }}
              </button>
            </div>
          </form>
        </section>

        <button
          @click="handleLogout"
          class="w-full sm:w-auto mx-auto px-6 py-3.5 sm:py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-all flex justify-center items-center gap-2 shadow-sm"
        >
          <svg
            class="w-5 h-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Se déconnecter
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * @module AdminSettings
 * @description Page de paramètres du compte administrateur.
 *
 * Propose deux actions principales :
 * - **Modification du mot de passe** : formulaire sécurisé avec validation
 *   côté client (longueur minimale, concordance) et soumission via `PATCH /users/me/`.
 * - **Déconnexion** : purge de la session via le store d'authentification
 *   et redirection vers la page de connexion.
 *
 * @requires vue - ref, reactive, computed
 * @requires vue-router - useRouter
 * @requires @/stores/auth - Store Pinia d'authentification (useAuthStore)
 * @requires @/services/api - Client HTTP configuré (axios)
 */
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import api from "@/services/api";

const router = useRouter();
const authStore = useAuthStore();

/** @type {import('vue').Ref<boolean>} Verrouillage du formulaire pendant la requête réseau */
const isLoading = ref(false);

/** @type {import('vue').Ref<string>} Message de confirmation affiché temporairement après succès */
const successMessage = ref("");

/** @type {import('vue').Ref<string>} Message d'erreur retourné par l'API ou la validation locale */
const errorMessage = ref("");

/**
 * @type {{current_password: string, new_password: string, confirm_password: string}}
 * État réactif du formulaire de changement de mot de passe.
 */
const pwdForm = reactive({
  current_password: "",
  new_password: "",
  confirm_password: "",
});

/**
 * Détermine si le formulaire est prêt à être soumis.
 * Vérifie que l'ancien mot de passe est renseigné, que le nouveau
 * atteint 8 caractères minimum et que la confirmation correspond.
 * @type {import('vue').ComputedRef<boolean>}
 */
const isPasswordValid = computed(() => {
  return (
    pwdForm.current_password.length > 0 &&
    pwdForm.new_password.length >= 8 &&
    pwdForm.new_password === pwdForm.confirm_password
  );
});

/**
 * Soumet la demande de changement de mot de passe à l'API.
 *
 * Effectue une double vérification de concordance côté client avant l'appel réseau.
 * En cas de succès, réinitialise le formulaire et affiche un message de confirmation
 * qui disparaît automatiquement après 4 secondes.
 *
 * @async
 * @returns {Promise<void>}
 */
const updatePassword = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  if (pwdForm.new_password !== pwdForm.confirm_password) {
    errorMessage.value = "Les nouveaux mots de passe ne correspondent pas.";
    return;
  }

  isLoading.value = true;

  try {
    await api.patch("/users/me/", {
      current_password: pwdForm.current_password,
      new_password: pwdForm.new_password,
    });

    successMessage.value = "Votre mot de passe a été mis à jour avec succès.";
    pwdForm.current_password = "";
    pwdForm.new_password = "";
    pwdForm.confirm_password = "";

    setTimeout(() => {
      successMessage.value = "";
    }, 4000);
  } catch (err) {
    errorMessage.value =
      err.response?.data?.error ||
      "Une erreur est survenue lors de la mise à jour.";
  } finally {
    isLoading.value = false;
  }
};

/**
 * Déconnecte l'administrateur en purgeant le store d'authentification
 * puis redirige vers la route nommée « login ».
 */
const handleLogout = () => {
  authStore.logout();
  router.push({ name: "login" });
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
