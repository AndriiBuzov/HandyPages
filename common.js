async function getOptions(defValue) {
    const storedVal = await chrome.storage.local.get(["options"]);
    if (storedVal == null || storedVal.options === undefined || storedVal.options.pagesList === undefined) {
        const migrationResult = await convertV2Properties();
        if (migrationResult) {
            const migratedVal = await chrome.storage.local.get(["options"]);
            return migratedVal.options;
        } else {
            return defValue;
        }
    }
    return storedVal.options;
}

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
        }, {url: "/page.html", title: "Page 3"}],
        wrapTitles: "no"
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

// V2 manifest properties conversion routines via offscreen document with access to localStorage

let creating; // A global promise to avoid concurrency issues
async function setupOffscreenDocument(path) {
    // Check all windows controlled by the service worker to see if one
    // of them is the offscreen document with the given path
    const offscreenUrl = chrome.runtime.getURL(path);
    const existingContexts = await chrome.runtime.getContexts({
        contextTypes: ['OFFSCREEN_DOCUMENT'], documentUrls: [offscreenUrl]
    });

    if (existingContexts.length > 0) {
        return;
    }

    // create offscreen document
    if (creating) {
        await creating;
    } else {
        creating = chrome.offscreen.createDocument({
            url: path, reasons: [chrome.offscreen.Reason.LOCAL_STORAGE], justification: 'Move settings from localStorage to chrome.store.local for v3 manifest options migration',
        });
        await creating;
        creating = null;
    }
}

async function convertV2Properties() {
    await setupOffscreenDocument('v2migration.html');
    const extractedOptions = await chrome.runtime.sendMessage({
        type: 'get-v2-properties', target: 'v2migration-doc'
    });
    if (extractedOptions != null && extractedOptions.options != null) {
        await chrome.storage.local.set({ options: extractedOptions.options });
        await setupOffscreenDocument('v2migration.html'); // just in case it is closed
        const optionsClearResult = await chrome.runtime.sendMessage({
            type: 'clear-v2-properties', target: 'v2migration-doc'
        });
        return true;
    }
    return false;
}


