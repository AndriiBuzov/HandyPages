function saveProperty(property, value)
{
	localStorage[property] = value;
}

function saveOptions()
{
    // saving links
    var count = $(".linkrow").length;
    var links = new Array();
    var linksCount = 0;
    var title, url;
    for(var i = 0; i < count; i++)
    {
        title = $("#title" + i).val().trim();
        url = $("#url" + i).val().trim();
        if (title != "" && url != "") 
        {
            links[linksCount] = new Array();
            links[linksCount][0] = title;
            links[linksCount][1] = url;
            linksCount++;
        }
    }
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

function buildTableRow(title, url, index)
{
    var _linkrow = "linkrow" + index;
    var _title = "title" + index;
    var _url = "url" + index;
    var row = $("<tr />").addClass("linkrow").attr("id", "linkrow" + index)
        .append(
            $("<td />").append(
                $("<input />").attr("type","text").attr("size",30).attr("id","title" + index).attr("value",title)
            )
        )
        .append(
            $("<td />").append(
                $("<input />").attr("type","text").attr("size",50).attr("id","url" + index).attr("value",url)
            )
        )
        .append(
            $("<td />").append(
                $("<button>x</button>").attr("title","Remove row").click(function() {
                    removeTableRow("#linkrow" + index);
                })
                .button({
                    icons: {
                        primary: "ui-icon-minus"
                    },
                    text: false
                })
            )
        );
    return row;
}

function addTableRow(title, url)
{
    var newIndex = $(".linkrow").length;
    $("#linksTable").append(buildTableRow(title, url, newIndex));
    $("#title" + newIndex).jNiceTextInput();
    $("#url" + newIndex).jNiceTextInput();
}

function addEmptyTableRow()
{
    addTableRow("","");
}

function removeTableRow(rowID)
{
    $(rowID).remove();
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

