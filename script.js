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
    login.style.display = "none";
    panel.style.display = "block";
  } else {
    alert("Login failed");
  }
}

async function loadRoster() {
  const res = await fetch("/roster");
  const data = await res.json();

  content.innerHTML = "<h2>Roster</h2>" +
    data.map(p =>
      `<div>${p.name} | ${p.callsign} | ${p.dept}</div>`
    ).join("");
}

async function loadApps() {
  const res = await fetch("/applications");
  const data = await res.json();

  content.innerHTML = "<h2>Applications</h2>" +
    data.map(a =>
      `<div>${a.name} | ${a.dept} | ${a.status}</div>`
    ).join("");
}