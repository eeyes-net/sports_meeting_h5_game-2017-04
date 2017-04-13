<?php

return array(
    'APP_DEBUG' => false,

    'DB_SERVER' => '127.0.0.1',
    'DB_USER' => 'test',
    'DB_PWD' => 'test',
    'DB_NAME' => 'test_h5_game',

    'GET_CLIENT_IP_ADVANCE' => false, // 是否使用高级方式获取，采用代理的时候需设置成true
    'GAME_TIMEOUT' => 3, // 游戏提交间隔
    'VOTE_TIMEOUT' => 300, // 投票时间间隔
);
