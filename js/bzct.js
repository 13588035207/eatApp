//创建一个自定义模块，并指定依赖于ng ngRoute
var app = angular.module('bzct',
['ng','ngRoute','duScroll']);

//配置路由词典
app.config(function ($routeProvider) {
  $routeProvider
      .when('/',{
          templateUrl:'home.html',
          controller:'homeCtrl'
      })
      .when('/bzMain',{
        templateUrl:'tpl/main.html',
        controller:'mainCtrl'
      })
      .when('/bzDetail/:did',{
        templateUrl:'tpl/detail.html',
        controller:'detailCtrl'
      })
      .when('/bzOrder',{
        templateUrl:'tpl/order.html',
        controller:'mainCtrl'
      })
      .when('/bzMyOrder',{
        templateUrl:'tpl/myOrder.html',
        controller:'myOrderCtrl'
      }).when('/bzSettings',{
        templateUrl:'tpl/settings.html',
        controller:'settingsCtrl'
      })
      .otherwise({redirectTo:'/bzMain'})

})
//创建一个控制器 给body
// 里边封装一个跳转的方法
app.controller('bodyCtrl',
    ['$scope','$location','$anchorScroll','$http',
      function ($scope,$location) {
        $scope.jump = function (desPath) {
          $location.path(desPath);
        };
       $scope.jumpToHome=function(){
          location.href="home.html";
       };
       $scope.addrs=sessionStorage['addr'];
       $scope.distance=parseInt(sessionStorage['distance']);
       $scope.timer="预计送餐时间"+sessionStorage['time']+"分钟";
       if(sessionStorage['time']>100){
           $scope.timer="不在配送距离"
       }
       if($scope.addrs){
           $scope.addr=$scope.addrs
       }else{
           $scope.addr='';
       }
      }
    ]
);
app.controller('headerCtrl',['$scope',function($scope){
    $scope.uname=sessionStorage['uname'];
    $scope.isLogin=false;
    $scope.isShowPerson=false;
    if($scope.uname){
        $scope.result=$scope.uname;
        $scope.isLogin=true;
        $scope.isShowPerson=false;
        $scope.dropdown=function(){
            if($scope.isShowPerson){
                $scope.isShowPerson=false;
            }else{
                $scope.isShowPerson=true;
            }
        }
    }else{
        $scope.result='登录/注册';
        $scope.isLogin=false;
    }
    if(!$scope.uname){
        $scope.headerJump=function(desPath){
            $scope.tel=sessionStorage['tel'];
            if($scope.tel){
                location.href=desPath;
            }else{
                location.href='login.html';
            }
        }
    }
    $scope.off=function(){
        location.href="login.html";
        sessionStorage.clear();
    }
}]);
app.controller('scrollCtrl', function($scope, $document){
        $scope.toTheTop = function() {
            $document.scrollTopAnimated(0, 3000).then(function() {
                console.log('You just scrolled to the top!');
            });
        };
    }
).value('duScrollOffset', 30);
app.controller('homeCtrl',['$scope',function($scope){
    console.log("homeCtrl is called");
      $scope.jump=function(desPath){
          $scope.tel=sessionStorage['tel'];
              if($scope.tel){
                  location.href=desPath;
              }else{
                  location.href='login.html';
              }
          }
}]);
//给main页面 创建一个控制器
app.controller('mainCtrl',
    ['$scope','$http','$location',
      function ($scope,$http,$location) {
        $scope.hasMore = false;
        $scope.myKw = "";
        $scope.dishList=[];
        $scope.cartList=[];
        $scope.type="did";
        $scope.isFour = true;
        $scope.isFive = false;
        $scope.isSix = false;
        $scope.isSeven=false;
        $scope.isOrder=false;
        $scope.isShow=true;
        $scope.isOrderEnd=false;
        $scope.total=0;
        $scope.count=0;
        $scope.cost=0;
        $scope.turnClassName4=function(){
            $scope.isFour = true;
            $scope.isFive = false;
            $scope.isSix = false;
            $scope.isSeven=false;
        };
        $scope.turnClassName5=function(){
            $scope.isFour = false;
            $scope.isFive = true;
            $scope.isSix = false;
            $scope.isSeven=false;
        };
        $scope.turnClassName6=function(){
            $scope.isFour = false;
            $scope.isFive = false;
            $scope.isSix = true;
            $scope.isSeven=false;
        };
        $scope.turnClassName7=function(){
            $scope.isFour = false;
            $scope.isFive = false;
            $scope.isSix = false;
            $scope.isSeven=true;
        };
            //初始化菜品列表
        //发起网络请求，拿到数据，绑定到视图
        $scope.orderList=function(type){
            $scope.type=type;
            $scope.hasMore = true;
            $scope.isOrder= true;
            playOrder(type);
        };
        $scope.turnTabs=function(){
            $scope.isOrder= false;
            $scope.hasMore =false;
        };
         var btn=document.getElementById("search-btn");
        if(btn){
            btn.onclick=function(){
                $scope.myKw=document.getElementById("search-input").value;
                if($scope.myKw.length>0)
                {
                    $http.get(
                        'data/dish_getbykw.php?kw='
                        +$scope.myKw)
                        .success(function (data) {
                            if(data.length>0)
                            {
                                if($scope.isOrder){
                                    $scope.dishListOrder = data;
                                }else{
                                    $scope.dishList=[{name:"",content:data}]
                                }

                            }
                        })
                }
            };
            document.getElementById("search-input").onblur=function(){
                if(this.value.length==0){
                    if(!$scope.isOrder){
                        play('did');
                    }
                    $scope.isOrder=false;
                    $scope.isFour = true;
                    $scope.isFive = false;
                    $scope.isSix = false;
                    $scope.isSeven=false;
                }
            }
        }
        function playOrder(type){
            $http
                .get('data/dish_getbypage.php?start=0'+"&type="+type)
                .success(function (data) {
                    $scope.dishListOrder=data[0];
                })
        }
        function play(type){
                $http
                    .get('data/dish_getbypage.php?start=0'+"&type="+type)
                    .success(function (data) {
                        $scope.dishList=data;
                    })
         }
        play('did');
        //定义一个加载更多的方法
        $scope.loadMore = function () {
          $http.get(
              'data/dish_getbypage.php?start='
              +$scope.dishListOrder.length+"&type="+$scope.type)
              .success(function (data) {
                //当返回的数据不到5条时候，
                // 认为按钮可以隐藏，显示提示信息
                if(data[0].length < 5)
                {
                  $scope.hasMore = false;
                }
                //将返回的新的数据和之前的列表拼在一起
                $scope.dishListOrder =
                    $scope.dishListOrder.concat(data[0]);
              })
        }
        $scope.uid = sessionStorage['uid'];
        $scope.uname=sessionStorage['uname'];
        $scope.tel=sessionStorage['tel'];
          //计算总计
        function total(){
              $scope.total=0;
              $scope.count=0;
              for(var i=0;i<$scope.cartList.length;i++){
                  $scope.total+=parseInt($scope.cartList[i].price*$scope.cartList[i].dishCount);
                  $scope.count+=parseInt($scope.cartList[i].dishCount)
              }
          }
          //加载购物车
        if($scope.uid!==undefined){
              $http.get('data/cart_select.php?uid='+$scope.uid).success(function (data) {
                  $scope.cartList=data.data;
                  total();
                  if($scope.cartList.length==0){
                      $scope.isToClearing=false;
                      $scope.cartState='购物车是空的'
                  }else{
                      $scope.isToClearing=true;
                      $scope.cartState='去结算'
                  }
                  var time=sessionStorage['time'];
                  if(time){
                      $scope.cost=0;
                      if(time<20){
                          $scope.cost=5;
                      }else if(time>20&&time<40){
                          $scope.cost=8
                      }else{
                          $scope.time=10;
                      }
                  }

              })
          }
          //动态获取屏幕宽度
        var screenWidth=document.body.clientWidth;
        if(screenWidth<767){
              $scope.isShow=false;
          }
        var showCart=false;
        $scope.isShowCart=function(){
              if(!showCart){
                  $scope.isShow=true;
                  showCart=true;
              }else{
                  $scope.isShow=false;
                  showCart=false;
              }
          }
          //添加购物车   默认排序二维数组，购物车添加
        document.body.onclick=function(e){
              if(e.target.nodeName=="I"){
              if(!$scope.uid){
                  location.href='login.html';
              }else{
                  var did= e.target.dataset.did;
                  if(!$scope.isOrder){
                      $scope.isToClearing=true;
                      $scope.cartState='去结算';
                      var path = 'data/cart_update.php?uid='+$scope.uid
                          + '&did='+did
                          + '&count=-1';
                      var x= 0,y=0;
                      $http.get(path).success(function(data){
                         for(var i= 0;i<$scope.dishList.length;i++){
                             for(var c=0;c<$scope.dishList[i].content.length;c++){
                                 if($scope.dishList[i].content[c].did==did){
                                   x=i;y=c;
                                     break;
                                 }
                             }
                         }
                          var isAdd=true;
                          for(var i=0;i<$scope.cartList.length;i++){
                              if($scope.cartList[i].did==did) {
                                  $scope.cartList[i].dishCount++;
                                  isAdd=false;
                                  total();
                                  break;
                              }
                          }
                          if(isAdd){
                                  $scope.dishList[x].content[y].dishCount=1;
                                  $scope.cartList.push($scope.dishList[x].content[y]);
                                  total();
                          }

                      })

                  }
              }
          }
          }
          //其他排序一维数组购物车添加
        $scope.addToCart=function(index){
              $scope.isToClearing=true;
              $scope.cartState='去结算';
              var path = 'data/cart_update.php?uid='+$scope.uid
                  + '&did='+$scope.dishListOrder[index].did
                  + '&count=-1';
              $http.get(path).success(function(data){
                  var isAdd=true;
                  for(var i=0;i<$scope.cartList.length;i++){
                      if($scope.cartList[i].did==$scope.dishListOrder[index].did) {
                          $scope.cartList[i].dishCount++;
                          isAdd=false;
                          total();
                          break;
                      }
                  }
                  if(isAdd){
                      $scope.dishListOrder[index].dishCount=1;
                      $scope.cartList.push($scope.dishListOrder[index]);
                      total();
                  }
              })
          }
          //清空cart
        if($scope.uid){
              $scope.clearCart=function(){
                  $http.get('data/cart_delete.php?did=1&type=1&uid='+$scope.uid).success(function(data){
                    $scope.cartList.length=0;
                      $scope.total=0;
                      $scope.isToClearing=false;
                      $scope.cartState='购物车是空的'
                  })
              }
          }
          //定义从购物车减少数据的方法
        $scope.reduceCountCart =
              function (index) {
                  if ($scope.cartList[index].
                          dishCount == 1) {
                          var path='data/cart_delete.php?did='+$scope.cartList[index].did+'&uid='+$scope.uid+"&type=-2";
                      $http.get(path).success(function(data){
                          console.log(data);
                          if(data.code==1){
                              for(var i=0;i<$scope.cartList.length;i++){
                                  if($scope.cartList[i].did==$scope.cartList[index].did){                               $scope.cartList.splice(i,1);
                                      total();
                                      break;
                                  }
                              }

                          }
                          if($scope.cartList.length==0){
                              $scope.isToClearing=false;
                              $scope.cartState='购物车是空的'
                          }
                      })

                  }else{
                  path =
                      'data/cart_update.php?uid='+$scope.uid+'&did='
                      + $scope.cartList[index].did
                      + "&count=" + ($scope.cartList[index].dishCount - 1);
                      $http.get(path).success(function(data){
                          if (data.msg == 'succ') {
                              $scope.cartList[index].dishCount =
                                  $scope.cartList[index].dishCount - 1;
                              total();
                          }
                      })
                  }

              }

          //定义从购物车添加数据的方法
        $scope.addCountCart =
              function (index) {
                  var path = 'data/cart_update.php?uid='+$scope.uid
                      + '&did=' + $scope.cartList[index].did
                      + '&count=' + (parseInt($scope.cartList[index].dishCount) + 1);
                  $http.get(path).success(function(data){
                      if (data.msg == 'succ') {
                          $scope.cartList[index].dishCount =
                              parseInt($scope.cartList[index].dishCount) + 1;
                          total();
                      }
                  })

              }
        $scope.toClearing=function(){
            if($scope.cartList.length>0){
                $location.path('/bzOrder')
            }
        }
        $scope.payment=function(){
               if($scope.addr){
                   $scope.endTotal=$scope.total+($scope.count*1.5)+$scope.cost;
                   $scope.cartDetail=JSON.stringify($scope.cartList);
                   var  order_time=new Date().getTime();
                   var params="data/order_add.php?userid="+$scope.uid+"&phone="
                       +$scope.tel+"&user_name="+$scope.uname+"&addr="
                       +$scope.addr+"&order_time="+order_time+"&totalprice="+$scope.endTotal+"&cartDetail="+$scope.cartDetail;
                   $http.get(params).success(function(result){
                       if(result[0].msg=="succ"){
                           $scope.isOrderEnd=true;
                       }
                   })
               }else{
                   location.href="home.html";
               }
        }
          //监听用户的 输入，发起网络请求将
        // 搜索到的数据显示显示在列表

    }]);
//给detail创建控制器 接收参数 发起网络请求
app.controller('detailCtrl',
['$scope','$http','$routeParams',
  function ($scope, $http,$routeParams) {
    console.log($routeParams);
    //拿到传递来的参数 发起请求 dish_getbyid.php
    $http.get(
        'data/dish_getbyid.php?did='
        +$routeParams.did)
        .success(function (data) {
          $scope.dish = data[0];
        })
      $scope.did=$routeParams.did;
      $scope.uid=sessionStorage['uid'];
      if($scope.uid){
          $scope.addToCart=function(){
              $http.get('data/cart_update.php?uid='+$scope.uid+"&did="+$scope.did+"&count=-1").success(function(result){
                  if(result.code==2){
                      alert("添加成功")
                  }
              })
          }
      }else{
          location.href="login.html";
      }
}])
app.controller('myOrderCtrl',['$scope','$http',function($scope,$http){
    $scope.uid=sessionStorage['uid'];
    $scope.isStat=false;
      if($scope.uid){
          $http.get("data/order_getbyuserid.php?userid="+$scope.uid).success(function(data){
              $scope.orderList=data.data;
          })
          $http.get("data/order_list.php?userid="+$scope.uid).success(function(data){
            var charts=[0,0,0,0,0,0,0,0,0,0,0,0];
              for(var i=0;i<data.length;i++){
                  var mouth=new Date(parseInt(data[i].order_time)).toLocaleDateString().split("/")[1];
                 charts[mouth-1]?charts[mouth-1]+=parseFloat(data[i].totalprice):charts[mouth-1]=parseFloat(data[i].totalprice);
              }
              app.title = '个人消费统计';
              option = {
                  color: ['#e4393c'],
                  tooltip : {
                      trigger: 'axis',
                      axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                          type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
                      }
                  },
                  grid: {
                      left: '2%',
                      right: '2%',
                      bottom: '3%',
                      containLabel: true
                  },
                  xAxis : [
                      {
                          type : 'category',
                          data : ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
                          axisTick: {
                              alignWithLabel: true
                          }
                      }
                  ],
                  yAxis : [
                      {
                          type : 'value'
                      }
                  ],
                  series : [
                      {
                          name:'消费小计',
                          type:'bar',
                          barWidth: '40%',
                          data:charts
                      }
                  ]
              };
              echarts.init(document.getElementById('myChart')).setOption(option)
          })
      }else{
          location.href="login.html";
      }
    $scope.showOrderList=function(){
        $scope.isStat=true;
    }
    $scope.showOrderState=function(){
        $scope.isStat=false;
    }
    var ctx = document.getElementById("myDraw").getContext("2d");
    //2:创建图片对象
    var pin = new Image();
    pin.src = "img/pin.png";
    //保存图片加载进度
    var progress = 0;

//3:加载图片对象
    pin.onload = function(){
        progress += 50;
        if(progress===100){
            startDraw();
        }
    }
    var pan = new Image();
    pan.src = "img/pan.png";
    pan.onload = function(){
        progress += 50;
        if(progress===100){
            startDraw();
        }
    }
    var w = 298;
    var h = 298;
//二张图片加载完成
    function startDraw(){
        ctx.drawImage(pan,0,0);
        ctx.drawImage(pin,w/2-pin.width/2,h/2-pin.height/2);
        //4:将图片对象画画布上
        //绑定事件触发一次
        document.getElementById("turn").onclick=function(){
            var deg = 0;//当前角度
            //创建定时器让圆盘旋转
            var timer = setInterval(function(){
                //第一个圆盘
                //保存状态->平移->旋转->绘图->恢复
                ctx.save();
                ctx.translate(w/2,h/2);
                ctx.rotate(deg*Math.PI/180);
                ctx.drawImage(pan,-pan.width/2,-pan.height/2);
                ctx.restore();
                deg += 5;
                //第二个指针
                ctx.drawImage(pin,w/2-pin.width/2,h/2-pin.height/2);
            },50);
            var num=parseInt(Math.random()*1000);
            setTimeout(function(){
                clearInterval(timer);
                timer=null;
            },4050+num)
        }
    }

}])
app.controller('settingsCtrl',['$scope',function($scope){
    $scope.uname=sessionStorage['uname'];
    $scope.tel=sessionStorage['tel'];
    $scope.addr=sessionStorage['addr'];
}])