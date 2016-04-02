(function(){

	var settings = {
		//properties
		base: 'https://libraryh3lp.com/chat/',
		skin: '14593',
		theme: 'gota',
		title: 'Ask+NYU+Libraries',
		identity: 'NYU',
		iframe_width: '240px',
		iframe_height: '200px',
		iframe_border: '1px solid #999',
		jid: 'askbobst@chat.libraryh3lp.com',
		//classes
		c_main : 'libraryh3lp',
		//text
		t_offline: '<a href="http://library.nyu.edu/ask" target="_blank">Ask a Librarian</a>',
		//urls
		u_js: "https://libraryh3lp.com/js/libraryh3lp.js?multi"
		//u_js: "libraryhelp_load.js"
	};

  var methods = {
			init: function(options) {
				return this.each(function(){
					if(options) jQuery.extend(settings, options);

					var $this = jQuery(this);
					var $needs_js = jQuery("<div />").addClass("needs-js")

					$this.wrap($needs_js);

					var iframe_wrapper = jQuery("<div />").addClass(settings.c_main).attr("jid",settings.jid);
					var iframe_src = settings.base + settings.jid + "?skin=" + settings.skin + "&theme=" + settings.theme + "&title=" + settings.title + "&identity=" + settings.identity;
					var iframe = jQuery("<iframe />");
					iframe.attr("src", iframe_src);
					iframe.attr("frameborder", 1);
					iframe.css("border", settings.iframe_border);
					iframe.css("width", settings.iframe_width);
					iframe.css("height", settings.iframe_height);
					var offline = jQuery("<div />").addClass(settings.c_main).css("display","none").html(settings.t_offline);

					$this.closest("div").after(iframe_wrapper.append(iframe).after(offline));

					/*var script = document.createElement('script');
					script.type = 'text/javascript';
					script.src = settings.u_js;
					document.getElementsByTagName('body')[0].appendChild(script);*/

				});
			}
		};

  	jQuery.fn.nyulibrary_libraryhelp = function( method ) {
    	// Method calling logic
			if (methods[method]) {
				return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
			} else {
				jQuery.error( 'Method ' +  method + ' does not exist on jQuery.nyulibrary_libraryhelp' );
			}
  	};

})( jQuery );
