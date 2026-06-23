<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface Story {
  id: number
  quote: string
  name: string
  role: string
  initials: string
  highlight: string
  highlightLabel: string
  avatarBg: string
  avatarContent: string
  achievementBg: string
  achievementText: string
  progressColor: string
}

const stories: Story[] = [
  {
    id: 1,
    quote: "I never realized how much I was spending on forgotten subscriptions until FinanceLab showed me the full picture. Cutting six of them freed up $240 every month — money I now put into savings.",
    name: "Sarah M.",
    role: "Freelance Designer · New York",
    initials: "SM",
    highlight: "$240",
    highlightLabel: "saved per month",
    avatarBg: "bg-success",
    avatarContent: "text-success-content",
    achievementBg: "bg-success/10",
    achievementText: "text-success",
    progressColor: "bg-success",
  },
  {
    id: 2,
    quote: "Fourteen months of logging every income and expense. That's all it took to clear $18,000 in credit card debt. Seeing the real numbers daily made me accountable in a way nothing else had.",
    name: "James R.",
    role: "Marketing Manager · Austin",
    initials: "JR",
    highlight: "$18K",
    highlightLabel: "debt eliminated",
    avatarBg: "bg-primary",
    avatarContent: "text-primary-content",
    achievementBg: "bg-primary/10",
    achievementText: "text-primary",
    progressColor: "bg-primary",
  },
  {
    id: 3,
    quote: "Tracking every income stream separately revealed my freelance projects were outearning my 9-to-5. I made the leap six months ago. My income has doubled and I've never felt more in control.",
    name: "Priya K.",
    role: "Full-stack Developer · Remote",
    initials: "PK",
    highlight: "2×",
    highlightLabel: "income growth",
    avatarBg: "bg-secondary",
    avatarContent: "text-secondary-content",
    achievementBg: "bg-secondary/10",
    achievementText: "text-secondary",
    progressColor: "bg-secondary",
  },
  {
    id: 4,
    quote: "A 6-month emergency fund — something I'd been trying to build for a decade. Once I could see exactly where every dollar went, the path became obvious. I got there in 11 months.",
    name: "Carlos T.",
    role: "High School Teacher · Miami",
    initials: "CT",
    highlight: "6 mo",
    highlightLabel: "emergency fund built",
    avatarBg: "bg-accent",
    avatarContent: "text-accent-content",
    achievementBg: "bg-accent/10",
    achievementText: "text-accent",
    progressColor: "bg-accent",
  },
]

const currentIndex = ref(0)
const currentStory = computed<Story>(() => stories[currentIndex.value]!)

const isPaused = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

function startTimer() {
  timer = setInterval(() => goTo(currentIndex.value + 1), 8000)
}

function goTo(index: number) {
  const next = ((index % stories.length) + stories.length) % stories.length
  if (next === currentIndex.value) return
  if (timer) { clearInterval(timer); timer = null }
  currentIndex.value = next
  if (!isPaused.value) startTimer()
}

function handleNext() { goTo(currentIndex.value + 1) }
function handlePrev() { goTo(currentIndex.value - 1) }

function pauseTimer() {
  isPaused.value = true
  if (timer) { clearInterval(timer); timer = null }
}

function resumeTimer() {
  isPaused.value = false
  startTimer()
}

onMounted(startTimer)
onUnmounted(pauseTimer)
</script>

<template>
  <div
    class="card bg-base-100 shadow-sm overflow-hidden"
    @mouseenter="pauseTimer"
    @mouseleave="resumeTimer"
  >
    <div class="flex items-center justify-between px-6 pt-5 pb-4">
      <div class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-warning" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span class="text-xs font-semibold text-base-content/40 uppercase tracking-widest">
          Success Stories
        </span>
      </div>

      <div class="flex items-center gap-1.5">
        <button
          v-for="(_, i) in stories"
          :key="i"
          class="p-0.5 rounded-full focus:outline-none"
          :aria-label="`Go to story ${i + 1}`"
          @click="goTo(i)"
        >
          <span
            class="block rounded-full transition-all duration-300 overflow-hidden"
            :class="i === currentIndex ? 'w-6 h-2 bg-base-200' : 'w-2 h-2 bg-base-300 hover:bg-base-content/20'"
          >
            <span
              v-if="i === currentIndex"
              :key="`fill-${currentIndex}`"
              class="block h-full rounded-full progress-fill"
              :class="currentStory.progressColor"
            ></span>
          </span>
        </button>
      </div>
    </div>

    <Transition name="story" mode="out-in">
      <div :key="currentStory.id" class="px-6 pb-5 min-h-40">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div class="md:col-span-2 flex flex-col gap-5">
            <div class="relative pl-6">
              <svg
                class="absolute top-0 left-0 h-5 w-5 opacity-15"
                :class="currentStory.achievementText"
                fill="currentColor"
                viewBox="0 0 32 32"
              >
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              <p class="text-base-content/75 text-base leading-relaxed">
                {{ currentStory.quote }}
              </p>
            </div>

            <div class="flex items-center gap-3">
              <div class="avatar avatar-placeholder shrink-0">
                <div class="w-10 rounded-full" :class="[currentStory.avatarBg, currentStory.avatarContent]">
                  <span class="text-sm font-bold">{{ currentStory.initials }}</span>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-sm leading-tight">{{ currentStory.name }}</p>
                <p class="text-xs text-base-content/45 leading-tight mt-0.5">{{ currentStory.role }}</p>
              </div>
              <span class="badge badge-success badge-sm gap-1 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
                Verified
              </span>
            </div>
          </div>

          <div class="flex items-stretch">
            <div
              class="w-full rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-1"
              :class="currentStory.achievementBg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mb-1"
                :class="currentStory.achievementText"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <p class="text-4xl font-bold leading-none tabular-nums" :class="currentStory.achievementText">
                {{ currentStory.highlight }}
              </p>
              <p class="text-xs font-semibold uppercase tracking-wider mt-1" :class="currentStory.achievementText">
                {{ currentStory.highlightLabel }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <div class="flex items-center justify-between px-6 py-3 border-t border-base-200">
      <button
        class="btn btn-ghost btn-xs gap-1 text-base-content/40 hover:text-base-content"
        @click="handlePrev"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Prev
      </button>
      <span class="text-xs text-base-content/30 tabular-nums">
        {{ currentIndex + 1 }} / {{ stories.length }}
      </span>
      <button
        class="btn btn-ghost btn-xs gap-1 text-base-content/40 hover:text-base-content"
        @click="handleNext"
      >
        Next
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.story-enter-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.story-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.story-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.story-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
.progress-fill {
  animation: fillProgress 8s linear forwards;
  width: 0%;
}
@keyframes fillProgress {
  from { width: 0%; }
  to { width: 100%; }
}
</style>
