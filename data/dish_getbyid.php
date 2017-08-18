<?php
header('Content-Type:application/json');
@$id = $_REQUEST['did'];
if(empty($id))
{
  echo '[]';
  return;
}
require("init.php");
$sql = "select detail,name,price,img_lg,material from bz_dish where did=$id";
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