var Modal = require('../../modules/modal.js');

var app = new Vue({
	el: '#v-body',
	data: {
		
	},
	methods: {
		
	}
});

$(function(){
	Modal.alert({
		content: '你瞅啥你瞅啥你瞅啥你瞅啥你瞅啥你瞅啥你瞅啥你瞅啥你瞅啥你瞅啥你瞅啥你瞅啥你瞅啥你瞅啥你瞅啥你瞅啥你瞅啥你瞅啥'
	});
	Modal.loading();
	setTimeout(function(){
		Modal.hideLoading();
	},3000);
});