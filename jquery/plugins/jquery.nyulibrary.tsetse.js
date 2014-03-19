var nyulibrary_testse_plugin_in_use = false;

(function( $ ){

	var settings = {
				remove : null,
				t_save : 'Add to e-Shelf',
				t_unsave : 'In e-Shelf',
				t_guest_unsave : 'In guest e-Shelf',
				t_guest_login : 'login to save permanently',
				t_error : 'Could not contact e-Shelf',
				t_saving : 'Saving...',
				t_unsaving : 'Removing...',
				t_working : 'Working...',
				login_selector : '.login',
				is_authenticated : true,
				success_key : null,
				add_query : null,
				output_format : "html",
				saved: function(  ) { return false; },
				callback : function () {},
				afterSave : function () {},
				afterUnsave : function () {}
	};

  var methods = {
    init_eshelf_links: function(options){
					return this.each(function(){
						if(options) $.extend(settings, options);

							if (settings.remove != null)
								$(settings.remove).remove();
						
							var $this = $(this),
								data = $this.data({
									href : $this.attr('href'),
									id : $this.attr('href'),
									saved : settings.saved($this),
									settings : settings
								});
							data = $this.data();				
							var href = data.href;
							data.href = (settings.add_query != null) ? data.href + settings.add_query : data.href;
							
							var checkbox = $("<input />").attr({type: 'checkbox', id: href, 'class': 'tsetse_generated' });
							var labelFor = $("<label />").attr({'for': href, 'class': 'tsetse_generated' }).html(" " + settings.t_save);
							var response;
							
							$this.before(labelFor);
							labelFor.before(checkbox);
							data.checkbox = checkbox;

							if (data.saved) {
								checkbox.attr("checked", true);
								data.saved = false;
								methods._toggle($this,options);
							} 
							
							$($this.data('checkbox')).change(function () {
								$this.data('checkbox').attr("disabled", "disabled");
								$this.check_global = setInterval(function() {
								if (nyulibrary_testse_plugin_in_use) {
									 methods._working($this,options);
								} else {
									 clearInterval($this.check_global);
								   if ($this.data('checkbox').attr("checked")) {
											 response = $.ajax({ 
												url: data.href, 
												beforeSend: function() { methods._saving($this,options); nyulibrary_testse_plugin_in_use = !nyulibrary_testse_plugin_in_use; },
												success: function(data, textStatus, XMLHttpRequest) {
													$this.data('checkbox').removeAttr("disabled"); 
													methods._callOnSuccess(data, textStatus, XMLHttpRequest, "save", $this, options );											
												},
												error: function(jqXHR, textStatus, errorThrown) { 
													$this.data('checkbox').removeAttr("disabled"); 
													methods._callOnError(jqXHR, textStatus, errorThrown, "save", $this, options); 
												}
											 });	
							        return;
								   }
									response = $.ajax({ 
										url: data.href, 
										beforeSend: function() { methods._unsaving($this,options); nyulibrary_testse_plugin_in_use = !nyulibrary_testse_plugin_in_use; },
										success: function(data, textStatus, XMLHttpRequest) {	
											$this.data('checkbox').removeAttr("disabled"); 
											methods._callOnSuccess(data, textStatus, XMLHttpRequest, "unsave", $this, options );										
										},
										error: function(jqXHR, textStatus, errorThrown) { 
											$this.data('checkbox').removeAttr("disabled"); 
											methods._callOnError(jqXHR, textStatus, errorThrown, "unsave", $this, options); 
										}
									 });				
								}		
								}, 0);				
							});
													
							$this.hide();
							
							settings.callback($this, checkbox, labelFor);
					});
				},
				_callOnSuccess: function(data, textStatus, XMLHttpRequest, action, el, options) {
					if(options) $.extend(settings, options);
					
					nyulibrary_testse_plugin_in_use = !nyulibrary_testse_plugin_in_use; 
					if (methods._isSuccess(options,data)) {
						methods._toggle(el,options); 
						methods._setCookies(XMLHttpRequest.getResponseHeader("Pragma")); 
						if (action == "save") {
							settings.afterSave(el);
						} else if (action == "unsave") {
							settings.afterUnsave(el);
						}
					}	else {
						methods._error(el,options);
					}
				},
				_callOnError: function(jqXHR, textStatus, errorThrown, action, el, options) {
					if(options) $.extend(settings, options);
					
					methods._error(el,options); 
					nyulibrary_testse_plugin_in_use = !nyulibrary_testse_plugin_in_use;
				},
				_toggle: function (el, options) {
					if(options) $.extend(settings, options);
					
					data = el.data();
					
					switch (data.saved) {
								case true:
									$("label[for=\"" + data.id + "\"]").html(" " + settings.t_save);
									el.data('saved',false);
									break;
								case false:
									if (settings.is_authenticated)
										$("label[for=\"" + data.id + "\"]").html(" " + settings.t_unsave);
									else {
										guest_login_href = (settings.login_selector != null) ? $(settings.login_selector).attr("href") : false;
										guest_login_link = (guest_login_href) ? "<a href=\""+guest_login_href+"\">"+settings.t_guest_login+"</a>" : settings.t_guest_login;
                    guest_login = (settings.t_guest_login == null || settings.t_guest_login.length == 0) ? " " + settings.t_guest_unsave : " " + settings.t_guest_unsave + " ( " +guest_login_link+ " )";
										$("label[for=\"" + data.id + "\"]").html(guest_login);
									}		
									el.data('saved',true);					
									break;
					}
				},
				_isSuccess: function (options, xhrData) {
					if(options) $.extend(settings, options);

					if (settings.success_key == null) return true;
					
					var success = false;
					if (settings.output_format == "json") {
						if (xhrData[settings.success_key] != null) success = true;
					} else if (settings.output_format == "html") {
						if (typeof($(xhrData).filter("#"+settings.success_key)) != undefined)	success = true;
					} else if (settings.output_format != null) {
						if (xhrData.match(settings.success_key)) success = true;
					}
					return success;
				},
				_error: function (el, options) {
					if(options) $.extend(settings, options);
			
					$("label[for=\"" + el.data('id') + "\"]").html(" " + settings.t_error);
				},
				_unsaving: function (el, options) {
					if(options) $.extend(settings, options);
			
					$("label[for=\"" + el.data('id') + "\"]").html(" " + settings.t_unsaving);
				},
				_saving: function (el, options) {
					if(options) $.extend(settings, options);

					$("label[for=\"" + el.data('id') + "\"]").html(" " + settings.t_saving);
				},
				_working: function (el, options) {
					if(options) $.extend(settings, options);

					$("label[for=\"" + el.data('id') + "\"]").html(" " + settings.t_working);
				},
				_setCookies: function (headersArr) {
					if (!headersArr == null) {
						var headers = headersArr.split(", ");
					
						for (var i=0;i<headers.length;i++) {
							if (headers[i] != "no-cache") {
								document.cookie = headers[i];
							}
						}
					}
				}
			};

  $.fn.nyulibrary_tsetse = function( method ) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else {
			jQuery.error( 'Method ' +  method + ' does not exist on jQuery.nyulibrary_tsetse' );
		} 
  };

})( jQuery );