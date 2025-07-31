// DARK MODE
const darkModeToggle = document.getElementById("darkModeToggle");
darkModeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
});

window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
  }

  const page = document.body.getAttribute("data-page");

  if (page === "index") initIndexPage();
  else if (page === "details") initDetailsPage();
});

// ANASAYFA (index.html) FONKSİYONLARI
function initIndexPage() {
  const taskList = document.getElementById("taskList");
  const taskInput = document.getElementById("taskInput");
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const form = document.getElementById("taskForm");

  function loadTasks(filter = "") {
    taskList.innerHTML = "";
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const filteredTasks = tasks.filter((task) =>
      task.name.toLowerCase().includes(filter.toLowerCase())
    );

    filteredTasks.forEach((task, i) => {
      const li = document.createElement("li");
      li.className = task.completed ? "completed" : "";

      li.innerHTML = `
        <span>${task.name}</span>
        <div>
          <button onclick="toggleComplete(${i})">${task.completed ? "Geri Al" : "Tamamla"}</button>
          <button onclick="goToDetails(${i})">Detaylar</button>
          <button onclick="deleteTask(${i})">Sil</button>
        </div>
      `;
      taskList.appendChild(li);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = taskInput.value.trim();
    if (!name) return;

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ name, completed: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    taskInput.value = "";
    loadTasks(searchInput.value);
  });

  searchButton.addEventListener("click", () => {
    loadTasks(searchInput.value);
  });

  window.toggleComplete = function (i) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks[i].completed = !tasks[i].completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks(searchInput.value);
  };

  window.goToDetails = function (i) {
    window.location.href = `details.html?task=${i}`;
  };

  window.deleteTask = function (i) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.splice(i, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks(searchInput.value);
  };

  loadTasks();
}

// DETAY SAYFASI (details.html) FONKSİYONLARI
function initDetailsPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const index = urlParams.get("task");

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const task = tasks[index];
  if (!task) return;

  document.getElementById("taskTitle").innerText = task.name;

  const form = document.getElementById("detailsForm");

  if (task.details) {
    form.purpose.value = task.details.purpose || "";
    form.person.value = task.details.person || "";
    form.date.value = task.details.date || "";
    form.status.value = task.details.status || "";
    form.progress.value = task.details.progress || "";
    if (task.details.image) {
      const img = document.getElementById("imagePreview");
      img.src = task.details.image;
      img.style.display = "block";
    }
  }

  form.image.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      document.getElementById("imagePreview").src = reader.result;
      document.getElementById("imagePreview").style.display = "block";
    };
    reader.readAsDataURL(file);
  });

  document.getElementById("saveBtn").addEventListener("click", () => {
    const updated = {
      purpose: form.purpose.value,
      person: form.person.value,
      date: form.date.value,
      status: form.status.value,
      progress: form.progress.value,
      image: document.getElementById("imagePreview").src || ""
    };
    task.details = updated;
    tasks[index] = task;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    alert("Bilgiler kaydedildi.");
  });

  document.getElementById("goBackBtn").addEventListener("click", () => {
    window.location.href = "index.html";
  });
}
