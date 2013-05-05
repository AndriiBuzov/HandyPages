function readProperty(property, defValue)
{
	if(localStorage[property] == null)
	{
		return defValue;
	}
	return localStorage[property];
}

function getDefaultOptions()
{
    return '{"pagesList":[{"url":"folder1/page1.html","title":"Page 1"},{"url":"/ahother_folder/page2.php?act=show","title":"Page 2"},{"url":"/page.html","title":"Page 3"}],"wrapTitles":"no"}';
}

function closeWindow()
{
	window.close();
}

