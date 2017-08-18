<?php
/**根据用户id查询订单数据**/
header('Content-Type:application/json');

$output = [];

@$userid = $_REQUEST['userid'];

if(empty($userid)){
    echo "[]"; //若客户端未提交用户id，则返回一个空数组，
    return;    //并退出当前页面的执行
}

//访问数据库
require('init.php');
$sql = "SELECT bz_order.oid,bz_order.userid,bz_order.phone,bz_order.addr,
bz_order.totalprice,bz_order.user_name,bz_order.order_time,
bz_orderdetails.did,bz_orderdetails.dishcount,bz_orderdetails.price,
bz_dish.name,bz_dish.img_sm

 from bz_order,bz_orderdetails,bz_dish
WHERE bz_order.oid = bz_orderdetails.oid and bz_orderdetails.did = bz_dish.did and bz_order.userid='$userid' order by bz_order.order_time desc";
$result = mysqli_query($conn, $sql);

$output['data'] = mysqli_fetch_all($result, MYSQLI_ASSOC);

echo json_encode($output);
?>
