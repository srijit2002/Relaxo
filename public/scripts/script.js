const updateTime = () => {
  const clockDisplay = document.querySelector(".clock__display");
  let hour = new Date().getHours();
  let minute = new Date().getMinutes();
  clockDisplay.innerText = `${hour < 10 ? "0" + hour : hour}:${
    minute < 10 ? "0" + minute : minute
  }`;
};

const setWatch = () => {
  updateTime();
  setInterval(() => {
    updateTime();
  }, 60000);
};
setWatch();

const fetchQuate = async () => {
  try {
    const prev = localStorage.getItem("relaxo-quate");
    if (prev) {
      return JSON.parse(prev);
    }
    const response = await fetch("https://type.fit/api/quotes");
    const data = await response.json();
    localStorage.setItem("relaxo-quate", JSON.stringify(data.slice(0, 100)));
    return data;
  } catch (error) {
    console.log(error);
  }
};

const setQuate = async () => {
  const quates = await fetchQuate();
  const { text, author } = quates[Math.floor(99 * Math.random())];
  document.getElementById("quate").innerHTML = `${text}<sub>-${
    author || "someone"
  }</sub>`;
};
setQuate();

const getLocalStorage = (key) => {
  let prev = localStorage.getItem(key);
  if (!prev) prev = [];
  else prev = JSON.parse(prev);
  return prev;
};
const removeTask = (text) => {
  const prevTasks = getLocalStorage("relaxo-tasks");
  const value = prevTasks.filter((prevTask) => prevTask !== text);
  localStorage.setItem("relaxo-tasks", JSON.stringify(value));
};
const updateTask = (e) => {
  const parent = e.target.parentNode;
  if (!parent.classList.contains("done")) {
    parent.classList.add("done");
    removeTask(parent.children[0].innerText);
  }
  else{
    parent.classList.remove("done");
    addTask(parent.children[0].innerText);
  }
};
const renderTasks = () => {
  const taskPanel = document.getElementById("taskContainer");
  taskPanel.textContent = "";
  const tasks = getLocalStorage("relaxo-tasks");
  tasks.forEach((task) => {
    const singleTask = document.createElement("div");
    singleTask.classList.add("task__single");
    const taskText = document.createElement("h3");
    taskText.classList.add("task__test");
    taskText.innerText = task;
    singleTask.appendChild(taskText);
    const input = document.createElement("input");
    input.type = "checkbox";
    input.classList.add("task__checkbox");
    singleTask.appendChild(input);
    taskPanel.appendChild(singleTask);
  });
  document.querySelectorAll(".task__checkbox").forEach((task) => {
    task.addEventListener("click", (e) => {
      updateTask(e);
    });
  });
  
};
const addTask = (text) => {
  if (text.length > 0) {
    const newTask = [text];
    setLocalStorage("relaxo-tasks", newTask);
    document.getElementById("taskText").value = "";
    renderTasks();
  }
};

const setLocalStorage = (key, value) => {
  const prev = getLocalStorage(key);
  const mod = JSON.stringify([...value, ...prev]);
  localStorage.setItem(key, mod);
};

document.getElementById("addButton").addEventListener("click", () => {
  const text = document.getElementById("taskText").value;
  addTask(text);
});
renderTasks();


document.querySelectorAll(".task__checkbox").forEach((task) => {
  task.addEventListener("click", (e) => {
    updateTask(e);
  });
});
