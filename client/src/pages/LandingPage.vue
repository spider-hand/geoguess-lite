<template>
  <div class="flex min-h-screen flex-col">
    <header class="flex items-center justify-between border-b px-8 py-4">
      <div class="font-[JetBrains_Mono] text-xl font-semibold">Geoguess Lite</div>
      <nav class="flex gap-4">
        <Button variant="ghost" class="text-muted-foreground cursor-pointer font-[JetBrains_Mono] text-lg">
          [Github]
        </Button>
        <Button v-if="isCurrentUserLoaded && !currentUser"
          class="cursor-pointer rounded-none font-[JetBrains_Mono] text-lg transition-all duration-300 hover:-translate-y-1 hover:opacity-95"
          @click="signUpWithGoogle">
          Sign Up
        </Button>
        <Button v-else variant="ghost" class="text-muted-foreground cursor-pointer font-[JetBrains_Mono] text-lg"
          @click="signOut">
          [Sign Out]
        </Button>
      </nav>
    </header>
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
    <footer class="bg-gray-50 px-8 py-8">
      <div class="mx-auto max-w-7xl">
        <div class="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div class="font-[JetBrains_Mono] text-xl font-semibold">Geoguess Lite</div>
          <nav class="flex gap-4">
            <Button variant="ghost" class="text-muted-foreground cursor-pointer font-[Roboto] text-base">
              Github
            </Button>
            <Button v-if="isCurrentUserLoaded && !currentUser" variant="ghost"
              class="text-muted-foreground cursor-pointer font-[Roboto] text-base" @click="signUpWithGoogle">
              Sign Up
            </Button>
            <Button v-else variant="ghost" class="text-muted-foreground cursor-pointer font-[Roboto] text-base"
              @click="signOut">
              Sign Out
            </Button>
          </nav>
        </div>
      </div>
    </footer>
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
import { useCurrentUser, useFirebaseAuth, useIsCurrentUserLoaded } from 'vuefire'
import { signInWithPopup } from 'firebase/auth'
import type { FirebaseError } from 'firebase/app'
import { googleAuthProvider } from '@/lib/firebase'
import { useRouter } from 'vue-router'

const cardContents = [
  {
    title: 'Zero Subscription',
    description:
      'Play freely — no accounts, no paywalls. GeoGuess Lite is built to be fully open and free to explore.',
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
      'Yes — completely free. GeoGuess Lite doesn’t require any subscription, sign-up, or payment.',
  },
  {
    question: 'Are there any limitations?',
    answer:
      "You can play unlimited rounds at no cost. However, since Street View is powered by Google Maps' free tier, heavy usage might occasionally hit the daily quota — but for most players, it's virtually unlimited.",
  },
  {
    question: 'Can I self-host GeoGuess Lite?',
    answer:
      'GeoGuess Lite is fully open-source and built to be easily self-hosted. You can deploy it on any static hosting service and connect it with your own serverless backend if you prefer full control.',
  },
]

const isCurrentUserLoaded = useIsCurrentUserLoaded()
const currentUser = useCurrentUser()
const auth = useFirebaseAuth()!

const router = useRouter()

const signUpWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleAuthProvider)
  } catch (error) {
    console.error((error as FirebaseError).code, (error as FirebaseError).message)
  }
}

const signOut = async () => {
  try {
    await auth.signOut()
  } catch (error) {
    console.error('signOut error:', error)
  }
}
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
