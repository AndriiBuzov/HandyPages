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
    return '{"pagesList":[{"url":"folder1/page1.html","title":"Page 1"},{"url":"/ahother_folder/page2.php?act=show","title":"Page 2"},{"url":"/page.html","title":"Page 3"}],"ctrlBtnPos":"bottom","wrapTitles":"no"}';
}

function closeWindow()
{
	window.close();
}

(function($){
	$.fn.jNiceTextInputInit = function(){
		if ($(this).parents('.jNiceInputWrapper').length == 0)
        {
            var $input = $(this).addClass('jNiceInput').wrap('<div class="jNiceInputWrapper"><div class="jNiceInputInner"></div></div>');
            var $wrapper = $input.parents('.jNiceInputWrapper');
            $input.focus(function(){ 
                $wrapper.addClass('jNiceInputWrapper_hover');
            }).blur(function(){
                $wrapper.removeClass('jNiceInputWrapper_hover');
            });
        }
	};
})(jQuery);

