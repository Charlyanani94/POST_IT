<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePostitsStore } from '@/stores/postits'

const store = usePostitsStore()
const router = useRouter()
const route = useRoute()

const isEditing = ref(false)

const currentNote = reactive<{
  id: string | number
  title: string
  content: string
  updatedAt: Date
}>({
  id: 0,
  title: '',
  content: '',
  updatedAt: new Date(),
})

const errors = reactive({
  title: '',
  content: '',
})

const editedNote = reactive({ ...currentNote })

onMounted(() => {
  const id = route.params.id?.toString()
  const note = store.postits.find((p) => p.id.toString() === id)
  if (note) {
    currentNote.id = note.id
    currentNote.title = note.title
    currentNote.content = note.content
    currentNote.updatedAt = new Date()
    Object.assign(editedNote, currentNote)
  } else {
    router.back()
  }
})

function sanitizeInput(str: string): string {
  return str.replace(/<\/?[^>]+(>|$)/g, '').replace(/[<>]/g, '')
}

function validateInputs(): boolean {
  errors.title = ''
  errors.content = ''
  const trimmedTitle = sanitizeInput(editedNote.title.trim())
  const trimmedContent = sanitizeInput(editedNote.content.trim())

  if (!trimmedTitle) {
    errors.title = 'Le titre est obligatoire.'
  } else if (trimmedTitle.length < 2) {
    errors.title = 'Le titre doit contenir au moins 2 caractères.'
  } else if (trimmedTitle.length > 50) {
    errors.title = 'Le titre ne doit pas dépasser 50 caractères.'
  }

  if (!trimmedContent) {
    errors.content = 'Le contenu est obligatoire.'
  } else if (trimmedContent.length < 5) {
    errors.content = 'Le contenu doit contenir au moins 5 caractères.'
  } else if (trimmedContent.length > 3190) {
    errors.content = 'Le contenu ne doit pas dépasser 3190 caractères.'
  }

  return !errors.title && !errors.content
}

function startEditing() {
  Object.assign(editedNote, currentNote)
  errors.title = ''
  errors.content = ''
  isEditing.value = true
}

function saveChanges() {
  if (validateInputs()) {
    currentNote.title = sanitizeInput(editedNote.title.trim())
    currentNote.content = sanitizeInput(editedNote.content.trim())
    currentNote.updatedAt = new Date()
    store.updatePostit(currentNote.id, currentNote.title, currentNote.content)
    isEditing.value = false
  }
}

function deleteNote() {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
    store.deletePostit(currentNote.id)
    router.push('/')
  }
}

function goBack() {
  router.back()
}

function formatDate(date: Date) {
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="p-6 pt-24 flex justify-center items-start relative">
    <div class="absolute inset-0 bg-white/10 dark:bg-gray-800/20 backdrop-blur-lg z-0"></div>
    <div class="w-full max-w-xl relative z-10">
      <button @click="goBack" class="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-6">
        ← Retour
      </button>

      <div
        class="bg-yellow-200 rounded-2xl p-8 shadow-xl relative transform rotate-1 dark:shadow-black/50 transition-colors duration-300"
      >
        <div class="absolute top-4 right-4 flex gap-2">
          <button
            v-if="!isEditing"
            @click="startEditing"
            class="p-2 rounded-full bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-600 transition"
            aria-label="Modifier"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </button>
          <button
            v-else
            @click="saveChanges"
            class="p-2 rounded-full bg-teal-500 text-white hover:bg-teal-600 transition"
            aria-label="Sauvegarder"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </button>
          <button
            @click="deleteNote"
            class="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
            aria-label="Supprimer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
        </div>

        <!-- Titre -->
        <div v-if="isEditing" class="relative">
          <input
            v-model="editedNote.title"
            maxlength="50"
            class="w-full text-2xl font-bold bg-transparent outline-none text-gray-900 break-words"
            :class="{ 'border-red-500': errors.title }"
            placeholder="Titre"
          />
          <p v-if="errors.title" class="text-red-500 text-xs mt-1">{{ errors.title }}</p>
          <div class="text-xs text-gray-500 mt-1">
            {{ editedNote.title.length }} / 50 caractères
          </div>
        </div>
        <h1 v-else class="text-2xl font-bold text-gray-900 break-words">
          {{ currentNote.title }}
        </h1>

        <p class="text-sm text-gray-700 mt-1">
          Dernière mise à jour : {{ formatDate(currentNote.updatedAt) }}
        </p>

        <!-- Contenu -->
        <div v-if="isEditing" class="relative">
          <textarea
            v-model="editedNote.content"
            rows="10"
            maxlength="3190"
            class="mt-4 w-full bg-transparent outline-none resize-none font-sans text-gray-900 break-words"
            :class="{ 'border-red-500': errors.content }"
            placeholder="Écrivez votre note ici..."
          ></textarea>
          <p v-if="errors.content" class="text-red-500 text-xs mt-1">{{ errors.content }}</p>
          <div class="text-xs text-gray-500 mt-1">
            {{ editedNote.content.length }} / 3190 caractères
          </div>
        </div>

        <p v-else class="mt-4 whitespace-pre-wrap break-words text-gray-900">
          {{ currentNote.content }}
        </p>
      </div>
    </div>
  </div>
</template>
