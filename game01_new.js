var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')

var canvas1 = document.getElementById('canvas1')
var ctx1 = canvas1.getContext('2d')

var canvas2 = document.getElementById('canvas2')
var ctx2 = canvas2.getContext('2d')

//设置玩家1 (右下角出发)
var player1left = new Image();
player1left.src = 'static/closeleft0.png';
var player1right = new Image();
player1right.src = 'static/closeright0.png';
var player1_x = 120;
var player1_y = 255;                                         // 设置了初位置！！！
var player1_HP = 10;
var player1_FC = 5;//玩家1的战斗力
var player1_speed;//玩家1的速度
var dir1;//玩家1方向，1、2、3、4分别为上下左右
var mouth1 = 0;//mouth open:0 mouth close:1

//设置玩家2（左上角出发）
var player2left = new Image();
player1left.src = 'static/closeleft1.png';
var player2right = new Image();
player1right.src = 'static/closeright1.png';
var player2_x = 0;
var player2_y = 0;
var player2_HP = 10;
var player2_FC = 5;//玩家2的战斗力
var player2_speed;//玩家2的速度
var dir2;//玩家2方向，1、2、3、4分别为上下左右
var mouth2 = 0;//mouth open:0 mouth close:1

//设置object
var object1 = new Image();
object1.src = "";
var object2 = new Image();
object12src = "";
var object3 = new Image();
object3.src = "";

var ob_x = [];
var ob_y = [];
var ob_time = [];
var ob_value = [];

var time = 0;

function generate_object(){
    for (var i = 0; i < 500; i++){
        var tmp_type = Math.random();
        var tmp_posX = Math.random();
        var tmp_posY = Math.random();//the object can be covered by the player once it occurs
        if (tmp_type >= 0.5){
            ob_value.push(2);
            ob_x.push(tmp_posX * 270);
            ob_y.push(tmp_posY * 150);
            ob_time.push(Math.floor(Math.random() * 3) + 4);//the duration is 4-6s(include 4 and 6)
        } 
        else if(tmp_type >= 0.3){
            ob_value.push(5);
            ob_x.push(tmp_posX * 270);
            ob_y.push(tmp_posY * 150);
            ob_time.push(Math.floor(Math.random() * 3) + 1);//1-3 seconds
        }
        else{
            ob_value.push(-3);
            var player_pos_x = [];
            var player_pos_y = [];
            player_pos_x.push(player1_x);
            player_pos_x.push(player2_x);
            player_pos_y.push(player1_y);
            player_pos_y.push(player2_y);
            var chos = Math.floor(Math.random()*2);
            ob_x.push((tmp_posX - 0.5) * 120 + player_pos_x[chos]);
            ob_y.push((tmp_posY - 0.5) * 120 + player_pos_y[chos]);
            ob_time.push(Math.floor(Math.random() * 7) + 4);//4-10 seconds
        }
    }
}

function draw(){
    ctx.clearRect(0, 0, 300, 150);
    drawHPandFC();
    for (var i = 0; i < 500; i++){
        if (time >= 3 * i && time <= 3 * i + ob_time[i]){
            if (ob_value[i] == 2){
                ctx.drawImage(object1, ob_x[i], ob_y[i], 10, 10);
            }
            else if (ob_value[i] == 5){
                ctx.drawImage(object2, ob_x[i], ob_y[i], 10, 10);
            }
            else{
                ctx.drawImage(object3, ob_x[i], ob_y[i], 10, 10);
            }
        }
    }
    //画出玩家1
    if(dir1==1){
        ctx.drawImage(player1right, player1_x, player1_y, 35,30);
    }else{
        ctx.drawImage(player1right, player1_x, player1_y, 35,30);
    }
    //画出玩家2
    if(dir2==1){
        ctx.drawImage(player2right, player2_x, player2_y, 35,30);
    }else{
        ctx.drawImage(player2left, player2_x, player2_y, 35,30);
    }
}

function identify_life(){
    //检测双方HP和血量，检测游戏是否能继续
    if (player1_HP <= 0){
        return "player2 win";
    }
    else if (player2_HP <= 0){
        return "player1 win";
    }else{
        return "game continue";
    }
}

function check_collision(){
    //这个函数的作用是检测两个物体是否碰到，可以检测object和玩家操控的猫猫，也可以是猫猫和猫猫

    //检测玩家与玩家，撞到了扣血
    
    if (player1_x < player2_x + 35 && player1_x + 35 > player2_x && player1_y < player2_y + 30 && player1_y + 30 > player2_y){
        if (player1_FC > player2_FC){
            player1_HP -= floor((player1_FC-player2_FC)/10);
        }
        else if (player1_FC < player2_FC){
            player2_HP -= floor((player2_FC-player1_FC)/10);
        }
    }
    
    
    //检测玩家与物体,需要用循环遍历,撞到好的加攻击，不好的减攻击
    //玩家1
    for (var i = 0; i <= 500; i++){
        if (player1_x < ob_x[i] + 10 && player1_x + 35 > ob_x[i] && player1_y < ob_y[i] + 10 && player1_y + 30 > ob_y[i] && mouth1 == 0){
            player1_FC += ob_value[i];
            ob_value[i] = 0;
        }
    }
    //玩家2
    for (var i = 0; i <= 500; i++){
        if (player2_x < ob_x[i] + 10 && player2_x + 35 > ob_x[i] && player2_y < ob_y[i] + 10 && player2_y + 30 > ob_y[i] && mouth2 == 0){
            player2_FC += ob_value[i];
            ob_value[i] = 0;
        }
    }
}

function initCondition() {
    //随机个数生成物品，并将玩家放置在应有的位置
    generate_object();
    draw();
    
}
function drawHPandFC(){
    //画血条和攻击条
    //console.log("draw the hp")
    ctx1.fillStyle = 'red'; // 设置填充颜色
    ctx1.fillRect(1, 1, player1_HP/10*35, 4); // 填充矩形

    //ctx1.font = '10px Arial'; // 设置字体样式
    //ctx1.fillStyle = 'black'; // 设置填充颜色
    //ctx1.fillText('FC: ' + player1_FC, 5, 5); // 绘制文本

    ctx2.fillStyle = 'red'; // 设置填充颜色
    ctx2.fillRect(1, 1, player2_HP/10*35, 4); // 填充矩形

    //ctx2.font = '10px Arial'; // 设置字体样式
    //ctx2.fillStyle = 'black'; // 设置填充颜色
    //ctx2.fillText('FC: ' + player2_FC, 5, 5); // 绘制文本
}

var flag = true;  //判断游戏是否结束

function initialize(){
    //while (flag){
        //通过按键改变玩家1，2的坐标
        initCondition();
        setInterval(draw, 30);
        //玩家1通过↑↓←→移动
        document.addEventListener('keydown',function(pressButton){
            if(pressButton.code == 'ArrowRight'){
                if (player1_x + 35 < canvas.width){
                    player1_x += speed;
                    dir1 = 1;
                }
                else{
                    dir1 = 0;
                }
            }
        
            if(pressButton.code == 'ArrowLeft'){
                if (player1_x > 0){
                    player1_x -= speed;
                    dir1 = 0;
                }
                else{
                    dir1 = 1;
                }
            }
            if(pressButton.code == 'ArrowUp'){
                if(player1_y >0 && player1_y + 30<=150){
                    player1_y -= speed;
                    dir1 = 0;
                }
            }
            if(pressButton.code == 'ArrowDown'){
                if(player1_y >=0 && player1_y + 30 <150){
                    player1_y += speed;
                    dir1 = 0;
                }
            }
            if(pressButton.code == 'Space'){
                mouth1 = 1;
            }
        });
        //玩家2通过WASD移动
        document.addEventListener('keydown',function(pressButton){
            if(pressButton.key == 'D'){
                if (player2_x + 35 < canvas.width){
                    player2_x += speed;
                    dir2 = 1;
                }
                else{
                    dir2 = 0;
                }
            }
        
            if(pressButton.key == 'A'){
                if (player2_x > 0){
                    player2_x -= speed;
                    dir2 = 0;
                }
                else{
                    dir2 = 1;
                }
            }
            if(pressButton.key == 'W'){
                if(player2_y >0 && player2_y + 30<=150){
                    player2_y -= speed;
                    dir2 = 0;
                }
            }
            if(pressButton.key == 'S'){
                if(player2_y >=0 && player2_y + 30 <150){
                    player2_y += speed;
                    dir2 = 0;
                }
            }
            if(pressButton.code == 'Q'){
                mouth2 = 1;
            }
        });
        check_collision();
        var identify = identify_life();//检测双方HP和血量，检测游戏是否能继续
        if (identify != "game continue"){
            flag = false;
        }
    //}
    

}



