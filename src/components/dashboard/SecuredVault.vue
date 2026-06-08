<template>
  <div class="w-full font-['DM_Sans',_sans-serif]">
    <button
      type="button"
      @click="toggleVault"
      class="premium-card w-full flex items-center justify-between transition-all duration-300 hover:border-gray-200"
      :class="{
        'rounded-b-none border-b-transparent':
          isExpanded && sortedCharges.length > 0,
      }"
    >
      <div class="flex items-center gap-3 text-left">
        <span class="text-xl">🔒</span>
        <div>
          <p class="text-xs font-bold uppercase tracking-wider text-gray-400">
            Coffre de sécurité
          </p>
          <p class="text-sm sm:text-base font-bold text-gray-800 mt-0.5">
            Fonds sécurisés pour factures :
            <span class="text-[#5A877E] font-black">
              {{ Number(totalLockedFunds).toFixed(2) }}
              {{ currencyStore.currentCurrency.code }}
            </span>
          </p>
        </div>
      </div>

      <svg
        class="w-5 h-5 text-gray-400 transition-transform duration-300"
        :class="{ 'rotate-180': isExpanded }"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
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
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 -translate-y-2"
      enter-to-class="transform opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="transform opacity-100 translate-y-0"
      leave-to-class="transform opacity-0 -translate-y-2"
    >
      <div
        v-show="isExpanded"
        class="bg-white border border-t-0 border-gray-100 rounded-b-[24px] shadow-sm overflow-hidden px-5 pb-5 pt-1 space-y-3"
      >
        <div v-if="sortedCharges.length > 0" class="divide-y divide-gray-50">
          <div
            v-for="charge in sortedCharges"
            :key="charge.id"
            class="py-4 first:pt-1 last:pb-1 flex flex-col gap-3"
          >
            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-bold text-sm text-gray-800">
                  {{ charge.name }}
                </h4>
                <p class="text-xs text-gray-400 mt-0.5">
                  Échéance : {{ formatDate(charge.due_date) }}
                </p>
              </div>

              <div class="flex items-center gap-4">
                <div class="text-right">
                  <p class="font-bold text-sm text-gray-900">
                    {{
                      charge.is_fixed
                        ? Number(charge.exact_amount).toFixed(2)
                        : Number(charge.max_amount).toFixed(2)
                    }}
                    <span class="text-xs font-semibold text-gray-400 ml-0.5">{{
                      currencyStore.currentCurrency.code
                    }}</span>
                  </p>
                  <span
                    v-if="!charge.is_fixed"
                    class="inline-block text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-500 px-2 py-0.5 rounded-md mt-0.5"
                  >
                    Est. Max
                  </span>
                </div>

                <button
                  @click="openPaymentPrompt(charge)"
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
                class="bg-[#F8F6F2] p-4 rounded-2xl border border-gray-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1"
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
                      class="w-full pl-4 pr-14 py-2.5 border rounded-xl text-sm font-semibold outline-none bg-white transition-all shadow-sm"
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
                    Valider le paiement
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <div v-else class="text-center py-6 text-sm text-gray-400 font-medium">
          Aucune charge en attente de sécurisation pour ce mois.
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useCurrencyStore } from "@/stores/currency";

const props = defineProps({
  charges: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["settle-charge"]);

const currencyStore = useCurrencyStore();
const isExpanded = ref(false);

// États pour le mini-prompt de paiement
const activePaymentPrompt = ref(null);
const actualPaidInput = ref("");
const touchedPayment = ref(false);

const toggleVault = () => {
  isExpanded.value = !isExpanded.value;
};

// Tri chronologique des charges par Date d'échéance
const sortedCharges = computed(() => {
  return [...props.charges].sort((a, b) =>
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
