<template>
  <div
    class="min-h-screen bg-[#F8F6F2] font-['DM_Sans',_sans-serif] pb-12 px-4 pt-5"
  >
    <div class="max-w-3xl mx-auto w-full">
      <h1
        class="text-center text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight"
      >
        Accueil
      </h1>

      <div v-if="isLoading" class="flex justify-center items-center py-10">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5B8C85]"
        ></div>
      </div>

      <TransitionGroup
        v-else-if="dashboardData"
        appear
        name="staggered-fade"
        tag="div"
        class="space-y-6 mt-3"
      >
        <AiCoachMessage
          key="ai-coach"
          :user-name="dashboardData.user_name"
          :message="dashboardData.ai_coach_message"
        />

        <ReminderBanner
          v-if="dashboardData.pending_intentions"
          key="reminder-banner"
          :intentions="dashboardData.pending_intentions"
        />

        <BalanceCard key="balance-card" @add-income="triggerAddIncome" />

        <div
          key="monthly-savings"
          class="bg-gradient-to-r from-[#5B8C85] to-[#4a736d] rounded-[24px] p-6 shadow-sm text-white"
        >
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium opacity-90 mb-1">
                Montant sauvé ce mois-ci
              </p>
              <div class="flex items-baseline gap-1.5">
                <h2 class="text-4xl font-bold">
                  {{ Number(dashboardData.stats.monthly_savings).toFixed(2) }}
                </h2>
                <span class="text-lg font-medium opacity-90">
                  {{ currencyStore.currentCurrency.code }}
                </span>
              </div>
            </div>

            <div class="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <svg
                class="w-7 h-7 text-white"
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
            </div>
          </div>
        </div>

        <ScheduledIncomes key="scheduled-incomes" ref="incomesListRef" />

        <SecuredVault
          key="secured-vault"
          :charges="dashboardData.fixed_charges"
          @settle-charge="handleSettleCharge"
        />

        <BudgetEnvelopes key="budget-envelopes" />

        <div
          key="recurring-charges"
          class="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100"
        >
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-lg font-bold text-gray-900">
                Charges Récurrentes
              </h3>
              <p class="text-xs text-gray-400 mt-0.5">
                Vos abonnements, loyers et factures prévus
              </p>
            </div>
            <button
              @click="openAddChargeModal"
              class="flex items-center gap-1.5 px-4 py-2 bg-[#E1EBE8] text-[#5B8C85] rounded-full text-xs font-bold hover:bg-[#d2e2de] transition-colors active:scale-95"
            >
              <svg
                class="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Ajouter
            </button>
          </div>

          <div
            v-if="
              dashboardData.fixed_charges &&
              dashboardData.fixed_charges.length > 0
            "
            class="space-y-2.5"
          >
            <div
              v-for="charge in dashboardData.fixed_charges"
              :key="charge.id"
              @click="openEditChargeModal(charge)"
              class="flex items-center justify-between p-4 bg-[#F8F6F2]/50 rounded-2xl border border-gray-50 hover:border-gray-200 cursor-pointer transition-all group"
            >
              <div>
                <p
                  class="font-bold text-sm text-gray-800 group-hover:text-[#5B8C85] transition-colors"
                >
                  {{ charge.name }}
                </p>
                <p class="text-xs text-gray-400 mt-0.5">
                  Échéance :
                  {{
                    new Date(charge.due_date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                    })
                  }}
                </p>
              </div>
              <div class="text-right">
                <p class="font-bold text-sm text-gray-900">
                  <span v-if="charge.is_fixed">
                    {{ Number(charge.exact_amount).toFixed(2) }}
                  </span>
                  <span v-else class="text-xs font-bold text-gray-600">
                    {{ Number(charge.min_amount).toFixed(0) }}-{{
                      Number(charge.max_amount).toFixed(0)
                    }}
                  </span>
                  <span class="text-xs font-semibold text-gray-400 ml-1">
                    {{ currencyStore.currentCurrency.code }}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-6">
            <p class="text-sm text-gray-400 font-medium">
              Aucune charge enregistrée pour le moment.
            </p>
          </div>
        </div>

        <MasteryRatioChart
          key="mastery-chart"
          :percentage="dashboardData.mastery_ratio"
        />

        <SavingsCard
          v-if="dashboardData.savings_goal"
          key="savings-card"
          :goal-name="dashboardData.savings_goal.goal_name"
          :current-amount="dashboardData.savings_goal.saved_amount"
          :target-amount="dashboardData.savings_goal.target_amount"
        />
      </TransitionGroup>
    </div>

    <AddEditChargeModal
      :show="isChargeModalOpen"
      :charge="selectedChargeToEdit"
      @close="isChargeModalOpen = false"
      @save="handleSaveCharge"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import api from "@/services/api";
import { useCurrencyStore } from "@/stores/currency";

import AiCoachMessage from "@/components/dashboard/AiCoachMessage.vue";
import MasteryRatioChart from "@/components/dashboard/MasteryRatioChart.vue";
import SavingsCard from "@/components/dashboard/SavingsCard.vue";
import ReminderBanner from "@/components/dashboard/ReminderBanner.vue";
import BalanceCard from "@/components/dashboard/BalanceCard.vue";
import SecuredVault from "@/components/dashboard/SecuredVault.vue";
import BudgetEnvelopes from "@/components/dashboard/BudgetEnvelopes.vue";
import AddEditChargeModal from "@/components/finance/AddEditChargeModal.vue";
import ScheduledIncomes from "@/components/finance/ScheduledIncomes.vue";

const isLoading = ref(true);
const dashboardData = ref(null);
const currencyStore = useCurrencyStore();

const incomesListRef = ref(null);

const isChargeModalOpen = ref(false);
const selectedChargeToEdit = ref(null);

const fetchDashboardSummary = async (background = false) => {
  if (!background) isLoading.value = true;
  try {
    const response = await api.get("/dashboard/summary/");
    dashboardData.value = response.data;
    localStorage.setItem("dashboard_summary_cache", JSON.stringify(response.data));
  } catch (error) {
    console.error("Erreur lors du chargement du dashboard :", error);
  } finally {
    if (!background) isLoading.value = false;
  }
};

onMounted(() => {
  const cached = localStorage.getItem("dashboard_summary_cache");
  if (cached) {
    try {
      dashboardData.value = JSON.parse(cached);
      isLoading.value = false;
      // Fetch in background to update cache and view
      fetchDashboardSummary(true);
    } catch (e) {
      console.error("Cache parsing error", e);
      fetchDashboardSummary();
    }
  } else {
    fetchDashboardSummary();
  }
});

const triggerAddIncome = () => {
  incomesListRef.value?.openAddModal();
};

const openAddChargeModal = () => {
  selectedChargeToEdit.value = null;
  isChargeModalOpen.value = true;
};

const openEditChargeModal = (charge) => {
  selectedChargeToEdit.value = charge;
  isChargeModalOpen.value = true;
};

const handleSettleCharge = async ({ id, actual_amount }) => {
  try {
    await api.post(`/fixed-charges/${id}/settle/`, { actual_amount });
    await fetchDashboardSummary();
  } catch (error) {
    console.error("Erreur lors du règlement de la charge :", error);
  }
};

const handleSaveCharge = async (chargeData) => {
  try {
    if (selectedChargeToEdit.value) {
      await api.patch(
        `/fixed-charges/${selectedChargeToEdit.value.id}/`,
        chargeData,
      );
    } else {
      await api.post("/fixed-charges/", chargeData);
    }

    isChargeModalOpen.value = false;
    await fetchDashboardSummary();
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la charge :", error);
  }
};
</script>

<style scoped>
/* 1. Animation plus rapide (0.4s au lieu de 0.6s) et courbe de Bézier plus "nerveuse" */
.staggered-fade-enter-active,
.staggered-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

/* 2. Mouvement réduit (12px au lieu de 20px) pour un effet moins "flottant" et plus sec */
.staggered-fade-enter-from,
.staggered-fade-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

/* 3. Cascade ultra-rapide (25ms d'écart au lieu de 75ms) */
/* L'œil perçoit la vague, mais l'utilisateur n'attend plus */
:deep(> *:nth-child(1)) {
  transition-delay: 0ms;
}
:deep(> *:nth-child(2)) {
  transition-delay: 25ms;
}
:deep(> *:nth-child(3)) {
  transition-delay: 50ms;
}
:deep(> *:nth-child(4)) {
  transition-delay: 75ms;
}
:deep(> *:nth-child(5)) {
  transition-delay: 100ms;
}
:deep(> *:nth-child(6)) {
  transition-delay: 125ms;
}
:deep(> *:nth-child(7)) {
  transition-delay: 150ms;
}
:deep(> *:nth-child(8)) {
  transition-delay: 175ms;
}
:deep(> *:nth-child(9)) {
  transition-delay: 200ms;
}
:deep(> *:nth-child(10)) {
  transition-delay: 225ms;
}
:deep(> *:nth-child(11)) {
  transition-delay: 250ms;
}
</style>
