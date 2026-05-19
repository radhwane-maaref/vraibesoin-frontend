<template>
  <div
    class="min-h-screen bg-[#F8F6F2] font-dmsans text-slate-800 overflow-x-hidden no-scrollbar w-full relative pb-24"
  >
    <header
      class="pt-10 pb-8 px-6 lg:px-12 flex items-center justify-between relative"
    >
      <div class="w-full max-w-5xl mx-auto flex items-center justify-center">
        <div>
          <h1
            class="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight"
          >
            Suivi des anomalies
          </h1>
        </div>
      </div>
    </header>

    <main class="flex-1 overflow-y-auto pb-28">
      <div class="w-full max-w-5xl mx-auto px-4 lg:px-12">
        <div
          class="bg-white/80 backdrop-blur-md p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-8 relative z-10 transition-shadow hover:shadow-md"
        >
          <div class="relative flex-1">
            <svg
              class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              v-model="filters.search"
              @keyup.enter="loadData"
              type="text"
              placeholder="Rechercher une erreur, un endpoint..."
              class="w-full pl-11 pr-5 py-3.5 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-[#5A877E]/30 focus:border-[#5A877E] outline-none transition-all"
            />
          </div>

          <div class="w-full md:w-56 shrink-0">
            <CustomSelect
              v-model="filters.status"
              :options="statusOptions"
              placeholder="Tous les statuts"
              sizeClass="py-3.5 h-[50px]"
              roundedClass="rounded-2xl bg-gray-50 border-gray-100 hover:bg-gray-100 transition-colors"
              @change="loadData"
            />
          </div>
        </div>

        <div
          v-if="adminStore.loading"
          class="flex flex-col items-center justify-center py-20"
        >
          <div
            class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#5A877E] mb-4"
          ></div>
          <span class="text-sm text-gray-500 font-medium"
            >Chargement des logs...</span
          >
        </div>

        <div
          v-else-if="groupedErrors.length === 0"
          class="text-center py-24 bg-white rounded-[2rem] border border-dashed border-gray-200 shadow-sm"
        >
          <div
            class="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-800 mb-1">Système stable</h3>
          <p class="text-gray-400 font-medium text-sm">
            Aucune anomalie ne correspond à vos critères.
          </p>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div
            v-for="group in groupedErrors"
            :key="group.latest.id"
            @click="openDetails(group.latest)"
            class="bg-white p-6 rounded-[2rem] border border-gray-100 hover:border-[#5A877E]/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
          >
            <div class="flex justify-between items-start mb-4 gap-4">
              <div class="flex items-center gap-2 flex-wrap">
                <span
                  :class="statusColors[group.latest.status]"
                  class="text-[11px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-wide"
                >
                  {{ translateStatus(group.latest.status) }}
                </span>

                <span
                  v-if="group.latest.priority === 'CRITICAL'"
                  class="text-[11px] font-bold px-3 py-1.5 bg-red-50 text-red-600 rounded-xl uppercase flex items-center gap-1"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"
                  ></span>
                  Critique
                </span>

                <span
                  v-if="group.count > 1"
                  class="text-[11px] font-bold px-3 py-1.5 bg-gray-100 text-gray-600 rounded-xl flex items-center gap-1"
                >
                  <svg
                    class="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  {{ group.count }}
                </span>
              </div>
              <span
                class="text-xs text-gray-400 font-medium whitespace-nowrap shrink-0"
                >{{ timeAgo(group.latest.created_at) }}</span
              >
            </div>

            <div class="mt-auto">
              <span
                class="inline-block px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-mono rounded mb-2"
              >
                {{ group.latest.http_method }} {{ group.latest.endpoint_url }}
              </span>
              <h3
                class="text-[15px] font-medium text-gray-800 line-clamp-2 group-hover:text-[#5A877E] transition-colors leading-relaxed"
              >
                {{ group.latest.error_message }}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div v-if="selectedLog" class="fixed inset-0 z-[70] flex justify-end">
      <div
        class="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        @click="closeDetails"
      ></div>

      <div
        class="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-slide-in border-l border-gray-100"
      >
        <div
          class="p-6 border-b border-gray-100 flex justify-between items-start shrink-0 bg-gray-50/50"
        >
          <div>
            <h2 class="text-2xl font-bold text-gray-900 tracking-tight">
              Détails de l'anomalie
            </h2>
            <p
              class="text-xs text-gray-500 mt-2 font-medium flex items-center gap-2"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Signalé le
              {{ new Date(selectedLog.created_at).toLocaleString("fr-FR") }}
            </p>
          </div>
          <button
            @click="closeDetails"
            class="w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-gray-100 hover:text-gray-900 flex items-center justify-center text-gray-500 transition-all shadow-sm"
          >
            ✕
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          <div class="grid grid-cols-2 gap-5">
            <div class="space-y-2.5">
              <label
                class="text-[11px] font-bold text-gray-500 uppercase tracking-wider"
                >Statut d'avancement</label
              >
              <CustomSelect
                v-model="editForm.status"
                :options="statusOptions"
                sizeClass="h-12"
                roundedClass="rounded-xl bg-gray-50 border-gray-200"
              />
            </div>
            <div class="space-y-2.5">
              <label
                class="text-[11px] font-bold text-gray-500 uppercase tracking-wider"
                >Niveau de Sévérité</label
              >
              <CustomSelect
                v-model="editForm.priority"
                :options="priorityOptions"
                sizeClass="h-12"
                roundedClass="rounded-xl bg-gray-50 border-gray-200"
              />
            </div>
          </div>

          <section class="space-y-2.5">
            <label
              class="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"
            >
              <svg
                class="w-4 h-4 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Description de l'erreur
            </label>
            <div class="bg-red-50/80 border border-red-100 p-4 rounded-2xl">
              <span
                class="inline-block px-2 py-1 bg-red-100 text-red-600 text-[10px] font-mono rounded mb-2 font-bold"
              >
                {{ selectedLog.http_method }} {{ selectedLog.endpoint_url }}
              </span>
              <p
                class="text-sm font-mono text-red-800 leading-relaxed break-words"
              >
                {{ selectedLog.error_message }}
              </p>
            </div>
          </section>

          <section class="space-y-2.5">
            <label
              class="text-[11px] font-bold text-gray-500 uppercase tracking-wider"
              >Notes de résolution</label
            >
            <textarea
              v-model="editForm.note"
              class="w-full text-sm border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#5A877E]/20 focus:border-[#5A877E] p-4 bg-gray-50 outline-none transition-all resize-none min-h-[120px] placeholder:text-gray-400"
              placeholder="Expliquez la cause identifiée ou la solution apportée..."
            ></textarea>
          </section>

          <details
            v-if="selectedLog.stack_trace"
            class="group border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white"
          >
            <summary
              class="list-none cursor-pointer p-4 text-[11px] font-bold text-gray-600 uppercase tracking-wide flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <span class="flex items-center gap-2">
                <svg
                  class="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
                Rapport technique détaillé (Stack Trace)
              </span>
              <span
                class="group-open:rotate-180 transition-transform duration-300 text-gray-400"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </summary>
            <div
              class="p-5 bg-slate-900 overflow-x-auto border-t border-gray-200"
            >
              <pre
                class="text-[11px] font-mono text-emerald-400 leading-relaxed"
                >{{ selectedLog.stack_trace }}</pre
              >
            </div>
          </details>
        </div>

        <div class="p-6 border-t border-gray-100 bg-gray-50 shrink-0">
          <button
            @click="handleSave"
            class="w-full bg-[#5A877E] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#4b7269] hover:shadow-lg hover:shadow-[#5A877E]/30 transition-all flex justify-center items-center gap-2"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Sauvegarder les modifications
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showNoteModal"
      class="fixed inset-0 z-[100] flex items-center justify-center px-4"
    >
      <div
        class="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
        @click="showNoteModal = false"
      ></div>
      <div
        class="bg-white rounded-[2rem] p-8 w-full max-w-sm relative z-10 shadow-2xl animate-pop border border-gray-100"
      >
        <div
          class="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-6 mx-auto border border-orange-100"
        >
          <svg
            class="w-8 h-8 text-orange-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-3 text-center">
          Note de résolution manquante
        </h3>
        <p class="text-sm text-gray-500 mb-8 leading-relaxed text-center">
          Vous fermez cette anomalie sans documenter la solution. Êtes-vous sûr
          de vouloir continuer sans laisser de trace pour l'équipe ?
        </p>
        <div class="flex gap-3">
          <button
            @click="showNoteModal = false"
            class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-colors"
          >
            Annuler
          </button>
          <button
            @click="confirmSave"
            class="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-orange-500/20"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="toastMsg"
        class="fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] bg-slate-800 text-white px-6 py-3.5 rounded-2xl text-sm font-medium shadow-2xl flex items-center gap-3 border border-slate-700"
      >
        <span
          class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"
        ></span>
        {{ toastMsg }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useAdminStore } from "@/stores/admin";
import CustomSelect from "@/components/shared/CustomSelect.vue";

const adminStore = useAdminStore();
const selectedLog = ref(null);
const toastMsg = ref("");
const showNoteModal = ref(false);

const editForm = reactive({
  status: "",
  priority: "",
  note: "",
});

const statusLabels = {
  NEW: "Nouveau",
  TRIAGED: "En analyse",
  IN_PROGRESS: "En cours",
  FIXED: "Corrigé",
  VERIFIED: "Vérifié",
  CLOSED: "Fermé",
};

const priorityLabels = {
  LOW: "Basse",
  MEDIUM: "Moyenne",
  HIGH: "Haute",
  CRITICAL: "Critique",
};

const statusOptions = [
  { value: "", label: "Tous les statuts" },
  ...Object.entries(statusLabels).map(([v, l]) => ({ value: v, label: l })),
];

const priorityOptions = [
  { value: "", label: "Toutes priorités" },
  ...Object.entries(priorityLabels).map(([v, l]) => ({ value: v, label: l })),
];

const filters = reactive({ status: "", priority: "", search: "" });

const statusColors = {
  NEW: "bg-purple-100 text-purple-700 border border-purple-200",
  TRIAGED: "bg-blue-100 text-blue-700 border border-blue-200",
  IN_PROGRESS: "bg-orange-100 text-orange-700 border border-orange-200",
  FIXED: "bg-green-100 text-green-700 border border-green-200",
  VERIFIED: "bg-teal-100 text-teal-700 border border-teal-200",
  CLOSED: "bg-gray-100 text-gray-600 border border-gray-200",
};

const groupedErrors = computed(() => {
  const groups = {};
  if (!adminStore.errors) return [];

  adminStore.errors.forEach((log) => {
    const key = `${log.http_method}_${log.endpoint_url}_${log.error_message}`;
    if (!groups[key]) groups[key] = { count: 0, latest: log };
    groups[key].count++;
    if (new Date(log.created_at) > new Date(groups[key].latest.created_at)) {
      groups[key].latest = log;
    }
  });
  return Object.values(groups).sort(
    (a, b) => new Date(b.latest.created_at) - new Date(a.latest.created_at),
  );
});

const loadData = () => adminStore.fetchErrors(filters);
const translateStatus = (val) => statusLabels[val] || val;

const openDetails = (log) => {
  selectedLog.value = log;
  editForm.status = log.status;
  editForm.priority = log.priority;
  editForm.note = log.resolution_note || "";
};

const closeDetails = () => {
  selectedLog.value = null;
  showNoteModal.value = false;
};

const showToast = (msg) => {
  toastMsg.value = msg;
  setTimeout(() => (toastMsg.value = ""), 3500);
};

const handleSave = () => {
  if (!selectedLog.value) return;

  const isFinalStatus = ["FIXED", "CLOSED", "VERIFIED"].includes(
    editForm.status,
  );
  if (isFinalStatus && editForm.note.trim().length < 5) {
    showNoteModal.value = true;
  } else {
    confirmSave();
  }
};

const confirmSave = async () => {
  showNoteModal.value = false;
  try {
    const payload = {
      status: editForm.status,
      priority: editForm.priority,
      resolution_note: editForm.note.trim(),
    };

    await adminStore.updateErrorLog(selectedLog.value.id, payload);

    showToast("Statut de l'anomalie mis à jour avec succès.");
    loadData();
    closeDetails();
  } catch (e) {
    showToast("Une erreur est survenue lors de la mise à jour.");
  }
};

const timeAgo = (dateStr) => {
  const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
  if (diff < 60) return "À l'instant";
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} h`;
  return `Il y a ${Math.floor(diff / 86400)} j`;
};

onMounted(() => loadData());
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap");

.font-dmsans {
  font-family: "DM Sans", sans-serif;
}

.animate-slide-in {
  animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.animate-pop {
  animation: pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes pop {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px) scale(0.95);
}

/* Custom Scrollbar for better UX inside sidebar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}
</style>
