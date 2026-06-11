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
import { onMounted, ref } from "vue";
import api from "@/services/api";
import SecuredVault from "@/components/dashboard/SecuredVault.vue";
import AddEditChargeModal from "@/components/finance/AddEditChargeModal.vue";

const isLoading = ref(true);
const dashboardData = ref(null);

const isChargeModalOpen = ref(false);
const selectedChargeToEdit = ref(null);

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

onMounted(() => {
  const cached = localStorage.getItem("dashboard_summary_cache");
  if (cached) {
    try {
      dashboardData.value = JSON.parse(cached);
      isLoading.value = false;
      fetchDashboardSummary(); // background update
    } catch (e) {
      fetchDashboardSummary();
    }
  } else {
    fetchDashboardSummary();
  }
});

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
