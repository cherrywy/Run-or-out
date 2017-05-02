module.exports = exports = {
	state: {
		nickname: null,
		avatar: null,
	},
	mutations: {
		'SET_USER_NICKNAME': function(state, nickname) {
			state.nickname = nickname;
		},
		'SET_USER_AVATAR': function(state, avatar) {
			state.avatar = avatar;
		}
	}
}