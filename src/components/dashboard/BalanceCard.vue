<template>
  <div
    :class="[
      'rounded-[24px] shadow-sm p-4 relative transition-colors duration-500 ease-in-out',
      isPositiveBalance ? 'bg-[#5B8C85] text-white' : 'bg-red-500 text-white',
    ]"
  >
    <transition
      enter-active-class="transition ease-out duration-300 transform"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-200 transform"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="toastMessage"
        class="absolute top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-lg z-10 flex items-center gap-2 text-sm font-semibold bg-white text-gray-800"
      >
        <svg
          v-if="toastType === 'success'"
          class="w-5 h-5 text-[#5B8C85]"
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
          class="w-5 h-5 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {{ toastMessage }}
      </div>
    </transition>

    <div class="flex justify-between items-center mb-1">
      <h2 class="text-lg font-semibold">Mon Solde Actuel</h2>
      <div class="flex items-center gap-3">
        <button
          @click="openExpenseModal"
          class="bg-white/20 hover:bg-white/30 text-white p-2.5 rounded-full transition-colors backdrop-blur-sm"
          title="Ajouter une dépense essentielle"
        >
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <button
          @click="$emit('add-income')"
          :class="[
            'bg-white p-2.5 rounded-full transition-colors shadow-sm',
            isPositiveBalance
              ? 'text-[#5B8C85] hover:bg-gray-50'
              : 'text-red-500 hover:bg-gray-50',
          ]"
          title="Ajouter un revenu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="text-4xl font-bold tracking-tight">
      {{ Number(financeStore.balance).toFixed(2) }}
      <span class="text-2xl font-medium ml-1">{{
        currencyStore.currentCurrency?.code || "TND"
      }}</span>
    </div>

    <!-- Elegantly nested secondary metric -->
    <div
      v-if="monthlySavings !== undefined"
      class="mt-4 px-4 py-2.5 bg-black/10 rounded-2xl flex items-center justify-between text-sm"
    >
      <div class="flex items-center gap-1.5 opacity-90">
        <svg
          class="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Montant sauvé ce mois-ci</span>
      </div>
      <span class="font-bold text-white">
        {{ Number(monthlySavings).toFixed(2) }}
        <span class="opacity-90 font-medium ml-1">{{
          currencyStore.currentCurrency?.code || "TND"
        }}</span>
      </span>
    </div>

    <!-- Unified Mastery Ratio Widget -->
    <div
      v-if="masteryPercentage !== undefined"
      class="mt-3 px-4 py-3 bg-black/10 rounded-2xl flex flex-col gap-2"
    >
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-[15px] font-bold text-white leading-tight">
            Taux d’achats évités
          </h3>
          <p class="text-xs text-white/80 mt-0.5">
            Sur vos intentions ce mois-ci
          </p>
        </div>
        <div class="bg-white/20 px-2.5 py-1 rounded-xl shadow-inner">
          <span class="text-lg font-black text-white">{{ masteryPercentage }}%</span>
        </div>
      </div>

      <!-- Barre de progression -->
      <div class="relative w-full pt-1">
        <div class="w-full h-3 bg-black/20 rounded-full overflow-hidden shadow-inner">
          <div
            class="h-full bg-white rounded-full transition-all duration-1000 ease-out shadow-sm"
            :style="{ width: `${masteryPercentage}%` }"
          ></div>
        </div>
      </div>

      <!-- Légende -->
      <div class="flex justify-between items-center text-[11px] font-medium text-white/80 mt-0.5">
        <span class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-white shadow-sm"></span>
          Achats abandonnés
        </span>
        <span class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-black/20 shadow-sm"></span>
          Achats effectués
        </span>
      </div>
    </div>

    <AddEssentialExpenseModal
      :show="showEssentialExpenseModal"
      @close="showEssentialExpenseModal = false"
      @save="handleSaveEssentialExpense"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useFinanceStore } from "@/stores/finance";
import { useCurrencyStore } from "@/stores/currency";
import AddEssentialExpenseModal from "@/components/finance/AddEssentialExpenseModal.vue";

const props = defineProps({
  monthlySavings: {
    type: [Number, String],
    default: 0,
  },
  masteryPercentage: {
    type: Number,
    default: undefined,
  },
});

const financeStore = useFinanceStore();
const currencyStore = useCurrencyStore();

const emit = defineEmits(["add-income"]);

// Logique d'affichage réactif
const isPositiveBalance = computed(() => Number(financeStore.balance) >= 0);

// État local
const showEssentialExpenseModal = ref(false);
const toastMessage = ref("");
const toastType = ref("success");

const showToast = (msg, type = "success") => {
  toastMessage.value = msg;
  toastType.value = type;
  setTimeout(() => {
    toastMessage.value = "";
  }, 4000);
};

const openExpenseModal = () => {
  showEssentialExpenseModal.value = true;
};

const handleSaveEssentialExpense = async (payload) => {
  try {
    await financeStore.addTransaction(payload);
    showEssentialExpenseModal.value = false;
    showToast("Dépense enregistrée avec succès.");
  } catch (error) {
    showToast("Erreur lors de l'enregistrement de la dépense.", "error");
    console.error("Erreur addTransaction :", error);
  }
};
</script>
