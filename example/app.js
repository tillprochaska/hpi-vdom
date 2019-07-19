import { createVNode, mount, changeState } from '../src/virtual-dom.js';

const TodoApp = state => {
    return createVNode('div', {}, [
        createVNode('h1', {}, ['Meine Aufgaben']),
        TodoList(state.todos),
    ]);
};

const TodoList = todos => {
    return createVNode('ol', {}, todos.map(item => {
        if(!item) return null;
        return TodoItem(item);
    }));
};

const TodoItem = item => {
    return createVNode('li', { class: item.isDone && 'is-done' }, [ item.label ]);
}

const root = document.querySelector('#app');

let state = {
    todos: [
        { label: 'Vortrag vorbereiten', isDone: true },
        { label: 'Vortrag halten', isDone: true },
        { label: 'Seminararbeit fertigstellen' },
    ],
};

const toggleTodo = index => {
    state.todos[index].isDone = !state.todos[index].isDone;
    changeState(app, state);
};

const addTodo = label => {
    state.todos = [ ...state.todos, { label } ];
    changeState(app, state);
};

const deleteTodo = index => {
    state.todos = [
        ...state.todos.slice(0, index),
        ...state.todos.slice(index + 1),
    ];
    changeState(app, state);
};

let app = mount(TodoApp, state, root);

document.querySelector('#toggle').addEventListener('submit', event => {
    event.preventDefault();
    const index = document.querySelector('#toggle-index').value - 1;
    toggleTodo(index);
});

document.querySelector('#add').addEventListener('submit', event => {
    event.preventDefault();
    const input = document.querySelector('#add-label');
    addTodo(input.value);
    input.value = '';
});

document.querySelector('#delete').addEventListener('submit', event => {
    event.preventDefault();
    const index = document.querySelector('#delete-index').value - 1;
    deleteTodo(index);
});
