<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import PostitLight from '@/assets/postit.svg'
import PostitDark from '@/assets/postitwhite.svg'

const PostitLogo = ref(PostitLight)

function updateLogo() {
  PostitLogo.value = document.documentElement.classList.contains('dark') 
    ? PostitDark 
    : PostitLight
}

let observer: MutationObserver

onMounted(() => {
  updateLogo()

  observer = new MutationObserver(() => {
    updateLogo()
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})
</script>

<template>
  <footer class="bg-white dark:bg-gray-900">
    <div class="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div class="lg:flex lg:items-start lg:gap-8">
        
        <div class="flex items-center text-teal-600 dark:text-teal-400">
<img 
  :src="PostitLogo" 
  alt="Logo Post-it" 
  class="h-16 sm:h-20 md:h-24 w-auto mx-auto lg:mx-0"
/>
        </div>

        <div class="mt-8 grid grid-cols-2 gap-8 lg:mt-0 lg:grid-cols-5 lg:gap-y-16">
          <div class="col-span-2">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                À propos de Post-It
              </h2>
              <p class="mt-4 text-gray-500 dark:text-gray-400">
                Post-It App vous aide à organiser vos idées, tâches et rappels au quotidien. 
                Créez, modifiez et partagez vos notes facilement pour ne rien oublier d’important.
              </p>
            </div>
          </div>

          <div class="col-span-2 lg:col-span-3 flex items-center justify-center">
            <div class="bg-teal-50 dark:bg-gray-800 rounded-lg p-6 w-full text-center">
              <h3 class="text-lg font-semibold text-teal-700 dark:text-teal-300 mb-2">
                Astuce du jour
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                Notez vos idées dès qu'elles vous viennent : un post-it peut transformer une pensée passagère 
                en action concrète. Ne laissez pas vos bonnes idées s’envoler !
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 border-t border-gray-100 dark:border-gray-700 pt-8">
        <div class="sm:flex sm:justify-between">
          <p class="text-xs text-gray-500 dark:text-gray-400">
            &copy; 2025 Post-It App. Tous droits réservés. Charly ANANI.
          </p>

          <ul class="mt-8 flex flex-wrap justify-start gap-4 text-xs sm:mt-0 lg:justify-end">
            <li><a href="#" class="text-gray-500 dark:text-gray-400 transition hover:opacity-75">Mentions légales</a></li>
            <li><a href="#" class="text-gray-500 dark:text-gray-400 transition hover:opacity-75">Politique de confidentialité</a></li>
            <li><a href="#" class="text-gray-500 dark:text-gray-400 transition hover:opacity-75">Cookies</a></li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>
