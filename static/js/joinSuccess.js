var Modal = require('../modules/modal.js');
//var itemId="584293d383276c73e2000d76";
var jsSdK=null;

var app=new Vue({
	el:"#join-success-v",
	data:{
		showCode:false,
		ShowEmergency:false,
		joinSuccess:false,
		orderList:null,
		successContent:null,
		userInfo:null,
		shopping:true,
		btn:true,
	},
	methods:{
		
	}
})

$(function(){
	getItem();
	getConfig();
	getUserInfo();
	wx.config({
		debug: false,
		appId: jsSdK.appId, // 必填，公众号的唯一标识
		timestamp: jsSdK.timestamp, // 必填，生成签名的时间戳
		nonceStr: jsSdK.nonceStr, // 必填，生成签名的随机串
		signature: jsSdK.signature, // 必填，签名，见附录1
		jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline','chooseWXPay','closeWindow'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	});
	
	
	
	if(app.joinSuccess){
		$(".school").addClass("show");
	}
	
	$(".top-content").on("click",".myclass",function(){
		if(app.showCode){
			app.showCode=false;	
			$(".school").show();
		}else{
			app.showCode=true;
			$(".school").hide();
			
		}
	});
	$(".foot-content").on("click",".close",function(){
		app.showCode=false;
		$(".school").show();
	});
	
	$(".join-footer").on("click",".weixin",function(){
		MtaH5.clickStat('bushouschoolquestion');
		if(app.ShowEmergency){
			app.ShowEmergency=false;	
		}else{
			app.ShowEmergency=true;
		}
	});
	
	$(".emergency").on("click",".close",function(){
		app.ShowEmergency=false;
	});
	
				app.shareData = {
					appid: jsSdK.appId,
					imgUrl: "https://o71y8058d.qnssl.com/meta/share/default.jpeg",
					link: ("https://slim.runorout.cn/page/college"),
					title: "这个春节，你吃吃吃，我瘦瘦瘦",
					desc: "平均瘦身7.6斤的减脂营，有限名额抢购中",
				};

				app.shareDataTimeLine = {
					appid: jsSdK.appId,
					imgUrl: "https://o71y8058d.qnssl.com/meta/share/default.jpeg",
					link: ("https://slim.runorout.cn/page/college"),
					title: "这个春节，你吃吃吃，我瘦瘦瘦"
				};
				
				wx.ready(function() {
					wx.onMenuShareAppMessage(app.shareData);
					wx.onMenuShareTimeline(app.shareDataTimeLine);
				
				});
	
	
});

function getItem(){
	$.ajax({
		url:urlGetSchoolInfo,
		type:"get",
		async:true,
		beforeSend: function() {
			$("#loadingToast").show();
		},
		complete: function() {
			$("#loadingToast").hide();
		},
		success:function(data){
			if(data.status==0){
				app.successContent=data.data;
				app.successContent.start=data.data.maturity.split("~")[0];
				app.successContent.end=data.data.maturity.split("~")[1];
				
				if(data.data.list.length!=0){
					app.joinSuccess=true;
					app.btn=false;
				}
			}
		}
	});
}

//获取用户头像
function getUserInfo(){
	$.ajax({
		url:urlGetUserInfo,
		type:"get",
		async:true,
		beforeSend: function() {
			$("#loadingToast").show();
		},
		complete: function() {
			$("#loadingToast").hide();
		},
		success:function(data){
			if(data.status==0){
				app.userInfo=data.data;
			}
		}
	});	
}

//时间格式处理
Vue.filter("dateCheck", function(value) {
	var aa=value.split(" ")[0].split("-");
	return aa[1] + "月" + aa[2] + "日";
});

//下订单
function order(){
	MtaH5.clickStat('bushouschoolsignup');
	app.shopping=false;
	app.btn=false;
		$.ajax({
			url:urlshopInfo,
			type: "post",
			async: true,
			data:{
				type:'commodity',
				product: {
					id: app.successContent._id,
					quantity: 1
				}
			},
			dataType: "json",
			beforeSend: function() {
				$("#loadingToast").show();
			},
			success: function(data) {
				if(data.status == 0){
					app.orderList=data.data;
					useWeiPay();
					
				}else{
					$("#loadingToast").hide();
					Modal.alert({
						content: data.message,
						sure:function(){
							//wx.closeWindow();
						}
					});
				}
			},
			error: function(data) {
				Modal.alert({
			        content: "加载失败，请重试",
			   });
			}
		});
}

function useWeiPay() {
	//调用微信支付
	$.ajax({
		url: urlshopPay,
		type: "POST",
		async: true,
		data: {
			type:'jsapi',
			orderNo: app.orderList.orderNo,
			money: app.successContent.unit_price,
		},
		dataType: "json",
		beforeSend: function() {
			$("#loadingToast").show();
		},
		/*complete: function() {
			$("#loadingToast").hide();
		},*/
		success: function(data) {
			$("#loadingToast").hide();
			if (data.status == 0) {
				var weiConfig = data.data;
				var webarr = weiConfig.parameters;
				wx.chooseWXPay({
					timestamp: webarr.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
					nonceStr: webarr.nonceStr, // 支付签名随机串，不长于 32 位
					package: webarr.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
					signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
					paySign: webarr.paySign, // 支付签名
					success: function(res) {
						
						if(res.errMsg=="chooseWXPay:cancel"){
							closeOrder(app.orderList.orderNo);
							//app.shopping=true;
							app.btn=true;
							
						}else if (res.errMsg == "chooseWXPay:ok"){
							app.joinSuccess=true;
							app.showCode=true;
							$(".school").hide();

							Modal.alert({
								content: "支付成功!",
							});
							//app.joinSuccess=true;
							//app.shopping=true;
						}
						
						
					},
					cancel: function(res) {
						closeOrder(app.orderList.orderNo);
						app.shopping=true;
						app.btn=true;
					}
				});
			}
		},
		error: function() {
			$("#loadingToast").hide();
			//wx.closeWindow();
		}
	});
}
function showCode(){
	app.joinSuccess=true;
}

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

function closeOrder(data){
	$.ajax({
		url: "/ajax/order/close/"+data,
		type: "get",
		async: false,
		dataType: "json",
		success: function(res) {
			
			if(res.status==0){
				app.btn=true;
				//wx.closeWindow();
			}else{
				Modal.alert({
					content: res.message
				});
			}
		},
		error: function() {
			Modal.alert({
				content: "出错了!"
			});
		}
	});
}