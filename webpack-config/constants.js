const themeName	= 'blank';

module.exports	= {
	assetsPath			: `"/themes/${ themeName }/assets"`,
	componentsImgPath	: `"/themes/${ themeName }/assets/img/components"`,
	aboutCarousel		:	{
		shadowSize		: 40,
		maxWidthItem	: 480,
	},
	screens				: {
		xs				: '320', // Phones
		sm				: '420', // Pads
		md				: '750', // Desktops
		lg				: '1217', // Large Desktops
		mobileSwitch	: '980',
	}
}