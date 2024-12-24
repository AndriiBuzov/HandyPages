async function getOptions(defValue) {
    const storedVal = await chrome.storage.local.get(["options"]);
    if (storedVal == null || storedVal.options === undefined || storedVal.options.pagesList === undefined) {
        return defValue;
    }
    return storedVal.options;
}

//TODO migration of stored options from V2 to V3

function saveOptionsToStore(value)
{
    chrome.storage.local.set({ options: value }).then(() => {
        // console.log("Value is set for ", value);
    });
}

function getDefaultOptions() {
    return {
        pagesList: [{
            url: "folder1/page1.html", title: "Page 1"
        }, {
            url: "/another_folder/page2.php?act=show", title: "Page 2"
        }, {url: "/page.html", title: "Page 3"}], wrapTitles: "no"
    };
}

function closeWindow() {
    window.close();
}

function secureParseJSON(jsonString) {
    try {
        const parsed = JSON.parse(jsonString);
        if (typeof parsed === 'object' && parsed !== null) {
            return parsed;
        }
    } catch (error) {
        console.error('Invalid JSON string', error);
    }
    return {};
}

// let creating; // A global promise to avoid concurrency issues
// async function setupOffscreenDocument(path) {
//     // Check all windows controlled by the service worker to see if one
//     // of them is the offscreen document with the given path
//     const offscreenUrl = chrome.runtime.getURL(path);
//     const existingContexts = await chrome.runtime.getContexts({
//         contextTypes: ['OFFSCREEN_DOCUMENT'], documentUrls: [offscreenUrl]
//     });
//
//     if (existingContexts.length > 0) {
//         return;
//     }
//
//     // create offscreen document
//     if (creating) {
//         await creating;
//     } else {
//         creating = chrome.offscreen.createDocument({
//             url: path, reasons: [chrome.offscreen.Reason.CLIPBOARD], justification: 'Paste content from clipboard',
//         });
//         await creating;
//         creating = null;
//     }
// }

// async function getFromClipboard() {
//     await setupOffscreenDocument('off-screen.html_tmp');
//     const result = await chrome.runtime.sendMessage({
//         type: 'paste-from-clipboard', target: 'offscreen-doc'
//     });
//     //TODO: remove
//     console.log("got from clipboard:", result);
//     return result;
// }


