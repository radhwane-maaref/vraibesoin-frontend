<template>
  <div
    :class="[
      'rounded-[24px] shadow-sm p-6 mb-6 relative transition-colors duration-500 ease-in-out',
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

    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold opacity-90">Mon Solde Actuel</h2>
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

    <div class="text-5xl font-bold mb-1 tracking-tight">
      {{ Number(financeStore.balance).toFixed(2) }}
      <span class="text-2xl font-medium opacity-80 ml-1">{{
        currencyStore.currentCurrency?.code || "TND"
      }}</span>
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
