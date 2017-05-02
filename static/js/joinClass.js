//var  Modal = require('../modules/modal.js');
//var app = new Vue({
//  el: '#join-class-v',
//  data: {
//  	allImg:0,
//      isgreen:false,//是否通过
//      all: 20, //总页数
//      cur: 1,//当前页码
//      type1:0,
//      body:[
//           {className:"unlook"},
//           {className:"unpass"},
//           {className:"pass"},
//           {className:"uncomimmt"},    
//     ],
//     gameNames:['魔兽世界', '暗黑破坏神Ⅲ', '星际争霸Ⅱ', '炉石传说', '风暴英雄',
//    '守望先锋'],
//     activeName: '',
//      classId:[],
//      teamId:[],
//      teamCycleId:[],
//      id:"",
//      type:0,
//      priority:0,
//      direction:"post",
//      prev:0,
//      post:1,
//      user:[],
//      first:[],//瘦前打卡
//      last:[],//瘦后打卡
//      isbody:1000,
//      isscal:false,
//		checkState:["",""],
//     
//  },
// 
// 
//  methods: {
//      //选中
//    selected: function(gameName) {
//        this.activeName = gameName;
//      },
//     showTab:function( type1){
//          this. type1= type1;
//      },
//       // 提交动态图片
//       submitSignIn:function(){
//          var imgUrl=app.serverIds;
//          var myWeight = $("#my-weight").val().trim();
//          var emotionWord= $("#emotion-word").val().trim();
//          var isOne= checkDecimal(myWeight);
//          if(!isOne){
//             setTimeout(function(){
//                  Modal.alert({
//                  content: "体重最多为一位小数"
//              })},1000);
//             
//              return false;
//          }
//          $.ajax({
//              url: urlCheckJudge,
//              type: "post",
//              async: true,
//              data:{
//                  signId:app.first.id,
//                  body:imgUrl,
//                  scale: "url",
//                  weight: myWeight,
//                  emotionWord: emotionWord,
//              },
//              dataType: "json",
//              beforeSend:function(){
//                  $("#loadingToast").show();
//              },
//              complete:function(){
//                  $("#loadingToast").hide();
//              },
//              success:function(data){
//                  if(data.status == 0){
//                       
//
//                  window.location.href = urlHead + 'page/team/detail?team_id=' + id + '&' + 'tab=1';
//                  }
//              },
//              error: function(data){
//                   Modal.alert({
//                     content: "发送失败，请重试",
//                  })
//              }
//          })
//      },
//     
//      
//  }
//
//})
//
//
//$(function() {
//
//   getCheckList(function() {
//      getChannelUncommit(function() {
//          getCheckSignin(2);
//      })
//   });
//   
//   
//
//});
////$(".content-div").on("click",function(){
////       $(this).addClass("main-img").siblings().removeClass("main-img");
////         app.isbody=$(this).index();
////       
////   })
//$(".content-div").on("click",function(){
//       $(this).addClass("main-img").siblings().removeClass("main-img");
//         app.isbody=$(this).index();
//       
//   })
//
//function clickImg(index){
//   //图片
//
//      var value  = $('input[name="wy"]:checked').val();
//    // if( $(".content-div").hasClass("main-img")){
//    //        app.isbody=$(this).index();
//
//    //    }
//
//   if(value =="pass"){
//         
//          app.prebody=1;
//          app.prescal=1;
//        
//
//
//function imgclick(type){
//	if(type==1){
//		app.allImg=1;
//		$(".iconckick1").addClass("main-img").siblings().removeClass("main-img");
//	}else{
//		app.allImg=2;
//		$(".iconckick2").addClass("main-img").siblings().removeClass("main-img");
//	}
//}
//function clickImg(type){
//	if(app.allImg==1){
//		if(type==1){
//			app.checkState[0]="pass";
//			//这次点击的图片通过
//		}else{
//			//这次点击的图片
//			app.checkState[0]="nopass";
//		}
//	}else{
//		if(type==1){
//			app.checkState[1]="pass";
//		}else{
//			app.checkState[1]="nopass";
//		}
//	}
//	 changeColor(app.checkState);
//  
//}

//function changeColor(type){
//	//第一张图片的状态
//	if(type[0]==""){
//		
//	}else if(type[0]=="pass"){
//		app.isgreen=true;
//	}else{
//		console.log(3);
//	}
//	
//	//第二章图片的状态
//	if(type[1]==""){
//		console.log(4);
//	}else if(type[1]=="pass"){
//		console.log(5);
//	}else{
//		console.log(6);
//	}
//}

//function getCheckList(callback) {
//  $.ajax({
//      url: urlCheckList,
//      type: "get",
//      async: true,
//      data: {
//      },
//      dataType: "json",
//      beforeSend: function() {
//          $("#loadingToast").show();
//      },
//      complete: function() {
//          $("#loadingToast").hide();
//         
//      },
//      success: function(data) {
//        
//          if (data.status == 0) {
//
//              app.classId=data.data.teamCycle;
//            
//
//              for(var i=0;i<data.data.teamCycle.length;i++){
//                  app.teamId= app.classId[i].teamId;//班级id
//                
//                  app.teamCycleId= app.classId[i].id;//周期id
//               
//
//              }
//              
//              callback && callback();
//          }
//         
//      },
//      error: function() {
//           Modal.alert({
//              content: "哎呀，获取班级列表失败了，请重试",
//              type: "alert",
//              sureBtnText: "刷新一下",
//              sure: function(){
//                  window.location.reload();
//              }
//          })
//      }
//  })
//}
//
//function getChannelUncommit(callback) {
//
//  console.log(app.teamId);
//  $.ajax({
//      url: urlChannelUncommit, 
//      type: "get",
//      async: true,
//      data: {
//          id:app.teamId,
//      },
//      dataType: "json",
//      beforeSend: function() {
//          $("#loadingToast").show();
//      },
//      complete: function() {
//          $("#loadingToast").hide();
//          app.canRequest = true;
//      },
//      success: function(data) {
//          if (data.status == 0) {
//              app.classId=data.data.teamCycle;
//          }
//      },
//      error: function() {
//           Modal.alert({
//              content: "哎呀，获取班级列表失败了，请重试",
//              type: "alert",
//              sureBtnText: "刷新一下",
//              sure: function(){
//                  window.location.reload();
//              }
//          })
//      }
//  })
//}
//
//
//function getCheckSignin(value) {
//  if(value==1){
//      app.direction="pre";
//  }else if(value==2){
//      app.direction="post";
//  }
//  $.ajax({
//      url: urlCheckSignin, 
//      type: "get",
//      async: true,
//      data: {
//          id:app.teamCycleId,
//          type: app.type,
//          priority:app.priority,
//          direction:app.direction,
//      },
//      dataType: "json",
//      beforeSend: function() {
//          $("#loadingToast").show();
//      },
//      complete: function() {
//          $("#loadingToast").hide();
//         
//      },
//      success: function(data) {
//          if (data.status == 0) {
//          app.user=data.data.user;
//         
//          app.first=data.data.pre;
//          app.last=data.data.post;
//              
//
//          }
//      },
//      error: function() {
//           Modal.alert({
//              content: "哎呀，获取班级列表失败了，请重试",
//              type: "alert",
//              sureBtnText: "刷新一下",
//              sure: function(){
//                  window.location.reload();
//              }
//          })
//      }
//  })
//}