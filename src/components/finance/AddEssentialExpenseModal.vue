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
          class="premium-card text-[#1F2937] w-full max-w-md font-['DM_Sans',_sans-serif] relative bg-white overflow-hidden rounded-3xl"
        >
          <div class="p-4 sm:p-4 relative">
            <h2 class="text-lg sm:text-2xl font-bold text-gray-900 text-center">
              Dépense Essentielle
            </h2>
          </div>

          <form @submit.prevent="handleSubmit">
            <div class="space-y-3 sm:space-y-5 px-4 sm:px-8 py-3 sm:py-4">
              <div class="space-y-1 sm:space-y-2">
                <label
                  class="block text-xs font-bold uppercase tracking-wider text-gray-500 ml-1"
                >
                  Montant
                </label>
                <div class="relative">
                  <input
                    type="number"
                    v-model="amount"
                    @blur="touched.amount = true"
                    step="0.01"
                    placeholder="0.00"
                    class="w-full px-4 py-3 sm:px-5 sm:py-4 border rounded-2xl sm:rounded-3xl text-sm sm:text-base text-[#1F2937] font-semibold outline-none transition-all shadow-sm bg-white pr-12 sm:pr-16"
                    :class="
                      isAmountInvalid
                        ? 'border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50'
                        : 'border-gray-200 focus:ring-2 focus:ring-[#5A877E]'
                    "
                  />
                  <div
                    class="absolute right-4 sm:right-5 top-1/2 transform -translate-y-1/2 text-gray-400 font-bold text-xs sm:text-sm"
                  >
                    {{ currencyStore.currentCurrency?.code || "TND" }}
                  </div>
                </div>
                <p
                  v-if="isAmountInvalid"
                  class="text-xs text-red-500 font-medium ml-2"
                >
                  Le montant doit être supérieur à 0.
                </p>
              </div>

              <div class="space-y-1 sm:space-y-2">
                <label
                  class="block text-xs font-bold uppercase tracking-wider text-gray-500 ml-1"
                >
                  Catégorie
                </label>
                <CustomSelect
                  v-model="selectedTag"
                  :options="tagOptions"
                  placeholder="Ex: Courses, Carburant..."
                  :error="isTagInvalid"
                  @change="touched.tag = true"
                />
                <p
                  v-if="isTagInvalid"
                  class="text-xs text-red-500 font-medium ml-2"
                >
                  Veuillez sélectionner une catégorie.
                </p>
              </div>

              <div class="space-y-1 sm:space-y-2">
                <label
                  class="block text-xs font-bold uppercase tracking-wider text-gray-500 ml-1"
                >
                  Note (Optionnel)
                </label>
                <input
                  type="text"
                  v-model="note"
                  @blur="touched.note = true"
                  maxlength="100"
                  placeholder="Détails de l'achat..."
                  class="w-full px-4 py-3 sm:px-5 sm:py-4 border rounded-2xl sm:rounded-3xl text-sm sm:text-base text-[#1F2937] font-semibold outline-none transition-all shadow-sm bg-white"
                  :class="
                    isNoteInvalid
                      ? 'border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50'
                      : 'border-gray-200 focus:ring-2 focus:ring-[#5A877E]'
                  "
                />
                <p
                  v-if="isNoteInvalid"
                  class="text-xs text-red-500 font-medium ml-2"
                >
                  La note ne doit pas dépasser 100 caractères.
                </p>
              </div>
            </div>

            <div class="p-4 sm:p-8 pt-3 sm:pt-5 mt-2 flex gap-3 bg-white">
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
                class="flex-1 bg-[#5A877E] text-white py-2.5 sm:py-3.5 font-bold rounded-2xl sm:rounded-[2rem] hover:bg-[#4a7269] transition-all active:scale-[0.99] shadow-lg shadow-[#5A877E]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                Valider
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
import { useCurrencyStore } from "@/stores/currency";
import { useUiStore } from "@/stores/ui";
import CustomSelect from "@/components/shared/CustomSelect.vue";

const props = defineProps({ show: Boolean });
const emit = defineEmits(["close", "save"]);

const currencyStore = useCurrencyStore();
const uiStore = useUiStore();

const amount = ref("");
const selectedTag = ref("");
const note = ref("");

const touched = reactive({ amount: false, tag: false, note: false });

const tagOptions = [
  { value: "Courses", label: "🛒 Courses" },
  { value: "Carburant", label: "⛽ Carburant" },
  { value: "Transport", label: "🚌 Transport commun" },
  { value: "Pharmacie", label: "💊 Pharmacie" },
  { value: "Factures", label: "📄 Factures" },
  { value: "Maison", label: "🏠 Maison" },
  { value: "Autre", label: "📌 Autres essentiels" },
];

// Validations
const isAmountInvalid = computed(() => {
  if (!touched.amount) return false;
  const val = parseFloat(amount.value);
  return isNaN(val) || val <= 0;
});

const isTagInvalid = computed(() => touched.tag && !selectedTag.value);
const isNoteInvalid = computed(() => touched.note && note.value.length > 100);

const isFormValid = computed(() => {
  const val = parseFloat(amount.value);
  return (
    !isNaN(val) && val > 0 && selectedTag.value && note.value.length <= 100
  );
});

watch(
  () => props.show,
  (isOpen) => {
    uiStore.isNavBarHidden = isOpen;
    if (isOpen) {
      amount.value = "";
      selectedTag.value = "";
      note.value = "";
      touched.amount = false;
      touched.tag = false;
      touched.note = false;
    }
  },
);

const handleClose = () => emit("close");

const handleSubmit = () => {
  if (!isFormValid.value) return;

  const payload = {
    // Convert to negative representing spending to comply with prompt logic
    amount: -Math.abs(parseFloat(amount.value)),
    category: selectedTag.value,
    note: note.value.trim(),
    transaction_type: "EXPENSE",
    is_essential: true,
  };

  emit("save", payload);
};
</script>
<style scoped>
/* Supprimer les flèches du champ number */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
