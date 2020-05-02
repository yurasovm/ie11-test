(function () {
	function scrollTo( hash ) {
		const target	= $( hash );
		if ( target.length == 0 ) return;

		const rollback	= $( '.header' ).outerHeight() + 30;

		$('html, body').stop().animate({
			'scrollTop'	: target.offset().top - rollback
		}, 900, 'swing', function () {
			history.pushState(null, null, hash)
		});
	}

	$( document ).on( 'click', 'a[href^="#"]', function(e) {
		e.preventDefault();
		scrollTo( this.hash );
	});

	if ( location.hash ) {
		setTimeout(function() {
			scrollTo( location.hash );
		}, 10 );
	}
}());