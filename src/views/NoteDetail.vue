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
  updatedAt: new Date()
})

const editedNote = reactive({ ...currentNote })

onMounted(() => {
  const id = route.params.id?.toString()
  const note = store.postits.find(p => p.id.toString() === id)
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

function toggleEdit() {
  if (isEditing.value) {
    currentNote.title = editedNote.title
    currentNote.content = editedNote.content
    currentNote.updatedAt = new Date()
    store.updatePostit(currentNote.id, currentNote.title, currentNote.content)
  } else {
    Object.assign(editedNote, currentNote)
  }
  isEditing.value = !isEditing.value
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
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
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

      <div class="bg-yellow-200 rounded-2xl p-8 shadow-xl relative transform rotate-1 dark:shadow-black/50 transition-colors duration-300">
        <div class="absolute top-4 right-4 flex gap-2">
          <button
            @click="toggleEdit"
            class="p-2 rounded-full bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-600 transition"
          >
            <span v-if="!isEditing">✏️</span>
            <span v-else>✅</span>
          </button>
          <button
            @click="deleteNote"
            class="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
          >
            🗑️
          </button>
        </div>

        <!-- Titre -->
        <input
          v-if="isEditing"
          v-model="editedNote.title"
          class="w-full text-2xl font-bold bg-transparent outline-none text-gray-900 break-words"
          placeholder="Titre"
        />
        <h1
          v-else
          class="text-2xl font-bold text-gray-900 break-words"
        >
          {{ currentNote.title }}
        </h1>

        <p class="text-sm text-gray-700 mt-1">
          Dernière mise à jour : {{ formatDate(currentNote.updatedAt) }}
        </p>

        <!-- Contenu -->
        <textarea
          v-if="isEditing"
          v-model="editedNote.content"
          rows="10"
          class="mt-4 w-full bg-transparent outline-none resize-none font-sans text-gray-900 break-words"
          placeholder="Écrivez votre note ici..."
        ></textarea>

        <p
          v-else
          class="mt-4 whitespace-pre-wrap break-words text-gray-900"
        >
          {{ currentNote.content }}
        </p>
      </div>
    </div>
  </div>
</template>
