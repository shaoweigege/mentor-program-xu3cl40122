<?php

include('connect.php');

header("Content-Type: application/json; charset=UTF-8");
//$obj = json_decode($_POST["x"], false);
$content = $_POST['content'];
$parent_id = $_POST['parent_id'];
// identify
$board_random_id =  $_COOKIE['board_random_id'];
$id_stmt = $conn->prepare("SELECT * FROM xu3cl40122_users_certificate where id = ?");
$id_stmt->bind_param('s',$board_random_id);
$id_stmt->execute() or trigger_error($stmt->error, E_USER_ERROR);
$id_result = $id_stmt->get_result();
if($id_result->num_rows > 0){
	$id_row = $id_result->fetch_assoc();
	$nickname = $id_row['nickname'];
	$stmt = $conn->prepare("SELECT * FROM xu3cl40122_users WHERE nickname = ?");
	$stmt->bind_param('s',$nickname);
	$stmt->execute();
	$result = $stmt->get_result();
    if ($result->num_rows > 0){
        $row = $result->fetch_assoc();
        $sid = $row['sid'];
		$stmt = $conn->prepare("INSERT INTO xu3cl40122_comment (parent_id, content, user_id) VALUES (?, ?, ?)");
		$stmt->bind_param('isi',$parent_id, $content, $sid);
		$stmt->execute() or trigger_error($stmt->error, E_USER_ERROR);
		$last_id = $conn->insert_id;
		date_default_timezone_set('Asia/Taipei');
		$time = date("Y-m-d H:i:s");
		$arr = array('result'=>'success','id'=>$last_id,'user'=>$nickname,'time'=>$time);
		echo json_encode($arr);
		$stmt->close();
    }
}
else{
	echo '權限問題';
}


$conn->close();

?>