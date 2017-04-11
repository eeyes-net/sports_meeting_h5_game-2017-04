<?php

/**
 * 记录Log信息
 *
 * @param string $message
 */
function log_record($message = '')
{
    static $file_name = '';
    if (!$file_name) {
        $file_name = dirname(dirname(__FILE__)) . '/runtime/' . date('Y_m_d') . '.log';
        file_put_contents($file_name, "\n", FILE_APPEND);
    }
    file_put_contents($file_name, '[' . date(DATE_ATOM, $_SERVER['REQUEST_TIME']) . '] ' . $message, FILE_APPEND);
}

/**
 * 获取配置信息
 *
 * @param string $key
 *
 * @return mixed
 */
function config($key)
{
    static $config = null;
    if (is_null($config)) {
        $config = include dirname(__FILE__) . '/config.php';
        if ($config['APP_DEBUG']) {
            error_reporting(E_ALL);
        } else {
            error_reporting(0);
        }
    }
    return $config[$key];
}

/**
 * 链接数据库
 *
 * @param bool $is_close 关闭数据库链接
 *
 * @return bool|mysqli 返回MySQLi对象
 */
function connect_db($is_close = false)
{
    /** @var mysqli $mysqli */
    static $mysqli = null;
    if ($is_close) {
        if (!is_null($mysqli)) {
            $mysqli->close();
            $mysqli = null;
        }
        return true;
    }
    if (is_null($mysqli)) {
        $mysqli = new mysqli(config('DB_SERVER'), config('DB_USER'), config('DB_PWD'), config('DB_NAME'));
    }
    if ($mysqli->connect_error) {
        $mysqli = null;
        return false;
    }
    $mysqli->query("SET NAMES 'utf8'");
    return $mysqli;
}

/**
 * 获取请求来源的ip地址
 *
 * @param bool $advance 是否使用高级方式获取ip，PHP主机暴露可能被伪造
 *                      false 返回 REMOTE_ADDR
 *                      true 返回 HTTP_X_REAL_IP -> HTTP_X_FORWARDED_FOR首个ip -> HTTP_CLIENT_IP -> REMOTE_ADDR
 *                      null （默认值）采用config('GET_CLIENT_IP_ADVANCE')
 *
 * @return bool|string ip不合法返回false
 */
function get_client_ip($advance = null)
{
    $ip = false;
    if (is_null($advance)) {
        $advance = config('GET_CLIENT_IP_ADVANCE');
    }
    if ($advance) {
        if (isset($_SERVER['HTTP_X_REAL_IP'])) {
            $ip = $_SERVER['HTTP_X_REAL_IP'];
        } elseif (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $arr = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            $pos = array_search('unknown', $arr);
            if (false !== $pos) {
                unset($arr[$pos]);
            }
            $ip = trim($arr[0]);
        } elseif (isset($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (isset($_SERVER['REMOTE_ADDR'])) {
            $ip = $_SERVER['REMOTE_ADDR'];
        }
    } elseif (isset($_SERVER['REMOTE_ADDR'])) {
        $ip = $_SERVER['REMOTE_ADDR'];
    }
    return ip2long($ip) ? $ip : false;
}

/**
 * Ajax返回json
 *
 * @param $ret
 */
function jsonReturn($ret)
{
    header('Content-Type: application/json');
    echo json_encode($ret);
    exit;
}

/**
 * Ajax返回json
 *
 * @param $ret
 */
function rawReturn($ret)
{
    header('Content-Type: application/octet-stream');
    echo $ret;
    exit;
}

/**
 * 检查ip是否重复
 */
function check_ip($table = 'vote_record')
{
    $mysqli = connect_db();
    $stmt = $mysqli->prepare("SELECT COUNT(*) FROM `$table` WHERE `ip` = ? AND `created_at` > DATE_SUB(NOW(), INTERVAL 1 HOUR)");
    $ip = get_client_ip();
    $stmt->bind_param('s', $ip);
    $count = 2147483647;
    $stmt->bind_result($count);
    $stmt->execute();
    $stmt->fetch();
    if ($count > config('IP_LIMIT')) {
        http_response_code(403);
        exit;
    }
}
