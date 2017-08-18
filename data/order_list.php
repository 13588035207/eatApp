<?php
    require("init.php");
    @$uid=$_REQUEST['userid'] or die('{"code":-2}');
    $sql="select order_time,totalprice from bz_order where userid=$uid";
    $result=mysqli_query($conn,$sql);
    $row=mysqli_fetch_all($result,MYSQLI_ASSOC);
    echo json_encode($row);
?>