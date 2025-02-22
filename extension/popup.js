// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "backendResponse") {
      const data = request.data;
      const outputElement = document.getElementById("output");
      outputElement.textContent = JSON.stringify(data, null, 2);
    }
  });