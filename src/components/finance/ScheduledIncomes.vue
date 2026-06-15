<template>
  <div class="premium-card mb-6 relative">
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="toastMessage"
        :class="[
          'absolute top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-lg z-10 flex items-center gap-2 text-sm font-semibold',
          toastType === 'success'
            ? 'bg-[#E1EBE8] text-[#5A877E]'
            : 'bg-red-100 text-red-700',
        ]"
      >
        {{ toastMessage }}
      </div>
    </transition>

    <div v-if="showHeader" class="flex justify-between items-center mb-3">
      <h3 class="text-lg sm:text-xl font-semibold text-slate-900">
        Mes revenus
      </h3>
    </div>

    <div
      v-if="currentIncomes.length === 0"
      class="text-sm text-gray-400 italic bg-gray-50 p-4 rounded-[16px] text-center"
    >
      Aucun revenu programmé.
    </div>

    <div v-else class="space-y-2">
      <transition-group
        tag="ul"
        class="space-y-1.5"
        enter-active-class="transition ease-out duration-200 transform"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150 transform"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <li
          v-for="income in displayedIncomes"
          :key="income.id"
          class="relative overflow-hidden rounded-[16px] bg-[#F8F6F2]"
        >
          <!-- Actions Container (underneath/revealed on swipe) -->
          <div
            class="absolute inset-y-0 right-0 flex items-center justify-end bg-gray-100 rounded-[16px] overflow-hidden transition-all duration-300"
            :style="{ width: activeSwipeId === income.id ? '110px' : '0px' }"
          >
            <button
              @click.stop="
                openEditModal(income);
                activeSwipeId = null;
              "
              class="h-full px-3.5 bg-[#5B8C85] text-white flex items-center justify-center transition-colors hover:bg-[#4a736d]"
              title="Modifier"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4.5 w-4.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                />
              </svg>
            </button>
            <button
              @click.stop="
                promptDelete(income.id);
                activeSwipeId = null;
              "
              class="h-full px-3.5 bg-red-500 text-white flex items-center justify-center transition-colors hover:bg-red-600"
              title="Supprimer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4.5 w-4.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>

          <!-- Content Row -->
          <div
            class="flex items-center justify-between p-3 gap-3 transition-transform duration-300 cursor-pointer select-none"
            :style="{
              transform:
                activeSwipeId === income.id
                  ? 'translateX(-110px)'
                  : 'translateX(0px)',
            }"
            @touchstart="handleTouchStart"
            @touchend="(e) => handleTouchEnd(income.id, e)"
            @click="toggleSwipe(income.id)"
          >
            <!-- Title -->
            <div class="min-w-0">
              <p class="font-bold text-sm text-gray-800 truncate">
                {{ income.name }}
              </p>
            </div>

            <!-- Amount + Frequency below -->
            <div class="text-right shrink-0">
              <p class="font-bold text-sm text-[#5B8C85]">
                +{{ Number(income.amount).toFixed(2) }}
                <span class="text-[10px] font-semibold text-gray-400 ml-0.5">
                  {{ currencyStore.currentCurrency?.code || "TND" }}
                </span>
              </p>
              <p class="text-[10px] text-gray-400 mt-0.5">
                {{ formatFrequency(income.frequency) }}
              </p>
            </div>
          </div>
        </li>
      </transition-group>
    </div>

    <!-- Voir tout moved to the bottom to match SecuredVault -->
    <div
      v-if="currentIncomes.length > limit && limit !== null"
      class="pt-3 text-center border-t border-gray-100 mt-2"
    >
      <router-link
        :to="{ name: 'incomes' }"
        class="inline-block px-4 py-2 text-[#5B8C85] text-sm font-bold hover:bg-[#F8F6F2] rounded-full transition-colors"
      >
        Voir tout
      </router-link>
    </div>

    <div
      v-if="showIncomeModal"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-40 p-4"
    >
      <div
        class="premium-card text-[#1F2937] w-full max-w-md font-['DM_Sans',_sans-serif] relative bg-white overflow-hidden rounded-3xl"
      >
        <div class="p-4 sm:p-1 relative">
          <h2 class="text-lg sm:text-2xl font-bold text-gray-900 text-center">
            {{ isEditing ? "Modifier le revenu" : "Ajouter un revenu" }}
          </h2>
        </div>

        <form @submit.prevent="submitIncome" novalidate>
          <div class="space-y-3 sm:space-y-4 px-4 sm:px-8 py-3 sm:py-4">
            <div class="space-y-1">
              <label
                class="block text-xs font-bold uppercase tracking-wider text-gray-500 ml-1"
                >Type de revenu</label
              >
              <CustomSelect
                v-model="newIncome.nameSelection"
                :options="incomeTypeOptions"
                :error="!!errors.name"
                placeholder="Sélectionnez un type..."
                @change="errors.name = ''"
              />

              <transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 -translate-y-2 h-0"
                enter-to-class="opacity-100 translate-y-0 h-auto"
              >
                <div
                  v-if="newIncome.nameSelection === 'OTHER'"
                  class="mt-1 sm:mt-2 space-y-1"
                >
                  <input
                    v-model="customIncomeName"
                    type="text"
                    placeholder="Précisez votre type de revenu..."
                    @input="errors.name = ''"
                    class="w-full px-4 py-3 sm:px-5 sm:py-4 border rounded-2xl sm:rounded-3xl text-sm sm:text-base text-[#1F2937] font-semibold outline-none transition-all shadow-sm bg-white"
                    :class="
                      errors.name
                        ? 'border-red-400 bg-red-50 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-2 focus:ring-[#5B8C85]'
                    "
                  />
                </div>
              </transition>
              <p
                v-if="errors.name"
                class="text-red-500 text-xs font-medium ml-2"
              >
                {{ errors.name }}
              </p>
            </div>

            <div class="space-y-1">
              <label
                class="block text-xs font-bold uppercase tracking-wider text-gray-500 ml-1"
                >Montant ({{
                  currencyStore.currentCurrency?.code || "TND"
                }})</label
              >
              <input
                v-model="newIncome.amount"
                type="number"
                step="1"
                min="1"
                placeholder="1000.00"
                @input="errors.amount = ''"
                class="w-full px-4 py-3 sm:px-5 sm:py-4 border rounded-2xl sm:rounded-3xl text-sm sm:text-base text-[#1F2937] font-semibold outline-none transition-all shadow-sm bg-white"
                :class="
                  errors.amount
                    ? 'border-red-400 bg-red-50 focus:ring-red-200'
                    : 'border-gray-200 focus:ring-2 focus:ring-[#5B8C85]'
                "
              />
              <p
                v-if="errors.amount"
                class="text-red-500 text-xs font-medium ml-2"
              >
                {{ errors.amount }}
              </p>
            </div>

            <div class="space-y-1">
              <label
                class="block text-xs font-bold uppercase tracking-wider text-gray-500 ml-1"
                >Fréquence</label
              >
              <CustomSelect
                v-model="newIncome.frequency"
                :options="frequencyOptions"
              />
            </div>

            <div v-if="newIncome.frequency !== 'ONE_TIME'" class="space-y-1">
              <label
                class="block text-xs font-bold uppercase tracking-wider text-gray-500 ml-1"
                >Date du prochain versement</label
              >
              <div class="relative">
                <input
                  v-model="newIncome.next_payment_date"
                  type="date"
                  :min="todayDate"
                  @input="errors.date = ''"
                  class="w-full px-4 py-3 sm:px-5 sm:py-4 border rounded-2xl sm:rounded-3xl text-sm sm:text-base font-semibold outline-none transition-all shadow-sm bg-white appearance-none pr-10 sm:pr-12"
                  :class="[
                    errors.date
                      ? 'border-red-400 bg-red-50 focus:ring-red-200'
                      : 'border-gray-200 focus:ring-2 focus:ring-[#5B8C85]',
                    !newIncome.next_payment_date
                      ? 'text-gray-400'
                      : 'text-[#1F2937]',
                  ]"
                />
                <!-- Icône Calendrier -->
                <div
                  class="absolute right-4 sm:right-5 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400"
                >
                  <svg
                    class="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <p
                v-if="errors.date"
                class="text-red-500 text-xs font-medium ml-2"
              >
                {{ errors.date }}
              </p>
            </div>
          </div>

          <div class="p-4 sm:p-8 pt-2 sm:pt-4 flex gap-3 bg-white mt-1">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 py-2.5 sm:py-3.5 border border-gray-300 text-gray-700 font-bold rounded-2xl sm:rounded-[2rem] hover:bg-gray-50 transition-all active:scale-[0.99] text-sm sm:text-base"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="flex-1 bg-[#5B8C85] text-white py-2.5 sm:py-3.5 font-bold rounded-2xl sm:rounded-[2rem] hover:bg-[#4a736d] transition-all active:scale-[0.99] shadow-lg shadow-[#5B8C85]/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? "Enregistrement..." : "Enregistrer" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div
        class="premium-card text-[#1F2937] w-full max-w-sm font-['DM_Sans',_sans-serif] relative bg-white overflow-hidden rounded-3xl text-center p-6 sm:p-8"
      >
        <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-2">
          Supprimer ce revenu ?
        </h3>
        <p class="text-sm text-gray-500 mb-6">Cette action est irréversible.</p>
        <div class="flex gap-3">
          <button
            @click="showDeleteModal = false"
            class="flex-1 py-2.5 sm:py-3 border border-gray-300 text-gray-700 font-bold rounded-2xl sm:rounded-[2rem] hover:bg-gray-50 transition-all active:scale-[0.99] text-sm"
          >
            Annuler
          </button>
          <button
            @click="executeDelete"
            class="flex-1 py-2.5 sm:py-3 bg-red-500 text-white font-bold rounded-2xl sm:rounded-[2rem] hover:bg-red-600 transition-all active:scale-[0.99] shadow-lg shadow-red-500/20 text-sm"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useFinanceStore } from "@/stores/finance";
import { useCurrencyStore } from "@/stores/currency";
import { useUiStore } from "@/stores/ui";
import CustomSelect from "@/components/shared/CustomSelect.vue";

const props = defineProps({
  limit: { type: Number, default: 3 },
  showHeader: { type: Boolean, default: true },
  customIncomes: { type: Array, default: null },
});

const uiStore = useUiStore();

const activeSwipeId = ref(null);
const touchStartX = ref(0);
const touchStartY = ref(0);
const swipeThreshold = 30;

const handleTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX;
  touchStartY.value = e.touches[0].clientY;
};

const handleTouchEnd = (incomeId, e) => {
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;
  const diffX = touchStartX.value - touchEndX;
  const diffY = Math.abs(touchStartY.value - touchEndY);

  if (diffX > swipeThreshold && diffY < 50) {
    activeSwipeId.value = incomeId;
  } else if (diffX < -swipeThreshold && diffY < 50) {
    if (activeSwipeId.value === incomeId) {
      activeSwipeId.value = null;
    }
  }
};

const toggleSwipe = (incomeId) => {
  if (activeSwipeId.value === incomeId) {
    activeSwipeId.value = null;
  } else {
    activeSwipeId.value = incomeId;
  }
};

const financeStore = useFinanceStore();
const currencyStore = useCurrencyStore();

const showIncomeModal = ref(false);

watch(showIncomeModal, (isOpen) => {
  uiStore.isNavBarHidden = isOpen;
});
const showDeleteModal = ref(false);
const incomeToDeleteId = ref(null);
const isSubmitting = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const errors = ref({ name: "", amount: "", date: "" });
const toastMessage = ref("");
const toastType = ref("success");

const showToast = (msg, type = "success") => {
  toastMessage.value = msg;
  toastType.value = type;
  setTimeout(() => {
    toastMessage.value = "";
  }, 4000);
};

const currentIncomes = computed(() => {
  return props.customIncomes !== null
    ? props.customIncomes
    : financeStore.incomes;
});

const displayedIncomes = computed(() => {
  if (!currentIncomes.value) return [];
  if (props.limit === null) return currentIncomes.value;
  return currentIncomes.value.slice(0, props.limit);
});

const todayDate = computed(() => new Date().toISOString().split("T")[0]);

const popularIncomeTypes = [
  "Salaire",
  "Freelance",
  "Prime",
  "Aide familiale",
  "Bourse d'études",
  "Revenus locatifs",
  "Remboursement",
];
const incomeTypeOptions = [
  ...popularIncomeTypes.map((t) => ({ value: t, label: t })),
  { value: "OTHER", label: "Autre (préciser)..." },
];
const frequencyOptions = [
  { value: "ONE_TIME", label: "Une seule fois" },
  { value: "MONTHLY", label: "Mensuel" },
  { value: "WEEKLY", label: "Hebdomadaire" },
  { value: "YEARLY", label: "Annuel" },
];

const customIncomeName = ref("");
const newIncome = ref({
  nameSelection: "",
  amount: "",
  frequency: "MONTHLY",
  next_payment_date: todayDate.value,
});

onMounted(() => {
  financeStore.fetchFinanceData();
});

// EXPORT de la méthode pour le composant parent
const openAddModal = () => {
  isEditing.value = false;
  editingId.value = null;
  errors.value = { name: "", amount: "", date: "" };
  customIncomeName.value = "";
  newIncome.value = {
    nameSelection: "",
    amount: "",
    frequency: "MONTHLY",
    next_payment_date: todayDate.value,
  };
  uiStore.isNavBarHidden = true;
  showIncomeModal.value = true;
};
defineExpose({ openAddModal });

const openEditModal = (income) => {
  isEditing.value = true;
  editingId.value = income.id;
  errors.value = { name: "", amount: "", date: "" };
  if (popularIncomeTypes.includes(income.name)) {
    newIncome.value.nameSelection = income.name;
    customIncomeName.value = "";
  } else {
    newIncome.value.nameSelection = "OTHER";
    customIncomeName.value = income.name;
  }
  newIncome.value.amount = income.amount;
  newIncome.value.frequency = income.frequency;
  newIncome.value.next_payment_date =
    income.next_payment_date || todayDate.value;
  uiStore.isNavBarHidden = true;
  showIncomeModal.value = true;
};

const closeModal = () => {
  uiStore.isNavBarHidden = false;
  showIncomeModal.value = false;
};

const promptDelete = (id) => {
  incomeToDeleteId.value = id;
  showDeleteModal.value = true;
};

const executeDelete = async () => {
  try {
    await financeStore.deleteIncome(incomeToDeleteId.value);
    showDeleteModal.value = false;
    showToast("Revenu supprimé avec succès.");
  } catch (error) {
    showDeleteModal.value = false;
    showToast("Erreur lors de la suppression.", "error");
  }
};

const validateForm = (finalName) => {
  errors.value = { name: "", amount: "", date: "" };
  let isValid = true;
  if (!finalName || finalName.trim() === "") {
    errors.value.name = "Veuillez préciser le type de revenu.";
    isValid = false;
  }
  if (!newIncome.value.amount) {
    errors.value.amount = "Veuillez entrer un montant.";
    isValid = false;
  } else if (Number(newIncome.value.amount) <= 0) {
    errors.value.amount = "Le montant doit être supérieur à zéro.";
    isValid = false;
  } else if (
    newIncome.value.amount.toString().includes(".") &&
    newIncome.value.amount.toString().split(".")[1].length > 2
  ) {
    errors.value.amount = "Le montant ne peut pas avoir plus de 2 décimales.";
    isValid = false;
  }

  if (
    newIncome.value.frequency !== "ONE_TIME" &&
    !newIncome.value.next_payment_date
  ) {
    errors.value.date = "Veuillez sélectionner une date.";
    isValid = false;
  }
  return isValid;
};

const submitIncome = async () => {
  const finalName =
    newIncome.value.nameSelection === "OTHER"
      ? customIncomeName.value
      : newIncome.value.nameSelection;
  if (!validateForm(finalName)) return;

  isSubmitting.value = true;
  const payload = {
    name: finalName,
    amount: newIncome.value.amount,
    frequency: newIncome.value.frequency,
    next_payment_date:
      newIncome.value.frequency === "ONE_TIME"
        ? null
        : newIncome.value.next_payment_date,
  };

  try {
    if (isEditing.value) {
      await financeStore.updateIncome(editingId.value, payload);
      showToast("Revenu modifié avec succès.");
    } else {
      await financeStore.addIncome(payload);
      showToast("Revenu ajouté avec succès.");
    }
    closeModal();
  } catch (error) {
    showToast("Une erreur est survenue.", "error");
  } finally {
    isSubmitting.value = false;
  }
};

const formatDate = (dateString) =>
  dateString ? new Date(dateString).toLocaleDateString("fr-FR") : "";
const formatFrequency = (freq) =>
  ({
    ONE_TIME: "Une fois",
    DAILY: "Quotidien",
    WEEKLY: "Hebdomadaire",
    MONTHLY: "Mensuel",
    YEARLY: "Annuel",
  })[freq] || freq;
</script>

<style scoped>
/* Masquer les flèches natives sur les inputs de type number */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}

/* Style uniforme pour le date picker */
input[type="date"]::-webkit-calendar-picker-indicator {
  background: transparent;
  bottom: 0;
  color: transparent;
  cursor: pointer;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: auto;
  height: auto;
}
</style>
