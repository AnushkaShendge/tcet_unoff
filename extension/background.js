// Store the latest result to share with popup
let latestResult = null;

// Create context menu item when extension is installed
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "processSelectedText",
        title: "Process Selected Text",
        contexts: ["selection"]  // Only show when text is selected
    });
});

// Helper function to extract JSON from error message
function extractJsonFromError(text) {
    const match = text.match(/Action:\s*```json\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
        try {
            return JSON.parse(match[1]);
        } catch (e) {
            return null;
        }
    }
    return null;
}

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "processSelectedText") {
        fetch('http://localhost:5002/process_task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task: info.selectionText })
        })
        .then(async response => {
            const responseText = await response.text();
            
            if (!response.ok) {
                const extractedJson = extractJsonFromError(responseText);
                if (extractedJson) {
                    return extractedJson;
                }
                throw new Error(`Server Error (${response.status}): ${responseText}`);
            }

            try {
                return JSON.parse(responseText);
            } catch (e) {
                const extractedJson = extractJsonFromError(responseText);
                if (extractedJson) {
                    return extractedJson;
                }
                throw e;
            }
        })
        .then(data => {
            console.log('Success:', data);
            // Store the result
            latestResult = data;
            
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon48.png',
                title: 'Task Processed Successfully',
                message: 'Click the extension icon to view results'
            });
        })
        .catch(error => {
            console.error('Error:', error);
            latestResult = { error: error.message };
            
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon48.png',
                title: 'Error',
                message: error.message || 'Failed to process task. Check extension popup for details.'
            });
        });
    }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getLatestResult") {
        sendResponse(latestResult);
    }
    return true;
});
