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
/**
 * @module DashboardView
 * @description Vue principale du tableau de bord utilisateur.
 *
 * Ce composant agrège plusieurs sous-composants pour offrir une vue d'ensemble :
 * - Message du coach IA (`AiCoachMessage`)
 * - Carte de solde et épargne (`BalanceCard`)
 * - Bannière de rappel des intentions en attente (`ReminderBanner`)
 * - Liste des revenus programmés (`ScheduledIncomes`)
 * - Gestion des charges fixes (`SecuredVault`)
 * - Gestion des enveloppes budgétaires (`BudgetEnvelopes`)
 * - Objectif d'épargne (`SavingsCard`)
 *
 * Utilise une stratégie "cache-then-network" pour un affichage immédiat.
 *
 * @requires vue - onMounted, ref
 * @requires @/services/api - Client HTTP
 * @requires @/stores/currency - Store de gestion des devises
 */
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

/** @type {import('vue').Ref<boolean>} Indicateur de chargement initial des données */
const isLoading = ref(true);

/** @type {import('vue').Ref<Object|null>} Données complètes du tableau de bord retournées par l'API */
const dashboardData = ref(null);
const currencyStore = useCurrencyStore();

/** @type {import('vue').Ref<any>} Référence au composant enfant ScheduledIncomes pour piloter ses modales */
const incomesListRef = ref(null);

/** @type {import('vue').Ref<boolean>} Contrôle de l'affichage de la modale des charges fixes */
const isChargeModalOpen = ref(false);

/** @type {import('vue').Ref<Object|null>} Charge actuellement sélectionnée pour édition */
const selectedChargeToEdit = ref(null);

/**
 * Récupère les données du tableau de bord via l'API et met à jour le cache local.
 * @async
 * @param {boolean} [background=false] - Si vrai, n'active pas l'indicateur de chargement global (isLoading).
 * @returns {Promise<void>}
 */
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

/**
 * Initialisation : Applique la stratégie "cache-then-network".
 * Charge d'abord les données depuis le localStorage pour un affichage immédiat,
 * puis effectue une requête en arrière-plan pour synchroniser les informations.
 */
onMounted(() => {
  const cached = localStorage.getItem("dashboard_summary_cache");
  if (cached) {
    try {
      dashboardData.value = JSON.parse(cached);
      isLoading.value = false;
      fetchDashboardSummary(true);
    } catch (e) {
      console.error("Erreur de parsing du cache :", e);
      fetchDashboardSummary();
    }
  } else {
    fetchDashboardSummary();
  }
});

/**
 * Déclenche l'ouverture de la modale d'ajout de revenu dans le sous-composant ciblé.
 */
const triggerAddIncome = () => {
  incomesListRef.value?.openAddModal();
};

/**
 * Ouvre la modale en mode création d'une nouvelle charge fixe.
 */
const openAddChargeModal = () => {
  selectedChargeToEdit.value = null;
  isChargeModalOpen.value = true;
};

/**
 * Ouvre la modale en mode édition avec les données de la charge cible.
 * @param {Object} charge - Objet charge à éditer.
 */
const openEditChargeModal = (charge) => {
  selectedChargeToEdit.value = charge;
  isChargeModalOpen.value = true;
};

/**
 * Règle une charge fixe via son ID et le montant spécifié, puis rafraîchit les données.
 * @async
 * @param {{id: number, actual_amount: number}} payload - Données du règlement.
 * @returns {Promise<void>}
 */
const handleSettleCharge = async ({ id, actual_amount }) => {
  try {
    await api.post(`/fixed-charges/${id}/settle/`, { actual_amount });
    await fetchDashboardSummary();
  } catch (error) {
    console.error("Erreur lors du règlement de la charge :", error);
  }
};

/**
 * Crée ou met à jour une charge fixe selon que `selectedChargeToEdit` est défini ou non.
 * @async
 * @param {Object} chargeData - Les données modifiées de la charge.
 * @returns {Promise<void>}
 */
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
/* Configuration de la transition échelonnée */
.staggered-fade-enter-active,
.staggered-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.staggered-fade-enter-from,
.staggered-fade-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

/* Délais d'animation en cascade par enfant */
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
