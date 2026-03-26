// TEST ACCOUNTS
const users = [
  { username: "owner", password: "owner123", role: "Owner" },
  { username: "admin", password: "admin123", role: "Admin" },
  { username: "fto", password: "fto123", role: "FTO" }
];

let currentUser = null;

// TAB SYSTEM
function openTab(tabName) {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.add("hidden");
  });

  document.getElementById(tabName).classList.remove("hidden");
}

// REQUIRE LOGIN ONLY FOR MANAGER
function requireManager() {
  if (currentUser && (currentUser.role === "Owner" || currentUser.role === "Admin")) {
    openTab("managerPanel");
  } else {
    document.getElementById("loginModal").classList.remove("hidden");
  }
}

// LOGIN FUNCTION
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const error = document.getElementById("error");

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    currentUser = user;
    error.textContent = "";

    document.getElementById("loginModal").classList.add("hidden");

    openTab("managerPanel");
  } else {
    error.textContent = "Invalid login";
  }
}

// CLOSE LOGIN
function closeLogin() {
  document.getElementById("loginModal").classList.add("hidden");
}

// LOGOUT
function logout() {
  currentUser = null;
  location.reload();
}

// ENTER KEY SUPPORT
document.addEventListener("keydown", function(e) {
  if (e.key === "Enter" && !document.getElementById("loginModal").classList.contains("hidden")) {
    login();
  }
});