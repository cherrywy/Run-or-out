var Modal = require('../modules/modal.js');
//var id = $.getUrlParam("id");
var id="";
var app=new Vue({
	el:"#so-v-pay",
	data: {
		weekNum:1,			//报名周数
		weekMoney:300,		//每期钱数
		totalMoney:0,		//总金额
		accountMoney:0,		//账户余额
		discountMoney:700,	//账户可抵扣金额
		
		needPay:0,			//还需支付多少钱
		payBtn:'',			//支付按钮
		
		isUseAccount:true,  //是否启用账户支付
		
		orderId:null,       //支付订单号
		start_date:"",      //班级最近一个周期的开始时间，从班级主页中获取
		
		inputShow:false,
		
		telphone:'点击输入',
	},
	methods:{
		showInput:function(){
			this.telphone='';
			this.inputShow=true;
		},
		save:function(){
			if(app.telphone==''){
				Modal.alert({
					content:"请输入手机号",
				});
				return ;
			}else if(isNaN(app.telphone)){
				Modal.alert({
					content:"请输入正确的手机号",
				});
				return ;
			}else if(app.telphone.length!=11){
				Modal.alert({
					content:"请输入正确的手机号",
				});
				return ;	
			}
			this.inputShow=false;
		}
	}
});

/*
 支付按钮分为三种：确认支付、还需支付100元，微信支付
 * */

$(function(){
	getConfig();
	info();
	getUserAccountMoney();
	
	$(".pay-content").on('click','.icon-jianhao',function(e){
		e.preventDefault();
		if(app.weekNum!=1){
			app.weekNum--;
		}
		changeMoney();
	});
	$(".pay-content").on('click','.icon-jiahao',function(e){
		e.preventDefault();
		app.weekNum++;
		changeMoney();
	});
	//是否使用账户抵扣
	$(".pay-content").on("click",".iconclick",function(e){
		 e.preventDefault();
		 //$(this).parent().parent().parent().siblings('.Content-detail').toggle(); 
		 if($(this).parent().children().hasClass("icon-fangxingxuanzhongfill")){
		 	$(this).parent().children().removeClass("icon-fangxingxuanzhongfill").addClass("icon-fangxingweixuanzhong");
		 	$(this).parent().children().removeClass("color-blue").addClass("color-96");
		 	app.isUseAccount=false;
		 }else{
		 	$(this).parent().children().removeClass("icon-fangxingweixuanzhong").addClass("icon-fangxingxuanzhongfill");
		 	$(this).parent().children().removeClass("color-96").addClass("color-blue");
		 	app.isUseAccount=true;
		 }
		changeMoney(); 
	})

});
//获取初始化信息（最少报名周数，每期金额）
function info(){
	
}

		/*function showInput(){
			app.inputShow=true;
		}*/
//获取用户账户余额
function getUserAccountMoney() {
	$.ajax({
		url: urlGetUserAccoutMoney,
		type: "get",
		async: false,
		dataType: "json",
		success: function(data) {
			if (data.status == 0) {
				app.accountMoney = parseInt(data.data.money);
				
				app.totalMoney=app.weekNum*app.weekMoney;
			}else{
				
			}
		},
		error: function() {
			netWorkError();
		}
	})
	app.accountMoney = 500;	
	changeMoney();
}
//改变金额
function changeMoney(){
	app.totalMoney=parseFloat(app.weekNum)*parseFloat(app.weekMoney);
	//判断账户余额和需求总金额之间的关系
	if(app.accountMoney>=app.totalMoney){
		app.discountMoney=app.totalMoney;
		if(app.isUseAccount){
			app.payBtn="确认支付";
		}else{
			app.payBtn="微信支付";
		}
		
	}else{
		app.discountMoney=app.accountMoney;
		if(app.isUseAccount){
			app.needPay=app.totalMoney-app.accountMoney;
			app.payBtn="还需支付"+app.needPay+"元";
		}else{
			app.payBtn="微信支付";
		}

	}
	
}

function getOrderId() {
	var product = {
		team_id: id,
		cycle: app.weekNum
	};
	$.ajax({
		url: urlPayOrder,
		type: "post",
		async: true,
		data: {
			type: "participation",
			product:{
				type:2,
				team_id: id,
				cycle: app.weekNum,
				startDate:app.start_date,
			}
		},
		dataType: "json",
		beforeSend: function() {
			$("#loadingToast").show();
		},
		success: function(data) {
			if (data.status == 200) {
				app.orderId = data.data.order_no;
				if (app.accountMoney >= app.totalMoney && isUseAccount) {
					accountPay();
				} else {
					useWeiPay();
				}
			} else {
				$("#loadingToast").hide();
			}
		},
		error: function() {
			netWorkError();
			$("#loadingToast").hide();
		}
	})
}


//账户余额为0 完全使用微信支付
//没有选择账户抵扣时，用微信支付
function weixinPay(){
	$.ajax({
		url: urlGetWeiPayId,
		type: "post",
		async: true,
		data: {
			order_no: orderId,
			type:"jsapi",
			money:app.totalMoney,
		},
		dataType: "json",
		beforeSend: function() {
			$("#loadingToast").show();
		},
		success: function(data) {
			if (data.status == 200) {
				$("#loadingToast").hide();
				var weiConfig = data.data;
				var webarr = weiConfig.parameters;

				wx.chooseWXPay({
					timestamp: webarr.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
					nonceStr: webarr.nonceStr, // 支付签名随机串，不长于 32 位
					package: webarr.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
					signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
					paySign: webarr.paySign, // 支付签名
					success: function(res) {
						//$("#alert-out-create").show();
						if (type == "createClass") {
							$("#alert-out-create").show();
						} else if (type == "joinClass") {
							window.location.href = "/page/team/detail?id=" + id + "&type='joinClass'";
						}
					}
				});
			} else {
				$("#loadingToast").hide();
			}
		},
		error: function() {
			alert("网络错误");
			$("#loadingToast").hide();
		}
	})
}
//账户余额充足，完全使用账户支付
function accountPay(){
	//调用账户支付
	$.ajax({
		url: urlPayByAccount,
		type: "post",
		async: true,
		data: {
			order_no: app.orderId,
			money: app.totalMoney,
			type:"account"
		},
		dataType: "json",
		beforeSend: function() {
			$("#loadingToast").show();
		},
		complete: function() {
			$("#loadingToast").hide();
		},
		success: function(data) {
			if (data.status == 200) {
				app.hidePop();
				Modal.alert({
					content: "支付成功!",
					type: "alert",
					sureBtnText: "确定",
					sure: function() {
						window.location.href = '/page/team/detail?id=' + id + "&type=joinClass" + (referee ? ("&referee=" + referee) : "");
					}
				});
			}
		},
		error: function() {
			Modal.alert({
				content: "账户支付失败，请重试或联系管理员",
				type: "alert",
				sureBtnText: "确定"
			});
		}
	})
}
//账户余额不足，使用微信和账户共同支付
function accountAndweinxinPay(){
	$.ajax({
		url: urlGetWeiPayId,
		type: "post",
		async: true,
		data: {
			order_no: orderId,
			type:"jsapi",
			money:app.totalMoney,
			options:{
				useAccount:app.discountMoney,
			}
		},
		dataType: "json",
		beforeSend: function() {
			$("#loadingToast").show();
		},
		success: function(data) {
			if (data.status == 200) {
				$("#loadingToast").hide();
				var weiConfig = data.data;
				var webarr = weiConfig.parameters;

				wx.chooseWXPay({
					timestamp: webarr.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
					nonceStr: webarr.nonceStr, // 支付签名随机串，不长于 32 位
					package: webarr.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
					signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
					paySign: webarr.paySign, // 支付签名
					success: function(res) {
						//$("#alert-out-create").show();
						if (type == "createClass") {
							$("#alert-out-create").show();
						} else if (type == "joinClass") {
							window.location.href = "/page/team/detail?id=" + id + "&type='joinClass'";
						}
					}
				});
			} else {
				$("#loadingToast").hide();
			}
		},
		error: function() {
			alert("网络错误");
			$("#loadingToast").hide();
		}
	})
}

//获取微信配置
function getConfig() {
	$.ajax({
		url: urlGetConfig,
		type: "get",
		async: false,
		dataType: "json",
		data: {
			url: location.href.split('#')[0]
		},
		success: function(data) {
			jsSdK = data;
		}
	});
}
