<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
    <div
      v-for="(note, index) in store.postits"
      :key="note.id || index"
      :class="`relative rounded-xl shadow-lg p-5 sm:p-6 text-gray-800 font-medium cursor-pointer transition-transform hover:scale-[1.02] ${getColor(index)}`"
      @click="goToNoteDetail(note.id)"
    >
      <button
        class="absolute top-3 right-3 text-gray-700 hover:text-gray-900"
        @click.stop="goToNoteDetail(note.id)"
        aria-label="éditer note"
      >
        ✏️
      </button>

      <h3 class="text-lg sm:text-xl font-bold mb-3 truncate pr-6">
        {{ note.title }}
      </h3>

      <p class="text-sm sm:text-base line-clamp-3 leading-relaxed">
        {{ truncate(note.content, 100) }}
      </p>

      <span class="absolute bottom-3 right-4 text-xs text-gray-600">
        {{ note.content.length }} chars
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { usePostitsStore } from '@/stores/postits'
import { useRouter } from 'vue-router'

const store = usePostitsStore()
const router = useRouter()

const colors: string[] = [
  "bg-red-200","bg-orange-200","bg-amber-200","bg-yellow-200",
  "bg-lime-200","bg-green-200","bg-emerald-200","bg-teal-200",
  "bg-cyan-200","bg-sky-200","bg-blue-200","bg-indigo-200",
  "bg-violet-200","bg-purple-200","bg-fuchsia-200","bg-pink-200",
  "bg-rose-200","bg-neutral-200"
]

function getColor(index: number): string {
  return colors[index % colors.length]
}

function truncate(text = '', maxLength: number): string {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
}

function goToNoteDetail(noteId: string | number) {
  router.push({ name: 'NoteDetail', params: { id: String(noteId) } })
}

let interval: number

onMounted(() => {
  if (typeof store.fetchApiNotes === 'function') {
    store.fetchApiNotes()
  }

  interval = window.setInterval(() => {
    store.fetchApiNotes()
  }, 2000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<style>
@layer utilities {
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
</style>
