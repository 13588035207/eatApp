<?php
require("init.php");
$start = $_REQUEST['start'];
$t=$_REQUEST['type'];
 $output=[];
 $output1=[];
 $output2=[];
 $output3=[];
 $output4=[];
 $output5=[];
 $output6=[];
if($t!=='did'){
  $sql = "select did,name,price,img_sm,material,count,star from bz_dish ORDER BY  $t desc limit $start,8 ";
  $result = mysqli_query($conn,$sql);
  while(true)
  {
    $row = mysqli_fetch_all($result,MYSQLI_ASSOC);
    if(!$row)
    {
      break;
    }
    $output[] = $row;
  }

  echo json_encode($output);

}else{
  $sql="select did,name,price,img_sm,material,count,star from bz_dish ORDER BY count desc limit 0,6";
  $result1 = mysqli_query($conn,$sql);
  $row1 = mysqli_fetch_all($result1,MYSQLI_ASSOC);
  $sql="select did,name,price,img_sm,material,count,star from bz_dish where type='热菜' ORDER BY count desc";
  $result2 = mysqli_query($conn,$sql);
  $row2 = mysqli_fetch_all($result2,MYSQLI_ASSOC);
  $sql="select did,name,price,img_sm,material,count,star from bz_dish where type='主食' ORDER BY count desc";
  $result3 = mysqli_query($conn,$sql);
 $row3 = mysqli_fetch_all($result3,MYSQLI_ASSOC);
  $sql="select did,name,price,img_sm,material,count,star from bz_dish where type='汤类' ORDER BY count desc";
  $result4 = mysqli_query($conn,$sql);
 $row4 = mysqli_fetch_all($result4,MYSQLI_ASSOC);
  $sql="select did,name,price,img_sm,material,count,star from bz_dish where type='冷菜' ORDER BY count desc";
    $result5 = mysqli_query($conn,$sql);
   $row5 = mysqli_fetch_all($result5,MYSQLI_ASSOC);
  $sql="select did,name,price,img_sm,material,count,star from bz_dish where type='饮品' ORDER BY count desc";
  $result6 = mysqli_query($conn,$sql);
  $row6 = mysqli_fetch_all($result6,MYSQLI_ASSOC);
  $output1['name']='热销';
  $output1['content']=$row1;
  $output2['name']='炒菜';
    $output2['content']=$row2;
  $output3['name']='主食';
    $output3['content']=$row3;
  $output4['name']='汤类';
    $output4['content']=$row4;
 $output5['name']='冷菜';
   $output5['content']=$row5;
  $output6['name']='饮品';
    $output6['content']=$row6;
  $output=[$output1,$output2,$output3,$output4,$output5,$output6,];
  echo json_encode($output);
}
?>