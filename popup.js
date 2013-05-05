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

/*
* Macroses are wrapped with ! and $ signs: '$!macro!$'
* */
function replaceMacroses(sourceUrl)
{
    if(window.hpUrl == undefined)
    {
        return sourceUrl;
    }
    return sourceUrl.replace(/\$\!(.*?)\!\$/g,function(str,p1,s){
        var r = '';
        var macro = p1.replace(/\{Encoded\}/g,'');
        var isEncodeNeeded = p1 != macro;
        if(macro === '{ClipBoard}')
        {
            var bg = chrome.extension.getBackgroundPage();
            r = bg != undefined ? bg.paste() : '';
        } else if(macro === '{CurrentUrl}')
        {
            r = window.hpUrl.attr('source');
        } else if(macro === '{QueryString}')
        {
            r = window.hpUrl.attr('query');
        } else if(macro === '{Relative}')
        {
            r = window.hpUrl.attr('relative');
        } else
        {
           r =  window.hpUrl.param(macro);
        }
        return (r === undefined ? '' : (isEncodeNeeded ? encodeURIComponent(r):r));
    });
}

function buildButton(title, link)
{
    var url = (link[0] === '/') ? link : '/' + link;
    return $("<div>" + title + "</div>").css('margin-right','10px').css('min-width','80px').addClass("navbtn").mouseup(
        function(event)
        {
            var isNewTab = false;
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
            navigate(getCurrentURL() + replaceMacroses(url), true, isNewTab);
            closeWindow();
        }
    ).button();
}

function init()
{
    var opt = $.secureEvalJSON(readProperty("options",getDefaultOptions()));
    var maxWidth = 0;
    $('#links').slimScroll({
        position: 'right',
        height: '250px',
        railVisible: true,
        alwaysVisible: true,
        distance: '0px'
    });
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
}

// ----------------------------------- window inline script -----------------------------------------------
window.addEventListener("load", windowLoaded, false);
function windowLoaded() {
    chrome.tabs.getSelected(null, function(tab) {
        window.hpUrl = $.url(tab.url);
        window.hpCurrentIndex = tab.index;
        window.hpCurrentID = tab.id;
        console.log(tab.id);
        console.log(tab.url);
        console.log(tab.index);
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