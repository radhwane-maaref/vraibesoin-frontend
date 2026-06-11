<template>
  <div
    class="min-h-screen bg-[#F8F6F2] font-['DM_Sans',_sans-serif] pb-12 px-4 pt-5"
  >
    <div class="max-w-3xl mx-auto w-full">
      <h1
        class="text-center text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight"
      >
        Acceuil
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
        <BalanceCard
          key="balance-card"
          :monthly-savings="dashboardData.stats.monthly_savings"
          :mastery-percentage="dashboardData.mastery_ratio"
          @add-income="triggerAddIncome"
        />
        <ReminderBanner
          v-if="dashboardData.pending_intentions"
          key="reminder-banner"
          :intentions="dashboardData.pending_intentions"
        />

        <ScheduledIncomes key="scheduled-incomes" ref="incomesListRef" />
        <SecuredVault
          key="secured-vault"
          :charges="dashboardData.fixed_charges || []"
          @add-charge="openAddChargeModal"
          @edit-charge="openEditChargeModal"
          @settle-charge="handleSettleCharge"
        />

        <BudgetEnvelopes key="budget-envelopes" />

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
    localStorage.setItem(
      "dashboard_summary_cache",
      JSON.stringify(response.data),
    );
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
