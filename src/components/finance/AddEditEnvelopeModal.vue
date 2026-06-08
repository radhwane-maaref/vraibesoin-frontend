<template>
  <Teleport to="body">
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"
      >
        <div
          class="premium-card w-full max-w-md overflow-hidden transform transition-all"
        >
          <div class="p-6">
            <div class="flex justify-between items-center mb-5">
              <h3 class="text-xl font-bold text-gray-900">
                {{ envelope ? "Modifier l'enveloppe" : "Nouvelle Enveloppe" }}
              </h3>
              <button
                @click="$emit('close')"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  class="w-6 h-6"
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
              </button>
            </div>

            <div
              class="mb-4 p-3 bg-[#E1EBE8]/50 rounded-2xl flex items-center justify-between text-sm"
            >
              <span class="text-gray-600 font-medium"
                >Capacité max. allouable :</span
              >
              <span class="font-bold text-[#5B8C85]"
                >{{ maxAvailable.toFixed(2) }} {{ currencyCode }}</span
              >
            </div>

            <form @submit.prevent="submitForm" class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1"
                  >Nom de l'événement</label
                >
                <input
                  v-model="form.name"
                  type="text"
                  :class="[
                    'w-full px-5 py-3 bg-white border rounded-2xl outline-none transition-all',
                    errors.name
                      ? 'border-red-400 focus:ring-2 focus:ring-red-400/20 bg-red-50/30'
                      : 'border-gray-200 focus:border-[#5B8C85] focus:ring-2 focus:ring-[#5B8C85]/20',
                  ]"
                  placeholder="Ex: Voyage à Rome"
                  @input="clearError('name')"
                />
                <p
                  v-if="errors.name"
                  class="text-red-500 text-xs font-medium mt-1.5 ml-1"
                >
                  {{ errors.name }}
                </p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1"
                    >Montant alloué</label
                  >
                  <div class="relative">
                    <input
                      v-model.number="form.amount"
                      type="number"
                      step="0.01"
                      :class="[
                        'w-full px-4 py-3 bg-white border rounded-2xl outline-none transition-all pr-8',
                        errors.amount
                          ? 'border-red-400 focus:ring-2 focus:ring-red-400/20 bg-red-50/30'
                          : 'border-gray-200 focus:border-[#5B8C85] focus:ring-2 focus:ring-[#5B8C85]/20',
                      ]"
                      placeholder="0.00"
                      @input="clearError('amount')"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1"
                    >Total dépensé</label
                  >
                  <div class="relative">
                    <input
                      v-model.number="form.total_spent"
                      type="number"
                      step="0.01"
                      :class="[
                        'w-full px-4 py-3 bg-white border rounded-2xl outline-none transition-all pr-8',
                        errors.total_spent
                          ? 'border-red-400 focus:ring-2 focus:ring-red-400/20 bg-red-50/30'
                          : 'border-gray-200 focus:border-[#5B8C85] focus:ring-2 focus:ring-[#5B8C85]/20',
                      ]"
                      placeholder="0.00"
                      @input="clearError('total_spent')"
                    />
                  </div>
                </div>
              </div>
              <p
                v-if="errors.amount"
                class="text-red-500 text-xs font-medium mt-0.5 ml-1"
              >
                {{ errors.amount }}
              </p>
              <p
                v-if="errors.total_spent"
                class="text-red-500 text-xs font-medium mt-0.5 ml-1"
              >
                {{ errors.total_spent }}
              </p>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1"
                    >Date de début</label
                  >
                  <input
                    v-model="form.start_date"
                    type="date"
                    :class="[
                      'w-full px-4 py-3 bg-white border rounded-2xl outline-none transition-all text-sm',
                      errors.dates
                        ? 'border-red-400 focus:ring-2 focus:ring-red-400/20 bg-red-50/30'
                        : 'border-gray-200 focus:border-[#5B8C85] focus:ring-2 focus:ring-[#5B8C85]/20',
                    ]"
                    @input="clearError('dates')"
                  />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1"
                    >Date de fin</label
                  >
                  <input
                    v-model="form.end_date"
                    type="date"
                    :min="form.start_date"
                    :class="[
                      'w-full px-4 py-3 bg-white border rounded-2xl outline-none transition-all text-sm',
                      errors.dates
                        ? 'border-red-400 focus:ring-2 focus:ring-red-400/20 bg-red-50/30'
                        : 'border-gray-200 focus:border-[#5B8C85] focus:ring-2 focus:ring-[#5B8C85]/20',
                    ]"
                    @input="clearError('dates')"
                  />
                </div>
              </div>
              <p
                v-if="errors.dates"
                class="text-red-500 text-xs font-medium mt-0.5 ml-1"
              >
                {{ errors.dates }}
              </p>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1"
                  >Catégorie (Optionnel)</label
                >
                <CustomSelect
                  v-model="form.category"
                  :options="categories"
                  placeholder="Choisir une catégorie"
                  sizeClass="py-3 h-[50px]"
                  roundedClass="rounded-2xl"
                />
              </div>

              <div
                v-if="showDeleteConfirm"
                class="mt-4 p-4 bg-red-50 rounded-2xl border border-red-100"
              >
                <p class="text-sm text-red-800 font-bold mb-3 text-center">
                  Êtes-vous sûr de vouloir supprimer cette enveloppe ?
                </p>
                <div class="flex gap-3">
                  <button
                    type="button"
                    @click="showDeleteConfirm = false"
                    class="flex-1 py-2.5 bg-white text-gray-700 rounded-xl text-sm font-bold border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    @click="confirmDelete"
                    class="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors shadow-sm"
                  >
                    Oui, supprimer
                  </button>
                </div>
              </div>

              <div v-else class="pt-2 flex gap-3">
                <button
                  v-if="envelope"
                  type="button"
                  @click="showDeleteConfirm = true"
                  class="w-1/3 py-3 px-4 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-colors"
                >
                  Supprimer
                </button>
                <button
                  type="submit"
                  :class="envelope ? 'w-2/3' : 'w-full'"
                  class="py-3 px-4 bg-[#5B8C85] text-white rounded-2xl font-bold hover:bg-[#4a736d] transition-colors shadow-md"
                >
                  {{ envelope ? "Enregistrer" : "Créer l'enveloppe" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import CustomSelect from "@/components/shared/CustomSelect.vue";
import { useCurrencyStore } from "@/stores/currency";
import { useFinanceStore } from "@/stores/finance";
import { useEnvelopeStore } from "@/stores/envelopes";

const props = defineProps({
  show: Boolean,
  envelope: Object,
});

const emit = defineEmits(["close", "save", "delete"]);

const currencyStore = useCurrencyStore();
const financeStore = useFinanceStore();
const envelopeStore = useEnvelopeStore();
const showDeleteConfirm = ref(false);

const currencyCode = computed(
  () => currencyStore.currentCurrency?.code || "TND",
);

const categories = [
  { value: "vacation", label: "🏖️ Vacances" },
  { value: "holidays", label: "🎁 Fêtes / Cadeaux" },
  { value: "project", label: "🚀 Grand Projet" },
  { value: "emergency", label: "⚠️ Urgence" },
];

const getToday = () => new Date().toISOString().split("T")[0];

const defaultForm = () => ({
  name: "",
  amount: null,
  total_spent: 0,
  start_date: getToday(),
  end_date: getToday(),
  category: "",
});

const form = ref(defaultForm());
const errors = ref({});

// La capacité disponible prend en compte la soustraction des dépenses réelles
const maxAvailable = computed(() => {
  const totalBalance = parseFloat(financeStore.balance) || 0;
  const activeEnvs =
    envelopeStore.processedEnvelopes?.filter((e) => e.status === "active") ||
    [];

  let currentlyReserved = activeEnvs.reduce((sum, env) => {
    const amt = parseFloat(env.amount) || 0;
    const spent = parseFloat(env.total_spent) || 0;
    return sum + Math.max(0, amt - spent);
  }, 0);

  // Si nous modifions une enveloppe existante, nous libérons temporairement son argent verrouillé
  if (props.envelope && props.envelope.status === "active") {
    const oldAmt = parseFloat(props.envelope.amount) || 0;
    const oldSpent = parseFloat(props.envelope.total_spent) || 0;
    currentlyReserved -= Math.max(0, oldAmt - oldSpent);
  }

  return Math.max(0, totalBalance - currentlyReserved);
});

watch(
  () => props.show,
  (isShowing) => {
    if (isShowing) {
      form.value = props.envelope
        ? { ...props.envelope, total_spent: props.envelope.total_spent || 0 }
        : defaultForm();
      errors.value = {};
      showDeleteConfirm.value = false;
    }
  },
);

const clearError = (field) => {
  if (errors.value[field]) delete errors.value[field];
};

const validateForm = () => {
  errors.value = {};
  let isValid = true;

  if (!form.value.name || !form.value.name.trim()) {
    errors.value.name = "Le nom de l'enveloppe est requis.";
    isValid = false;
  }

  const amount = parseFloat(form.value.amount);
  const spent = parseFloat(form.value.total_spent) || 0;

  if (spent < 0) {
    errors.value.total_spent = "Les dépenses ne peuvent pas être négatives.";
    isValid = false;
  }
  if (spent > amount) {
    errors.value.total_spent =
      "Les dépenses ne peuvent pas dépasser le montant alloué.";
    isValid = false;
  }

  // Seule la réserve nette est vérifiée contre l'argent disponible (amount - spent)
  const netNewReserve = Math.max(0, amount - spent);
  if (netNewReserve > maxAvailable.value) {
    errors.value.amount = `Fonds insuffisants. Capacité disponible : ${maxAvailable.value.toFixed(2)} ${currencyCode.value}.`;
    isValid = false;
  }

  const startDate = new Date(form.value.start_date);
  const endDate = new Date(form.value.end_date);
  const today = new Date(getToday());

  // Validation Chronologique Interractive
  if (endDate < startDate) {
    errors.value.dates =
      "La date de fin doit être égale ou postérieure à la date de début.";
    isValid = false;
  } else if (!props.envelope && startDate < today) {
    errors.value.dates =
      "La date de début d'une nouvelle enveloppe ne peut pas être dans le passé.";
    isValid = false;
  }

  return isValid;
};

const submitForm = () => {
  if (validateForm()) {
    emit("save", { ...form.value });
  }
};

const confirmDelete = () => {
  emit("delete", form.value.id);
};
</script>
