<?php
/**
*根据购物车详情记录编号删除该购买记录
*请求参数：
  ctid-详情记录编号 ,o
*输出结果：
* {"code":1,"msg":"succ"}
* 或

* {"code":400}
*/
@$did = $_REQUEST['did'] or die('ctid required');
@$uid = $_REQUEST['uid'] or die('uid required');
@$t = $_REQUEST['type'] or die('uid required');
require('init.php');
if($t==1){
   $sql="DELETE FROM bz_cart WHERE userid=$uid";
   $result=mysqli_query($conn,$sql);
}else{
    $sql = "DELETE FROM bz_cart WHERE did=$did and userid=$uid";
    $result = mysqli_query($conn,$sql);
}

if($result){
  $output['code']=1;
  $output['msg']='succ';
}else {
  $output['code']=400;
}


echo json_encode($output);
