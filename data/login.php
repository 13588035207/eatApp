<?php
    require("init.php");
    @$u=$_REQUEST['userName'] or die('{code:-2}');
    @$p=$_REQUEST['userPwd'] or die('{code:-2}');
    @$a=$_REQUEST['uaddr'] or die('{code:-2}');
    @$t=$_REQUEST['tel'] or die('{code:-2}');
    $sql="SELECT * FROM users WHERE uname='$u' AND pwd='$p'";
    $result=mysqli_query($conn,$sql);
    $row=mysqli_fetch_assoc($result);
    if($row){
        echo json_encode($row);
    }else{
        $sql="INSERT INTO users VALUES(null,'$u','$p','$a','$t')";
        $result=mysqli_query($conn,$sql);
        $oid = mysqli_insert_id($conn);
        if($result){
            echo json_encode($oid);
        }else{
            echo '{"code":-1,"msg":"网络连接出现问题"}';
        }
    }
?>