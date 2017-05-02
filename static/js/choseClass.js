var Modal = require('../modules/modal.js');
var Pager = require('../modules/pagermore.js');
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
    el: '#chose-class-v',
    store: store,
    data: {
    	rules:[
    		{
    			title:'押钱',
    			image_bg:'1',
    			iconName:'icon-icongroup',
    			content:[
                    {
                        question:'如何报名？ ',
                        answer:'选择班级，支付契约金则报名成功。班级契约金不同仅仅是钱对你的督促效果的不同。'
                    },
    				{
    					question:'为什么押钱？ ',
    					answer:'让自己最大动力去瘦身，如果最终达成瘦身目标，则可以取回契约金，并分得出局者的契约金。如果没有瘦身达标，你押的契约金将变成奖金赠与其它达标的人哟。'
    				},
    				{
    					question:'钱到哪里去？ ',
    					answer:'寄存在本公众号的账户上，这笔钱会被冻结无法进行他用，安全可靠。'
    				},
    				
    			]
    		},
    		{
    			title:'瘦身',
    			image_bg:'2',
      			iconName:'icon-cup',
    			content:[
    				{
    					question:'如何评判？ ',
    					answer:'瘦身前后会录入你的体重与照片凭据，需要在规定周数内完成减重百分比，基于体重值的变化来判断。这些信息会严格保密，只由工作人员审核，请放心。'
    				},
    				{
    					question:'如何促进瘦身？ ',
    					answer:'管住嘴，迈开腿，我们开辟了瘦身日历记录你的体重变化，你还可以发照片动态记录瘦身成就。并且看看其他瘦友是怎么让自己瘦的。'
    				},
    				{
    					question:'过程有指导吗？ ',
    					answer:'如果需要指导，请报名[不瘦学院]，将有亲身瘦身成功的教练带你，用科学方法28天瘦下来。'
    				}
    			]
    		},
    		{
    			title:'分钱',
    			image_bg:'3',
    			iconName:'icon-iconjinbi',
    			content:[
    				{
    					question:'何时分钱？',
    					answer:'活动结束后，平台自动根据体重值判断，并结算。'
    				},
                        {
                        question:'怎么分钱？ ',
                        answer:'瘦身成功可取回全额契约金，并分得出局者的契约金，出局者全额契约金无法取回哟，赏罚分明才有动力。'
                    },
                    {
                        question:'何时发钱？',
                        answer:'活动结束后3天内即可在本公众号的“我->我的账户”进行提现。'
                    }
    			]
    		}
    	],
    	type:0,
    	isShow:false,
        //班级列表信息
        soClassList:null,
        //班级人数
        soClasspeople:[],
        //周期
        teamCycle:null,
        //背景颜色
        isColor:false,
        isNum:null,
        d_finish:null,
        d_start:null,
        pageMore:true,
       
    },
    methods:{

    	showRules:function(type){
    		this.type=type;
    		this.isShow=true;
             
            $("html").css({"overflow":"hidden","height":"100%"});
    	},
    	hideRules:function(){
    		this.isShow=false;
            $("html").css({"overflow":"auto","height":"auto"});
        },

    }
});
$(function() {
      
    $(".body").on("click", ".rules-in", function(e){
    	MtaH5.clickStat('choseclasskdmshow');
        e.preventDefault();
        $(this).hide().siblings('.rules').show();
    });
    $(".body").on("click", ".rules-out", function(e){
    	MtaH5.clickStat('choseclasskdmclose');
        e.preventDefault();
        $(this).hide().siblings('.rules').show();
    });
    getListIndex();
})


function getListIndex() {
    $.ajax({
        url: urlGetIndex,
        type: "get",
        async: true,
        data: {
        },
        dataType: "json",
        beforeSend: function() {
            $("#loadingToast").show();
        },
        complete: function() {
            $("#loadingToast").hide();
            app.canRequest = true;
        },
        success: function(data) {
            if (data.status == 0) {
                //周期数组
                app.teamCycle=data.data.teamCycle;
                //班级数组
                 app.soClassList = data.data.team;
                 //人数数组
                 app.soClasspeople=data.data.participation;

                for(var i=0;i<app.teamCycle.length;i++){
                    app.soClassList [i]['finish_date'] = app.teamCycle[i].finish_date;
                    app.soClassList [i]['start_date'] = app.teamCycle[i].start_date;
                    app.d_finish=getBaoMing(app.soClassList [i]['finish_date']);
                    app.d_start=getBaoMing(app.soClassList [i]['start_date']);
                     // app.d_start=getBaoMing("2017-01-19 00:00:00");
                     //  app.d_finish=getBaoMing("2017-02-16 00:00:00");
                     // console.log(app.d_start);
                
                   if(app.d_start>=3){
                     app.isColor =true;
                      app.isNum=1;
                      console.log("6");
                   }else if(1<=app.d_start&&app.d_start<3){


                      app.isColor=true;
                      app.isNum=1;
                      console.log("5");

                   }else if(0<app.d_start&&app.d_start<1){
                     app.isColor=true;
                     app.isNum=2; 
                     console.log("4");

                   }else if (0<= app.d_finish && app.d_finish<1) {
                                     app.isColor=true;
                                      app.isNum=3;   
                                      console.log("3");  
                                    
                    } else if ( app.d_finish>1) {
                                     app.isNum=4;
                                     console.log("2");
                
                    }else if(app.d_start<=0){
                         app.isNum=4;
                         console.log("1");
                    }

                }

                 for(var i=0;i<app.soClasspeople.length;i++){
                    app.soClassList [i]['num'] = app.soClasspeople[i].num;
                        
                }  

                // 更新用户数据
                app.$store.dispatch('SET_USER_AVATAR', data.data.user.avatar);
                app.$store.dispatch('SET_ROUTE_AVATAR', data.data.user.avatar);
                app.$store.dispatch('SET_ROUTE_ACTIVE', 0);
            }
        },
        error: function() {
             Modal.alert({
                content: "哎呀，获取班级列表失败了，请重试",
                type: "alert",
                sureBtnText: "刷新一下",
                sure: function(){
                    window.location.reload();
                }
            })
        }
    })
}


Pager.init({

            pageSize:10,
            page:10,
            url: urlGetIndex,
            callback:function(data){
                var pageSize=10;
                 if(data.data.team.length!=0){
                    if(data.page== 0){
                        app.soClassList = data.data.team;

                    }else{
                         if(app.soClassList!=null){
                              app.soClassList= app.soClassList.concat(data.data.team);
                              //周期数组
                             app.teamCycle= app.teamCycle.concat(data.data.teamCycle);
                              //人数数组
                            app.soClasspeople=app.soClasspeople.concat(data.data.participation);
                            for(var i=0;i<app.teamCycle.length;i++){
                                app.soClassList [i]['finish_date'] = app.teamCycle[i].finish_date;

                            }

                             for(var i=0;i<app.soClasspeople.length;i++){
                                app.soClassList [i]['num'] = app.soClasspeople[i].num;
                                    
                            }  
 
                         }
                      
                    }

                    if(data.data.team.length<pageSize){
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


function getDateTimeStamp(dateStr) {

               if(dateStr!=undefined){
                 var dateStr= Date.parse(dateStr.replace(/-/gi, "/")); 

               }else{
                return dateStr;
               }
        return dateStr;   

};    
