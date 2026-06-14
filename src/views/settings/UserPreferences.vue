<template>
  <div
    class="min-h-screen bg-[#F8F6F2] font-['DM_Sans',_sans-serif] flex justify-center"
  >
    <div class="w-full max-w-3xl px-4 sm:px-6 md:px-8 py-6 sm:py-8 lg:py-10">
      <SettingsPageHeader title="Mes préférences" />

      <section class="premium-card mb-6 sm:mb-8">
        <div class="flex items-center gap-3 group">
          <img
            src="../../assets/Sport%20Stopwatch.png"
            alt="Timer Icon"
            class="w-6 h-6 sm:w-8 sm:h-8 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3"
          />
          <h2 class="text-xl sm:text-2xl font-bold text-[#000000]">
            Période de réflexion
          </h2>
        </div>
        <p
          class="mt-3 sm:mt-4 text-[#6B7280] text-[14px] sm:text-[16px] leading-relaxed"
        >
          Temps d'attente imposé avant de valider un achat impulsif.
        </p>
        <div class="mt-6 sm:mt-8 mb-2">
          <input
            type="range"
            min="0"
            max="3"
            step="1"
            v-model="periodIndex"
            class="custom-slider w-full transition-all"
          />
          <div class="flex justify-between mt-4 px-1">
            <span
              v-for="(label, index) in labels"
              :key="index"
              @click="periodIndex = index"
              class="text-[13px] sm:text-[15px] cursor-pointer transition-colors duration-200"
              :class="
                periodIndex == index
                  ? 'text-[#5B8C85] font-bold'
                  : 'text-[#9CA3AF] font-normal hover:text-[#5B8C85]'
              "
            >
              {{ label }}
            </span>
          </div>
        </div>
      </section>

      <h2
        class="text-xl sm:text-2xl font-bold text-[#000000] mb-3 sm:mb-4 mt-6 sm:mt-8 px-1 sm:px-2"
      >
        Configuration
      </h2>
      <section class="premium-card mb-6 sm:mb-8">
        <div class="mb-6 sm:mb-8 relative z-50">
          <h3 class="text-lg sm:text-xl font-bold text-[#000000] mb-2 sm:mb-3">
            Devise
          </h3>
          <div class="relative w-full">
            <button
              @click="isDropdownOpen = !isDropdownOpen"
              class="w-full flex items-center justify-between border border-[#D9D9D9] bg-[#FFFFFF] rounded-[12px] sm:rounded-[15px] px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-[#5B8C85]/30 hover:shadow-sm transition-all group"
            >
              <div class="flex items-center gap-2 sm:gap-3">
                <img
                  :src="`https://flagcdn.com/w40/${selectedCurrency.countryCode}.png`"
                  :alt="selectedCurrency.code"
                  class="w-6 sm:w-7 object-cover rounded-[2px] shadow-sm transition-transform duration-300 group-hover:scale-105"
                />
                <span
                  class="text-[15px] sm:text-base text-[#9CA3AF] font-medium group-hover:text-gray-700 transition-colors"
                >
                  {{ selectedCurrency.code }}
                </span>
              </div>
              <svg
                class="w-4 h-4 sm:w-5 sm:h-5 text-[#9CA3AF] transition-all duration-300 group-hover:text-[#5B8C85]"
                :class="{ 'rotate-180 text-[#5B8C85]': isDropdownOpen }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <ul
                v-if="isDropdownOpen"
                class="absolute z-50 w-full mt-2 bg-[#FFFFFF] border border-[#D9D9D9] rounded-[12px] sm:rounded-[15px] shadow-lg max-h-60 overflow-y-auto py-2"
              >
                <li
                  v-for="currency in currencies"
                  :key="currency.code"
                  @click="selectCurrency(currency)"
                  class="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 cursor-pointer hover:bg-[#F8F6F2] transition-colors"
                  :class="{
                    'bg-[#F8F6F2] font-bold':
                      selectedCurrency.code === currency.code,
                  }"
                >
                  <img
                    :src="`https://flagcdn.com/w40/${currency.countryCode}.png`"
                    :alt="currency.code"
                    class="w-6 sm:w-7 object-cover rounded-[2px] shadow-sm"
                  />
                  <span
                    class="text-[14px] sm:text-[15px] text-[#6B7280] font-medium"
                  >
                    {{ currency.code }} - {{ currency.name }}
                  </span>
                </li>
              </ul>
            </transition>
          </div>
        </div>

        <div>
          <h3 class="text-lg sm:text-xl font-bold text-[#000000] mb-2 sm:mb-3">
            Niveau de rigueur d'évaluation
          </h3>
          <div
            class="bg-[#E5E7EB]/70 shadow-inner rounded-[12px] sm:rounded-[15px] p-1 sm:p-1.5 flex w-full relative"
          >
            <button
              v-for="(level, index) in rigueurLevels"
              :key="level"
              @click="selectedRigueur = level"
              class="flex-1 py-2 sm:py-2.5 px-1 sm:px-0 text-center text-[13px] sm:text-[15px] transition-all duration-300 z-10 rounded-[10px] sm:rounded-[12px] whitespace-nowrap"
              :class="
                selectedRigueur === level
                  ? 'text-[#5B8C85] font-bold shadow-md bg-[#FFFFFF] scale-[1.02]'
                  : 'text-[#9CA3AF] font-medium hover:text-[#6B7280] hover:bg-white/40'
              "
            >
              {{ level }}
            </button>
          </div>
        </div>
      </section>

      <h2
        class="text-xl sm:text-2xl font-bold text-[#000000] mb-3 sm:mb-4 mt-6 sm:mt-8 px-1 sm:px-2"
      >
        Notifications
      </h2>
      <section class="premium-card mb-6 sm:mb-8">
        <div class="flex items-center justify-between gap-3 sm:gap-4 group">
          <div class="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <div
              class="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex justify-center items-center text-[#5B8C85] bg-gradient-to-br from-[#F8F6F2] to-[#E5E7EB] shadow-inner rounded-full transition-transform duration-300 group-hover:scale-105"
            >
              <svg
                class="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-sm transition-transform duration-300 group-hover:rotate-12"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z"
                />
                <path
                  d="M4 19H20"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <h3
                class="text-[15px] sm:text-[17px] font-bold text-[#000000] leading-tight sm:leading-normal transition-colors group-hover:text-[#5B8C85]"
              >
                Alerte de fin de période
              </h3>
              <p
                class="text-[13px] sm:text-[15px] text-[#9CA3AF] mt-1 sm:mt-0.5 leading-snug"
              >
                Recevoir un mail avant la fin de<br
                  class="hidden sm:inline"
                />période de réflexion
              </p>
            </div>
          </div>
          <button
            @click="notificationsEnabled = !notificationsEnabled"
            class="relative inline-flex h-[28px] w-[50px] sm:h-[32px] sm:w-[56px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out shadow-inner focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8C85] focus-visible:ring-opacity-75"
            :class="notificationsEnabled ? 'bg-[#5B8C85]' : 'bg-[#E5E7EB]'"
            role="switch"
            :aria-checked="notificationsEnabled.toString()"
          >
            <span class="sr-only">Activer les notifications</span>
            <span
              aria-hidden="true"
              class="pointer-events-none inline-block h-[20px] w-[20px] sm:h-[24px] sm:w-[24px] transform rounded-full bg-[#FFFFFF] shadow-md ring-0 transition-transform duration-200 ease-in-out"
              :class="
                notificationsEnabled
                  ? 'translate-x-[22px] sm:translate-x-[24px]'
                  : 'translate-x-[4px]'
              "
            />
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
/**
 * @module UserPreferences
 * @description Page de configuration des préférences utilisateur.
 *
 * Trois sections indépendantes, chacune persistée en temps réel via `PATCH /users/me/` :
 * - **Période de réflexion** : durée de cooldown imposée avant validation d'un achat
 *   impulsif (12 h, 24 h, 48 h ou 72 h).
 * - **Configuration** : sélection de la devise d'affichage et du niveau de rigueur
 *   d'évaluation IA (« Indulgent », « Équilibré », « Impitoyable »).
 * - **Notifications** : activation/désactivation de l'alerte e-mail de fin
 *   de période de réflexion.
 *
 * Chaque préférence est synchronisée de manière bidirectionnelle avec le store
 * d'authentification via un couple de watchers (store → UI au montage,
 * UI → API au changement).
 *
 * @requires vue - computed, ref, watch
 * @requires @/stores/currency - Store Pinia de gestion des devises (useCurrencyStore)
 * @requires @/stores/auth - Store Pinia d'authentification (useAuthStore)
 * @requires @/services/api - Client HTTP configuré (axios)
 * @requires @/components/shared/SettingsPageHeader.vue - En-tête réutilisable des pages paramètres
 */
import { computed, ref, watch } from "vue";
import { useCurrencyStore } from "@/stores/currency";
import { useAuthStore } from "@/stores/auth";
import api from "@/services/api";
import SettingsPageHeader from "@/components/shared/SettingsPageHeader.vue";

const authStore = useAuthStore();

/* ── Section : Période de réflexion ────────────────────────── */

/** @type {string[]} Libellés affichés sous le curseur du slider */
const labels = ["12h", "24h", "48h", "72h"];

/** @type {number[]} Valeurs en heures correspondant à chaque position du slider */
const periodValues = [12, 24, 48, 72];

/** @type {import('vue').Ref<number>} Index courant du slider (0–3) */
const periodIndex = ref(1);

/** Synchronise le slider avec la préférence stockée dans le profil au montage */
watch(
  () => authStore.user?.cooldown_preference,
  (newVal) => {
    if (newVal) {
      const idx = periodValues.indexOf(newVal);
      if (idx !== -1 && periodIndex.value !== idx) {
        periodIndex.value = idx;
      }
    }
  },
  { immediate: true },
);

/** Persiste la période de réflexion dès que le slider change, sauf si la valeur est déjà identique */
watch(periodIndex, async (newIndex) => {
  const selectedHours = periodValues[newIndex];
  if (authStore.user?.cooldown_preference === selectedHours) return;

  try {
    await api.patch("/users/me/", { cooldown_preference: selectedHours });
    if (authStore.user) {
      authStore.user.cooldown_preference = selectedHours;
    }
  } catch (err) {
    console.error("Erreur de sauvegarde de la préférence", err);
  }
});

/* ── Section : Sélecteur de devise ──────────────────────────── */

/** @type {import('vue').Ref<boolean>} Contrôle l'ouverture du dropdown de devises */
const isDropdownOpen = ref(false);
const currencyStore = useCurrencyStore();

/** @type {Array<{code: string, name: string, countryCode: string}>} Liste des devises disponibles */
const currencies = currencyStore.availableCurrencies;

/** @type {import('vue').ComputedRef<{code: string, name: string, countryCode: string}>} Devise actuellement sélectionnée */
const selectedCurrency = computed(() => currencyStore.currentCurrency);

/**
 * Sélectionne une devise, la persiste dans le store et ferme le dropdown.
 * @param {{code: string, name: string, countryCode: string}} currency - Devise choisie.
 */
const selectCurrency = (currency) => {
  currencyStore.setCurrency(currency);
  isDropdownOpen.value = false;
};

/* ── Section : Niveau de rigueur d'évaluation IA ────────────── */

/** @type {string[]} Niveaux de rigueur disponibles */
const rigueurLevels = ["Indulgent", "Équilibré", "Impitoyable"];

/** @type {import('vue').Ref<string>} Niveau de rigueur actuellement sélectionné */
const selectedRigueur = ref("Équilibré");

/* ── Section : Notifications de fin de période ──────────────── */

/** @type {import('vue').Ref<boolean>} État du toggle de notification e-mail */
const notificationsEnabled = ref(true);

/** Synchronise le toggle avec la préférence stockée dans le profil au montage */
watch(
  () => authStore.user?.wants_cooldown_reminders,
  (newVal) => {
    if (newVal !== undefined && notificationsEnabled.value !== newVal) {
      notificationsEnabled.value = newVal;
    }
  },
  { immediate: true },
);

/**
 * Persiste la préférence de notification dès que le toggle change.
 * En cas d'échec réseau, restaure la valeur précédente pour éviter
 * une désynchronisation entre l'UI et le serveur.
 */
watch(notificationsEnabled, async (newVal) => {
  if (authStore.user?.wants_cooldown_reminders === newVal) return;

  try {
    await api.patch("/users/me/", { wants_cooldown_reminders: newVal });
    if (authStore.user) {
      authStore.user.wants_cooldown_reminders = newVal;
    }
  } catch (err) {
    console.error(
      "Erreur lors de la sauvegarde de la préférence de notification",
      err,
    );
    notificationsEnabled.value = !newVal;
  }
});

/** Synchronise le niveau de rigueur avec la préférence stockée dans le profil au montage */
watch(
  () => authStore.user?.evaluation_rigor,
  (newVal) => {
    if (newVal && rigueurLevels.includes(newVal)) {
      if (selectedRigueur.value !== newVal) {
        selectedRigueur.value = newVal;
      }
    }
  },
  { immediate: true },
);

/** Persiste le niveau de rigueur dès que la sélection change */
watch(selectedRigueur, async (newVal) => {
  if (authStore.user?.evaluation_rigor === newVal) return;
  try {
    await api.patch("/users/me/", { evaluation_rigor: newVal });
    if (authStore.user) {
      authStore.user.evaluation_rigor = newVal;
    }
  } catch (err) {
    console.error("Erreur de sauvegarde du niveau de rigueur", err);
  }
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap");

.custom-slider {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
}
.custom-slider:focus {
  outline: none;
}
.custom-slider::-webkit-slider-runnable-track {
  width: 100%;
  height: 12px;
  cursor: pointer;
  background: #e5e7eb;
  border-radius: 9999px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}
.custom-slider::-moz-range-track {
  width: 100%;
  height: 12px;
  cursor: pointer;
  background: #e5e7eb;
  border-radius: 9999px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}
.custom-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 26px;
  width: 26px;
  border-radius: 50%;
  background: #5b8c85;
  cursor: pointer;
  margin-top: -7px;
  border: 4px solid #ffffff;
  box-shadow: 0 0 12px 2px rgba(199, 210, 254, 0.6);
  transition: transform 0.2s;
}
.custom-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}
.custom-slider::-moz-range-thumb {
  height: 26px;
  width: 26px;
  border-radius: 50%;
  background: #5b8c85;
  cursor: pointer;
  border: 4px solid #ffffff;
  box-shadow: 0 0 12px 2px rgba(199, 210, 254, 0.6);
  transition: transform 0.2s;
}
.custom-slider::-moz-range-thumb:hover {
  transform: scale(1.1);
}
</style>
