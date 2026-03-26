async function login() {
  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  });

  if (res.ok) {
    document.getElementById("login").style.display = "none";
    document.getElementById("app").classList.remove("hidden");
  } else {
    alert("Login failed");
  }
}

/* TAB SYSTEM */
function showTab(tabId) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");

  if (tabId === "roster") loadRoster();
  if (tabId === "apps") loadApps();
}

/* ROSTER */
async function loadRoster() {
  const res = await fetch("/roster");
  const data = await res.json();

  rosterList.innerHTML = data.map(p => `
    <div class="card">
      ${p.name} | ${p.callsign} | ${p.dept}
    </div>
  `).join("");
}

/* ADD MEMBER */
async function addMember() {
  await fetch("/roster/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name.value,
      callsign: callsign.value,
      dept: dept.value
    })
  });

  loadRoster();
}

/* APPLICATIONS */
async function loadApps() {
  const res = await fetch("/applications");
  const data = await res.json();

  appList.innerHTML = data.map(a => `
    <div class="card">
      ${a.name} | ${a.dept} | ${a.status}
    </div>
  `).join("");
}