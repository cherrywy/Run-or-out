
var _type = require('../utils').type;

var NavigationItem = {
	props: ['route'],
	data: function() {
		return {
			TYPE_DEFAULT: 1,
			TYPE_ICON: 2,
			TYPE_IMG: 3,
		}
	},
	computed: {
		type: function() {

			//console.log(this.route);

			if (_type.isString(this.route)) {
				return this.TYPE_DEFAULT;
			} else if (_type.isPlainObject(this.route)) {

				if (this.route.type == 'icon') {
					return this.TYPE_ICON;
				} else if (this.route.type == 'img') {
					return this.TYPE_IMG;
				} else {
					return this.TYPE_DEFAULT;
				}
			} else {
				return this.TYPE_DEFAULT;
			}
		},
		status: function() {
			return this.route.status == 'normal' ? "" : "active";
		}
	},
	template: [
		'<li class="xo-nav-item {{status}}">',
			'<template v-if="type == TYPE_DEFAULT">',
				'<a :href="route.path">',
					'<i class="icon" />',
					'<span class="name">{{route.name}}</span>',
				'</a>',
			'</template>',
			'<template v-if="type == TYPE_ICON">',
				'<a :href="route.path">',
					'<i class="icon iconfont icon-{{route.icon}}"></i>',
					'<span class="name">{{route.name}}</span>',
				'</a>',
			'</template>',
			'<template v-if="type == TYPE_IMG">',
				'<a :href="route.path">',
					'<img class="icon" :src="route.img" />',
					'<span class="name">{{route.name}}</span>',
				'</a>',
			'</template>',
		'</li>',
	].join(''),
}

module.exports = exports = NavigationItem;