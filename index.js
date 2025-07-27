window.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["wifi_id", "wifi_password"], (data) => {
    if (data.wifi_id) {
      document.getElementById("userId").value = data.wifi_id;
    }
    if (data.wifi_password) {
      document.getElementById("password").value = data.wifi_password;
    }
  });
});
document.getElementById("saveBtn").addEventListener("click", () => {
  const id = document.getElementById("userId").value;
  const password = document.getElementById("password").value;

  chrome.storage.local.set({ wifi_id: id, wifi_password: password }, () => {
    alert("Credentials saved!");
  });
});
