<template>
  <div id="app">
    <div class="container" v-if="appState === 'loaded'">
      <div class="row align-items-end justify-content-between">
        <div class="col-auto">
          <div class="form-group">
            <label>Per page</label>
            <select class="form-control" @change="handelPerPageChange">
              <option
                v-for="(item, index) in perPageSet"
                :key="index">{{ item }}</option>
            </select>
          </div>
        </div>
        <div class="col-auto">
          <search :list="items" @search="handleSearch"/>
        </div>
        <div class="col-auto">
          <pagination :count="pageCount" :active="page" @paginate="handlePaginate" />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <table class="table">
            <thead class="thead-dark">
              <tr>
                <table-header-item title="#" @sort="handleSort" sortField="id" />
                <table-header-item title="Name" @sort="handleSort" sortField="name" />
                <table-header-item title="Height" @sort="handleSort" sortField="height" />
                <table-header-item title="Mass" @sort="handleSort" />
                <table-header-item title="Created" @sort="handleSort" sortField="created" />
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in paginateItems"
                :key="getId(item)">
                <td scope="row">{{ getId(item) }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.height }}</td>
                <td>{{ item.mass}}</td>
                <td>{{ getFormattedDate(item.created) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="row">
        
      </div>
    </div>
    <div class="container" v-else-if="appState === 'loading'">
      <div class="row">
        <div class="col">
          <div>
            <b-spinner type="grow" label="Loading..."></b-spinner>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import moment from 'moment';
import size from 'lodash/size';
import TableHeaderItem from './components/TableHeaderItem.vue';
import Pagination from './components/Pagination.vue';
import Search from './components/Search.vue';

export default {
  name: 'App',
  components: {
    TableHeaderItem,
    Pagination,
    Search,
  },
  data: () => ({
    perPageSet: [5, 10, 20, 50, 100],
    state: null,
    defaultOrderBy: 'id',
  }),
  computed: {
    ...mapState({
      items: state => state.items,
      perPage: state => state.perPage,
      page: state => state.page,
      appState: state => state.appState,
      orderBy: state => state.orderBy,
      sortReverse: state => state.sortReverse
    }),
    ...mapGetters([
      'paginateItems',
      'items'
    ]),
    perPageDefault () {
      return this.perPageSet[0];
    },
    pageCount () {
      return Math.ceil(this.items.length / this.perPage);
    },
  },
  async created () {
    this.setFieldAction({ field: 'perPage', value: this.perPageDefault });
    this.setFieldsAction({
      perPage: this.perPageDefault,
      orderBy: this.defaultOrderBy,
    });
    await this.getItemsAction()
  },
  methods: {
    ...mapActions ({
      getItemsAction: 'getItems',
      setFieldAction: 'setField',
      setFieldsAction: 'setFields',
      setSearchedItemsAction: 'setSearchedItems'
    }),
    getId (item) {
      const { url } = item;

      return url.split('/').splice(-2, 1).join();
    },
    handelPerPageChange ({ target }) {
      const { value } = target;
      this.setFieldAction({ field: 'perPage', value });
      this.setFieldAction({ field: 'page', value: 1 });
    },
    handlePaginate (value) {
      this.setFieldAction({ field: 'page', value });
    },
    handleSearch (result) {
      const notEmpty = Boolean(size(result));
      const payload = notEmpty ? result: [];

      if (notEmpty) {
        this.setFieldAction({ field: 'page', value: 1 });
      }

      this.setSearchedItemsAction(payload);
    },
    handleSort (orderBy) {
      if (orderBy !== this.orderBy) {
        this.setFieldsAction({
          orderBy,
          sortReverse: false
        })
      } else {
        this.setFieldAction({ field: 'sortReverse', value: !this.sortReverse });
      }
    },
    getFormattedDate (timestamp) {
      return moment(timestamp).format('YYYY-MM-DD');
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
