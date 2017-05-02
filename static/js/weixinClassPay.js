var Modal = require('../modules/modal.js');

var jsSdK=null;
var orderList={};
var money=990;

$(function(){
	order();
	getConfig();
	
	wx.config({
		debug: false,
		appId: jsSdK.appId, // 必填，公众号的唯一标识
		timestamp: jsSdK.timestamp, // 必填，生成签名的时间戳
		nonceStr: jsSdK.nonceStr, // 必填，生成签名的随机串
		signature: jsSdK.signature, // 必填，签名，见附录1
		jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline','chooseWXPay','closeWindow'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	});
})

//下订单
function order(){
	Modal.alertHide();
	setTimeout(function(){
		$.ajax({
			url:urlshopInfo,
			type: "post",
			async: true,
			data:{
				type:'commodity',
				product: {
					id: "587c7ffb83276cc0b400179b",
					quantity: 1
				}
			},
			dataType: "json",
			beforeSend: function() {
				$("#loadingToast").show();
			},
			success: function(data) {
				if(data.status == 0){
					Modal.alert({
						content: "报名截止",
						sure:function(){
							wx.closeWindow();
						}
					});
					/*orderList=data.data;
					useWeiPay();*/
					
				}else{
					$("#loadingToast").hide();
					Modal.alert({
						content: data.message,
						sure:function(){
							wx.closeWindow();
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
	},600)
}

function useWeiPay() {
	//调用微信支付
	$.ajax({
		url: urlshopPay,
		type: "POST",
		async: true,
		data: {
			type:'jsapi',
			orderNo: orderList.orderNo,
			money: money
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
							closeOrder(orderList.orderNo);
						}else if (res.errMsg == "chooseWXPay:ok"){
							Modal.alert({
							content: "支付成功!",
							type: "alert",
							sureBtnText: "确定",
							sure: function() {
								MtaH5.clickStat('weixinclasspaysuccess');
								wx.closeWindow();
								//window.location.href = '/page/team/detail?id=' + id + "&type=joinClass" + (referee ? ("&referee=" + referee) : "");
							}
						});
						}
						
						
					},
					cancel: function(res) {
						closeOrder(orderList.orderNo);
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

function getConfig() {
	MtaH5.clickStat('weixinclasscloseorder');
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
				wx.closeWindow();
			}else{
				Modal.alert({
					content: "出错了!"
				});
			}
			wx.closeWindow();
		},
		error: function() {
			Modal.alert({
				content: "出错了!"
			});
		}
	});
}
