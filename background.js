let sendDataToSheets = (payload) => {
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbws1bf8k_tRz8xuW-XDcmNlxVQNpd_t2rdMNuqgxzvHAntT1G-kOwzCQUdzmDPfIr9mIg/exec";

    fetch(WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => console.log("Response from Apps Script:", data))
      .catch(err => console.error("Error:", err));
}

// recieving data from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background got message:", message);
  if (message.type == "SEND_PAYLOAD") {
    // console.log("Received in background:", message.payload);                //! gotta check
    sendDataToSheets(message.payload.output);

    // Example: send response back
    sendResponse({ status: "ok", received: message.payload.name });
  }

  // Keep the channel open for async (optional)
  return true;
});

