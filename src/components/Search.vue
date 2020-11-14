<template>
  <div class="input-group mb-3">
    <div class="input-group-prepend">
      <span class="input-group-text" id="basic-addon1">Search</span>
    </div>
    <input
      type="text"
      class="form-control"
      placeholder="Input request"
      aria-label="Search"
      aria-describedby="basic-addon1"
      @input="onSearch">
  </div>
</template>

<script>
import Fuse from 'fuse.js';

export default {
  name: "Search",
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    fuse: null,
    options: {
      isCaseSensitive: false,
      threshold: 0,
      ignoreLocation: false,
      keys: [
        'name',
        'gender',
        'height',
        'eye_color'
      ]
    }
  }),
  created () {
    this.fuse = new Fuse(this.list, this.options);
  },
  methods: {
    onSearch ({ target }) {
      const { value } = target;
      const result = this.fuse.search(value);

      this.$emit('search', result);
    }
  }
}
</script>
