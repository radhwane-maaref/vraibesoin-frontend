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

      <!-- Filtres -->
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
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useFinanceStore } from "@/stores/finance";
import ScheduledIncomes from "@/components/finance/ScheduledIncomes.vue";
import CustomSelect from "@/components/shared/CustomSelect.vue";

const financeStore = useFinanceStore();

const filters = ref({
  frequency: "",
  type: "",
  minAmount: null,
  maxAmount: null,
});

const visibleCount = ref(10);

// Reset visible count when filters change
watch(
  filters,
  () => {
    visibleCount.value = 10;
  },
  { deep: true },
);

const uniqueTypes = computed(() => {
  const types = financeStore.incomes.map((inc) => inc.name);
  return [...new Set(types)].filter(Boolean);
});

const frequencyOptions = [
  { value: "", label: "Toutes" },
  { value: "ONE_TIME", label: "Une fois" },
  { value: "DAILY", label: "Quotidien" },
  { value: "WEEKLY", label: "Hebdomadaire" },
  { value: "MONTHLY", label: "Mensuel" },
  { value: "YEARLY", label: "Annuel" },
];

const typeOptions = computed(() => {
  return [
    { value: "", label: "Tous" },
    ...uniqueTypes.value.map((t) => ({ value: t, label: t })),
  ];
});

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

const handleScroll = () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    if (visibleCount.value < filteredIncomes.value.length) {
      visibleCount.value += 10;
    }
  }
};

onMounted(() => {
  if (financeStore.incomes.length === 0) {
    financeStore.fetchFinanceData();
  }
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
