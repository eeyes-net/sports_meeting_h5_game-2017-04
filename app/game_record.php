<?php
/**
 * 游戏记录操作
 * Ganlv <ganlvtech at qq dot com>
 * 2017-04-12
 */

function get_game_record()
{
    $mysqli = connect_db();
    $stmt = $mysqli->prepare("SELECT `data` FROM `game_record` ORDER BY `created_at` DESC LIMIT 10");
    $stmt->bind_result($data);
    $stmt->execute();
    $ret = '';
    while ($stmt->fetch()) {
        $ret .= pack('N', strlen($data));
        $ret .= $data;
    }
    $stmt->close();
    return $ret;
}

function post_game_record()
{
    check_ip('game');

    $mysqli = connect_db();
    $stmt = $mysqli->prepare("INSERT INTO `game_record` (`data`, `data_md5`, `ip`, `user_agent`) VALUES (?, ?, ?, ?)");

    $data = file_get_contents('php://input');

    $null = null;
    $user_agent = $_SERVER['HTTP_USER_AGENT'];
    $ip = get_client_ip();
    $data_md5 = md5($data);

    if (empty($data) || empty($user_agent) || empty($ip)) {
        return false;
    }

    $stmt->bind_param('bsss', $null, $data_md5, $ip, $user_agent);
    $stmt->send_long_data(0, $data);
    $stmt->execute();

    session_start();
    $_SESSION['game_record_id'] = $stmt->insert_id;

    $stmt->close();
    return true;
}
