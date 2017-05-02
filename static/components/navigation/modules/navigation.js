module.exports = exports = {
	state: {
		routes: [
			{
				path: '/page/team/list',
				type: 'icon',
				icon: 'menu-a',
				name: '选择班级',
				status: 'normal',
			}, {
				path: '/page/redirect?action=team_home',
				type: 'icon',
				icon: 'ningmengxianxing',
				name: '我的班级',
				status: 'normal',
			}, {
				path: '/page/user_home',
				type: 'img',
				img: 'https://oigsunwyj.qnssl.com/meta/avatar/default.png',
				name: '我',
				status: 'normal',
			},
		],
	},
	mutations: {
		'ADD_ROUTE': function(state, route) {
			state.routes.push(route);
		},
		'SET_ROUTE': function(state, route, i) {
			state.routes[i] = route;
		},
		// 临时添加的内容
		'SET_ROUTE_AVATAR': function(state, avatar) {
			state.routes[2].img = avatar;
		},
		'SET_ROUTE_ACTIVE': function(state, index) {
			state.routes[index].status = 'active';
		},
		'SET_ROUTE_NORMAL': function(state) {
			var routes = state.routes;
			for (var i = 0, len = routes; i < len; i++) {
				Things[i]
			}
		}
	}
}