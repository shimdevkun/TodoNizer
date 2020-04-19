let taskList = document.querySelector('.task-list');
let btnAdd = document.querySelector('.btn-add');
let newTask = document.querySelector('input[name="task"]');

// Events
btnAdd.addEventListener('click', addTask);
taskList.addEventListener('click', performTaskAction);

taskList.addEventListener('mouseenter', showActions, true);
taskList.addEventListener('mouseleave', hideActions, true);

document.addEventListener('click', checkInsideOutside);

// FUNCTIONS

//#region addTask
function addTask(e) {
	e.preventDefault();
	if (taskList.classList.contains('edit-mode')) {
		alert('You must exit edit mode first');
		return;
	}

	if (newTask.value === '') {
		alert('Input field cannot be empty');
		newTask.focus();
		return;
	}

	// create task-description
	let taskDescription = document.createElement('p');
	taskDescription.textContent = newTask.value;
	taskDescription.classList.add('task-description');

	// create task-actions
	let taskActions = document.createElement('ul');
	taskActions.classList.add('task-actions');

	let liDelete = document.createElement('li');
	liDelete.textContent = 'Delete';
	liDelete.classList.add('delete', 'hidden');

	let liEdit = document.createElement('li');
	liEdit.textContent = 'Edit';
	liEdit.classList.add('edit', 'hidden');

	let liDone = document.createElement('li');
	liDone.textContent = 'Done';
	liDone.classList.add('done', 'hidden');

	let liUndo = document.createElement('li');
	liUndo.textContent = 'Undo';
	liUndo.classList.add('undo', 'hidden');

	taskActions.appendChild(liDelete);
	taskActions.appendChild(liEdit);
	taskActions.appendChild(liDone);
	taskActions.appendChild(liUndo);

	// create task
	let task = document.createElement('div');
	task.classList.add('task');

	task.appendChild(taskDescription);
	task.appendChild(taskActions);

	taskList.appendChild(task);

	// clean task input
	newTask.value = '';
	newTask.focus();
}
//#endregion

//#region toggleActions
function showActions(e) {
	if (e.target.classList.contains('task')) {
		let task = e.target;
		let taskDescription = task.children[0];
		let taskActions = task.children[1];

		// convert HTML Collection to Array
		let arrTaskActions = Array.from(taskActions.children);

		if (taskDescription.classList.contains('done')) {
			arrTaskActions.forEach(li => {
				if (li.classList.contains('delete') || li.classList.contains('undo')) {
					li.classList.remove('hidden');
				}
			});
		} else {
			arrTaskActions.forEach(li => {
				if (!li.classList.contains('undo')) {
					li.classList.remove('hidden');
				}
			});
		}
	}
}

function hideActions(e) {
	if (e.target.classList.contains('task')) {
		let task = e.target;
		let taskActions = task.children[1];

		// convert HTML Collection to Array
		let arrTaskActions = Array.from(taskActions.children);

		arrTaskActions.forEach(li => {
			li.classList.add('hidden');
		});
	}
}

//#endregion

//#region performTaskAction
function performTaskAction(e) {
	let action = e.target.className;

	switch (action) {
		case 'delete':
			deleteTask(e);
			break;
		case 'edit':
			editTask(e);
			break;
		case 'done':
			doneTask(e);
			break;
		case 'undo':
			undoTask(e);
			break;
		case 'btn-return':
			returnAction(e);
			break;
	}
}

function deleteTask(e) {
	let task = e.target.parentElement.parentElement;
	taskList.removeChild(task);
}

function editTask(e) {
	let task = e.target.parentElement.parentElement;
	let taskDescription = task.children[0];
	let taskActions = task.children[1];

	// Create input
	let editTask = document.createElement('input');
	editTask.type = 'text';
	editTask.name = 'edit';

	editTask.placeholder = 'Edit this task...';
	editTask.value = taskDescription.textContent;

	// Create edit button
	let btnEdit = document.createElement('button');
	btnEdit.classList.add('btn-edit');
	btnEdit.type = 'submit';
	btnEdit.textContent = 'Edit';

	// Create return button
	let btnReturn = document.createElement('button');
	btnReturn.classList.add('btn-return');
	btnReturn.type = 'button';
	btnReturn.textContent = 'Return';

	// Create flex container
	let div = document.createElement('flex');
	div.classList.add('flex');
	div.appendChild(btnReturn);
	div.appendChild(btnEdit);

	// Create form
	let form = document.createElement('form');
	form.classList.add('frmEdit');
	form.appendChild(editTask);
	form.appendChild(div);

	// Add form + hide task-description and task-actions
	task.appendChild(form);
	task.classList.add('edit-mode');
	taskDescription.classList.add('hidden');
	taskActions.classList.add('hidden');
	taskList.classList.add('edit-mode');

	// Add click event
	btnEdit.addEventListener('click', function(e) {
		e.preventDefault();
		taskDescription.textContent = editTask.value;
		resetUI(task, form);
	});
}

function doneTask(e) {
	let taskActions = e.target.parentElement;
	let taskDescription = taskActions.previousElementSibling;
	taskDescription.classList.add('done');

	let arrTaskActions = Array.from(taskActions.children);
	arrTaskActions.forEach(li => {
		if (li.classList.contains('delete') || li.classList.contains('undo')) {
			li.classList.remove('hidden');
		} else {
			li.classList.add('hidden');
		}
	});
}

function undoTask(e) {
	let taskActions = e.target.parentElement;
	let taskDescription = taskActions.previousElementSibling;
	taskDescription.classList.remove('done');

	let arrTaskActions = Array.from(taskActions.children);
	arrTaskActions.forEach(li => {
		if (li.classList.contains('undo')) {
			li.classList.add('hidden');
		} else {
			li.classList.remove('hidden');
		}
	});
}

function returnAction(e) {
	// DO NOT CHANGE VALUE

	// Get elements
	let form = e.target.parentElement.parentElement; // btn-return -> .flex -> form
	let task = form.parentElement;

	resetUI(task, form);
}

//#endregion

//#region Utilities
function checkInsideOutside(e) {
	// Check if edit-mode exists
	let task = document.querySelector('.task.edit-mode');
	if (!task) return;

	let targetElement = e.target;

	// Check if target is btn-add
	if (targetElement == btnAdd) {
		task.lastElementChild.firstChild.focus();
		return;
	}

	// Check if target is inside task
	do {
		if (targetElement == task) {
			console.log('clicked inside!');
			return;
		}
		targetElement = targetElement.parentElement;
	} while (targetElement);
	console.log('clicked outside!');

	// Close edit
	let btnReturn = document.querySelector('.btn-return');
	btnReturn.click(); // calls returnAction(e)
}

function resetUI(task, form) {
	// Get elements
	let taskDescription = task.children[0];
	let taskActions = task.children[1];

	// Reset UI
	task.classList.remove('edit-mode');
	taskDescription.classList.remove('hidden');
	taskActions.classList.remove('hidden');
	taskList.classList.remove('edit-mode');

	// Delete form
	task.removeChild(form);
}

//#endregion
