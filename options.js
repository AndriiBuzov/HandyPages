function saveProperty(property, value)
{
	localStorage[property] = value;
}

function getOptionsAsJSON()
{
    var links = new Array();
    var linksCount = 0;
    var title, url; 
    var rows = $(".linkrow");
    rows.each( function() {
        title = getTitleFromRow($(this));
        url = getUrlFromRow($(this));
        if (title != "" && url != "") 
        {
            links[linksCount] = { title: title, url: url };
            linksCount++;
        }
    });
    var ctrlBtnPos = $("#ctrlBtnPos").attr("checked") === "checked" ? "top" : "bottom";
    var wrapTitles = $("#wrapTitles").attr("checked") === "checked" ? "yes" : "no";
    
    var opt = {
        pagesList: links,
        ctrlBtnPos: ctrlBtnPos,
        wrapTitles: wrapTitles
    }
    return $.toJSON(opt);
}

function saveOptions()
{
    saveProperty("options", getOptionsAsJSON());
    
    $("#status").show();
    setTimeout(function() {
        $("#status").hide();
    }, 1000);
}

function buildTableRow(title, url)
{
    var row = $("<tr />").addClass("linkrow")
        .append(
            $("<td />").append(
                $("<input />").attr("type","text").attr("size",25).attr("id","title").attr("value",title).addClass("ui-corner-all").addClass("custInput")
            )
        )
        .append(
            $("<td />").append(
                $("<input />").attr("type","text").attr("size",50).attr("id","url").attr("value",url).addClass("ui-corner-all").addClass("custInput")
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
}

function addEmptyTableRow()
{
    addTableRow("","");
}

function loadOptions()
{
    var opt = $.secureEvalJSON(readProperty("options",getDefaultOptions()));
    processOptions(opt);
}

function processOptions(opt) 
{
    $("#linksTable").empty();
    for(var i = 0; i < opt.pagesList.length; i++)
    {
        addTableRow(opt.pagesList[i].title, opt.pagesList[i].url);
    }
    
    $("button").button();
    
    if (opt.wrapTitles === "yes") {
        $("#wrapTitles").attr("checked", "checked");
    } else {
        $("#wrapTitles").removeAttr("checked");
    }
    $("#wrapTitles").button("refresh");
    
    if (opt.ctrlBtnPos === "top") {
        $("#ctrlBtnPos").attr("checked", "checked");
    } else {
        $("#ctrlBtnPos").removeAttr("checked");
    }
    $("#ctrlBtnPos").button("refresh");
}

function hideExportImportBlock()
{
    $("#exportLabel").hide();
    $("#importLabel").hide();
    $("#exportImportField").val("");
    $("#exportImportBlock").hide();
    $("#exportBtn").removeAttr("disabled");
    $("#importBtn").removeAttr("disabled");
    $("#importBtn").button("option", {
          icons: { primary: "ui-icon-circle-arrow-s" }
    });
    $("#exportBtn").button("option", {
            icons: { primary: "ui-icon-circle-arrow-s" }
    });
}

function exportSettings()
{
    hideExportImportBlock();
    $("#exportImportField").val(getOptionsAsJSON());
    $("#exportImportBlock").show();
    $("#exportLabel").show();
    $("#importBtn").attr("disabled","disabled");
    $("#exportBtn").button("option", {
            icons: { primary: "ui-icon-circle-arrow-n" }
    });
}

function importSettings()
{  
    hideExportImportBlock();
    $("#exportBtn").attr("disabled","disabled");
    $("#exportImportBlock").show();
    $("#importLabel").show();
    $("#importBtn").button("option", {
            icons: { primary: "ui-icon-circle-arrow-n" }
    });
}

function startImport()
{
    var raw_opt = $("#exportImportField").val();
    try {
        var opt = $.secureEvalJSON(raw_opt);
        processOptions(opt);
    } catch (ex) {
        alert ("Please, paste exported settings in JSON format into the import field.");
    }
    hideExportImportBlock();
}
