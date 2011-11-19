function getCurrentURL()
{
    return $("#currentUrl").val();
}

function navigate(url, isSelected)
{
    chrome.tabs.create({selected: isSelected, url: url, index: getNewTabIndex()});
    return false;
}

function getNewTabIndex()
{
    return parseInt($("#currentIndex").val()) + 1;
}

function showOptions()
{
	navigate("options.html", true);
}

function buildButton(title, link)
{
    var url = (link[0] === '/') ? link : '/' + link;
    var btn = $("<div>" + title + "</div>").addClass("navbtn").click(
        function()
        {
            navigate(getCurrentURL() + url, true);
        }
    ).button();
    return btn;
}

function init()
{
    var opt = $.secureEvalJSON(readProperty("options",getDefaultOptions()));
    var maxWidth = 0;
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
    if ( opt.ctrlBtnPos === "top" ) {
        $("#links").before($("#ctrlPanel"));
    }
    //hack for prevent blinking when control buttons shown on the top
    $("body").height($("body").height());
}