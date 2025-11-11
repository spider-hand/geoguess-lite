<template>
  <div class="min-h-screen flex flex-col">
    <header class="flex justify-between items-center px-8 py-4 border-b">
      <div class="text-xl font-semibold font-[JetBrains_Mono]">
        Geoguess Lite
      </div>
      <nav class="flex gap-4">
        <Button variant="ghost" class="text-lg text-muted-foreground font-[JetBrains_Mono] cursor-pointer">
          [Github]
        </Button>
        <Button
          class="rounded-none text-lg font-[JetBrains_Mono] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:opacity-95">
          Sign Up
        </Button>
      </nav>
    </header>
    <main class="flex-1">
      <section class="px-8 py-16">
        <div class="max-w-7xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 class="text-4xl lg:text-6xl font-bold mb-6 font-[JetBrains_Mono]">
                Lightweight, subscription-free Geoguess experience
              </h1>
              <p class="text-2xl text-muted-foreground mb-8 font-[JetBrains_Mono]">
                Explore the world, no paywalls, no limits.
              </p>
              <Button size="lg"
                class="rounded-none text-lg px-6 py-3 font-[JetBrains_Mono] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:opacity-95">
                Get Started
              </Button>
            </div>
            <div class="flex justify-center">
              <img src="/images/hero.png" alt="Hero Image" class="max-w-full h-auto rounded-full floating-animation"
                style="box-shadow: rgba(0, 0, 0, 0.56) 0px 22px 70px 4px;" />
            </div>
          </div>
        </div>
      </section>
      <section class="px-8 py-16 bg-gray-50">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl lg:text-4xl mb-4 font-[JetBrains_Mono]">
              Why Geoguess Lite
            </h2>
            <p class="text-xl text-muted-foreground font-[JetBrains_Mono]">
              A lightweight, open-source take on the GeoGuessr experience — built for anyone who wants to explore the
              world without limits or subscriptions.
            </p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card v-for="(content, index) in cardContents" :key="index"
              :class="`${content.class} border transition-all duration-300 hover:shadow-lg hover:-translate-y-1`">
              <CardContent class="text-left">
                <div class="text-3xl mb-4 p-2 rounded-xl w-12 h-12 flex items-center justify-center border"
                  :class="content.emojiClass">
                  {{ content.emoji }}
                </div>
                <CardTitle class="text-xl mb-2 font-[Roboto]">
                  {{ content.title }}
                </CardTitle>
                <CardDescription class="text-lg text-muted-foreground font-[JetBrains_Mono]">
                  {{ content.description }}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section class="px-8 py-16">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl lg:text-4xl mb-4 font-[JetBrains_Mono]">
              Frequently Asked Questions
            </h2>
            <p class="text-xl text-muted-foreground font-[JetBrains_Mono]">
              Everything you need to know about Geoguess Lite
            </p>
          </div>
          <Accordion type="single" collapsible class="w-full">
            <AccordionItem v-for="(content, index) in faqContents" :key="index" :value="`item-${index}`">
              <AccordionTrigger class="text-xl text-left font-[Roboto]">
                {{ content.question }}
              </AccordionTrigger>
              <AccordionContent class="text-lg text-muted-foreground font-[JetBrains_Mono]">
                {{ content.answer }}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </main>
    <footer class="bg-gray-50 px-8 py-8">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="text-xl font-semibold font-[JetBrains_Mono]">
            Geoguess Lite
          </div>
          <nav class="flex gap-4">
            <Button variant="ghost" class="text-base text-muted-foreground font-[Roboto] cursor-pointer">
              Github
            </Button>
            <Button variant="ghost" class="text-base text-muted-foreground font-[Roboto] cursor-pointer">
              Sign Up
            </Button>
          </nav>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'


const cardContents = [
  {
    title: 'Zero Subscription',
    description: 'Play freely — no accounts, no paywalls. GeoGuess Lite is built to be fully open and free to explore.',
    emoji: '🪶',
    class: 'bg-blue-50 border-blue-100',
    emojiClass: 'bg-blue-100 border-blue-200',
  },
  {
    title: 'Lightweight and Fast',
    description: 'Optimized for speed and simplicity, GeoGuess Lite loads quickly so you can start exploring without delay.',
    emoji: '⚡',
    class: 'bg-green-50 border-green-100',
    emojiClass: 'bg-green-100 border-green-200',
  },
  {
    title: 'Community Driven',
    description: 'We\'re constantly improving GeoGuess Lite with new features and locations based on community feedback.',
    emoji: '🔄',
    class: 'bg-purple-50 border-purple-100',
    emojiClass: 'bg-purple-100 border-purple-200',
  },
  {
    title: 'Open and Extendable',
    description: 'Fully open-source under a permissive license. Fork it, modify it, and build your own twist on the experience.',
    emoji: '🧩',
    class: 'bg-lime-50 border-lime-100',
    emojiClass: 'bg-lime-100 border-lime-200',
  },
  {
    title: 'Multiplayer Mode',
    description: 'Challenge friends in real-time. Compete for the closest guess and claim your spot at the top.',
    emoji: '🤝',
    class: 'bg-red-50 border-red-100',
    emojiClass: 'bg-red-100 border-red-200',
  },
  {
    title: 'Daily Challenge',
    description: 'Take on a new location every day and compare your score with players around the world.',
    emoji: '🗓️',
    class: 'bg-amber-50 border-amber-100',
    emojiClass: 'bg-amber-100 border-amber-200',
  },
]

const faqContents = [
  {
    question: 'Is GeoGuess Lite really free?',
    answer: 'Yes — completely free. GeoGuess Lite doesn’t require any subscription, sign-up, or payment.'
  },
  {
    question: 'Are there any limitations?',
    answer: 'You can play unlimited rounds at no cost. However, since Street View is powered by Google Maps\' free tier, heavy usage might occasionally hit the daily quota — but for most players, it\'s virtually unlimited.'
  },
  {
    question: 'Can I self-host GeoGuess Lite?',
    answer: 'GeoGuess Lite is fully open-source and built to be easily self-hosted. You can deploy it on any static hosting service and connect it with your own serverless backend if you prefer full control.'
  }
]
</script>

<style scoped>
@keyframes floating {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
  100% {
    transform: translateY(0px);
  }
}

.floating-animation {
  animation: floating 5s ease-in-out infinite;
}
</style>
