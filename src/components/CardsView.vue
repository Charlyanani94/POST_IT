<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
    <div
      v-for="(note, index) in store.postits"
      :key="note.id || index"
      :class="`relative rounded-xl shadow-lg p-5 sm:p-6 text-gray-800 font-medium cursor-pointer transition-transform hover:scale-[1.02] ${getColor(index)}`"
      @click="goToNoteDetail(note.id)"
    >
      <button
        class="absolute top-3 right-3 text-gray-700 hover:text-gray-900 p-1.5 rounded-full hover:bg-white/50 transition-colors"
        @click.stop="goToNoteDetail(note.id)"
        aria-label="éditer note"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
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
