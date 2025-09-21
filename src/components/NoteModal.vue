<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div 
      class="fixed inset-0 bg-gradient-to-br from-blue-400/30 to-purple-300/20 backdrop-blur-md transition-opacity"
      @click="closeModal"
    ></div>

    <div class="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-0">
      <div 
        class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 dark:bg-gray-800"
      >
        <!-- Bouton fermeture -->
        <div class="absolute right-0 top-0 pr-4 pt-4">
          <button
            type="button"
            class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:bg-gray-800 dark:hover:text-gray-300"
            @click="closeModal"
          >
            <span class="sr-only">Fermer</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Contenu modal -->
        <div class="sm:flex sm:items-start">
          <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
            <h3 class="text-xl font-semibold leading-6 text-gray-900 dark:text-white">
              <slot name="header">Nouveau Post-It</slot>
            </h3>

            <!-- Formulaire -->
            <div class="mt-4">
              <form @submit.prevent="handleSubmit">
                <!-- Champ titre -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titre</label>
                  <input
                    type="text"
                    v-model="title"
                    maxlength="50"
                    :class="[
                      'w-full rounded-md border px-3 py-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-900 dark:text-white',
                      errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                    ]"
                    placeholder="Donnez un titre à votre post-it..."
                  />
                  <div class="text-xs text-gray-500 mt-1">{{ title.length }} / 50</div>
                  <p v-if="errors.title" class="text-red-500 text-xs mt-1">{{ errors.title }}</p>
                </div>

                <!-- Champ contenu -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contenu</label>
                  <textarea
                    v-model="content"
                    maxlength="3190"
                    rows="4"
                    :class="[
                      'w-full rounded-md border px-3 py-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-900 dark:text-white',
                      errors.content ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                    ]"
                    placeholder="Écrivez votre note ici..."
                  ></textarea>
                  <div class="text-xs text-gray-500 mt-1">{{ content.length }} / 3190 caractères</div>
                  <p v-if="errors.content" class="text-red-500 text-xs mt-1">{{ errors.content }}</p>
                </div>

                <!-- Boutons -->
                <div class="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-300 dark:bg-gray-700 dark:text-white"
                    @click="closeModal"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    class="inline-flex justify-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500"
                  >
                    + Créer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'NoteModal',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: '',
      content: '',
      errors: {
        title: '',
        content: ''
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    sanitizeInput(str: string): string {
      // Supprime balises HTML/script et caractères dangereux
      return str.replace(/<\/?[^>]+(>|$)/g, "").replace(/[<>]/g, "");
    },
    validateInputs() {
      this.errors = { title: '', content: '' }
      const trimmedTitle = this.sanitizeInput(this.title.trim())
      const trimmedContent = this.sanitizeInput(this.content.trim())

      if (!trimmedTitle) {
        this.errors.title = "Le titre est obligatoire."
      } else if (trimmedTitle.length < 2) {
        this.errors.title = "Le titre doit contenir au moins 3 caractères."
      }

      if (!trimmedContent) {
        this.errors.content = "Le contenu est obligatoire."
      } else if (trimmedContent.length < 5) {
        this.errors.content = "Le contenu doit contenir au moins 10 caractères."
      }

      return !this.errors.title && !this.errors.content
    },
    handleSubmit() {
      if (!this.validateInputs()) return

      const safeTitle = this.sanitizeInput(this.title.trim())
      const safeContent = this.sanitizeInput(this.content.trim())

      this.$emit('create', { title: safeTitle, content: safeContent })
      this.title = ''
      this.content = ''
      this.closeModal()
    }
  }
}
</script>
