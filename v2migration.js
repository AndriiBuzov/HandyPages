// Once the message has been posted from the service worker, checks are made to
// confirm the message type and target before proceeding. This is so that the
// module can easily be adapted into existing workflows where secondary uses for
// the document (or alternate offscreen documents) might be implemented.

// Registering this listener when the script is first executed ensures that the
// offscreen document will be able to receive messages when the promise returned
// by `offscreen.createDocument()` resolves.
chrome.runtime.onMessage.addListener(handleMessages);

// This function performs basic filtering and error checking on messages before
// dispatching the
// message to a more specific message handler.
async function handleMessages(message, sender, sendResponse) {
    // Return early if this message isn't meant for the offscreen document.
    if (message.target !== 'v2migration-doc') {
        return;
    }
    // Dispatch the message to an appropriate handler.
    switch (message.type) {
        case 'get-v2-properties':
            getV2Properties().then((response) => {
                sendResponse({options: response})
            });
            break;
        case 'clear-v2-properties':
            clearV2Properties().then((result) => {
                sendResponse({optionsCleared: result});
                window.close();
            });
            break;
        default:
            console.warn(`Unexpected message type received: '${message.type}'.`);
            sendResponse({options: null});
            window.close();
    }
}


async function getV2Properties() {
    if (localStorage["options"] == null) {
        return null;
    }
    const v2Options = $.secureEvalJSON(localStorage["options"]);
    return v2Options;
}

async function clearV2Properties() {
    localStorage.removeItem("options");
    return true;
}