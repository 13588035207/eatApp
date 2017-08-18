<?php
header('Content-Type:application/json');
@$phone = $_REQUEST['phone'];
if(empty($phone))
{
  echo '[]';
  return;
}
require("init.php");
$sql = "select bz_order.user_name,bz_dish.img_sm,bz_order.oid,bz_order.order_time,bz_order.did from bz_dish,bz_order where bz_order.did=bz_dish.did and bz_order.phone=$phone";
$result = mysqli_query($conn,$sql);
$output=[];
while(true)
{
  $row = mysqli_fetch_assoc($result);
  if(!$row)
  {
    break;
  }
  $output[] = $row;
}

echo json_encode($output);



?>