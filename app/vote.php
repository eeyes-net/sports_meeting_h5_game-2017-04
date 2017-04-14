<?php
/**
 * 投票操作
 * Ganlv <ganlvtech at qq dot com>
 * 2017-04-12
 */

function get_vote()
{
    $mysqli = connect_db();
    $stmt = $mysqli->prepare("SELECT `id`, `count` FROM `vote_count`");
    $stmt->bind_result($id, $count);
    $stmt->execute();
    $ret = [];
    while ($stmt->fetch()) {
        $ret[] = compact('id', 'count');
    }
    return $ret;
}

function post_vote()
{
    check_ip('vote'); // 检测IP防刷票

    $mysqli = connect_db();
    $stmt = $mysqli->prepare("INSERT INTO `vote_record` (`game_record_id`, `college_id`, `count`, `ip`, `user_agent`) VALUES (?, ?, ?, ?, ?)");

    session_start();
    $game_record_id = 0;
    if (isset($_SESSION['game_record_id'])) {
        $game_record_id = $_SESSION['game_record_id'];
        unset($_SESSION['game_record_id']);
        session_destroy();
    }

    $college_id = (int)$_POST['college_id'];
    $count = (int)$_POST['count'];

    // 检测数据是否非法
    if ($college_id <= 0 || $college_id > 8 || $count <= 0 || $count > 4) {
        errorReturn('数据非法');
        exit;
    }

    $ip = get_client_ip();
    $user_agent = $_SERVER['HTTP_USER_AGENT'];

    // TODO check $game_record_id $college_id $count

    $stmt->bind_param('sssss', $game_record_id, $college_id, $count, $ip, $user_agent);
    if (!$stmt->execute()) {
        $stmt->close();
        return false;
    }
    $stmt->close();

    $stmt = $mysqli->prepare("UPDATE `vote_count` SET `count` = `count` + ? WHERE `id` = ?");
    $stmt->bind_param('dd', $count, $college_id);
    $stmt->execute();
    $stmt->close();
    return true;
}
