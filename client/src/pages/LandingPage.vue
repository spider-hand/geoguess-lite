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
              <Button size="lg"
                class="cursor-pointer rounded-none px-6 py-3 font-[JetBrains_Mono] text-lg transition-all duration-300 hover:-translate-y-1 hover:opacity-95"
                @click="currentUser ? router.push({
                  name: 'game'
                }) : signUpWithGoogle()" :disabled="!isCurrentUserLoaded">
                Get Started
              </Button>
            </div>
            <div class="flex justify-center">
              <img src="/images/hero.png" alt="Hero Image" class="floating-animation h-auto max-w-full rounded-full"
                style="box-shadow: rgb(0 0 0 / 56%) 0 22px 70px 4px" />
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
            <CustomCardComponent v-for="(content, index) in cardContents" :key="index" :title="content.title"
              :description="content.description" :emoji="content.emoji" :bg-class="content.class"
              :emoji-class="content.emojiClass" content-align="text-left" icon-align="justify-start" />
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
            <AccordionItem v-for="(content, index) in faqContents" :key="index" :value="`item-${index}`">
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
import useAuth from '@/composables/useAuth';

const cardContents = [
  {
    title: 'Zero Subscription',
    description:
      'Play freely — no paywalls. GeoGuess Lite is built to be fully open and free to explore.',
    emoji: '🪶',
    class: 'bg-blue-50 border-blue-100',
    emojiClass: 'bg-blue-100 border-blue-200',
  },
  {
    title: 'Lightweight and Fast',
    description:
      'Optimized for speed and simplicity, GeoGuess Lite loads quickly so you can start exploring without delay.',
    emoji: '⚡',
    class: 'bg-green-50 border-green-100',
    emojiClass: 'bg-green-100 border-green-200',
  },
  {
    title: 'Community Driven',
    description:
      "We're constantly improving GeoGuess Lite with new features and locations based on community feedback.",
    emoji: '🔄',
    class: 'bg-purple-50 border-purple-100',
    emojiClass: 'bg-purple-100 border-purple-200',
  },
  {
    title: 'Open and Extendable',
    description:
      'Fully open-source under a permissive license. Fork it, modify it, and build your own twist on the experience.',
    emoji: '🧩',
    class: 'bg-lime-50 border-lime-100',
    emojiClass: 'bg-lime-100 border-lime-200',
  },
  {
    title: 'Multiplayer Mode',
    description:
      'Challenge friends in real-time. Compete for the closest guess and claim your spot at the top.',
    emoji: '🤝',
    class: 'bg-red-50 border-red-100',
    emojiClass: 'bg-red-100 border-red-200',
  },
  {
    title: 'Daily Challenge',
    description:
      'Take on a new location every day and compare your score with players around the world.',
    emoji: '🗓️',
    class: 'bg-amber-50 border-amber-100',
    emojiClass: 'bg-amber-100 border-amber-200',
  },
]

const faqContents = [
  {
    question: 'Is GeoGuess Lite really free?',
    answer:
      'Yes — completely free. GeoGuess Lite doesn’t require any subscription or payment.',
  },
  {
    question: 'Are there any limitations?',
    answer:
      "You can play as much as you want. Both the map and imagery are powered by open data and open-source technology, so there are no quotas, usage limits, or fees.",
  },
  {
    question: 'Can I self-host GeoGuess Lite?',
    answer:
      'GeoGuess Lite is fully open-source and built to be easily self-hosted. You can deploy it on any static hosting service and connect it with your own serverless backend if you prefer full control.',
  },
]

const router = useRouter()

const { currentUser, isCurrentUserLoaded, signUpWithGoogle } = useAuth();
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
