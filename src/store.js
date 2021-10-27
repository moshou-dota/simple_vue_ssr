import Vue from "vue";
import Vuex from "vuex";
import { fetchItem } from "./api";

Vue.use(Vuex);

export function createStore() {
  return new Vuex.Store({
    state: {
      item: {}
    },
    actions: {
      fetchItem({ commit}, id) {
        return fetchItem(id).then(res => {
          commit("setItem", res);
        })
      }
    },
    mutations: {
      setItem(state, data) {
        Vue.set(state, 'item', data);
      },
    },
  });
}
