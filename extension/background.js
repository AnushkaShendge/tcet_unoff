// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "textSelected") {
      const selectedText = request.text;
  
      // Send the selected text to the backend
      fetch("http://localhost:5002/analyze_transcript", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcript: selectedText }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Send the response back to the popup
          chrome.runtime.sendMessage({ action: "backendResponse", data: data });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  });