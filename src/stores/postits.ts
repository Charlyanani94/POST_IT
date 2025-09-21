import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

// Type interne : post-it côté client
type Postit = {
  id: string | number
  title: string
  content: string
}

// Type des notes venant de l’API
type ApiNote = {
  _id: string
  title: string
  content: string[] | string | null
}

export const usePostitsStore = defineStore('postits', () => {
  // Liste des post-its
  const postits = ref<Postit[]>([])

  // Chargement initial depuis localStorage
  const saved = localStorage.getItem('postits')
  if (saved) {
    try {
      postits.value = JSON.parse(saved)
    } catch {
      postits.value = []
    }
  }

  // Sauvegarde auto dans localStorage
  watch(
    postits,
    (newPostits) => {
      localStorage.setItem('postits', JSON.stringify(newPostits))
    },
    { deep: true }
  )

  // --- API : synchronisation avec le backend ---

  // Charger les notes depuis l’API
  async function fetchApiNotes() {
    try {
      const res = await fetch('https://post-it.epi-bluelock.bj/notes', {
        headers: { 'Content-Type': 'application/json' }
      })
      if (!res.ok) return
      const data = await res.json()

      const apiNotes: Postit[] = (data.notes as ApiNote[] || []).map(n => ({
        id: n._id,
        title: n.title,
        content: Array.isArray(n.content) ? n.content.join('\n') : String(n.content ?? '')
      }))

      postits.value = apiNotes
    } catch (error) {
      console.error('❌ Erreur fetch API', error)
    }
  }

  // Ajouter un post-it
  async function addPostit(title: string, content: string) {
    try {
      const response = await fetch('https://post-it.epi-bluelock.bj/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content: [content] })
      })
      const data = await response.json()

      postits.value.push({
        id: data.note_id ?? `local-${Date.now()}`,
        title,
        content,
      })

      console.log('✅ Créé via API:', response.status, data)
    } catch (error) {
      console.error('❌ Erreur création API', error)
      postits.value.push({ id: `local-${Date.now()}`, title, content })
    }
  }

  // Supprimer un post-it
  async function deletePostit(id: string | number) {
    postits.value = postits.value.filter(p => p.id.toString() !== id.toString())
    try {
      await fetch(`https://post-it.epi-bluelock.bj/notes/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      console.error('❌ Erreur suppression API', error)
    }
  }

  // Modifier un post-it
  async function updatePostit(id: string | number, title: string, content: string) {
    const postit = postits.value.find(p => p.id.toString() === id.toString())
    if (postit) {
      postit.title = title
      postit.content = content
    }
    try {
      await fetch(`https://post-it.epi-bluelock.bj/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content: [content] })
      })
    } catch (error) {
      console.error('❌ Erreur modif API', error)
    }
  }

  return { postits, fetchApiNotes, addPostit, deletePostit, updatePostit }
})
