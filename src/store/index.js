import { createStore } from "vuex";

export default createStore({
  state: {
    todoList: [],
  },
  mutations: {
    ADD_TODO(state, obj) {
      state.todoList.push(obj);
    },
		UPDATE_STORE(state) {
			localStorage.setItem("todoList", JSON.stringify(state.todoList));
		},
    UPDATE_TODO(state, data) {
      Object.assign(
        state.todoList.find((i) => i.id === data.id),
        data
      );
    },
    INITIALISE_STORE(state) {
      if (localStorage.getItem("todoList")) {
				Object.assign(
					state.todoList,
					JSON.parse(localStorage.getItem("todoList"))
        );
      }
    },
		REMOVE_TODO(state, id) {
			state.todoList = state.todoList.filter(i => i.id !== id);
		},
  },
  actions: {
    GetRandomKey() {
      const letters = "abcdefghijklmnopqrstuvwxyz0123456789";
      let word = "";
      for (let i = 0; i < 15; i++) {
        word += letters.charAt(Math.floor(Math.random() * letters.length));
      }
      return (
        word.substring(0, 5) +
        "-" +
        word.substring(5, 5) +
        "-" +
        word.substring(10, 5).toUpperCase()
      );
    },
    async AddTodo({ commit, dispatch }, obj) {
      const key = await dispatch("GetRandomKey");
      commit("ADD_TODO", { ...obj, id: key, complete: false });
			commit("UPDATE_STORE");
    },
    UpdateTodo({ commit }, data) {
      commit("UPDATE_TODO", data);
			commit("UPDATE_STORE");
    },
    InitialiseStore({ commit }) {
      commit("INITIALISE_STORE");
    },
    RemoveTodo({ commit }, id) {
      commit("REMOVE_TODO", id);
			commit("UPDATE_STORE");
    },
  },
});