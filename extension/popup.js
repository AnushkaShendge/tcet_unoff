document.addEventListener('DOMContentLoaded', () => {
  const outputElement = document.getElementById('output');
  
  // Add loading message
  outputElement.innerHTML = "Loading results...";
  
  // Request latest result from background script
  chrome.runtime.sendMessage({ action: "getLatestResult" }, (response) => {
      console.log("Received response:", response); // Debug log
      
      if (response && response.result) {
          try {
              // Extract the JSON string from the result
              const jsonMatch = response.result.match(/Action: (.*)/s);
              if (jsonMatch) {
                  // Parse the JSON string and format it nicely
                  const jsonData = JSON.parse(jsonMatch[1]);
                  const formattedOutput = JSON.stringify(jsonData, null, 2);
                  outputElement.innerHTML = formattedOutput;
              } else {
                  outputElement.innerHTML = response.result;
              }
          } catch (error) {
              console.error("Error parsing result:", error);
              outputElement.innerHTML = response.result;
          }
      } else if (response && response.error) {
          outputElement.innerHTML = `Error: ${response.error}`;
          outputElement.style.color = 'red';
      } else {
          outputElement.innerHTML = "No results yet. Select text and use right-click menu to process.";
      }
  });
});

// Add this to check if popup.js is loading
console.log("Popup script loaded!");