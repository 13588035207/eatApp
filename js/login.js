var app=angular.module("bzct",['ng']);
app.controller("loginCtrl",['$scope','$location','$http',function($scope,$location,$http){
    $scope.isTrue=true;
    var uaddr=sessionStorage['uaddr'];
    if(!uaddr){
        uaddr=null;
    }
    $scope.$watch("userName",function(){
        if($scope.userName!==undefined){
            $scope.isTrue=true;
            $scope.result="请填写登录信息";
        }
    });
    $scope.$watch("userPwd",function(){
        if($scope.userName!==undefined){
            $scope.isTrue=true;
            $scope.result="请填写登录信息";
        }
    });
    $scope.$watch("tel",function(){
        if($scope.tel!==undefined){
            $scope.isTrue=true;
            $scope.result="请填写登录信息";
        }
    });
        $scope.login=function(){
            if($scope.userName!==undefined&&$scope.userPwd!==undefined&&$scope.tel!==undefined){
                if($scope.userName.length>0&&$scope.userPwd.length>0&&$scope.tel.length>0){
                    $http.get('data/login.php?userName='+$scope.userName+"&userPwd="+$scope.userPwd+"&uaddr="+uaddr+"&tel="+$scope.tel).success(function(data){
                           if(!isNaN(data)){
                               sessionStorage['uid']=data;
                           }else{
                               sessionStorage['uid']=data.userid;
                           }
                            sessionStorage['tel']=$scope.tel;
                            sessionStorage['uname']=$scope.userName;
                            location.href="bzct.html#/bzMain";

                    })
                } else{
                    $scope.isTrue=false;
                    $scope.result="请填写登录信息";
                }
            }else{
                $scope.isTrue=false;
                $scope.result="请填写登录信息";
            }
    }

}]);
