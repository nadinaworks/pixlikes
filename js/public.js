(function ($) {
	"use strict";
	$(function () {

		/**
		 * If prevent caching is on, we update all likes number on page load
		 */
		$(document).ready(function(){
			if ( locals.load_likes_with_ajax == true ) {
				$('.pixlikes-box').each( function(){
					var likebox = this,
						post_id = $(likebox).data('id');

					// reload likes number
					jQuery.ajax({
						type: "post",url: locals.ajax_url,data: { action: 'pixlikes', _ajax_nonce: locals.ajax_nounce, type: 'get', post_id: post_id},
						//beforeSend: function() {jQuery("#loading").show("slow");}, //show loading just when link is clicked
						//complete: function() { jQuery("#loading").hide("fast");}, //stop showing loading when the process is complete
						success: function( response ){
							var result = JSON.parse(response);
							if ( result.success ) {
								$(likebox).find('.likes-count').text(result.likes_number);
							}
						}
					});
				});
			}
		});

		/**
		 * On each click check if the user can like
		 */
		$('.pixlikes-box.can_like').one('click', '.like-link', function(e){

			e.preventDefault();

			var likebox = $(this).parent('.pixlikes-box'),
				post_id = $(likebox).data('id');
			// if there is no post to like or the user already voted we should return
			if ( typeof post_id === 'undefined' || getCookie("pixlikes_"+post_id) ) return;

			jQuery.ajax({
				type: "post",url: locals.ajax_url,data: { action: 'pixlikes', _ajax_nonce: locals.ajax_nounce, type: 'increment', post_id: post_id},
				//beforeSend: function() {jQuery("#loading").show("slow");}, //show loading just when link is clicked
				//complete: function() { jQuery("#loading").hide("fast");}, //stop showing loading when the process is complete
				success: function( response ){ //so, if data is retrieved, store it in result
					var result = JSON.parse(response);
					if ( result.success ) {
						$(likebox).find('.likes-count').text( result.likes_number );
						$(likebox).trigger('like_succeed', result.msg);
					}
				}
			});
		});

		/**
		 * Utility functions
		 */
		function getCookie(c_name)
		{
			var c_value = document.cookie;
			var c_start = c_value.indexOf(" " + c_name + "=");
			if (c_start == -1)
			{
				c_start = c_value.indexOf(c_name + "=");
			}
			if (c_start == -1)
			{
				c_value = null;
			}
			else
			{
				c_start = c_value.indexOf("=", c_start) + 1;
				var c_end = c_value.indexOf(";", c_start);
				if (c_end == -1)
				{
					c_end = c_value.length;
				}
				c_value = unescape(c_value.substring(c_start,c_end));
			}
			return c_value;
		}

	});
}(jQuery));