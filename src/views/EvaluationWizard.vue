<template>
  <div class="min-h-screen bg-[#F8F6F2] font-['DM_Sans',_sans-serif] pb-12">
    <div class="max-w-3xl mx-auto w-full h-full flex flex-col">
      <div class="relative z-10 border-b border-gray-100 bg-white/50">
        <header
          class="px-4 sm:px-6 py-4 sm:py-5 flex justify-center items-center relative max-w-3xl mx-auto w-full"
        >
          <h1
            class="text-lg sm:text-xl font-bold text-gray-900 text-center truncate px-10"
          >
            <span v-if="currentStep === 'QUESTIONS'"
              >Questions de réflexion</span
            >
            <span v-else-if="currentStep === 'LOADING'">Vrai Besoin</span>
            <span v-else>Analyse en cours</span>
          </h1>
          <button
            @click="showCancelModal = true"
            class="absolute right-2 sm:right-4 p-2 text-gray-400 rounded-full hover:text-gray-700 hover:bg-gray-200 active:bg-gray-300 transition-all"
            aria-label="Fermer"
          >
            <svg
              class="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </header>

        <div
          v-if="currentStep === 'QUESTIONS'"
          class="px-4 sm:px-6 pb-4 w-full max-w-lg mx-auto"
        >
          <div class="flex justify-between items-center mb-2">
            <span
              class="text-[10px] sm:text-xs font-bold text-[#5A877E] uppercase tracking-wider"
            >
              Question {{ activeQuestionIndex + 1 }} sur 3
            </span>
          </div>
          <div class="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-[#5A877E] transition-all duration-500 ease-out rounded-full"
              :style="{ width: `${((activeQuestionIndex + 1) / 3) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>

      <main
        v-if="currentStep === 'GENERATING_QUESTIONS'"
        class="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 mt-12 sm:mt-20"
      >
        <div class="relative w-20 h-20 sm:w-24 sm:h-24 mb-6 sm:mb-8">
          <div
            class="absolute inset-0 border-4 border-[#E1EBE8] rounded-full"
          ></div>
          <div
            class="absolute inset-0 border-4 border-[#5A877E] rounded-full border-t-transparent animate-spin"
          ></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-[#5A877E] font-bold text-lg sm:text-xl">{{ progressPercentage }}%</span>
          </div>
        </div>
        <h2
          class="text-xl sm:text-2xl font-serif font-bold text-gray-900 mb-2 text-center"
        >
          Préparation des questions...
        </h2>
      </main>

      <main
        v-else-if="currentStep === 'QUESTIONS'"
        class="flex-grow flex flex-col items-center pt-6 sm:pt-8 px-4 pb-6"
      >
        <div
          v-if="currentQuestion"
          class="w-full max-w-lg flex flex-col h-full"
        >
          <div class="space-y-4 sm:space-y-6 flex-grow">
            <div
              class="bg-white px-5 py-8 sm:px-8 sm:py-10 rounded-3xl sm:rounded-[2rem] shadow-md border border-gray-100 text-center flex flex-col justify-center min-h-[120px] sm:min-h-[140px]"
            >
              <h2
                class="text-lg sm:text-2xl font-serif font-medium text-[#1F2937] leading-relaxed max-w-md mx-auto"
              >
                {{ currentQuestion.question_text }}
              </h2>
            </div>

            <div class="space-y-3 sm:space-y-4">
              <button
                v-for="(option, idx) in currentQuestion.ai_options"
                :key="idx"
                @click="selectOption(option)"
                class="w-full p-4 sm:p-5 rounded-2xl text-sm sm:text-base font-medium transition-all duration-200 ease-out text-left border shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                :class="
                  selectedAnswer === option
                    ? 'border-[#5A877E] bg-[#E1EBE8] text-[#5A877E] shadow-md ring-2 ring-[#5A877E]/20'
                    : 'border-gray-100 bg-white text-gray-700 hover:border-[#5A877E]/40 hover:bg-[#F8FAFA] hover:shadow-md'
                "
              >
                {{ option }}
              </button>

              <div v-if="showCustomInput" class="w-full">
                <input
                  v-model="customAnswerText"
                  type="text"
                  placeholder="Précisez votre pensée..."
                  class="w-full p-4 sm:p-5 border rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus:outline-none transition-all duration-200 text-sm sm:text-base"
                  :class="
                    customAnswerText.trim()
                      ? 'border-[#5A877E] ring-4 ring-[#E1EBE8]/50 bg-white'
                      : 'border-gray-200 focus:border-[#5A877E] focus:ring-4 focus:ring-[#E1EBE8]/50'
                  "
                  @keyup.enter="goNext"
                  autofocus
                />
              </div>
              <button
                v-else
                @click="enableCustomInput"
                class="w-full p-4 sm:p-5 rounded-2xl text-sm sm:text-base font-medium bg-white border border-gray-100 text-gray-500 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all duration-200 ease-out text-left"
              >
                Autre (saisir une réponse)
              </button>
            </div>
          </div>

          <div class="flex gap-3 pt-6 mt-6 border-t border-gray-100">
            <button
              @click="goPrevious"
              :disabled="activeQuestionIndex === 0"
              class="flex-1 px-4 sm:px-6 py-3 sm:py-2 rounded-2xl text-sm sm:text-base font-medium transition-all bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            <button
              @click="goNext"
              :disabled="!currentAnswerValid"
              class="flex-1 px-4 sm:px-6 py-3 sm:py-2 rounded-2xl text-sm sm:text-base font-medium transition-all bg-[#5A877E] text-white shadow-sm hover:bg-[#4a7269] hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:hover:bg-[#5A877E] disabled:cursor-not-allowed"
            >
              {{
                activeQuestionIndex === 2 ? "Obtenir mon verdict" : "Suivant"
              }}
            </button>
          </div>
        </div>
      </main>

      <main
        v-else-if="currentStep === 'LOADING'"
        class="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 mt-12 sm:mt-20"
      >
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
          Analyse en cours...
        </h2>
        <div
          class="w-full max-w-xs sm:max-w-sm bg-white rounded-full h-6 sm:h-8 overflow-hidden shadow-sm border border-gray-100 p-1"
        >
          <div
            class="bg-gradient-to-r from-[#5A877E] to-[#80E8C4] h-full rounded-full transition-all duration-300 ease-out"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
        <p class="mt-3 sm:mt-4 text-lg sm:text-xl font-bold text-gray-800">
          {{ progressPercentage }}%
        </p>
      </main>

      <main
        v-else-if="currentStep === 'RESULT'"
        class="flex-grow flex flex-col px-4 sm:px-6 pt-6 pb-8 w-full max-w-3xl mx-auto"
      >
        <div
          class="flex items-center gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-2xl shadow-sm mb-4 sm:mb-6"
        >
          <div
            class="w-14 h-14 sm:w-16 sm:h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-100"
          >
            <img
              v-if="intentionData.product_image"
              :src="intentionData.product_image"
              class="w-full h-full object-cover"
              alt="Produit"
            />
            <svg
              v-else
              class="w-6 h-6 sm:w-8 sm:h-8 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <h3 class="font-bold text-base sm:text-lg text-gray-900 truncate">
              {{ intentionData.product_name }}
            </h3>
            <p class="text-gray-400 font-semibold text-sm sm:text-base">
              {{ intentionData.product_price }}
              {{ currencyStore.currentCurrency.code }}
            </p>
          </div>
        </div>

        <div
          class="bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-gray-100 mb-6 sm:mb-8 flex flex-col"
        >
          <h4
            class="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-gray-800 text-center"
          >
            Verdict final
          </h4>

          <div
            v-if="intentionData.ai_verdict"
            class="w-fit mx-auto mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl border"
            :class="{
              'bg-[#FEE2E2]/50 border-[#FEE2E2] text-[#EF4444]':
                intentionData.ai_verdict === 'BUY',
              'bg-[#FEF3C7]/50 border-[#FEF3C7] text-[#D97706]':
                intentionData.ai_verdict === 'CALM',
              'bg-[#E1EBE8]/50 border-[#E1EBE8] text-[#5A877E]':
                intentionData.ai_verdict === 'ABANDON',
            }"
          >
            <svg
              v-if="intentionData.ai_verdict === 'BUY'"
              class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
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
            <svg
              v-else-if="intentionData.ai_verdict === 'CALM'"
              class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <svg
              v-else-if="intentionData.ai_verdict === 'ABANDON'"
              class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span class="font-bold text-sm sm:text-base tracking-wide">{{
              formatVerdict(intentionData.ai_verdict)
            }}</span>
          </div>

          <p
            class="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-wrap text-center"
          >
            {{ intentionData.ai_reasoning }}
          </p>
        </div>

        <div class="mt-auto">
          <p class="text-center text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
            Quelle est ta décision finale ?
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <button
              @click="triggerAction('BUY')"
              class="relative w-full flex flex-col items-center py-3 sm:py-4 rounded-2xl transition-all duration-200"
              :class="[
                intentionData.ai_verdict === 'BUY'
                  ? 'bg-[#FEE2E2] ring-4 ring-red-100 border-2 border-red-400 shadow-md scale-[1.02]'
                  : 'bg-[#FEE2E2] hover:bg-red-200 border-2 border-transparent',
              ]"
            >
              <span
                v-if="intentionData.ai_verdict === 'BUY'"
                class="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-[#EF4444] border-2 border-[#FEE2E2] text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest py-1 px-3 sm:px-4 rounded-full shadow-sm whitespace-nowrap"
                >Recommandé</span
              >
              <span class="font-bold text-[#EF4444] text-base sm:text-lg"
                >Acheter</span
              >
              <span class="text-[10px] sm:text-xs text-red-400"
                >J'en ai vraiment besoin</span
              >
            </button>

            <button
              @click="triggerAction('CALM')"
              class="relative w-full flex flex-col items-center py-3 sm:py-4 rounded-2xl transition-all duration-200"
              :class="[
                intentionData.ai_verdict === 'CALM'
                  ? 'bg-[#FEF3C7] ring-4 ring-yellow-100 border-2 border-yellow-400 shadow-md scale-[1.02]'
                  : 'bg-[#FEF3C7] hover:bg-yellow-200 border-2 border-transparent',
              ]"
            >
              <span
                v-if="intentionData.ai_verdict === 'CALM'"
                class="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-[#D97706] border-2 border-[#FEF3C7] text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest py-1 px-3 sm:px-4 rounded-full shadow-sm whitespace-nowrap"
                >Recommandé</span
              >
              <span class="font-bold text-[#D97706] text-base sm:text-lg"
                >Attendre</span
              >
              <span class="text-[10px] sm:text-xs text-yellow-500"
                >Réfléchir {{ cooldownHours }}h de plus</span
              >
            </button>

            <button
              @click="triggerAction('ABANDON')"
              class="relative w-full flex flex-col items-center justify-center py-3 sm:py-4 rounded-2xl transition-all duration-200"
              :class="[
                intentionData.ai_verdict === 'ABANDON'
                  ? 'bg-[#E1EBE8] ring-4 ring-[#E1EBE8]/60 border-2 border-[#5A877E] shadow-md scale-[1.02]'
                  : 'bg-[#E1EBE8] hover:bg-[#cbe3dc] border-2 border-transparent',
              ]"
            >
              <span
                v-if="intentionData.ai_verdict === 'ABANDON'"
                class="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-[#5A877E] border-2 border-[#E1EBE8] text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest py-1 px-3 sm:px-4 rounded-full shadow-sm whitespace-nowrap"
                >Recommandé</span
              >
              <span class="font-bold text-[#5A877E] text-base sm:text-lg"
                >Abandonner</span
              >
              <span class="text-[10px] sm:text-xs text-[#5A877E]/70"
                >Je sauve mon budget</span
              >
            </button>
          </div>
        </div>
      </main>

      <div
        v-if="showCancelModal"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 transition-opacity"
      >
        <div
          class="bg-white p-5 sm:p-6 rounded-3xl sm:rounded-[2rem] w-full max-w-[90%] sm:max-w-sm text-center shadow-2xl border border-gray-100"
        >
          <div
            class="w-12 h-12 sm:w-16 sm:h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
          >
            <svg
              class="w-6 h-6 sm:w-8 sm:h-8 text-red-500"
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
          <h3 class="font-bold text-lg sm:text-xl text-gray-900 mb-2">
            Annuler l'analyse ?
          </h3>
          <p
            class="text-gray-500 text-xs sm:text-sm mb-6 sm:mb-8 leading-relaxed"
          >
            Si tu quittes maintenant, toutes les données de cette réflexion
            seront perdues.
          </p>
          <div class="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
            <button
              @click="showCancelModal = false"
              class="w-full sm:flex-1 py-3 sm:py-3.5 rounded-xl bg-gray-100 font-bold text-gray-700 hover:bg-gray-200 transition-colors text-sm sm:text-base"
            >
              Continuer
            </button>
            <button
              @click="executeCancel"
              class="w-full sm:flex-1 py-3 sm:py-3.5 rounded-xl bg-[#FEE2E2] font-bold text-[#EF4444] hover:bg-red-200 transition-colors text-sm sm:text-base"
            >
              Oui, quitter
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      >
        <div
          class="bg-white p-5 sm:p-6 rounded-3xl w-full max-w-[90%] sm:max-w-sm text-center shadow-xl border border-gray-100"
        >
          <div
            class="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
            :class="modalContent.iconBg"
          >
            <svg
              class="w-6 h-6 sm:w-8 sm:h-8"
              :class="modalContent.iconColor"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="modalContent.iconPath"
              />
            </svg>
          </div>
          <h3 class="font-bold text-lg sm:text-xl mb-2 text-gray-900">
            {{ modalContent.title }}
          </h3>
          <p class="text-gray-500 text-xs sm:text-sm mb-6">
            {{ modalContent.description }}
          </p>
          <div class="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
            <button
              @click="showModal = false"
              class="w-full sm:flex-1 py-3 rounded-xl bg-gray-100 font-semibold text-gray-600 hover:bg-gray-200 text-sm sm:text-base"
            >
              Annuler
            </button>
            <button
              @click="submitFinalDecision"
              class="w-full sm:flex-1 py-3 rounded-xl font-semibold text-white shadow-sm transition-colors text-sm sm:text-base"
              :class="modalContent.btnColor"
            >
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * @module EvaluationWizard
 * @description Assistant interactif (wizard) en 3 étapes pour guider l'utilisateur
 * dans l'évaluation de son intention d'achat via l'IA.
 *
 * Déroulement du tunnel :
 * 1. `GENERATING_QUESTIONS` : Sollicitation de l'API pour générer 3 questions ciblées.
 * 2. `QUESTIONS` : Affichage successif des questions avec réponses suggérées ou saisie libre.
 * 3. `LOADING` / `RESULT` : Soumission des réponses pour verdict IA, puis présentation de
 *    la décision recommandée (Acheter, Attendre, Abandonner).
 *
 * @requires vue - ref, computed, onMounted
 * @requires vue-router - useRoute, useRouter
 * @requires @/services/api - Client HTTP configuré
 * @requires @/stores/currency - Store des devises
 * @requires @/stores/auth.js - Store d'authentification (pour récupérer la préférence de cooldown)
 */
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/services/api";
import { useCurrencyStore } from "@/stores/currency";
import { useAuthStore } from "@/stores/auth.js";

const authStore = useAuthStore();
const currencyStore = useCurrencyStore();
const route = useRoute();
const router = useRouter();
const intentionId = route.params.id;

/** @type {import('vue').ComputedRef<number>} Durée de réflexion préférée de l'utilisateur (en heures) */
const cooldownHours = computed(() => {
  return authStore.user?.cooldown_preference || 24;
});

/** @type {import('vue').Ref<boolean>} Contrôle de la modale de confirmation finale */
const showModal = ref(false);

/** @type {import('vue').Ref<string|null>} Action finale en attente de confirmation ('BUY', 'CALM', 'ABANDON') */
const pendingAction = ref(null);

/**
 * Contenu dynamique de la modale de confirmation selon l'action choisie.
 * @type {import('vue').ComputedRef<{title: string, description: string, iconBg: string, iconColor: string, btnColor: string, iconPath: string}>}
 */
const modalContent = computed(() => {
  if (pendingAction.value === "BUY") {
    return {
      title: "Valider l'achat ?",
      description:
        "Es-tu sûr que cet achat est réellement indispensable aujourd'hui ?",
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
      btnColor: "bg-red-500 hover:bg-red-600",
      iconPath:
        "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
    };
  } else if (pendingAction.value === "CALM") {
    return {
      title: "Mettre en pause ?",
      description: `L'analyse sera suspendue pendant ${cooldownHours.value} heures pour te laisser le temps de la réflexion.`,
      iconBg: "bg-yellow-50",
      iconColor: "text-yellow-500",
      btnColor: "bg-yellow-500 hover:bg-yellow-600",
      iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    };
  } else {
    return {
      title: "Abandonner cet achat ?",
      description:
        "Excellent choix ! Ton budget te remerciera de cette décision rationnelle.",
      iconBg: "bg-[#E1EBE8]",
      iconColor: "text-[#5A877E]",
      btnColor: "bg-[#5A877E] hover:bg-[#4a7269]",
      iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    };
  }
});

/** @type {import('vue').Ref<'INITIALIZING'|'GENERATING_QUESTIONS'|'QUESTIONS'|'LOADING'|'RESULT'>} Étape courante du wizard */
const currentStep = ref("INITIALIZING");

/** @type {import('vue').Ref<Array<Object>>} Liste des questions générées par l'IA */
const questions = ref([]);

/** @type {import('vue').Ref<number>} Index de la question actuellement affichée (0 à 2) */
const activeQuestionIndex = ref(0);

/** @type {import('vue').Ref<Array<{id: string|number, answer: string}>>} Tableau accumulant les réponses de l'utilisateur */
const userAnswers = ref([]);

/** @type {import('vue').Ref<Object>} Données de l'intention d'achat, incluant finalement le verdict IA */
const intentionData = ref({});

/** @type {import('vue').Ref<number>} Pourcentage de progression factice pour les écrans de chargement */
const progressPercentage = ref(0);

/** @type {import('vue').Ref<boolean>} Contrôle de la modale d'annulation globale */
const showCancelModal = ref(false);

/** @type {import('vue').Ref<boolean>} Bascule vers le champ de saisie libre pour la réponse à la question courante */
const showCustomInput = ref(false);

/** @type {import('vue').Ref<string>} Texte saisi par l'utilisateur si `showCustomInput` est vrai */
const customAnswerText = ref("");

/** @type {import('vue').Ref<string>} Réponse sélectionnée parmi les suggestions de l'IA */
const selectedAnswer = ref("");

/**
 * Traduit le code du verdict IA en libellé lisible.
 * @param {'BUY'|'CALM'|'ABANDON'|string} verdict - Code du verdict.
 * @returns {string} Libellé en français.
 */
const formatVerdict = (verdict) => {
  const labels = {
    BUY: "Acheter",
    CALM: "Attendre",
    ABANDON: "Abandonner",
  };
  return labels[verdict] || verdict;
};

/**
 * Cycle de vie : initialise le tunnel.
 * Charge l'intention ; si elle a déjà un verdict, passe directement à RESULT.
 * Sinon, demande la génération des 3 questions d'analyse.
 */
onMounted(async () => {
  try {
    const intentionRes = await api.get(`/purchase-intentions/${intentionId}/`);
    intentionData.value = intentionRes.data;

    if (intentionData.value.ai_verdict) {
      currentStep.value = "RESULT";
    } else {
      currentStep.value = "GENERATING_QUESTIONS";
      startProgressAnimation();
      const response = await api.post(
        `/purchase-intentions/${intentionId}/generate-questions/`,
      );
      clearInterval(progressInterval);
      progressPercentage.value = 100;
      questions.value = response.data;
      setTimeout(() => {
        currentStep.value = "QUESTIONS";
      }, 500);
    }
  } catch (error) {
    clearInterval(progressInterval);
    console.error("Erreur lors de l'initialisation du wizard", error);
  }
});

/** @type {import('vue').ComputedRef<Object|undefined>} Objet représentant la question courante */
const currentQuestion = computed(
  () => questions.value[activeQuestionIndex.value],
);

/** @type {import('vue').ComputedRef<boolean>} Évalue si une réponse valide a été fournie à la question courante */
const currentAnswerValid = computed(() => {
  if (showCustomInput.value) return customAnswerText.value.trim().length > 0;
  return selectedAnswer.value.length > 0;
});

/**
 * Sélectionne une suggestion de l'IA et désactive le champ libre.
 * @param {string} option - Le texte de l'option cliquée.
 */
const selectOption = (option) => {
  selectedAnswer.value = option;
  showCustomInput.value = false;
  customAnswerText.value = "";
};

/** Active le champ de saisie libre (désélectionne toute suggestion) */
const enableCustomInput = () => {
  showCustomInput.value = true;
  selectedAnswer.value = "";
};

/**
 * Restaure l'état de l'interface (sélection vs saisie libre) si
 * l'utilisateur revient sur une question précédente.
 */
const restoreAnswerState = () => {
  const saved = userAnswers.value[activeQuestionIndex.value];
  if (saved) {
    const isAiOption = questions.value[
      activeQuestionIndex.value
    ]?.ai_options.includes(saved.answer);
    if (isAiOption) {
      selectedAnswer.value = saved.answer;
      showCustomInput.value = false;
      customAnswerText.value = "";
    } else {
      showCustomInput.value = true;
      customAnswerText.value = saved.answer;
      selectedAnswer.value = "";
    }
  } else {
    selectedAnswer.value = "";
    showCustomInput.value = false;
    customAnswerText.value = "";
  }
};

/**
 * Enregistre la réponse courante et passe à la question suivante.
 * Si c'était la dernière question, lance la requête pour obtenir le verdict.
 * @async
 */
const goNext = async () => {
  if (!currentAnswerValid.value) return;

  const finalAnswer = showCustomInput.value
    ? customAnswerText.value.trim()
    : selectedAnswer.value;

  // Persiste la réponse dans le tableau par index (permet l'écrasement en cas de retour en arrière)
  userAnswers.value[activeQuestionIndex.value] = {
    id: currentQuestion.value.id,
    answer: finalAnswer,
  };

  if (activeQuestionIndex.value < 2) {
    activeQuestionIndex.value++;
    restoreAnswerState();
  } else {
    currentStep.value = "LOADING";
    startProgressAnimation();
    await fetchVerdict();
  }
};

/**
 * Recule d'une étape dans le questionnaire et restaure la réponse précédemment saisie.
 */
const goPrevious = () => {
  if (activeQuestionIndex.value > 0) {
    activeQuestionIndex.value--;
    restoreAnswerState();
  }
};

let progressInterval;
/**
 * Simule une barre de progression pour les appels API potentiellement longs
 * (génération de questions et analyse du verdict).
 */
const startProgressAnimation = () => {
  progressPercentage.value = 0;
  progressInterval = setInterval(() => {
    if (progressPercentage.value < 90) {
      progressPercentage.value += Math.floor(Math.random() * 5) + 2;
    }
  }, 200);
};

/**
 * Soumet les 3 réponses de l'utilisateur à l'API pour générer le verdict final.
 * Alterne vers l'écran de résultat en cas de succès.
 * @async
 */
const fetchVerdict = async () => {
  try {
    const response = await api.post(
      `/purchase-intentions/${intentionId}/verdict/`,
      {
        answers: userAnswers.value,
      },
    );

    clearInterval(progressInterval);
    progressPercentage.value = 100;
    intentionData.value = response.data;

    setTimeout(() => {
      currentStep.value = "RESULT";
    }, 500);
  } catch (error) {
    clearInterval(progressInterval);
    alert("Une erreur est survenue lors de l'analyse.");
    currentStep.value = "QUESTIONS";
  }
};

/**
 * Prépare l'action de clôture de l'intention selon la décision de l'utilisateur
 * et ouvre la modale de confirmation finale.
 * @param {'BUY'|'CALM'|'ABANDON'} decisionCode - Décision de l'utilisateur.
 */
const triggerAction = (decisionCode) => {
  pendingAction.value = decisionCode;
  showModal.value = true;
};

/**
 * Exécute l'appel API pour valider la décision finale choisie par l'utilisateur,
 * puis redirige vers le tableau de bord.
 * @async
 */
const submitFinalDecision = async () => {
  try {
    await api.patch(`/purchase-intentions/${intentionId}/final-decision/`, {
      user_final_decision: pendingAction.value,
    });
    showModal.value = false;
    router.push({ name: "dashboard" });
  } catch (error) {
    console.error("Erreur sauvegarde décision", error);
  }
};

/**
 * Interrompt purement et simplement le processus d'analyse en cours
 * et redirige vers le tableau de bord sans sauvegarde.
 */
const executeCancel = () => {
  showCancelModal.value = false;
  router.push({ name: "dashboard" });
};
</script>
