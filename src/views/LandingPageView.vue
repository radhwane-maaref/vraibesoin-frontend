<template>
  <!-- Outer wrapper: White on mobile, subtle gray on desktop for contrast -->
  <div class="min-h-[100dvh] w-full bg-white sm:bg-gray-100 flex flex-col justify-center items-center font-sans">
    
    <!-- App Container: Edge-to-edge on mobile, floating iPhone-size on desktop -->
    <div class="w-full h-[100dvh] bg-white flex flex-col relative sm:h-[844px] sm:max-h-[95vh] sm:max-w-[390px] sm:rounded-[40px] sm:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] sm:border border-gray-200/60 overflow-hidden">

      <!-- Header / Top Bar -->
      <div class="px-8 pt-12 pb-4 flex justify-between items-center z-10">
        <span class="text-[20px] font-bold text-gray-900 tracking-tight">Vrai Besoin</span>
        <router-link to="/login" class="text-[#5B8C85] font-semibold text-[17px] active:opacity-60 transition-opacity">
          Passer
        </router-link>
      </div>

      <!-- Main Content / Stepper Area -->
      <div class="flex-1 relative w-full overflow-hidden">
        <Transition name="ios-crossfade">
          
          <!-- Step 1 -->
          <div v-if="currentStep === 1" class="absolute inset-0 flex flex-col justify-center items-center text-center px-8">
            <div class="w-32 h-32 bg-gradient-to-tr from-[#5B8C85]/20 to-[#5B8C85]/5 rounded-[36px] flex items-center justify-center mb-10 shadow-sm border border-white/60">
              <svg class="w-16 h-16 text-[#5B8C85]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <h2 class="text-[32px] font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">Analysez<br>vos envies</h2>
            <p class="text-gray-500 text-[17px] leading-relaxed font-medium">
              Prenez le temps d'identifier s'il s'agit d'un besoin réel ou d'une envie passagère.
            </p>
          </div>

          <!-- Step 2 -->
          <div v-else-if="currentStep === 2" class="absolute inset-0 flex flex-col justify-center items-center text-center px-8">
            <div class="w-32 h-32 bg-gradient-to-tr from-[#5B8C85]/20 to-[#5B8C85]/5 rounded-[36px] flex items-center justify-center mb-10 shadow-sm border border-white/60">
              <svg class="w-16 h-16 text-[#5B8C85]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 class="text-[32px] font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">Prenez<br>le temps</h2>
            <p class="text-gray-500 text-[17px] leading-relaxed font-medium">
              Instaurez un délai de réflexion. La clé pour éviter les achats compulsifs est la patience.
            </p>
          </div>

          <!-- Step 3 -->
          <div v-else-if="currentStep === 3" class="absolute inset-0 flex flex-col justify-center items-center text-center px-8">
            <div class="w-32 h-32 bg-gradient-to-tr from-[#5B8C85]/20 to-[#5B8C85]/5 rounded-[36px] flex items-center justify-center mb-10 shadow-sm border border-white/60">
              <svg class="w-16 h-16 text-[#5B8C85]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
              </svg>
            </div>
            <h2 class="text-[32px] font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">Atteignez<br>vos buts</h2>
            <p class="text-gray-500 text-[17px] leading-relaxed font-medium">
              L'argent économisé financera ce qui compte vraiment pour vous sur le long terme.
            </p>
          </div>

        </Transition>
      </div>

      <!-- Footer Area -->
      <div class="px-8 pb-10 pt-4 bg-white z-10">
        
        <!-- Pagination Dots -->
        <div class="flex justify-center space-x-2.5 mb-10">
          <div v-for="step in 3" :key="step"
               class="h-2 rounded-full transition-all duration-500 ease-out"
               :class="currentStep === step ? 'w-8 bg-[#5B8C85]' : 'w-2 bg-gray-200'">
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col gap-3">
          <button v-if="currentStep < 3" @click="nextStep"
                  class="w-full py-4 bg-[#5B8C85] text-white text-[17px] font-semibold rounded-2xl shadow-[0_8px_24px_rgba(91,140,133,0.35)] hover:bg-[#48736d] hover:scale-[0.98] active:scale-[0.96] transition-all duration-200">
            Continuer
          </button>
          
          <router-link v-else to="/login"
                       class="w-full flex justify-center py-4 bg-[#5B8C85] text-white text-[17px] font-semibold rounded-2xl shadow-[0_8px_24px_rgba(91,140,133,0.35)] hover:bg-[#48736d] hover:scale-[0.98] active:scale-[0.96] transition-all duration-200">
            Commencer
          </router-link>

          <button v-if="currentStep > 1" @click="prevStep"
                  class="w-full py-4 text-gray-400 font-semibold text-[17px] hover:text-gray-600 active:opacity-60 transition-colors">
            Retour
          </button>
          
          <!-- Spacer to prevent jumping when "Retour" button is hidden on Step 1 -->
          <div v-else class="h-[56px]"></div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const currentStep = ref(1);

const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};
</script>

<style scoped>
/* Premium Soft Scale & Fade Crossfade */
.ios-crossfade-enter-active,
.ios-crossfade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease-out;
}

.ios-crossfade-enter-from {
  opacity: 0;
  transform: scale(0.98);
}

.ios-crossfade-leave-to {
  opacity: 0;
  transform: scale(1.02);
}
</style>
