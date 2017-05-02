var Modal = require('../modules/modal.js');

var app=new Vue({
	el:"#v-with-drawals",
	data:{
		money:0,
	},
	methods:{

	}
});

$(function(){
	getUserAccountMoney();
	//app.balance=270;
});

function getUserAccountMoney(){
	$.ajax({
		url: urlGetUserAccoutMoney,
		type: "get",
		async: false,
		dataType: "json",
		success: function(data) {
			if (data.status == 0) {
				app.money = parseInt(data.data.money);
			}else{
				Modal.alert({
					content:data.message
				});
			}
		},
		error: function() {
			netWorkError();
		}
	})
}

function withdraw(){
	MtaH5.clickStat('withdrawsure');
	var money = $("#money").val().trim();
	if(money==null||money==""){
		Modal.alert({
	        content: "请输入提现金额",
	        type: "alert",
	    })
		return false;
	}

	if(!checkMoney(money)){
		Modal.alert({
	        content: "金额不正确，最多为两位小数",
	        type: "alert",
	    })
		return false;
	}

	if(money < 1){
		Modal.alert({
	        content: "因微信限制,最少提现金额为1元",
	        type: "alert",
	    })
		return false;
	}

	if(money > 200){
		Modal.alert({
	        content: "因微信限制超过200元需分多次提现",
	        type: "alert",
	    })
		return false;
	}

	if(parseInt(money*100) > app.money){
		Modal.alert({
	        content: "账户余额不足!",
	        type: "alert",
	    })
		return false;
	}

	$.ajax({
		url: urlWithdraw,
		type: "post",
		async: true,
		dataType: "json",
		data:{
			money: money*100
		},
		beforeSend:function(){
			$("#loadingToast").show();
		},
		complete:function(){
			$("#loadingToast").hide();
		},
		success:function(data){
			if(data.status == 0){
				/*$("#success-pop").show();
				getInfo();*/
				Modal.alert({
			        content: "提现成功",
			        type: "alert",
			    })
				window.location.href="/page/user_home";
			}else{
				Modal.alert({
			        content: data.data.wechat_err_code_des,
			        type: "alert",
			    })
			}
		},
		error: function(){
			Modal.alert({
		        content: "Run妹去银行了，请稍后再试，很快就好",
		        type: "alert",
		    })
		}
	})
}

function cancel(){
	MtaH5.clickStat('withdrawcancel');
	window.location.href="/page/user_home";
}

function num(obj){
	obj.value = obj.value.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
	obj.value = obj.value.replace(/^\./g,""); //验证第一个字符是数字
	obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个, 清除多余的
	obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
	obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
}
