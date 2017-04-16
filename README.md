# 西安交通大学2017年校运动会H5小游戏

* 2017-03-31 筹备
* 2017-04-03 开始编写代码

## 部署

* 要求`php >= 5.4`，开启`mysqli`扩展

1. 解压到服务器

2. 新建数据库，并执行`app/install/install.sql.example`

3. 将服务器根目录选择在`public/`文件夹

## 说明

### 游戏说明

* 游戏时长：1分钟左右
* 游戏模式：飞机向下飞行绕过障碍物
* 游戏目标：飞行抵达终点
* 游戏奖励：为自己的书院加油的机会
* 其他目的：宣传交大创新港与交大历史

### 交互说明

* 来到页面显示教学帮助
* 游戏之后显示投票窗口
* 必须达到一定距离才可以投票
* 投票窗口显示各个书院的票数

### 算法说明

首先：假设飞机的惯性和角惯量都是0，忽略空气阻力，即只满足运动形式，不考虑受力是否合理。
（牛顿不用从棺材出来了，你那套在这不适用）

* 飞机只像正对方向移动，前进速度是匀加速运动
* 飞机转向只改变速度方向，前进速度不会因转向改变
* 飞机转向是匀角速度的，转角大小取决于玩家按住的时长
* 障碍物都是方形的，飞机碰撞检测的区域是圆形的
* 屏幕左右边界不能触碰

### 服务器说明

* 记录完成时间、投票的书院、浏览器UA
* 飞机飞行轨迹的记录是以BLOB方式记录的，编解码函数在`Game.js`中

## Contributor

* 游戏设计: Liu Borui
* 页面设计: @lwyanne
* 图片提供: Liu Xuan
* HTML+CSS+Javascript: Ganlv(@ganlvtech), 王豪(@594WangHao)

## LICENSE

    The MIT License (MIT)

    Copyright (c) 2017 eeyes.net

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.
