<template>
  <div
    class="min-h-screen bg-[#F8F6F2] font-['DM_Sans',_sans-serif] pb-12 px-4 pt-5"
  >
    <div class="max-w-3xl mx-auto w-full">
      <div class="flex items-center gap-3 mb-6">
        <router-link
          :to="{ name: 'dashboard' }"
          class="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
        >
          <svg
            class="w-5 h-5 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </router-link>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Tous mes revenus
        </h1>
      </div>

      <div
        class="premium-card bg-white rounded-2xl p-4 mb-5 shadow-sm border border-gray-100"
      >
        <h2 class="text-sm font-bold mb-3 text-gray-800">
          Filtrer mes revenus
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1"
              >Fréquence</label
            >
            <CustomSelect
              v-model="filters.frequency"
              :options="frequencyOptions"
              sizeClass="py-2.5 h-[46px]"
              roundedClass="rounded-2xl"
              class="text-sm"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1"
              >Type</label
            >
            <CustomSelect
              v-model="filters.type"
              :options="typeOptions"
              sizeClass="py-2.5 h-[46px]"
              roundedClass="rounded-2xl"
              class="text-sm"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1"
              >Montant Min</label
            >
            <input
              type="number"
              min="0"
              v-model.number="filters.minAmount"
              :class="[
                'w-full px-4 py-2.5 border rounded-2xl text-sm font-semibold outline-none focus:ring-2 bg-gray-50/50',
                filters.minAmount !== null && filters.minAmount !== '' && filters.minAmount < 0 
                  ? 'border-red-500 focus:ring-red-500 text-red-600' 
                  : 'border-gray-200 focus:ring-[#5B8C85]'
              ]"
              placeholder="Min"
            />
            <p v-if="filters.minAmount !== null && filters.minAmount !== '' && filters.minAmount < 0" class="text-xs text-red-500 mt-1">
              Le montant doit être positif.
            </p>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1"
              >Montant Max</label
            >
            <input
              type="number"
              min="0"
              v-model.number="filters.maxAmount"
              :class="[
                'w-full px-4 py-2.5 border rounded-2xl text-sm font-semibold outline-none focus:ring-2 bg-gray-50/50',
                filters.maxAmount !== null && filters.maxAmount !== '' && filters.maxAmount < 0 
                  ? 'border-red-500 focus:ring-red-500 text-red-600' 
                  : 'border-gray-200 focus:ring-[#5B8C85]'
              ]"
              placeholder="Max"
            />
            <p v-if="filters.maxAmount !== null && filters.maxAmount !== '' && filters.maxAmount < 0" class="text-xs text-red-500 mt-1">
              Le montant doit être positif.
            </p>
          </div>
        </div>
      </div>

      <ScheduledIncomes
        :custom-incomes="filteredIncomes"
        :limit="visibleCount"
        :show-header="false"
      />
    </div>
  </div>
</template>

<script setup>
/**
 * @module IncomesView
 * @description Vue dédiée à la consultation de l'ensemble des revenus.
 *
 * Fonctionnalités principales :
 * - **Filtrage multicritères** : fréquence, type (nom), montant minimal et maximal.
 * - **Scroll infini** : pagination dynamique des résultats (par tranches de 10)
 *   pour optimiser les performances de rendu.
 * - **Affichage** : délègue le rendu final à `ScheduledIncomes`.
 *
 * @requires vue - ref, computed, onMounted, onUnmounted, watch
 * @requires @/stores/finance - Store Pinia gérant les revenus (`incomes`)
 * @requires @/components/finance/ScheduledIncomes.vue - Composant liste
 * @requires @/components/shared/CustomSelect.vue - Composant de filtre
 */
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useFinanceStore } from "@/stores/finance";
import ScheduledIncomes from "@/components/finance/ScheduledIncomes.vue";
import CustomSelect from "@/components/shared/CustomSelect.vue";

const financeStore = useFinanceStore();

/**
 * Critères de filtrage actifs.
 * @type {import('vue').Ref<{frequency: string, type: string, minAmount: number|null, maxAmount: number|null}>}
 */
const filters = ref({
  frequency: "",
  type: "",
  minAmount: null,
  maxAmount: null,
});

/** @type {import('vue').Ref<number>} Nombre de revenus affichés actuellement (scroll infini) */
const visibleCount = ref(10);

/**
 * Réinitialise la pagination à 10 éléments dès qu'un filtre est modifié.
 */
watch(
  filters,
  () => {
    visibleCount.value = 10;
  },
  { deep: true },
);

/**
 * Extrait les noms uniques des revenus pour alimenter le filtre "Type".
 * @type {import('vue').ComputedRef<string[]>}
 */
const uniqueTypes = computed(() => {
  const types = financeStore.incomes.map((inc) => inc.name);
  return [...new Set(types)].filter(Boolean);
});

/** @type {Array<{value: string, label: string}>} Options statiques du filtre de fréquence */

const frequencyOptions = [
  { value: "", label: "Toutes" },
  { value: "ONE_TIME", label: "Une fois" },
  { value: "DAILY", label: "Quotidien" },
  { value: "WEEKLY", label: "Hebdomadaire" },
  { value: "MONTHLY", label: "Mensuel" },
  { value: "YEARLY", label: "Annuel" },
];

/**
 * Options dynamiques du filtre "Type", incluant l'option par défaut "Tous".
 * @type {import('vue').ComputedRef<Array<{value: string, label: string}>>}
 */
const typeOptions = computed(() => {
  return [
    { value: "", label: "Tous" },
    ...uniqueTypes.value.map((t) => ({ value: t, label: t })),
  ];
});

/**
 * Liste filtrée des revenus en fonction des critères sélectionnés par l'utilisateur.
 * @type {import('vue').ComputedRef<Array<Object>>}
 */
const filteredIncomes = computed(() => {
  return financeStore.incomes.filter((inc) => {
    let match = true;

    if (filters.value.frequency && inc.frequency !== filters.value.frequency) {
      match = false;
    }
    if (filters.value.type && inc.name !== filters.value.type) {
      match = false;
    }
    if (
      filters.value.minAmount !== null &&
      filters.value.minAmount !== "" &&
      Number(inc.amount) < filters.value.minAmount
    ) {
      match = false;
    }
    if (
      filters.value.maxAmount !== null &&
      filters.value.maxAmount !== "" &&
      Number(inc.amount) > filters.value.maxAmount
    ) {
      match = false;
    }

    return match;
  });
});

/**
 * Gestionnaire d'événement de défilement (Scroll Infini).
 * Ajoute 10 éléments supplémentaires à `visibleCount` lorsque l'utilisateur
 * approche du bas de la page (marge de 100px).
 */
const handleScroll = () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    if (visibleCount.value < filteredIncomes.value.length) {
      visibleCount.value += 10;
    }
  }
};

/**
 * Montage : récupère les données si elles ne sont pas déjà en store,
 * et attache l'écouteur de défilement pour le scroll infini.
 */

onMounted(() => {
  if (financeStore.incomes.length === 0) {
    financeStore.fetchFinanceData();
  }
  window.addEventListener("scroll", handleScroll);
});

/** Démontage : nettoyage indispensable de l'écouteur de défilement global */
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
