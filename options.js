function saveProperty(property, value)
{
	localStorage[property] = value;
}

function saveOptions()
{
    // saving links
    var links = new Array();
    var linksCount = 0;
    var title, url; 
    var rows = $(".linkrow");
    rows.each( function() {
        title = getTitleFromRow($(this));
        url = getUrlFromRow($(this));
        if (title != "" && url != "") 
        {
            links[linksCount] = new Array();
            links[linksCount][0] = title;
            links[linksCount][1] = url;
            linksCount++;
        }
    });
    
    saveProperty("pagesList", linksToString(links));
    
    //saving control buttons position
    var ctrlBtnPos = $("#ctrlBtnPos").attr("checked") === "checked" ? "top" : "bottom";
    saveProperty("ctrlBtnPos", ctrlBtnPos);
    
    //saving wrap titles parameter
    var wrapTitles = $("#wrapTitles").attr("checked") === "checked" ? "yes" : "no";
    saveProperty("wrapTitles", wrapTitles);
    
    $("#status").show();
    setTimeout(function() {
        $("#status").hide();
    }, 1000);
}

function linksToString(links)
{
    var res = "";
    for(var i = 0; i < links.length; i++)
    {
        res = res + ";" + encodeURIComponent(links[i][0]) + "," + encodeURIComponent(links[i][1])
    }
    return res;
}

function buildTableRow(title, url)
{
    var row = $("<tr />").addClass("linkrow")
        .append(
            $("<td />").append(
                $("<input />").attr("type","text").attr("size",30).attr("id","title").attr("value",title)
            )
        )
        .append(
            $("<td />").append(
                $("<input />").attr("type","text").attr("size",50).attr("id","url").attr("value",url)
            )
        )
        .append(
            $("<td />").append(
                $("<button>x</button>").attr("title","Remove row").click(function() {
                    $(this).parents('tr.linkrow:first').remove();
                })
                .button({
                    icons: {
                        primary: "ui-icon-minus"
                    },
                    text: false
                })
            )
        )
        .append(
            $("<td />").append(
                $("<button>x</button>").attr("title","Move up").click(function() {
                    var rowToMove = $(this).parents('tr.linkrow:first');
                    var prev = rowToMove.prev('tr.linkrow')
                    if (prev.length == 1) 
                    { 
                        swapRows(rowToMove, prev);
                    }
                })
                .button({
                    icons: {
                        primary: "ui-icon-triangle-1-n"
                    },
                    text: false
                })
            )
        )
        .append(
            $("<td />").append(
                $("<button>x</button>").attr("title","Move down").click(function() {
                    var rowToMove = $(this).parents('tr.linkrow:first');
                    var next = rowToMove.next('tr.linkrow')
                    if (next.length == 1) 
                    { 
                        swapRows(rowToMove, next); 
                    }
                })
                .button({
                    icons: {
                        primary: "ui-icon-triangle-1-s"
                    },
                    text: false
                })
            )
        );
    return row;
}

function swapRows(this_row, other_row)
{  
    var tmp = getTitleFromRow(this_row);
    setTitleForRow(this_row, getTitleFromRow(other_row));
    setTitleForRow(other_row, tmp);
    
    tmp = getUrlFromRow(this_row);
    setUrlForRow(this_row, getUrlFromRow(other_row));
    setUrlForRow(other_row, tmp);
}

function getUrlFromRow(row)
{
    return row.find('input[id^="url"]:first').val().trim();
}

function getTitleFromRow(row)
{
    return row.find('input[id^="title"]:first').val().trim();
}

function setUrlForRow(row, url)
{
    row.find('input[id^="url"]:first').val(url);
}

function setTitleForRow(row, title)
{
    row.find('input[id^="title"]:first').val(title);
}

function addTableRow(title, url)
{
    $("#linksTable").append(buildTableRow(title, url));
    // style text inputs
    $(".linkrow").each( function() {
        $(this).find('input[id^="title"]:first').jNiceTextInputInit();
        $(this).find('input[id^="url"]:first').jNiceTextInputInit();
    });
}

function addEmptyTableRow()
{
    addTableRow("","");
}

function loadOptions()
{
    var links = linksToArray(readProperty("pagesList",getDefaultLinks()));
    for(var i = 0; i < links.length; i++)
    {
        addTableRow(links[i][0], links[i][1]);
    }
    
    $("button").button();
    
    var wrapTitles = readProperty("wrapTitles","no");
    if (wrapTitles === "yes") {
        $("#wrapTitles").attr("checked", "checked");
    }
    
    var ctrlBtnPos = readProperty("ctrlBtnPos","bottom");
    if (ctrlBtnPos === "top") {
        $("#ctrlBtnPos").attr("checked", "checked");
    }
}

