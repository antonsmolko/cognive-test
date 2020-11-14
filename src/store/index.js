import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import uniqBy from 'lodash/uniqBy'
import has from 'lodash/has'
import size from 'lodash/size'
import sortBy from 'lodash/sortBy'
import reverse from 'lodash/reverse'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    items: [],
    searchedItems: [],
    perPage: null,
    page: 1,
    appState: null,
    orderBy: null,
    sortReverse: false,
    defaultSortOrder: 'asc'
  },
  mutations: {
    SET_ITEMS: (state, payload) => {
      state.items = payload;
    },
    UNION_ITEMS: (state, payload) => {
      state.items = uniqBy([...state.items, ...payload], 'url');
    },
    SET_FIELD: (state, { field, value }) => {
      if (has(state, field)) {
        state[field] = value;
      }
    },
    SET_FIELDS: (state, payload) => {
      for (const [field, value] of Object.entries(payload)) {
        if (has(state, field)) {
          state[field] = value;
        }
      }
    },
    SET_SEARCHED_ITEMS: (state, payload) => {
      state.searchedItems = payload.map(({ item }) => item);
    }
  },
  actions: {
    getItems:  async ({ commit }) => {
      commit('SET_FIELD', { field: 'appState', value: 'loading' });

      let next = 'https://swapi.dev/api/people';
      do {
        const { data } = await axios.get(next);
        commit('UNION_ITEMS', data.results);
        next = data.next;
      } while (next !== null);

      commit('SET_FIELD', { field: 'appState', value: 'loaded' });
    },
    setField: ({ commit }, payload) => commit('SET_FIELD', payload),
    setFields: ({ commit }, payload) => commit('SET_FIELDS', payload),
    setSearchedItems: ({ commit}, payload) => commit('SET_SEARCHED_ITEMS', payload),
  },
  getters: {
    items: state => size(state.searchedItems) ? state.searchedItems : state.items,
    sortedItems: (state, getters) => {
      const sorted = sortBy(getters.items, state.orderBy);

      return state.sortReverse ? reverse(sorted) : sorted;
    },
    paginateItems: (state, getters) => {
      const from = (state.page - 1) * state.perPage;
      const to = from + Number(state.perPage);

      return getters.sortedItems.slice(from, to);
    },
  }
})
