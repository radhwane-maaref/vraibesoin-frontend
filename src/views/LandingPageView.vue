<template>
  <!-- Outer wrapper: Subtle animated gradient background -->
  <div class="min-h-[100dvh] w-full bg-gradient-to-br from-[#f0f7f6] via-white to-[#e6f2f0] flex flex-col justify-center items-center font-outfit selection:bg-[#5B8C85] selection:text-white">
    
    <!-- App Container: Glassmorphism effect on desktop -->
    <div class="w-full h-[100dvh] flex flex-col relative sm:h-[844px] sm:max-h-[95vh] sm:max-w-[390px] sm:rounded-[40px] sm:shadow-[0_20px_60px_-15px_rgba(91,140,133,0.15)] sm:border border-white/60 bg-white/80 backdrop-blur-xl overflow-hidden">

      <!-- Header / Top Bar -->
      <div class="px-8 pt-12 pb-4 flex justify-between items-center z-20">
        <span class="text-[20px] font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
          <div class="w-8 h-8 bg-[#EFF3F3] rounded-lg flex items-center justify-center shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.05859 6.04688C-1.01953 10.125 -1.01953 16.7344 3.05859 20.8828C5.23828 15.75 9.17578 11.4609 14.0977 8.92969C9.94922 12.4453 6.99609 17.3672 6.01172 22.9219C9.87891 24.75 14.6602 24.1172 17.8945 20.8828C22.3945 16.3828 23.6602 4.14844 23.9414 0.773438C23.9414 0.351562 23.5898 0 23.168 0C19.793 0.28125 7.55859 1.54688 3.05859 6.04688Z" fill="#5B8C85" />
            </svg>
          </div>
          Vrai Besoin
        </span>
        <router-link to="/login" class="text-[#5B8C85] font-semibold text-[16px] hover:text-[#48736d] active:opacity-60 transition-all duration-300 bg-[#5B8C85]/10 px-4 py-1.5 rounded-full">
          Passer
        </router-link>
      </div>

      <!-- Main Content / Stepper Area -->
      <div class="flex-1 relative w-full overflow-hidden">
        <Transition name="step-fade" mode="out-in">
          
          <!-- Step 1 -->
          <div v-if="currentStep === 1" class="absolute inset-0 flex flex-col justify-center items-center text-center px-8" :key="'step1'">
            <div class="step-icon-container w-32 h-32 rounded-[36px] flex items-center justify-center mb-10 shadow-[0_8px_32px_rgba(91,140,133,0.15)] border border-white bg-gradient-to-tr from-[#5B8C85]/20 to-white backdrop-blur-md relative overflow-hidden group">
              <div class="absolute inset-0 bg-[#5B8C85]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <svg class="w-16 h-16 text-[#5B8C85] relative z-10 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 7v3m0 0v3m0-3h3m-3 0H7"></path>
              </svg>
            </div>
            <h2 class="step-title text-[36px] font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600 mb-4 tracking-tight leading-tight">Analysez<br>vos envies</h2>
            <p class="step-desc text-gray-500 text-[17px] leading-relaxed font-medium max-w-[280px]">
              Prenez le temps d'identifier s'il s'agit d'un besoin réel ou d'une envie passagère.
            </p>
          </div>

          <!-- Step 2 -->
          <div v-else-if="currentStep === 2" class="absolute inset-0 flex flex-col justify-center items-center text-center px-8" :key="'step2'">
            <div class="step-icon-container w-32 h-32 rounded-[36px] flex items-center justify-center mb-10 shadow-[0_8px_32px_rgba(91,140,133,0.15)] border border-white bg-gradient-to-tr from-[#5B8C85]/20 to-white backdrop-blur-md relative overflow-hidden group">
              <div class="absolute inset-0 bg-[#5B8C85]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <svg class="w-16 h-16 text-[#5B8C85] relative z-10 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4" class="animate-spin-slow"></circle>
              </svg>
            </div>
            <h2 class="step-title text-[36px] font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600 mb-4 tracking-tight leading-tight">Prenez<br>le temps</h2>
            <p class="step-desc text-gray-500 text-[17px] leading-relaxed font-medium max-w-[280px]">
              Instaurez un délai de réflexion. La clé pour éviter les achats compulsifs est la patience.
            </p>
          </div>

          <!-- Step 3 -->
          <div v-else-if="currentStep === 3" class="absolute inset-0 flex flex-col justify-center items-center text-center px-8" :key="'step3'">
            <div class="step-icon-container w-32 h-32 rounded-[36px] flex items-center justify-center mb-10 shadow-[0_8px_32px_rgba(91,140,133,0.15)] border border-white bg-gradient-to-tr from-[#5B8C85]/20 to-white backdrop-blur-md relative overflow-hidden group">
              <div class="absolute inset-0 bg-[#5B8C85]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <svg class="w-16 h-16 text-[#5B8C85] relative z-10 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
              </svg>
            </div>
            <h2 class="step-title text-[36px] font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600 mb-4 tracking-tight leading-tight">Atteignez<br>vos buts</h2>
            <p class="step-desc text-gray-500 text-[17px] leading-relaxed font-medium max-w-[280px]">
              L'argent économisé financera ce qui compte vraiment pour vous sur le long terme.
            </p>
          </div>

        </Transition>
      </div>

      <!-- Footer Area -->
      <div class="px-8 pb-10 pt-8 bg-white/60 backdrop-blur-xl border-t border-white/40 z-20">
        
        <!-- Pagination Dots -->
        <div class="flex justify-center space-x-3 mb-10">
          <div v-for="step in 3" :key="step"
               class="h-2.5 rounded-full transition-all duration-500 ease-spring"
               :class="currentStep === step ? 'w-10 bg-[#5B8C85] shadow-[0_0_10px_rgba(91,140,133,0.4)]' : 'w-2.5 bg-gray-200 hover:bg-gray-300 cursor-pointer'"
               @click="currentStep = step">
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col gap-4">
          <button v-if="currentStep < 3" @click="nextStep"
                  class="group relative w-full py-4 bg-gradient-to-r from-[#5B8C85] to-[#4a756f] text-white text-[18px] font-bold rounded-2xl shadow-[0_10px_30px_rgba(91,140,133,0.4)] hover:shadow-[0_15px_35px_rgba(91,140,133,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 overflow-hidden">
            <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            <span class="relative flex items-center justify-center gap-2">
              Continuer
              <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </span>
          </button>
          
          <router-link v-else to="/login"
                       class="group relative w-full flex justify-center py-4 bg-gradient-to-r from-[#5B8C85] to-[#4a756f] text-white text-[18px] font-bold rounded-2xl shadow-[0_10px_30px_rgba(91,140,133,0.4)] hover:shadow-[0_15px_35px_rgba(91,140,133,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 overflow-hidden">
            <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            <span class="relative flex items-center justify-center gap-2">
              Commencer
              <svg class="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
            </span>
          </router-link>

          <button @click="prevStep"
                  :disabled="currentStep === 1"
                  class="w-full py-3 font-semibold text-[16px] transition-all duration-300"
                  :class="currentStep === 1 ? 'text-gray-300 opacity-50 cursor-not-allowed' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 rounded-xl'">
            Retour
          </button>
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
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

.font-outfit {
  font-family: 'Outfit', sans-serif;
}

/* Custom Spring Easing */
.ease-spring {
  transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.animate-spin-slow {
  animation: spin 8s linear infinite;
}

/* Staggered Step Animations */
.step-fade-enter-active,
.step-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.step-fade-enter-from {
  opacity: 0;
  transform: translateY(15px) scale(0.98);
}

.step-fade-leave-to {
  opacity: 0;
  transform: translateY(-15px) scale(0.98);
}

/* Staggering inner elements */
.step-fade-enter-active .step-icon-container {
  animation: slideUpFade 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.1s both;
}

.step-fade-enter-active .step-title {
  animation: slideUpFade 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.2s both;
}

.step-fade-enter-active .step-desc {
  animation: slideUpFade 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.3s both;
}

@keyframes slideUpFade {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
