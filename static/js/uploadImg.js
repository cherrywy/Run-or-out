var jsSdK = null;//微信接口 
var Alert = require('../modules/modal.js');
var Pager = require('../modules/pagermore.js');

$(function() {
	//微信接口配置
	getConfig();
	wx.config({
		debug: false,
		appId: jsSdK.appId, // 必填，公众号的唯一标识
		timestamp: jsSdK.timestamp, // 必填，生成签名的时间戳
		nonceStr: jsSdK.nonceStr, // 必填，生成签名的随机串
		signature: jsSdK.signature, // 必填，签名，见附录1
		jsApiList: ['chooseImage', 'previewImage', 'uploadImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	});
	
})

function init(){
	$.ajax({
		url: urlSignInInit,
		type: "get",
		async: true,
		dataType: "json",
		beforeSend:function(){
			$("#loadingToast").show();
		},
		complete:function(){
			$("#loadingToast").hide();
		},
		success:function(data){
			if(data.status == 0){
				if(data.data.signIn){
					var trueData = data.data.signIn;
					$("img").show().attr("src",trueData.pic);
					$(".upload-img-bg").css("background","url('"+trueData.pic+"') no-repeat center").css("background-size","cover").removeClass("hide");
					$("#distance").val(trueData.distance);
					$("#time").val(trueData.time);
					$("#choose-time").val(trueData.duration);
				}else{
					$("img").hide();
					$(".upload-img-bg").addClass("hide");
				}
			}
		},
		error: function(){
			Alert.show({
		        content: "网络错误，请重试",
		    })
		}
	})
}
// 选择图片
function chooseImg(){
	wx.chooseImage({
	    count: 4, // 默认9
	    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
	    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
	    success: function (res) {
	    	//console.log(res)
	        var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
	        uploadImg(localIds);
	    },
	    error: function(){
	    	alert("failed");
	    }
	});
}

// 上传图片
function uploadImg(imgId){
	wx.uploadImage({
	    localId: imgId.toString(), // 需要上传的图片的本地ID，由chooseImage接口获得
	    isShowProgressTips: 1, // 默认为1，显示进度提示
	    success: function (res) {
	        var serverId = res.serverId; // 返回图片的服务器端ID
	        getImgUrl(serverId);
	    }
	});
}

// 预览图片
function previewImg(){
	var url = $("#img").attr("src");
	wx.previewImage({
	    current: url, // 当前显示图片的http链接
	    urls: [url] // 需要预览的图片http链接列表
	});
}

// 获取图片
function getImgUrl(serverId){
	$.ajax({
		url: urlUploadImg,
		type: "post",
		async: true,
		data:{
			media_id: serverId,
			type: "signIn"
		},
		dataType: "json",
		beforeSend:function(){
			$("#loadingToast").show();
		},
		complete:function(){
			$("#loadingToast").hide();
		},
		success:function(data){
			if(data.status == 0){

					app.imgSrc.push(data.data.url);
				
			}
		},
		error: function(){
			Alert.show({
		        content: "网络错误，请重试",
		    })
		}
	})
}

// 提交动态图片
function submitSignIn(){
	var imgUrl = $("#img").attr("src");
	var myWeight = $("#my-weight").val().trim();
	 var emotionWord= $("#emotion-word").val().trim();
	var isOne= checkDecimal(myWeight);
	if(!isOne){
		Alert.show({
	        content: "体重最多为一位小数"
	    });
		return false;
	}
	$.ajax({
		url: urlSignIn,
		type: "post",
		async: true,
		data:{
			pic: imgUrl,
			pic_type: "url",
			myWeight: myWeight,
			emotionWord: emotionWord,
		},
		dataType: "json",
		beforeSend:function(){
			$("#loadingToast").show();
		},
		complete:function(){
			$("#loadingToast").hide();
		},
		success:function(data){
			if(data.status == 0){
				Alert.show({
			        content: "发送成功",
			        sure: function(){
			        	WeixinJSBridge.call('closeWindow');
			        }
			    });
			}
		},
		error: function(data){
			Alert.show({
		        content: data.responseText
		    });
		}
	})
}

// 微信配置
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
