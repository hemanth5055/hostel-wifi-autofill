window.addEventListener("DOMContentLoaded", () => {
  // Load saved credentials
  chrome.storage.local.get(["wifi_id", "wifi_password"], (data) => {
    if (data.wifi_id) {
      document.getElementById("userId").value = data.wifi_id;
    }
    if (data.wifi_password) {
      document.getElementById("password").value = data.wifi_password;
    }
  });

  // Save button click
  document.getElementById("saveBtn").addEventListener("click", () => {
    const id = document.getElementById("userId").value;
    const password = document.getElementById("password").value;

    chrome.storage.local.set({ wifi_id: id, wifi_password: password }, () => {
      alert("Credentials saved!");
    });
  });

  // Toggle password visibility
  const togglePassword = document.getElementById("togglePassword");
  togglePassword.addEventListener("change", () => {
    const passwordInput = document.getElementById("password");
    passwordInput.type = togglePassword.checked ? "text" : "password";
  });

  // Tab switch
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.getAttribute("data-tab");

      tabButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      tabContents.forEach((content) => content.classList.add("hidden"));
      document.getElementById(tab).classList.remove("hidden");
    });
  });

  const message = document.getElementById("message");

  // Login
  document.getElementById("loginBtn").addEventListener("click", async () => {
    const username = document.getElementById("userId").value;
    const password = document.getElementById("password").value;
    const result = await handleLogin(username, password);
    if (result) {
      message.innerText = " Authenticated Successfully ✅";
    } else {
      message.innerText = "Failed to connect ❌";
    }
  });

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", async () => {
    const username = document.getElementById("userId").value;
    const result = await handleLogout(username);
    if (result) {
      message.innerText = "Logged Out Successfully  ✅";
    } else {
      message.innerText = "Failed to logout ❌";
    }
  });
});

async function handleLogin(username, password) {
  const mode = 191;
  const productType = 0;
  const a = Math.floor(Date.now() / 1000);

  const body = new URLSearchParams({
    mode: mode.toString(),
    username,
    password,
    a: a.toString(),
    producttype: productType.toString(),
  });

  try {
    const response = await fetch("https://hfw.vitap.ac.in:8090/login.xml", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    const text = await response.text();
    console.log("Login Response:", text);
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "application/xml");
    const message = xml.querySelector("message")?.textContent;
    console.log(message);
    if (message.includes("signed in")) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Login Error:", error);
    return false;
  }
}

async function handleLogout(username) {
  const mode = 193;
  const productType = 0;
  const a = Math.floor(Date.now() / 1000);

  const body = new URLSearchParams({
    mode: mode.toString(),
    username,
    a: a.toString(),
    producttype: productType.toString(),
  });
  try {
    const response = await fetch("https://hfw.vitap.ac.in:8090/logout.xml", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });
    const text = await response.text();
    console.log("Logout Response:", text);
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "application/xml");
    const message = xml.querySelector("message")?.textContent;
    if (message.includes("signed out")) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Logout Error:", error);
    return fasle;
  }
}
