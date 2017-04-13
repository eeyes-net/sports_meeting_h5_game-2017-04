<?php
require '../app/common.php';

date_default_timezone_set('Asia/Shanghai');

log_record($_SERVER['REMOTE_ADDR']
    . ' - "' . $_SERVER['REQUEST_METHOD']
    . ' ' . $_SERVER['REQUEST_URI']
    . '" "' . (isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '')
    . '" "' . $_SERVER['HTTP_USER_AGENT']
    . '" "' . (isset($_SERVER['HTTP_X_FORWARDED_FOR']) ? $_SERVER['HTTP_X_FORWARDED_FOR'] : '')
    . '"' . "\n");

$action = isset($_GET['action']) ? $_GET['action'] : null;
switch ($action) {
    case 'get_game_record':
        include '../app/game_record.php';
        rawReturn(get_game_record());
        break;
    case 'post_game_record':
        include '../app/game_record.php';
        jsonReturn(post_game_record());
        break;
    case 'get_vote':
        include '../app/vote.php';
        jsonReturn(get_vote());
        break;
    case 'post_vote':
        include '../app/vote.php';
        jsonReturn(post_vote());
        break;
    default:
        readfile('index.html');
        break;
}
connect_db(true);
