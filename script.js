let currentUser = null;

// LOGIN
async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const error = document.getElementById("error");

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (data.success) {
    currentUser = { username, role: data.role };
    document.getElementById("loginModal").classList.add("hidden");
    openTab("managerPanel");
  } else {
    error.textContent = "Invalid login";
  }
}

// REQUIRE MANAGER
function requireManager() {
  if (!currentUser) {
    document.getElementById("loginModal").classList.remove("hidden");
    return;
  }

  if (currentUser.role === "Owner" || currentUser.role === "Admin") {
    openTab("managerPanel");
  } else {
    alert("Access denied");
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

// TABS
function openTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
  document.getElementById(tab).classList.remove("hidden");
}

// ENTER KEY
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") login();
});

// PARTICLES
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

for (let i = 0; i < 80; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5),
    vy: (Math.random() - 0.5)
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = "gold";
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

animate();