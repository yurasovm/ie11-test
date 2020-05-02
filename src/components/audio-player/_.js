import 'promise-polyfill/src/polyfill'
import Player from './Player.svelte'

document.querySelectorAll( '.js-audio' ).forEach( pl => {
	let bl	= new Player({
		target	: pl,
		props	: {},
	});
		// bl.$on( 'closeBlock', (e) => bl.$destroy())
});

(function () {

}());