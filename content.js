console.log("Loaded script");
const id_inp = document.getElementById("username");
const password_inp = document.getElementById("password");
if (id_inp && password_inp) {
  // Get stored credentials from Chrome's storage
  chrome.storage.local.get(["wifi_id", "wifi_password"], (result) => {
    if (chrome.runtime.lastError) {
      console.error("Storage error:", chrome.runtime.lastError);
      return;
    }
    if (result.wifi_id && result.wifi_password) {
      id_inp.value = result.wifi_id;
      password_inp.value = result.wifi_password;

      // console.log("Auto-filled Username:", id_inp.value);
      // console.log("Auto-filled Password:", password_inp.value);
    } else {
      console.log("No saved Wi-Fi credentials found in storage.");
    }
  });
} else {
  console.log("Input fields not found.");
}
