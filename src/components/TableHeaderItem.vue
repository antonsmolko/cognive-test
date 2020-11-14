<template>
  <th scope="col">
    <div class="d-flex w-100 justify-content-center" v-b-hover="handleHover">
      <span class="position-relative">
        {{ title }}
        <sort-arrow
          v-if="isHovered && sortField"
          :direction="direction"
          @click="handleSortOrderChange" />
      </span>
    </div>
  </th>
</template>

<script>
import { mapState } from 'vuex';
import SortArrow from './SortArrow.vue';

export default {
  name: "TableArrowItem",
  components: {
    SortArrow,
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    sortField: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    isHovered: false,
  }),
  computed: {
    ...mapState({
      orderBy: state => state.orderBy,
      sortReverse: state => state.sortReverse
    }),
    direction () {
      if (!this.sortField) return null;

      return this.orderBy === this.sortField
        ? !this.sortReverse
        : false;
    }
  },
  methods: {
    handleHover (hovered) {
      this.isHovered = hovered;
    },
    handleSortOrderChange () {
      if (this.sortField) {
        this.$emit('sort', this.sortField);
      }
    }
  }
}
</script>

<style>

</style>