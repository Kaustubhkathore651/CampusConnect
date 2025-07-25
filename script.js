function setupUserIcon() {
  const isLoggedIn = localStorage.getItem("loggedIn");
  const userEmail = localStorage.getItem("user");
  const userIcon = document.getElementById("user-icon");

  if (isLoggedIn && userEmail && userIcon) {
    const firstLetter = userEmail.charAt(0).toUpperCase();
    userIcon.innerHTML = `
      <div class="user-avatar" onclick="toggleUserMenu()">${firstLetter}</div>
      <div id="user-dropdown" class="user-dropdown">
        <div onclick="logout()">Sign out</div>
        <div onclick="window.location.href='login.html'">Add account</div>
      </div>
    `;
    userIcon.style.display = "flex";
  }
}

function toggleUserMenu() {
  const dropdown = document.getElementById("user-dropdown");
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

function logout() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

function handleCreateEvent() {
  const form = document.getElementById("create-event-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const event = {
        name: document.getElementById("eventName").value,
        date: document.getElementById("eventDate").value,
        description: document.getElementById("description").value,
        seats: document.getElementById("seats").value,
      };

      const events = JSON.parse(localStorage.getItem("events")) || [];
      events.push(event);
      localStorage.setItem("events", JSON.stringify(events));

      alert("Event Created!");
      window.location.href = "index.html";
    });
  }
}

function loadEvents() {
  const list = document.getElementById("event-list");
  if (!list) return;

  const events = JSON.parse(localStorage.getItem("events")) || [];
  list.innerHTML = "";

  if (events.length === 0) {
    list.innerHTML = "<p>No events yet.</p>";
  } else {
    events.forEach((event, idx) => {
      const div = document.createElement("div");
      div.className = "event-box scroll-animate";
      div.innerHTML = `
        <h3>${event.name}</h3>
        <p>${event.description}</p>
        <small>Date: ${event.date} | Seats: ${event.seats}</small><br>
        <button onclick="registerEvent(${idx})">Register</button>
      `;
      list.appendChild(div);
    });
  }
}

function registerEvent(idx) {
  const events = JSON.parse(localStorage.getItem("events")) || [];
  const registered = JSON.parse(localStorage.getItem("registeredEvents")) || [];

  registered.push(events[idx]);
  localStorage.setItem("registeredEvents", JSON.stringify(registered));

  alert("Registered for event!");
}

function loadMyEvents() {
  const container = document.getElementById("event-list");
  if (!container) return;

  const reg = JSON.parse(localStorage.getItem("registeredEvents")) || [];
  container.innerHTML = "";

  reg.forEach(event => {
    const div = document.createElement("div");
    div.className = "ticket scroll-animate";
    div.innerHTML = `
      <h3>${event.name}</h3>
      <p>${event.description}</p>
      <small>Date: ${event.date}</small><br>
      <strong>Ticket Confirmed ✔</strong>
    `;
    container.appendChild(div);
  });
}

function handleScrollAnimation() {
  const scrollEls = document.querySelectorAll(".scroll-animate");
  scrollEls.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      el.classList.add("show");
    }
  });
}

// Enforce login for restricted pages
function enforceLoginProtection() {
  const path = window.location.pathname;
  const protectedPages = ["/index.html", "/my-events.html", "/create-event.html"];
  const isLoggedIn = localStorage.getItem("loggedIn");
  if (!isLoggedIn && protectedPages.includes(path)) {
    window.location.href = "login.html";
  }
}

// Hamburger menu toggle
function toggleMobileMenu() {
  const nav = document.querySelector(".nav-links");
  nav.classList.toggle("open");
}

// Load functions on page ready
document.addEventListener("DOMContentLoaded", () => {
  enforceLoginProtection();
  setupUserIcon();
  handleCreateEvent();
  loadEvents();
  loadMyEvents();
  handleScrollAnimation();
});

window.addEventListener("scroll", handleScrollAnimation);
