var  Modal = require('../modules/modal.js');
var Pager = require('../modules/pagermore.js');
var id = $.getUrlParam("team_id");
// var id="587057b53684f67e6f0000b2";
var referee = $.getUrlParam("referee");
var type = $.getUrlParam("type");
var tab = $.getUrlParam("tab");
var inflate = $.getUrlParam("inflate");
var jsSdK = null;//微信接口 


// require
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
        user: userModule,
    }
})

var app = new Vue({
    el: '#detail-class-v',
    store: store,
    data: {
       localwy:[],//记录本地图片总数组
       pageMore:true,
       isBlue:false,//发送按钮是否可点击
       imgSrc:[],//发表动态图片地址数组
       ClassownListImg:[],//班级预览数组
       ownListImg:[],//个人预览数组
       textarea: "",
       weight:"",
       type:0, // tab页面的类型
       count:4,
       classInfo:null,//班级详情
       teamCycle:null,//周期
       classInfoWall:null,//班级墙
       newfinsh_date:null,//新最后一天
       newnextfinsh_date:null,//新下周最后一天
       start_date:null,
       finish_date:null,
       serverIds:[],
       logList:[],//朋友圈动态获取列表
       zhouqi:1,
       nextzhouqi:1,
       nextteamCycleStart_date:null,
       nextteamCycleFinish_date:null,
       participation:[],//报名周期id
       canBm:false,//是否可以报名
       canBmself:false,//是否在本班
       canotBm:false,//不能报
       ownList:[],//个人动态数组
       ownListUser:[],//用户信息
       ownListImg:[],//动态数组图片
       ClassownList :[],//班级朋友圈动态
       ClassOwn:null,//用户信息
       applyClass:1,//是否报班
       isNext:false,//是否是下一期
       body:[
             {className:"myself-class"},
             {className:"myself-log"},
             {className:"soRankList-class"},   
       ],
       //支付数据
       	weekNum:1,			//报名周数
		weekMoney:0,		//每期钱数
		totalMoney:0,		//总金额
		accountMoney:0,		//账户余额
		discountMoney:0,	//账户可抵扣金额
		
		needPay:0,			//还需支付多少钱
		payBtn:'',			//支付按钮
		
		isUseAccount:true,  //是否启用账户支付
		
		orderId:null,       //支付订单号
		start_date:"",      //班级最近一个周期的开始时间，从班级主页中获取
		
		inputShow:false,
		
		telphone:'点击输入',
		
		registration:false,
    },
    watch:{

    },
    methods:{
         
    	showTab:function(type){
    		if(type==0){
    			MtaH5.clickStat('detailclassclassdynamic');
    		}else if(type==1){
    			MtaH5.clickStat('detailclassmyselfdynamic');
    		}else{
    			MtaH5.clickStat('detailclassslimtable');
    		}
    		this.type=type;
         
    	},
        
        //邀请卡
        showInvite: function() {
        	MtaH5.clickStat('detailclassdownloadinvited');
                $.ajax({
                    url: urlGetInviteCard,
                    data: {
                        team_id: id
                    },
                    type: "get",
                    async: true,
                    dataType: "json",
                    beforeSend: function() {
                        $("#loadingToast").show();
                    },
                    complete: function() {
                        $("#loadingToast").hide();
                    },
                    success: function(data) {
                         Modal.alert({
                            content: "邀请卡已通过不瘦就出局公众号发送给你，请前往保存分享",
                            type: "confirm",
                            sureBtnText: "前往下载",
                            cancelBtnText:"取消",
                            sure:function(){
                                wx.closeWindow();
                            },
                        });
                    },
                    error: function() {
                        Modal.alert({
                            content: "邀请卡无法发送",
                            type: "alert",
                            cancelBtnText:"确认",
                           
                     
                         });
                    },
                })
        },
        // 点赞
        favor: function(index,listId){
            if(listId[index].thumb_up){
                cancelFavorOther(index,listId);
            }else{
                favorUserOther(index,listId);
            }
        },
        
        //删除
         cancelOwnList:function(index,listId){
             cancelownList(index,listId);
         },
        
         // 提交动态图片
         submitSignIn:function(){
            var imgUrl=app.serverIds;
            var myWeight = $("#my-weight").val().trim();
            var emotionWord= $("#emotion-word").val().trim();
            var isOne= checkDecimal(myWeight);
            if(!isOne){
               setTimeout(function(){
                    Modal.alert({
                    content: "体重最多为一位小数"
                })},1000);
               
                return false;
            }
            $.ajax({
                url: urlMomentCreate,
                type: "post",
                async: true,
                data:{
                    pic:imgUrl,
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
                         

                                window.location.href = urlHead + 'page/team/detail?team_id=' + id + '&' + 'tab=1';
                    }
                },
                error: function(data){
                     Modal.alert({
                       content: "发送失败，请重试",
                    })
                }
            })
        },
        showInput:function(){
        	MtaH5.clickStat('detailclassinputtel');
			this.telphone='';
			this.inputShow=true;
		},
		save:function(){
			MtaH5.clickStat('detailclasstelsave');
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
    },
    ready: function() {
        var vm = this;

        Vue.http.get(urlHead + 'ajax/user/baseInfo').then(function(response) {
            var data = response.data.data;

            vm.$store.dispatch('SET_USER_NICKNAME', data.nickname);
            vm.$store.dispatch('SET_USER_AVATAR', data.avatar);
            vm.$store.dispatch('SET_ROUTE_AVATAR', data.avatar);
            vm.$store.dispatch('SET_ROUTE_ACTIVE', 1);
        })
    }	
});

$(function() {
    //微信接口配置
    getConfig();
    getUserAccountMoney();
    wx.config({
        debug: false,
        appId: jsSdK.appId, // 必填，公众号的唯一标识
        timestamp: jsSdK.timestamp, // 必填，生成签名的时间戳
        nonceStr: jsSdK.nonceStr, // 必填，生成签名的随机串
        signature: jsSdK.signature, // 必填，签名，见附录1
        jsApiList: ['chooseImage', 'previewImage', 'uploadImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
        // 配置正确的tab页面
    if(tab==0||tab==1||tab==2){
        app.type=tab;

    }
     // 是否报班
     if(inflate==true||inflate==false){
        app.applyClass=inflate;

    }
    //班级详情调用
     getInfo();
    
	//展示规则细节
     $(".body").on("click",".iconshow",function(e){
     		MtaH5.clickStat('detailclassshowkdm');
            e.preventDefault();
            $(this).hide().siblings('.rules').show();
     });

     //弹出分享页
      $(".share-fx").on("click", function() {
      	MtaH5.clickStat('detailclassdownsharebutton');
		$("#shareit").show();
	});
	//关闭分享班级
	$(".btn-close").on("click", function() {
		$("#shareit").hide();
	});
    $("#shareit>.bg").on("click", function() {
        $("#shareit").hide();
    });
	 //弹出发表动态页
       $(".camera1").on("click", function() {
        MtaH5.clickStat('detailclasscamera');
        $("#logit").show();
        $("body,html").css({"overflow":"hidden","height":"100%"});
    });
      $(".camera").on("click", function() {
      	MtaH5.clickStat('detailclasscamera');
		$("#logit").show();
        $("body,html").css({"overflow":"hidden","height":"100%"});
	});
       $("#logit>.bg").on("click", function() {
        $("#logit").hide();
        $("body,html").css({"overflow":"auto"});
    });
   
    
 /*   $(".pay-content").on('click','.icon-jianhao',function(e){
  	* 	MtaH5.clickStat('detailclassreducenum');
		e.preventDefault();
		if(app.weekNum!=1){
			app.weekNum--;
		}
		changeMoney();
	});
	$(".pay-content").on('click','.icon-jiahao',function(e){
		MtaH5.clickStat('detailclassaddnum');
		e.preventDefault();
		app.weekNum++;
		changeMoney();
	});*/
	//是否使用账户抵扣
	$(".pay-content").on("click",".iconclick",function(e){
		
		 e.preventDefault();
		 //$(this).parent().parent().parent().siblings('.Content-detail').toggle(); 
		 if($(this).parent().children().hasClass("icon-fangxingxuanzhongfill")){
		 	MtaH5.clickStat('detailclassnoaccount');
		 	$(this).parent().children().removeClass("icon-fangxingxuanzhongfill").addClass("icon-fangxingweixuanzhong");
		 	$(this).parent().children().removeClass("color-blue").addClass("color-96");
		 	app.isUseAccount=false;
		 }else{
		 	MtaH5.clickStat('detailclassdownsharebutton');
		 	$(this).parent().children().removeClass("icon-fangxingweixuanzhong").addClass("icon-fangxingxuanzhongfill");
		 	$(this).parent().children().removeClass("color-96").addClass("color-blue");
		 	app.isUseAccount=true;
		 }
		changeMoney(); 
	})


})
//班级朋友圈动态
getCycleList();
//个人动态
 getownList();
 
 
 function payParticity(){
 	MtaH5.clickStat('detailclasssignup');
 	app.registration=true;
 }
//班级详情
function getInfo() {
    $.ajax({
        url: urlGetClassInfo + "?team_id=" + id,
        type: "get",
        async: true,
        dataType: "json",
        beforeSend: function() {
            $("#loadingToast").show();
        },
        complete: function() {
            $("#loadingToast").hide();
        },
        success: function(data) {
             if (data.status == 0) {
                 
                    app.classInfo =data.data.team;
                    app.weekMoney=toDecimal2(data.data.team.money/100);
                    app.teamCycle=data.data.teamCycle;
                    app.classInfoWall=data.data.SignUpNum;

                   
                   app.zhouqi=teamCycle(app.teamCycle.start_date)-teamCycle(app.classInfo.open_date)+1;
                   app.nextzhouqi= app.zhouqi+1;
                   app.newfinsh_date=getNewDay(app.teamCycle.finish_date,"-1");
                   app.newnextfinsh_date=getNewDay(app.teamCycle.finish_date,"29");
                   app.nextteamCycleStart_date= getNewDay(app.teamCycle.start_date,"30") ;

                   app.nextteamCycleFinish_date= getNewDay(app.teamCycle.finish_date,"30");
                   app.participation=data.data.participation;
                   var day=getBaoMing(app.teamCycle.finish_date);
                   var days=getBaoMing(app.teamCycle.start_date);
                  

                   if(0<days&&days<3){

                          if(app.participation!=null&&app.participation.length!=0){

                                for(var i=0;i<app.participation.length;i++){
                                          
                                    //不可报名
                                    if( app.participation[i].start_date<app.teamCycle.start_date&&app.teamCycle.finish_date>app.participation[i].finish_date){
                                         
                                         app.canotBm=true;
                                
                                     }else if( app.participation[i].start_date==app.teamCycle.start_date&&app.teamCycle.finish_date==app.participation[i].finish_date){
                                         
                                          if(app.participation[i].team_id==app.teamCycle.team_id){
                                                   
                                             app.canBmself=true;//已报
                                                
                                           }
                                     } else{
                                        app.canBm=true;
                                       
                                     }         
                                }
                          }else{
                            app.canBm=true;
                           
                          }
                       
                   } else if(0<= day&&day<1){
                     
                            if(app.participation!=null&&app.participation.length!=0){
                                    for(var i=0;i<app.participation.length;i++){
                                    
                                            //不可报名
                                            if( app.participation[i].start_date<app.nextteamCycleStart_date&&app.nextteamCycleFinish_date>app.participation[i].finish_date){
                                       
                                                 app.canotBm=true;
                                               
                                             } else if(app.participation[i].start_date==app.nextteamCycleStart_date&&app.nextteamCycleFinish_date==app.participation[i].finish_date){
                                                  if(app.participation[i].team_id==app.teamCycle.team_id){
                                                    
                                                     app.canBmself=true;//已报名

                                                   }
                                                
                                            } else if(app.participation[i].start_date==app.teamCycleStart_date&&app.teamCycleFinish_date==app.participation[i].finish_date){
                                                                
                                                    if(app.participation[i].team_id==app.teamCycle.team_id){
                                                    
                                                       app.isNext=true;//续报
                                                       

                                                   }else{
                                                      app.canBm=true; 
                                                     
                                                    }
                                                     
                                            }else{
                                                app.canBm=true; 
                                            }
                                    }
                             }else {
                                   
                                    app.canBm=true;  
                                    
                             }


                   }else{
                         app.canotBm=true;
                         
                
                    }
                     //支付信息
                   
                   info();

                }
                  
                  
               
        },
        error: function() {
             Modal.alert({
                content: "加载班级信息失败，请重试",
                type: "alert",
                sureBtnText: "刷新一下",
                sure: function() {
                    window.location.reload();
                }
            })
        }
    });
}

//班级朋友圈
function getCycleList() {
    $.ajax({
        url: urlcycleList + "?team_id=" + id,
        type: "get",
        async: true,
        dataType: "json",
        beforeSend: function() {
            $("#loadingToast").show();
        },
        complete: function() {
            $("#loadingToast").hide();
        },
        success: function(data) {
             if (data.status == 0) {
                 
                app.ClassownList =data.data.momentList; 
                   
                app.ClassOwn=data.data.own; 
            }
        },
        error: function() {
             Modal.alert({
                content: "加载班级信息失败，请重试",
                type: "alert",
                sureBtnText: "刷新一下",
                sure: function() {
                    window.location.reload();
                }
            })
        }
    });
}


Pager.init({
            pageSize:10,
            page:10,
            url:urlcycleList + "?team_id=" + id,
            callback:function(data){
                var pageSize=10;
                
                 if(data.data.momentList.length!=0){
                   
                    if(data.page== 0){
                      
                        app.ClassownList =data.data.momentList;
                        app.ClassOwn=data.data.own; 


                    }else{
                         
                         if(app.ownList!=null){ 
                                app.ClassownList =app.ClassownList .concat(data.data.momentList); 
                                app.ClassOwn =app.ClassOwn.concat(data.data.own); 
                                 

                         }
                    }
                    if(data.data.momentList.length<pageSize){
                         app.pageMore = false;
                    }
                }        
            }
          
 })
//个人朋友圈
function getownList() {
    $.ajax({
        url: urlownList,
        type: "get",
        async: true,
        dataType: "json",
        beforeSend: function() {
            $("#loadingToast").show();
        },
        complete: function() {
            $("#loadingToast").hide();
        },
        success: function(data) {
             if (data.status == 0) {
                 
                app.ownList =data.data.momentList;
                app.ownListUser=data.data.user;       
                  
            }
        },
        error: function() {
             Modal.alert({
                content: "加载班级信息失败，请重试",
                type: "alert",
                sureBtnText: "刷新一下",
                sure: function() {
                    window.location.reload();
                }
            })
        }
    });
}


Pager.init({
            pageSize:10,
            page:10,
            url: urlownList,
            callback:function(data){
                var pageSize=10;
                
                 if(data.data.momentList.length!=0){
                   
                    if(data.page== 0){
                      
                        app.ownList= data.data.momentList;


                    }else{
                         
                         if(app.ownList!=null){ 
                              app.ownList= app.ownList.concat(data.data.momentList); 

                         }
                    }
                    if(data.data.momentList.length<pageSize){
                         app.pageMore = false;
                    }
                }        
            }
          
 })

function getBaoMing(dateStr) {

        var publishTime = getDateTimeStamp(dateStr) / 1000,
        d_seconds,
        d_minutes,
        d_hours,
        d_days,
        timeNow = parseInt(new Date().getTime() / 1000),
        d,
        now=new Date(),
        Y1 = now.getFullYear(),
        date = new Date(publishTime * 1000),
        Y = date.getFullYear(),
        M = date.getMonth() + 1,
        D = date.getDate(),
        H = date.getHours(),
        m = date.getMinutes(),
        s = date.getSeconds();
        //小于10的在前面补0
        if (M < 10) {
                M = '0' + M;
        }
        if (D < 10) {
                D = '0' + D;
        }
        if (H < 10) {
                H = '0' + H;
        }
        if (m < 10) {
                m = '0' + m;
        }
        if (s < 10) {
                s = '0' + s;
        }
       
        d = publishTime-timeNow ;
        d_days = parseInt(d / 86400);
        return d_days;
}
//点赞

function favorUserOther(index,listId){
    $.ajax({
        url: urlFavorUser,
        type: "get",
        async: true,
        data:{
           moment_id:listId[index]._id  
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

                listId[index].thumb_num = listId[index].thumb_num + 1;
                listId[index].thumb_up = true;

            }
        },
        error: function(){
            Alert.show({
                content: "网络连接失败，请重试",
                type: "alert",
            });
        }
    })
}
//取消点赞
function cancelFavorOther(index,listId){
    $.ajax({
        url: urlCancelFavor,
        type: "get",
        async: true,
        data:{
            moment_id:listId[index]._id
            
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
               listId[index].thumb_num = listId[index].thumb_num - 1;
               listId[index].thumb_up = false;
               
            }
        },
        error: function(){
            Alert.show({
                content: "网络连接失败，请重试",
                type: "alert",
            });
        }
    })
}

//删除自己朋友圈动态
function cancelownList(index,listId){
    $.ajax({
        url: urlcycleListDel,
        type: "get",
        async: true,
        data:{
            moment_id:listId[index]._id 
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

                 Modal.alert({
                            title:"系统提示",
                            content: "是否删除",
                            type: "confirm",
                            sureBtnText: "确认",
                            cancelBtnText:"取消",
                            sure:function(){
                                  listId.remove(listId[index]);
                                  $(".alert-out").hide();
                            },
                        });
               
            }
        },
        error: function(){
            Alert.show({
                content: "网络连接失败，请重试",
                type: "alert",
            });
        }
    })
}



// 选择图片
function chooseImg(){
    wx.chooseImage({
        count: app.count,
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            app.imgSrc = app.imgSrc.concat(res.localIds);
            app.count = 4 - app.imgSrc.length;
            syncUpload(localIds);
        },
        error: function(){
            alert("failed");
        }
    });
}
Array.prototype.indexOf = function(val) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == val) return i;
            }
            return -1;
        };
 Array.prototype.remove = function(val) {
            var index = this.indexOf(val);
            if (index > -1) {
                this.splice(index, 1);
            }
        };
//删除图片
function removeImg(url){

app.imgSrc.remove(url);

app.count = 4 - app.imgSrc.length;

var i=app.localwy.indexOf(url);
app.serverIds.splice(i,1);

}
// 上传图片
  function syncUpload(localIds){
        var localId = localIds.shift();
       app.localwy.push(localId);
        wx.uploadImage({
            localId: localId,
            isShowProgressTips: 1,
            success: function (res) {
                var serverId = res.serverId; // 返回图片的服务器端ID
                app.serverIds.push(serverId);
                //其他对serverId做处理的代码
                if (localIds.length>0){
                    syncUpload(localIds);
                }else{

                }
                 
            }   
                
              
        })   
                    
    };
//  预览图片
    function previewImg(url){
            var url = url;
            wx.previewImage({
                current: url, // 当前显示图片的http链接
                urls: app.imgSrc// 需要预览的图片http链接列表
               
            });
     };


 //  预览图片
    function previewLacalImg(url,urls){
            var url = url;
            var arr = urls.split(",");
            wx.previewImage({
                current: url, // 当前显示图片的http链接
                urls: arr ,// 需要预览的图片http链接列表
               
            });
     };



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



function teamCycle(dateStr){
        var publishTime = getDateTimeStamp(dateStr) / 1000,
        d_days,
        date = new Date(publishTime * 1000),
        Y = date.getFullYear(),
        M = date.getMonth() + 1,
        D = date.getDate(),
        H = date.getHours(),
        m = date.getMinutes(),
        s = date.getSeconds();
        //小于10的在前面补0
        if (M < 10) {
                M = '0' + M;
        }
        if (D < 10) {
                D = '0' + D;
        }
        if (H < 10) {
                H = '0' + H;
        }
        if (m < 10) {
                m = '0' + m;
        }
        if (s < 10) {
                s = '0' + s;
        }
        d_days = parseInt( publishTime / 86400/30);
        return d_days;
};
    //日期加上天数得到新的日期  
    //dateTemp 需要参加计算的日期，days要添加的天数，返回新的日期，日期格式：YYYY-MM-DD  
    function getNewDay(dateTemp, days) { 
        var arr = dateTemp.split(" ");

        console.log('target', dateTemp, days);

        var dateTemp = arr[0].split("-");  
        var nDate = new Date(dateTemp[0], dateTemp[1] - 1, dateTemp[2]); //转换为MM-DD-YYYY格式    
        var rDate = new Date(nDate.valueOf() + days * 24 * 60 * 60 * 1000);  
        var year = rDate.getFullYear();  
        var month = rDate.getMonth() + 1;  
        if (month < 10) month = "0" + month;  
        var date = rDate.getDate();  
        if (date < 10) date = "0" + date;
        var result = (year + "-" + month + "-" + date + " " + [rDate.getHours()+"0", rDate.getMinutes()+"0", rDate.getSeconds()+"0"].join(':'));
        console.log(result);
        return result;
    }  


function getDateTimeStamp(dateStr) {
        return Date.parse(dateStr.replace(/-/gi, "/"));
};

Vue.filter('teamCycleDate', function(value) {
    console.log(value);
    var arr = value.split(" ");
    var arr1 = arr[0].split("-");
    return value=arr1[1]+"."+arr1[2];
})

Vue.filter('getZfDiff', function(value) {
         var arr = value.split(",");
        return arr;
                       
})


Vue.filter('thumbNum', function(value) {
         if(value>99){
           return value="99+"
         }else{
            return value;
         }
                       
})


//动态时间处理
Vue.filter('getTimeDiff',function(dateStr) {

        var publishTime = getDateTimeStamp(dateStr) / 1000,
        d_seconds,
        d_minutes,
        d_hours,
        d_days,
        timeNow = parseInt(new Date().getTime() / 1000),
        d,
        now=new Date(),
        Y1 = now.getFullYear(),
        date = new Date(publishTime * 1000),
        Y = date.getFullYear(),
        M = date.getMonth() + 1,
        D = date.getDate(),
        H = date.getHours(),
        m = date.getMinutes(),
        s = date.getSeconds();
        //小于10的在前面补0
        if (M < 10) {
                M = '0' + M;
        }
        if (D < 10) {
                D = '0' + D;
        }
        if (H < 10) {
                H = '0' + H;
        }
        if (m < 10) {
                m = '0' + m;
        }
        if (s < 10) {
                s = '0' + s;
        }
       
        d = timeNow - publishTime;
        d_days = parseInt(d / 86400);
        d_hours = parseInt(d / 3600);
        d_minutes = parseInt(d / 60);
        d_seconds = parseInt(d);
        if (d_days > 1 && d_days < 2) {
                return '昨天'+' '+  H + ':' + m;;
        }else if (d_days <= 0 && d_hours > 0) {
                return d_hours + '小时前';
        } else if (d_hours <= 0 && d_minutes > 1) {
                return d_minutes + '分钟前';
        } else if (d_minutes <= 1&& d_seconds>0) {
                return '1分钟前';
        }else if (Y==Y1&&d_days >= 2) {
                return M + '.' + D +' '+ H + ':' + m;
        } else if (Y<Y1&&d_days >= 2) {
                return Y + '.' + M + '.' + D +' '+H + ':' + m;

        }
})

//获取初始化信息（最少报名周数，每期金额）
function info(){
	app.totalMoney=app.weekMoney*app.weekNum;
	changeMoney();
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
				app.accountMoney = toDecimal2(parseInt(data.data.money)/100);
				
				app.totalMoney=app.weekNum*app.weekMoney;
			}else{
				
			}
		},
		error: function() {
			netWorkError();
		}
	})
	//app.accountMoney = 500;	
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
		if(app.isUseAccount&&app.accountMoney!=0){
			app.needPay=app.totalMoney-app.accountMoney;
			app.payBtn="还需支付"+app.needPay+"元";
		}else{
			app.payBtn="微信支付";
		}

	}
	
}

function getOrderId() {
	MtaH5.clickStat('detailclasspay');
	if(app.telphone==""||app.telphone=="点击输入"){
		Modal.alert({
			content:"请输入手机号",
		});
		return false;
	}
	var product = {
		team_id: id,
		cycle: app.weekNum
	};
	$.ajax({
		url: urlshopInfo,
		type: "post",
		async: true,
		data: {
			type: "participation",
			product:{
				type:2,
				teamId: id,
				cycle: app.weekNum,
				startDate:app.start_date,
			}
		},
		dataType: "json",
		beforeSend: function() {
			$("#loadingToast").show();
		},
		success: function(data) {
			if (data.status == 0) {
				app.orderId = data.data.orderNo;
				if (app.accountMoney >= app.totalMoney && app.isUseAccount) {
					accountPay();
				} else if(app.accountMoney < app.totalMoney && app.isUseAccount && app.accountMoney!=0){
					accountAndweinxinPay();
				}else{
					weixinPay();
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
		url: urlshopPay,
		type: "post",
		async: true,
		data: {
			orderNo: app.orderId,
			type:"jsapi",
			money:app.totalMoney*100,
		},
		dataType: "json",
		beforeSend: function() {
			$("#loadingToast").show();
		},
		success: function(data) {
			if (data.status == 0) {
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
										
						Modal.alert({
							title:"支付提示",
							content:"支付成功",
							sure:function(){
								window.location.href="/page/user_home";
							}
						});
						
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
		url: urlshopPay,
		type: "post",
		async: true,
		data: {
			orderNo: app.orderId,
			money: app.totalMoney*100,
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
			if (data.status == 0) {
				app.hidePop();
				Modal.alert({
					content: "支付成功!",
					type: "alert",
					sureBtnText: "确定",
						sure:function(){
								window.location.href="/page/user_home";
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
		url: urlshopPay,
		type: "post",
		async: true,
		data: {
			orderNo: app.orderId,
			type:"jsapi",
			money:app.totalMoney*100,
			options:{
				useAccount:app.discountMoney*100,
			}
		},
		dataType: "json",
		beforeSend: function() {
			$("#loadingToast").show();
		},
		success: function(data) {
			if (data.status == 0) {
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
						Modal.alert({
							title:"支付提示",
							content:"支付成功",
							sure:function(){
								window.location.href="/page/user_home";
							}
						});
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
}4
   


