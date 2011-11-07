function readProperty(property, defValue)
{
	if(localStorage[property] == null)
	{
		return defValue;
	}
	return localStorage[property];
}

function getDefaultLinks()
{
   return "Page1,/folder1/page1.html;Page2,/page2.html";
}

function linksToArray(links)
{
    var arr = links.split(";");
    var res = new Array();
    var linksCount = 0;
    for(var i = 0; i < arr.length; i++)
    {
        var row = arr[i].split(",");
        if (row.length == 2)
        {
            res[linksCount] = new Array();
            res[linksCount][0] = decodeURIComponent(row[0]);
            res[linksCount][1] = decodeURIComponent(row[1]);
            linksCount++;
        }
    }
    return res;
}

function closeWindow()
{
	window.close();
}

