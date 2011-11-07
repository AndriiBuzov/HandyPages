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

function closePopup()
{
	window.close();
}

function buildButton(title, link)
{
    var btn = $("<div>" + title + "</div>").addClass("navbtn").click(
        function()
        {
            navigate(getCurrentURL() + link, true);
        }
    ).button();
    return btn;
}

function init()
{
    var links = linksToArray(readProperty("pagesList",getDefaultLinks()));
    var maxWidth = 0;
    var wrapTitles = readProperty("wrapTitles","no");
    for(var i = 0; i < links.length; i++)
    {
        var btn = buildButton(links[i][0], links[i][1]);
        $("#links").append(btn);
        if ( wrapTitles === "no" ) {
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
    var ctrlBtnPos = readProperty("ctrlBtnPos","bottom");
    if (ctrlBtnPos === "top") {
        $("#links").before($("#ctrlPanel"));
    }
    //hack for prevent blinking when control buttons shown on the top
    $("body").height($("body").height());
}