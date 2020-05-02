module.exports	= {
	slick	: {
		name	: 'vendors/slick/slick',
		test	: /[\\/]node_modules[\\/]slick-carousel[\\/]/,
		chunks	: 'all',
		enforce	: true,
	},
	jquery	: {
		name	: 'vendors/jquery/jquery',
		test	: /[\\/]node_modules[\\/]jquery[\\/]/,
		chunks	: 'all',
		enforce	: true,
	},
	fancy	: {
		name	: 'vendors/fancy/fancy',
		test	: /[\\/]node_modules[\\/]@fancyapps[\\/]/,
		chunks	: 'all',
		enforce	: true,
	}
}