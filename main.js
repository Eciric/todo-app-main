import Sortable from "sortablejs";

import iconCross from "./images/icon-cross.svg";
const headerButton = document.querySelector(".header__button");
const iconMoon = document.querySelector(".button__icon-moon");
const iconSun = document.querySelector(".button__icon-sun");
const inputField = document.querySelector("#input__field");
const todoTasks = document.querySelector(".todo__tasks");
const toolbarSwitches = document.querySelectorAll(".toolbar__switch");
const infoCount = document.querySelector(".info__count");
const infoClear = document.querySelector(".info__clear");
const root = document.querySelector(":root");

let tasks = [];
const tasksTypes = { all: "All", active: "Active", completed: "Completed" };
let displayTasksType = tasksTypes.all;

const sortable = new Sortable(todoTasks, {
	removeOnSpill: true,
	onSpill: customOnSpill,
});

onload = () => {
	switchThemes();
	addTaskOnEnter();
	assignActiveToolbarSwitchListeners();
	assignClearCompletedListener();
	displayTasks();
};

function customOnSpill(/**Event*/ evt) {
	const taskId =
		evt.item.children[evt.item.children.length - 1].getAttribute(
			"task__id"
		);
	removeTaskFromList(taskId);
	evt.item.parentElement.removeChild(evt.item);
	if (!tasks.length) {
		displayTasks();
	}
}

function switchThemes() {
	headerButton.addEventListener("click", () => {
		if (iconMoon.getAttribute("aria-hidden") === "false") {
			iconMoon.setAttribute("aria-hidden", true);
			iconSun.setAttribute("aria-hidden", false);
			activateDarkTheme();
		} else {
			iconMoon.setAttribute("aria-hidden", false);
			iconSun.setAttribute("aria-hidden", true);
			activateLightTheme();
		}
	});
}

function addTaskOnEnter() {
	inputField.addEventListener("keyup", (e) => {
		if (e.keyCode === 13) {
			addTask(inputField.value);
		}
	});
}

function addTask(title) {
	if (inputField.value) {
		const id = generateUUID();
		tasks.push({ id, title, status: "", type: tasksTypes.active });
		inputField.value = "";
		displayTasks();
	}
}

function displayTasks() {
	if (tasks.length) {
		let tasksHTML = "";
		tasks
			.filter((t) => {
				return displayTasksType === tasksTypes.all
					? t
					: t.type === displayTasksType;
			})
			.forEach((task) => {
				tasksHTML += `
			<li class="task | bb" ${task.status}>
				<button class="task__button task__toggle">
					<span class="circle"></span>
					<span class="visually-hidden"
						>Button controlling task status</span
					>
				</button>
				<div class="task__title">
					${task.title}
				</div>
				<button
					class="task__button task__remove"
					task__id="${task.id}"
				>
					<img
						src=${iconCross}
						alt="remove task"
					/>
				</button>
			</li>`;
			});
		todoTasks.innerHTML = tasksHTML;
		assignRemoveListeners();
		assignCompleteListeners();
		infoCount.textContent = `${tasks.length} items left`;
	} else {
		todoTasks.innerHTML = `
		<section class="empty">
			<div class="empty__task">There's no tasks to track.</div>
		</section>
		`;
		infoCount.textContent = "0 items left";
	}
}

function assignRemoveListeners() {
	const removeButtons = document.querySelectorAll(".task__remove");
	removeButtons.forEach((removeButton) => {
		removeButton.addEventListener("click", () => {
			customOnSpill({ item: removeButton.parentElement });
		});
	});
}

function removeTaskFromList(id) {
	tasks.splice(
		tasks
			.map((t) => {
				return t.id;
			})
			.indexOf(id),
		1
	);
}

function assignCompleteListeners() {
	const toggleButtons = document.querySelectorAll(".task__toggle");
	toggleButtons.forEach((toggleButton, index) => {
		toggleButton.addEventListener("click", () => {
			toggleButton.parentElement.toggleAttribute("task--completed");
			tasks[index].status === "task--completed"
				? ((tasks[index].status = ""),
				  (tasks[index].type = tasksTypes.active))
				: ((tasks[index].status = "task--completed"),
				  (tasks[index].type = tasksTypes.completed));
		});
	});
}

function assignActiveToolbarSwitchListeners() {
	toolbarSwitches.forEach((toolbarSwitch) => {
		toolbarSwitch.addEventListener("click", () => {
			toolbarSwitches.forEach((tbSwitch) => {
				tbSwitch.style.color =
					"var(--clr-neutral-light-theme-very-dark-grayish-blue)";
			});
			toolbarSwitch.style.color = "var(--clr-primary-bright-blue)";
			if (tasksTypes[String(toolbarSwitch.outerText).toLowerCase()]) {
				displayTasksType = toolbarSwitch.outerText;
				displayTasks();
			}
		});
	});
}

function assignClearCompletedListener() {
	infoClear.addEventListener("click", () => {
		tasks = tasks.filter((task) => {
			return !(task.type === tasksTypes.completed);
		});
		displayTasks();
	});
}

function activateLightTheme() {
	let rootCS = getComputedStyle(root);
	root.style.setProperty(
		"--clr-dynamic-bg",
		rootCS.getPropertyValue("-clr-light-theme-light-grayish-blue")
	);
	root.style.setProperty(
		"--clr-dynamic-tasks-bg",
		rootCS.getPropertyValue("--clr-light-theme-very-light-grayish-blue")
	);
	root.style.setProperty(
		"--clr-dynamic-heading",
		rootCS.getPropertyValue("--clr-light-theme-very-light-gray")
	);
	root.style.setProperty(
		"--clr-dynamic-paragraph-1",
		rootCS.getPropertyValue("--clr-light-theme-very-dark-grayish-blue")
	);
	root.style.setProperty(
		"--clr-dynamic-paragraph-2",
		rootCS.getPropertyValue("--clr-light-theme-dark-grayish-blue")
	);
	root.style.setProperty(
		"--clr-dynamic-paragraph-3",
		rootCS.getPropertyValue("--clr-light-theme-light-grayish-blue")
	);
}

function activateDarkTheme() {
	let rootCS = getComputedStyle(root);
	root.style.setProperty(
		"--clr-dynamic-bg",
		rootCS.getPropertyValue("--clr-dark-theme-very-dark-blue")
	);
	root.style.setProperty(
		"--clr-dynamic-tasks-bg",
		rootCS.getPropertyValue("--clr-dark-theme-very-dark-desaturated-blue")
	);
	root.style.setProperty(
		"--clr-dynamic-heading",
		rootCS.getPropertyValue("--clr-light-theme-very-light-gray")
	);
	root.style.setProperty(
		"--clr-dynamic-paragraph-1",
		rootCS.getPropertyValue("--clr-dark-theme-light-grayish-blue")
	);
	root.style.setProperty(
		"--clr-dynamic-paragraph-2",
		rootCS.getPropertyValue("--clr-dark-theme-dark-grayish-blue")
	);
	root.style.setProperty(
		"--clr-dynamic-paragraph-3",
		rootCS.getPropertyValue("--clr-light-theme-light-grayish-blue")
	);
}

function generateUUID() {
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
		(
			c ^
			(crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
		).toString(16)
	);
}
