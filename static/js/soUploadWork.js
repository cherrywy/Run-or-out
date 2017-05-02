//status=1:正在审核
//status=2:提交过，但是未审核通过
//status=4:审核通过


//按钮状态
//buttonType:1;//灰色提交按钮
//buttonType:2;//蓝色提交按钮
//buttonType:3;//审核通过按钮
//buttonType:4;//提交审核按钮

var Modal = require('../modules/modal.js');

var app = new Vue({
	el: '#v-Upload-List',
	data: {
		isShow: false,
		uploadList: [],
		jsSdK: null,
		stateBtn: "提交",
		SignUp: [],
		buttonType: 1,
		showList: [],
		temp: [],
		tempObject: {},
		showText: "",
		countdown: false,
		finshCountDown:false,
		serverIds:[0,0],  //pic数组
		picTypes:[],
		picType:"",	//瘦前打卡还是瘦后打卡
		types:[],
		type:"",//全身照还是半身照
		weight:"",
		isShow:false,
		rules:[
    		{
    			title:'契约打卡',
    			image_bg:'1',
    			iconName:'icon-icongroup',
    			content:[
                    {
                        question:'是否必须打卡？ ',
                        answer:'是的，不打卡则无法正常参加不瘦就出局，且契约金无法取回。'
                    },
    				{
    					question:'什么时候瘦前打卡？ ',
    					answer:'瘦身期开始前均可打卡，打卡后由工作人员审核，审核合格与否会通过公众号通知你，不通过的话，需要在倒计时结束前重新提交。'
    				},
    				{
    					question:'什么时候瘦后打卡？ ',
    					answer:'瘦身期4周后，就可以打卡，届时公众号会通知你进行打卡，同样有审核，不合格可重新提交。'
    				},
    				{
    					question:'什么样的打卡为合格？ ',
    					answer:'全身照、上秤照、体重值三样均提交。上秤照中的体重值要清晰，且与你输入的体重值相等。体重值单位以kg，100斤=50kg。正确输入示例“52.4”。'
    				},
    				
    			]
    		}

    	],
	},
	methods: {
			hideRules:function(){
				app.isShow=false;
			},
			Question:function(){
				MtaH5.clickStat('uploadworkquestion');
				this.isShow=true;
			}
	}
});

$(function() {
	getInfo();
	getConfig();
	$(".List-content").on("click", ".iconshow", function(e) {
		e.preventDefault();
		$(this).parent().parent().parent().siblings('.Content-detail').toggle();
		if($(this).parent().children().hasClass("icon-xiangxia")) {
			MtaH5.clickStat('uploadworkshow');
			$(this).parent().children().removeClass("icon-xiangxia").addClass("icon-xiangshang");
		} else {
			MtaH5.clickStat('uploadworkhide');
			$(this).parent().children().removeClass("icon-xiangshang").addClass("icon-xiangxia");
		}
	});
	
	$(".List-content").on("click", "#preall", function(e) {
		app.picType="1";
		app.type="1";
		e.preventDefault();
		chooseImg();
	});
	
	$(".List-content").on("click", "#prehalf", function(e) {
		app.picType="1";
		app.type="2";
		e.preventDefault();
		chooseImg();
	});
	
	$(".List-content").on("click", "#afterall", function(e) {
		app.picType="2";
		app.type="1";
		e.preventDefault();
		chooseImg();
	});
	
	$(".List-content").on("click", "#afterhalf", function(e) {
		app.picType="2";
		app.type="2";
		e.preventDefault();
		chooseImg();
	});
	
	wx.config({
		debug: false,
		appId: app.jsSdK.appId, // 必填，公众号的唯一标识
		timestamp: app.jsSdK.timestamp, // 必填，生成签名的时间戳
		nonceStr: app.jsSdK.nonceStr, // 必填，生成签名的随机串
		signature: app.jsSdK.signature, // 必填，签名，见附录1
		jsApiList: ['chooseImage', 'previewImage', 'uploadImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	});
});
//获取数据的方法
function getInfo() {
	$.ajax({
			url: urlSignInInit,
			type: "get",
			dataType: "json",
			beforeSend: function() {
				$("#loadingToast").show();
			},
			complete: function() {
				$("#loadingToast").hide();
			},
			success: function(data) {
				if(data.status==0){
						//当前期的开始时间，结束时间
						app.uploadList = data.data.participation;
						//获取班级名称和开班日期
						app.classInfo = data.data.team;
						//提交反馈
						app.SignUp = data.data.signUp;
						//获取今天的日期
						var today = getToday();
						//var today="2017-01-17";
						for(var i = 0; i < app.uploadList.length; i++) {
							for(var j = 0; j < app.classInfo.length; j++) {
								if(app.uploadList[i].team_id == app.classInfo[j].id) {
									app.uploadList[i].name = app.classInfo[j].name;
									app.uploadList[i].open_date = app.classInfo[j].open_date;
								}
							}
						}
						
						//当一次报名多个周期时，拆分报名信息
						for(var i=0;i<app.uploadList.length;i++){
							var cycle=getCycle(app.uploadList[i].start_date.split(" ")[0], app.uploadList[i].finish_date.split(" ")[0]);
							if(cycle==1){
								app.showList.push(app.uploadList[i]);
							}else{
								for(var j=0;j<cycle;j++){
									app.tempObject = app.uploadList[i];
									app.tempObject.start_date = addByTransDate(app.uploadList[i].start_date.split(" ")[0], j * 30);
									app.tempObject.finish_date = addByTransDate(app.uploadList[i].finish_date.split(" ")[0], (j - cycle + 1) * 30);
									app.showList.push(app.tempObject);
								}
							}
						}
						
						//组装要显示的班级信息
//						for(var i=0;i<app.showList.length;i++){
//							for(var j=0;j<app.classInfo.length;i++){
//								console.info(app.showList[i]);
//								console.info(app.showList[i].team_id);
//								if(app.showList[i].team_id==app.classInfo[j].id){
//									app.uploadList[i].name = app.classInfo[j].name;
//									app.uploadList[i].open_date = app.classInfo[j].open_date;
//								}
//							}
//						}
						
						for(var i = 0; i < app.showList.length; i++) {
							app.showList[i].finish_date1 = addByTransDate(app.showList[i].finish_date.split(" ")[0], 1);
							app.showList[i].status = getState(app.showList[i].start_date, app.showList[i].finish_date);
	
							app.showList[i].cycle_num = getCycle(app.showList[i].open_date.split(" ")[0], app.showList[i].finish_date.split(" ")[0]);
							
						}
						
						//判断展开以后显示的信息
						for(var i=0;i<app.showList.length;i++){
							/*瘦前打卡时间计算start************************************************************************************************/
							
							//开跑前3天的日期：打卡开始时间
							app.showList[i].start_date1 = addByTransDate(app.showList[i].start_date.split(" ")[0], -3);
							//开跑后一天：打卡截止日期
							app.showList[i].start_date2 = app.showList[i].start_date.split(" ")[0];
							//开跑后第二天：显示多少天前是有效的
							app.showList[i].start_date3 = addByTransDate(app.showList[i].start_date.split(" ")[0], 1);
							
							//在打卡周期后显示的相对应的两种状态
							app.showList[i].showCountDown1=dateCheck(app.showList[i].start_date3)+"前打卡有效";//在打卡周期内显示
							app.showList[i].showText = dateCheck(app.showList[i].start_date1) + "~" + dateCheck(app.showList[i].start_date2) + "可提交";
							
							if(today<app.showList[i].start_date1){//在周期开始前3天的状态：按钮应该是灰色提交，图片应该是系统默认
								app.showList[i].countdown = false;//显示文本 **月**日~**月**日可提交		
								app.showList[i].buttonType1 = 1;//按钮灰色不可提交
								//图片应该是默认图片
							}else if(today>app.showList[i].start_date2){//在周期的后一天的时间里，按钮应该有两种状态，灰色的提交按钮和审核通过
								var count=0;//用于判断是否存在，当前的打卡信息，如果存在count=1,不存在count=0
								for(var j=0;j<app.SignUp.length;j++){
									if(app.showList[i].cycle_id == app.SignUp[j].cycle_id&&app.SignUp[j].pic_type==1){//存在他的瘦前打卡信息
										app.showList[i].img=app.SignUp[j].pic;
										app.showList[i].weight1=app.SignUp[j].weight;
										app.showList[i].showInput1=true;
										if(app.SignUp[j].status.body==4&&app.SignUp[j].status.scale==4&&app.SignUp[j].status.weight==4){//返回审核通过的信息
											//图片应该为提交的打卡图片
											//按钮应该为审核通过
											app.showList[i].buttonType1=3;
										}else{
											if(app.SignUp[j].status.body==5){
												//全身照未通过
												app.showList[i].showBody1=true;
											}
											if(app.SignUp[j].status.scale==5){
												app.showList[i].showScale1=true;
												//半身照未通过
											}
											if(app.SignUp[j].status.weight==5){
												app.showList[i].showWeight1=true;
												//体重数据未通过
											}
											app.showList[i].buttonType1=1;
											//按钮为灰色的提交按钮
											//图片为提交打卡的图片
										}
										count++;
									}
								}
								if(count==0){//超过打卡时间，但是没有他的打卡信息
									app.showList[i].buttonType1=1;
									//按钮应该为灰色的提交按钮
									//图片应该是系统默认的图片
								}
								
							}else{//在瘦前打卡的四天时间里，按钮应该有三种状态（蓝色提交按钮，审核通过按钮，正在审核按钮），图片也是应该有三种状态（审核通过返回打卡图片，正在审核，用正在打卡图片，还未提交时系统默认图片）
								var count1=0;
								for(var j=0;j<app.SignUp.length;j++){
									if(app.showList[i].cycle_id == app.SignUp[j].cycle_id&&app.SignUp[j].pic_type==1){//后台有他的打卡信息
										app.showList[i].img=app.SignUp[j].pic;
										app.showList[i].weight1=app.SignUp[j].weight;
										app.showList[i].showInput1=true;
										if(app.SignUp[j].status.body==4&&app.SignUp[j].status.scale==4&&app.SignUp[j].status.weight==4){//返回审核通过的信息
											app.showList[i].buttonType1=3;
											//按钮为审核通过按钮
											//图片为提交打卡的图片
										}else if(app.SignUp[j].status.body==1&&app.SignUp[j].status.scale==1&&app.SignUp[j].status.weight==1){//打卡信息正在审核
											app.showList[i].buttonType1=4;
											//按钮为正在审核按钮
											//图片为提交打卡的图片
										}else{//打卡了，但是没通过
											if(app.SignUp[j].status.body==5){
												app.showList[i].showBody1=true;
												//全身照未通过
											}
											if(app.SignUp[j].status.scale==5){
												app.showList[i].showScale1=true;
												//半身照未通过
											}
											if(app.SignUp[j].status.weight==5){
												app.showList[i].showWeight1=true;
												//体重数据未通过
											}
											app.showList[i].buttonType1=2;
											//按钮为蓝色的提交按钮
											//图片为提交打卡的图片
										}
										count1++;
									}
								}
								if(count1==0){//还未提交打卡的情况
									app.showList[i].buttonType1=2;
									//按钮为蓝色的提交按钮
									//显示的图片为系统的默认图片
								}
							}
							
						/*瘦前打卡时间计算end************************************************************************************************/	
							
						/*瘦后打卡时间计算start************************************************************************************************/
							//瘦后打卡开始时间
							app.showList[i].finish_date1 = addByTransDate(app.showList[i].finish_date.split(" ")[0],-3);
							//瘦后打卡的结束时间
							app.showList[i].finish_date2 = app.showList[i].finish_date.split(" ")[0];
							//瘦后打卡时间往后一天
							app.showList[i].finish_date3 = addByTransDate(app.showList[i].finish_date.split(" ")[0], 1);
							//打卡展开界面text内容判断
							app.showList[i].showCountDown=app.showList[i].finish_date3+"前打卡有效";
							app.showList[i].showText2 = dateCheck(app.showList[i].finish_date1) + "~" + dateCheck(app.showList[i].finish_date2) + "可提交";
							
							if(today<app.showList[i].finish_date1){//现在时间小于打卡时间
								app.showList[i].buttonType2=1;
								//按钮为灰色的提交按钮
								//图像为系统的默认图像
							}else if(today>app.showList[i].finish_date2){//三种情况，一种是审核通过，一种是没有提交，还有一种是提交了，但是审核没通过
								var count2=0;
								for(var j=0;j<app.SignUp[j].length;j++){
									if(app.showList[i].cycle_id == app.SignUp[j].cycle_id&&app.SignUp[j].pic_type==2){
										app.showList[i].img1=app.SignUp[j].pic;
										app.showList[i].weight2=app.SignUp[j].weight;
										app.showList[i].showInput2=true;
										if(app.SignUp[j].status.body==4&&app.SignUp[j].status.scale==4&&app.SignUp[j].status.weight==4){//返回审核通过的信息
											app.showList[i].buttonType2=3;
											//按钮为审核通过按钮
											//图片为提交打卡的图片
										}else{//打卡了，但是没通过
											if(app.SignUp[j].status.body==5){
												app.showList[i].showBody2=true;
												//全身照未通过
											}
											if(app.SignUp[j].status.scale==5){
												app.showList[i].showScale2=true;
												//半身照未通过
											}
											if(app.SignUp[j].status.weight==5){
												app.showList[i].showWeight2=true;
												//体重数据未通过
											}
											app.showList[i].buttonType2=1;
											//按钮为灰色的提交按钮
											//图片为提交打卡的图片
										}
										count2++;
									}	
								}
								if(count2==0){//这个周期没有打卡信息
									app.showList[i].buttonType2=1;
									//按钮应该为灰色的提交按钮
									//图像应该是系统的默认图像
								}
							}else{//在打卡周期内，按钮有三种状态（审核通过，正在审核，蓝色提交）
								var count3=0;
								for(var j=0;j<app.SignUp[j].length;j++){
									if(app.showList[i].cycle_id == app.SignUp[j].cycle_id&&app.SignUp[j].pic_type==2){
										app.showList[i].img1=app.SignUp[j].pic;
										app.showList[i].weight2=app.SignUp[j].weight;
										app.showList[i].showInput2=true;
										if(app.SignUp[j].status.body==4&&app.SignUp[j].status.scale==4&&app.SignUp[j].status.weight==4){//返回审核通过的信息
											app.showList[i].buttonType2=3;
											//按钮为审核通过按钮
											//图片为提交打卡的图片
										}else if(app.SignUp[j].status.body==1&&app.SignUp[j].status.scale==1&&app.SignUp[j].status.weight==1){//打卡信息正在审核
											app.showList[i].buttonType2=4;
											//按钮为正在审核按钮
											//图片为提交打卡的图片
										}else{//打卡了，但是没通过
											if(app.SignUp[j].status.body==5){
												app.showList[i].showBody2=true;
												//全身照未通过
											}
											if(app.SignUp[j].status.scale==5){
												app.showList[i].showScale2=true;
												//半身照未通过
											}
											if(app.SignUp[j].status.weight==5){
												app.showList[i].showWeight2=true;
												//体重数据未通过
											}
											app.showList[i].buttonType2=2;
											//按钮为蓝色的提交按钮
											//图片为提交打卡的图片
										}
										count3++;
									}
								}
								if(count3==0){//这个周期没有打卡信息
									app.showList[i].buttonType2=1;
									//按钮应该为灰色的提交按钮
									//图像应该是系统的默认图像	
								}
							}
							
							
							if(today>=app.showList[i].start_date1&&today<=app.showList[i].finish_date2){
								$("iconshow").parent().children().removeClass("icon-xiangxia").addClass("icon-xiangshang");
							}
						}
						
						
						
				}
			},
			error: function() {
				Modal.alert({
					content: "网络错误，请重试",
				})
			}
		})
}

//从一个日期到另一个日期经过了多少天
function getCycle(startDate, endDate) {
	var startTime = new Date(Date.parse(startDate.replace(/-/g, "/"))).getTime();
	var endTime = new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime();
	var dates = ((endTime - startTime)) / (1000 * 60 * 60 * 24);
	return(dates + 2) / 30;
}

//拍照或从相册中选择图片
function chooseImg() {
	wx.chooseImage({
		count: 1, // 默认9
		sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
		sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
		success: function(res) {
			var localIds = res.localIds;
			// 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
					
			if(app.picType=="1"&&app.type=="1"){
				$("#preall").removeAttr("background-image").css("background","url('"+localIds+"') no-repeat center").css("background-size","cover");
				uploadImg(localIds);
			}else if(app.picType=="1"&&app.type=="2"){
				$("#prehalf").removeAttr("background-image").css("background","url('"+localIds+"') no-repeat center").css("background-size","cover");
				uploadImg(localIds);			
			}else if(app.picType=="2"&&app.type=="1"){
				uploadImg(localIds);
				$("#afterall").removeAttr("background-image").css("background","url('"+localIds+"') no-repeat center").css("background-size","cover");
			}else{
				uploadImg(localIds);
				$("#afterhalf").removeAttr("background-image").css("background","url('"+localIds+"') no-repeat center").css("background-size","cover");
			}
		},
		error: function() {
			alert("failed");
		}
	});
}

function uploadImg(imgId) {
	MtaH5.clickStat('uploadworkuploadimg');
	wx.uploadImage({
		localId: imgId.toString(), // 需要上传的图片的本地ID，由chooseImage接口获得
		isShowProgressTips: 1, // 默认为1，显示进度提示
		success: function(res) {
			var serverId = res.serverId; // 返回图片的服务器端ID
			
			if(app.type==1){
				app.serverIds[0]=serverId;
			}else{
				app.serverIds[1]=serverId;
			}
			/*if(app.picTypes.length==1){
				app.serverIds.push(serverId);
				app.types.push(app.type);
				app.picTypes.push(app.picType);
			}else{
				for(var i=0;i<=app.picTypes.length;i++){
					if(app.type==app.types[i]){
						app.serverIds[i]=serverId;
						app.types[i]=app.type;
						app.picTypes[i]=app.picType;
						continue;
					}
				}
			}*/
		}
	});
}
//预览图片
function previewImg() {
	var url = $("#preall").attr("background");
	wx.previewImage({
		current: url, // 当前显示图片的http链接
		urls: [url] // 需要预览的图片http链接列表
	});
}
//判断班级的当前状态
function getState(startDate, finishDate) {
	var today = getToday();
	//var today="2017-01-17";
	if(today > finishDate) {
		return "finished"
	} else if(today <= startDate) {
		return "pending";
	} else {
		return "active";
	}
}

function submitSignIn(picType,teamId,particityId) {
	MtaH5.clickStat('uploadworksubmit');
	//var weight = $("#opInput").val();
	var weight=app.weight;
	if(app.serverIds[0]==0||app.serverIds[1]==0){
		Modal.alert({
			content:"请上传本人照片",
		});
		return false;
	}
	if(weight==null||weight==""){
		Modal.alert({
			content:"请输入体重数据",
		});
		return false;
	}
	$.ajax({
		url: urlSignIn,
		type: "post",
		async: true,
		data: {
			weight: weight,
			pic: app.serverIds,//两个图片的url
			pic_type: picType, //瘦前1，瘦后2
			//participation_id: particityId,
			//team_id: teamId,
		},
		dataType: "json",
		beforeSend: function() {
			$("#loadingToast").show();
		},
		complete: function() {
			$("#loadingToast").hide();
		},
		success: function(data) {
			if(data.status == 0) {
				
				
				Modal.alert({
					content: "打卡成功",
					sure: function() {
						WeixinJSBridge.call('closeWindow');
					}
				});
			}else{
				alert(data.status);
			}
		},
		error: function(data) {
			Modal.alert({
				content: data.responseText
			});
		}
	})
}

//当前状态判断
Vue.filter('status', function(state) {
	if(state == 'active') {
		state = '进行中';
	} else if(state == 'pending') {
		state = '待开始';
	} else {
		state = '已结束';
	}
	return state;
})

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
//从一个日期到另一个日期经过了多少天
function getCycle(startDate, endDate) {
	var startTime = new Date(Date.parse(startDate.replace(/-/g, "/"))).getTime();
	var endTime = new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime();
	var dates = ((endTime - startTime)) / (1000 * 60 * 60 * 24);
	return(dates + 2) / 30;
}

//微信JS-JDK
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
			app.jsSdK = data;
		}
	});
}
//倒计时（开始日期-div名字）
/*function ShowCountDown(year, month, day) {
	var now = new Date();
	var endDate = new Date(year, month - 1, day);
	var leftTime = endDate.getTime() - now.getTime();
	var leftsecond = parseInt(leftTime / 1000);
	var day1 = Math.floor(leftsecond / (60 * 60 * 24));
	var hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
	var minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);
	var second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);
	//var cc=document.getElementsByClassName("countdown");
	cc.innerHTML = day1 + "天" + hour + "小时" + minute + "分" + second + "秒";
	//return day1 + "天" + hour + "小时" + minute + "分" + second + "秒";
}*/


/*window.setInterval(function() {
	ShowCountDown(2010, 4, 20, 'divdown1');
}, interval);*/

//获取当前时间

/*Vue.filter("show", function(value) {
	var current = new Date(value);
	var year = current.getFullYear();
	var month = current.getMonth() + 1;
	var day = current.getDate();
	var now;
	window.setInterval(function() {
		 now = new Date().getTime();
	}, 1000);
	var endDate = new Date(year, month - 1, day);
	var leftTime = endDate.getTime() - now;
	var leftsecond = parseInt(leftTime / 1000);
	var day1 = Math.floor(leftsecond / (60 * 60 * 24));
	var hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
	var minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);
	var second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);
	return day1 + "天" + hour + "小时" + minute + "分" + second + "秒";
});*/


Vue.filter("show",function(finish,current){
	var leftTime = finish - current;
	var leftsecond = parseInt(leftTime / 1000);
	var day1 = Math.floor(leftsecond / (60 * 60 * 24));
	var hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
	var minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);
	var second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);
	//var cc=document.getElementsByClassName("countdown");
	return  finish;
	//return day1 + "天" + hour + "小时" + minute + "分" + second + "秒";
})



Vue.filter("show",function(value,finish){
	
})

function selectShow(finishdate) {
	var date = new Date(finishdate);
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();

	ShowCountDown(year, month, day);

}

function dateCheck(value) {
	var myDate = new Date(value);
	var month = myDate.getMonth() + 1;
	var day = myDate.getDate();
	return month + "." + day;
}

//时间格式处理
Vue.filter("dateCheck", function(value) {
	var myDate = new Date(value.replace(/-/g, '/'));
	var month = myDate.getMonth() + 1;
	var day = myDate.getDate();
	return month + "月" + day + "日";
});

//班级周期数阿拉伯数字转换为汉语
Vue.filter("change", function(num) {
	if(!/^\d*(\.\d*)?$/.test(num)) {
		return "NaN";
	}
	var AA = new Array("零", "一", "二", "三", "四", "五", "六", "七", "八", "九");
	var BB = new Array("", "十", "百", "千", "万", "亿", "", "");
	var a = ("" + num).replace(/(^0*)/g, "").split("."),
		k = 0,
		re = "";
	for(var i = a[0].length - 1; i >= 0; i--) {
		switch(k) {
			case 0:
				re = BB[7] + re;
				break;
			case 4:
				if(!new RegExp("0{4}\\d{" + (a[0].length - i - 1) + "}$").test(a[0]))
					re = BB[4] + re;
				break;
			case 8:
				re = BB[5] + re;
				BB[7] = BB[5];
				k = 0;
				break;
		}
		if(k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = AA[0] + re;
		if(a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re;
		k++;
	}

	if(a.length > 1) //加上小数部分(如果有小数部分) 
	{
		re += BB[6];
		for(var i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)];
	}
	return re;
});

var cloneObj = function(obj) {
	var str, newobj = obj.constructor === Array ? [] : {};
	if(typeof obj !== 'object') {
		return;
	} else if(window.JSON) {
		str = JSON.stringify(obj), //序列化对象
			newobj = JSON.parse(str); //还原
	} else {
		for(var i in obj) {
			newobj[i] = typeof obj[i] === 'object' ? cloneObj(obj[i]) : obj[i];
		}
	}
	return newobj;
};

Vue.filter("button", function(value) {
	if(value == 1 || value == 2) {
		return "提交";
	} else if(value == 3) {
		return "审核通过";
	} else {
		return "提交审核中";
	}
})

Vue.filter('nullImg', function(value) {
    if (value != null && value != '') {
        return value;
    } else {
        return 'https://www.runorout.cn/images/photo.png';
    }
})

