<template>
  <div class="min-h-screen bg-[#F8F6F2] px-4 sm:px-6 py-8 font-sans pb-24">
    <div class="max-w-3xl mx-auto w-full">
    <header class="flex items-center justify-between mb-8 relative">
      <h1 class="absolute w-full text-center text-xl font-bold text-gray-900">
        Gestion de la Plateforme
      </h1>
    </header>

    <div class="flex gap-3 mb-6 overflow-x-auto pb-2 custom-scrollbar">
      <button
        @click="activeTab = 'users'"
        :class="
          activeTab === 'users'
            ? 'bg-[#5B8C85] text-white shadow-md'
            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
        "
        class="px-5 py-2.5 rounded-xl font-bold transition-all text-sm whitespace-nowrap"
      >
        Utilisateurs inscrits
      </button>
      <button
        @click="activeTab = 'messages'"
        :class="
          activeTab === 'messages'
            ? 'bg-[#5B8C85] text-white shadow-md'
            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
        "
        class="px-5 py-2.5 rounded-xl font-bold transition-all text-sm whitespace-nowrap"
      >
        Avis des utilisateur
      </button>
    </div>

    <div v-if="activeTab === 'users'" class="space-y-4 animate-fade-in">
      <div
        class="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100"
      >
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
        >
          <h2 class="text-lg font-bold text-gray-800">
            Liste des utilisateurs
          </h2>
          <div class="relative w-full sm:w-72">
            <svg
              class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="search"
              name="admin_search_users_prevent_autofill"
              autocomplete="off"
              data-lpignore="true"
              data-1p-ignore="true"
              v-model="searchQuery"
              @input="debounceSearch"
              placeholder="Rechercher (nom, email)..."
              class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B8C85] outline-none text-sm transition-all"
            />
          </div>
        </div>

        <div v-if="loadingUsers" class="flex justify-center py-8">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5B8C85]"
          ></div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="user in users"
            :key="user.id"
            class="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col gap-3 hover:shadow-md transition-shadow"
          >
            <div class="flex justify-between items-start">
              <div class="overflow-hidden pr-2">
                <h3 class="font-bold text-gray-900 truncate">
                  {{ user.full_name || "Non renseigné" }}
                </h3>
                <p class="text-xs text-gray-500 truncate mt-0.5">
                  {{ user.email }}
                </p>
              </div>
              <span
                :class="
                  user.is_active
                    ? 'bg-[#E1EBE8] text-[#5A877E]'
                    : 'bg-red-50 text-red-600'
                "
                class="px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-bold tracking-wide shrink-0"
              >
                {{ user.is_active ? "Actif" : "Inactif" }}
              </span>
            </div>

            <div class="flex items-center gap-3 text-xs text-gray-500 mt-1">
              <span
                class="inline-block bg-white border border-gray-200 px-2 py-0.5 rounded font-semibold uppercase"
              >
                {{ user.auth_provider }}
              </span>
              <span class="flex items-center gap-1">
                <svg
                  class="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {{ formatDate(user.date_joined) }}
              </span>
            </div>

            <div class="flex gap-2 mt-3 pt-3 border-t border-gray-100">
              <button
                v-if="user.auth_provider?.toUpperCase() === 'EMAIL'"
                @click="openPasswordModal(user)"
                class="flex-1 text-xs bg-white border border-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 font-bold transition-colors shadow-sm"
              >
                Mot de passe
              </button>

              <button
                @click="initiateToggleUserStatus(user)"
                :class="
                  user.is_active
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-[#E1EBE8] text-[#5A877E] hover:bg-[#cbe3dc]'
                "
                class="flex-1 text-xs py-2.5 rounded-lg font-bold transition-colors shadow-sm"
              >
                {{ user.is_active ? "Désactiver" : "Activer" }}
              </button>
            </div>
          </div>

          <div
            v-if="users.length === 0"
            class="col-span-full text-center py-10 text-gray-400 font-medium"
          >
            Aucun utilisateur trouvé.
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'messages'" class="space-y-4 animate-fade-in">
      <div v-if="loadingMessages" class="flex justify-center py-8">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5B8C85]"
        ></div>
      </div>

      <div
        v-else-if="feedbacks.length === 0"
        class="text-center text-gray-500 py-10 bg-white rounded-2xl shadow-sm border border-gray-100"
      >
        Aucun message de support récent.
      </div>

      <div
        v-else
        v-for="ticket in feedbacks"
        :key="ticket.id"
        class="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
      >
        <div
          class="flex flex-col sm:flex-row justify-between items-start mb-4 gap-3"
        >
          <div>
            <h3 class="font-bold text-gray-900 text-lg">
              {{ ticket.subject || "Ticket sans objet" }}
            </h3>
            <p class="text-sm text-[#5B8C85] font-semibold mt-1">
              {{ ticket.user_email }}
            </p>
          </div>
          <div class="flex flex-col sm:items-end">
            <span
              class="text-xs text-gray-400 font-medium flex items-center gap-1"
            >
              <svg
                class="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {{ formatDate(ticket.created_at) }}
            </span>
            <div class="mt-2 flex gap-1">
              <svg
                v-for="i in 5"
                :key="i"
                class="w-4 h-4"
                :class="
                  i <= ticket.rating ? 'text-yellow-400' : 'text-gray-200'
                "
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div
          class="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed"
        >
          {{ ticket.comment || "Aucun contenu." }}
        </div>
      </div>
    </div>

    <div
      v-if="showPasswordModal"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 transition-opacity"
    >
      <div
        class="bg-white p-6 sm:p-8 rounded-[2rem] w-full max-w-sm shadow-2xl border border-gray-100"
      >
        <h3 class="font-bold text-xl mb-1 text-gray-900">
          Changer le mot de passe
        </h3>
        <p class="text-gray-500 text-sm mb-6">
          Utilisateur :
          <span class="font-bold text-gray-700 truncate block">{{
            selectedUser?.email
          }}</span>
        </p>

        <input
          type="password"
          name="new_user_password_prevent_autofill"
          autocomplete="new-password"
          data-bwignore="true"
          data-lpignore="true"
          data-1p-ignore="true"
          v-model="newPassword"
          placeholder="Nouveau mot de passe (min. 8)"
          class="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl mb-6 focus:ring-2 focus:ring-[#5A877E] outline-none text-sm tracking-wide"
        />

        <div class="flex gap-3">
          <button
            @click="showPasswordModal = false"
            class="flex-1 py-3.5 rounded-xl bg-gray-100 font-bold text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Annuler
          </button>
          <button
            @click="submitPasswordChange"
            :disabled="
              !newPassword || newPassword.length < 8 || isSubmittingPwd
            "
            class="flex-1 py-3.5 rounded-xl font-bold text-white bg-[#5B8C85] hover:bg-[#4a736d] disabled:opacity-50 transition-colors shadow-sm"
          >
            {{ isSubmittingPwd ? "Sauvegarde..." : "Confirmer" }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showConfirmModal"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 transition-opacity"
    >
      <div
        class="bg-white p-6 sm:p-8 rounded-[2rem] w-full max-w-sm shadow-2xl border border-gray-100 text-center"
      >
        <div
          class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4"
        >
          <svg
            class="h-6 w-6 text-orange-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 class="font-bold text-xl mb-2 text-gray-900">
          {{ confirmTitle }}
        </h3>
        <p class="text-gray-500 text-sm mb-6">
          {{ confirmMessage }}
        </p>

        <div class="flex gap-3">
          <button
            @click="cancelConfirmation"
            class="flex-1 py-3.5 rounded-xl bg-gray-100 font-bold text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Annuler
          </button>
          <button
            @click="executeConfirmation"
            class="flex-1 py-3.5 rounded-xl font-bold text-white bg-[#5B8C85] hover:bg-[#4a736d] transition-colors shadow-sm"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
    </div>

    <transition name="toast-fade">
      <div
        v-if="toast.show"
        class="fixed bottom-24 left-4 right-4 sm:left-auto sm:bottom-8 sm:right-8 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl z-[9999] transition-all text-sm font-bold text-white"
        :class="toast.type === 'success' ? 'bg-[#5B8C85]' : 'bg-red-500'"
      >
        <svg
          v-if="toast.type === 'success'"
          class="w-5 h-5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <svg
          v-else
          class="w-5 h-5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <span class="truncate">{{ toast.message }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
/**
 * @module ManagingUser
 * @description Vue d'administration pour la gestion des utilisateurs et la consultation des avis.
 *
 * Deux onglets principaux :
 * - **Utilisateurs inscrits** : liste paginée avec recherche, activation/désactivation
 *   de comptes (soft delete / restore) et réinitialisation de mot de passe
 *   (uniquement pour les comptes authentifiés par e-mail).
 * - **Avis des utilisateurs** : liste en lecture seule des tickets de support
 *   soumis par les utilisateurs, avec notation par étoiles.
 *
 * Toutes les actions critiques (désactivation, changement de mot de passe) passent
 * par une modale de confirmation avant exécution.
 *
 * @requires vue - ref, onMounted, reactive
 * @requires @/services/api - Client HTTP configuré (axios)
 */
import { ref, onMounted, reactive } from "vue";
import api from "@/services/api";

/** @type {import('vue').Ref<'users'|'messages'>} Onglet actuellement actif */
const activeTab = ref("users");

/* ── État : liste des utilisateurs ────────────────────────── */

/** @type {import('vue').Ref<Array<Object>>} Liste des utilisateurs récupérés depuis l'API */
const users = ref([]);

/** @type {import('vue').Ref<string>} Terme de recherche saisi par l'administrateur */
const searchQuery = ref("");

/** @type {import('vue').Ref<boolean>} Indicateur de chargement de la liste utilisateurs */
const loadingUsers = ref(false);

/** @type {number|null} Identifiant du timer de debounce pour la recherche */
let searchTimeout = null;

/* ── État : avis utilisateurs (feedbacks) ─────────────────── */

/** @type {import('vue').Ref<Array<Object>>} Liste des tickets de support / avis */
const feedbacks = ref([]);

/** @type {import('vue').Ref<boolean>} Indicateur de chargement des avis */
const loadingMessages = ref(false);

/* ── État : modale de changement de mot de passe ──────────── */

/** @type {import('vue').Ref<boolean>} Contrôle l'affichage de la modale de mot de passe */
const showPasswordModal = ref(false);

/** @type {import('vue').Ref<Object|null>} Utilisateur sélectionné pour le changement de mot de passe */
const selectedUser = ref(null);

/** @type {import('vue').Ref<string>} Nouveau mot de passe saisi dans la modale */
const newPassword = ref("");

/** @type {import('vue').Ref<boolean>} Verrouillage du bouton pendant la soumission du mot de passe */
const isSubmittingPwd = ref(false);

/* ── Système de notifications toast ──────────────────────── */

/**
 * État réactif du toast de notification.
 * @type {{show: boolean, message: string, type: 'success'|'error'}}
 */
const toast = reactive({
  show: false,
  message: "",
  type: "success",
});

/**
 * Affiche un toast de notification pendant 3 secondes.
 * @param {string} message - Texte à afficher.
 * @param {'success'|'error'} [type='success'] - Type visuel du toast.
 */
const showToast = (message, type = "success") => {
  toast.message = message;
  toast.type = type;
  toast.show = true;
  setTimeout(() => {
    toast.show = false;
  }, 3000);
};

/* ── Système de modale de confirmation générique ──────────── */

/** @type {import('vue').Ref<boolean>} Contrôle l'affichage de la modale de confirmation */
const showConfirmModal = ref(false);

/** @type {import('vue').Ref<string>} Titre affiché dans la modale */
const confirmTitle = ref("");

/** @type {import('vue').Ref<string>} Message descriptif dans la modale */
const confirmMessage = ref("");

/** @type {Function|null} Callback exécuté si l'utilisateur confirme l'action */
let confirmActionCallback = null;

/**
 * Ouvre la modale de confirmation avec un titre, un message et un callback d'action.
 * @param {string} title - Titre de la modale.
 * @param {string} message - Description de l'action à confirmer.
 * @param {Function} callback - Fonction asynchrone exécutée à la confirmation.
 */
const requestConfirmation = (title, message, callback) => {
  confirmTitle.value = title;
  confirmMessage.value = message;
  confirmActionCallback = callback;
  showConfirmModal.value = true;
};

/** Ferme la modale de confirmation sans exécuter l'action */
const cancelConfirmation = () => {
  showConfirmModal.value = false;
  confirmActionCallback = null;
};

/**
 * Ferme la modale et exécute le callback de confirmation s'il existe.
 * @async
 * @returns {Promise<void>}
 */
const executeConfirmation = async () => {
  showConfirmModal.value = false;
  if (confirmActionCallback) {
    await confirmActionCallback();
    confirmActionCallback = null;
  }
};

/* ── Récupération des données ─────────────────────────────── */

/**
 * Récupère la liste des utilisateurs depuis l'API admin, filtrée par le terme de recherche courant.
 * @async
 * @returns {Promise<void>}
 */
const fetchUsers = async () => {
  loadingUsers.value = true;
  try {
    const response = await api.get("/admin-api/users/", {
      params: { search: searchQuery.value },
    });
    users.value = response.data;
  } catch (err) {
    console.error("Erreur de récupération des utilisateurs:", err);
  } finally {
    loadingUsers.value = false;
  }
};

/**
 * Récupère la liste complète des avis / tickets de support.
 * @async
 * @returns {Promise<void>}
 */
const fetchFeedbacks = async () => {
  loadingMessages.value = true;
  try {
    const response = await api.get("/admin-api/feedbacks/");
    feedbacks.value = response.data;
  } catch (err) {
    console.error("Erreur de récupération des feedbacks:", err);
  } finally {
    loadingMessages.value = false;
  }
};

/**
 * Temporise la recherche utilisateur pour éviter un appel API à chaque frappe.
 * Délai de 400 ms avant déclenchement de `fetchUsers`.
 */
const debounceSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchUsers();
  }, 400);
};

/**
 * Ouvre la modale de confirmation avant d'activer ou désactiver un compte utilisateur.
 * L'action effective (soft_delete / restore) est exécutée via `PATCH /admin-api/users/:id/`.
 * @param {Object} user - Objet utilisateur ciblé (doit contenir `id` et `is_active`).
 */
const initiateToggleUserStatus = (user) => {
  const actionText = user.is_active ? "désactiver" : "restaurer";

  requestConfirmation(
    "Confirmation",
    `Êtes-vous sûr de vouloir ${actionText} cet utilisateur ?`,
    async () => {
      const action = user.is_active ? "soft_delete" : "restore";
      try {
        await api.patch(`/admin-api/users/${user.id}/`, { action });
        user.is_active = !user.is_active;
        showToast(`Utilisateur ${actionText} avec succès.`, "success");
      } catch (err) {
        showToast(
          "Erreur lors de la modification du statut de l'utilisateur.",
          "error",
        );
      }
    },
  );
};

/**
 * Prépare et ouvre la modale de changement de mot de passe pour un utilisateur donné.
 * @param {Object} user - Objet utilisateur ciblé.
 */
const openPasswordModal = (user) => {
  selectedUser.value = user;
  newPassword.value = "";
  showPasswordModal.value = true;
};

/**
 * Soumet le changement de mot de passe via `PATCH /admin-api/users/:id/`.
 * Affiche un toast de succès ou d'erreur selon le résultat.
 * @async
 * @returns {Promise<void>}
 */
const submitPasswordChange = async () => {
  isSubmittingPwd.value = true;
  try {
    await api.patch(`/admin-api/users/${selectedUser.value.id}/`, {
      action: "manual_password_change",
      new_password: newPassword.value,
    });
    showToast("Mot de passe mis à jour avec succès.", "success");
    showPasswordModal.value = false;
  } catch (err) {
    const errorMsg =
      err.response?.data?.error ||
      "Erreur lors de la modification du mot de passe.";
    showToast(errorMsg, "error");
  } finally {
    isSubmittingPwd.value = false;
  }
};

/**
 * Formate une date ISO en chaîne lisible selon la locale française.
 * @param {string|null|undefined} dateString - Date au format ISO 8601.
 * @returns {string} Date formatée (ex. « 14 juin 2026, 17:30 ») ou « - » si absente.
 */
const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* ── Chargement initial des deux onglets au montage ────────── */
onMounted(() => {
  fetchUsers();
  fetchFeedbacks();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Transitions d'apparition du toast */
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Masque la scrollbar des onglets sur mobile tout en conservant le défilement */
.custom-scrollbar::-webkit-scrollbar {
  display: none;
}
.custom-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
