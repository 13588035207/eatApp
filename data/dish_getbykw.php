<?php
header('Content-Type:application/json');

@$kw = $_REQUEST['kw'];
if(empty($kw))
{
  echo '[]';
  return;
}

require("init.php");
$sql = "select did,name,price,img_sm,material from bz_dish where name like '%$kw%' or material like '%$kw%'";
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