<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col items-center pt-8 sm:pt-12 px-3 pb-6 sm:px-4"
  >
    <div
      class="w-full max-w-2xl bg-white shadow-xl rounded-2xl overflow-hidden"
    >
      <div class="bg-gray-100 px-6 sm:px-8 py-5 border-b border-gray-200">
        <p
          class="text-center text-sm md:text-base text-gray-700 font-bold mb-4"
        >
          On vous pose quelques questions pour mieux vous aider à éviter les
          achats impulsifs
        </p>
        <div class="flex items-center justify-between">
          <div v-for="step in 4" :key="step" class="flex items-center">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300"
              :class="
                currentStep >= step
                  ? 'bg-[#5B8C85] text-white'
                  : 'bg-gray-300 text-gray-500'
              "
            >
              {{ step }}
            </div>
            <div
              v-if="step < 4"
              class="w-8 sm:w-12 h-1 mx-2"
              :class="currentStep > step ? 'bg-[#5B8C85]' : 'bg-gray-300'"
            ></div>
          </div>
        </div>
      </div>

      <div
        v-if="loadingData"
        class="px-6 sm:px-8 py-10 text-center text-gray-500"
      >
        Chargement des configurations...
      </div>

      <div v-else class="px-6 sm:px-8 py-6 sm:py-8">
        <div v-if="currentStep === 1" class="animate-fade-in">
          <h2
            class="text-xl md:text-2xl font-bold text-gray-800 mb-1 tracking-tight"
          >
            Catégorie socio-professionnelle
          </h2>
          <p class="text-sm md:text-base text-gray-500 mb-4">
            Sélectionnez votre profil (jusqu'à 3 choix).
          </p>

          <div class="flex flex-wrap gap-2.5">
            <label
              v-for="choice in regularSocioPro"
              :key="choice.value"
              class="border rounded-xl px-4 py-2.5 cursor-pointer transition-all duration-200 flex items-center shadow-sm"
              :class="
                form.socioPro.includes(choice.value)
                  ? 'border-[#5B8C85] bg-[#5B8C85]/10 ring-1 ring-[#5B8C85]'
                  : 'border-gray-200 bg-white hover:border-[#5B8C85]/50'
              "
            >
              <input
                type="checkbox"
                :value="choice.value"
                v-model="form.socioPro"
                :disabled="
                  !form.socioPro.includes(choice.value) &&
                  form.socioPro.length >= 3
                "
                class="hidden"
              />
              <span
                class="text-gray-700 font-medium text-sm whitespace-nowrap"
                >{{ choice.label }}</span
              >
            </label>
          </div>

          <div v-if="specialSocioPro.length > 0" class="mt-4">
            <div class="flex items-center my-4">
              <div class="flex-grow border-t border-gray-200"></div>
              <span
                class="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase tracking-wider"
                >Ou</span
              >
              <div class="flex-grow border-t border-gray-200"></div>
            </div>

            <div class="flex flex-wrap gap-2.5">
              <label
                v-for="choice in specialSocioPro"
                :key="choice.value"
                class="border rounded-xl px-4 py-2.5 cursor-pointer transition-all duration-200 flex items-center bg-gray-50 shadow-sm"
                :class="
                  form.socioPro.includes(choice.value)
                    ? 'border-gray-500 ring-1 ring-gray-500 bg-gray-100'
                    : 'border-gray-200 hover:border-gray-300'
                "
              >
                <input
                  type="checkbox"
                  :value="choice.value"
                  v-model="form.socioPro"
                  class="hidden"
                />
                <span
                  class="text-gray-600 font-medium text-sm whitespace-nowrap"
                  >{{ choice.label }}</span
                >
              </label>
            </div>
          </div>
        </div>

        <div v-if="currentStep === 2" class="animate-fade-in">
          <h2
            class="text-xl md:text-2xl font-bold text-gray-800 mb-1 tracking-tight"
          >
            Profil et préférences
          </h2>
          <p class="text-sm md:text-base text-gray-500 mb-4">
            Fournissez ces informations pour personnaliser vos analyses et la
            devise affichée.
          </p>

          <div class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Date de naissance</label
              >
              <input
                type="date"
                v-model="form.birthDate"
                :max="maxPastDate"
                class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#5B8C85] focus:border-[#5B8C85] outline-none transition-colors"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Devise principale</label
              >
              <select
                v-model="form.preferredCurrency"
                class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#5B8C85] focus:border-[#5B8C85] outline-none transition-colors bg-white cursor-pointer"
              >
                <option value="" disabled>Sélectionnez une devise</option>
                <option
                  v-for="currency in currencyStore.availableCurrencies"
                  :key="currency.code"
                  :value="currency.code"
                >
                  {{ currency.code }} - {{ currency.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div v-if="currentStep === 3" class="animate-fade-in">
          <h2
            class="text-xl md:text-2xl font-bold text-gray-800 mb-1 tracking-tight"
          >
            Objectifs financiers
          </h2>
          <p class="text-sm md:text-base text-gray-500 mb-4">
            Sélectionnez ou ajoutez de 1 à 3 objectifs financiers.
          </p>

          <div class="mb-4 flex flex-wrap gap-2">
            <button
              v-for="goal in predefinedGoals"
              :key="goal"
              @click="toggleGoal(goal)"
              class="px-3 py-1.5 rounded-full border text-sm font-medium transition-colors"
              :class="
                form.goals.includes(goal)
                  ? 'bg-[#5B8C85] text-white border-[#5B8C85]'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              "
            >
              {{ goal }}
            </button>
          </div>

          <div class="relative">
            <input
              type="text"
              v-model="customGoalInput"
              @keydown.enter.prevent="addCustomGoal"
              placeholder="Ajouter un autre objectif et tapez Entrée..."
              class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#5B8C85] focus:border-[#5B8C85] outline-none"
              :disabled="form.goals.length >= 3"
            />
          </div>

          <div class="mt-3 flex flex-wrap gap-2" v-if="form.goals.length > 0">
            <span
              v-for="g in form.goals"
              :key="g"
              class="inline-flex items-center bg-[#5B8C85]/20 text-[#3f635e] text-sm font-medium px-3 py-1 rounded-full"
            >
              {{ g }}
              <button
                @click="removeGoal(g)"
                class="ml-2 text-[#5B8C85] hover:text-[#3f635e] focus:outline-none"
              >
                &times;
              </button>
            </span>
          </div>
        </div>

        <div v-if="currentStep === 4" class="animate-fade-in">
          <h2
            class="text-xl md:text-2xl font-bold text-gray-800 mb-1 tracking-tight"
          >
            Conditions d'utilisation
          </h2>
          <p class="text-sm md:text-base text-gray-500 mb-4">
            Dernière étape avant de commencer.
          </p>

          <div
            class="bg-gray-50 border border-gray-200 rounded-lg p-3 h-32 overflow-y-auto mb-4 text-sm text-gray-600"
          >
            <p class="mt-2">
              En accédant au site vraibesoin.me et en utilisant les services
              proposés par Vrai Besoin, vous acceptez pleinement et sans réserve
              les présentes Conditions Générales d'Utilisation...
            </p>
            <ul
              class="list-disc pl-5 sm:pl-6 space-y-2 mb-3 mt-2 marker:text-[#9CA3AF]"
            >
              <li>
                Utiliser la plateforme à des fins illégales, frauduleuses ou
                malveillantes.
              </li>
              <li>
                Perturber le bon fonctionnement du site, des serveurs ou des
                réseaux connectés.
              </li>
              <li>
                Collecter ou stocker des données personnelles d'autres
                utilisateurs sans leur consentement.
              </li>
              <li>
                Publier du contenu diffamatoire, obscène, offensant ou violant
                les droits de tiers.
              </li>
            </ul>
          </div>

          <label class="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              v-model="form.acceptedTerms"
              class="w-5 h-5 text-[#5B8C85] border-gray-300 rounded focus:ring-[#5B8C85]"
            />
            <span class="text-gray-700 font-medium text-sm"
              >J'accepte les conditions d'utilisation</span
            >
          </label>

          <div
            v-if="submitError"
            class="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm"
          >
            {{ submitError }}
          </div>
        </div>
      </div>

      <div
        v-if="!loadingData"
        class="bg-white px-6 sm:px-8 py-5 border-t border-gray-200 flex flex-col gap-2"
      >
        <button
          v-if="currentStep < 4"
          @click="currentStep++"
          :disabled="!isCurrentStepValid"
          class="w-full px-6 py-2.5 bg-[#5B8C85] text-white font-medium rounded-lg hover:bg-[#48736d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed order-1"
        >
          Suivant
        </button>

        <button
          v-if="currentStep === 4"
          @click="submit"
          :disabled="!isCurrentStepValid || submitting"
          class="w-full px-6 py-2.5 bg-[#5B8C85] text-white font-medium rounded-lg hover:bg-[#48736d] transition-colors disabled:opacity-50 flex items-center justify-center order-1"
        >
          <svg
            v-if="submitting"
            class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Commencer
        </button>

        <button
          v-if="currentStep > 1"
          @click="currentStep--"
          class="w-full px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors order-2"
        >
          Précédent
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useCurrencyStore } from "@/stores/currency";
import api from "@/services/api";

const router = useRouter();
const authStore = useAuthStore();
const currencyStore = useCurrencyStore();

const currentStep = ref(1);
const loadingData = ref(true);
const submitting = ref(false);
const submitError = ref("");

// Restrict date picker to past dates only
const maxPastDate = computed(() => {
  const today = new Date();
  return today.toISOString().split("T")[0];
});

// Predefined Options
const predefinedGoals = [
  "Épargne de précaution",
  "Achat immobilier",
  "Voyage",
  "Investissement",
  "Remboursement de dettes",
];

const options = reactive({
  socioPro: [],
});

// Form State
const form = reactive({
  socioPro: [],
  birthDate: null,
  preferredCurrency: "TND", // Initialized locally (defaults cleanly to base user demographic)
  goals: [],
  acceptedTerms: false,
});
const customGoalInput = ref("");

// Identifiers for exclusive bottom options
const specialLabels = [
  "autre",
  "préfère ne pas répondre",
  "prefere ne pas repondre",
];
const isSpecial = (label) =>
  specialLabels.some((l) => label.toLowerCase().includes(l));

// Computed categories for UI segregation
const regularSocioPro = computed(() =>
  options.socioPro.filter((c) => !isSpecial(c.label)),
);
const specialSocioPro = computed(() =>
  options.socioPro.filter((c) => isSpecial(c.label)),
);

// Enforce exclusivity for "Autre" / "Préfère ne pas répondre"
watch(
  () => form.socioPro,
  (newVal, oldVal) => {
    const added = newVal.find((x) => !oldVal.includes(x));
    if (added) {
      const option = options.socioPro.find((o) => o.value === added);
      if (option && isSpecial(option.label)) {
        form.socioPro = [added];
      } else {
        form.socioPro = newVal.filter((v) => {
          const opt = options.socioPro.find((o) => o.value === v);
          return opt && !isSpecial(opt.label);
        });
      }
    }
  },
  { deep: true },
);

// Fetch backend configs on mount
onMounted(async () => {
  try {
    const { data } = await api.get("/onboarding/choices/");
    options.socioPro = data.socio_pro;
  } catch (err) {
    console.error("Erreur de chargement des configurations:", err);
  } finally {
    loadingData.value = false;
  }
});

// Validation per step
const isCurrentStepValid = computed(() => {
  if (currentStep.value === 1)
    return form.socioPro.length >= 1 && form.socioPro.length <= 3;
  if (currentStep.value === 2) return form.birthDate && form.preferredCurrency;
  if (currentStep.value === 3)
    return form.goals.length >= 1 && form.goals.length <= 3;
  if (currentStep.value === 4) return form.acceptedTerms === true;
  return false;
});

// Step 3 specific logic
const toggleGoal = (goal) => {
  if (form.goals.includes(goal)) {
    removeGoal(goal);
  } else if (form.goals.length < 3) {
    form.goals.push(goal);
  }
};

const addCustomGoal = () => {
  const g = customGoalInput.value.trim();
  if (!g) return;

  const exists = form.goals.some(
    (existing) => existing.toLowerCase() === g.toLowerCase(),
  );
  if (!exists && form.goals.length < 3) {
    form.goals.push(g);
  }
  customGoalInput.value = "";
};

const removeGoal = (goal) => {
  form.goals = form.goals.filter((g) => g !== goal);
};

// Submission
const submit = async () => {
  submitting.value = true;
  submitError.value = "";

  const payload = {
    socio_professional_categories: form.socioPro,
    birth_date: form.birthDate,
    preferred_currency: form.preferredCurrency,
    financial_goals: form.goals,
  };

  try {
    await api.post("/onboarding/submit/", payload);

    // Setup currency store directly off user input to optimize local cache prior to routing
    const selectedCurrencyObj = currencyStore.availableCurrencies.find(
      (c) => c.code === form.preferredCurrency,
    );
    if (selectedCurrencyObj) {
      await currencyStore.setCurrency(selectedCurrencyObj);
    }

    await authStore.fetchUserProfile();
    router.push({ name: "dashboard" });
  } catch (err) {
    submitError.value =
      err.response?.data?.error ||
      "Une erreur est survenue lors de l'enregistrement.";
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
