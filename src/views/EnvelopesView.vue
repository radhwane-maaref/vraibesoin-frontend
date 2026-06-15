<template>
  <div
    class="p-4 sm:p-6 pb-24 w-full max-w-lg md:max-w-xl lg:max-w-2xl mx-auto bg-[#F8F6F2] min-h-screen"
  >
    <div class="flex items-center mb-6">
      <button
        @click="$router.back()"
        class="p-2 -ml-2 rounded-full hover:bg-gray-200 transition-colors active:scale-95 shrink-0"
      >
        <svg
          class="w-6 h-6 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <h1
        class="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight flex-1 text-center pr-6"
      >
        Mes Enveloppes
      </h1>
    </div>

    <!-- Toast Notification -->
    <transition
      enter-active-class="transition ease-out duration-300 transform"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-200 transform"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="toastMessage"
        class="fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2 text-sm font-semibold bg-white text-gray-800"
      >
        <svg
          v-if="toastType === 'success'"
          class="w-5 h-5 text-[#5B8C85]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <svg
          v-else
          class="w-5 h-5 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {{ toastMessage }}
      </div>
    </transition>

    <div v-if="envelopeStore.envelopes.length > 0" class="mt-2 w-full">
      <transition-group
        tag="ul"
        class="flex flex-col gap-3 md:gap-4"
        enter-active-class="transition ease-out duration-200 transform"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150 transform"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <li
          v-for="env in sortedEnvelopes"
          :key="env.id"
          class="relative overflow-hidden rounded-[16px] bg-[#F8F6F2] shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <!-- Actions Container (underneath/revealed on swipe) -->
          <div
            class="absolute inset-y-0 right-0 flex items-center justify-end bg-gray-100 rounded-[16px] overflow-hidden transition-all duration-300"
            :style="{ width: activeSwipeId === env.id ? '55px' : '0px' }"
          >
            <button
              v-if="env.status === 'active'"
              @click.stop="
                openEditModal(env);
                activeSwipeId = null;
              "
              class="h-full px-3.5 bg-[#5B8C85] text-white flex items-center justify-center transition-colors hover:bg-[#4a736d]"
              title="Modifier"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4.5 w-4.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                />
              </svg>
            </button>
            <div
              v-else
              class="h-full px-3.5 bg-gray-400 text-white flex items-center justify-center cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4.5 w-4.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>

          <!-- Content Row -->
          <div
            class="flex items-center justify-between p-3 gap-3 transition-transform duration-300 cursor-pointer select-none"
            :class="env.status !== 'active' ? 'opacity-80' : ''"
            :style="{
              transform:
                activeSwipeId === env.id
                  ? 'translateX(-55px)'
                  : 'translateX(0px)',
            }"
            @touchstart="handleTouchStart"
            @touchend="(e) => handleTouchEnd(env.id, e)"
            @click="toggleSwipe(env.id)"
          >
            <!-- Title -->
            <div class="min-w-0">
              <p class="font-bold text-sm text-gray-800 truncate">
                {{ env.name }}
              </p>
              <div class="flex flex-wrap items-center gap-2 mt-1">
                <span
                  class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                  :class="[
                    statusColors[env.status].badgeBg,
                    statusColors[env.status].text,
                  ]"
                >
                  {{ statusLabels[env.status] }}
                </span>
                <span class="text-[10px] text-gray-400">
                  {{ formatDate(env.start_date) }} -
                  {{ formatDate(env.end_date) }}
                </span>
              </div>
            </div>

            <!-- Amount + Remaining below -->
            <div class="text-right shrink-0 ml-3">
              <p class="font-bold text-sm sm:text-base text-[#5B8C85]">
                {{ Number(env.amount).toFixed(2) }}
                <span class="text-[10px] font-semibold text-gray-400 ml-0.5">
                  {{ currencyCode }}
                </span>
              </p>
              <p class="text-[10px] text-gray-400 mt-0.5">
                {{
                  Math.max(0, env.amount - (env.total_spent || 0)).toFixed(2)
                }}
                restants
              </p>
            </div>
          </div>
        </li>
      </transition-group>
    </div>

    <div
      v-else
      class="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-gray-200 mt-6 shadow-sm flex flex-col items-center justify-center"
    >
      <div
        class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4"
      >
        <svg
          class="w-8 h-8 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20 12H4"
          />
        </svg>
      </div>
      <p class="text-sm text-gray-500 font-medium">Aucune enveloppe trouvée.</p>
    </div>

    <AddEditEnvelopeModal
      :show="isModalOpen"
      :envelope="selectedEnvelope"
      @close="isModalOpen = false"
      @save="handleSave"
      @delete="handleDelete"
      @terminate="handleTerminate"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useFinanceStore } from "@/stores/finance";
import { useCurrencyStore } from "@/stores/currency";
import { useEnvelopeStore } from "@/stores/envelopes";
import AddEditEnvelopeModal from "@/components/finance/AddEditEnvelopeModal.vue";

const activeSwipeId = ref(null);
const touchStartX = ref(0);
const touchStartY = ref(0);
const swipeThreshold = 30;

const handleTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX;
  touchStartY.value = e.touches[0].clientY;
};

const handleTouchEnd = (id, e) => {
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;
  const diffX = touchStartX.value - touchEndX;
  const diffY = Math.abs(touchStartY.value - touchEndY);

  if (diffX > swipeThreshold && diffY < 50) {
    activeSwipeId.value = id;
  } else if (diffX < -swipeThreshold && diffY < 50) {
    if (activeSwipeId.value === id) {
      activeSwipeId.value = null;
    }
  }
};

const toggleSwipe = (id) => {
  if (activeSwipeId.value === id) {
    activeSwipeId.value = null;
  } else {
    activeSwipeId.value = id;
  }
};

const financeStore = useFinanceStore();
const currencyStore = useCurrencyStore();
const envelopeStore = useEnvelopeStore();

const currencyCode = computed(
  () => currencyStore.currentCurrency?.code || "TND",
);

// Tri par statut puis par date
const sortedEnvelopes = computed(() => {
  const envs = [...(envelopeStore.processedEnvelopes || [])];

  const statusWeight = {
    active: 3,
    upcoming: 2,
    ended: 1,
  };

  return envs.sort((a, b) => {
    if (statusWeight[a.status] !== statusWeight[b.status]) {
      return statusWeight[b.status] - statusWeight[a.status];
    }
    const dateA = new Date(
      a.updated_at || a.created_at || a.start_date,
    ).getTime();
    const dateB = new Date(
      b.updated_at || b.created_at || b.start_date,
    ).getTime();
    return dateB - dateA;
  });
});

onMounted(() => {
  envelopeStore.fetchEnvelopes();
});

const toastMessage = ref("");
const toastType = ref("success");

const showToast = (msg, type = "success") => {
  toastMessage.value = msg;
  toastType.value = type;
  setTimeout(() => {
    toastMessage.value = "";
  }, 4000);
};

const statusLabels = {
  active: "Actif ",
  upcoming: "À venir",
  ended: "Terminé",
};
const statusColors = {
  active: {
    bg: "bg-[#5B8C85]",
    text: "text-[#5B8C85]",
    badgeBg: "bg-[#E1EBE8]",
  },
  upcoming: {
    bg: "bg-yellow-500",
    text: "text-yellow-600",
    badgeBg: "bg-yellow-100",
  },
  ended: { bg: "bg-gray-400", text: "text-gray-500", badgeBg: "bg-gray-200" },
};

const isModalOpen = ref(false);
const selectedEnvelope = ref(null);

const openAddModal = () => {
  selectedEnvelope.value = null;
  isModalOpen.value = true;
};

const openEditModal = (env) => {
  selectedEnvelope.value = env;
  isModalOpen.value = true;
};

const handleSave = async (envelopeData) => {
  try {
    const oldSpent = selectedEnvelope.value
      ? parseFloat(selectedEnvelope.value.total_spent) || 0
      : 0;
    const newSpent = parseFloat(envelopeData.total_spent) || 0;
    const diff = newSpent - oldSpent;

    if (selectedEnvelope.value) {
      await envelopeStore.updateEnvelope(
        selectedEnvelope.value.id,
        envelopeData,
      );
      showToast("Enveloppe mise à jour avec succès.");
    } else {
      await envelopeStore.addEnvelope(envelopeData);
      showToast("Enveloppe créée avec succès.");
    }

    if (diff !== 0) {
      financeStore.balance -= diff;
    }

    isModalOpen.value = false;
  } catch (error) {
    showToast("Une erreur est survenue lors de l'enregistrement.", "error");
  }
};

const swipeDelete = (id) => {
  if (window.confirm("Êtes-vous sûr de vouloir supprimer cette enveloppe ?")) {
    handleDelete(id);
  }
};

const handleDelete = async (id) => {
  try {
    await envelopeStore.deleteEnvelope(id);
    showToast("Enveloppe supprimée.", "success");
    isModalOpen.value = false;
  } catch (error) {
    showToast("Impossible de supprimer l'enveloppe.", "error");
  }
};

const handleTerminate = async (id) => {
  try {
    const result = await envelopeStore.terminateEnvelope(id);
    if (result.remainder_refunded > 0) {
      financeStore.balance += result.remainder_refunded;
    }
    showToast("Enveloppe terminée avec succès.", "success");
    isModalOpen.value = false;
  } catch (error) {
    showToast("Impossible de terminer l'enveloppe.", "error");
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
};
</script>
