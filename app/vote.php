<?php
/**
 * 投票操作
 * Ganlv <ganlvtech at qq dot com>
 * 2017-04-12
 */


function get_vote()
{
    $mysqli = connect_db();
    $stmt = $mysqli->prepare("SELECT `id`, `college_name`, `count` FROM `vote_count`");
    $stmt->bind_result($id, $college_name, $count);
    $ret = [];
    while ($stmt->fetch()) {
        $ret[] = compact('id', 'college_name', 'count');
    }
    return $ret;
}

function post_vote()
{
    check_ip('vote_record');

    $mysqli = connect_db();
    $stmt = $mysqli->prepare("INSERT INTO `vote_record` (`game_record_id`, `college_id`, `count`, `ip`, `user_agent`) VALUES (?, ?, ?, ?, ?)");

    $game_record_id = $_POST['game_record_id'];
    $college_id = $_POST['college_id'];
    $count = $_POST['count'];
    $ip = get_client_ip();
    $user_agent = $_SERVER['HTTP_USER_AGENT'];

    // TODO check $game_record_id $college_id $count

    $stmt->bind_param('sssss', $game_record_id, $college_id, $count, $ip, $user_agent);
    $stmt->execute();
    $stmt->close();

    $stmt = $mysqli->prepare("UPDATE `vote_count` SET `count` = `count` + ? WHERE `id` = ?");
    $stmt->bind_param('dd', $count, $college_id);
    $stmt->execute();
    $stmt->close();
    return true;
}
