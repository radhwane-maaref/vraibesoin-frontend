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
            une reclamation.
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
              class="w-full bg-[#FFFFFF] border border-[#D9D9D9] rounded-[15px] px-4 sm:px-5 py-3 sm:py-4 text-[15px] sm:text-[16px] text-[#000000] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#5B8C85]/30 focus:border-[#5B8C85] transition-all"
              required
            />
          </div>
          <div class="flex flex-col gap-3">
            <label class="text-[17px] sm:text-[18px] font-bold text-[#000000]">
              Votre note
            </label>
            <div class="flex flex-wrap items-center gap-2 sm:gap-3">
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
                  class="w-9 h-9 sm:w-10 sm:h-10 transition-colors duration-200"
                  :class="
                    star <= (hoveredRating || form.rating)
                      ? 'text-[#FBBF24]'
                      : 'text-[#D9D9D9]'
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
              class="w-full bg-[#FFFFFF] border border-[#D9D9D9] rounded-[15px] px-4 sm:px-5 py-3 sm:py-4 text-[15px] sm:text-[16px] text-[#000000] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#5B8C85]/30 focus:border-[#5B8C85] transition-all resize-none"
              required
            ></textarea>
          </div>

          <div class="mt-6 sm:mt-12 flex justify-center">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="bg-[#5B8C85] hover:bg-[#4a736d] text-[#FFFFFF] text-[18px] sm:text-[22px] font-medium px-8 sm:px-16 py-3.5 sm:py-4 rounded-[24px] sm:rounded-[30px] w-full sm:w-auto sm:min-w-[280px] transition-colors shadow-sm focus:outline-none focus:ring-4 focus:ring-[#5B8C85]/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? "Envoi en cours..." : "Envoyer" }}
            </button>
          </div>
        </form>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import api from "@/services/api";
import SettingsPageHeader from "@/components/shared/SettingsPageHeader.vue";

// Form state
const form = ref({
  rating: 0,
  subject: "",
  message: "",
});

const hoveredRating = ref(0);
const isSubmitting = ref(false);

const submitForm = async () => {
  if (!form.value.subject || !form.value.message) return;
  if (form.value.rating === 0) {
    alert("Veuillez sélectionner une note entre 1 et 5 étoiles.");
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

    alert("Votre message a été envoyé avec succès !");

    form.value.rating = 0;
    form.value.subject = "";
    form.value.message = "";
  } catch (error) {
    console.error("Erreur lors de la soumission du formulaire:", error);
    alert("Une erreur est survenue lors de l'envoi de votre message.");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap");
</style>
