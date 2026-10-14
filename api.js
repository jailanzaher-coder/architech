const API =
  location.hostname === "127.0.0.1" || location.hostname === "localhost"
    ? "http://127.0.0.1:8000"
    : "https://YOUR-BACKEND-ADDRESS";

function errMsg(data, fallback) {
  return typeof data.detail === "string" ? data.detail : fallback;
}

async function signup(full_name, email, password) {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ full_name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(errMsg(data, "Sign up failed"));
  return data;
}

async function login(email, password) {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    body: new URLSearchParams({ username: email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(errMsg(data, "Login failed"));
  localStorage.setItem("architech-token", data.access_token);
}

async function getMe() {
  const token = localStorage.getItem("architech-token");
  if (!token) return null;
  const res = await fetch(`${API}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok ? res.json() : null;
}

function logout() {
  localStorage.removeItem("architech-token");
  location.href = "login.html";

}

async function updateNav() {
  const user = await getMe();
  if (!user) return;

  document
    .querySelectorAll('.nav.right a[href="login.html"], #mobile a[href="login.html"]')
    .forEach((a) => {
      a.textContent = "Log out";
      a.href = "#";
      a.onclick = (e) => {
        e.preventDefault();
        logout();
      };
    });

  document
    .querySelectorAll('.nav.right a[href="signup.html"], #mobile a[href="signup.html"]')
    .forEach((a) => (a.style.display = "none"));
}

updateNav();