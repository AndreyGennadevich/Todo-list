<template lang="pug">
.todo-list
	.todo-list__container(
		ref="field"
	)
		.todo-list__header
			h2.todo-list__title
				| Список дел
			router-link.todo-list__link(
				:to="{ name: 'Main' }"
			) Вернуться на главную
		.todo-list__drag(
			:style="fieldPosition",
			key="dragItem",
			@mousemove="fieldMove"
		)
			button.todo-list-button(
				@mousedown="moveStart"
			)
				font-awesome-icon.todo-list-button__icon(
					:icon="['fas', 'hand']"
					)
				font-awesome-icon.todo-list-button__icon(
					:icon="['fas', 'hand-back-fist']"
				)
			ul.todo-list-list(
				:class="{ 'todo-list-list_empty': todoList.length === 0 }"
			)
				li.todo-list-item(
					v-for="(todo, index) in todoList",
					:key="todo.index"
				)
					p.todo-list-item__numb {{ index + 1 }}
					p.todo-list-item__title(
						:class="{ 'todo-list-item__title_complete': todo.complete, 'todo-list-item__title_important': todo.important }"
					) {{ todo.title }}
					button.todo-list-item__change.todo-list-item__button(
						@click="updateTodoFunc(todo)"
					)
						font-awesome-icon.todo-list-item__icon(
							:icon="['fas', 'pen']"
						)
					button.todo-list-item__complete.todo-list-item__button(
						@click="completeTodo(todo.id, !todo.complete)"
					)
						font-awesome-icon.todo-list-item__icon(
							:icon="['fas', 'circle-check']"
						)
					button.todo-list-item__remove.todo-list-item__button(
						@click="RemoveTodo(todo.id)"
					)
						font-awesome-icon.todo-list-item__icon(
							:icon="['fas', 'trash-can']"
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
			formValue: {
				title: "",
				important: false,
			},
			updateTodo: null,
			fieldPosition: {
				left: '40%',
				top: "40%",
			},
			dragedItem: null,
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
		fieldMove({ clientX, clientY }) {
      const { top, left } = this.$refs.field.getBoundingClientRect();
      if (this.active && window.innerWidth > 1000) {
        Object.assign(this.fieldPosition, {
          left: `${clientX - left}px`,
          top: `${clientY - top}px`,
        });
      }
    },
		moveEnd() {
			this.active = false;
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
	background-color: #677DB7;
	padding: 60px;
	overflow: hidden;
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
		margin-bottom: 20px;
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
		background-color: #6622CC;
		color: #FFFFFF;
		transition: color 0.1s;
		&:hover {
			color: rgba(#FFFFFF, 0.6);
		}
	}
	&__drag {
		position: absolute;
		top: auto;
		left: auto;
		width: 600px;
		height: 600px;
		padding: 20px;
		background-color: #6622CC;
		border: 2px solid #DE3C4B;
		border-radius: 10px;
		transform: translate(-9%, -10%);
	}
	&-button {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 50px;
		width: 50px;
		background-color: #DE3C4B;
		border-radius: 5px;
		border: none;
		&__icon {
			position: absolute;
			width: 20px;
			height: 20px;
			color: #FFFFFF;
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
				background-color: rgba(#DE3C4B, 0.8);
			}
		}
		&_empty {
			align-items: center;
			justify-content: center;
			margin-right: 0;
			border-radius: 15px;
			border: 2px solid #677DB7;
			.todo-list-list__title {
				display: block;
			}
		}
		&__title {
			display: none;
			font-size: 22px;
			color: rgba(#FFFFFF, 0.6);
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
		border-bottom: 1px solid #DE3C4B;
		color: #FFFFFF;
		font-weight: 600;
		&__title {
			flex: 1;
			max-width: 440px;
			overflow: hidden;
			text-overflow: ellipsis;
			font-size: 18px;
			font-weight: 400;
			&_complete {
				text-decoration: line-through #000000;
			}
			&_important {
				font-size: 20px;
				font-weight: 600;
				color: #DE3C4B;
			}
		}
		&__button {
			background-color: #DE3C4B;
			border-radius: 5px;
			border: 2px solid transparent;
			transition: border 0.1s;
			&:hover {
				border: 2px solid #677DB7;
				svg {
					color: #6622CC;
				}
			}
		}
		&__icon {
			width: 15px;
			height: 15px;
			color: #FFFFFF;
		}
	}
	&-form {
		display: flex;
		flex-direction: column;
		width: 400px;
		padding: 15px;
		background-color: #6622CC;
		border: 2px solid #DE3C4B;
		border-radius: 15px;
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
				color: #DE3C4B;
			}
		}
		&__checkbox {
			visibility: hidden;
			&:checked + label::before {
				border-color: #677DB7;
				background-color: #677DB7;
				background-image: url("../assets/svg/checkbox.svg");
				background-size: 20px;
				background-position: center;
			}
		}
		&__input {
			height: 50px;
			padding: 10px 15px;
			border-radius: 15px;
			outline: none;
			font-family: Avenir, Helvetica, Arial, sans-serif;
			color: #FFFFFF;
			font-size: 20px;
			background-color: #677DB7;
			border: none;
			transition: background 0.1s;
			&::placeholder {
				color: #FFFFFF;
			}
			&:hover {
				background-color: rgba(#677DB7, 0.9);
			}
		}
		&__button {
			height: 50px;
			border-radius: 15px;
			background-color: #677DB7;
			outline: none;
			border: none;
			color: #FFFFFF;
			font-size: 18px;
			transition: background 0.1s;
			&:hover {
				background-color: rgba(#677DB7, 0.9);
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