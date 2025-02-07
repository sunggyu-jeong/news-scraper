<!-- IconWithText.vue -->
<template>
  <div class="vertical-container">
    <component :is="icon" class="search-images" v-bind:style="{ color: color }" />
    <span class="title" v-bind:style="{ color: color }">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
  icon: {
    type: Object,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: "#89919D",
  },
});
</script>

<style lang="scss" scoped>
.vertical-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.search-images {
  width: 20px;
  height: 20px;
}

.vertical-container .title {
  margin-top: 4px;
  font-size: 11px;
}
</style>
