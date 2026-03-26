async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  if (res.ok) {
    document.getElementById("login").style.display = "none";
    document.getElementById("panel").style.display = "block";
  } else {
    alert("Login failed");
  }
}

async function loadRoster() {
  const res = await fetch("/roster");
  const data = await res.json();

  document.getElementById("roster").innerHTML =
    data.map(p => `<div>${p.name} | ${p.callsign} | ${p.dept}</div>`).join("");
}

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