function getCurrentURL()
{
    return window.hpUrl.attr('protocol') + '://'
        + window.hpUrl.attr('host')
        + ((window.hpUrl.attr('port') == 0) ? "" : ":" + window.hpUrl.attr('port'));
}

function navigate(url, isSelected, isNewTab)
{
    console.log('Navigating: url=' + url + '\n tabIntex=' + '\n isNewTab=' + isNewTab);
    if(isNewTab)
    {
        chrome.tabs.create({selected: isSelected, url: url, index: window.hpCurrentIndex + 1});
    }
    else
    {
        chrome.tabs.update(window.hpCurrentID,{url: url});
    }
    return false;
}

function showOptions()
{
	navigate("options.html", true, true);
}

// Built-in macro handlers
const builtInMacroHandlers = {
    "{ClipBoard}": async () => { const res = await navigator.clipboard.readText(); return res; },
    "{CurrentUrl}": async () => window.hpUrl.attr('source'),
    "{Relative}": async () => window.hpUrl.attr('relative'),
    "{QueryString}": async () => window.hpUrl.attr('query'),
};

async function replaceMacros(inputString, macroHandlers) {
    // Create a regex pattern dynamically for all known macros and unknown ones
    const macroRegex = /\$!(.*?)!\$/g;

    // Split string into parts and find all macros
    const parts = inputString.split(macroRegex); // Includes macros as split points
    const matches = inputString.match(macroRegex) || []; // Find all macros in the input string

    // Fetch replacements for each macro
    const replacements = await Promise.all(
        matches.map(async macro => {
            const key = macro.match(/\$!(.*?)!\$/)?.[1]; // Extract macro name
            const extractedMacro = key.replace(/\{Encoded\}/g,'');
            const isEncodeNeeded = key !== extractedMacro;
            if (macroHandlers[extractedMacro]) {
                // Use the specific handler if available
                const res = await macroHandlers[extractedMacro]();
                return isEncodeNeeded ? encodeURIComponent(res):res;
            } else {
                // Assume macro as query parameter value
                const res = window.hpUrl.param(macro);
                return res === undefined ? '' : isEncodeNeeded ? encodeURIComponent(res):res;
            }
        })
    );

    // Reconstruct the string
    let result = '';
    let replacementIndex = 0;
    for (let i = 0; i < parts.length; i++) {
        if (!matches.includes(`$!${parts[i]}!$`)) { // include part in the result as is only if it is not a matched macro
            result += parts[i];
        } else if (replacementIndex < replacements.length) { // replace with corresponding macro match otherwise
            result += replacements[replacementIndex++];
        }
    }
    return result;
}

function buildButton(title, link)
{
    let url = (link[0] === '/') ? link : '/' + link;
    return $("<div>" + title + "</div>").css('margin-right','10px').css('min-width','80px').addClass("navbtn").mouseup(
        async function(event)
        {
            let isNewTab = false;
            switch (event.which) {
                case 1: // left btn
                    isNewTab = false;
                    break;
                case 3: // right btn
                    isNewTab = true;
                    event.preventDefault(); // hack to hide context menu after right-click
                    break;
                default:
            }
            const replacedUrl = await replaceMacros(url, builtInMacroHandlers)
            navigate(getCurrentURL() + replacedUrl, true, isNewTab);
            closeWindow();
        }
    ).button();
}

async function init()
{
    const opt = await getOptions(getDefaultOptions());
    var maxWidth = 0;
    var maxHeight = 550; //assuming max popup size is 600px for chrome, set div to 550 to avoid body scrollbar
    //hack for low-resolutions. assuming it makes sense if screen has less than 650 px height
    if((window.screen.availHeight - window.screenY) <= maxHeight && window.screen.availHeight <= 650)
    {
        maxHeight = Math.round((window.screen.availHeight - window.screenY) * 0.75);
    }
    $('#links').css('padding-top','3px').css('padding-bottom','3px').css('max-height', maxHeight+'px');
    for(var i = 0; i < opt.pagesList.length; i++)
    {
        var btn = buildButton(opt.pagesList[i].title, opt.pagesList[i].url);
        $("#links").append(btn);
        if ( opt.wrapTitles === "no" ) {
            $(".ui-button-text").css("white-space","nowrap");
        }
        if (maxWidth < btn.width())
        {
            maxWidth = btn.width();
        }
        $("#links").append("<br>");
    }
    $(".navbtn").each(function() {
        $(this).width(maxWidth);
    });
    $('#links').slimScroll({
        position: 'right',
        railVisible: true,
        alwaysVisible: true,
        distance: '0px'
    });
}

// ----------------------------------- window inline script -----------------------------------------------
window.addEventListener("load", windowLoaded, false);
async function windowLoaded() {
        chrome.tabs.query({ active: true, currentWindow: true },
        function(tabsArray) {
            window.hpUrl = $.url(tabsArray[0].url);
            window.hpCurrentIndex = tabsArray[0].index;
            window.hpCurrentID = tabsArray[0].id;
    });
}
document.addEventListener('DOMContentLoaded', function () {
    $(function() {
        $( "#btn_options" ).button({
            icons: {
                primary: "ui-icon-wrench"
            },
            text: false
        }).click(showOptions);
        $( "#btn_close" ).button({
            icons: {
                primary: "ui-icon-circle-close"
            },
            text: false
        }).click(closeWindow);
    });
    setTimeout(function() {
        init();
    }, 25);
});