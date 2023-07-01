<template lang="pug">
.todo-list
	.todo-list-modal(
		v-if="modal"
	)
		.todo-list-modal__container
			button.todo-list-modal__button(
				@click="acceptRemoveTodo"
			) Удалить
			button.todo-list-modal__button(
				@click="modal=false"
			) Отмена
	.todo-list__container(
		ref="field",
		@mousemove="fieldMove"
	)
		.todo-list__header
			h2.todo-list__title
				| Список дел
			router-link.todo-list__link(
				:to="{ name: 'Main' }"
			) Вернуться на главную
		.todo-list__drag(
			:style="fieldPosition",
			ref="container"
			@mousemove="itemTodoMove"
		)
			.todo-list__top
				button.todo-list-button(
					@mousedown="moveStart"
				)
					font-awesome-icon.todo-list-button__icon(
						:icon="['fas', 'hand']"
						)
					font-awesome-icon.todo-list-button__icon(
						:icon="['fas', 'hand-back-fist']"
					)
				.todo-list__trash(
					@mouseenter="addToTrash"
				)
					font-awesome-icon.todo-list-item__icon(
						:icon="['fas', 'trash-can']"
					)
			ul.todo-list-list(
				:class="{ 'todo-list-list_empty': todoList.length === 0 }"
			)
				li.todo-list-item(
					v-for="(todo, index) in todoList",
					:key="todo.index",
					:class="{ 'todo-list-item_active': dragedItem === todo.id }",
					:style="itemPosition"
				)
					p.todo-list-item__numb {{ index + 1 }}
					.todo-list-item__wrapper(
							@mousedown="dragedItem = todo.id"
					)
						p.todo-list-item__title(
							:class="{ 'todo-list-item__title_highlight': todo.complete, 'todo-list-item__title_important': todo.important }"
						) {{ todo.title }}
					button.todo-list-item__button(
						:class="{ 'todo-list-item__button_active': updateTodo === todo.id }",
						@click="updateTodoFunc(todo)"
					)
						font-awesome-icon.todo-list-item__icon(
							:icon="['fas', 'pen']"
						)
					button.todo-list-item__button(
						:class="{ 'todo-list-item__button_active': todo.complete }",
						@click="completeTodo(todo.id, !todo.complete)"
					)
						font-awesome-icon.todo-list-item__icon(
							:icon="['fas', 'circle-check']"
						)
				li.todo-list-list__title
					| Тут пусто
		.todo-list-form
			h3.todo-list-form__title
				| Запланировать дело
			input.todo-list-form__input(
				type="text"
				v-model="formValue.title",
				placeholder="Введите название задачи"
			)
			input.todo-list-form__checkbox#checkbox(
				type="checkbox",
				v-model="formValue.important"
			)
			label.todo-list-form__label(
				for="checkbox"
			) Важность
			input.todo-list-form__button(
				type="submit",
				@click="addTodo"
			)
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
	name: "TodoListPage",
	data() {
		return {
			active: false,
			modal: false,
			formValue: {
				title: "",
				important: false,
			},
			updateTodo: null,
			fieldPosition: {
				left: '40%',
				top: "40%",
			},
			itemPosition: {
				left: '40%',
				top: "40%",
			},
			dragedItem: null,
			deleteItem: null,
		};
	},
	computed: {
		...mapState(["todoList"]),
	},
	methods: {
		...mapActions(["AddTodo", "UpdateTodo", "InitialiseStore", "RemoveTodo"]),
		moveStart() {
			this.active = true;
		},
		moveEnd() {
			this.active = false;
			this.dragedItem = null;
		},
		fieldMove({ clientX, clientY }) {
      const { top, left } = this.$refs.field.getBoundingClientRect();
      if (this.active && window.innerWidth > 1000) {
        Object.assign(this.fieldPosition, {
          left: `${clientX - left}px`,
          top: `${clientY - top}px`,
        });
      }
    },
		itemTodoMove({ clientX, clientY }) {
			if (this.dragedItem) {
				const { top, left } = this.$refs.container.getBoundingClientRect();
        Object.assign(this.itemPosition, {
          left: `${clientX - left}px`,
          top: `${clientY - top}px`,
        });
      }
		},
		addTodo() {
			if (this.updateTodo) {
				this.UpdateTodo({
					...this.formValue,
					id: this.updateTodo,
					complete: false,
				});
				this.formValue = {};
			} else if (this.formValue.title) {
				this.AddTodo(this.formValue);
				this.formValue = {};
			}
		},
		updateTodoFunc({id, title, important}) {
			if (this.updateTodo === id) {
				this.updateTodo = null;
				this.formValue = {};
			} else {
				this.updateTodo = id;
				this.formValue = {
					title,
					important
				};
			}
		},
		completeTodo(id, value) {
			this.UpdateTodo({ id, complete: value });
		},
		addToTrash() {
			if (this.dragedItem) {
				this.modal = true;
				this.deleteItem = this.dragedItem;
				this.dragedItem = null;
			}
		},
		acceptRemoveTodo() {
			this.RemoveTodo(this.deleteItem);
			this.modal = false;
		}
	},
	mounted() {
    document.addEventListener("mouseup", this.moveEnd);
		this.InitialiseStore();
  },
  beforeUnmount() {
    document.removeEventListener("mouseup", this.moveEnd);
  },
}
</script>

<style lang="scss" scoped>
.todo-list {
	width: 100%;
	height: 100%;
	background-color: #212832;
	padding: 60px;
	overflow: hidden;
	&-modal {
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		background-color: rgba(16, 20, 27, 0.9);
		z-index: 2;
		&__container {
			display: flex;
			align-items: center;
			gap: 20px;
			width: 400px;
			height: 200px;
			padding: 50px;
			background-color: #212832;
		}
		&__button {
			position: relative;
			flex: 1;
			height: 60px;
			border: none;
			background-color: #263238;
			color: #FFF;
			font-size: 18px;
			font-weight: 600;
			&::before {
				content: "";
				position: absolute;
				left: 0;
				top: 0;
				height: 100%;
				width: 10px;
				background-color: #FED36A;
				visibility: hidden;
			}
			&:hover::before {
				visibility: visible;
			}
		}
	}
	&__container {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 1600px;
		height: 100%;
		margin: 0 auto;
	}
	&__header {
		position: relative;
		width: 100%;
		margin-top: 20px;
		text-align: center;
	}
	&__title {
		font-size: 52px;
		color: #FFFFFF;
	}
	&__link {
		position: absolute;
		right: 0;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 50px;
		width: 230px;
		border-radius: 100px;
		white-space: nowrap;
		background-color: #263238;
		color: #FFFFFF;
		transition: color 0.1s, background 0.1s;
		&:hover {
			color: #000000;
			background-color: #FED36A;
		}
	}
	&__drag {
		position: absolute;
		top: auto;
		left: auto;
		width: 600px;
		height: 600px;
		padding: 20px;
		background-color: #263238;
		transform: translate(-9%, -10%);
	}
	&__top {
		display: flex;
		justify-content: space-between;
	}
	&__trash {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 300px;
		border: 2px solid #6F8793;
		&_active {
			border-color: #FED36A;
		}
	}
	&-button {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 50px;
		width: 50px;
		background-color: #FED36A;
		border-radius: 5px;
		border: none;
		&__icon {
			position: absolute;
			width: 20px;
			height: 20px;
			color: #000000;
			transition: opacity 0.1s;
			&:nth-child(2) {
				opacity: 0;
			}
		}
		&:hover &__icon {
			&:nth-child(1) {
				opacity: 0;
			}
			&:nth-child(2) {
				opacity: 1;
			}
		}
	}
	&-list {
		display: flex;
		flex-direction: column;
		gap: 5px;
		height: 480px;
		max-height: 480px;
		margin-top: 10px;
		margin-right: -10px;
		padding-right: 10px;
		overflow-y: auto;
		&::-webkit-scrollbar {
			width: 4px;
			&-track {
				background: transparent;
			}
			&-thumb {
				border-radius: 5px;
				background-color: rgba(#FED36A, 0.8);
			}
		}
		&_empty {
			align-items: center;
			justify-content: center;
			margin-right: 0;
			border-radius: 15px;
			border: 2px solid #FED36A;
			.todo-list-list__title {
				display: block;
			}
		}
		&__title {
			display: none;
			font-size: 22px;
			font-weight: 600;
			color: #8CAAB9;
		}
	}
	&__top {
		display: flex;
		justify-content: space-between;
	}
	&__delete-field {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 50px;
		width: 200px;
		border-radius: 10px;
		border: 1px solid #000000;
	}
	&-item {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px;
		background: #455A64;
		color: #FFFFFF;
		&_active {
			position: absolute;
			width: 550px;
			transform: translate(-50%, 0);
		}
		&__numb {
			font-size: 14px;
			font-weight: 400;
		}
		&__wrapper {
			display: flex;
			align-items: center;
			width: 100%;
			height: 100%;
			cursor: pointer;
			&:hover {
				.todo-list-item__title {
					text-decoration: underline solid;
				}
			}
		}
		&__title {
			flex: 1;
			max-width: 440px;
			overflow: hidden;
			text-overflow: ellipsis;
			font-size: 18px;
			font-weight: 500;
			&_highlight {
				color: #8CAAB9;
			}
			&_important {
				color: #FED36A;
			}
		}
		&__button {
			height: 50px;
			width: 50px;
			background-color: #263238;
			border: none;
			transition: background 0.1s;
			cursor: pointer;
			&:hover,
			&_active {
				background-color: #FED36A;
				svg {
					color: #000000;
				}
			}
		}
		&__icon {
			width: 20px;
			height: 20px;
			color: #FFFFFF;
		}
	}
	&-form {
		display: flex;
		flex-direction: column;
		width: 400px;
		padding: 15px;
		background-color: #263238;
		color: #FFFFFF;
		&__title {
			font-size: 30px;
			color: #FFFFFF;
		}
		&__label {
			display: flex;
			align-items: center;
			user-select: none;
			padding: 20px;
			gap: 10px;
			cursor: pointer;
			&::before {
				content: '';
				display: inline-block;
				width: 1em;
				height: 1em;
				flex-shrink: 0;
				flex-grow: 0;
				border: 1px solid #adb5bd;
				border-radius: 0.25em;
				margin-right: 0.5em;
				background-repeat: no-repeat;
				background-position: center center;
				background-size: 50% 50%;
			}
			&:hover {
				color: #FED36A;
			}
		}
		&__checkbox {
			visibility: hidden;
			&:checked + label::before {
				border-color: #455A64;
				background-color: #455A64;
				background-image: url("../assets/svg/checkbox.svg");
				background-size: 20px;
				background-position: center;
			}
		}
		&__input {
			height: 58px;
			padding: 17px 18px;
			outline: none;
			font-family: Avenir, Helvetica, Arial, sans-serif;
			color: #FFFFFF;
			font-size: 18px;
			font-weight: 400;
			background-color: #455A64;
			border: none;
			transition: background 0.1s;
			&::placeholder {
				color: #6F8793;
				font-size: 16px;
			}
			&:hover {
				background-color: rgba(#455A64, 0.9);
			}
		}
		&__button {
			height: 50px;
			background-color: #455A64;
			outline: none;
			border: none;
			color: #FFFFFF;
			font-size: 18px;
			transition: background 0.1s, color 0.1s;
			cursor: pointer;
			&:hover {
				color: #000000;
				background-color: #FED36A;
			}
		}
	}
}
@media screen and (max-width: 1000px) {
	.todo-list {
		&__header {
			text-align: inherit;
		}
		&__drag {
			position: inherit;
			top: auto !important;
			left: auto !important;
			margin-bottom: 30px;
			transform: none;
		}
		&-button {
			visibility: hidden;
			pointer-events: none;
		}
	}

}
</style>