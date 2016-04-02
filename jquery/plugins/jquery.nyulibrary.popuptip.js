/* PLUGIN: nyulibrary_popup_tip
 *
 * DEPENDENT ON:
 *		-- jquery.poshytip.min.js - http://vadikom.com/tools/poshy-tip-jquery-plugin-for-stylish-tooltips/
 * 		-- retrieve_file_contents_as_json.php - nyulibrary JSON wrapper API
 * 		-- tip-custom-yellow - the custom theme for this tip popup, in library.nyu.edu/scripts/jquery/css/tip-custom-yellow
 */
(function(){

	var settings = {
		base_url: 'https://web1.library.nyu.edu/common/retrieve_file_contents_as_json.php',
		floatIt: false,
		c_theme: 'tip-custom-yellow'
	};

  var methods = {
			init: function(options) {
				return this.each(function(){
					if(options) jQuery.extend(settings, options);

					var $this = jQuery(this);

					// MAIN IF: If floatIt is set to true, set styles to float tip right
					if (settings.floatIt) {
						$this.wrap(jQuery("<div />").css("position","relative"));
						$this.css({'position':'absolute','float':'right','right':'0','width':'200px'})
					}

					// Set delay based on class tip-delayed
					$delay = ($this.hasClass("tip-delayed") || $this.find(".tip-link").hasClass("tip-delayed")) ? 500 : 1;
					// Set position and offsets based on screen position
					$alignX = ($this.offset().left > Math.ceil(jQuery(document).width() * .75)) ? 'left' : 'inner-left';
					$alignY = ($this.offset().left > Math.ceil(jQuery(document).width() * .75)) ? 'center' : 'bottom';
					$offsetY = ($this.offset().left > Math.ceil(jQuery(document).width() * .75)) ? 1 : 5;
					// Additionally for the x-offset, if the nyulibrary_help is set then align with help icon
					if ($this.offset().left > Math.ceil(jQuery(document).width() * .75))
						$offsetX = 5;
					else if ($this.hasClass("nyulibrary_help"))
					 	$offsetX = -10;
					else
						$offsetX = 1;

					// If this element has the calss tip-link-dialog or contains a link that does, create a jquery-ui dialog
					if ($this.hasClass("tip-link-dialog") || $this.find(".tip-link-dialog").is("a")) {
						loop = ($this.hasClass("tip-link-dialog")) ? $this : $this.find('a.tip-link-dialog');

						loop.each(function() {
							// If the tip-link-full class is set, pull the full html page, not an excerpt
							full_html = (jQuery(this).hasClass('tip-link-full')) ? "&full_html=true&embed_css=true" : "";

							// Initialize the dialog
							var $dialog = jQuery('<div></div>').dialog({
									autoOpen: false,
									title: jQuery(this).attr('title'),
									width: 'auto',
									height: 'auto',
									modal: false
							});

							// Call our JSON API wrapper
							jQuery.getJSON(settings.base_url + "?the_url="+jQuery(this).attr('href')+full_html+"&callback=?",
									function(data) {
											$dialog.html(data.theHtml);
									}
							);

							jQuery(this).click(function() {
								$dialog.dialog('open');
								return false;
							});

						});

					}

					// MAIN IF: If this element has a nyulibrary_help class then we want to create a tip from the URL
					// 			this was the default behavior from the older popup tip plugin and so we are checking this legacy case
					else if ($this.hasClass("nyulibrary_help")) {

						// Initialize tip
						$this.poshytip({
							className: settings.c_theme,
							showTimeout: $delay,
							alignTo: 'target',
							alignX: $alignX,
							alignY: $alignY,
							offsetX: $offsetX,
							offsetY: $offsetY,
							allowTipHover: true,
							content: function(updateCallback) {
										var new_html = jQuery(this).attr('new_html');
										if (new_html)
											return new_html;

										jQuery.getJSON(settings.base_url + "?the_url="+$this.attr("href")+"&callback=?",
												function(data) {
														updateCallback(data.theHtml);
												}
										);

									return 'Loading...';
								}
						});
						if (jQuery.browser.msie) { jQuery("."+settings.c_theme).addClass("tip-remote"); }


					}

					// MAIN IF: If this element has the tip-link class or contains an anchor that does,
					//			create a tip for each
					else if ($this.find('a.tip-link').hasClass("tip-link") || $this.hasClass("tip-link")) {

						loop = ($this.hasClass("tip-link")) ? $this : $this.find('a.tip-link');

						loop.each(function() {

							// Initialize tip
							jQuery(this).poshytip({
								className: settings.c_theme,
								showTimeout: $delay,
								alignTo: 'target',
								alignX: $alignX,
								alignY: $alignY,
								offsetX: $offsetX,
								offsetY: $offsetY,
								allowTipHover: true,
								content: function(updateCallback) {
											// Determine if full HTML should be pulled from the JSON API
											full_html = (jQuery(this).hasClass('tip-link-full')) ? "&full_html=true&embed_css=true" : "";

											var tip_link_html = jQuery(this).attr('tip_link_html');
											if (tip_link_html)
												return tip_link_html;

											// Call the JSON API wrapper
											jQuery.getJSON(settings.base_url + "?the_url="+jQuery(this).attr('href')+full_html+"&callback=?",
													function(data) {
															updateCallback(data.theHtml);
													}
											);

										return 'Loading...';
									}
							});
							if (jQuery.browser.msie) { jQuery("."+settings.c_theme).addClass("tip-remote"); }
						});


						}

						// MAIN IF: If no specific class is defined, but the plugin is called on an anchor tag,
						//			then initialze a 'simple' tip, just utilizing the title tag as the popup's content
						else if ($this.is("a")){

						$this.poshytip({
							className: settings.c_theme,
							showTimeout: $delay,
							alignTo: 'target',
							alignX: $alignX,
							alignY: $alignY,
							offsetX: $offsetX,
							offsetY: $offsetY,
							allowTipHover: false
						});

						}

				});
			}
		};

  	jQuery.fn.nyulibrary_popup_tip = function( method ) {
    	// Method calling logic
			if (methods[method]) {
				return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
			} else {
				jQuery.error( 'Method ' +  method + ' does not exist on jQuery.nyulibrary_popup_tip' );
			}
  	};

})( jQuery );
