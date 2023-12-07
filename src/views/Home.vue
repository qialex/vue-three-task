<script setup lang="ts">
import { reactive } from 'vue'
import { geometries } from '../utils/geometries'

const data = reactive({
  getTo: (id) => `/geometry/${id}`
})
</script>

<template>
  <div class="mt-8 inline-flex rounded-md space-x-2" >
    <router-link
      v-for="geometry in geometries" :key="geometry.id"
      :to="data.getTo(geometry.id)"
      class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium leading-6 text-white transition duration-150 ease-in-out hover:bg-indigo-500 focus:outline-none"
      >Geometry {{key}} {{geometry.id}}</router-link
    >
  </div>
</template>
