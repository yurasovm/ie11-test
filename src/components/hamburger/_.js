(function () {
	const hamburger = document.querySelector('.js-hamburger');
	if( !hamburger ) return;

	const body	= document.body;

	function checkDesktopSwitch() {
		if ( window.innerWidth > __CONSTANTS__.screens.mobileSwitch ) {
			closeMenu();
		}
	}

	function handleWindowResize() {
		let resizeTimer;
		clearTimeout(resizeTimer);
		resizeTimer	= setTimeout( () => checkDesktopSwitch(), 500 );
	}

	document.querySelectorAll( '.main-menu__link' ).forEach( link => {
		link.onclick = () => {
			if ( window.innerWidth <= __CONSTANTS__.screens.mobileSwitch ) {
				closeMenu();
			}
		}
	});

	function openMenu() {
		body.classList.add( 'page_menu-open' );
		body.style.height	= window.clientHeight + 'px';
		body.style.overflow	= 'hidden';
		window.addEventListener( 'resize', handleWindowResize, false);
	}

	function closeMenu () {
		body.classList.remove( 'page_menu-open' );
		body.style.height	= 'auto';
		body.style.overflow	= 'auto';
		window.removeEventListener( 'resize', handleWindowResize, false);
	}

	hamburger.addEventListener( 'click', () => {
		body.classList.contains( 'page_menu-open' ) ? closeMenu() : openMenu();
	});
}());