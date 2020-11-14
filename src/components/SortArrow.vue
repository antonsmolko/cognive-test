<template>
  <span class="sort-arrow position-absolute" @click="handleClick">
    <b-icon-arrow-up v-if="direction"/>
    <b-icon-arrow-down v-else/>
  </span>
</template>

<script>
import { BIconArrowUp, BIconArrowDown } from 'bootstrap-vue'

export default {
  name: "SortArrow",
  components: {
    BIconArrowUp,
    BIconArrowDown
  },
  props: {
    direction: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleClick () {
      this.$emit('click');
    }
  }
}
</script>

<style scoped>
.sort-arrow {
  top: 0;
  left: 100%;

  cursor: pointer;
}
</style>
