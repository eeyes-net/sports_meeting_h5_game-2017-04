Game.data = {};
Game.data.server = {
    base: '/',
    imgPlanePath: 'images/plane.png',
    getGameRecordURL: 'index.php?action=get_game_record',
    postGameRecordURL: 'index.php?action=post_game_record'
};
Game.data.blocks = [
    {pos: [0, 0.5493, 0.3, 1.0013], text: '西安交通大学的前身是1896年创建于上海的南洋公学；1905年划归商部，改名为高等实业学堂'},
    {pos: [0.75, 0.5493, 1, 1.0013], text: '南阳公学是南洋公学为中国近代历史上最早创办的大学之一'},
    {pos: [0, 2.0413, 0.4, 2.564], text: '1906年改隶邮传部，更名为邮传部上海高等实业学堂'},
    {pos: [0.54, 2.853, 1, 3.2573], text: '在此之后我校有经历了数次改名但不变的是为国为民的核心'},
    {pos: [0, 3.8373, 0.25, 4.336], text: '1921年上海工业专门学校、唐山工业专门学校、北平铁道管理学校、'},
    {pos: [0.7, 3.8373, 1, 4.336], text: '北平邮电学校合并成立交通大学。交通大学的名字第一次登上了历史舞台'},
    {pos: [0.55, 4.6413, 1, 5.1413], text: '在随后的几十年里，交通大学蓬勃发展为国家培养出许多人才'},
    {pos: [0, 5.8053, 0.4, 6.4573], text: '1959年，交通大学迎来了其最重要的转折点之一-——西迁'},
    {pos: [0.8, 5.8053, 1, 6.5773], text: '新中国成立后，根据国家经济建设发展战略的需要，国务院决定1956年交通大学的主体内迁西安。1959年定名为西安交通大学。'},
    {pos: [0, 7.6307, 0.6, 8.2], text: '2000年4月经国务院批准，西安医科大学、陕西财经学院与西安交通大学实现合并。西安交通大学的发展步入了新的篇章'},
    {pos: [0.4, 9.396, 0.8, 10.1613], text: '现在的西安交通大学，已经成为了一所学习气氛浓厚，景色优美，精英云集的中国一流学校'},
    {pos: [0, 11.2507, 0.5, 11.873], text: '交大历经奋斗才取得了今日的成功，交大人的精气神，也在运动会上展现的淋漓尽致'},
    {pos: [0, 13.3853, 0.25, 13.7213], text: '快去帮你们的书院赢得荣誉吧'},
    {pos: [0.8, 12.8387, 1, 12.9813], text: '加油'}
];
Game.data.plane = {
    width: .1,
    height: .1,
    turnSpeed: 10,
    minSpeed: .0002,
    maxSpeed: .0006,
    accelerateTime: 10000
};
Game.data.score = [70, 90, 99];
