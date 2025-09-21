<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div 
      class="fixed inset-0 bg-gradient-to-br from-pink-500/30 to-orange-300/20 backdrop-blur-md transition-opacity"
      @click="closeModal"
    ></div>

    <div class="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-0">
      <div 
        class="relative transform overflow-hidden rounded-xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6 dark:bg-gray-800 border-t-4 border-pink-500"
      >
        <div class="mt-3 text-center">
          <h3 class="text-xl font-semibold leading-6 text-gray-900 dark:text-white">
            Supprimer tous les post-its ?
          </h3>


          <div class="mt-4">
            <p class="text-sm text-gray-600 dark:text-gray-300"> 
              Es-tu sûr(e) de vouloir supprimer tous tes post-its ? 
              Cette action est irréversible ! 
            </p>
          </div>
        </div>

        <div class="mt-6 flex justify-center gap-3">
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            @click="closeModal"
          >
            Annuler
          </button>
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-orange-400 rounded-md shadow-sm hover:from-pink-600 hover:to-orange-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
            @click="confirm"
          >
            Oui, supprimer tout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'DeleteConfirmModal',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    confirm() {
      this.$emit('confirm')
      this.closeModal()
    }
  }
}
</script>