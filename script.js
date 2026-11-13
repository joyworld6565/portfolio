"use strict";

/* ---------- Mobile navigation ---------- */
const toggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("nav");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});

/* ---------- Academic Planner ---------- */
const taskForm = document.getElementById("task-form");
if (taskForm) {
  const input = document.getElementById("task-input");
  const list = document.getElementById("task-list");
  const errorBox = document.getElementById("task-error");
  const countBox = document.getElementById("task-count");
  let tasks = []; // array of {id, text, done}
  try { tasks = JSON.parse(localStorage.getItem("tasks")) || []; } catch (e) { tasks = []; }

  const save = () => { try { localStorage.setItem("tasks", JSON.stringify(tasks)); } catch (e) {} };

  function render() {
    list.innerHTML = "";
    if (tasks.length === 0) {
      list.innerHTML = '<li class="empty">No tasks yet. Add your first one above.</li>';
    }
    tasks.forEach(task => {
      const li = document.createElement("li");
      li.className = "task" + (task.done ? " done" : "");
      const box = document.createElement("input");
      box.type = "checkbox";
      box.checked = task.done;
      box.setAttribute("aria-label", "Mark complete: " + task.text);
      box.addEventListener("change", () => toggleTask(task.id));
      const label = document.createElement("span");
      label.textContent = task.text;
      const del = document.createElement("button");
      del.type = "button";
      del.textContent = "Delete";
      del.addEventListener("click", () => deleteTask(task.id));
      li.append(box, label, del);
      list.appendChild(li);
    });
    const left = tasks.filter(t => !t.done).length;
    countBox.textContent = tasks.length ? `${left} of ${tasks.length} tasks left` : "";
  }

  function addTask(text) { tasks.push({ id: Date.now(), text, done: false }); save(); render(); }
  function toggleTask(id) { tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t); save(); render(); }
  function deleteTask(id) { tasks = tasks.filter(t => t.id !== id); save(); render(); }

  taskForm.addEventListener("submit", e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) { errorBox.textContent = "Type a task before adding it."; return; }
    errorBox.textContent = "";
    addTask(text);
    input.value = "";
    input.focus();
  });
  render();
}

/* ---------- Contact form validation ---------- */
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  const fields = ["name", "email", "phone", "message"];
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const digitsOnly = /^\d+$/;

  function setError(id, msg) {
    document.getElementById(id + "-error").textContent = msg;
    document.getElementById(id).classList.toggle("invalid", Boolean(msg));
  }

  function validateField(id) {
    const value = document.getElementById(id).value.trim();
    let msg = "";
    if (value === "") msg = "This field cannot be empty.";
    else if (id === "email" && !emailPattern.test(value)) msg = "Enter a valid email, like name@example.com.";
    else if (id === "phone" && !digitsOnly.test(value)) msg = "Use digits only, with no spaces, + or dashes.";
    setError(id, msg);
    return msg === "";
  }

  fields.forEach(id => document.getElementById(id).addEventListener("blur", () => validateField(id)));

  contactForm.addEventListener("submit", e => {
    e.preventDefault();
    const success = document.getElementById("form-success");
    const results = fields.map(validateField); // validate all so every error shows
    if (results.every(Boolean)) {
      success.textContent = "Thanks, " + document.getElementById("name").value.trim() + "! Your message has been sent.";
      contactForm.reset();
    } else {
      success.textContent = "";
    }
  });
}
