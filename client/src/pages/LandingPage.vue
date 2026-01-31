<template>
  <div class="flex min-h-screen flex-col">
    <HeaderComponent />
    <main class="flex-1">
      <section class="px-8 py-16">
        <div class="mx-auto max-w-7xl">
          <div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h1 class="mb-6 font-[JetBrains_Mono] text-4xl font-bold lg:text-6xl">
                Lightweight, subscription-free Geoguess experience
              </h1>
              <p class="text-muted-foreground mb-8 font-[JetBrains_Mono] text-2xl">
                Explore the world, no paywalls, no limits.
              </p>
              <div class="flex flex-col gap-4 sm:flex-row">
                <Button
                  size="lg"
                  class="cursor-pointer rounded-none px-6 py-3 font-[JetBrains_Mono] text-lg transition-all duration-300 hover:-translate-y-1 hover:opacity-95"
                  @click="
                    currentUser
                      ? router.push({
                          name: 'game',
                        })
                      : signUpWithGoogle()
                  "
                  :disabled="!isCurrentUserLoaded"
                >
                  Get Started
                </Button>
                <Button
                  v-if="!currentUser"
                  variant="ghost"
                  size="lg"
                  class="text-muted-foreground cursor-pointer rounded-none px-6 py-3 font-[JetBrains_Mono] text-lg transition-all duration-300 hover:-translate-y-1 hover:opacity-95"
                  @click="router.push({ name: 'game' })"
                  :disabled="!isCurrentUserLoaded"
                >
                  [Continue as Guest]
                </Button>
              </div>
            </div>
            <div class="flex justify-center">
              <img
                src="/images/hero.png"
                alt="Hero Image"
                class="floating-animation h-auto max-w-full rounded-full"
                style="box-shadow: rgb(0 0 0 / 56%) 0 22px 70px 4px"
              />
            </div>
          </div>
        </div>
      </section>
      <section class="bg-gray-50 px-8 py-16">
        <div class="mx-auto max-w-7xl">
          <div class="mb-16 text-center">
            <h2 class="mb-4 font-[JetBrains_Mono] text-3xl lg:text-4xl">Why Geoguess Lite</h2>
            <p class="text-muted-foreground font-[JetBrains_Mono] text-xl">
              A lightweight, open-source take on the GeoGuessr experience — built for anyone who
              wants to explore the world without limits or subscriptions.
            </p>
          </div>
          <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <CustomCardComponent
              v-for="(content, index) in cardContents"
              :key="index"
              :title="content.title"
              :description="content.description"
              :icon="content.icon"
              :bg-class="content.class"
              :icon-class="content.iconClass"
              content-align="text-left"
              icon-align="justify-start"
            />
          </div>
        </div>
      </section>
      <section class="px-8 py-16">
        <div class="mx-auto max-w-4xl">
          <div class="mb-16 text-center">
            <h2 class="mb-4 font-[JetBrains_Mono] text-3xl lg:text-4xl">
              Frequently Asked Questions
            </h2>
            <p class="text-muted-foreground font-[JetBrains_Mono] text-xl">
              Everything you need to know about Geoguess Lite
            </p>
          </div>
          <Accordion type="single" collapsible class="w-full">
            <AccordionItem
              v-for="(content, index) in faqContents"
              :key="index"
              :value="`item-${index}`"
            >
              <AccordionTrigger class="text-left font-[Roboto] text-xl">
                {{ content.question }}
              </AccordionTrigger>
              <AccordionContent class="text-muted-foreground font-[JetBrains_Mono] text-lg">
                {{ content.answer }}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </main>
    <FooterComponent />
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import CustomCardComponent from '@/components/CustomCardComponent.vue'
import { useRouter } from 'vue-router'
import HeaderComponent from '@/components/HeaderComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import useAuth from '@/composables/useAuth'
import { Feather, Zap, RefreshCcw, Handshake, Calendar, Puzzle } from 'lucide-vue-next'

const cardContents = [
  {
    title: 'Zero Subscription',
    description:
      'Play freely — no paywalls. GeoGuess Lite is built to be fully open and free to explore.',
    icon: Feather,
    class: 'bg-blue-50 border-blue-100',
    iconClass: 'bg-blue-100 border-blue-200 text-blue-900',
  },
  {
    title: 'Lightweight and Fast',
    description:
      'Optimized for speed and simplicity, GeoGuess Lite loads quickly so you can start exploring without delay.',
    icon: Zap,
    class: 'bg-green-50 border-green-100',
    iconClass: 'bg-green-100 border-green-200 text-green-900',
  },
  {
    title: 'Community Driven',
    description:
      "We're constantly improving GeoGuess Lite with new features and locations based on community feedback.",
    icon: RefreshCcw,
    class: 'bg-purple-50 border-purple-100',
    iconClass: 'bg-purple-100 border-purple-200 text-purple-900',
  },
  {
    title: 'Open and Extendable',
    description:
      'Fully open-source under a permissive license. Fork it, modify it, and build your own twist on the experience.',
    icon: Puzzle,
    class: 'bg-lime-50 border-lime-100',
    iconClass: 'bg-lime-100 border-lime-200 text-lime-900',
  },
  {
    title: 'Multiplayer Mode',
    description:
      'Challenge friends in real-time. Compete for the closest guess and claim your spot at the top.',
    icon: Handshake,
    class: 'bg-red-50 border-red-100',
    iconClass: 'bg-red-100 border-red-200 text-red-900',
  },
  {
    title: 'Daily Challenge',
    description:
      'Take on a new location every day and compare your score with players around the world.',
    icon: Calendar,
    class: 'bg-amber-50 border-amber-100',
    iconClass: 'bg-amber-100 border-amber-200 text-amber-900',
  },
]

const faqContents = [
  {
    question: 'Is GeoGuess Lite really free?',
    answer: "Yes - completely free. GeoGuess Lite doesn't require any subscription or payment.",
  },
  {
    question: 'Are there any limitations?',
    answer:
      'You can play as much as you want. Both the map and imagery are powered by open data and open-source technology, so there are no quotas, usage limits, or fees.',
  },
  {
    question: 'Can I self-host GeoGuess Lite?',
    answer:
      'GeoGuess Lite is fully open-source and built to be easily self-hosted. You can deploy it on any static hosting service and connect it with your own serverless backend if you prefer full control.',
  },
  {
    question: 'Any other questions?',
    answer:
      'Feel free to reach out at creative.spider.hand@gmail.com or check out the GitHub repository for more information and contributions.',
  },
]

const router = useRouter()

const { currentUser, isCurrentUserLoaded, signUpWithGoogle } = useAuth()
</script>

<style scoped>
@keyframes floating {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-15px);
  }

  100% {
    transform: translateY(0);
  }
}

.floating-animation {
  animation: floating 5s ease-in-out infinite;
}
</style>
