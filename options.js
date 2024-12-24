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
    var wrapTitles = $("#wrapTitles").prop("checked")  ? "yes" : "no";

    let opt = {
        pagesList: links,
        wrapTitles: wrapTitles
    };
    // return $.toJSON(opt);
    return opt;
}

function saveOptions()
{
    saveOptionsToStore(getOptionsAsJSON());
    $("#confirmSaved").dialog({
        title: "Options saved",
        width: 250,
        height: 100,
        resizable: false,
        modal: false,
        show: {
            effect: "blind",
            duration: 250
        },
        hide: {
            effect: "explode",
            duration: 250
        }
    }).delay(500).fadeOut(function(){ $(this).dialog("close") });
}

function buildTableRow(title, url)
{
    return $("<tr />").addClass("linkrow")
        .append(
            $("<td />").attr("align","center").attr("title","drag to move").append(
                $("<span />").addClass("ui-icon").addClass("ui-icon-arrowthick-2-n-s")
            )
        )
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
        );
}

function getUrlFromRow(row)
{
    return row.find('input[id^="url"]:first').val().trim();
}

function getTitleFromRow(row)
{
    return row.find('input[id^="title"]:first').val().trim();
}

function addTableRow(title, url)
{
    $("#linksTable").append(buildTableRow(title, url));
}

function addEmptyTableRow()
{
    addTableRow("","");
}

async function loadOptions()
{
    const res = await getOptions(getDefaultOptions());
    processOptions(res);
}

function processOptions(opt) 
{
    $("#linksTable").empty();
    for(var i = 0; i < opt.pagesList.length; i++)
    {
        addTableRow(opt.pagesList[i].title, opt.pagesList[i].url);
    }
    $("#linksTable").sortable({
      distance: 30
    }).disableSelection();
    
    $("button").button();
    
    if (opt.wrapTitles === "yes") {
        $("#wrapTitles").prop("checked", true);
    } else {
        $("#wrapTitles").prop("checked", false);
    }
    $("#wrapTitles").button().button("refresh");
}

function startImport()
{
    let raw_opt = $("#exportImportField").val();
    let success = false;
    try {
        let opt = secureParseJSON(raw_opt);
        processOptions(opt);
        success = true;
    } catch (ex) {
        alert ("Please, paste exported settings in JSON format into the import field.");
    }
    $("#exportImportField").val("");
    return success;
}

// ------------------------ window inline --------------------
document.addEventListener('DOMContentLoaded', async function () {
    await loadOptions();
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
                        effect: "clip"
                    },
                    hide: {
                        effect: "clip"
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
                        effect: "clip"
                    },
                    hide: {
                        effect: "clip"
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
            width: 750,
            show: {
                effect: "clip"
            },
            hide: {
                effect: "clip"
            }
        });
    });
});
