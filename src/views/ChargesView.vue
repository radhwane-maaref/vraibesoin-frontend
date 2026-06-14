<template>
  <div class="min-h-screen bg-[#F8F6F2] font-['DM_Sans',_sans-serif] pb-12 px-4 pt-5">
    <div class="max-w-3xl mx-auto w-full space-y-6">
      <div class="flex items-center gap-3 mb-6">
        <router-link
          :to="{ name: 'dashboard' }"
          class="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
        >
          <svg class="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </router-link>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Toutes mes charges
        </h1>
      </div>

      <div v-if="isLoading" class="flex justify-center items-center py-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5B8C85]"></div>
      </div>

      <SecuredVault
        v-else-if="dashboardData && dashboardData.fixed_charges"
        :charges="dashboardData.fixed_charges"
        :limit="0"
        :show-all-link="false"
        @add-charge="openAddChargeModal"
        @edit-charge="openEditChargeModal"
        @settle-charge="handleSettleCharge"
      />
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
 * @module ChargesView
 * @description Vue dédiée à la consultation et à la gestion de toutes les charges fixes.
 *
 * Fonctionnalités principales :
 * - **Affichage** : délègue le rendu de la liste au composant `SecuredVault`
 *   (sans limite d'éléments ni lien « Voir tout »).
 * - **Création / édition** : ouvre une modale `AddEditChargeModal` pour ajouter
 *   ou modifier une charge fixe.
 * - **Règlement** : permet de solder une charge via `POST /fixed-charges/:id/settle/`.
 *
 * Une stratégie **cache-then-network** est utilisée au montage : le cache local
 * est affiché immédiatement puis rafraîchi en arrière-plan.
 *
 * @requires vue - onMounted, ref
 * @requires @/services/api - Client HTTP configuré (axios)
 * @requires @/components/dashboard/SecuredVault.vue - Composant d'affichage des charges
 * @requires @/components/finance/AddEditChargeModal.vue - Modale de création / édition de charge
 */
import { onMounted, ref } from "vue";
import api from "@/services/api";
import SecuredVault from "@/components/dashboard/SecuredVault.vue";
import AddEditChargeModal from "@/components/finance/AddEditChargeModal.vue";

/** @type {import('vue').Ref<boolean>} Indicateur de chargement initial */
const isLoading = ref(true);

/** @type {import('vue').Ref<Object|null>} Données du tableau de bord (contient `fixed_charges`) */
const dashboardData = ref(null);

/** @type {import('vue').Ref<boolean>} Contrôle l'affichage de la modale d'ajout / édition */
const isChargeModalOpen = ref(false);

/** @type {import('vue').Ref<Object|null>} Charge sélectionnée pour édition (null = mode création) */
const selectedChargeToEdit = ref(null);

/**
 * Récupère le résumé du tableau de bord depuis l'API.
 * @async
 * @returns {Promise<void>}
 */
const fetchDashboardSummary = async () => {
  isLoading.value = true;
  try {
    const response = await api.get("/dashboard/summary/");
    dashboardData.value = response.data;
  } catch (error) {
    console.error("Erreur lors du chargement des charges :", error);
  } finally {
    isLoading.value = false;
  }
};

/**
 * Stratégie cache-then-network : affiche le cache local instantanément
 * puis rafraîchit les données en arrière-plan pour garantir la fraîcheur.
 */
onMounted(() => {
  const cached = localStorage.getItem("dashboard_summary_cache");
  if (cached) {
    try {
      dashboardData.value = JSON.parse(cached);
      isLoading.value = false;
      fetchDashboardSummary();
    } catch (e) {
      fetchDashboardSummary();
    }
  } else {
    fetchDashboardSummary();
  }
});

/** Ouvre la modale en mode création (aucune charge pré-sélectionnée) */
const openAddChargeModal = () => {
  selectedChargeToEdit.value = null;
  isChargeModalOpen.value = true;
};

/**
 * Ouvre la modale en mode édition avec les données d'une charge existante.
 * @param {Object} charge - Charge fixe à modifier.
 */
const openEditChargeModal = (charge) => {
  selectedChargeToEdit.value = charge;
  isChargeModalOpen.value = true;
};

/**
 * Solde une charge fixe en envoyant le montant réellement payé.
 * Rafraîchit la liste après succès.
 * @async
 * @param {{id: number, actual_amount: number}} payload - Identifiant de la charge et montant réglé.
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
 * Crée ou met à jour une charge fixe selon le contexte (création vs édition).
 * Ferme la modale et rafraîchit la liste après succès.
 * @async
 * @param {Object} chargeData - Données du formulaire de la modale.
 * @returns {Promise<void>}
 */
const handleSaveCharge = async (chargeData) => {
  try {
    if (selectedChargeToEdit.value) {
      await api.patch(`/fixed-charges/${selectedChargeToEdit.value.id}/`, chargeData);
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
