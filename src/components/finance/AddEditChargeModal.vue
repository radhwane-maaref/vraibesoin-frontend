<template>
  <transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      @click.self="handleClose"
    >
      <transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="transform opacity-0 scale-95 translate-y-4"
        enter-to-class="transform opacity-100 scale-100 translate-y-0"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="transform opacity-100 scale-100 translate-y-0"
        leave-to-class="transform opacity-0 scale-95 translate-y-4"
      >
        <div
          class="premium-card text-[#1F2937] w-full max-w-lg max-h-[90vh] flex flex-col font-['DM_Sans',_sans-serif] relative bg-white overflow-hidden rounded-3xl"
        >
          <div class="p-4 sm:p-8 flex-shrink-0 relative border-b border-gray-100 sm:border-none">
            <button
              @click="handleClose"
              class="absolute top-4 right-4 sm:top-5 sm:right-5 text-gray-400 hover:text-gray-700 transition-colors z-10"
            >
              <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 class="text-lg sm:text-2xl font-bold text-gray-900 text-center">
              {{ isEditMode ? "Modifier la Charge" : "Ajouter une charge " }}
            </h2>
          </div>

          <form
            @submit.prevent="handleSubmit"
            class="flex-grow flex flex-col overflow-hidden"
          >
            <div class="space-y-3 sm:space-y-5 overflow-y-auto px-4 sm:px-8 py-3 sm:py-4 flex-grow">
              <div class="space-y-1 sm:space-y-2">
                <label
                  class="block text-xs font-bold uppercase tracking-wider text-gray-500 ml-1"
                >
                  Type de charge
                </label>
                <CustomSelect
                  v-model="selectedChargeType"
                  :options="standardCharges"
                  placeholder="Sélectionnez une catégorie"
                  :error="isNameInvalid"
                  @change="touched.name = true"
                />

                <transition
                  enter-active-class="transition ease-out duration-200"
                  enter-from-class="transform opacity-0 -translate-y-2"
                  enter-to-class="transform opacity-100 translate-y-0"
                >
                  <div
                    v-if="selectedChargeType === 'Autre'"
                    class="mt-1 sm:mt-2 space-y-1"
                  >
                    <input
                      type="text"
                      v-model="customChargeName"
                      @blur="touched.name = true"
                      placeholder="Saisissez le nom de la charge"
                      maxlength="51"
                      class="w-full px-4 py-3 sm:px-5 sm:py-4 border rounded-2xl sm:rounded-3xl text-sm sm:text-base text-[#1F2937] font-semibold outline-none transition-all shadow-sm bg-white"
                      :class="
                        isNameInvalid
                          ? 'border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50'
                          : 'border-gray-200 focus:ring-2 focus:ring-[#5A877E]'
                      "
                    />
                  </div>
                </transition>
                <p
                  v-if="isNameInvalid"
                  class="text-xs text-red-500 font-medium ml-2"
                >
                  Le nom est obligatoire et ne doit pas dépasser 50 caractères.
                </p>
              </div>

              <div class="space-y-1 sm:space-y-2">
                <label
                  class="block text-xs font-bold uppercase tracking-wider text-gray-500 ml-1"
                >
                  Type de montant
                </label>
                <div
                  class="flex gap-2 sm:gap-3 bg-white p-1 sm:p-1.5 border border-gray-200 rounded-2xl sm:rounded-3xl shadow-sm"
                >
                  <button
                    type="button"
                    @click="isFixed = true"
                    class="flex-1 py-2 sm:py-3 text-xs sm:text-sm font-bold rounded-xl sm:rounded-2xl transition-all"
                    :class="
                      isFixed
                        ? 'bg-[#E1EBE8] text-[#5A877E] shadow-sm'
                        : 'text-gray-500 hover:bg-gray-50'
                    "
                  >
                    Montant Fixe
                  </button>
                  <button
                    type="button"
                    @click="isFixed = false"
                    class="flex-1 py-2 sm:py-3 text-xs sm:text-sm font-bold rounded-xl sm:rounded-2xl transition-all"
                    :class="
                      !isFixed
                        ? 'bg-[#E1EBE8] text-[#5A877E] shadow-sm'
                        : 'text-gray-500 hover:bg-gray-50'
                    "
                  >
                    Montant Variable
                  </button>
                </div>
              </div>

              <div class="space-y-1 sm:space-y-2">
                <label
                  class="block text-xs font-bold uppercase tracking-wider text-gray-500 ml-1"
                >
                  {{ isFixed ? "Montant Exact" : "Estimation du Montant" }}
                </label>

                <div v-if="isFixed" class="relative">
                  <input
                    type="number"
                    v-model="exactAmount"
                    @blur="touched.amount = true"
                    step="0.01"
                    placeholder="0.00"
                    class="w-full px-4 py-3 sm:px-5 sm:py-4 border rounded-2xl sm:rounded-3xl text-sm sm:text-base text-[#1F2937] font-semibold outline-none transition-all shadow-sm bg-white pr-12 sm:pr-16"
                    :class="
                      isFixedAmountInvalid
                        ? 'border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50'
                        : 'border-gray-200 focus:ring-2 focus:ring-[#5A877E]'
                    "
                  />
                  <div
                    class="absolute right-4 sm:right-5 top-1/2 transform -translate-y-1/2 text-gray-400 font-bold text-xs sm:text-sm"
                  >
                    {{ currencyStore.currentCurrency.code }}
                  </div>
                </div>

                <div v-else class="grid grid-cols-2 gap-3 sm:gap-4">
                  <div class="relative">
                    <input
                      type="number"
                      v-model="minAmount"
                      @blur="touched.amount = true"
                      step="0.01"
                      placeholder="Min"
                      class="w-full px-3 py-3 sm:px-5 sm:py-4 border rounded-2xl sm:rounded-3xl text-sm sm:text-base text-[#1F2937] font-semibold outline-none transition-all shadow-sm bg-white pr-10 sm:pr-14"
                      :class="
                        isVariableAmountInvalid
                          ? 'border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50'
                          : 'border-gray-200 focus:ring-2 focus:ring-[#5A877E]'
                      "
                    />
                    <div
                      class="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-semibold text-[10px] sm:text-xs"
                    >
                      {{ currencyStore.currentCurrency.code }}
                    </div>
                  </div>

                  <div class="relative">
                    <input
                      type="number"
                      v-model="maxAmount"
                      @blur="touched.amount = true"
                      step="0.01"
                      placeholder="Max"
                      class="w-full px-3 py-3 sm:px-5 sm:py-4 border rounded-2xl sm:rounded-3xl text-sm sm:text-base text-[#1F2937] font-semibold outline-none transition-all shadow-sm bg-white pr-10 sm:pr-14"
                      :class="
                        isVariableAmountInvalid
                          ? 'border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50'
                          : 'border-gray-200 focus:ring-2 focus:ring-[#5A877E]'
                      "
                    />
                    <div
                      class="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-semibold text-[10px] sm:text-xs"
                    >
                      {{ currencyStore.currentCurrency.code }}
                    </div>
                  </div>
                </div>

                <p
                  v-if="isFixedAmountInvalid"
                  class="text-xs text-red-500 font-medium ml-2"
                >
                  Le montant fixe doit être un nombre positif supérieur à 0.
                </p>
                <p
                  v-if="isVariableAmountInvalid"
                  class="text-xs text-red-500 font-medium ml-2"
                >
                  Le montant min doit être &ge; 0 et le max doit être
                  strictement supérieur au min.
                </p>
              </div>

              <div class="space-y-1 sm:space-y-2">
                <label
                  class="block text-xs font-bold uppercase tracking-wider text-gray-500 ml-1"
                >
                  Prochaine Échéance
                </label>
                <div class="relative">
                  <input
                    type="date"
                    v-model="dueDate"
                    @blur="touched.dueDate = true"
                    :min="isEditMode ? '' : todayDateStr"
                    class="w-full px-4 py-3 sm:px-5 sm:py-4 border rounded-2xl sm:rounded-3xl text-sm sm:text-base font-semibold outline-none transition-all shadow-sm bg-white appearance-none pr-10 sm:pr-12"
                    :class="[
                      isDueDateInvalid
                        ? 'border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50'
                        : 'border-gray-200 focus:ring-2 focus:ring-[#5A877E]',
                      !dueDate ? 'text-gray-400' : 'text-[#1F2937]'
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
                  v-if="isDueDateInvalid"
                  class="text-xs text-red-500 font-medium ml-2"
                >
                  {{
                    isEditMode
                      ? "Veuillez sélectionner une date valide."
                      : "La date d'échéance ne peut pas être dans le passé."
                  }}
                </p>
              </div>
            </div>

            <div
              class="p-4 sm:p-8 pt-3 sm:pt-5 border-t border-gray-100 flex-shrink-0 flex gap-3 bg-white"
            >
              <button
                type="button"
                @click="handleClose"
                class="flex-1 py-2.5 sm:py-3.5 border border-gray-300 text-gray-700 font-bold rounded-2xl sm:rounded-[2rem] hover:bg-gray-50 transition-all active:scale-[0.99] text-sm sm:text-base"
              >
                Annuler
              </button>
              <button
                type="submit"
                :disabled="!isFormValid"
                class="flex-1 bg-[#5A877E] text-white py-2.5 sm:py-3.5 font-bold rounded-2xl sm:rounded-[2rem] hover:bg-[#4a7269] transition-all active:scale-[0.99] shadow-lg shadow-[#5A877E]/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {{ isEditMode ? "Sauvegarder" : "Confirmer" }}
              </button>
            </div>
          </form>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import CustomSelect from "@/components/shared/CustomSelect.vue";
import { useCurrencyStore } from "@/stores/currency";
import { useUiStore } from "@/stores/ui";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  charge: {
    type: Object,
    default: null, // Si fourni, passe en mode édition
  },
});

const emit = defineEmits(["close", "save"]);

const currencyStore = useCurrencyStore();

// Form states
const selectedChargeType = ref("");
const customChargeName = ref("");
const isFixed = ref(true);
const exactAmount = ref("");
const minAmount = ref("");
const maxAmount = ref("");
const dueDate = ref("");

// Suivi des interactions utilisateur pour l'affichage propre des erreurs
const touched = reactive({
  name: false,
  amount: false,
  dueDate: false,
});

// Liste standard des charges courantes pour le CustomSelect
const standardCharges = [
  { value: "Electricité", label: "Électricité" },
  { value: "Internet", label: "Internet" },
  { value: "Abonnement TV", label: "Abonnement TV / Streaming" },
  { value: "Loyer", label: "Loyer" },
  { value: "Assurance", label: "Assurance" },
  { value: "Eau", label: "Eau" },
  { value: "Autre", label: "Autre (Saisir manuellement)" },
];

// Utilitaires de date
const todayDateStr = computed(() => {
  return new Date().toISOString().split("T")[0];
});

const isEditMode = computed(() => !!props.charge);

// --- LOGIQUE DE VALIDATION CRITIQUE ---

const finalName = computed(() => {
  if (selectedChargeType.value === "Autre") {
    return customChargeName.value.trim();
  }
  return selectedChargeType.value;
});

const isNameInvalid = computed(() => {
  if (!touched.name) return false;
  const name = finalName.value;
  return !name || name.length > 50;
});

const isFixedAmountInvalid = computed(() => {
  if (!touched.amount || !isFixed.value) return false;
  const parsed = parseFloat(exactAmount.value);
  return isNaN(parsed) || parsed <= 0;
});

const isVariableAmountInvalid = computed(() => {
  if (!touched.amount || isFixed.value) return false;
  const min = parseFloat(minAmount.value);
  const max = parseFloat(maxAmount.value);

  if (isNaN(min) || min < 0 || isNaN(max)) return true;
  return max <= min; // Erreur si le max est inférieur ou égal au min
});

const isDueDateInvalid = computed(() => {
  if (!touched.dueDate) return false;
  if (!dueDate.value) return true;
  // Bloquer les dates passées uniquement pour une nouvelle charge
  if (!isEditMode.value && dueDate.value < todayDateStr.value) {
    return true;
  }
  return false;
});

const isFormValid = computed(() => {
  // Vérification globale du nom
  const name = finalName.value;
  if (!name || name.length > 50) return false;

  // Vérification globale des montants
  if (isFixed.value) {
    const parsedExact = parseFloat(exactAmount.value);
    if (isNaN(parsedExact) || parsedExact <= 0) return false;
  } else {
    const min = parseFloat(minAmount.value);
    const max = parseFloat(maxAmount.value);
    if (isNaN(min) || min < 0 || isNaN(max) || max <= min) return false;
  }

  // Vérification globale de la date
  if (!dueDate.value) return false;
  if (!isEditMode.value && dueDate.value < todayDateStr.value) return false;

  return true;
});

// Réinitialisation ou pré-remplissage au changement d'état d'ouverture ou d'objet à éditer
watch(
  () => props.show,
  (isOpen) => {
    if (isOpen) {
      if (props.charge) {
        // Mode Édition : Initialisation des champs
        const found = standardCharges.some(
          (c) => c.value === props.charge.name,
        );
        if (found) {
          selectedChargeType.value = props.charge.name;
          customChargeName.value = "";
        } else {
          selectedChargeType.value = "Autre";
          customChargeName.value = props.charge.name;
        }
        isFixed.value = props.charge.is_fixed ?? true;
        exactAmount.value = props.charge.exact_amount || "";
        minAmount.value = props.charge.min_amount || "";
        maxAmount.value = props.charge.max_amount || "";
        dueDate.value = props.charge.due_date || "";
      } else {
        // Mode Ajout : Reset complet
        selectedChargeType.value = "";
        customChargeName.value = "";
        isFixed.value = true;
        exactAmount.value = "";
        minAmount.value = "";
        maxAmount.value = "";
        dueDate.value = "";
      }
      // Reset des états de focus/touch
      touched.name = false;
      touched.amount = false;
      touched.dueDate = false;
    }
  },
  { immediate: true },
);

const handleClose = () => {
  useUiStore().isNavBarHidden = false;
  emit("close");
};

const handleSubmit = () => {
  if (!isFormValid.value) return;

  const payload = {
    name: finalName.value,
    is_fixed: isFixed.value,
    due_date: dueDate.value,
    exact_amount: isFixed.value ? parseFloat(exactAmount.value) : null,
    min_amount: isFixed.value ? null : parseFloat(minAmount.value),
    max_amount: isFixed.value ? null : parseFloat(maxAmount.value),
  };

  useUiStore().isNavBarHidden = false;
  emit("save", payload);
};
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
