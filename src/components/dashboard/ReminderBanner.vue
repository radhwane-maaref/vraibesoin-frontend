<template>
  <div
    v-if="visibleIntentions.length > 0"
    class="bg-white border border-slate-200/80 rounded-3xl p-6 mb-8 custom-font-dm"
  >
    <div class="flex items-center gap-4 mb-3">
      <div>
        <h2 class="text-lg sm:text-xl font-semibold text-slate-900">
          Analyses à finaliser
        </h2>
      </div>
    </div>

    <!-- Carousel Container -->
    <div
      ref="carouselRef"
      @scroll="onScroll"
      class="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-2 px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      <div
        v-for="item in visibleIntentions"
        :key="item.id"
        class="flex-none w-[85%] min-w-[260px] sm:w-[320px] snap-center bg-[#F8F6F2] rounded-2xl p-5 shadow-sm flex flex-col border border-slate-100"
      >
        <!-- Title and Price Row -->
        <div class="flex justify-between items-start mb-5 gap-3">
          <!-- line-clamp-2 allows up to 2 lines of text before truncating -->
          <span
            class="font-semibold text-slate-800 text-base leading-snug line-clamp-2"
            :title="item.product_name"
          >
            {{ item.product_name }}
          </span>
          <span
            class="font-bold text-slate-900 text-base whitespace-nowrap pt-0.5"
          >
            {{ item.product_price }} {{ currencyStore.currentCurrency.code }}
          </span>
        </div>

        <!-- Action Buttons (Vertically Stacked for Mobile) -->
        <div class="flex flex-col gap-2.5 w-full mt-auto">
          <button
            @click="confirmItem(item.id)"
            class="w-full px-4 py-2.5 bg-[#5B8C85] hover:bg-[#4d7872] text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
          >
            Continuer l'analyse
          </button>
          <button
            @click="ignoreItem(item.id)"
            class="w-full px-4 py-2.5 bg-transparent border border-[#5B8C85]/30 text-[#5B8C85] text-sm font-medium rounded-xl hover:bg-[#5B8C85]/5 transition-colors"
          >
            Ignorer pour 24h
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination Badge -->
    <div
      v-if="visibleIntentions.length > 1"
      class="flex flex-col items-center gap-3 mt-1"
    >
      <!-- Dots -->
      <div class="flex items-center gap-1.5">
        <div
          v-for="(_, index) in visibleIntentions"
          :key="'dot-' + index"
          :class="[
            'rounded-full transition-all duration-300',
            currentIndex === index
              ? 'bg-[#5B8C85] w-8 h-2'
              : 'bg-[#5B8C85]/20 w-2 h-2',
          ]"
        ></div>
      </div>
      <!-- Counter Text -->
      <span class="text-sm font-medium text-slate-500">
        {{ currentIndex + 1 }} sur {{ visibleIntentions.length }} à finaliser
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCurrencyStore } from "@/stores/currency";

const props = defineProps({
  intentions: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const router = useRouter();
const currencyStore = useCurrencyStore();

const hiddenItems = ref({});
const carouselRef = ref(null);
const currentIndex = ref(0);

onMounted(() => {
  // Récupérer l'état de l'ignorance depuis le localStorage
  const stored = localStorage.getItem("vrai_besoin_hidden_reminders");
  if (stored) {
    hiddenItems.value = JSON.parse(stored);
  }
});

const visibleIntentions = computed(() => {
  const now = Date.now();
  const ONE_DAY = 24 * 60 * 60 * 1000;

  return props.intentions.filter((item) => {
    const hiddenAt = hiddenItems.value[item.id];
    // Si l'objet a été masqué il y a moins de 24h, on l'exclut
    if (hiddenAt && now - hiddenAt < ONE_DAY) {
      return false;
    }
    return true;
  });
});

const onScroll = () => {
  if (!carouselRef.value) return;
  const container = carouselRef.value;
  const scrollLeft = container.scrollLeft;

  if (container.children.length > 0) {
    const childWidth = container.children[0].offsetWidth;
    const gap = 12; // gap-3 corresponds to 12px
    const itemTotalWidth = childWidth + gap;
    currentIndex.value = Math.round(scrollLeft / itemTotalWidth);
  }
};

const ignoreItem = (id) => {
  hiddenItems.value[id] = Date.now();
  localStorage.setItem(
    "vrai_besoin_hidden_reminders",
    JSON.stringify(hiddenItems.value),
  );

  // Ajuster currentIndex si on ignore l'élément courant et qu'on est à la fin
  setTimeout(() => {
    if (currentIndex.value >= visibleIntentions.value.length) {
      currentIndex.value = Math.max(0, visibleIntentions.value.length - 1);
    }
  }, 0);
};

const confirmItem = (id) => {
  // Redirige vers la vue d'évaluation pour finaliser la décision
  router.push({ name: "reflection", params: { id } });
};
</script>
<style scoped>
.custom-font-dm {
  font-family: "DM Sans", sans-serif;
}
</style>
