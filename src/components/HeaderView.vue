<template>
  <div class="font-[Nunito,'Times New Roman',serif]">
    <header class="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-20 items-center justify-between">
          <div class="md:flex md:items-center md:gap-12">
            <a class="block text-teal-600 dark:text-teal-400" href="#">
              <span class="sr-only">Post-it Notes</span>
              <img 
                :src="isDarkMode ? PostitDark : PostitLight" 
                alt="Post-it Logo" 
                class="h-10 w-auto" 
              />
            </a>
          </div>
          <div class="flex items-center gap-4">
            <button
              @click="toggleDarkMode"
              class="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              :title="isDarkMode ? 'Mode clair' : 'Mode sombre'"
            >
              <svg v-if="!isDarkMode" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414m12.728 0l1.414-1.414M6.05 6.05L4.636 7.464M12 8a4 4 0 100 8 4 4 0 000-8z"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
              </svg>
            </button>
            <button 
              type="button" 
              @click="openModal"
              class="flex items-center gap-2 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
              </svg>
              Nouvelle Note
            </button>
            <div class="hidden sm:flex">
              <button 
                type="button" 
                @click="openDeleteModal"
                class="flex items-center gap-2 text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397"/>
                </svg>
                Supprimer Tout
              </button>
            </div>
          </div>
        </div>
  
      </div>
    </header>
    <!-- Modales -->
    <NoteModal :isOpen="showModal" @close="closeModal" @create="createPostit"/>
    <DeleteConfirmModal :isOpen="showDeleteModal" @close="closeDeleteModal" @confirm="deleteAllNotes" />
  </div>
</template>

<script lang="ts">
import NoteModal from './NoteModal.vue'
import DeleteConfirmModal from './DeleteConfirmModal.vue'
import PostitLight from '@/assets/postit.svg'
import PostitDark from '@/assets/postitwhite.svg'
import { usePostitsStore } from '@/stores/postits'

export default {
  components: { NoteModal, DeleteConfirmModal },
  data() {
    return {
      isMobileMenuOpen: false,
      showModal: false,
      showDeleteModal: false,
      isDarkMode: document.documentElement.classList.contains('dark'),
      PostitLight,
      PostitDark,
      store: usePostitsStore()
    }
  },
  methods: {
    // Active/désactive le mode sombre
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode
      if (this.isDarkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    // Création dun post-it depuis la modale
    createPostit(note: { title: string; content: string }) {
      this.store.addPostit(note.title, note.content)
      this.closeModal()
    },
    openModal() { this.showModal = true },
    closeModal() { this.showModal = false },
    openDeleteModal() { this.showDeleteModal = true },
    closeDeleteModal() { this.showDeleteModal = false },
    // Suppression de toutes les notes (local + API)
    async deleteAllNotes() {
      const notes = [...this.store.postits]
      this.store.postits = []
      localStorage.removeItem('postits')
      try {
        await Promise.all(
          notes.map(note =>
            fetch(`https://post-it.epi-bluelock.bj/notes/${note.id}`, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' }
            })
          )
        )
        if (typeof this.store.fetchApiNotes === 'function') {
          await this.store.fetchApiNotes()
        }
      } catch (error) {
        console.error('Erreur suppression API', error)
      }
    }
  }
}
</script>
