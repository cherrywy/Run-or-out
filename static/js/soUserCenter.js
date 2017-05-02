//var Alert = require('../modules/alert.js');
var Modal = require('../modules/modal.js');
var Navigation = require('../components/navigation/navigation.js');
var NavigationItem = require('../components/navigation/navigation-item.js');
var navigationModule = require('../components/navigation/modules/navigation.js');
var userModule = require('../components/modules/user.js');

// components
var NavigationComp = Vue.extend(Navigation);
var NavigationItemComp = Vue.extend(NavigationItem);
Vue.component('xo-navigation', NavigationComp);
Vue.component('xo-navigation-item', NavigationItemComp);

// vuex
var store = new Vuex.Store({
    modules: {
        navigation: navigationModule,
        user: userModule
    }
})
var jsSdK=null;
var app = new Vue({
	el: '#userCenter-v',
	store: store,
	data: {
		userInfo:null,
		invited:false,
		schoolJoin:null,
		classState:""
	},
	vuex: {
		getters: {
			user: function(state) {
				return state.user;
			}
		}
	},
	methods: {
		myAccount:function(){
			MtaH5.clickStat('usercentermyaccount');
			window.location.href = "/page/withdraw";
		},
		remindSetting:function(){
			MtaH5.clickStat('usercenterremindsetting');
			window.location.href = "/page/user/param/alert";
		},
		emergency:function(){
			MtaH5.clickStat('usercenteremergency');
			window.location.href = "/page/feedback/emergency";
		},
		inviteFriend:function(){
			MtaH5.clickStat('usercenterinvitedfriend');
			this.invited=true;
		}
	},
	ready: function() {
		var vm = this;

		Vue.http.get(urlHead + 'ajax/user/baseInfo').then(function(response) {
			var data = response.data.data;
			vm.$store.dispatch('SET_USER_NICKNAME', data.nickname);
			vm.$store.dispatch('SET_USER_AVATAR', data.avatar);
			vm.$store.dispatch('SET_ROUTE_AVATAR', data.avatar);
			vm.$store.dispatch('SET_ROUTE_ACTIVE', 2);
		});
	}
});

$(function() {
	getInfo();
	getItem();
	getParticiation();
	 getConfig();
	 
	  wx.config({
        debug: false,
        appId: jsSdK.appId, // 必填，公众号的唯一标识
        timestamp: jsSdK.timestamp, // 必填，生成签名的时间戳
        nonceStr: jsSdK.nonceStr, // 必填，生成签名的随机串
        signature: jsSdK.signature, // 必填，签名，见附录1
        jsApiList: ['chooseImage', 'previewImage', 'uploadImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
	
	$(".content-center").on("click",".qiyue-class",function(){
		MtaH5.clickStat('usercenterqiyueclass');
		if(app.classState=="进行中"){
			window.location.href="/page/sign_in";
			//进入契约打卡
		}else if(app.classState=="查看历史"){
			//进入契约打卡
			window.location.href="/page/sign_in";
		}else{
			//进入班级列表
			window.location.href="/page/team/list";
		}
	});
	
	$(".content-center").on("click",".bushouxueyuan",function(){
		MtaH5.clickStat('usercenterbushouschool');
		window.location.href="/page/college";
	});
	
	/*if(app.classState=="进行中"){
		
	}*/
	
	
});

function getInfo() {
	if(userData.status==0){
		app.userInfo=userData.data;
	}
}




//个人信息数据模拟
var userData={
	data:{
		name:"李瑶不过百",
		classState:'active'
	},
	status:0,
	message:'成功'
}

function invitedcancel(){
	app.invited=false;
}

//不瘦学院状态
Vue.filter("state",function(value){
	if(value==1){
		return "点击报名";
	}else{
		return "进行中";
	}
})


//契约班级状态

Vue.filter("classState",function(value){
	if(value==1){
		return "进行中";
	}else if(value==2){
		return "点击报名";
	}else{
		return "查看历史";
	}
})

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
				if(data.data.list.length==0){//学院报过名
					app.schoolJoin=1;
				}else{
					app.schoolJoin=2;
				}
			}
		}
	});
}


function getParticiation(){
		$.ajax({
		url:urlparticiation,
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
				var today=getToday();
				if(data.data.length==0){
					//点击报名（蓝色）
					app.classState="点击报名";
				}else{
					for(var i=0;i<data.data.length;i++){
						if(today>=addByTransDate(getDate(data.data[i].start_date),-4)&&today<=addByTransDate(getDate(data.data.finish_date),1)){
							//进行中（蓝色）
							app.classState="进行中";
						}else{
							//查看历史
							app.classState="查看历史";
						}
					}
				}
			}
		}
	});
}



function getDate(date){
	var data=new Date(date);
	var year=data.getFullYear();
	var month=data.getMonth()+1;
	var day=data.getDate();
	return year+"-"+month+"-"+day;
}

//获取一个日期之后的num天的日期
function addByTransDate(dateParameter, num) { //dateParameter是2006-12-18格式 
	var translateDate = "",
		dateString = "",
		monthString = "",
		dayString = "";
	translateDate = dateParameter.replace("-", "/").replace("-", "/");
	var newDate = new Date(translateDate);
	newDate = newDate.valueOf();
	newDate = newDate + num * 24 * 60 * 60 * 1000;
	newDate = new Date(newDate);
	//如果月份长度少于2，则前加 0 补位   
	if((newDate.getMonth() + 1).toString().length == 1) {
		monthString = 0 + "" + (newDate.getMonth() + 1).toString();
	} else {
		monthString = (newDate.getMonth() + 1).toString();
	}
	//如果天数长度少于2，则前加 0 补位   
	if(newDate.getDate().toString().length == 1) {
		dayString = 0 + "" + newDate.getDate().toString();
	} else {
		dayString = newDate.getDate().toString();
	}
	dateString = newDate.getFullYear() + "-" + monthString + "-" + dayString;
	return dateString;
}

function getSchoolInvited(){
	MtaH5.clickStat('usercenterschoolinvited');
	$.ajax({
		url:urlSchoolInvited,
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
				Modal.alert({
					title:"下载邀请卡",
					type:"confirm",
					content:"邀请卡已通过公众号发送给你，点击前往公众号下载分享",
					cancelBtnText:"取消",
					sureBtnText:"前往下载",
					sure:function(){
						 wx.closeWindow();
					}
				});
			}	
		}
	});
}
function getClassInvited(){
	MtaH5.clickStat('usercenterclassinvited');
	$.ajax({
		url:urlClassInvited,
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
				Modal.alert({
					title:"下载邀请卡",
					type:"confirm",
					content:"邀请卡已通过公众号发送给你，点击前往公众号下载分享",
					cancelBtnText:"取消",
					sureBtnText:"前往下载",
					sure:function(){	
						 wx.closeWindow();
					}
				});
			}
		}
	});
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
