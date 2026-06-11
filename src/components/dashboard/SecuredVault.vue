<template>
  <div class="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col gap-4 font-['DM_Sans',_sans-serif]">
    <!-- Header: Title and Add button -->
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-bold text-gray-900">Mes charges</h3>
        <p class="text-xs text-gray-400 mt-0.5">
          Vos abonnements, loyers et factures prévus
        </p>
      </div>
      <button
        @click="handleAddCharge"
        class="flex items-center gap-1.5 px-4 py-2 bg-[#E1EBE8] text-[#5B8C85] rounded-full text-xs font-bold hover:bg-[#d2e2de] transition-colors active:scale-95"
      >
        <svg
          class="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Ajouter
      </button>
    </div>

    <!-- Vault Summary Banner -->
    <div class="bg-[#F8F6F2] rounded-2xl p-4 border border-gray-100 flex items-center justify-between mt-2">
      <div class="flex items-center gap-3 text-left">
        <span class="text-2xl">🔒</span>
        <div>
          <p class="text-xs font-bold uppercase tracking-wider text-gray-400">
            Coffre de sécurité
          </p>
          <p class="text-sm sm:text-base font-bold text-gray-800 mt-0.5">
            Fonds sécurisés :
            <span class="text-[#5A877E] font-black">
              {{ Number(totalLockedFunds).toFixed(2) }}
              {{ currencyStore.currentCurrency.code }}
            </span>
          </p>
        </div>
      </div>
    </div>

    <!-- List of charges -->
    <div v-if="sortedCharges.length > 0" class="space-y-3 mt-2">
      <div
        v-for="charge in sortedCharges"
        :key="charge.id"
        class="flex flex-col gap-3 p-4 bg-[#F8F6F2]/50 rounded-2xl border border-gray-50 hover:border-gray-200 transition-all group"
      >
        <div class="flex items-center justify-between cursor-pointer" @click="handleEditCharge(charge)">
          <div>
            <h4 class="font-bold text-sm text-gray-800 group-hover:text-[#5B8C85] transition-colors">
              {{ charge.name }}
            </h4>
            <p class="text-xs text-gray-400 mt-0.5">
              Échéance : {{ formatDate(charge.due_date) }}
            </p>
          </div>

          <div class="flex items-center gap-4">
            <div class="text-right">
              <p class="font-bold text-sm text-gray-900">
                <span v-if="charge.is_fixed">
                  {{ Number(charge.exact_amount).toFixed(2) }}
                </span>
                <span v-else class="text-xs font-bold text-gray-600">
                  {{ Number(charge.min_amount).toFixed(0) }}-{{
                    Number(charge.max_amount).toFixed(0)
                  }}
                </span>
                <span class="text-xs font-semibold text-gray-400 ml-1">{{
                  currencyStore.currentCurrency.code
                }}</span>
              </p>
              <span
                v-if="!charge.is_fixed"
                class="inline-block text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-500 px-2 py-0.5 rounded-md mt-0.5"
              >
                Max Sécurisé: {{ Number(charge.max_amount).toFixed(0) }}
              </span>
            </div>

            <button
              @click.stop="openPaymentPrompt(charge)"
              class="px-4 py-2 bg-[#E1EBE8] text-[#5A877E] hover:bg-[#d2e2de] text-xs font-bold rounded-full transition-colors active:scale-95"
            >
              Régler
            </button>
          </div>
        </div>

        <transition
          enter-active-class="transition ease-out duration-150"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition ease-in duration-100"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="activePaymentPrompt?.id === charge.id"
            class="bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1 shadow-sm"
          >
            <div class="flex-1">
              <label class="block text-xs font-bold text-gray-600 mb-1">
                Combien avez-vous réellement payé ?
              </label>
              <div class="relative max-w-xs">
                <input
                  type="number"
                  v-model="actualPaidInput"
                  @blur="touchedPayment = true"
                  step="0.01"
                  :placeholder="
                    charge.is_fixed
                      ? Number(charge.exact_amount).toFixed(2)
                      : Number(charge.max_amount).toFixed(2)
                  "
                  class="w-full pl-4 pr-14 py-2.5 border rounded-xl text-sm font-semibold outline-none bg-gray-50 transition-all"
                  :class="
                    isPaymentInvalid
                      ? 'border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50'
                      : 'border-gray-200 focus:ring-2 focus:ring-[#5A877E]'
                  "
                />
                <div
                  class="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs font-bold text-gray-400"
                >
                  {{ currencyStore.currentCurrency.code }}
                </div>
              </div>
              <p
                v-if="isPaymentInvalid"
                class="text-[11px] text-red-500 font-medium mt-1 ml-1"
              >
                Le montant doit être un nombre strictement supérieur à 0.
              </p>
            </div>

            <div class="flex items-center gap-2 self-end sm:self-center">
              <button
                @click="closePaymentPrompt"
                class="px-3 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors"
              >
                Annuler
              </button>
              <button
                @click="submitPayment(charge.id)"
                :disabled="isPaymentInvalid || !actualPaidInput"
                class="px-4 py-2.5 bg-[#5A877E] hover:bg-[#4a7269] text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Valider
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <div v-else class="text-center py-6">
      <p class="text-sm text-gray-400 font-medium">
        Aucune charge enregistrée pour le moment.
      </p>
    </div>

    <!-- Voir tout moved to the bottom -->
    <div v-if="showAllLink" class="pt-3 text-center border-t border-gray-100 mt-2">
      <router-link
        :to="{ name: 'charges' }"
        class="inline-block px-4 py-2 text-[#5B8C85] text-sm font-bold hover:bg-[#F8F6F2] rounded-full transition-colors"
      >
        Voir tout
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useCurrencyStore } from "@/stores/currency";
import { useUiStore } from "@/stores/ui";

const props = defineProps({
  charges: {
    type: Array,
    default: () => [],
  },
  limit: {
    type: Number,
    default: 3,
  },
  showAllLink: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["settle-charge", "add-charge", "edit-charge"]);

const currencyStore = useCurrencyStore();
const uiStore = useUiStore();

const handleAddCharge = () => {
  uiStore.isNavBarHidden = true;
  emit("add-charge");
};

const handleEditCharge = (charge) => {
  uiStore.isNavBarHidden = true;
  emit("edit-charge", charge);
};

// États pour le mini-prompt de paiement
const activePaymentPrompt = ref(null);
const actualPaidInput = ref("");
const touchedPayment = ref(false);

// Tri chronologique des charges par Date d'échéance (limité aux `limit` plus récents ajouts)
const sortedCharges = computed(() => {
  let list = [...props.charges];

  if (props.limit && props.limit > 0 && list.length > props.limit) {
    // Les plus récemment ajoutés (par id décroissant)
    list.sort((a, b) => b.id - a.id);
    list = list.slice(0, props.limit);
  }

  // Ensuite, tri par date d'échéance
  return list.sort((a, b) =>
    new String(a.due_date).localeCompare(b.due_date),
  );
});

// Somme globale des fonds bloqués (Montant exact si fixe, Montant max si variable)
const totalLockedFunds = computed(() => {
  return props.charges.reduce((sum, charge) => {
    const chargeValue = charge.is_fixed
      ? parseFloat(charge.exact_amount)
      : parseFloat(charge.max_amount);
    return sum + (isNaN(chargeValue) ? 0 : chargeValue);
  }, 0);
});

// Validation critique du paiement saisi à la volée
const isPaymentInvalid = computed(() => {
  if (!touchedPayment.value || !actualPaidInput.value) return false;
  const parsed = parseFloat(actualPaidInput.value);
  return isNaN(parsed) || parsed <= 0;
});

// Ouvre le prompt et configure les valeurs par défaut intelligentes (UX Detail)
const openPaymentPrompt = (charge) => {
  touchedPayment.value = false;
  activePaymentPrompt.value = charge;

  // Remplissage automatique intelligent selon la spécification
  if (charge.is_fixed) {
    actualPaidInput.value = charge.exact_amount;
  } else {
    // Si variable, on pré-remplit avec le maximum d'estimation pour simplifier la saisie rapide
    actualPaidInput.value = charge.max_amount;
  }
};

const closePaymentPrompt = () => {
  activePaymentPrompt.value = null;
  actualPaidInput.value = "";
  touchedPayment.value = false;
};

const submitPayment = (chargeId) => {
  const amount = parseFloat(actualPaidInput.value);
  if (isNaN(amount) || amount <= 0) return;

  // Émission de l'événement vers le tableau de bord pour traitement API
  emit("settle-charge", {
    id: chargeId,
    actual_amount: amount,
  });

  closePaymentPrompt();
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
};
</script>

<style scoped>
/* Suppression des flèches sur les inputs de type number */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
