/*
* auth wangying 2016-12-8
*
* params: 
*   page  - 页总数
*   pageSize- 每页的条数
*   pageFlag- 页数标志位
*   pageMore - 是否加载更多
*   canRequest - 是否允许请求
*   url - 数据获取地址
*   callback  -回调函数
*
* example: 
     Pager.init({
            pageSize:2,
            page:0,
            url: urlHead+'/teams',
            callback:function(data){
                 if(data.data.teams.length!=0){
                   
                    if(data.page== 0){
                        app.normalClassList = data.data.teams;
                    }else{
                        app.normalClassList = app.normalClassList.concat(data.data.teams);
                    }

                    if(data.data.teams.length < data.pageSize){
                        Pager.pageFlag = false;
                        Pager.pageMore = false;
                    }
                }        
            
             }
         })
*/
var Pager = function(){
    this.callback = function(){};
    this.page = 0; //页总数
    this.pageSize= 0;//每页的条数
    this.pageFlag= true;
    this.pageMore= true;
    this.canRequest=false;
    this.url = " "; //数据获取地址
    $(window).scrollTop(0);
}
Pager.prototype = {
    init: function(data){
        var _this = this;
        this.callback=data.callback|| function(){_this.hide()};
        this.page = data.page||this.page;
        this.pageSize= data.pageSize ||this.pageSize;
        this.url = data.url||this.url;
        this.pageFlag=data.pageFlag||this.pageFlag;
        this.pageMore=data.pageMore||this.pageMore;
        this.canRequest=data.canRequest||this.canRequest;
        this.canRequest = false;
        $.ajax({
            url: data.url,
            type: "get",
            async: true,
            data: {
                pageSize: data.pageSize,
                page: data.page,
            },
            dataType: "json",
            beforeSend: function() {
                $("#loadingToast").show();
            },
            complete: function() {
                $("#loadingToast").hide();
                
                
            },
            success: function(res){
                _this.canRequest = true;
                
                 if (res.status == 0) {

                 data.callback.call(this, res);
            }
        }
        });
      $(window).on("scroll",function(){
    
        var $this =$(document),
        viewH =$(this).height(),
        contentH =$(document).height(),//内容高度
        scrollTop =$(window).scrollTop();//滚动高度
        // console.log(viewH+","+contentH+","+scrollTop);
        if(scrollTop/(contentH - viewH)>=0.95){ //到达底部0px时,加载新内容

          if(!app.pageMore){//不再继续滚动，弹出提示框
            _this.canRequest=false;
            
          }else{
           
            if(_this.canRequest){
                data.page= data.page + data.pageSize;

                 _this.init(data);

            }
          }
        }
       });
    }
}
var Pager = new Pager();

module.exports = {
    init: function(data) {

        return Pager.init(data);
    },
    hide: function(){
        return Pager.hide();
    }
}



