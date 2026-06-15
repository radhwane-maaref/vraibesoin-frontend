<template>
  <div class="premium-card mt-6 relative">
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
        class="absolute top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-lg z-10 flex items-center gap-2 text-sm font-semibold bg-white text-gray-800"
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

    <div class="flex items-center justify-between mb-5">
      <div>
        <h3 class="text-lg font-semibold">Enveloppes Budgétaires</h3>
      </div>
      <button
        @click="openAddModal"
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
        Créer
      </button>
    </div>

    <div class="flex gap-4 mb-6">
      <div class="flex-1 bg-gray-50 rounded-2xl p-4 border border-gray-100">
        <p class="text-xs font-medium text-gray-500 mb-1">Reste à Dépenser</p>
        <p class="text-xl font-bold text-gray-900">
          {{ Number(availableMainBalance).toFixed(2) }}
          <span class="text-sm text-gray-400">{{ currencyCode }}</span>
        </p>
      </div>
      <div class="flex-1 bg-[#F8F6F2] rounded-2xl p-4 border border-[#E1EBE8]">
        <p
          class="text-xs font-medium text-[#5B8C85] mb-1 flex items-center gap-1"
        >
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clip-rule="evenodd"
            />
          </svg>
          Total Verrouillé
        </p>
        <p class="text-xl font-bold text-[#5B8C85]">
          {{ Number(realTotalReserved).toFixed(2) }}
          <span class="text-sm opacity-70">{{ currencyCode }}</span>
        </p>
      </div>
    </div>

    <div v-if="envelopeStore.envelopes.length > 0" class="space-y-4">
      <div
        v-for="env in recentEnvelopes"
        :key="env.id"
        @click="env.status === 'active' ? openEditModal(env) : null"
        :class="[
          'flex flex-col p-4 bg-white rounded-2xl border border-gray-100 transition-all group',
          env.status === 'active' ? 'hover:border-[#E1EBE8] hover:shadow-sm cursor-pointer' : 'opacity-80'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div>
              <p
                class="font-bold text-sm text-gray-800 transition-colors"
                :class="env.status === 'active' ? 'group-hover:text-[#5B8C85]' : ''"
              >
                {{ env.name }}
              </p>
              <div class="flex items-center gap-2 mt-0.5">
                <span
                  class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                  :class="[
                    statusColors[env.status].badgeBg,
                    statusColors[env.status].text,
                  ]"
                >
                  {{ statusLabels[env.status] }}
                </span>
                <span class="text-xs text-gray-400">
                  {{ formatDate(env.start_date) }} -
                  {{ formatDate(env.end_date) }}
                </span>
              </div>
            </div>
          </div>
          <div class="text-right">
            <p class="font-bold text-sm text-gray-900">
              {{ Number(env.amount).toFixed(2) }}
              <span class="text-xs font-semibold text-gray-400">{{
                currencyCode
              }}</span>
            </p>
          </div>
        </div>

        <div class="mt-3">
          <div class="flex justify-between text-xs mb-1">
            <span class="text-gray-500 font-medium"
              >{{ Number(env.total_spent || 0).toFixed(2) }} dépensés</span
            >
            <span class="text-[#5B8C85] font-bold"
              >{{
                Math.max(0, env.amount - (env.total_spent || 0)).toFixed(2)
              }}
              restants</span
            >
          </div>
          <div class="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              class="bg-[#5B8C85] h-1.5 rounded-full transition-all duration-300"
              :style="{
                width:
                  Math.min(100, ((env.total_spent || 0) / env.amount) * 100) +
                  '%',
              }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Bouton Voir Tout -->
      <div v-if="envelopeStore.envelopes.length > 3" class="text-center mt-4">
        <router-link
          :to="{ name: 'envelopes' }"
          class="text-sm font-bold text-[#5B8C85] hover:text-[#4a736d] hover:underline transition-colors active:scale-95 inline-block"
        >
          Voir tout
        </router-link>
      </div>
    </div>

    <div
      v-else
      class="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200"
    >
      <p class="text-sm text-gray-500 font-medium mb-3">
        Aucune enveloppe active.
      </p>
      <button
        @click="openAddModal"
        class="text-[#5B8C85] text-sm font-bold hover:underline"
      >
        Créer votre première enveloppe
      </button>
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

const financeStore = useFinanceStore();
const currencyStore = useCurrencyStore();
const envelopeStore = useEnvelopeStore();

const currencyCode = computed(
  () => currencyStore.currentCurrency?.code || "TND",
);

const recentEnvelopes = computed(() => {
  const envs = [...(envelopeStore.processedEnvelopes || [])];
  return envs
    .sort((a, b) => {
      const dateA = new Date(a.updated_at || a.created_at || a.start_date).getTime();
      const dateB = new Date(b.updated_at || b.created_at || b.start_date).getTime();
      return dateB - dateA;
    })
    .slice(0, 3);
});

// Logique intelligente : Nous soustrayons de la réserve ce qui a DÉJÀ été dépensé
const realTotalReserved = computed(() => {
  const activeEnvelopes = envelopeStore.processedEnvelopes.filter(
    (e) => e.status === "active",
  );
  return activeEnvelopes.reduce((sum, env) => {
    const amount = parseFloat(env.amount) || 0;
    const spent = parseFloat(env.total_spent) || 0;
    return sum + Math.max(0, amount - spent);
  }, 0);
});

// "Reste à dépenser" utilise maintenant realTotalReserved.
// Magie: A la fin de l'enveloppe, son 'status' devient 'ended',
// elle sort donc de `realTotalReserved` et son montant restant bascule automatiquement dans le Reste à dépenser !
const availableMainBalance = computed(() => {
  const rawBalance = parseFloat(financeStore.balance) || 0;
  return Math.max(0, rawBalance - realTotalReserved.value);
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
    // Calcul de la différence dépensée pour agir sur le solde principal de manière synchrone.
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

    // Retrait (ou rajout si correction) synchrone sur le Solde Principal réel.
    if (diff !== 0) {
      financeStore.balance -= diff;
    }

    isModalOpen.value = false;
  } catch (error) {
    showToast("Une erreur est survenue lors de l'enregistrement.", "error");
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
    // Synchroniser le solde principal côté frontend
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
