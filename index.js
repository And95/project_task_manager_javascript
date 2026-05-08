const tasks_fixed = [
  {
    id: 1,
    title: "Implementar tela de listagem de tarefas",
    description: "frontend",
    dt_insercao: "21/08/2024",
    checked: false,
  },
  {
    id: 2,
    title: "Criar endpoint para cadastro de tarefas",
    description: "backend",
    dt_insercao: "21/08/2024",
    checked: false,
  },
  {
    id: 3,
    title: "Implementar protótipo da listagem de tarefas",
    description: "ux",
    dt_insercao: "21/08/2024",
    checked: false,
  },
];

/**************************************************/
/* get task in localStorage */
const getTasksFromLocalStorage = () =>
  JSON.parse(window.localStorage.getItem("tasks")) || [];

/**************************************************/
/* set task in localStorage */
const setTasksInLocalStorage = (tasks) =>
  window.localStorage.setItem("tasks", JSON.stringify(tasks));

/**************************************************/
/* include id */
const getNewTaskId = () => {
  const tasks = getTasksFromLocalStorage();
  const lastId = tasks[tasks.length - 1]?.id;

  return lastId ? lastId + 1 : 1;
};

/**************************************************/
/* clear the inputs */
const clearInputs = () => {
  document.getElementById("title").value = "";
  document.getElementById("activity").value = "";
  document.getElementById("title").focus();
};

/**************************************************/
/* render task(html) */
const renderTask = (task) => {
  const div = document.createElement("div");
  div.className = "task";

  div.innerHTML = `
    <ul>
      <li>
        <h2 class="taskTitle">${task.title}</h2>
      </li>

      <li class="innerTaskActivityDate">
        <p class="taskActivity">${task.description}</p>

        <span class="taskDate">
          Criado em: ${task.dt_insercao}
        </span>
      </li>
    </ul>

    <div class="taskActions">
      <button
        class="doneBtn"
        data-id="${task.id}"
        ${task.checked ? 'style="display:none;"' : ""}
        aria-label="Concluir tarefa"
      >
        Concluir
      </button>

      <img
        src="./assets/checked.svg"
        alt="checked"
        class="checked"
        ${task.checked ? 'style="display:block;"' : ""}
      >

      <button
        class="deleteBtn"
        data-id="${task.id}"
        aria-label="Excluir tarefa"
      >
        Excluir
      </button>
    </div>
  `;

  // adiciona task na section
  const section = document.querySelectorAll("main section")[1];
  section.appendChild(div);

  // se já estiver concluída
  if (task.checked) {
    const title = div.querySelector(".taskTitle");
    setTaskTitleMarkup(title);
  }
};

/**************************************************/
/* create a new task on the screen */
const createTask = (event) => {
  event.preventDefault();

  const title = document.getElementById("title").value.trim();
  const activity = document.getElementById("activity").value.trim();
  const registre = new Date().toLocaleDateString("pt-BR");

  if (title && activity) {
    // tarefas salvas
    const tasksLocalStorage = getTasksFromLocalStorage();

    // novo id
    const id = getNewTaskId();

    // nova task
    const newTask = {
      id: id,
      title: title,
      description: activity,
      dt_insercao: registre,
      checked: false,
    };

    // salva
    const setAllTasks = [...tasksLocalStorage, newTask];
    setTasksInLocalStorage(setAllTasks);

    // limpa inputs
    clearInputs();

    // renderiza
    renderTask(newTask);

    // atualiza contador
    getCountDoneTask();
  }
};

/**************************************************/
/* update status in localStorage */
const setDoneTask = (id) => {
  const tasks = getTasksFromLocalStorage();

  const index = tasks.findIndex((task) => task.id === id);

  if (index !== -1) {
    tasks[index].checked = true;
    setTasksInLocalStorage(tasks);
  }
};

/**************************************************/
/* remove task from localStorage */
const deleteTask = (id) => {
  const tasks = getTasksFromLocalStorage();

  const updatedTasks = tasks.filter((task) => task.id !== id);

  setTasksInLocalStorage(updatedTasks);
};

/**************************************************/
/* click events */
document.addEventListener("click", (e) => {
  /******** concluir tarefa ********/
  if (e.target.classList.contains("doneBtn")) {
    const button = e.target;

    const taskActions = button.closest(".taskActions");

    const img = taskActions.querySelector(".checked");

    // esconde botão
    button.style.display = "none";

    // mostra check imediatamente
    img.style.display = "block";

    // pega título
    const taskTitleMarkup = button.closest(".task").querySelector(".taskTitle");

    // aplica estilo concluído
    setTaskTitleMarkup(taskTitleMarkup);

    // atualiza localStorage
    const id = parseInt(button.dataset.id);

    setDoneTask(id);

    // atualiza contador
    getCountDoneTask();
  }

  /******** excluir tarefa ********/
  if (e.target.classList.contains("deleteBtn")) {
    const button = e.target;

    const id = parseInt(button.dataset.id);

    // remove localStorage
    deleteTask(id);

    // remove HTML
    button.closest(".task").remove();

    // atualiza contador
    getCountDoneTask();
  }
});

/**************************************************/
/* function to markup the title tasks done */
const setTaskTitleMarkup = (taskTitleElement) => {
  taskTitleElement.style.textDecoration = "line-through";
  taskTitleElement.style.color = "#8F98A8";
};

/**************************************************/
/* function to count tasks done */
const getCountDoneTask = () => {
  const p = document.getElementById("footerCount");
  const tasks = getTasksFromLocalStorage();
  const doneTasks = tasks.filter((t) => t.checked).length;
  const totalTasks = tasks.length;

  p.textContent = `${totalTasks}/${doneTasks} tarefas concluídas`;
};

/**************************************************/
window.onload = () => {
  // inicia localStorage
  if (getTasksFromLocalStorage().length === 0) {
    setTasksInLocalStorage(tasks_fixed);
  }

  // submit form
  const form = document.querySelector("form");

  form.addEventListener("submit", createTask);

  // renderiza tasks
  const tasks = getTasksFromLocalStorage();

  tasks.forEach((task) => {
    renderTask(task);
  });

  // atualiza contador
  getCountDoneTask();
};
