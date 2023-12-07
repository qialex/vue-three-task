<script setup lang="ts">
import Base3d from '../utils/Base3d'
import { reactive, onMounted } from 'vue'
import {useRoute} from "vue-router";


const data = reactive({
  base3d: {},
})

onMounted(() => {
  data.base3d = new Base3d('#three', useRoute().params.id)
})
</script>

<template>
  <div class="relative">
    <div class="three" id="three"></div>
  </div>
</template>
