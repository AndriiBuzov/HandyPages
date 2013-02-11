//// hack as .toggle() was removed from jquery 1.9
//(function($) {
//    $.fn.clickToggle = function(func1, func2) {
//        var funcs = [func1, func2];
//        this.data('toggleclicked', 0);
//        this.click(function() {
//            var data = $(this).data();
//            var tc = data.toggleclicked;
//            $.proxy(funcs[tc], this)();
//            data.toggleclicked = (tc + 1) % 2;
//        });
//        return this;
//    };
//}(jQuery));

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
    var ctrlBtnPos = $("#ctrlBtnPos").prop("checked") ? "top" : "bottom";
    var wrapTitles = $("#wrapTitles").prop("checked")  ? "yes" : "no";
    
    var opt = {
        pagesList: links,
        ctrlBtnPos: ctrlBtnPos,
        wrapTitles: wrapTitles
    };
    return $.toJSON(opt);
}

function saveOptions()
{
    saveProperty("options", getOptionsAsJSON());
    $("#confirmSaved").dialog({
        title: "Options saved",
        width: 250,
        resizable: false,
        modal: true,
        show: {
            effect: "blind",
            duration: 1000
        },
        hide: {
            effect: "explode",
            duration: 1000
        },
        buttons: {
            Close: function() {
                $( this ).dialog( "close" );
            }
        }
    });
}

function buildTableRow(title, url)
{
    return $("<tr />").addClass("linkrow")
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
        $("#wrapTitles").prop("checked", true);
    } else {
        $("#wrapTitles").prop("checked", false);
    }
    $("#wrapTitles").button().button("refresh");
    
    if (opt.ctrlBtnPos === "top") {
        $("#ctrlBtnPos").prop("checked", true);
    } else {
        $("#ctrlBtnPos").prop("checked", false);
    }
    $("#ctrlBtnPos").button().button("refresh");
}

function startImport()
{
    var raw_opt = $("#exportImportField").val();
    var success = false;
    try {
        var opt = $.secureEvalJSON(raw_opt);
        processOptions(opt);
        success = true;
    } catch (ex) {
        alert ("Please, paste exported settings in JSON format into the import field.");
    }
    $("#exportImportField").val("");
    return success;
}

// ------------------------ window inline --------------------
document.addEventListener('DOMContentLoaded', function () {
    $(loadOptions);
    $(function() {
        $("#addRow").click(addEmptyTableRow).button({
            icons: {
                primary: "ui-icon-plus"
            },
            text: false
        });
        $("#showHelp").click(function() {
            $( "#helpDialog" ).dialog( "open" );
        }).button({
            icons: {
                primary: "ui-icon-help"
            },
            text: false
        });
        $("#importBtn")
            .button("option", {
                icons: { primary: "ui-icon-circle-arrow-n" }})
            .click(function(){
                $("#exportImportField").val("");
                $("#exportImportBlock").dialog({
                    title: "Paste settings and press Go for import",
                    width: 450,
                    resizable: false,
                    modal: true,
                    show: {
                        effect: "blind",
                        duration: 1000
                    },
                    hide: {
                        effect: "explode",
                        duration: 1000
                    },
                    buttons: {
                        Go: function() {
                            if(startImport())
                            {
                                $( this ).dialog( "close" );
                            }
                        },
                        Cancel: function() {
                            $( this ).dialog( "close" );
                        }
                    }
                });
            });
        $("#exportBtn")
            .button("option", {
                icons: { primary: "ui-icon-circle-arrow-s" }})
            .click(function(){
                $("#exportImportField").val(getOptionsAsJSON());
                $("#exportImportBlock").dialog({
                    title: "Copy settings for future",
                    width: 450,
                    resizable: false,
                    modal: true,
                    show: {
                        effect: "blind",
                        duration: 1000
                    },
                    hide: {
                        effect: "explode",
                        duration: 1000
                    },
                    buttons: {
                        Close: function() {
                            $( this ).dialog( "close" );
                        }
                    }
                });
            });
        $("#btnSaveOptions").click(saveOptions);
        $("#btnCancel").click(closeWindow);

        // setup dialog for help
        $( "#helpDialog" ).dialog({
            title: "Help",
            autoOpen: false,
            width: 600,
            show: {
                effect: "blind",
                duration: 1000
            },
            hide: {
                effect: "explode",
                duration: 1000
            }
        });
    });
});
