let isLogin = true;

// ================= TOGGLE LOGIN/SIGNUP =================

function toggleForm() {
  isLogin = !isLogin;
  document.getElementById("formTitle").innerText = isLogin ? "Login" : "Signup";
  document.getElementById("toggleForm").innerHTML = isLogin
    ? `Don't have an account? <span onclick="toggleForm()">Signup</span>`
    : `Already have an account? <span onclick="toggleForm()">Login</span>`;
}

// ================= AUTH =================

document.getElementById("authForm")?.addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  if (!username || username.length < 3) {
    alert("Username must be at least 3 characters long");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters long");
    return;
  }

  try {
    const url = `/${role}/${isLogin ? "login" : "signup"}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    alert(data.message);

    // Save user session
    localStorage.setItem("username", username);

    if (role === "admin" && isLogin) {
      window.location.href = "admindashboard.html";
    } else if (role === "user" && isLogin) {
      window.location.href = "index.html";
    }

  } catch (err) {
    alert(err.message);
  }
});

// ================= PASSWORD RESET =================

function showForgotPasswordForm() {
  document.getElementById("authForm").style.display = "none";
  document.getElementById("forgotPasswordForm").style.display = "block";
  document.getElementById("formTitle").style.display = "none";
}

function hideForgotPasswordForm() {
  document.getElementById("forgotPasswordForm").style.display = "none";
  document.getElementById("authForm").style.display = "block";
  document.getElementById("formTitle").style.display = "block";
}

async function resetPassword() {
  const username = document.getElementById("forgotUsername").value.trim();
  const newPassword = document.getElementById("newPassword").value.trim();

  if (!username) {
    alert("Username is required");
    return;
  }

  if (newPassword.length < 6) {
    alert("Password must be at least 6 characters long");
    return;
  }

  try {
    const response = await fetch("/user/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, newPassword })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    alert(data.message);
    hideForgotPasswordForm();

  } catch (err) {
    alert(err.message);
  }
}

// ================= ENROLL =================

async function enrollCourse(courseName) {
  const username = localStorage.getItem("username");

  if (!username) {
    alert("Please login first.");
    window.location.href = "auth.html";
    return;
  }

  try {
    const response = await fetch("/user/enroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, courseName })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    alert(data.message);

    const page = coursePlaylistMap?.[courseName];
    if (page) window.location.href = page;

  } catch (err) {
    alert(err.message);
  }
}

// ================= FETCH ENROLLMENTS =================

async function fetchEnrollments() {
  const username = localStorage.getItem("username");
  if (!username) return;

  try {
    const res = await fetch(`/user/enrollments/${username}`);
    const data = await res.json();

    if (data.courses) {
      renderEnrolledCourses(data.courses);
    }

  } catch (err) {
    console.log("Failed to fetch enrollments");
  }
}

// ================= DISPLAY COURSES =================

function renderEnrolledCourses(courses) {
  const container = document.getElementById("enrolledCourses");
  if (!container) return;

  container.innerHTML = "";

  if (courses.length === 0) {
    container.innerHTML = "<p>No enrolled courses yet.</p>";
    return;
  }

  courses.forEach(course => {
    const div = document.createElement("div");
    div.className = "course-item";

    div.innerHTML = `
      <span>${course}</span>
      <button onclick="unenrollCourse('${course}')">Remove</button>
    `;

    container.appendChild(div);
  });
}

// ================= REMOVE COURSE =================

async function unenrollCourse(courseName) {
  const username = localStorage.getItem("username");

  if (!confirm(`Remove ${courseName}?`)) return;

  try {
    const response = await fetch(
      `/user/enrollments/${username}/${courseName}`,
      { method: "DELETE" }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    alert(data.message);

    fetchEnrollments();

  } catch (err) {
    alert(err.message);
  }
}

// ================= AUTO LOAD =================

document.addEventListener("DOMContentLoaded", () => {
  fetchEnrollments();
});
