// TEST ACCOUNTS
const users = [
  { username: "owner", password: "owner123", role: "Owner" },
  { username: "admin", password: "admin123", role: "Admin" },
  { username: "fto", password: "fto123", role: "FTO" }
];

// LOGIN FUNCTION
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const error = document.getElementById("error");

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));

    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");

    openTab("roster");
  } else {
    error.textContent = "Invalid login";
  }
}

// ENTER KEY SUPPORT
document.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    login();
  }
});

// LOGOUT
function logout() {
  localStorage.removeItem("user");
  location.reload();
}

// TAB SWITCHING
function openTab(tabName) {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.add("hidden");
  });

  document.getElementById(tabName).classList.remove("hidden");
}

// AUTO LOGIN IF ALREADY LOGGED IN
window.onload = function() {
  const user = localStorage.getItem("user");

  if (user) {
    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
  }
};