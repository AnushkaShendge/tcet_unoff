// Listen for text selection
document.addEventListener("mouseup", (event) => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      // Send the selected text to the background script
      chrome.runtime.sendMessage({ action: "textSelected", text: selectedText });
    }
  });