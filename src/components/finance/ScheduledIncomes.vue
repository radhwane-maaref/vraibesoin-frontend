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

    <h3
      class="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider ml-1"
    >
      Mes revenus
    </h3>

    <div
      v-if="financeStore.incomes.length === 0"
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
          class="flex items-center justify-between bg-[#F8F6F2] p-3 rounded-[16px] gap-3 transition-all hover:shadow-sm group"
        >
          <div class="flex-1 min-w-0">
            <p
              class="font-bold text-sm text-gray-800 truncate group-hover:text-[#5B8C85] transition-colors"
            >
              {{ income.name }}
            </p>
            <p
              v-if="income.frequency !== 'ONE_TIME'"
              class="text-[11px] text-gray-500 mt-0.5"
            >
              Prochain : {{ formatDate(income.next_payment_date) }}
            </p>
          </div>

          <div class="flex items-center gap-4">
            <div class="text-right">
              <p class="font-bold text-sm text-[#5B8C85]">
                +{{ Number(income.amount).toFixed(2) }}
                <span class="text-[10px] font-semibold text-gray-400 ml-0.5">{{
                  currencyStore.currentCurrency?.code || "TND"
                }}</span>
              </p>
              <p class="text-[11px] text-gray-400 mt-0.5">
                {{ formatFrequency(income.frequency) }}
              </p>
            </div>

            <div class="flex items-center gap-1">
              <button
                @click="openEditModal(income)"
                class="p-1.5 text-gray-400 hover:text-[#5B8C85] hover:bg-[#E1EBE8] rounded-lg transition-colors"
                title="Modifier"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                  />
                </svg>
              </button>
              <button
                @click="promptDelete(income.id)"
                class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Supprimer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
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
          </div>
        </li>
      </transition-group>

      <div
        v-if="financeStore.incomes.length > 3"
        class="pt-1 flex justify-center"
      >
        <button
          type="button"
          @click="isExpanded = !isExpanded"
          class="flex items-center gap-1 text-xs font-bold text-[#5B8C85] hover:text-[#4a736d] bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-full transition-all border border-gray-100 shadow-sm"
        >
          <span>{{
            isExpanded
              ? "Voir moins"
              : `Voir plus (${financeStore.incomes.length - 3})`
          }}</span>
          <svg
            class="w-3 h-3 transition-transform duration-300"
            :class="{ 'rotate-180': isExpanded }"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="3"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
    </div>

    <div
      v-if="showIncomeModal"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-40 p-4"
    >
      <div class="premium-card w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold text-gray-900 mb-6">
          {{ isEditing ? "Modifier le revenu" : "Ajouter un revenu" }}
        </h3>
        <form @submit.prevent="submitIncome">
          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-2"
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
              <div v-if="newIncome.nameSelection === 'OTHER'" class="mt-3">
                <input
                  v-model="customIncomeName"
                  type="text"
                  placeholder="Précisez votre type de revenu..."
                  @input="errors.name = ''"
                  class="w-full py-4 px-5 rounded-3xl border outline-none transition-all text-[#1F2937]"
                  :class="
                    errors.name
                      ? 'border-red-400 bg-red-50 focus:ring-red-200'
                      : 'border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-[#5B8C85]/20 focus:border-[#5B8C85]'
                  "
                />
              </div>
            </transition>
            <p
              v-if="errors.name"
              class="text-red-500 text-xs font-medium mt-1.5 ml-2"
            >
              {{ errors.name }}
            </p>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-2"
              >Montant ({{
                currencyStore.currentCurrency?.code || "TND"
              }})</label
            >
            <input
              v-model="newIncome.amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              @input="errors.amount = ''"
              class="w-full py-4 px-5 rounded-3xl border outline-none transition-all text-[#1F2937]"
              :class="
                errors.amount
                  ? 'border-red-400 bg-red-50 focus:ring-red-200'
                  : 'border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-[#5B8C85]/20 focus:border-[#5B8C85]'
              "
            />
            <p
              v-if="errors.amount"
              class="text-red-500 text-xs font-medium mt-1.5 ml-2"
            >
              {{ errors.amount }}
            </p>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-2"
              >Fréquence</label
            >
            <CustomSelect
              v-model="newIncome.frequency"
              :options="frequencyOptions"
            />
          </div>

          <div v-if="newIncome.frequency !== 'ONE_TIME'" class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-2"
              >Date du prochain versement</label
            >
            <input
              v-model="newIncome.next_payment_date"
              type="date"
              :min="todayDate"
              @input="errors.date = ''"
              class="w-full py-4 px-5 rounded-3xl border outline-none transition-all text-[#1F2937]"
              :class="
                errors.date
                  ? 'border-red-400 bg-red-50 focus:ring-red-200'
                  : 'border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-[#5B8C85]/20 focus:border-[#5B8C85]'
              "
            />
            <p
              v-if="errors.date"
              class="text-red-500 text-xs font-medium mt-1.5 ml-2"
            >
              {{ errors.date }}
            </p>
          </div>

          <div class="flex justify-end space-x-3 mt-8">
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-3xl font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="px-6 py-3 bg-[#5B8C85] text-white rounded-3xl hover:bg-[#4a736d] font-medium transition-colors shadow-sm disabled:opacity-70"
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
      <div class="premium-card w-full max-w-sm text-center">
        <h3 class="text-lg font-bold text-gray-900 mb-2">
          Supprimer ce revenu ?
        </h3>
        <p class="text-sm text-gray-500 mb-6">Cette action est irréversible.</p>
        <div class="flex space-x-3">
          <button
            @click="showDeleteModal = false"
            class="flex-1 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-3xl font-medium"
          >
            Annuler
          </button>
          <button
            @click="executeDelete"
            class="flex-1 py-3 bg-red-600 text-white rounded-3xl hover:bg-red-700 font-medium"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useFinanceStore } from "@/stores/finance";
import { useCurrencyStore } from "@/stores/currency";
import CustomSelect from "@/components/shared/CustomSelect.vue";

const financeStore = useFinanceStore();
const currencyStore = useCurrencyStore();

const showIncomeModal = ref(false);
const showDeleteModal = ref(false);
const incomeToDeleteId = ref(null);
const isSubmitting = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const isExpanded = ref(false);
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

const displayedIncomes = computed(() => {
  if (!financeStore.incomes) return [];
  return isExpanded.value
    ? financeStore.incomes
    : financeStore.incomes.slice(0, 3);
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
  showIncomeModal.value = true;
};

const closeModal = () => {
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
