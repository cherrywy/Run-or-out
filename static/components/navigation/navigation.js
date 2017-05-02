
var Navigation = {
	vuex: {
		getters: {
			routes: function(state) {
				return state.navigation.routes;
			}
		}
	},
	template: [
		'<ul class="xo-nav">',
			'<template v-for="route in routes">',
				'<xo-navigation-item :route="route" />',
			'</template>',
		'</ul>',
	].join('')
}

module.exports = exports = Navigation;