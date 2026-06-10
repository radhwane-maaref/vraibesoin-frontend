<template>
  <div
    class="min-h-screen bg-[#F8F6F2] font-['DM_Sans',_sans-serif] flex justify-center overflow-x-hidden"
  >
    <div
      class="w-full max-w-3xl px-4 sm:px-6 md:px-8 py-6 sm:py-8 lg:py-10 flex flex-col"
    >
      <SettingsPageHeader title="Avis et réclamations" />

      <main class="flex-grow flex flex-col">
        <div class="mb-8 sm:mb-10 px-1 sm:px-2">
          <h2
            class="text-[20px] sm:text-[22px] font-bold text-[#000000] mb-3 leading-snug"
          >
            Exprimez-vous librement
          </h2>
          <p
            class="text-[#9CA3AF] text-[15px] sm:text-[16px] leading-relaxed max-w-lg"
          >
            Remplissez le formulaire ci-dessous pour laisser un avis ou déposer
            une réclamation.
          </p>
        </div>

        <form
          @submit.prevent="submitForm"
          class="flex flex-col gap-6 sm:gap-8 px-1 sm:px-2"
        >
          <div class="flex flex-col gap-3">
            <label
              for="objet"
              class="text-[17px] sm:text-[18px] font-bold text-[#000000]"
            >
              Objet
            </label>
            <input
              id="objet"
              type="text"
              v-model="form.subject"
              placeholder="Exp : Problème de connexion"
              class="w-full bg-[#FFFFFF] border border-[#D9D9D9] rounded-[15px] px-4 sm:px-5 py-3 sm:py-4 text-[15px] sm:text-[16px] text-[#000000] placeholder-[#9CA3AF] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5B8C85]/30 focus:border-[#5B8C85] focus:shadow-md transition-all"
              required
            />
          </div>

          <div class="flex flex-col gap-3">
            <label class="text-[17px] sm:text-[18px] font-bold text-[#000000]">
              Votre note
            </label>
            <div class="flex flex-wrap items-center gap-2 sm:gap-3 group">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                @click="form.rating = star"
                @mouseenter="hoveredRating = star"
                @mouseleave="hoveredRating = 0"
                class="focus:outline-none transition-transform hover:scale-110 p-1 -ml-1 sm:p-0 sm:ml-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-9 h-9 sm:w-10 sm:h-10 transition-all duration-300"
                  :class="
                    star <= (hoveredRating || form.rating)
                      ? 'text-[#FBBF24] drop-shadow-md scale-105'
                      : 'text-[#D9D9D9] drop-shadow-sm'
                  "
                >
                  <path
                    fill-rule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <label
              for="message"
              class="text-[17px] sm:text-[18px] font-bold text-[#000000]"
            >
              Message
            </label>
            <textarea
              id="message"
              v-model="form.message"
              rows="6"
              placeholder="Décrivez votre problème en détail ..."
              class="w-full bg-[#FFFFFF] border border-[#D9D9D9] rounded-[15px] px-4 sm:px-5 py-3 sm:py-4 text-[15px] sm:text-[16px] text-[#000000] placeholder-[#9CA3AF] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5B8C85]/30 focus:border-[#5B8C85] focus:shadow-md transition-all resize-none"
              required
            ></textarea>
          </div>

          <div class="mt-6 sm:mt-12 flex justify-center">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="bg-[#5B8C85] hover:bg-[#4a736d] hover:shadow-md active:scale-[0.98] text-[#FFFFFF] text-[18px] sm:text-[22px] font-medium px-8 sm:px-16 py-3.5 sm:py-4 rounded-[24px] sm:rounded-[30px] w-full sm:w-auto sm:min-w-[280px] transition-all focus:outline-none focus:ring-4 focus:ring-[#5B8C85]/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? "Envoi en cours..." : "Envoyer" }}
            </button>
          </div>
        </form>
      </main>
    </div>

    <!-- Custom Modal -->
    <div
      v-if="modal.show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div
        class="bg-[#FFFFFF] border border-[#D9D9D9] rounded-[24px] shadow-2xl p-6 sm:p-8 max-w-sm w-full animate-fade-in"
      >
        <div class="flex flex-col items-center text-center">
          <!-- Icon depending on status -->
          <div
            v-if="modal.type === 'success'"
            class="w-12 h-12 rounded-full bg-[#5B8C85]/10 flex items-center justify-center text-[#5B8C85] mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>
          <div
            v-else
            class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>

          <h3 class="text-[18px] sm:text-[20px] font-bold text-[#000000] mb-2">
            {{ modal.title }}
          </h3>
          <p class="text-gray-500 text-[14px] sm:text-[15px] leading-relaxed mb-6">
            {{ modal.message }}
          </p>

          <button
            @click="closeModal"
            class="w-full bg-[#5B8C85] hover:bg-[#4a736d] text-white text-[16px] font-medium py-2.5 sm:py-3 rounded-[18px] transition-colors focus:outline-none focus:ring-2 focus:ring-[#5B8C85]/30"
          >
            D'accord
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import api from "@/services/api";
import SettingsPageHeader from "@/components/shared/SettingsPageHeader.vue";

const form = ref({
  rating: 0,
  subject: "",
  message: "",
});

const hoveredRating = ref(0);
const isSubmitting = ref(false);

const modal = ref({
  show: false,
  type: "success",
  title: "",
  message: "",
});

const showModal = (type, title, message) => {
  modal.value = {
    show: true,
    type,
    title,
    message,
  };
};

const closeModal = () => {
  modal.value.show = false;
};

const submitForm = async () => {
  if (!form.value.subject || !form.value.message) return;
  if (form.value.rating === 0) {
    showModal("error", "Note requise", "Veuillez sélectionner une note entre 1 et 5 étoiles.");
    return;
  }

  isSubmitting.value = true;

  try {
    const payload = {
      rating: form.value.rating,
      comment: form.value.message,
      subject: form.value.subject,
    };

    await api.post("/app-feedback/", payload);

    showModal("success", "Message envoyé", "Votre message a été envoyé avec succès !");

    form.value.rating = 0;
    form.value.subject = "";
    form.value.message = "";
  } catch (error) {
    console.error("Erreur lors de la soumission du formulaire:", error);
    showModal("error", "Erreur d'envoi", "Une erreur est survenue lors de l'envoi de votre message.");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap");

.animate-fade-in {
  animation: fadeIn 0.2s ease-out forwards;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
