(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var StartScene = require("./modules/scenes/StartScene");
var GameScene = require("./modules/scenes/GameScene");
var ResultScene = require("./modules/scenes/ResultScene");

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'mainCanvas', {}, true);

game.state.add("StartScene", StartScene);  // 游戏开始场景
game.state.add("GameScene", GameScene);    // 游戏场景
game.state.add("ResultScene", ResultScene); // 游戏结果场景
game.state.start("StartScene");

}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_94d6a0b0.js","/")
},{"./modules/scenes/GameScene":21,"./modules/scenes/ResultScene":22,"./modules/scenes/StartScene":23,"Zbi7gb":25,"buffer":26}],2:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 常用函数
 */

var Utils = {
    // 继承
    extend: function (child, parent) {
        var p = parent.prototype;
        var c = child.prototype;
        for (var i in p) {
            c[i] = p[i];
        }
        c.uber = p;
    },

    getChildByKey: function (parent, key) {
        var _child = [];
        for (var i = 0; i < parent.children; i++) {
            if (parent.children[i].key == key) {
                _child.push(parent.children[i]);
            }
        }

        if (_child.length == 0) {
            console.warn("没有在匹配的key: " + key);
        } else if (_child.length == 1) {
            return _child[0];
        } else if (_child.length > 1) {
            return _child;
        }
    }
}

module.exports = Utils;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\Utils.js","/modules")
},{"Zbi7gb":25,"buffer":26}],3:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 电脑AI
 */
var DataManager = require("./DataManager");
var EnemyFighter = require("./EnemyFighter");

function AI() {
    this.enemyChoise = null;
}

// 出牌
AI.prototype.shotCard = function (game) {
    this.enemyChoise = this.choiseCard();
    DataManager.turn = 0;

    if (!this.enemyChoise) {
        // 没有合适的卡牌
        DataManager.turnOverButton.loadTexture("hero_turn_button");
        alert("敌人选择不出牌,不知道有什么阴谋诡计");
        return;
    }

    try {
        if (DataManager.enemyFighters.fightObj.length >= 5) {
            DataManager.turnOverButton.loadTexture("hero_turn_button");
            alert("敌人选择不出牌,不知道有什么阴谋诡计");
            return;
        }
    } catch (e) {

    }

    if (DataManager.enemyFighters == null) {
        DataManager.enemyFighters = new EnemyFighter(game);
        DataManager.enemyFighters.buildFighter(game, this.enemyChoise.cardInfo.HP, this.enemyChoise.cardInfo.attack, this.enemyChoise.cardInfo.cnName, this.enemyChoise.cardInfo.fight);
    } else {
        DataManager.enemyFighters.buildFighter(game, this.enemyChoise.cardInfo.HP, this.enemyChoise.cardInfo.attack, this.enemyChoise.cardInfo.cnName, this.enemyChoise.cardInfo.fight);
    }

    this.enemyChoise.destroy();
    DataManager.enemyHandCard.reListHandCard();
    this.enemyChoise = null;

    DataManager.turnOverButton.loadTexture("hero_turn_button");
}

// 选择手牌
AI.prototype.choiseCard = function () {
    var shotList = [];
    var _fee = parseInt(DataManager.enemyFee.feeObj.text.split("/")[0]);

    for (var i = 0; i < DataManager.enemyHandCard.cardViewList.length; i++) {
        if (_fee >= DataManager.enemyHandCard.cardViewList[i].cardInfo.fee) {
            // 只要费用允许，就放入可出的牌之中
            shotList.push(DataManager.enemyHandCard.cardViewList[i]);
        }
    }

    if (shotList.length >= 1) {
        // 返回左手第一张牌
        return shotList[0];
    }
}

// 选择要攻击的目标
AI.prototype.choiseAttackTarget = function (game) {
    // 敌人没有随从
    if (!DataManager.enemyFighters || DataManager.enemyFighters.fightObj.length == 0) {
        return;
    }

    if (DataManager.heroFighters == null) { // 判断玩家的随从是否存在
        for (var i = 0; i < DataManager.enemyFighters.fightObj.length; i++) {
            if (DataManager.enemyFighters.fightObj[i].sleep == false) {
                alert("敌人的" + DataManager.enemyFighters.fightObj[i].cnName + "攻击了你的英雄");

                // 更新攻击之后的状态
                DataManager.enemyFighters.fightObj[i].sleep = true;
                DataManager.enemyFighters.fightObj[i].alpha = 0.7;
                DataManager.heroHead.HPObj.setText(parseInt(DataManager.heroHead.HPObj.text) - DataManager.enemyFighters.fightObj[i].attack);

                if (parseInt(DataManager.heroHead.HPObj.text) <= 0) {
                    DataManager.result = 0;
                    alert("敌人获取了胜利，玩家阵亡");
                    game.state.start("ResultScene");
                    return;
                }
            }
        }
    } else {

        var _heroFightersAttack = 0;
        var _enemyFightersAttack = 0;

        // 计算电脑AI的场攻
        for (var j = 0; j < DataManager.enemyFighters.fightObj.length; j++) {
            _enemyFightersAttack += DataManager.enemyFighters.fightObj[j].attack;
        }

        // 计算玩家战场上的场攻
        for (var k = 0; k < DataManager.heroFighters.fightObj.length; k++) {
            _heroFightersAttack += DataManager.heroFighters.fightObj[k].attack;
        }

        var _destroyList = [];
        for (var i = 0; i < DataManager.enemyFighters.fightObj.length; i++) {
            if (DataManager.enemyFighters.fightObj[i].sleep == false) {
                console.log("attack");

                if (_enemyFightersAttack >= _heroFightersAttack) { // AI场攻大于玩家随从的场攻
                    alert("敌人的" + DataManager.enemyFighters.fightObj[i].cnName + "攻击了你的英雄");
                    // 更新攻击之后的状态
                    DataManager.enemyFighters.fightObj[i].sleep = true;
                    DataManager.enemyFighters.fightObj[i].alpha = 0.7;
                    DataManager.heroHead.HPObj.setText(parseInt(DataManager.heroHead.HPObj.text) - DataManager.enemyFighters.fightObj[i].attack);

                    if (parseInt(DataManager.heroHead.HPObj.text) <= 0) {
                        DataManager.result = 0;
                        alert("敌人获取了胜利，玩家阵亡");
                        game.state.start("ResultScene");
                        return;
                    }

                } else {
                    // AI场攻小于玩家场攻则攻击随从
                    alert("敌方的" + DataManager.enemyFighters.fightObj[i].cnName + "攻击了我方的" + DataManager.heroFighters.fightObj[0].cnName);

                    var _heroFightHP = DataManager.enemyFighters.fightObj[i].hp - DataManager.heroFighters.fightObj[0].attack;
                    var _enemyFightHP = DataManager.heroFighters.fightObj[0].hp - DataManager.enemyFighters.fightObj[i].attack;

                    // 更新玩家的随从的hp
                    DataManager.enemyFighters.fightObj[i].hp = _heroFightHP;
                    DataManager.enemyFighters.fightObj[i].alpha = 0.7;
                    DataManager.enemyFighters.fightObj[i].sleep = true;
                    DataManager.enemyFighters.fightObj[i].children[2].alpha = 0;
                    DataManager.enemyFighters.fightObj[i].children[1].setText(_heroFightHP);

                    // 更新敌人的玩家的hp
                    DataManager.heroFighters.fightObj[0].hp = _enemyFightHP;
                    DataManager.heroFighters.fightObj[0].children[1].setText(_enemyFightHP);

                    if (_heroFightHP <= 0) {
                        _destroyList.push(DataManager.enemyFighters.fightObj[i]);
                    }

                    if (_enemyFightHP <= 0) {
                        DataManager.heroFighters.fightObj[0].destroy();
                        DataManager.heroFighters.reListObjs();
                    }
                }
            }
        }

        for (var n = 0; n < _destroyList.length; n++) {
            _destroyList[n].destroy();
        }
        DataManager.enemyFighters.reListObjs();
    }
}


module.exports = AI;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\AI.js","/modules\\class")
},{"./DataManager":6,"./EnemyFighter":8,"Zbi7gb":25,"buffer":26}],4:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 背景类
 */

function BackGround(game) {
    this.picObj = null;
    this.init(game);
}

BackGround.prototype.init = function (game) {
    this.picObj = this.setPic(game);

}

BackGround.prototype.setPic = function (game) {
    var background = game.add.image(0, 0, "background");
    return background;
}

module.exports = BackGround;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\BackGround.js","/modules\\class")
},{"Zbi7gb":25,"buffer":26}],5:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 卡组生成器
 */

function CardGenerator() {}

// 卡组生成器
// @param cardLength [number] 卡组最大的长度
// @param minIndex [number] 最小索引
// @param maxIndex [number] 最大索引
// @return cardList [array] 卡牌id生成数组
CardGenerator.prototype.buildCardList = function(cardLength, minIndex, maxIndex) {
    var cardList = [];
    for (var i = 0; i < cardLength; i++) {
        var ramdom = Math.floor(Math.random() * maxIndex) + minIndex;
        cardList.push(ramdom);
    }
    return cardList;
}

module.exports = CardGenerator;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\CardGenerater.js","/modules\\class")
},{"Zbi7gb":25,"buffer":26}],6:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 游戏数据管理类
 */

var DataManager = {
	turn: 0, // 0代表自己回合,1代表敌人回合 
	fee: 1, // 初始化费用，和游戏回合相关
	AI: null,

	heroChoiseCard: null, // 英雄选择的卡牌
	heroFighters: null, // 英雄随从
	heroHandCard: null, // 英雄手牌
	heroFee: null, // 英雄的费用
	heroHead: null, // 英雄头像
	heroFighterChoise: null, // 战斗随从的选择
	heroCurrentFee: 1, // 玩家当前费用

	enemyHandCard: null, // 敌人手牌 
	enemyFee: null, // 敌人的费用
	enemyHead: null, // 敌人的头像
	enemyFighters: null, // 敌人战场的随从
	enemyCurrentFee: 1, // 敌人当前费用

	turnOverButton: null, // 回合结束的按钮
	result:0 // 0 代表玩家失败，1代表玩家胜利
}

module.exports = DataManager;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\DataManager.js","/modules\\class")
},{"Zbi7gb":25,"buffer":26}],7:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var utils = require("../Utils");
var Fee = require("./Fee");

/**
 * 敌人费用管理
 */

function EnemyFee(game, x, y) {
    Fee.apply(this, arguments);
}

utils.extend(EnemyFee, Fee);

module.exports = EnemyFee;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\EnemyFee.js","/modules\\class")
},{"../Utils":2,"./Fee":11,"Zbi7gb":25,"buffer":26}],8:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 敌人的战场随从
 */
var DataManager = require("./DataManager");

var utils = require("../Utils");
var Fighter = require("./Fighter");

function EnemyFighter(game) {
    Fighter.apply(this, arguments);
    this.y = game.world.centerY - 130;

}

utils.extend(EnemyFighter, Fighter);

// 重写choiseFighter 
// 在玩家选择敌方随从时进行战斗结算
EnemyFighter.prototype.choiceFighter = function (fightBg) {
    if (DataManager.heroFighterChoise == null) {
        return;
    }
    else {

        alert("我方的" + DataManager.heroFighterChoise.cnName + "攻击了敌人的" + fightBg.cnName);

        var _heroFightHP = DataManager.heroFighterChoise.hp - fightBg.attack;
        var _enemyFightHP = fightBg.hp - DataManager.heroFighterChoise.attack;

        // 更新玩家的随从的hp
        DataManager.heroFighterChoise.hp = _heroFightHP;
        DataManager.heroFighterChoise.alpha = 0.7;
        DataManager.heroFighterChoise.sleep = true;
        DataManager.heroFighterChoise.children[2].alpha = 0;
        DataManager.heroFighterChoise.children[1].setText(_heroFightHP);

        // 更新敌人的玩家的hp
        fightBg.hp = _enemyFightHP;
        fightBg.children[1].setText(_enemyFightHP);

        if (_heroFightHP <= 0) {
            DataManager.heroFighterChoise.destroy();
            DataManager.heroFighters.reListObjs();
        }

        if (_enemyFightHP <= 0) {
            fightBg.destroy();
            DataManager.enemyFighters.reListObjs();
        }

        DataManager.heroFighterChoise = null;
        
    }
}

module.exports = EnemyFighter;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\EnemyFighter.js","/modules\\class")
},{"../Utils":2,"./DataManager":6,"./Fighter":12,"Zbi7gb":25,"buffer":26}],9:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 敌人的手牌类
 */

var HandCarnd = require("./HandCard");
var utils = require("../Utils");
var CardConfig = require("../config/CardConfig");

function EnemyHandCard(game) {
    HandCarnd.apply(this, arguments);
    // this.setRealHandCard(game); // 真实卡面
    this.buildHandCardViewList(game); // 设置卡背

}

utils.extend(EnemyHandCard, HandCarnd);

// @override  
// 重写relistHandCard方法
EnemyHandCard.prototype.reListHandCard = function () {
    var self = this;
    var _temp = [];
    console.log(self.cardViewList);

    if (self.cardViewList.length == 0) { // 没有手牌的情况
        return;
    } else {
        for (var i = 0; i < self.cardViewList.length; i++) {
            if (self.cardViewList[i].alive == true) { // 清除掉已经销毁了的手牌
                _temp.push(self.cardViewList[i]);
            }
        }
        self.cardViewList = _temp;

        for (var j = 0; j < self.cardViewList.length; j++) { // 重新对手牌排序
            self.cardViewList[j].x = self.x + j * 70;
        }
    }
}

// @override 
// 重写回合开始时的补牌逻辑
EnemyHandCard.prototype.addCard = function (game) {
    var _cardList = this.cardIDList.splice(0, 1);

    if (this.cardViewList.length >= 8) {
        alert("敌人已达到上限，当前到的卡牌被销毁");
        return;
    }

    console.log(_cardList);
    for (var j = 0; j < CardConfig.card_info.length; j++) {

        if (_cardList[0] == CardConfig.card_info[j].id) {
            var card = game.add.image(this.x + this.cardViewList.length * 70, this.y, "card_back");

            // 设置相应的数据
            card.cardInfo = {};
            card.cardInfo.HP = CardConfig.card_info[j].hp; // 血量
            card.cardInfo.attack = CardConfig.card_info[j].attack; // 攻击力
            card.cardInfo.cnName = CardConfig.card_info[j].cn_name; // 中文名称
            card.cardInfo.fee = CardConfig.card_info[j].fee; // 召唤费用
            card.cardInfo.fight = CardConfig.card_info[j].fight; // 战斗图片
            card.scale.set(0.5);
            this.cardViewList.push(card);
        }
    }
}

module.exports = EnemyHandCard;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\EnemyHandCard.js","/modules\\class")
},{"../Utils":2,"../config/CardConfig":20,"./HandCard":13,"Zbi7gb":25,"buffer":26}],10:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 敌人头像
 */

var utils = require("../Utils");
var Head = require("./Head");
var DataManager = require("./DataManager");

function EnemyHead(game, textureName, positionX, positionY) {
    Head.apply(this, arguments);
}


// 设置敌人头像
// @override重写setPic
Head.prototype.setPic = function (game) {
    var pic = game.add.image(0, 0, this.textureName);

    pic.inputEnabled = true;
    pic.events.onInputDown.add(function () {
        if (DataManager.heroFighterChoise == null) {
            return;
        }

        else {
            var _hp = parseInt(this.HPObj.text) - DataManager.heroFighterChoise.attack;
            this.HPObj.setText(_hp);

            DataManager.heroFighterChoise.alpha = 0.7;
            DataManager.heroFighterChoise.sleep = true;
            DataManager.heroFighterChoise.children[2].alpha = 0;

            alert("我方的" + DataManager.heroFighterChoise.cnName + "攻击了敌人英雄");

            DataManager.heroFighterChoise = null;

            if (parseInt(this.HPObj.text) <= 0) {
                alert("玩家获取胜利，敌人阵亡");
                DataManager.result = 1;
                game.state.start("ResultScene");
            }
        }

    }, this);

    return pic;
}

utils.extend(EnemyHead, Head);

module.exports = EnemyHead;

}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\EnemyHead.js","/modules\\class")
},{"../Utils":2,"./DataManager":6,"./Head":14,"Zbi7gb":25,"buffer":26}],11:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 费用管理类
 */

function Fee(game, x, y) {
    this.feeObj = null;
    this.x = x || game.world.width - 30;
    this.y = y || 0;
    this.init(game);
}

Fee.prototype.init = function (game) {
    this.feeObj = this.setFeePic(game);
}

// 设置Fee背景以及文字
Fee.prototype.setFeePic = function (game) {
    var fee = game.add.image(this.x, this.y, "fee");
    var text = game.add.text(60, 28, "1/1", { fill: "#fff", fontSize: "18pt" });
    text.anchor.set(0.5);
    fee.addChild(text);
    return text;
}

module.exports = Fee;

}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\Fee.js","/modules\\class")
},{"Zbi7gb":25,"buffer":26}],12:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 战斗元素类
 * @param game 
 * @param x [number] 初始化的
 */

var DataManager = require("./DataManager");

function Fighter(game) {
    this.fightObj = []; // 战斗随从数组
    this.x = 150;
    this.y = game.world.centerY + 30;
}

Fighter.prototype.init = function (game) {
}

// 生成战斗随从
Fighter.prototype.buildFighter = function (game, hp, attack, cnName, picName) {
    var fightBg = game.add.image(this.x, this.y, picName);

    fightBg.hp = hp;
    fightBg.attack = attack;
    fightBg.cnName = cnName;
    fightBg.picName = picName;
    fightBg.sleep = true; // 休眠状态，在出牌的第一回合无法进行攻击
    var _style = {
        fill: "#fff",
        fontSize: "12pt"
    }
    // 设置生命值
    var hp_text = game.add.text(75, 105, hp, _style);
    hp_text.anchor.set(0.5);
    hp_text.key = "hp";

    // 设置
    var attack_text = game.add.text(17, 105, attack, _style);
    attack_text.anchor.set(0.5);
    attack_text.key = "attack";

    var attack_tag = game.add.image(48, -15, "attack_icon");
    attack_tag.key = "attack_tag";
    attack_tag.scale.set(0.5);
    attack_tag.anchor.set(0.5);
    attack_tag.alpha = 0;

    fightBg.addChild(attack_text);
    fightBg.addChild(hp_text);
    fightBg.addChild(attack_tag);
    fightBg.alpha = 0.7; // sleep状态无法攻击
    this.fightObj.push(fightBg);
    this.reListObjs();

    fightBg.inputEnabled = true;
    fightBg.events.onInputDown.add(function () {
        this.choiceFighter(fightBg);
    }, this);

}

Fighter.prototype.reListObjs = function () {
    if (this.fightObj.length == 0) {
        // 如果随从的队列为空，不进行排序
        return;
    } else {
        var _temp= [];

        for(var j = 0; j<this.fightObj.length;j++){
            if(this.fightObj[j].alive == true){
                _temp.push(this.fightObj[j]);
            }
        }

        this.fightObj = _temp;

        // 重排战斗随从的数组
        for (var i = 0; i < this.fightObj.length; i++) {
            this.fightObj[i].x = this.x + i * 95;
        }
    }
}

Fighter.prototype.awakeFighter = function () {
    if (this.fightObj.length == 0) {
        return;
    }
    else {
        for (var i = 0; i < this.fightObj.length; i++) {
            this.fightObj[i].sleep = false; // 解除睡眠状态
            this.fightObj[i].alpha = 1; // 解除睡眠状态后的view

        }
    }
}

Fighter.prototype.choiceFighter = function (fightBg) {
    if (fightBg.sleep == true) {
        alert("本回合无法操作该随从！");
    }

    else {
        for (var i = 0; i < this.fightObj.length; i++) {
            this.fightObj[i].children[2].alpha = 0;
        }
        fightBg.children[2].alpha = 1;
        DataManager.heroFighterChoise = fightBg;
    }
}

module.exports = Fighter;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\Fighter.js","/modules\\class")
},{"./DataManager":6,"Zbi7gb":25,"buffer":26}],13:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 手牌类
 */

var CardGenerater = require("./CardGenerater");
var CardConfig = require("../config/CardConfig");
var DataManager = require("./DataManager");

function HandCard(game, x, y) {
    this.cardObjList = []; // 手牌对象数组
    this.cardViewList = []; // 手牌视图数组
    this.cardIDList = [];
    this.x = x || 140;
    this.y = y || 20;
    this.init(game);
}

HandCard.prototype.init = function (game) {
    this.cardIDList = this.setHandCardList();
    // this.buildHandCardViewList(game); // 设置卡背
    // this.setRealHandCard(game); // 真实卡面
}

// 构建手牌数组view
HandCard.prototype.buildHandCardViewList = function (game) {
    // 截取卡组中的前四张
    var _list = this.cardIDList.splice(0, 4);

    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < CardConfig.card_info.length; j++) {

            if (_list[i] == CardConfig.card_info[j].id) {
                var card = game.add.image(this.x + i * 70, this.y, "card_back");

                // 设置相应的数据
                card.cardInfo = {};
                card.cardInfo.HP = CardConfig.card_info[j].hp; // 血量
                card.cardInfo.attack = CardConfig.card_info[j].attack; // 攻击力
                card.cardInfo.cnName = CardConfig.card_info[j].cn_name; // 中文名称
                card.cardInfo.fee = CardConfig.card_info[j].fee; // 召唤费用
                card.cardInfo.fight = CardConfig.card_info[j].fight; // 战斗图片
                card.scale.set(0.5);
                this.cardViewList.push(card);
            }
        }
    }
}

// 设置卡牌的数据显示
HandCard.prototype.setRealHandCard = function (game) {
    var _list = this.cardIDList.splice(0, 4);

    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < CardConfig.card_info.length; j++) {
            if (_list[i] == CardConfig.card_info[j].id) {
                var card = game.add.image(this.x + i * 75, this.y, CardConfig.card_info[j].name);
                card.cardInfo = {};
                card.cardInfo.HP = CardConfig.card_info[j].hp; // 血量
                card.cardInfo.attack = CardConfig.card_info[j].attack; // 攻击力
                card.cardInfo.cnName = CardConfig.card_info[j].cn_name; // 中文名称
                card.cardInfo.fee = CardConfig.card_info[j].fee; // 召唤费用
                card.cardInfo.fight = CardConfig.card_info[j].fight; // 战斗图片
                card.scale.set(0.5);

                this.cardObjList.push(card);

                card.inputEnabled = true;
                card.events.onInputDown.add(function () {
                    this.inputEnabled = false; // 禁止玩家不停点击
                    if (DataManager.heroChoiseCard == null) {
                        DataManager.heroChoiseCard = this;
                    } else {
                        // 注册动画事件
                        var tween = game.add.tween(DataManager.heroChoiseCard).to({ y: DataManager.heroChoiseCard.y + 20 }, 200, "Linear", true);
                        DataManager.heroChoiseCard.inputEnabled = true;
                        // 执行动画
                        tween.start();
                        DataManager.heroChoiseCard = this;
                    }

                    var tween = game.add.tween(this).to({ y: this.y - 20 }, 200, "Linear", true);
                    tween.start();
                    tween.onComplete.add(function () {
                    });
                }, card);
            }
        }
    }
}

// 回合开始时的补牌逻辑
HandCard.prototype.addCard = function (game) {
    var _cardList = this.cardIDList.splice(0, 1);

    if (this.cardObjList.length >= 8) {
        alert("你的手牌已达到上限，当前到的卡牌被销毁");
        return;
    }

    for (var j = 0; j < CardConfig.card_info.length; j++) {
        if (_cardList[0] == CardConfig.card_info[j].id) {
            var card = game.add.image(this.x + (this.cardObjList.length) * 75, this.y, CardConfig.card_info[j].name);
            card.cardInfo = {};
            card.cardInfo.HP = CardConfig.card_info[j].hp; // 血量
            card.cardInfo.attack = CardConfig.card_info[j].attack; // 攻击力
            card.cardInfo.cnName = CardConfig.card_info[j].cn_name; // 中文名称
            card.cardInfo.fee = CardConfig.card_info[j].fee; // 召唤费用
            card.cardInfo.fight = CardConfig.card_info[j].fight; // 战斗图片
            card.scale.set(0.5);

            this.cardObjList.push(card);

            card.inputEnabled = true;
            card.events.onInputDown.add(function () {
                this.inputEnabled = false; // 禁止玩家不停点击
                if (DataManager.heroChoiseCard == null) {
                    DataManager.heroChoiseCard = this;
                } else {
                    // 注册动画事件
                    var tween = game.add.tween(DataManager.heroChoiseCard).to({ y: DataManager.heroChoiseCard.y + 20 }, 200, "Linear", true);
                    DataManager.heroChoiseCard.inputEnabled = true;
                    // 执行动画
                    tween.start();
                    DataManager.heroChoiseCard = this;
                }

                var tween = game.add.tween(this).to({ y: this.y - 20 }, 200, "Linear", true);
                tween.start();
                tween.onComplete.add(function () {
                });
            }, card);
        }
    }
}

// 重新对手牌排序
HandCard.prototype.reListHandCard = function () {
    var self = this;
    var _temp = [];
    if (self.cardObjList.length == 0) { // 没有手牌的情况
        return;
    } else {
        for (var i = 0; i < self.cardObjList.length; i++) {
            if (self.cardObjList[i].alive == true) { // 清除掉已经销毁了的手牌
                _temp.push(self.cardObjList[i]);
            }
        }
        self.cardObjList = _temp;

        for (var j = 0; j < self.cardObjList.length; j++) { // 重新对手牌排序
            self.cardObjList[j].x = self.x + j * 75;
        }
    }
}

/**
 *  生成卡牌id数组
 * @return {array} 卡组的ad数组
 */
HandCard.prototype.setHandCardList = function () {
    var cardGenerater = new CardGenerater();
    var cardIDList = cardGenerater.buildCardList(CardConfig.cardLength, 1, CardConfig.card_info.length);
    return cardIDList;
}

// 通过id构建真实手牌
module.exports = HandCard;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\HandCard.js","/modules\\class")
},{"../config/CardConfig":20,"./CardGenerater":5,"./DataManager":6,"Zbi7gb":25,"buffer":26}],14:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 角色头像类
 * @param game [obj] 游戏场景对象
 * @param textureName [string] 图片key
 * @param positionX [number] 初始化的x坐标
 * @param positionY [number] 初始化的y坐标
 */

function Head(game, textureName, positionX, positionY) {
	this.headObj = null;
	this.x = positionX;
	this.y = positionY;
	this.HPObj = null;  // 英雄血量
	this.textureName = textureName;
	this.init(game);
}

Head.prototype.init = function (game) {
	this.headObj = this.setPic(game);
	this.HPObj = this.setHP(game);
}

// 设置英雄头像
Head.prototype.setPic = function (game) {
	var pic = game.add.image(this.x, this.y, this.textureName);
	return pic;
}

// 设置血量
Head.prototype.setHP = function (game) {
	var HPbg = game.add.image(10, 170, "hp_background");
	var HP = game.add.text(HPbg.width / 2, HPbg.height / 2 + 5, "30", { fill: "#fff", fontSize: "24pt" });
	HP.anchor.set(0.5);
	HPbg.addChild(HP);

	return HP;
}

module.exports = Head;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\Head.js","/modules\\class")
},{"Zbi7gb":25,"buffer":26}],15:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 玩家水晶管理
 */

var Fee = require("./Fee");
var utils = require("../Utils");

function HeroFee(game) {
    Fee.apply(this, arguments);
}

utils.extend(HeroFee, Fee);

module.exports = HeroFee;

}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\HeroFee.js","/modules\\class")
},{"../Utils":2,"./Fee":11,"Zbi7gb":25,"buffer":26}],16:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * Hero战斗随从
 */

var Fighter = require("./Fighter");
var utils = require("../Utils");

function HeroFighter(game){
    Fighter.apply(this,arguments);
}

utils.extend(HeroFighter,Fighter);

module.exports = HeroFighter;


}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\HeroFighter.js","/modules\\class")
},{"../Utils":2,"./Fighter":12,"Zbi7gb":25,"buffer":26}],17:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 英雄的手牌类
 */

var HandCarnd = require("./HandCard");
var utils = require("../Utils");

function HeroHandCard(game, x, y) {
    HandCarnd.apply(this, arguments);
    this.setRealHandCard(game); // 真实卡面
}

utils.extend(HeroHandCard, HandCarnd);

module.exports = HeroHandCard;

}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\HeroHandCard.js","/modules\\class")
},{"../Utils":2,"./HandCard":13,"Zbi7gb":25,"buffer":26}],18:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 玩家角色头像
 */
var utils = require("../Utils");
var Head = require("./Head");

function HeroHead(game, textureName, positionX, positionY) {
    Head.apply(this, arguments);
}

// HeroHead继承自Head类
utils.extend(HeroHead, Head);

/**
 *  @override 重写setHP方法
 */
HeroHead.prototype.setHP = function(game) {
    var HPbg = game.add.image(this.x, this.y - 55, "hp_background");
    var HP = game.add.text(HPbg.width / 2, HPbg.height / 2 + 5, "30", {
        fill: "#fff",
        fontSize: "24pt"
    });
    HP.anchor.set(0.5);
    HPbg.addChild(HP);

    return HP;
}

module.exports = HeroHead;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\HeroHead.js","/modules\\class")
},{"../Utils":2,"./Head":14,"Zbi7gb":25,"buffer":26}],19:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * UI界面管理
 */

var BackGround = require("./BackGround");
var HeroHead = require("./HeroHead");
var EnemyHead = require("./EnemyHead");
var DataManager = require("./DataManager");
var HeroHandCard = require("./HeroHandCard");
var EnemyHandCard = require("./EnemyHandCard");
var HeroFee = require("./HeroFee");
var EnemyFee = require("./EnemyFee");
var AI = require("./AI");

var HeroFighter = require("./HeroFighter");

function UIManager(game) {
    this.backgroundObj = null; // 背景图
    this.turnOverButton = null; // 回合结束
    this.shotCardButton = null; // 出牌按钮
    this.init(game);
}

UIManager.prototype.init = function(game) {
    // 生成背景图
    this.backgroundObj = this.setBackGround(game);
    // 生成玩家英雄头像
    DataManager.heroHead = new HeroHead(game, "fighter_hero", 0, game.world.height - 140);

    // 生成电脑英雄头像
    DataManager.enemyHead = new EnemyHead(game, "fighter_hero", 0, 0);

    // 设置回合结束按钮
    DataManager.turnOverButton = this.setTurnOverButton(game);
    // 设置敌人手牌
    DataManager.enemyHandCard = new EnemyHandCard(game);

    // 设置玩家手牌 
    DataManager.heroHandCard = new HeroHandCard(game, null, game.world.height - 120);

    this.shotCardButton = this.setShotCardButton(game); // 设置出牌按钮

    // 英雄费用管理
    DataManager.heroFee = new HeroFee(game, game.world.width - 110, game.world.centerY + 42); 
    
    // 敌人费用管理
    DataManager.enemyFee = new EnemyFee(game, game.world.width - 110, game.world.centerY - 90); 

    // 创建AI
    DataManager.AI = new AI(); 
}

// 设置背景
UIManager.prototype.setBackGround = function(game) {
    var background = new BackGround(game);
    return background;
}

// 回合结束
UIManager.prototype.setTurnOverButton = function(game) {
    var button = game.add.image(game.world.width - 150, game.world.centerY - 30, "hero_turn_button");
    button.inputEnabled = true;
    button.events.onInputDown.add(function() {
        if (DataManager.turn == 0) {
            button.loadTexture("enemy_turn_button");
            DataManager.turn = 1;
        }
        if (DataManager.enemyFighters) {
            DataManager.enemyFighters.awakeFighter(); // 解除敌人随从睡眠状态
        }

        DataManager.enemyFee.feeObj.setText(DataManager.fee + "/" + DataManager.fee);
        DataManager.enemyHandCard.addCard(game); // 敌人摸牌
        var time = setTimeout(function() {
            DataManager.AI.shotCard(game);
            DataManager.AI.choiseAttackTarget(game); // 电脑AI展开攻击
            if (DataManager.heroFighters) {
                DataManager.heroFighters.awakeFighter(); // 解除玩家随从睡眠状态
            }

            // 更新玩家费用的情况
            if (DataManager.fee < 9) {
                DataManager.fee += 1;
            }

            DataManager.heroCurrentFee = DataManager.fee;
            DataManager.heroFee.feeObj.setText(DataManager.fee + "/" + DataManager.fee);
            DataManager.heroHandCard.addCard(game); // 玩家摸牌
            clearTimeout(time);
        }, 1000);

    });
    return button;
}

// 出牌按钮
UIManager.prototype.setShotCardButton = function(game) {
    var shot = game.add.image(80, game.world.centerY - 10, "shot_card");
    shot.anchor.set(0.5);
    shot.inputEnabled = true;
    shot.events.onInputDown.add(function() {
        if (DataManager.turn != 0) {
            return;
        }

        // 控制玩家场上的随从
        try {
            if (DataManager.heroFighters.fightObj.length >= 5) {
                alert("您场上的随从已经到达了上限");
                return;
            }
        } catch (e) {}

        if (DataManager.heroChoiseCard) {

            // 检查选择卡牌的费用是否超出当前可用费用
            if (DataManager.heroCurrentFee < DataManager.heroChoiseCard.cardInfo.fee) {
                alert("你的费用不足，无法使用这张卡牌");
                return;
            }

            DataManager.heroCurrentFee = DataManager.heroCurrentFee - DataManager.heroChoiseCard.cardInfo.fee;
            DataManager.heroFee.feeObj.setText(DataManager.heroCurrentFee + "/" + DataManager.fee);

            if (DataManager.heroFighters == null) {
                DataManager.heroFighters = new HeroFighter(game);
                DataManager.heroFighters.buildFighter(game, DataManager.heroChoiseCard.cardInfo.HP, DataManager.heroChoiseCard.cardInfo.attack, DataManager.heroChoiseCard.cardInfo.cnName, DataManager.heroChoiseCard.cardInfo.fight);
            } else {
                DataManager.heroFighters.buildFighter(game, DataManager.heroChoiseCard.cardInfo.HP, DataManager.heroChoiseCard.cardInfo.attack, DataManager.heroChoiseCard.cardInfo.cnName, DataManager.heroChoiseCard.cardInfo.fight);
            }

            DataManager.heroChoiseCard.destroy();
            DataManager.heroHandCard.reListHandCard();
            DataManager.heroChoiseCard = null;
        }

    });
    return shot;
}
module.exports = UIManager;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\UIManager.js","/modules\\class")
},{"./AI":3,"./BackGround":4,"./DataManager":6,"./EnemyFee":7,"./EnemyHandCard":9,"./EnemyHead":10,"./HeroFee":15,"./HeroFighter":16,"./HeroHandCard":17,"./HeroHead":18,"Zbi7gb":25,"buffer":26}],20:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 游戏卡牌的配置文件
 */

var CardConfig = {
    "card_info": [{
        "name": "fishman_baby",
        "fight": "fishman_baby_fight",
        "cn_name": "鱼人宝宝",
        "fee": 1,
        "attack": 1,
        "hp": 1,
        "id": 1
    }, {
        "name": "freshwater_crocodile",
        "fight": "freshwater_crocodile_fight",
        "cn_name": "淡水鳄",
        "fee": 2,
        "attack": 2,
        "hp": 3,
        "id": 2
    }, {
        "name": "ogre",
        "fight": "ogre_fight",
        "cn_name": "食人魔法师",
        "fee": 4,
        "attack": 4,
        "hp": 4,
        "id": 3
    }, {
        "name": "dead_wing",
        "fight": "dead_wing_fight",
        "cn_name": "死亡之翼",
        "fee": 9,
        "attack": 9,
        "hp": 9,
        "id": 4
    },{
        "name": "rose",
        "fight": "rose_fight",
        "cn_name": "拉格纳罗斯",
        "fee": 8,
        "attack": 8,
        "hp": 8,
        "id": 5
    },{
        "name": "velociraptor",
        "fight": "velociraptor_fight",
        "cn_name": "超级迅猛龙",
        "fee": 4,
        "attack": 4,
        "hp": 5,
        "id": 6
    }], // 卡牌的相关信息
    "cardLength": 15, // 卡组长度
    "cardInitialLength": 4, // 初始化手牌长度
}

module.exports = CardConfig;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\config\\CardConfig.js","/modules\\config")
},{"Zbi7gb":25,"buffer":26}],21:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 游戏主场景
 */

var UIPanel = require("../class/UIManager");

function GameScene(game) {
    this.preload = function () {
        // 加载提示声明
        var loadText = game.add.text(game.world.centerX, game.world.centerY, "Loading ... ", { fill: "#333", "fontSize": "28pt" });

        // 锚点设置
        loadText.anchor.set(0.5);

        game.load.image("background", "../../resource/background.png");
        game.load.image("card_back", "../../resource/card_back.png");
        game.load.image("enemy_turn_button", "../../resource/enemy_turn_button.png");
        game.load.image("fee", "../../resource/fee.png");
        game.load.image("hero_turn_button", "../../resource/hero_turn_button.png");
        game.load.image("hp_background", "../../resource/hp_background.png");
        game.load.image("attack_icon","../../resource/attack_icon.png");
        game.load.image("shot_card","../../resource/shot_card.png");
        game.load.image("fighter_hero", "../../resource/fighter_hero.png");
        
        game.load.image("dead_wing", "../../resource/dead_wing.png");
        game.load.image("dead_wing_fight", "../../resource/dead_wing_fight.png");
        game.load.image("fishman_baby", "../../resource/fishman_baby.png");
        game.load.image("fishman_baby_fight", "../../resource/fishman_baby_fight.png");
        game.load.image("freshwater_crocodile", "../../resource/freshwater_crocodile.png");
        game.load.image("freshwater_crocodile_fight", "../../resource/freshwater_crocodile_fight.png");
        game.load.image("ogre", "../../resource/ogre.png");
        game.load.image("ogre_fight", "../../resource/ogre_fight.png");
        game.load.image("rose","../../resource/rose.png");
        game.load.image("rose_fight","../../resource/rose_fight.png");
        game.load.image("velociraptor","../../resource/velociraptor.png");
        game.load.image("velociraptor_fight","../../resource/velociraptor_fight.png");

        // 单个文件加载完的回调
        game.load.onFileComplete.add(function () {
            loadText.setText("Loading ... " + arguments[0]);
        });

        // 所有文件加载完成回调
        game.load.onLoadComplete.add(function () {
            loadText.destroy();
        });

    }
    this.create = function () {
        // 添加ui界面
        var ui = new UIPanel(game);

    }
}

module.exports = GameScene;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\scenes\\GameScene.js","/modules\\scenes")
},{"../class/UIManager":19,"Zbi7gb":25,"buffer":26}],22:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 *  游戏结果场景
 */

var DataManager = require("../class/DataManager");

function ResultScene(game) {
    this.create = function () {
        if (DataManager.result == 0) {
            console.log("敌人胜利");
            var text = game.add.text(game.world.centerX, game.world.centerY, "You Loss", {
                fill: "#000",
            });

            text.anchor.set(0.5);

        } else {
            var text = game.add.text(game.world.centerX, game.world.centerY, "You Win", {
                fill: "#000",
                fontSize: "30pt"
            });
            text.anchor.set(0.5);
        }
    }
}

module.exports = ResultScene;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\scenes\\ResultScene.js","/modules\\scenes")
},{"../class/DataManager":6,"Zbi7gb":25,"buffer":26}],23:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 游戏开始场景 
 */

function StartScene(game) {
    this.preload = function () {
    }

    this.create = function () {
        var style = {
            fill: "#000",
            fontSize: "32pt"
        }
        var text = game.add.text(game.world.centerX, game.world.centerY, "欢迎来到我的炉石传说", style);

        text.anchor.set(0.5);

        var startButton = game.add.text(game.world.centerX, game.world.centerY + 70, "开始游戏", { fill: "#333", fontSize: "24pt" });

        startButton.anchor.set(0.5);

        startButton.inputEnabled = true;
        startButton.events.onInputDown.add(function () {
            game.state.start("GameScene");
        },this);
    }
}

module.exports = StartScene;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\scenes\\StartScene.js","/modules\\scenes")
},{"Zbi7gb":25,"buffer":26}],24:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/node_modules\\base64-js\\lib\\b64.js","/node_modules\\base64-js\\lib")
},{"Zbi7gb":25,"buffer":26}],25:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/node_modules\\browserify\\node_modules\\process\\browser.js","/node_modules\\browserify\\node_modules\\process")
},{"Zbi7gb":25,"buffer":26}],26:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/node_modules\\buffer\\index.js","/node_modules\\buffer")
},{"Zbi7gb":25,"base64-js":24,"buffer":26,"ieee754":27}],27:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/node_modules\\ieee754\\index.js","/node_modules\\ieee754")
},{"Zbi7gb":25,"buffer":26}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxQaGFzZXJIZWFydGhTdG9uZVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiRTovUGhhc2VySGVhcnRoU3RvbmUvZmFrZV85NGQ2YTBiMC5qcyIsIkU6L1BoYXNlckhlYXJ0aFN0b25lL21vZHVsZXMvVXRpbHMuanMiLCJFOi9QaGFzZXJIZWFydGhTdG9uZS9tb2R1bGVzL2NsYXNzL0FJLmpzIiwiRTovUGhhc2VySGVhcnRoU3RvbmUvbW9kdWxlcy9jbGFzcy9CYWNrR3JvdW5kLmpzIiwiRTovUGhhc2VySGVhcnRoU3RvbmUvbW9kdWxlcy9jbGFzcy9DYXJkR2VuZXJhdGVyLmpzIiwiRTovUGhhc2VySGVhcnRoU3RvbmUvbW9kdWxlcy9jbGFzcy9EYXRhTWFuYWdlci5qcyIsIkU6L1BoYXNlckhlYXJ0aFN0b25lL21vZHVsZXMvY2xhc3MvRW5lbXlGZWUuanMiLCJFOi9QaGFzZXJIZWFydGhTdG9uZS9tb2R1bGVzL2NsYXNzL0VuZW15RmlnaHRlci5qcyIsIkU6L1BoYXNlckhlYXJ0aFN0b25lL21vZHVsZXMvY2xhc3MvRW5lbXlIYW5kQ2FyZC5qcyIsIkU6L1BoYXNlckhlYXJ0aFN0b25lL21vZHVsZXMvY2xhc3MvRW5lbXlIZWFkLmpzIiwiRTovUGhhc2VySGVhcnRoU3RvbmUvbW9kdWxlcy9jbGFzcy9GZWUuanMiLCJFOi9QaGFzZXJIZWFydGhTdG9uZS9tb2R1bGVzL2NsYXNzL0ZpZ2h0ZXIuanMiLCJFOi9QaGFzZXJIZWFydGhTdG9uZS9tb2R1bGVzL2NsYXNzL0hhbmRDYXJkLmpzIiwiRTovUGhhc2VySGVhcnRoU3RvbmUvbW9kdWxlcy9jbGFzcy9IZWFkLmpzIiwiRTovUGhhc2VySGVhcnRoU3RvbmUvbW9kdWxlcy9jbGFzcy9IZXJvRmVlLmpzIiwiRTovUGhhc2VySGVhcnRoU3RvbmUvbW9kdWxlcy9jbGFzcy9IZXJvRmlnaHRlci5qcyIsIkU6L1BoYXNlckhlYXJ0aFN0b25lL21vZHVsZXMvY2xhc3MvSGVyb0hhbmRDYXJkLmpzIiwiRTovUGhhc2VySGVhcnRoU3RvbmUvbW9kdWxlcy9jbGFzcy9IZXJvSGVhZC5qcyIsIkU6L1BoYXNlckhlYXJ0aFN0b25lL21vZHVsZXMvY2xhc3MvVUlNYW5hZ2VyLmpzIiwiRTovUGhhc2VySGVhcnRoU3RvbmUvbW9kdWxlcy9jb25maWcvQ2FyZENvbmZpZy5qcyIsIkU6L1BoYXNlckhlYXJ0aFN0b25lL21vZHVsZXMvc2NlbmVzL0dhbWVTY2VuZS5qcyIsIkU6L1BoYXNlckhlYXJ0aFN0b25lL21vZHVsZXMvc2NlbmVzL1Jlc3VsdFNjZW5lLmpzIiwiRTovUGhhc2VySGVhcnRoU3RvbmUvbW9kdWxlcy9zY2VuZXMvU3RhcnRTY2VuZS5qcyIsIkU6L1BoYXNlckhlYXJ0aFN0b25lL25vZGVfbW9kdWxlcy9iYXNlNjQtanMvbGliL2I2NC5qcyIsIkU6L1BoYXNlckhlYXJ0aFN0b25lL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJFOi9QaGFzZXJIZWFydGhTdG9uZS9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzIiwiRTovUGhhc2VySGVhcnRoU3RvbmUvbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2bENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG52YXIgU3RhcnRTY2VuZSA9IHJlcXVpcmUoXCIuL21vZHVsZXMvc2NlbmVzL1N0YXJ0U2NlbmVcIik7XHJcbnZhciBHYW1lU2NlbmUgPSByZXF1aXJlKFwiLi9tb2R1bGVzL3NjZW5lcy9HYW1lU2NlbmVcIik7XHJcbnZhciBSZXN1bHRTY2VuZSA9IHJlcXVpcmUoXCIuL21vZHVsZXMvc2NlbmVzL1Jlc3VsdFNjZW5lXCIpO1xyXG5cclxudmFyIGdhbWUgPSBuZXcgUGhhc2VyLkdhbWUoODAwLCA2MDAsIFBoYXNlci5BVVRPLCAnbWFpbkNhbnZhcycsIHt9LCB0cnVlKTtcclxuXHJcbmdhbWUuc3RhdGUuYWRkKFwiU3RhcnRTY2VuZVwiLCBTdGFydFNjZW5lKTsgIC8vIOa4uOaIj+W8gOWni+WcuuaZr1xyXG5nYW1lLnN0YXRlLmFkZChcIkdhbWVTY2VuZVwiLCBHYW1lU2NlbmUpOyAgICAvLyDmuLjmiI/lnLrmma9cclxuZ2FtZS5zdGF0ZS5hZGQoXCJSZXN1bHRTY2VuZVwiLCBSZXN1bHRTY2VuZSk7IC8vIOa4uOaIj+e7k+aenOWcuuaZr1xyXG5nYW1lLnN0YXRlLnN0YXJ0KFwiU3RhcnRTY2VuZVwiKTtcclxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlpiaTdnYlwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL2Zha2VfOTRkNmEwYjAuanNcIixcIi9cIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKipcclxuICog5bi455So5Ye95pWwXHJcbiAqL1xyXG5cclxudmFyIFV0aWxzID0ge1xyXG4gICAgLy8g57un5om/XHJcbiAgICBleHRlbmQ6IGZ1bmN0aW9uIChjaGlsZCwgcGFyZW50KSB7XHJcbiAgICAgICAgdmFyIHAgPSBwYXJlbnQucHJvdG90eXBlO1xyXG4gICAgICAgIHZhciBjID0gY2hpbGQucHJvdG90eXBlO1xyXG4gICAgICAgIGZvciAodmFyIGkgaW4gcCkge1xyXG4gICAgICAgICAgICBjW2ldID0gcFtpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYy51YmVyID0gcDtcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0Q2hpbGRCeUtleTogZnVuY3Rpb24gKHBhcmVudCwga2V5KSB7XHJcbiAgICAgICAgdmFyIF9jaGlsZCA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFyZW50LmNoaWxkcmVuOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHBhcmVudC5jaGlsZHJlbltpXS5rZXkgPT0ga2V5KSB7XHJcbiAgICAgICAgICAgICAgICBfY2hpbGQucHVzaChwYXJlbnQuY2hpbGRyZW5baV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoX2NoaWxkLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIuayoeacieWcqOWMuemFjeeahGtleTogXCIgKyBrZXkpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoX2NoaWxkLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfY2hpbGRbMF07XHJcbiAgICAgICAgfSBlbHNlIGlmIChfY2hpbGQubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gX2NoaWxkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBVdGlscztcbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiWmJpN2diXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbW9kdWxlc1xcXFxVdGlscy5qc1wiLFwiL21vZHVsZXNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKipcclxuICog55S16ISRQUlcclxuICovXHJcbnZhciBEYXRhTWFuYWdlciA9IHJlcXVpcmUoXCIuL0RhdGFNYW5hZ2VyXCIpO1xyXG52YXIgRW5lbXlGaWdodGVyID0gcmVxdWlyZShcIi4vRW5lbXlGaWdodGVyXCIpO1xyXG5cclxuZnVuY3Rpb24gQUkoKSB7XHJcbiAgICB0aGlzLmVuZW15Q2hvaXNlID0gbnVsbDtcclxufVxyXG5cclxuLy8g5Ye654mMXHJcbkFJLnByb3RvdHlwZS5zaG90Q2FyZCA9IGZ1bmN0aW9uIChnYW1lKSB7XHJcbiAgICB0aGlzLmVuZW15Q2hvaXNlID0gdGhpcy5jaG9pc2VDYXJkKCk7XHJcbiAgICBEYXRhTWFuYWdlci50dXJuID0gMDtcclxuXHJcbiAgICBpZiAoIXRoaXMuZW5lbXlDaG9pc2UpIHtcclxuICAgICAgICAvLyDmsqHmnInlkIjpgILnmoTljaHniYxcclxuICAgICAgICBEYXRhTWFuYWdlci50dXJuT3ZlckJ1dHRvbi5sb2FkVGV4dHVyZShcImhlcm9fdHVybl9idXR0b25cIik7XHJcbiAgICAgICAgYWxlcnQoXCLmlYzkurrpgInmi6nkuI3lh7rniYws5LiN55+l6YGT5pyJ5LuA5LmI6Zi06LCL6K+h6K6hXCIpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGlmIChEYXRhTWFuYWdlci5lbmVteUZpZ2h0ZXJzLmZpZ2h0T2JqLmxlbmd0aCA+PSA1KSB7XHJcbiAgICAgICAgICAgIERhdGFNYW5hZ2VyLnR1cm5PdmVyQnV0dG9uLmxvYWRUZXh0dXJlKFwiaGVyb190dXJuX2J1dHRvblwiKTtcclxuICAgICAgICAgICAgYWxlcnQoXCLmlYzkurrpgInmi6nkuI3lh7rniYws5LiN55+l6YGT5pyJ5LuA5LmI6Zi06LCL6K+h6K6hXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZSkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBpZiAoRGF0YU1hbmFnZXIuZW5lbXlGaWdodGVycyA9PSBudWxsKSB7XHJcbiAgICAgICAgRGF0YU1hbmFnZXIuZW5lbXlGaWdodGVycyA9IG5ldyBFbmVteUZpZ2h0ZXIoZ2FtZSk7XHJcbiAgICAgICAgRGF0YU1hbmFnZXIuZW5lbXlGaWdodGVycy5idWlsZEZpZ2h0ZXIoZ2FtZSwgdGhpcy5lbmVteUNob2lzZS5jYXJkSW5mby5IUCwgdGhpcy5lbmVteUNob2lzZS5jYXJkSW5mby5hdHRhY2ssIHRoaXMuZW5lbXlDaG9pc2UuY2FyZEluZm8uY25OYW1lLCB0aGlzLmVuZW15Q2hvaXNlLmNhcmRJbmZvLmZpZ2h0KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgRGF0YU1hbmFnZXIuZW5lbXlGaWdodGVycy5idWlsZEZpZ2h0ZXIoZ2FtZSwgdGhpcy5lbmVteUNob2lzZS5jYXJkSW5mby5IUCwgdGhpcy5lbmVteUNob2lzZS5jYXJkSW5mby5hdHRhY2ssIHRoaXMuZW5lbXlDaG9pc2UuY2FyZEluZm8uY25OYW1lLCB0aGlzLmVuZW15Q2hvaXNlLmNhcmRJbmZvLmZpZ2h0KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmVuZW15Q2hvaXNlLmRlc3Ryb3koKTtcclxuICAgIERhdGFNYW5hZ2VyLmVuZW15SGFuZENhcmQucmVMaXN0SGFuZENhcmQoKTtcclxuICAgIHRoaXMuZW5lbXlDaG9pc2UgPSBudWxsO1xyXG5cclxuICAgIERhdGFNYW5hZ2VyLnR1cm5PdmVyQnV0dG9uLmxvYWRUZXh0dXJlKFwiaGVyb190dXJuX2J1dHRvblwiKTtcclxufVxyXG5cclxuLy8g6YCJ5oup5omL54mMXHJcbkFJLnByb3RvdHlwZS5jaG9pc2VDYXJkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHNob3RMaXN0ID0gW107XHJcbiAgICB2YXIgX2ZlZSA9IHBhcnNlSW50KERhdGFNYW5hZ2VyLmVuZW15RmVlLmZlZU9iai50ZXh0LnNwbGl0KFwiL1wiKVswXSk7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBEYXRhTWFuYWdlci5lbmVteUhhbmRDYXJkLmNhcmRWaWV3TGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChfZmVlID49IERhdGFNYW5hZ2VyLmVuZW15SGFuZENhcmQuY2FyZFZpZXdMaXN0W2ldLmNhcmRJbmZvLmZlZSkge1xyXG4gICAgICAgICAgICAvLyDlj6ropoHotLnnlKjlhYHorrjvvIzlsLHmlL7lhaXlj6/lh7rnmoTniYzkuYvkuK1cclxuICAgICAgICAgICAgc2hvdExpc3QucHVzaChEYXRhTWFuYWdlci5lbmVteUhhbmRDYXJkLmNhcmRWaWV3TGlzdFtpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChzaG90TGlzdC5sZW5ndGggPj0gMSkge1xyXG4gICAgICAgIC8vIOi/lOWbnuW3puaJi+esrOS4gOW8oOeJjFxyXG4gICAgICAgIHJldHVybiBzaG90TGlzdFswXTtcclxuICAgIH1cclxufVxyXG5cclxuLy8g6YCJ5oup6KaB5pS75Ye755qE55uu5qCHXHJcbkFJLnByb3RvdHlwZS5jaG9pc2VBdHRhY2tUYXJnZXQgPSBmdW5jdGlvbiAoZ2FtZSkge1xyXG4gICAgLy8g5pWM5Lq65rKh5pyJ6ZqP5LuOXHJcbiAgICBpZiAoIURhdGFNYW5hZ2VyLmVuZW15RmlnaHRlcnMgfHwgRGF0YU1hbmFnZXIuZW5lbXlGaWdodGVycy5maWdodE9iai5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoRGF0YU1hbmFnZXIuaGVyb0ZpZ2h0ZXJzID09IG51bGwpIHsgLy8g5Yik5pat546p5a6255qE6ZqP5LuO5piv5ZCm5a2Y5ZyoXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBEYXRhTWFuYWdlci5lbmVteUZpZ2h0ZXJzLmZpZ2h0T2JqLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChEYXRhTWFuYWdlci5lbmVteUZpZ2h0ZXJzLmZpZ2h0T2JqW2ldLnNsZWVwID09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydChcIuaVjOS6uueahFwiICsgRGF0YU1hbmFnZXIuZW5lbXlGaWdodGVycy5maWdodE9ialtpXS5jbk5hbWUgKyBcIuaUu+WHu+S6huS9oOeahOiLsembhFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDmm7TmlrDmlLvlh7vkuYvlkI7nmoTnirbmgIFcclxuICAgICAgICAgICAgICAgIERhdGFNYW5hZ2VyLmVuZW15RmlnaHRlcnMuZmlnaHRPYmpbaV0uc2xlZXAgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgRGF0YU1hbmFnZXIuZW5lbXlGaWdodGVycy5maWdodE9ialtpXS5hbHBoYSA9IDAuNztcclxuICAgICAgICAgICAgICAgIERhdGFNYW5hZ2VyLmhlcm9IZWFkLkhQT2JqLnNldFRleHQocGFyc2VJbnQoRGF0YU1hbmFnZXIuaGVyb0hlYWQuSFBPYmoudGV4dCkgLSBEYXRhTWFuYWdlci5lbmVteUZpZ2h0ZXJzLmZpZ2h0T2JqW2ldLmF0dGFjayk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlSW50KERhdGFNYW5hZ2VyLmhlcm9IZWFkLkhQT2JqLnRleHQpIDw9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBEYXRhTWFuYWdlci5yZXN1bHQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwi5pWM5Lq66I635Y+W5LqG6IOc5Yip77yM546p5a626Zi15LqhXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuc3RhdGUuc3RhcnQoXCJSZXN1bHRTY2VuZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICB2YXIgX2hlcm9GaWdodGVyc0F0dGFjayA9IDA7XHJcbiAgICAgICAgdmFyIF9lbmVteUZpZ2h0ZXJzQXR0YWNrID0gMDtcclxuXHJcbiAgICAgICAgLy8g6K6h566X55S16ISRQUnnmoTlnLrmlLtcclxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IERhdGFNYW5hZ2VyLmVuZW15RmlnaHRlcnMuZmlnaHRPYmoubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgX2VuZW15RmlnaHRlcnNBdHRhY2sgKz0gRGF0YU1hbmFnZXIuZW5lbXlGaWdodGVycy5maWdodE9ialtqXS5hdHRhY2s7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDorqHnrpfnjqnlrrbmiJjlnLrkuIrnmoTlnLrmlLtcclxuICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IERhdGFNYW5hZ2VyLmhlcm9GaWdodGVycy5maWdodE9iai5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgICAgICBfaGVyb0ZpZ2h0ZXJzQXR0YWNrICs9IERhdGFNYW5hZ2VyLmhlcm9GaWdodGVycy5maWdodE9ialtrXS5hdHRhY2s7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgX2Rlc3Ryb3lMaXN0ID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBEYXRhTWFuYWdlci5lbmVteUZpZ2h0ZXJzLmZpZ2h0T2JqLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChEYXRhTWFuYWdlci5lbmVteUZpZ2h0ZXJzLmZpZ2h0T2JqW2ldLnNsZWVwID09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImF0dGFja1wiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoX2VuZW15RmlnaHRlcnNBdHRhY2sgPj0gX2hlcm9GaWdodGVyc0F0dGFjaykgeyAvLyBBSeWcuuaUu+Wkp+S6jueOqeWutumaj+S7jueahOWcuuaUu1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwi5pWM5Lq655qEXCIgKyBEYXRhTWFuYWdlci5lbmVteUZpZ2h0ZXJzLmZpZ2h0T2JqW2ldLmNuTmFtZSArIFwi5pS75Ye75LqG5L2g55qE6Iux6ZuEXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOabtOaWsOaUu+WHu+S5i+WQjueahOeKtuaAgVxyXG4gICAgICAgICAgICAgICAgICAgIERhdGFNYW5hZ2VyLmVuZW15RmlnaHRlcnMuZmlnaHRPYmpbaV0uc2xlZXAgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIERhdGFNYW5hZ2VyLmVuZW15RmlnaHRlcnMuZmlnaHRPYmpbaV0uYWxwaGEgPSAwLjc7XHJcbiAgICAgICAgICAgICAgICAgICAgRGF0YU1hbmFnZXIuaGVyb0hlYWQuSFBPYmouc2V0VGV4dChwYXJzZUludChEYXRhTWFuYWdlci5oZXJvSGVhZC5IUE9iai50ZXh0KSAtIERhdGFNYW5hZ2VyLmVuZW15RmlnaHRlcnMuZmlnaHRPYmpbaV0uYXR0YWNrKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnNlSW50KERhdGFNYW5hZ2VyLmhlcm9IZWFkLkhQT2JqLnRleHQpIDw9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgRGF0YU1hbmFnZXIucmVzdWx0ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCLmlYzkurrojrflj5bkuobog5zliKnvvIznjqnlrrbpmLXkuqFcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdhbWUuc3RhdGUuc3RhcnQoXCJSZXN1bHRTY2VuZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEFJ5Zy65pS75bCP5LqO546p5a625Zy65pS75YiZ5pS75Ye76ZqP5LuOXHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCLmlYzmlrnnmoRcIiArIERhdGFNYW5hZ2VyLmVuZW15RmlnaHRlcnMuZmlnaHRPYmpbaV0uY25OYW1lICsgXCLmlLvlh7vkuobmiJHmlrnnmoRcIiArIERhdGFNYW5hZ2VyLmhlcm9GaWdodGVycy5maWdodE9ialswXS5jbk5hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgX2hlcm9GaWdodEhQID0gRGF0YU1hbmFnZXIuZW5lbXlGaWdodGVycy5maWdodE9ialtpXS5ocCAtIERhdGFNYW5hZ2VyLmhlcm9GaWdodGVycy5maWdodE9ialswXS5hdHRhY2s7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9lbmVteUZpZ2h0SFAgPSBEYXRhTWFuYWdlci5oZXJvRmlnaHRlcnMuZmlnaHRPYmpbMF0uaHAgLSBEYXRhTWFuYWdlci5lbmVteUZpZ2h0ZXJzLmZpZ2h0T2JqW2ldLmF0dGFjaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5pu05paw546p5a6255qE6ZqP5LuO55qEaHBcclxuICAgICAgICAgICAgICAgICAgICBEYXRhTWFuYWdlci5lbmVteUZpZ2h0ZXJzLmZpZ2h0T2JqW2ldLmhwID0gX2hlcm9GaWdodEhQO1xyXG4gICAgICAgICAgICAgICAgICAgIERhdGFNYW5hZ2VyLmVuZW15RmlnaHRlcnMuZmlnaHRPYmpbaV0uYWxwaGEgPSAwLjc7XHJcbiAgICAgICAgICAgICAgICAgICAgRGF0YU1hbmFnZXIuZW5lbXlGaWdodGVycy5maWdodE9ialtpXS5zbGVlcCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgRGF0YU1hbmFnZXIuZW5lbXlGaWdodGVycy5maWdodE9ialtpXS5jaGlsZHJlblsyXS5hbHBoYSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgRGF0YU1hbmFnZXIuZW5lbXlGaWdodGVycy5maWdodE9ialtpXS5jaGlsZHJlblsxXS5zZXRUZXh0KF9oZXJvRmlnaHRIUCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIOabtOaWsOaVjOS6uueahOeOqeWutueahGhwXHJcbiAgICAgICAgICAgICAgICAgICAgRGF0YU1hbmFnZXIuaGVyb0ZpZ2h0ZXJzLmZpZ2h0T2JqWzBdLmhwID0gX2VuZW15RmlnaHRIUDtcclxuICAgICAgICAgICAgICAgICAgICBEYXRhTWFuYWdlci5oZXJvRmlnaHRlcnMuZmlnaHRPYmpbMF0uY2hpbGRyZW5bMV0uc2V0VGV4dChfZW5lbXlGaWdodEhQKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKF9oZXJvRmlnaHRIUCA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9kZXN0cm95TGlzdC5wdXNoKERhdGFNYW5hZ2VyLmVuZW15RmlnaHRlcnMuZmlnaHRPYmpbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKF9lbmVteUZpZ2h0SFAgPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBEYXRhTWFuYWdlci5oZXJvRmlnaHRlcnMuZmlnaHRPYmpbMF0uZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBEYXRhTWFuYWdlci5oZXJvRmlnaHRlcnMucmVMaXN0T2JqcygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICh2YXIgbiA9IDA7IG4gPCBfZGVzdHJveUxpc3QubGVuZ3RoOyBuKyspIHtcclxuICAgICAgICAgICAgX2Rlc3Ryb3lMaXN0W25dLmRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgRGF0YU1hbmFnZXIuZW5lbXlGaWdodGVycy5yZUxpc3RPYmpzKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFJO1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJaYmk3Z2JcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tb2R1bGVzXFxcXGNsYXNzXFxcXEFJLmpzXCIsXCIvbW9kdWxlc1xcXFxjbGFzc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qKlxyXG4gKiDog4zmma/nsbtcclxuICovXHJcblxyXG5mdW5jdGlvbiBCYWNrR3JvdW5kKGdhbWUpIHtcclxuICAgIHRoaXMucGljT2JqID0gbnVsbDtcclxuICAgIHRoaXMuaW5pdChnYW1lKTtcclxufVxyXG5cclxuQmFja0dyb3VuZC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uIChnYW1lKSB7XHJcbiAgICB0aGlzLnBpY09iaiA9IHRoaXMuc2V0UGljKGdhbWUpO1xyXG5cclxufVxyXG5cclxuQmFja0dyb3VuZC5wcm90b3R5cGUuc2V0UGljID0gZnVuY3Rpb24gKGdhbWUpIHtcclxuICAgIHZhciBiYWNrZ3JvdW5kID0gZ2FtZS5hZGQuaW1hZ2UoMCwgMCwgXCJiYWNrZ3JvdW5kXCIpO1xyXG4gICAgcmV0dXJuIGJhY2tncm91bmQ7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQmFja0dyb3VuZDtcbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiWmJpN2diXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbW9kdWxlc1xcXFxjbGFzc1xcXFxCYWNrR3JvdW5kLmpzXCIsXCIvbW9kdWxlc1xcXFxjbGFzc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qKlxyXG4gKiDljaHnu4TnlJ/miJDlmahcclxuICovXHJcblxyXG5mdW5jdGlvbiBDYXJkR2VuZXJhdG9yKCkge31cclxuXHJcbi8vIOWNoee7hOeUn+aIkOWZqFxyXG4vLyBAcGFyYW0gY2FyZExlbmd0aCBbbnVtYmVyXSDljaHnu4TmnIDlpKfnmoTplb/luqZcclxuLy8gQHBhcmFtIG1pbkluZGV4IFtudW1iZXJdIOacgOWwj+e0ouW8lVxyXG4vLyBAcGFyYW0gbWF4SW5kZXggW251bWJlcl0g5pyA5aSn57Si5byVXHJcbi8vIEByZXR1cm4gY2FyZExpc3QgW2FycmF5XSDljaHniYxpZOeUn+aIkOaVsOe7hFxyXG5DYXJkR2VuZXJhdG9yLnByb3RvdHlwZS5idWlsZENhcmRMaXN0ID0gZnVuY3Rpb24oY2FyZExlbmd0aCwgbWluSW5kZXgsIG1heEluZGV4KSB7XHJcbiAgICB2YXIgY2FyZExpc3QgPSBbXTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FyZExlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIHJhbWRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG1heEluZGV4KSArIG1pbkluZGV4O1xyXG4gICAgICAgIGNhcmRMaXN0LnB1c2gocmFtZG9tKTtcclxuICAgIH1cclxuICAgIHJldHVybiBjYXJkTGlzdDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDYXJkR2VuZXJhdG9yO1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJaYmk3Z2JcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tb2R1bGVzXFxcXGNsYXNzXFxcXENhcmRHZW5lcmF0ZXIuanNcIixcIi9tb2R1bGVzXFxcXGNsYXNzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyoqXHJcbiAqIOa4uOaIj+aVsOaNrueuoeeQhuexu1xyXG4gKi9cclxuXHJcbnZhciBEYXRhTWFuYWdlciA9IHtcclxuXHR0dXJuOiAwLCAvLyAw5Luj6KGo6Ieq5bex5Zue5ZCILDHku6PooajmlYzkurrlm57lkIggXHJcblx0ZmVlOiAxLCAvLyDliJ3lp4vljJbotLnnlKjvvIzlkozmuLjmiI/lm57lkIjnm7jlhbNcclxuXHRBSTogbnVsbCxcclxuXHJcblx0aGVyb0Nob2lzZUNhcmQ6IG51bGwsIC8vIOiLsembhOmAieaLqeeahOWNoeeJjFxyXG5cdGhlcm9GaWdodGVyczogbnVsbCwgLy8g6Iux6ZuE6ZqP5LuOXHJcblx0aGVyb0hhbmRDYXJkOiBudWxsLCAvLyDoi7Hpm4TmiYvniYxcclxuXHRoZXJvRmVlOiBudWxsLCAvLyDoi7Hpm4TnmoTotLnnlKhcclxuXHRoZXJvSGVhZDogbnVsbCwgLy8g6Iux6ZuE5aS05YOPXHJcblx0aGVyb0ZpZ2h0ZXJDaG9pc2U6IG51bGwsIC8vIOaImOaWl+maj+S7jueahOmAieaLqVxyXG5cdGhlcm9DdXJyZW50RmVlOiAxLCAvLyDnjqnlrrblvZPliY3otLnnlKhcclxuXHJcblx0ZW5lbXlIYW5kQ2FyZDogbnVsbCwgLy8g5pWM5Lq65omL54mMIFxyXG5cdGVuZW15RmVlOiBudWxsLCAvLyDmlYzkurrnmoTotLnnlKhcclxuXHRlbmVteUhlYWQ6IG51bGwsIC8vIOaVjOS6uueahOWktOWDj1xyXG5cdGVuZW15RmlnaHRlcnM6IG51bGwsIC8vIOaVjOS6uuaImOWcuueahOmaj+S7jlxyXG5cdGVuZW15Q3VycmVudEZlZTogMSwgLy8g5pWM5Lq65b2T5YmN6LS555SoXHJcblxyXG5cdHR1cm5PdmVyQnV0dG9uOiBudWxsLCAvLyDlm57lkIjnu5PmnZ/nmoTmjInpkq5cclxuXHRyZXN1bHQ6MCAvLyAwIOS7o+ihqOeOqeWutuWksei0pe+8jDHku6Pooajnjqnlrrbog5zliKlcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEYXRhTWFuYWdlcjtcbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiWmJpN2diXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbW9kdWxlc1xcXFxjbGFzc1xcXFxEYXRhTWFuYWdlci5qc1wiLFwiL21vZHVsZXNcXFxcY2xhc3NcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG52YXIgdXRpbHMgPSByZXF1aXJlKFwiLi4vVXRpbHNcIik7XHJcbnZhciBGZWUgPSByZXF1aXJlKFwiLi9GZWVcIik7XHJcblxyXG4vKipcclxuICog5pWM5Lq66LS555So566h55CGXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gRW5lbXlGZWUoZ2FtZSwgeCwgeSkge1xyXG4gICAgRmVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbnV0aWxzLmV4dGVuZChFbmVteUZlZSwgRmVlKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRW5lbXlGZWU7XG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlpiaTdnYlwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL21vZHVsZXNcXFxcY2xhc3NcXFxcRW5lbXlGZWUuanNcIixcIi9tb2R1bGVzXFxcXGNsYXNzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyoqXHJcbiAqIOaVjOS6uueahOaImOWcuumaj+S7jlxyXG4gKi9cclxudmFyIERhdGFNYW5hZ2VyID0gcmVxdWlyZShcIi4vRGF0YU1hbmFnZXJcIik7XHJcblxyXG52YXIgdXRpbHMgPSByZXF1aXJlKFwiLi4vVXRpbHNcIik7XHJcbnZhciBGaWdodGVyID0gcmVxdWlyZShcIi4vRmlnaHRlclwiKTtcclxuXHJcbmZ1bmN0aW9uIEVuZW15RmlnaHRlcihnYW1lKSB7XHJcbiAgICBGaWdodGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICB0aGlzLnkgPSBnYW1lLndvcmxkLmNlbnRlclkgLSAxMzA7XHJcblxyXG59XHJcblxyXG51dGlscy5leHRlbmQoRW5lbXlGaWdodGVyLCBGaWdodGVyKTtcclxuXHJcbi8vIOmHjeWGmWNob2lzZUZpZ2h0ZXIgXHJcbi8vIOWcqOeOqeWutumAieaLqeaVjOaWuemaj+S7juaXtui/m+ihjOaImOaWl+e7k+eul1xyXG5FbmVteUZpZ2h0ZXIucHJvdG90eXBlLmNob2ljZUZpZ2h0ZXIgPSBmdW5jdGlvbiAoZmlnaHRCZykge1xyXG4gICAgaWYgKERhdGFNYW5hZ2VyLmhlcm9GaWdodGVyQ2hvaXNlID09IG51bGwpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuXHJcbiAgICAgICAgYWxlcnQoXCLmiJHmlrnnmoRcIiArIERhdGFNYW5hZ2VyLmhlcm9GaWdodGVyQ2hvaXNlLmNuTmFtZSArIFwi5pS75Ye75LqG5pWM5Lq655qEXCIgKyBmaWdodEJnLmNuTmFtZSk7XHJcblxyXG4gICAgICAgIHZhciBfaGVyb0ZpZ2h0SFAgPSBEYXRhTWFuYWdlci5oZXJvRmlnaHRlckNob2lzZS5ocCAtIGZpZ2h0QmcuYXR0YWNrO1xyXG4gICAgICAgIHZhciBfZW5lbXlGaWdodEhQID0gZmlnaHRCZy5ocCAtIERhdGFNYW5hZ2VyLmhlcm9GaWdodGVyQ2hvaXNlLmF0dGFjaztcclxuXHJcbiAgICAgICAgLy8g5pu05paw546p5a6255qE6ZqP5LuO55qEaHBcclxuICAgICAgICBEYXRhTWFuYWdlci5oZXJvRmlnaHRlckNob2lzZS5ocCA9IF9oZXJvRmlnaHRIUDtcclxuICAgICAgICBEYXRhTWFuYWdlci5oZXJvRmlnaHRlckNob2lzZS5hbHBoYSA9IDAuNztcclxuICAgICAgICBEYXRhTWFuYWdlci5oZXJvRmlnaHRlckNob2lzZS5zbGVlcCA9IHRydWU7XHJcbiAgICAgICAgRGF0YU1hbmFnZXIuaGVyb0ZpZ2h0ZXJDaG9pc2UuY2hpbGRyZW5bMl0uYWxwaGEgPSAwO1xyXG4gICAgICAgIERhdGFNYW5hZ2VyLmhlcm9GaWdodGVyQ2hvaXNlLmNoaWxkcmVuWzFdLnNldFRleHQoX2hlcm9GaWdodEhQKTtcclxuXHJcbiAgICAgICAgLy8g5pu05paw5pWM5Lq655qE546p5a6255qEaHBcclxuICAgICAgICBmaWdodEJnLmhwID0gX2VuZW15RmlnaHRIUDtcclxuICAgICAgICBmaWdodEJnLmNoaWxkcmVuWzFdLnNldFRleHQoX2VuZW15RmlnaHRIUCk7XHJcblxyXG4gICAgICAgIGlmIChfaGVyb0ZpZ2h0SFAgPD0gMCkge1xyXG4gICAgICAgICAgICBEYXRhTWFuYWdlci5oZXJvRmlnaHRlckNob2lzZS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIERhdGFNYW5hZ2VyLmhlcm9GaWdodGVycy5yZUxpc3RPYmpzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoX2VuZW15RmlnaHRIUCA8PSAwKSB7XHJcbiAgICAgICAgICAgIGZpZ2h0QmcuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICBEYXRhTWFuYWdlci5lbmVteUZpZ2h0ZXJzLnJlTGlzdE9ianMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIERhdGFNYW5hZ2VyLmhlcm9GaWdodGVyQ2hvaXNlID0gbnVsbDtcclxuICAgICAgICBcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFbmVteUZpZ2h0ZXI7XG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlpiaTdnYlwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL21vZHVsZXNcXFxcY2xhc3NcXFxcRW5lbXlGaWdodGVyLmpzXCIsXCIvbW9kdWxlc1xcXFxjbGFzc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qKlxyXG4gKiDmlYzkurrnmoTmiYvniYznsbtcclxuICovXHJcblxyXG52YXIgSGFuZENhcm5kID0gcmVxdWlyZShcIi4vSGFuZENhcmRcIik7XHJcbnZhciB1dGlscyA9IHJlcXVpcmUoXCIuLi9VdGlsc1wiKTtcclxudmFyIENhcmRDb25maWcgPSByZXF1aXJlKFwiLi4vY29uZmlnL0NhcmRDb25maWdcIik7XHJcblxyXG5mdW5jdGlvbiBFbmVteUhhbmRDYXJkKGdhbWUpIHtcclxuICAgIEhhbmRDYXJuZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgLy8gdGhpcy5zZXRSZWFsSGFuZENhcmQoZ2FtZSk7IC8vIOecn+WunuWNoemdolxyXG4gICAgdGhpcy5idWlsZEhhbmRDYXJkVmlld0xpc3QoZ2FtZSk7IC8vIOiuvue9ruWNoeiDjFxyXG5cclxufVxyXG5cclxudXRpbHMuZXh0ZW5kKEVuZW15SGFuZENhcmQsIEhhbmRDYXJuZCk7XHJcblxyXG4vLyBAb3ZlcnJpZGUgIFxyXG4vLyDph43lhplyZWxpc3RIYW5kQ2FyZOaWueazlVxyXG5FbmVteUhhbmRDYXJkLnByb3RvdHlwZS5yZUxpc3RIYW5kQ2FyZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHZhciBfdGVtcCA9IFtdO1xyXG4gICAgY29uc29sZS5sb2coc2VsZi5jYXJkVmlld0xpc3QpO1xyXG5cclxuICAgIGlmIChzZWxmLmNhcmRWaWV3TGlzdC5sZW5ndGggPT0gMCkgeyAvLyDmsqHmnInmiYvniYznmoTmg4XlhrVcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZi5jYXJkVmlld0xpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHNlbGYuY2FyZFZpZXdMaXN0W2ldLmFsaXZlID09IHRydWUpIHsgLy8g5riF6Zmk5o6J5bey57uP6ZSA5q+B5LqG55qE5omL54mMXHJcbiAgICAgICAgICAgICAgICBfdGVtcC5wdXNoKHNlbGYuY2FyZFZpZXdMaXN0W2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBzZWxmLmNhcmRWaWV3TGlzdCA9IF90ZW1wO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHNlbGYuY2FyZFZpZXdMaXN0Lmxlbmd0aDsgaisrKSB7IC8vIOmHjeaWsOWvueaJi+eJjOaOkuW6j1xyXG4gICAgICAgICAgICBzZWxmLmNhcmRWaWV3TGlzdFtqXS54ID0gc2VsZi54ICsgaiAqIDcwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLy8gQG92ZXJyaWRlIFxyXG4vLyDph43lhpnlm57lkIjlvIDlp4vml7bnmoTooaXniYzpgLvovpFcclxuRW5lbXlIYW5kQ2FyZC5wcm90b3R5cGUuYWRkQ2FyZCA9IGZ1bmN0aW9uIChnYW1lKSB7XHJcbiAgICB2YXIgX2NhcmRMaXN0ID0gdGhpcy5jYXJkSURMaXN0LnNwbGljZSgwLCAxKTtcclxuXHJcbiAgICBpZiAodGhpcy5jYXJkVmlld0xpc3QubGVuZ3RoID49IDgpIHtcclxuICAgICAgICBhbGVydChcIuaVjOS6uuW3sui+vuWIsOS4iumZkO+8jOW9k+WJjeWIsOeahOWNoeeJjOiiq+mUgOavgVwiKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc29sZS5sb2coX2NhcmRMaXN0KTtcclxuICAgIGZvciAodmFyIGogPSAwOyBqIDwgQ2FyZENvbmZpZy5jYXJkX2luZm8ubGVuZ3RoOyBqKyspIHtcclxuXHJcbiAgICAgICAgaWYgKF9jYXJkTGlzdFswXSA9PSBDYXJkQ29uZmlnLmNhcmRfaW5mb1tqXS5pZCkge1xyXG4gICAgICAgICAgICB2YXIgY2FyZCA9IGdhbWUuYWRkLmltYWdlKHRoaXMueCArIHRoaXMuY2FyZFZpZXdMaXN0Lmxlbmd0aCAqIDcwLCB0aGlzLnksIFwiY2FyZF9iYWNrXCIpO1xyXG5cclxuICAgICAgICAgICAgLy8g6K6+572u55u45bqU55qE5pWw5o2uXHJcbiAgICAgICAgICAgIGNhcmQuY2FyZEluZm8gPSB7fTtcclxuICAgICAgICAgICAgY2FyZC5jYXJkSW5mby5IUCA9IENhcmRDb25maWcuY2FyZF9pbmZvW2pdLmhwOyAvLyDooYDph49cclxuICAgICAgICAgICAgY2FyZC5jYXJkSW5mby5hdHRhY2sgPSBDYXJkQ29uZmlnLmNhcmRfaW5mb1tqXS5hdHRhY2s7IC8vIOaUu+WHu+WKm1xyXG4gICAgICAgICAgICBjYXJkLmNhcmRJbmZvLmNuTmFtZSA9IENhcmRDb25maWcuY2FyZF9pbmZvW2pdLmNuX25hbWU7IC8vIOS4reaWh+WQjeensFxyXG4gICAgICAgICAgICBjYXJkLmNhcmRJbmZvLmZlZSA9IENhcmRDb25maWcuY2FyZF9pbmZvW2pdLmZlZTsgLy8g5Y+s5ZSk6LS555SoXHJcbiAgICAgICAgICAgIGNhcmQuY2FyZEluZm8uZmlnaHQgPSBDYXJkQ29uZmlnLmNhcmRfaW5mb1tqXS5maWdodDsgLy8g5oiY5paX5Zu+54mHXHJcbiAgICAgICAgICAgIGNhcmQuc2NhbGUuc2V0KDAuNSk7XHJcbiAgICAgICAgICAgIHRoaXMuY2FyZFZpZXdMaXN0LnB1c2goY2FyZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEVuZW15SGFuZENhcmQ7XG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlpiaTdnYlwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL21vZHVsZXNcXFxcY2xhc3NcXFxcRW5lbXlIYW5kQ2FyZC5qc1wiLFwiL21vZHVsZXNcXFxcY2xhc3NcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKipcclxuICog5pWM5Lq65aS05YOPXHJcbiAqL1xyXG5cclxudmFyIHV0aWxzID0gcmVxdWlyZShcIi4uL1V0aWxzXCIpO1xyXG52YXIgSGVhZCA9IHJlcXVpcmUoXCIuL0hlYWRcIik7XHJcbnZhciBEYXRhTWFuYWdlciA9IHJlcXVpcmUoXCIuL0RhdGFNYW5hZ2VyXCIpO1xyXG5cclxuZnVuY3Rpb24gRW5lbXlIZWFkKGdhbWUsIHRleHR1cmVOYW1lLCBwb3NpdGlvblgsIHBvc2l0aW9uWSkge1xyXG4gICAgSGVhZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5cclxuLy8g6K6+572u5pWM5Lq65aS05YOPXHJcbi8vIEBvdmVycmlkZemHjeWGmXNldFBpY1xyXG5IZWFkLnByb3RvdHlwZS5zZXRQaWMgPSBmdW5jdGlvbiAoZ2FtZSkge1xyXG4gICAgdmFyIHBpYyA9IGdhbWUuYWRkLmltYWdlKDAsIDAsIHRoaXMudGV4dHVyZU5hbWUpO1xyXG5cclxuICAgIHBpYy5pbnB1dEVuYWJsZWQgPSB0cnVlO1xyXG4gICAgcGljLmV2ZW50cy5vbklucHV0RG93bi5hZGQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmIChEYXRhTWFuYWdlci5oZXJvRmlnaHRlckNob2lzZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgX2hwID0gcGFyc2VJbnQodGhpcy5IUE9iai50ZXh0KSAtIERhdGFNYW5hZ2VyLmhlcm9GaWdodGVyQ2hvaXNlLmF0dGFjaztcclxuICAgICAgICAgICAgdGhpcy5IUE9iai5zZXRUZXh0KF9ocCk7XHJcblxyXG4gICAgICAgICAgICBEYXRhTWFuYWdlci5oZXJvRmlnaHRlckNob2lzZS5hbHBoYSA9IDAuNztcclxuICAgICAgICAgICAgRGF0YU1hbmFnZXIuaGVyb0ZpZ2h0ZXJDaG9pc2Uuc2xlZXAgPSB0cnVlO1xyXG4gICAgICAgICAgICBEYXRhTWFuYWdlci5oZXJvRmlnaHRlckNob2lzZS5jaGlsZHJlblsyXS5hbHBoYSA9IDA7XHJcblxyXG4gICAgICAgICAgICBhbGVydChcIuaIkeaWueeahFwiICsgRGF0YU1hbmFnZXIuaGVyb0ZpZ2h0ZXJDaG9pc2UuY25OYW1lICsgXCLmlLvlh7vkuobmlYzkurroi7Hpm4RcIik7XHJcblxyXG4gICAgICAgICAgICBEYXRhTWFuYWdlci5oZXJvRmlnaHRlckNob2lzZSA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyc2VJbnQodGhpcy5IUE9iai50ZXh0KSA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydChcIueOqeWutuiOt+WPluiDnOWIqe+8jOaVjOS6uumYteS6oVwiKTtcclxuICAgICAgICAgICAgICAgIERhdGFNYW5hZ2VyLnJlc3VsdCA9IDE7XHJcbiAgICAgICAgICAgICAgICBnYW1lLnN0YXRlLnN0YXJ0KFwiUmVzdWx0U2NlbmVcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfSwgdGhpcyk7XHJcblxyXG4gICAgcmV0dXJuIHBpYztcclxufVxyXG5cclxudXRpbHMuZXh0ZW5kKEVuZW15SGVhZCwgSGVhZCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEVuZW15SGVhZDtcclxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlpiaTdnYlwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL21vZHVsZXNcXFxcY2xhc3NcXFxcRW5lbXlIZWFkLmpzXCIsXCIvbW9kdWxlc1xcXFxjbGFzc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qKlxyXG4gKiDotLnnlKjnrqHnkIbnsbtcclxuICovXHJcblxyXG5mdW5jdGlvbiBGZWUoZ2FtZSwgeCwgeSkge1xyXG4gICAgdGhpcy5mZWVPYmogPSBudWxsO1xyXG4gICAgdGhpcy54ID0geCB8fCBnYW1lLndvcmxkLndpZHRoIC0gMzA7XHJcbiAgICB0aGlzLnkgPSB5IHx8IDA7XHJcbiAgICB0aGlzLmluaXQoZ2FtZSk7XHJcbn1cclxuXHJcbkZlZS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uIChnYW1lKSB7XHJcbiAgICB0aGlzLmZlZU9iaiA9IHRoaXMuc2V0RmVlUGljKGdhbWUpO1xyXG59XHJcblxyXG4vLyDorr7nva5GZWXog4zmma/ku6Xlj4rmloflrZdcclxuRmVlLnByb3RvdHlwZS5zZXRGZWVQaWMgPSBmdW5jdGlvbiAoZ2FtZSkge1xyXG4gICAgdmFyIGZlZSA9IGdhbWUuYWRkLmltYWdlKHRoaXMueCwgdGhpcy55LCBcImZlZVwiKTtcclxuICAgIHZhciB0ZXh0ID0gZ2FtZS5hZGQudGV4dCg2MCwgMjgsIFwiMS8xXCIsIHsgZmlsbDogXCIjZmZmXCIsIGZvbnRTaXplOiBcIjE4cHRcIiB9KTtcclxuICAgIHRleHQuYW5jaG9yLnNldCgwLjUpO1xyXG4gICAgZmVlLmFkZENoaWxkKHRleHQpO1xyXG4gICAgcmV0dXJuIHRleHQ7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRmVlO1xyXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiWmJpN2diXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbW9kdWxlc1xcXFxjbGFzc1xcXFxGZWUuanNcIixcIi9tb2R1bGVzXFxcXGNsYXNzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyoqXHJcbiAqIOaImOaWl+WFg+e0oOexu1xyXG4gKiBAcGFyYW0gZ2FtZSBcclxuICogQHBhcmFtIHggW251bWJlcl0g5Yid5aeL5YyW55qEXHJcbiAqL1xyXG5cclxudmFyIERhdGFNYW5hZ2VyID0gcmVxdWlyZShcIi4vRGF0YU1hbmFnZXJcIik7XHJcblxyXG5mdW5jdGlvbiBGaWdodGVyKGdhbWUpIHtcclxuICAgIHRoaXMuZmlnaHRPYmogPSBbXTsgLy8g5oiY5paX6ZqP5LuO5pWw57uEXHJcbiAgICB0aGlzLnggPSAxNTA7XHJcbiAgICB0aGlzLnkgPSBnYW1lLndvcmxkLmNlbnRlclkgKyAzMDtcclxufVxyXG5cclxuRmlnaHRlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uIChnYW1lKSB7XHJcbn1cclxuXHJcbi8vIOeUn+aIkOaImOaWl+maj+S7jlxyXG5GaWdodGVyLnByb3RvdHlwZS5idWlsZEZpZ2h0ZXIgPSBmdW5jdGlvbiAoZ2FtZSwgaHAsIGF0dGFjaywgY25OYW1lLCBwaWNOYW1lKSB7XHJcbiAgICB2YXIgZmlnaHRCZyA9IGdhbWUuYWRkLmltYWdlKHRoaXMueCwgdGhpcy55LCBwaWNOYW1lKTtcclxuXHJcbiAgICBmaWdodEJnLmhwID0gaHA7XHJcbiAgICBmaWdodEJnLmF0dGFjayA9IGF0dGFjaztcclxuICAgIGZpZ2h0QmcuY25OYW1lID0gY25OYW1lO1xyXG4gICAgZmlnaHRCZy5waWNOYW1lID0gcGljTmFtZTtcclxuICAgIGZpZ2h0Qmcuc2xlZXAgPSB0cnVlOyAvLyDkvJHnnKDnirbmgIHvvIzlnKjlh7rniYznmoTnrKzkuIDlm57lkIjml6Dms5Xov5vooYzmlLvlh7tcclxuICAgIHZhciBfc3R5bGUgPSB7XHJcbiAgICAgICAgZmlsbDogXCIjZmZmXCIsXHJcbiAgICAgICAgZm9udFNpemU6IFwiMTJwdFwiXHJcbiAgICB9XHJcbiAgICAvLyDorr7nva7nlJ/lkb3lgLxcclxuICAgIHZhciBocF90ZXh0ID0gZ2FtZS5hZGQudGV4dCg3NSwgMTA1LCBocCwgX3N0eWxlKTtcclxuICAgIGhwX3RleHQuYW5jaG9yLnNldCgwLjUpO1xyXG4gICAgaHBfdGV4dC5rZXkgPSBcImhwXCI7XHJcblxyXG4gICAgLy8g6K6+572uXHJcbiAgICB2YXIgYXR0YWNrX3RleHQgPSBnYW1lLmFkZC50ZXh0KDE3LCAxMDUsIGF0dGFjaywgX3N0eWxlKTtcclxuICAgIGF0dGFja190ZXh0LmFuY2hvci5zZXQoMC41KTtcclxuICAgIGF0dGFja190ZXh0LmtleSA9IFwiYXR0YWNrXCI7XHJcblxyXG4gICAgdmFyIGF0dGFja190YWcgPSBnYW1lLmFkZC5pbWFnZSg0OCwgLTE1LCBcImF0dGFja19pY29uXCIpO1xyXG4gICAgYXR0YWNrX3RhZy5rZXkgPSBcImF0dGFja190YWdcIjtcclxuICAgIGF0dGFja190YWcuc2NhbGUuc2V0KDAuNSk7XHJcbiAgICBhdHRhY2tfdGFnLmFuY2hvci5zZXQoMC41KTtcclxuICAgIGF0dGFja190YWcuYWxwaGEgPSAwO1xyXG5cclxuICAgIGZpZ2h0QmcuYWRkQ2hpbGQoYXR0YWNrX3RleHQpO1xyXG4gICAgZmlnaHRCZy5hZGRDaGlsZChocF90ZXh0KTtcclxuICAgIGZpZ2h0QmcuYWRkQ2hpbGQoYXR0YWNrX3RhZyk7XHJcbiAgICBmaWdodEJnLmFscGhhID0gMC43OyAvLyBzbGVlcOeKtuaAgeaXoOazleaUu+WHu1xyXG4gICAgdGhpcy5maWdodE9iai5wdXNoKGZpZ2h0QmcpO1xyXG4gICAgdGhpcy5yZUxpc3RPYmpzKCk7XHJcblxyXG4gICAgZmlnaHRCZy5pbnB1dEVuYWJsZWQgPSB0cnVlO1xyXG4gICAgZmlnaHRCZy5ldmVudHMub25JbnB1dERvd24uYWRkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmNob2ljZUZpZ2h0ZXIoZmlnaHRCZyk7XHJcbiAgICB9LCB0aGlzKTtcclxuXHJcbn1cclxuXHJcbkZpZ2h0ZXIucHJvdG90eXBlLnJlTGlzdE9ianMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5maWdodE9iai5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgIC8vIOWmguaenOmaj+S7jueahOmYn+WIl+S4uuepuu+8jOS4jei/m+ihjOaOkuW6j1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFyIF90ZW1wPSBbXTtcclxuXHJcbiAgICAgICAgZm9yKHZhciBqID0gMDsgajx0aGlzLmZpZ2h0T2JqLmxlbmd0aDtqKyspe1xyXG4gICAgICAgICAgICBpZih0aGlzLmZpZ2h0T2JqW2pdLmFsaXZlID09IHRydWUpe1xyXG4gICAgICAgICAgICAgICAgX3RlbXAucHVzaCh0aGlzLmZpZ2h0T2JqW2pdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5maWdodE9iaiA9IF90ZW1wO1xyXG5cclxuICAgICAgICAvLyDph43mjpLmiJjmlpfpmo/ku47nmoTmlbDnu4RcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZmlnaHRPYmoubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5maWdodE9ialtpXS54ID0gdGhpcy54ICsgaSAqIDk1O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuRmlnaHRlci5wcm90b3R5cGUuYXdha2VGaWdodGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHRoaXMuZmlnaHRPYmoubGVuZ3RoID09IDApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZmlnaHRPYmoubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5maWdodE9ialtpXS5zbGVlcCA9IGZhbHNlOyAvLyDop6PpmaTnnaHnnKDnirbmgIFcclxuICAgICAgICAgICAgdGhpcy5maWdodE9ialtpXS5hbHBoYSA9IDE7IC8vIOino+mZpOedoeecoOeKtuaAgeWQjueahHZpZXdcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5GaWdodGVyLnByb3RvdHlwZS5jaG9pY2VGaWdodGVyID0gZnVuY3Rpb24gKGZpZ2h0QmcpIHtcclxuICAgIGlmIChmaWdodEJnLnNsZWVwID09IHRydWUpIHtcclxuICAgICAgICBhbGVydChcIuacrOWbnuWQiOaXoOazleaTjeS9nOivpemaj+S7ju+8gVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBlbHNlIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZmlnaHRPYmoubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5maWdodE9ialtpXS5jaGlsZHJlblsyXS5hbHBoYSA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpZ2h0QmcuY2hpbGRyZW5bMl0uYWxwaGEgPSAxO1xyXG4gICAgICAgIERhdGFNYW5hZ2VyLmhlcm9GaWdodGVyQ2hvaXNlID0gZmlnaHRCZztcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGaWdodGVyO1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJaYmk3Z2JcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tb2R1bGVzXFxcXGNsYXNzXFxcXEZpZ2h0ZXIuanNcIixcIi9tb2R1bGVzXFxcXGNsYXNzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyoqXHJcbiAqIOaJi+eJjOexu1xyXG4gKi9cclxuXHJcbnZhciBDYXJkR2VuZXJhdGVyID0gcmVxdWlyZShcIi4vQ2FyZEdlbmVyYXRlclwiKTtcclxudmFyIENhcmRDb25maWcgPSByZXF1aXJlKFwiLi4vY29uZmlnL0NhcmRDb25maWdcIik7XHJcbnZhciBEYXRhTWFuYWdlciA9IHJlcXVpcmUoXCIuL0RhdGFNYW5hZ2VyXCIpO1xyXG5cclxuZnVuY3Rpb24gSGFuZENhcmQoZ2FtZSwgeCwgeSkge1xyXG4gICAgdGhpcy5jYXJkT2JqTGlzdCA9IFtdOyAvLyDmiYvniYzlr7nosaHmlbDnu4RcclxuICAgIHRoaXMuY2FyZFZpZXdMaXN0ID0gW107IC8vIOaJi+eJjOinhuWbvuaVsOe7hFxyXG4gICAgdGhpcy5jYXJkSURMaXN0ID0gW107XHJcbiAgICB0aGlzLnggPSB4IHx8IDE0MDtcclxuICAgIHRoaXMueSA9IHkgfHwgMjA7XHJcbiAgICB0aGlzLmluaXQoZ2FtZSk7XHJcbn1cclxuXHJcbkhhbmRDYXJkLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKGdhbWUpIHtcclxuICAgIHRoaXMuY2FyZElETGlzdCA9IHRoaXMuc2V0SGFuZENhcmRMaXN0KCk7XHJcbiAgICAvLyB0aGlzLmJ1aWxkSGFuZENhcmRWaWV3TGlzdChnYW1lKTsgLy8g6K6+572u5Y2h6IOMXHJcbiAgICAvLyB0aGlzLnNldFJlYWxIYW5kQ2FyZChnYW1lKTsgLy8g55yf5a6e5Y2h6Z2iXHJcbn1cclxuXHJcbi8vIOaehOW7uuaJi+eJjOaVsOe7hHZpZXdcclxuSGFuZENhcmQucHJvdG90eXBlLmJ1aWxkSGFuZENhcmRWaWV3TGlzdCA9IGZ1bmN0aW9uIChnYW1lKSB7XHJcbiAgICAvLyDmiKrlj5bljaHnu4TkuK3nmoTliY3lm5vlvKBcclxuICAgIHZhciBfbGlzdCA9IHRoaXMuY2FyZElETGlzdC5zcGxpY2UoMCwgNCk7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IENhcmRDb25maWcuY2FyZF9pbmZvLmxlbmd0aDsgaisrKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoX2xpc3RbaV0gPT0gQ2FyZENvbmZpZy5jYXJkX2luZm9bal0uaWQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjYXJkID0gZ2FtZS5hZGQuaW1hZ2UodGhpcy54ICsgaSAqIDcwLCB0aGlzLnksIFwiY2FyZF9iYWNrXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIOiuvue9ruebuOW6lOeahOaVsOaNrlxyXG4gICAgICAgICAgICAgICAgY2FyZC5jYXJkSW5mbyA9IHt9O1xyXG4gICAgICAgICAgICAgICAgY2FyZC5jYXJkSW5mby5IUCA9IENhcmRDb25maWcuY2FyZF9pbmZvW2pdLmhwOyAvLyDooYDph49cclxuICAgICAgICAgICAgICAgIGNhcmQuY2FyZEluZm8uYXR0YWNrID0gQ2FyZENvbmZpZy5jYXJkX2luZm9bal0uYXR0YWNrOyAvLyDmlLvlh7vliptcclxuICAgICAgICAgICAgICAgIGNhcmQuY2FyZEluZm8uY25OYW1lID0gQ2FyZENvbmZpZy5jYXJkX2luZm9bal0uY25fbmFtZTsgLy8g5Lit5paH5ZCN56ewXHJcbiAgICAgICAgICAgICAgICBjYXJkLmNhcmRJbmZvLmZlZSA9IENhcmRDb25maWcuY2FyZF9pbmZvW2pdLmZlZTsgLy8g5Y+s5ZSk6LS555SoXHJcbiAgICAgICAgICAgICAgICBjYXJkLmNhcmRJbmZvLmZpZ2h0ID0gQ2FyZENvbmZpZy5jYXJkX2luZm9bal0uZmlnaHQ7IC8vIOaImOaWl+WbvueJh1xyXG4gICAgICAgICAgICAgICAgY2FyZC5zY2FsZS5zZXQoMC41KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FyZFZpZXdMaXN0LnB1c2goY2FyZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIOiuvue9ruWNoeeJjOeahOaVsOaNruaYvuekulxyXG5IYW5kQ2FyZC5wcm90b3R5cGUuc2V0UmVhbEhhbmRDYXJkID0gZnVuY3Rpb24gKGdhbWUpIHtcclxuICAgIHZhciBfbGlzdCA9IHRoaXMuY2FyZElETGlzdC5zcGxpY2UoMCwgNCk7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IENhcmRDb25maWcuY2FyZF9pbmZvLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGlmIChfbGlzdFtpXSA9PSBDYXJkQ29uZmlnLmNhcmRfaW5mb1tqXS5pZCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNhcmQgPSBnYW1lLmFkZC5pbWFnZSh0aGlzLnggKyBpICogNzUsIHRoaXMueSwgQ2FyZENvbmZpZy5jYXJkX2luZm9bal0ubmFtZSk7XHJcbiAgICAgICAgICAgICAgICBjYXJkLmNhcmRJbmZvID0ge307XHJcbiAgICAgICAgICAgICAgICBjYXJkLmNhcmRJbmZvLkhQID0gQ2FyZENvbmZpZy5jYXJkX2luZm9bal0uaHA7IC8vIOihgOmHj1xyXG4gICAgICAgICAgICAgICAgY2FyZC5jYXJkSW5mby5hdHRhY2sgPSBDYXJkQ29uZmlnLmNhcmRfaW5mb1tqXS5hdHRhY2s7IC8vIOaUu+WHu+WKm1xyXG4gICAgICAgICAgICAgICAgY2FyZC5jYXJkSW5mby5jbk5hbWUgPSBDYXJkQ29uZmlnLmNhcmRfaW5mb1tqXS5jbl9uYW1lOyAvLyDkuK3mloflkI3np7BcclxuICAgICAgICAgICAgICAgIGNhcmQuY2FyZEluZm8uZmVlID0gQ2FyZENvbmZpZy5jYXJkX2luZm9bal0uZmVlOyAvLyDlj6zllKTotLnnlKhcclxuICAgICAgICAgICAgICAgIGNhcmQuY2FyZEluZm8uZmlnaHQgPSBDYXJkQ29uZmlnLmNhcmRfaW5mb1tqXS5maWdodDsgLy8g5oiY5paX5Zu+54mHXHJcbiAgICAgICAgICAgICAgICBjYXJkLnNjYWxlLnNldCgwLjUpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuY2FyZE9iakxpc3QucHVzaChjYXJkKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjYXJkLmlucHV0RW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBjYXJkLmV2ZW50cy5vbklucHV0RG93bi5hZGQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRFbmFibGVkID0gZmFsc2U7IC8vIOemgeatoueOqeWutuS4jeWBnOeCueWHu1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChEYXRhTWFuYWdlci5oZXJvQ2hvaXNlQ2FyZCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIERhdGFNYW5hZ2VyLmhlcm9DaG9pc2VDYXJkID0gdGhpcztcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDms6jlhozliqjnlLvkuovku7ZcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHR3ZWVuID0gZ2FtZS5hZGQudHdlZW4oRGF0YU1hbmFnZXIuaGVyb0Nob2lzZUNhcmQpLnRvKHsgeTogRGF0YU1hbmFnZXIuaGVyb0Nob2lzZUNhcmQueSArIDIwIH0sIDIwMCwgXCJMaW5lYXJcIiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIERhdGFNYW5hZ2VyLmhlcm9DaG9pc2VDYXJkLmlucHV0RW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOaJp+ihjOWKqOeUu1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0d2Vlbi5zdGFydCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBEYXRhTWFuYWdlci5oZXJvQ2hvaXNlQ2FyZCA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgdHdlZW4gPSBnYW1lLmFkZC50d2Vlbih0aGlzKS50byh7IHk6IHRoaXMueSAtIDIwIH0sIDIwMCwgXCJMaW5lYXJcIiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdHdlZW4uc3RhcnQoKTtcclxuICAgICAgICAgICAgICAgICAgICB0d2Vlbi5vbkNvbXBsZXRlLmFkZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9LCBjYXJkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLy8g5Zue5ZCI5byA5aeL5pe255qE6KGl54mM6YC76L6RXHJcbkhhbmRDYXJkLnByb3RvdHlwZS5hZGRDYXJkID0gZnVuY3Rpb24gKGdhbWUpIHtcclxuICAgIHZhciBfY2FyZExpc3QgPSB0aGlzLmNhcmRJRExpc3Quc3BsaWNlKDAsIDEpO1xyXG5cclxuICAgIGlmICh0aGlzLmNhcmRPYmpMaXN0Lmxlbmd0aCA+PSA4KSB7XHJcbiAgICAgICAgYWxlcnQoXCLkvaDnmoTmiYvniYzlt7Lovr7liLDkuIrpmZDvvIzlvZPliY3liLDnmoTljaHniYzooqvplIDmr4FcIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAodmFyIGogPSAwOyBqIDwgQ2FyZENvbmZpZy5jYXJkX2luZm8ubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICBpZiAoX2NhcmRMaXN0WzBdID09IENhcmRDb25maWcuY2FyZF9pbmZvW2pdLmlkKSB7XHJcbiAgICAgICAgICAgIHZhciBjYXJkID0gZ2FtZS5hZGQuaW1hZ2UodGhpcy54ICsgKHRoaXMuY2FyZE9iakxpc3QubGVuZ3RoKSAqIDc1LCB0aGlzLnksIENhcmRDb25maWcuY2FyZF9pbmZvW2pdLm5hbWUpO1xyXG4gICAgICAgICAgICBjYXJkLmNhcmRJbmZvID0ge307XHJcbiAgICAgICAgICAgIGNhcmQuY2FyZEluZm8uSFAgPSBDYXJkQ29uZmlnLmNhcmRfaW5mb1tqXS5ocDsgLy8g6KGA6YePXHJcbiAgICAgICAgICAgIGNhcmQuY2FyZEluZm8uYXR0YWNrID0gQ2FyZENvbmZpZy5jYXJkX2luZm9bal0uYXR0YWNrOyAvLyDmlLvlh7vliptcclxuICAgICAgICAgICAgY2FyZC5jYXJkSW5mby5jbk5hbWUgPSBDYXJkQ29uZmlnLmNhcmRfaW5mb1tqXS5jbl9uYW1lOyAvLyDkuK3mloflkI3np7BcclxuICAgICAgICAgICAgY2FyZC5jYXJkSW5mby5mZWUgPSBDYXJkQ29uZmlnLmNhcmRfaW5mb1tqXS5mZWU7IC8vIOWPrOWUpOi0ueeUqFxyXG4gICAgICAgICAgICBjYXJkLmNhcmRJbmZvLmZpZ2h0ID0gQ2FyZENvbmZpZy5jYXJkX2luZm9bal0uZmlnaHQ7IC8vIOaImOaWl+WbvueJh1xyXG4gICAgICAgICAgICBjYXJkLnNjYWxlLnNldCgwLjUpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jYXJkT2JqTGlzdC5wdXNoKGNhcmQpO1xyXG5cclxuICAgICAgICAgICAgY2FyZC5pbnB1dEVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBjYXJkLmV2ZW50cy5vbklucHV0RG93bi5hZGQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dEVuYWJsZWQgPSBmYWxzZTsgLy8g56aB5q2i546p5a625LiN5YGc54K55Ye7XHJcbiAgICAgICAgICAgICAgICBpZiAoRGF0YU1hbmFnZXIuaGVyb0Nob2lzZUNhcmQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIERhdGFNYW5hZ2VyLmhlcm9DaG9pc2VDYXJkID0gdGhpcztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5rOo5YaM5Yqo55S75LqL5Lu2XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHR3ZWVuID0gZ2FtZS5hZGQudHdlZW4oRGF0YU1hbmFnZXIuaGVyb0Nob2lzZUNhcmQpLnRvKHsgeTogRGF0YU1hbmFnZXIuaGVyb0Nob2lzZUNhcmQueSArIDIwIH0sIDIwMCwgXCJMaW5lYXJcIiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgRGF0YU1hbmFnZXIuaGVyb0Nob2lzZUNhcmQuaW5wdXRFbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAvLyDmiafooYzliqjnlLtcclxuICAgICAgICAgICAgICAgICAgICB0d2Vlbi5zdGFydCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIERhdGFNYW5hZ2VyLmhlcm9DaG9pc2VDYXJkID0gdGhpcztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdHdlZW4gPSBnYW1lLmFkZC50d2Vlbih0aGlzKS50byh7IHk6IHRoaXMueSAtIDIwIH0sIDIwMCwgXCJMaW5lYXJcIiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB0d2Vlbi5zdGFydCgpO1xyXG4gICAgICAgICAgICAgICAgdHdlZW4ub25Db21wbGV0ZS5hZGQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sIGNhcmQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLy8g6YeN5paw5a+55omL54mM5o6S5bqPXHJcbkhhbmRDYXJkLnByb3RvdHlwZS5yZUxpc3RIYW5kQ2FyZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHZhciBfdGVtcCA9IFtdO1xyXG4gICAgaWYgKHNlbGYuY2FyZE9iakxpc3QubGVuZ3RoID09IDApIHsgLy8g5rKh5pyJ5omL54mM55qE5oOF5Ya1XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGYuY2FyZE9iakxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHNlbGYuY2FyZE9iakxpc3RbaV0uYWxpdmUgPT0gdHJ1ZSkgeyAvLyDmuIXpmaTmjonlt7Lnu4/plIDmr4HkuobnmoTmiYvniYxcclxuICAgICAgICAgICAgICAgIF90ZW1wLnB1c2goc2VsZi5jYXJkT2JqTGlzdFtpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgc2VsZi5jYXJkT2JqTGlzdCA9IF90ZW1wO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHNlbGYuY2FyZE9iakxpc3QubGVuZ3RoOyBqKyspIHsgLy8g6YeN5paw5a+55omL54mM5o6S5bqPXHJcbiAgICAgICAgICAgIHNlbGYuY2FyZE9iakxpc3Rbal0ueCA9IHNlbGYueCArIGogKiA3NTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiAg55Sf5oiQ5Y2h54mMaWTmlbDnu4RcclxuICogQHJldHVybiB7YXJyYXl9IOWNoee7hOeahGFk5pWw57uEXHJcbiAqL1xyXG5IYW5kQ2FyZC5wcm90b3R5cGUuc2V0SGFuZENhcmRMaXN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGNhcmRHZW5lcmF0ZXIgPSBuZXcgQ2FyZEdlbmVyYXRlcigpO1xyXG4gICAgdmFyIGNhcmRJRExpc3QgPSBjYXJkR2VuZXJhdGVyLmJ1aWxkQ2FyZExpc3QoQ2FyZENvbmZpZy5jYXJkTGVuZ3RoLCAxLCBDYXJkQ29uZmlnLmNhcmRfaW5mby5sZW5ndGgpO1xyXG4gICAgcmV0dXJuIGNhcmRJRExpc3Q7XHJcbn1cclxuXHJcbi8vIOmAmui/h2lk5p6E5bu655yf5a6e5omL54mMXHJcbm1vZHVsZS5leHBvcnRzID0gSGFuZENhcmQ7XG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlpiaTdnYlwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL21vZHVsZXNcXFxcY2xhc3NcXFxcSGFuZENhcmQuanNcIixcIi9tb2R1bGVzXFxcXGNsYXNzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyoqXHJcbiAqIOinkuiJsuWktOWDj+exu1xyXG4gKiBAcGFyYW0gZ2FtZSBbb2JqXSDmuLjmiI/lnLrmma/lr7nosaFcclxuICogQHBhcmFtIHRleHR1cmVOYW1lIFtzdHJpbmddIOWbvueJh2tleVxyXG4gKiBAcGFyYW0gcG9zaXRpb25YIFtudW1iZXJdIOWIneWni+WMlueahHjlnZDmoIdcclxuICogQHBhcmFtIHBvc2l0aW9uWSBbbnVtYmVyXSDliJ3lp4vljJbnmoR55Z2Q5qCHXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gSGVhZChnYW1lLCB0ZXh0dXJlTmFtZSwgcG9zaXRpb25YLCBwb3NpdGlvblkpIHtcclxuXHR0aGlzLmhlYWRPYmogPSBudWxsO1xyXG5cdHRoaXMueCA9IHBvc2l0aW9uWDtcclxuXHR0aGlzLnkgPSBwb3NpdGlvblk7XHJcblx0dGhpcy5IUE9iaiA9IG51bGw7ICAvLyDoi7Hpm4TooYDph49cclxuXHR0aGlzLnRleHR1cmVOYW1lID0gdGV4dHVyZU5hbWU7XHJcblx0dGhpcy5pbml0KGdhbWUpO1xyXG59XHJcblxyXG5IZWFkLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKGdhbWUpIHtcclxuXHR0aGlzLmhlYWRPYmogPSB0aGlzLnNldFBpYyhnYW1lKTtcclxuXHR0aGlzLkhQT2JqID0gdGhpcy5zZXRIUChnYW1lKTtcclxufVxyXG5cclxuLy8g6K6+572u6Iux6ZuE5aS05YOPXHJcbkhlYWQucHJvdG90eXBlLnNldFBpYyA9IGZ1bmN0aW9uIChnYW1lKSB7XHJcblx0dmFyIHBpYyA9IGdhbWUuYWRkLmltYWdlKHRoaXMueCwgdGhpcy55LCB0aGlzLnRleHR1cmVOYW1lKTtcclxuXHRyZXR1cm4gcGljO1xyXG59XHJcblxyXG4vLyDorr7nva7ooYDph49cclxuSGVhZC5wcm90b3R5cGUuc2V0SFAgPSBmdW5jdGlvbiAoZ2FtZSkge1xyXG5cdHZhciBIUGJnID0gZ2FtZS5hZGQuaW1hZ2UoMTAsIDE3MCwgXCJocF9iYWNrZ3JvdW5kXCIpO1xyXG5cdHZhciBIUCA9IGdhbWUuYWRkLnRleHQoSFBiZy53aWR0aCAvIDIsIEhQYmcuaGVpZ2h0IC8gMiArIDUsIFwiMzBcIiwgeyBmaWxsOiBcIiNmZmZcIiwgZm9udFNpemU6IFwiMjRwdFwiIH0pO1xyXG5cdEhQLmFuY2hvci5zZXQoMC41KTtcclxuXHRIUGJnLmFkZENoaWxkKEhQKTtcclxuXHJcblx0cmV0dXJuIEhQO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEhlYWQ7XG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlpiaTdnYlwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL21vZHVsZXNcXFxcY2xhc3NcXFxcSGVhZC5qc1wiLFwiL21vZHVsZXNcXFxcY2xhc3NcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKipcclxuICog546p5a625rC05pm2566h55CGXHJcbiAqL1xyXG5cclxudmFyIEZlZSA9IHJlcXVpcmUoXCIuL0ZlZVwiKTtcclxudmFyIHV0aWxzID0gcmVxdWlyZShcIi4uL1V0aWxzXCIpO1xyXG5cclxuZnVuY3Rpb24gSGVyb0ZlZShnYW1lKSB7XHJcbiAgICBGZWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxudXRpbHMuZXh0ZW5kKEhlcm9GZWUsIEZlZSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEhlcm9GZWU7XHJcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJaYmk3Z2JcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tb2R1bGVzXFxcXGNsYXNzXFxcXEhlcm9GZWUuanNcIixcIi9tb2R1bGVzXFxcXGNsYXNzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyoqXHJcbiAqIEhlcm/miJjmlpfpmo/ku45cclxuICovXHJcblxyXG52YXIgRmlnaHRlciA9IHJlcXVpcmUoXCIuL0ZpZ2h0ZXJcIik7XHJcbnZhciB1dGlscyA9IHJlcXVpcmUoXCIuLi9VdGlsc1wiKTtcclxuXHJcbmZ1bmN0aW9uIEhlcm9GaWdodGVyKGdhbWUpe1xyXG4gICAgRmlnaHRlci5hcHBseSh0aGlzLGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbnV0aWxzLmV4dGVuZChIZXJvRmlnaHRlcixGaWdodGVyKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSGVyb0ZpZ2h0ZXI7XHJcblxyXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiWmJpN2diXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbW9kdWxlc1xcXFxjbGFzc1xcXFxIZXJvRmlnaHRlci5qc1wiLFwiL21vZHVsZXNcXFxcY2xhc3NcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKipcclxuICog6Iux6ZuE55qE5omL54mM57G7XHJcbiAqL1xyXG5cclxudmFyIEhhbmRDYXJuZCA9IHJlcXVpcmUoXCIuL0hhbmRDYXJkXCIpO1xyXG52YXIgdXRpbHMgPSByZXF1aXJlKFwiLi4vVXRpbHNcIik7XHJcblxyXG5mdW5jdGlvbiBIZXJvSGFuZENhcmQoZ2FtZSwgeCwgeSkge1xyXG4gICAgSGFuZENhcm5kLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICB0aGlzLnNldFJlYWxIYW5kQ2FyZChnYW1lKTsgLy8g55yf5a6e5Y2h6Z2iXHJcbn1cclxuXHJcbnV0aWxzLmV4dGVuZChIZXJvSGFuZENhcmQsIEhhbmRDYXJuZCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEhlcm9IYW5kQ2FyZDtcclxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlpiaTdnYlwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL21vZHVsZXNcXFxcY2xhc3NcXFxcSGVyb0hhbmRDYXJkLmpzXCIsXCIvbW9kdWxlc1xcXFxjbGFzc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qKlxyXG4gKiDnjqnlrrbop5LoibLlpLTlg49cclxuICovXHJcbnZhciB1dGlscyA9IHJlcXVpcmUoXCIuLi9VdGlsc1wiKTtcclxudmFyIEhlYWQgPSByZXF1aXJlKFwiLi9IZWFkXCIpO1xyXG5cclxuZnVuY3Rpb24gSGVyb0hlYWQoZ2FtZSwgdGV4dHVyZU5hbWUsIHBvc2l0aW9uWCwgcG9zaXRpb25ZKSB7XHJcbiAgICBIZWFkLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbi8vIEhlcm9IZWFk57un5om/6IeqSGVhZOexu1xyXG51dGlscy5leHRlbmQoSGVyb0hlYWQsIEhlYWQpO1xyXG5cclxuLyoqXHJcbiAqICBAb3ZlcnJpZGUg6YeN5YaZc2V0SFDmlrnms5VcclxuICovXHJcbkhlcm9IZWFkLnByb3RvdHlwZS5zZXRIUCA9IGZ1bmN0aW9uKGdhbWUpIHtcclxuICAgIHZhciBIUGJnID0gZ2FtZS5hZGQuaW1hZ2UodGhpcy54LCB0aGlzLnkgLSA1NSwgXCJocF9iYWNrZ3JvdW5kXCIpO1xyXG4gICAgdmFyIEhQID0gZ2FtZS5hZGQudGV4dChIUGJnLndpZHRoIC8gMiwgSFBiZy5oZWlnaHQgLyAyICsgNSwgXCIzMFwiLCB7XHJcbiAgICAgICAgZmlsbDogXCIjZmZmXCIsXHJcbiAgICAgICAgZm9udFNpemU6IFwiMjRwdFwiXHJcbiAgICB9KTtcclxuICAgIEhQLmFuY2hvci5zZXQoMC41KTtcclxuICAgIEhQYmcuYWRkQ2hpbGQoSFApO1xyXG5cclxuICAgIHJldHVybiBIUDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBIZXJvSGVhZDtcbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiWmJpN2diXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbW9kdWxlc1xcXFxjbGFzc1xcXFxIZXJvSGVhZC5qc1wiLFwiL21vZHVsZXNcXFxcY2xhc3NcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKipcclxuICogVUnnlYzpnaLnrqHnkIZcclxuICovXHJcblxyXG52YXIgQmFja0dyb3VuZCA9IHJlcXVpcmUoXCIuL0JhY2tHcm91bmRcIik7XHJcbnZhciBIZXJvSGVhZCA9IHJlcXVpcmUoXCIuL0hlcm9IZWFkXCIpO1xyXG52YXIgRW5lbXlIZWFkID0gcmVxdWlyZShcIi4vRW5lbXlIZWFkXCIpO1xyXG52YXIgRGF0YU1hbmFnZXIgPSByZXF1aXJlKFwiLi9EYXRhTWFuYWdlclwiKTtcclxudmFyIEhlcm9IYW5kQ2FyZCA9IHJlcXVpcmUoXCIuL0hlcm9IYW5kQ2FyZFwiKTtcclxudmFyIEVuZW15SGFuZENhcmQgPSByZXF1aXJlKFwiLi9FbmVteUhhbmRDYXJkXCIpO1xyXG52YXIgSGVyb0ZlZSA9IHJlcXVpcmUoXCIuL0hlcm9GZWVcIik7XHJcbnZhciBFbmVteUZlZSA9IHJlcXVpcmUoXCIuL0VuZW15RmVlXCIpO1xyXG52YXIgQUkgPSByZXF1aXJlKFwiLi9BSVwiKTtcclxuXHJcbnZhciBIZXJvRmlnaHRlciA9IHJlcXVpcmUoXCIuL0hlcm9GaWdodGVyXCIpO1xyXG5cclxuZnVuY3Rpb24gVUlNYW5hZ2VyKGdhbWUpIHtcclxuICAgIHRoaXMuYmFja2dyb3VuZE9iaiA9IG51bGw7IC8vIOiDjOaZr+WbvlxyXG4gICAgdGhpcy50dXJuT3ZlckJ1dHRvbiA9IG51bGw7IC8vIOWbnuWQiOe7k+adn1xyXG4gICAgdGhpcy5zaG90Q2FyZEJ1dHRvbiA9IG51bGw7IC8vIOWHuueJjOaMiemSrlxyXG4gICAgdGhpcy5pbml0KGdhbWUpO1xyXG59XHJcblxyXG5VSU1hbmFnZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbihnYW1lKSB7XHJcbiAgICAvLyDnlJ/miJDog4zmma/lm75cclxuICAgIHRoaXMuYmFja2dyb3VuZE9iaiA9IHRoaXMuc2V0QmFja0dyb3VuZChnYW1lKTtcclxuICAgIC8vIOeUn+aIkOeOqeWutuiLsembhOWktOWDj1xyXG4gICAgRGF0YU1hbmFnZXIuaGVyb0hlYWQgPSBuZXcgSGVyb0hlYWQoZ2FtZSwgXCJmaWdodGVyX2hlcm9cIiwgMCwgZ2FtZS53b3JsZC5oZWlnaHQgLSAxNDApO1xyXG5cclxuICAgIC8vIOeUn+aIkOeUteiEkeiLsembhOWktOWDj1xyXG4gICAgRGF0YU1hbmFnZXIuZW5lbXlIZWFkID0gbmV3IEVuZW15SGVhZChnYW1lLCBcImZpZ2h0ZXJfaGVyb1wiLCAwLCAwKTtcclxuXHJcbiAgICAvLyDorr7nva7lm57lkIjnu5PmnZ/mjInpkq5cclxuICAgIERhdGFNYW5hZ2VyLnR1cm5PdmVyQnV0dG9uID0gdGhpcy5zZXRUdXJuT3ZlckJ1dHRvbihnYW1lKTtcclxuICAgIC8vIOiuvue9ruaVjOS6uuaJi+eJjFxyXG4gICAgRGF0YU1hbmFnZXIuZW5lbXlIYW5kQ2FyZCA9IG5ldyBFbmVteUhhbmRDYXJkKGdhbWUpO1xyXG5cclxuICAgIC8vIOiuvue9rueOqeWutuaJi+eJjCBcclxuICAgIERhdGFNYW5hZ2VyLmhlcm9IYW5kQ2FyZCA9IG5ldyBIZXJvSGFuZENhcmQoZ2FtZSwgbnVsbCwgZ2FtZS53b3JsZC5oZWlnaHQgLSAxMjApO1xyXG5cclxuICAgIHRoaXMuc2hvdENhcmRCdXR0b24gPSB0aGlzLnNldFNob3RDYXJkQnV0dG9uKGdhbWUpOyAvLyDorr7nva7lh7rniYzmjInpkq5cclxuXHJcbiAgICAvLyDoi7Hpm4TotLnnlKjnrqHnkIZcclxuICAgIERhdGFNYW5hZ2VyLmhlcm9GZWUgPSBuZXcgSGVyb0ZlZShnYW1lLCBnYW1lLndvcmxkLndpZHRoIC0gMTEwLCBnYW1lLndvcmxkLmNlbnRlclkgKyA0Mik7IFxyXG4gICAgXHJcbiAgICAvLyDmlYzkurrotLnnlKjnrqHnkIZcclxuICAgIERhdGFNYW5hZ2VyLmVuZW15RmVlID0gbmV3IEVuZW15RmVlKGdhbWUsIGdhbWUud29ybGQud2lkdGggLSAxMTAsIGdhbWUud29ybGQuY2VudGVyWSAtIDkwKTsgXHJcblxyXG4gICAgLy8g5Yib5bu6QUlcclxuICAgIERhdGFNYW5hZ2VyLkFJID0gbmV3IEFJKCk7IFxyXG59XHJcblxyXG4vLyDorr7nva7og4zmma9cclxuVUlNYW5hZ2VyLnByb3RvdHlwZS5zZXRCYWNrR3JvdW5kID0gZnVuY3Rpb24oZ2FtZSkge1xyXG4gICAgdmFyIGJhY2tncm91bmQgPSBuZXcgQmFja0dyb3VuZChnYW1lKTtcclxuICAgIHJldHVybiBiYWNrZ3JvdW5kO1xyXG59XHJcblxyXG4vLyDlm57lkIjnu5PmnZ9cclxuVUlNYW5hZ2VyLnByb3RvdHlwZS5zZXRUdXJuT3ZlckJ1dHRvbiA9IGZ1bmN0aW9uKGdhbWUpIHtcclxuICAgIHZhciBidXR0b24gPSBnYW1lLmFkZC5pbWFnZShnYW1lLndvcmxkLndpZHRoIC0gMTUwLCBnYW1lLndvcmxkLmNlbnRlclkgLSAzMCwgXCJoZXJvX3R1cm5fYnV0dG9uXCIpO1xyXG4gICAgYnV0dG9uLmlucHV0RW5hYmxlZCA9IHRydWU7XHJcbiAgICBidXR0b24uZXZlbnRzLm9uSW5wdXREb3duLmFkZChmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoRGF0YU1hbmFnZXIudHVybiA9PSAwKSB7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5sb2FkVGV4dHVyZShcImVuZW15X3R1cm5fYnV0dG9uXCIpO1xyXG4gICAgICAgICAgICBEYXRhTWFuYWdlci50dXJuID0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKERhdGFNYW5hZ2VyLmVuZW15RmlnaHRlcnMpIHtcclxuICAgICAgICAgICAgRGF0YU1hbmFnZXIuZW5lbXlGaWdodGVycy5hd2FrZUZpZ2h0ZXIoKTsgLy8g6Kej6Zmk5pWM5Lq66ZqP5LuO552h55yg54q25oCBXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBEYXRhTWFuYWdlci5lbmVteUZlZS5mZWVPYmouc2V0VGV4dChEYXRhTWFuYWdlci5mZWUgKyBcIi9cIiArIERhdGFNYW5hZ2VyLmZlZSk7XHJcbiAgICAgICAgRGF0YU1hbmFnZXIuZW5lbXlIYW5kQ2FyZC5hZGRDYXJkKGdhbWUpOyAvLyDmlYzkurrmkbjniYxcclxuICAgICAgICB2YXIgdGltZSA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIERhdGFNYW5hZ2VyLkFJLnNob3RDYXJkKGdhbWUpO1xyXG4gICAgICAgICAgICBEYXRhTWFuYWdlci5BSS5jaG9pc2VBdHRhY2tUYXJnZXQoZ2FtZSk7IC8vIOeUteiEkUFJ5bGV5byA5pS75Ye7XHJcbiAgICAgICAgICAgIGlmIChEYXRhTWFuYWdlci5oZXJvRmlnaHRlcnMpIHtcclxuICAgICAgICAgICAgICAgIERhdGFNYW5hZ2VyLmhlcm9GaWdodGVycy5hd2FrZUZpZ2h0ZXIoKTsgLy8g6Kej6Zmk546p5a626ZqP5LuO552h55yg54q25oCBXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIOabtOaWsOeOqeWutui0ueeUqOeahOaDheWGtVxyXG4gICAgICAgICAgICBpZiAoRGF0YU1hbmFnZXIuZmVlIDwgOSkge1xyXG4gICAgICAgICAgICAgICAgRGF0YU1hbmFnZXIuZmVlICs9IDE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIERhdGFNYW5hZ2VyLmhlcm9DdXJyZW50RmVlID0gRGF0YU1hbmFnZXIuZmVlO1xyXG4gICAgICAgICAgICBEYXRhTWFuYWdlci5oZXJvRmVlLmZlZU9iai5zZXRUZXh0KERhdGFNYW5hZ2VyLmZlZSArIFwiL1wiICsgRGF0YU1hbmFnZXIuZmVlKTtcclxuICAgICAgICAgICAgRGF0YU1hbmFnZXIuaGVyb0hhbmRDYXJkLmFkZENhcmQoZ2FtZSk7IC8vIOeOqeWutuaRuOeJjFxyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZSk7XHJcbiAgICAgICAgfSwgMTAwMCk7XHJcblxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gYnV0dG9uO1xyXG59XHJcblxyXG4vLyDlh7rniYzmjInpkq5cclxuVUlNYW5hZ2VyLnByb3RvdHlwZS5zZXRTaG90Q2FyZEJ1dHRvbiA9IGZ1bmN0aW9uKGdhbWUpIHtcclxuICAgIHZhciBzaG90ID0gZ2FtZS5hZGQuaW1hZ2UoODAsIGdhbWUud29ybGQuY2VudGVyWSAtIDEwLCBcInNob3RfY2FyZFwiKTtcclxuICAgIHNob3QuYW5jaG9yLnNldCgwLjUpO1xyXG4gICAgc2hvdC5pbnB1dEVuYWJsZWQgPSB0cnVlO1xyXG4gICAgc2hvdC5ldmVudHMub25JbnB1dERvd24uYWRkKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmIChEYXRhTWFuYWdlci50dXJuICE9IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g5o6n5Yi2546p5a625Zy65LiK55qE6ZqP5LuOXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKERhdGFNYW5hZ2VyLmhlcm9GaWdodGVycy5maWdodE9iai5sZW5ndGggPj0gNSkge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCLmgqjlnLrkuIrnmoTpmo/ku47lt7Lnu4/liLDovr7kuobkuIrpmZBcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlKSB7fVxyXG5cclxuICAgICAgICBpZiAoRGF0YU1hbmFnZXIuaGVyb0Nob2lzZUNhcmQpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIOajgOafpemAieaLqeWNoeeJjOeahOi0ueeUqOaYr+WQpui2heWHuuW9k+WJjeWPr+eUqOi0ueeUqFxyXG4gICAgICAgICAgICBpZiAoRGF0YU1hbmFnZXIuaGVyb0N1cnJlbnRGZWUgPCBEYXRhTWFuYWdlci5oZXJvQ2hvaXNlQ2FyZC5jYXJkSW5mby5mZWUpIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KFwi5L2g55qE6LS555So5LiN6Laz77yM5peg5rOV5L2/55So6L+Z5byg5Y2h54mMXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBEYXRhTWFuYWdlci5oZXJvQ3VycmVudEZlZSA9IERhdGFNYW5hZ2VyLmhlcm9DdXJyZW50RmVlIC0gRGF0YU1hbmFnZXIuaGVyb0Nob2lzZUNhcmQuY2FyZEluZm8uZmVlO1xyXG4gICAgICAgICAgICBEYXRhTWFuYWdlci5oZXJvRmVlLmZlZU9iai5zZXRUZXh0KERhdGFNYW5hZ2VyLmhlcm9DdXJyZW50RmVlICsgXCIvXCIgKyBEYXRhTWFuYWdlci5mZWUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKERhdGFNYW5hZ2VyLmhlcm9GaWdodGVycyA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBEYXRhTWFuYWdlci5oZXJvRmlnaHRlcnMgPSBuZXcgSGVyb0ZpZ2h0ZXIoZ2FtZSk7XHJcbiAgICAgICAgICAgICAgICBEYXRhTWFuYWdlci5oZXJvRmlnaHRlcnMuYnVpbGRGaWdodGVyKGdhbWUsIERhdGFNYW5hZ2VyLmhlcm9DaG9pc2VDYXJkLmNhcmRJbmZvLkhQLCBEYXRhTWFuYWdlci5oZXJvQ2hvaXNlQ2FyZC5jYXJkSW5mby5hdHRhY2ssIERhdGFNYW5hZ2VyLmhlcm9DaG9pc2VDYXJkLmNhcmRJbmZvLmNuTmFtZSwgRGF0YU1hbmFnZXIuaGVyb0Nob2lzZUNhcmQuY2FyZEluZm8uZmlnaHQpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgRGF0YU1hbmFnZXIuaGVyb0ZpZ2h0ZXJzLmJ1aWxkRmlnaHRlcihnYW1lLCBEYXRhTWFuYWdlci5oZXJvQ2hvaXNlQ2FyZC5jYXJkSW5mby5IUCwgRGF0YU1hbmFnZXIuaGVyb0Nob2lzZUNhcmQuY2FyZEluZm8uYXR0YWNrLCBEYXRhTWFuYWdlci5oZXJvQ2hvaXNlQ2FyZC5jYXJkSW5mby5jbk5hbWUsIERhdGFNYW5hZ2VyLmhlcm9DaG9pc2VDYXJkLmNhcmRJbmZvLmZpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgRGF0YU1hbmFnZXIuaGVyb0Nob2lzZUNhcmQuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICBEYXRhTWFuYWdlci5oZXJvSGFuZENhcmQucmVMaXN0SGFuZENhcmQoKTtcclxuICAgICAgICAgICAgRGF0YU1hbmFnZXIuaGVyb0Nob2lzZUNhcmQgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuICAgIHJldHVybiBzaG90O1xyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gVUlNYW5hZ2VyO1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJaYmk3Z2JcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tb2R1bGVzXFxcXGNsYXNzXFxcXFVJTWFuYWdlci5qc1wiLFwiL21vZHVsZXNcXFxcY2xhc3NcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKipcclxuICog5ri45oiP5Y2h54mM55qE6YWN572u5paH5Lu2XHJcbiAqL1xyXG5cclxudmFyIENhcmRDb25maWcgPSB7XHJcbiAgICBcImNhcmRfaW5mb1wiOiBbe1xyXG4gICAgICAgIFwibmFtZVwiOiBcImZpc2htYW5fYmFieVwiLFxyXG4gICAgICAgIFwiZmlnaHRcIjogXCJmaXNobWFuX2JhYnlfZmlnaHRcIixcclxuICAgICAgICBcImNuX25hbWVcIjogXCLpsbzkurrlrp3lrp1cIixcclxuICAgICAgICBcImZlZVwiOiAxLFxyXG4gICAgICAgIFwiYXR0YWNrXCI6IDEsXHJcbiAgICAgICAgXCJocFwiOiAxLFxyXG4gICAgICAgIFwiaWRcIjogMVxyXG4gICAgfSwge1xyXG4gICAgICAgIFwibmFtZVwiOiBcImZyZXNod2F0ZXJfY3JvY29kaWxlXCIsXHJcbiAgICAgICAgXCJmaWdodFwiOiBcImZyZXNod2F0ZXJfY3JvY29kaWxlX2ZpZ2h0XCIsXHJcbiAgICAgICAgXCJjbl9uYW1lXCI6IFwi5reh5rC06bOEXCIsXHJcbiAgICAgICAgXCJmZWVcIjogMixcclxuICAgICAgICBcImF0dGFja1wiOiAyLFxyXG4gICAgICAgIFwiaHBcIjogMyxcclxuICAgICAgICBcImlkXCI6IDJcclxuICAgIH0sIHtcclxuICAgICAgICBcIm5hbWVcIjogXCJvZ3JlXCIsXHJcbiAgICAgICAgXCJmaWdodFwiOiBcIm9ncmVfZmlnaHRcIixcclxuICAgICAgICBcImNuX25hbWVcIjogXCLpo5/kurrprZTms5XluIhcIixcclxuICAgICAgICBcImZlZVwiOiA0LFxyXG4gICAgICAgIFwiYXR0YWNrXCI6IDQsXHJcbiAgICAgICAgXCJocFwiOiA0LFxyXG4gICAgICAgIFwiaWRcIjogM1xyXG4gICAgfSwge1xyXG4gICAgICAgIFwibmFtZVwiOiBcImRlYWRfd2luZ1wiLFxyXG4gICAgICAgIFwiZmlnaHRcIjogXCJkZWFkX3dpbmdfZmlnaHRcIixcclxuICAgICAgICBcImNuX25hbWVcIjogXCLmrbvkuqHkuYvnv7xcIixcclxuICAgICAgICBcImZlZVwiOiA5LFxyXG4gICAgICAgIFwiYXR0YWNrXCI6IDksXHJcbiAgICAgICAgXCJocFwiOiA5LFxyXG4gICAgICAgIFwiaWRcIjogNFxyXG4gICAgfSx7XHJcbiAgICAgICAgXCJuYW1lXCI6IFwicm9zZVwiLFxyXG4gICAgICAgIFwiZmlnaHRcIjogXCJyb3NlX2ZpZ2h0XCIsXHJcbiAgICAgICAgXCJjbl9uYW1lXCI6IFwi5ouJ5qC857qz572X5pavXCIsXHJcbiAgICAgICAgXCJmZWVcIjogOCxcclxuICAgICAgICBcImF0dGFja1wiOiA4LFxyXG4gICAgICAgIFwiaHBcIjogOCxcclxuICAgICAgICBcImlkXCI6IDVcclxuICAgIH0se1xyXG4gICAgICAgIFwibmFtZVwiOiBcInZlbG9jaXJhcHRvclwiLFxyXG4gICAgICAgIFwiZmlnaHRcIjogXCJ2ZWxvY2lyYXB0b3JfZmlnaHRcIixcclxuICAgICAgICBcImNuX25hbWVcIjogXCLotoXnuqfov4XnjJvpvplcIixcclxuICAgICAgICBcImZlZVwiOiA0LFxyXG4gICAgICAgIFwiYXR0YWNrXCI6IDQsXHJcbiAgICAgICAgXCJocFwiOiA1LFxyXG4gICAgICAgIFwiaWRcIjogNlxyXG4gICAgfV0sIC8vIOWNoeeJjOeahOebuOWFs+S/oeaBr1xyXG4gICAgXCJjYXJkTGVuZ3RoXCI6IDE1LCAvLyDljaHnu4Tplb/luqZcclxuICAgIFwiY2FyZEluaXRpYWxMZW5ndGhcIjogNCwgLy8g5Yid5aeL5YyW5omL54mM6ZW/5bqmXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2FyZENvbmZpZztcbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiWmJpN2diXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbW9kdWxlc1xcXFxjb25maWdcXFxcQ2FyZENvbmZpZy5qc1wiLFwiL21vZHVsZXNcXFxcY29uZmlnXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyoqXHJcbiAqIOa4uOaIj+S4u+WcuuaZr1xyXG4gKi9cclxuXHJcbnZhciBVSVBhbmVsID0gcmVxdWlyZShcIi4uL2NsYXNzL1VJTWFuYWdlclwiKTtcclxuXHJcbmZ1bmN0aW9uIEdhbWVTY2VuZShnYW1lKSB7XHJcbiAgICB0aGlzLnByZWxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8g5Yqg6L295o+Q56S65aOw5piOXHJcbiAgICAgICAgdmFyIGxvYWRUZXh0ID0gZ2FtZS5hZGQudGV4dChnYW1lLndvcmxkLmNlbnRlclgsIGdhbWUud29ybGQuY2VudGVyWSwgXCJMb2FkaW5nIC4uLiBcIiwgeyBmaWxsOiBcIiMzMzNcIiwgXCJmb250U2l6ZVwiOiBcIjI4cHRcIiB9KTtcclxuXHJcbiAgICAgICAgLy8g6ZSa54K56K6+572uXHJcbiAgICAgICAgbG9hZFRleHQuYW5jaG9yLnNldCgwLjUpO1xyXG5cclxuICAgICAgICBnYW1lLmxvYWQuaW1hZ2UoXCJiYWNrZ3JvdW5kXCIsIFwiLi4vLi4vcmVzb3VyY2UvYmFja2dyb3VuZC5wbmdcIik7XHJcbiAgICAgICAgZ2FtZS5sb2FkLmltYWdlKFwiY2FyZF9iYWNrXCIsIFwiLi4vLi4vcmVzb3VyY2UvY2FyZF9iYWNrLnBuZ1wiKTtcclxuICAgICAgICBnYW1lLmxvYWQuaW1hZ2UoXCJlbmVteV90dXJuX2J1dHRvblwiLCBcIi4uLy4uL3Jlc291cmNlL2VuZW15X3R1cm5fYnV0dG9uLnBuZ1wiKTtcclxuICAgICAgICBnYW1lLmxvYWQuaW1hZ2UoXCJmZWVcIiwgXCIuLi8uLi9yZXNvdXJjZS9mZWUucG5nXCIpO1xyXG4gICAgICAgIGdhbWUubG9hZC5pbWFnZShcImhlcm9fdHVybl9idXR0b25cIiwgXCIuLi8uLi9yZXNvdXJjZS9oZXJvX3R1cm5fYnV0dG9uLnBuZ1wiKTtcclxuICAgICAgICBnYW1lLmxvYWQuaW1hZ2UoXCJocF9iYWNrZ3JvdW5kXCIsIFwiLi4vLi4vcmVzb3VyY2UvaHBfYmFja2dyb3VuZC5wbmdcIik7XHJcbiAgICAgICAgZ2FtZS5sb2FkLmltYWdlKFwiYXR0YWNrX2ljb25cIixcIi4uLy4uL3Jlc291cmNlL2F0dGFja19pY29uLnBuZ1wiKTtcclxuICAgICAgICBnYW1lLmxvYWQuaW1hZ2UoXCJzaG90X2NhcmRcIixcIi4uLy4uL3Jlc291cmNlL3Nob3RfY2FyZC5wbmdcIik7XHJcbiAgICAgICAgZ2FtZS5sb2FkLmltYWdlKFwiZmlnaHRlcl9oZXJvXCIsIFwiLi4vLi4vcmVzb3VyY2UvZmlnaHRlcl9oZXJvLnBuZ1wiKTtcclxuICAgICAgICBcclxuICAgICAgICBnYW1lLmxvYWQuaW1hZ2UoXCJkZWFkX3dpbmdcIiwgXCIuLi8uLi9yZXNvdXJjZS9kZWFkX3dpbmcucG5nXCIpO1xyXG4gICAgICAgIGdhbWUubG9hZC5pbWFnZShcImRlYWRfd2luZ19maWdodFwiLCBcIi4uLy4uL3Jlc291cmNlL2RlYWRfd2luZ19maWdodC5wbmdcIik7XHJcbiAgICAgICAgZ2FtZS5sb2FkLmltYWdlKFwiZmlzaG1hbl9iYWJ5XCIsIFwiLi4vLi4vcmVzb3VyY2UvZmlzaG1hbl9iYWJ5LnBuZ1wiKTtcclxuICAgICAgICBnYW1lLmxvYWQuaW1hZ2UoXCJmaXNobWFuX2JhYnlfZmlnaHRcIiwgXCIuLi8uLi9yZXNvdXJjZS9maXNobWFuX2JhYnlfZmlnaHQucG5nXCIpO1xyXG4gICAgICAgIGdhbWUubG9hZC5pbWFnZShcImZyZXNod2F0ZXJfY3JvY29kaWxlXCIsIFwiLi4vLi4vcmVzb3VyY2UvZnJlc2h3YXRlcl9jcm9jb2RpbGUucG5nXCIpO1xyXG4gICAgICAgIGdhbWUubG9hZC5pbWFnZShcImZyZXNod2F0ZXJfY3JvY29kaWxlX2ZpZ2h0XCIsIFwiLi4vLi4vcmVzb3VyY2UvZnJlc2h3YXRlcl9jcm9jb2RpbGVfZmlnaHQucG5nXCIpO1xyXG4gICAgICAgIGdhbWUubG9hZC5pbWFnZShcIm9ncmVcIiwgXCIuLi8uLi9yZXNvdXJjZS9vZ3JlLnBuZ1wiKTtcclxuICAgICAgICBnYW1lLmxvYWQuaW1hZ2UoXCJvZ3JlX2ZpZ2h0XCIsIFwiLi4vLi4vcmVzb3VyY2Uvb2dyZV9maWdodC5wbmdcIik7XHJcbiAgICAgICAgZ2FtZS5sb2FkLmltYWdlKFwicm9zZVwiLFwiLi4vLi4vcmVzb3VyY2Uvcm9zZS5wbmdcIik7XHJcbiAgICAgICAgZ2FtZS5sb2FkLmltYWdlKFwicm9zZV9maWdodFwiLFwiLi4vLi4vcmVzb3VyY2Uvcm9zZV9maWdodC5wbmdcIik7XHJcbiAgICAgICAgZ2FtZS5sb2FkLmltYWdlKFwidmVsb2NpcmFwdG9yXCIsXCIuLi8uLi9yZXNvdXJjZS92ZWxvY2lyYXB0b3IucG5nXCIpO1xyXG4gICAgICAgIGdhbWUubG9hZC5pbWFnZShcInZlbG9jaXJhcHRvcl9maWdodFwiLFwiLi4vLi4vcmVzb3VyY2UvdmVsb2NpcmFwdG9yX2ZpZ2h0LnBuZ1wiKTtcclxuXHJcbiAgICAgICAgLy8g5Y2V5Liq5paH5Lu25Yqg6L295a6M55qE5Zue6LCDXHJcbiAgICAgICAgZ2FtZS5sb2FkLm9uRmlsZUNvbXBsZXRlLmFkZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGxvYWRUZXh0LnNldFRleHQoXCJMb2FkaW5nIC4uLiBcIiArIGFyZ3VtZW50c1swXSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIOaJgOacieaWh+S7tuWKoOi9veWujOaIkOWbnuiwg1xyXG4gICAgICAgIGdhbWUubG9hZC5vbkxvYWRDb21wbGV0ZS5hZGQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBsb2FkVGV4dC5kZXN0cm95KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG4gICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8g5re75YqgdWnnlYzpnaJcclxuICAgICAgICB2YXIgdWkgPSBuZXcgVUlQYW5lbChnYW1lKTtcclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2FtZVNjZW5lO1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJaYmk3Z2JcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tb2R1bGVzXFxcXHNjZW5lc1xcXFxHYW1lU2NlbmUuanNcIixcIi9tb2R1bGVzXFxcXHNjZW5lc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qKlxyXG4gKiAg5ri45oiP57uT5p6c5Zy65pmvXHJcbiAqL1xyXG5cclxudmFyIERhdGFNYW5hZ2VyID0gcmVxdWlyZShcIi4uL2NsYXNzL0RhdGFNYW5hZ2VyXCIpO1xyXG5cclxuZnVuY3Rpb24gUmVzdWx0U2NlbmUoZ2FtZSkge1xyXG4gICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKERhdGFNYW5hZ2VyLnJlc3VsdCA9PSAwKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi5pWM5Lq66IOc5YipXCIpO1xyXG4gICAgICAgICAgICB2YXIgdGV4dCA9IGdhbWUuYWRkLnRleHQoZ2FtZS53b3JsZC5jZW50ZXJYLCBnYW1lLndvcmxkLmNlbnRlclksIFwiWW91IExvc3NcIiwge1xyXG4gICAgICAgICAgICAgICAgZmlsbDogXCIjMDAwXCIsXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGV4dC5hbmNob3Iuc2V0KDAuNSk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0ID0gZ2FtZS5hZGQudGV4dChnYW1lLndvcmxkLmNlbnRlclgsIGdhbWUud29ybGQuY2VudGVyWSwgXCJZb3UgV2luXCIsIHtcclxuICAgICAgICAgICAgICAgIGZpbGw6IFwiIzAwMFwiLFxyXG4gICAgICAgICAgICAgICAgZm9udFNpemU6IFwiMzBwdFwiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0ZXh0LmFuY2hvci5zZXQoMC41KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmVzdWx0U2NlbmU7XG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlpiaTdnYlwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL21vZHVsZXNcXFxcc2NlbmVzXFxcXFJlc3VsdFNjZW5lLmpzXCIsXCIvbW9kdWxlc1xcXFxzY2VuZXNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKipcclxuICog5ri45oiP5byA5aeL5Zy65pmvIFxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIFN0YXJ0U2NlbmUoZ2FtZSkge1xyXG4gICAgdGhpcy5wcmVsb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzdHlsZSA9IHtcclxuICAgICAgICAgICAgZmlsbDogXCIjMDAwXCIsXHJcbiAgICAgICAgICAgIGZvbnRTaXplOiBcIjMycHRcIlxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgdGV4dCA9IGdhbWUuYWRkLnRleHQoZ2FtZS53b3JsZC5jZW50ZXJYLCBnYW1lLndvcmxkLmNlbnRlclksIFwi5qyi6L+O5p2l5Yiw5oiR55qE54KJ55+z5Lyg6K+0XCIsIHN0eWxlKTtcclxuXHJcbiAgICAgICAgdGV4dC5hbmNob3Iuc2V0KDAuNSk7XHJcblxyXG4gICAgICAgIHZhciBzdGFydEJ1dHRvbiA9IGdhbWUuYWRkLnRleHQoZ2FtZS53b3JsZC5jZW50ZXJYLCBnYW1lLndvcmxkLmNlbnRlclkgKyA3MCwgXCLlvIDlp4vmuLjmiI9cIiwgeyBmaWxsOiBcIiMzMzNcIiwgZm9udFNpemU6IFwiMjRwdFwiIH0pO1xyXG5cclxuICAgICAgICBzdGFydEJ1dHRvbi5hbmNob3Iuc2V0KDAuNSk7XHJcblxyXG4gICAgICAgIHN0YXJ0QnV0dG9uLmlucHV0RW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgc3RhcnRCdXR0b24uZXZlbnRzLm9uSW5wdXREb3duLmFkZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGdhbWUuc3RhdGUuc3RhcnQoXCJHYW1lU2NlbmVcIik7XHJcbiAgICAgICAgfSx0aGlzKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTdGFydFNjZW5lO1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJaYmk3Z2JcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tb2R1bGVzXFxcXHNjZW5lc1xcXFxTdGFydFNjZW5lLmpzXCIsXCIvbW9kdWxlc1xcXFxzY2VuZXNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG52YXIgbG9va3VwID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nO1xuXG47KGZ1bmN0aW9uIChleHBvcnRzKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuICB2YXIgQXJyID0gKHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJylcbiAgICA/IFVpbnQ4QXJyYXlcbiAgICA6IEFycmF5XG5cblx0dmFyIFBMVVMgICA9ICcrJy5jaGFyQ29kZUF0KDApXG5cdHZhciBTTEFTSCAgPSAnLycuY2hhckNvZGVBdCgwKVxuXHR2YXIgTlVNQkVSID0gJzAnLmNoYXJDb2RlQXQoMClcblx0dmFyIExPV0VSICA9ICdhJy5jaGFyQ29kZUF0KDApXG5cdHZhciBVUFBFUiAgPSAnQScuY2hhckNvZGVBdCgwKVxuXHR2YXIgUExVU19VUkxfU0FGRSA9ICctJy5jaGFyQ29kZUF0KDApXG5cdHZhciBTTEFTSF9VUkxfU0FGRSA9ICdfJy5jaGFyQ29kZUF0KDApXG5cblx0ZnVuY3Rpb24gZGVjb2RlIChlbHQpIHtcblx0XHR2YXIgY29kZSA9IGVsdC5jaGFyQ29kZUF0KDApXG5cdFx0aWYgKGNvZGUgPT09IFBMVVMgfHxcblx0XHQgICAgY29kZSA9PT0gUExVU19VUkxfU0FGRSlcblx0XHRcdHJldHVybiA2MiAvLyAnKydcblx0XHRpZiAoY29kZSA9PT0gU0xBU0ggfHxcblx0XHQgICAgY29kZSA9PT0gU0xBU0hfVVJMX1NBRkUpXG5cdFx0XHRyZXR1cm4gNjMgLy8gJy8nXG5cdFx0aWYgKGNvZGUgPCBOVU1CRVIpXG5cdFx0XHRyZXR1cm4gLTEgLy9ubyBtYXRjaFxuXHRcdGlmIChjb2RlIDwgTlVNQkVSICsgMTApXG5cdFx0XHRyZXR1cm4gY29kZSAtIE5VTUJFUiArIDI2ICsgMjZcblx0XHRpZiAoY29kZSA8IFVQUEVSICsgMjYpXG5cdFx0XHRyZXR1cm4gY29kZSAtIFVQUEVSXG5cdFx0aWYgKGNvZGUgPCBMT1dFUiArIDI2KVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBMT1dFUiArIDI2XG5cdH1cblxuXHRmdW5jdGlvbiBiNjRUb0J5dGVBcnJheSAoYjY0KSB7XG5cdFx0dmFyIGksIGosIGwsIHRtcCwgcGxhY2VIb2xkZXJzLCBhcnJcblxuXHRcdGlmIChiNjQubGVuZ3RoICUgNCA+IDApIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCcpXG5cdFx0fVxuXG5cdFx0Ly8gdGhlIG51bWJlciBvZiBlcXVhbCBzaWducyAocGxhY2UgaG9sZGVycylcblx0XHQvLyBpZiB0aGVyZSBhcmUgdHdvIHBsYWNlaG9sZGVycywgdGhhbiB0aGUgdHdvIGNoYXJhY3RlcnMgYmVmb3JlIGl0XG5cdFx0Ly8gcmVwcmVzZW50IG9uZSBieXRlXG5cdFx0Ly8gaWYgdGhlcmUgaXMgb25seSBvbmUsIHRoZW4gdGhlIHRocmVlIGNoYXJhY3RlcnMgYmVmb3JlIGl0IHJlcHJlc2VudCAyIGJ5dGVzXG5cdFx0Ly8gdGhpcyBpcyBqdXN0IGEgY2hlYXAgaGFjayB0byBub3QgZG8gaW5kZXhPZiB0d2ljZVxuXHRcdHZhciBsZW4gPSBiNjQubGVuZ3RoXG5cdFx0cGxhY2VIb2xkZXJzID0gJz0nID09PSBiNjQuY2hhckF0KGxlbiAtIDIpID8gMiA6ICc9JyA9PT0gYjY0LmNoYXJBdChsZW4gLSAxKSA/IDEgOiAwXG5cblx0XHQvLyBiYXNlNjQgaXMgNC8zICsgdXAgdG8gdHdvIGNoYXJhY3RlcnMgb2YgdGhlIG9yaWdpbmFsIGRhdGFcblx0XHRhcnIgPSBuZXcgQXJyKGI2NC5sZW5ndGggKiAzIC8gNCAtIHBsYWNlSG9sZGVycylcblxuXHRcdC8vIGlmIHRoZXJlIGFyZSBwbGFjZWhvbGRlcnMsIG9ubHkgZ2V0IHVwIHRvIHRoZSBsYXN0IGNvbXBsZXRlIDQgY2hhcnNcblx0XHRsID0gcGxhY2VIb2xkZXJzID4gMCA/IGI2NC5sZW5ndGggLSA0IDogYjY0Lmxlbmd0aFxuXG5cdFx0dmFyIEwgPSAwXG5cblx0XHRmdW5jdGlvbiBwdXNoICh2KSB7XG5cdFx0XHRhcnJbTCsrXSA9IHZcblx0XHR9XG5cblx0XHRmb3IgKGkgPSAwLCBqID0gMDsgaSA8IGw7IGkgKz0gNCwgaiArPSAzKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDE4KSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpIDw8IDEyKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMikpIDw8IDYpIHwgZGVjb2RlKGI2NC5jaGFyQXQoaSArIDMpKVxuXHRcdFx0cHVzaCgodG1wICYgMHhGRjAwMDApID4+IDE2KVxuXHRcdFx0cHVzaCgodG1wICYgMHhGRjAwKSA+PiA4KVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH1cblxuXHRcdGlmIChwbGFjZUhvbGRlcnMgPT09IDIpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMikgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA+PiA0KVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH0gZWxzZSBpZiAocGxhY2VIb2xkZXJzID09PSAxKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDEwKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpIDw8IDQpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAyKSkgPj4gMilcblx0XHRcdHB1c2goKHRtcCA+PiA4KSAmIDB4RkYpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fVxuXG5cdFx0cmV0dXJuIGFyclxuXHR9XG5cblx0ZnVuY3Rpb24gdWludDhUb0Jhc2U2NCAodWludDgpIHtcblx0XHR2YXIgaSxcblx0XHRcdGV4dHJhQnl0ZXMgPSB1aW50OC5sZW5ndGggJSAzLCAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuXHRcdFx0b3V0cHV0ID0gXCJcIixcblx0XHRcdHRlbXAsIGxlbmd0aFxuXG5cdFx0ZnVuY3Rpb24gZW5jb2RlIChudW0pIHtcblx0XHRcdHJldHVybiBsb29rdXAuY2hhckF0KG51bSlcblx0XHR9XG5cblx0XHRmdW5jdGlvbiB0cmlwbGV0VG9CYXNlNjQgKG51bSkge1xuXHRcdFx0cmV0dXJuIGVuY29kZShudW0gPj4gMTggJiAweDNGKSArIGVuY29kZShudW0gPj4gMTIgJiAweDNGKSArIGVuY29kZShudW0gPj4gNiAmIDB4M0YpICsgZW5jb2RlKG51bSAmIDB4M0YpXG5cdFx0fVxuXG5cdFx0Ly8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuXHRcdGZvciAoaSA9IDAsIGxlbmd0aCA9IHVpbnQ4Lmxlbmd0aCAtIGV4dHJhQnl0ZXM7IGkgPCBsZW5ndGg7IGkgKz0gMykge1xuXHRcdFx0dGVtcCA9ICh1aW50OFtpXSA8PCAxNikgKyAodWludDhbaSArIDFdIDw8IDgpICsgKHVpbnQ4W2kgKyAyXSlcblx0XHRcdG91dHB1dCArPSB0cmlwbGV0VG9CYXNlNjQodGVtcClcblx0XHR9XG5cblx0XHQvLyBwYWQgdGhlIGVuZCB3aXRoIHplcm9zLCBidXQgbWFrZSBzdXJlIHRvIG5vdCBmb3JnZXQgdGhlIGV4dHJhIGJ5dGVzXG5cdFx0c3dpdGNoIChleHRyYUJ5dGVzKSB7XG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdHRlbXAgPSB1aW50OFt1aW50OC5sZW5ndGggLSAxXVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKHRlbXAgPj4gMilcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA8PCA0KSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSAnPT0nXG5cdFx0XHRcdGJyZWFrXG5cdFx0XHRjYXNlIDI6XG5cdFx0XHRcdHRlbXAgPSAodWludDhbdWludDgubGVuZ3RoIC0gMl0gPDwgOCkgKyAodWludDhbdWludDgubGVuZ3RoIC0gMV0pXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUodGVtcCA+PiAxMClcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA+PiA0KSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPDwgMikgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gJz0nXG5cdFx0XHRcdGJyZWFrXG5cdFx0fVxuXG5cdFx0cmV0dXJuIG91dHB1dFxuXHR9XG5cblx0ZXhwb3J0cy50b0J5dGVBcnJheSA9IGI2NFRvQnl0ZUFycmF5XG5cdGV4cG9ydHMuZnJvbUJ5dGVBcnJheSA9IHVpbnQ4VG9CYXNlNjRcbn0odHlwZW9mIGV4cG9ydHMgPT09ICd1bmRlZmluZWQnID8gKHRoaXMuYmFzZTY0anMgPSB7fSkgOiBleHBvcnRzKSlcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJaYmk3Z2JcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9ub2RlX21vZHVsZXNcXFxcYmFzZTY0LWpzXFxcXGxpYlxcXFxiNjQuanNcIixcIi9ub2RlX21vZHVsZXNcXFxcYmFzZTY0LWpzXFxcXGxpYlwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnByb2Nlc3MubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW5TZXRJbW1lZGlhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5zZXRJbW1lZGlhdGU7XG4gICAgdmFyIGNhblBvc3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgIDtcblxuICAgIGlmIChjYW5TZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiB3aW5kb3cuc2V0SW1tZWRpYXRlKGYpIH07XG4gICAgfVxuXG4gICAgaWYgKGNhblBvc3QpIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gZXYuc291cmNlO1xuICAgICAgICAgICAgaWYgKChzb3VyY2UgPT09IHdpbmRvdyB8fCBzb3VyY2UgPT09IG51bGwpICYmIGV2LmRhdGEgPT09ICdwcm9jZXNzLXRpY2snKSB7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gcXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICAgICAgcXVldWUucHVzaChmbik7XG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoJ3Byb2Nlc3MtdGljaycsICcqJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICAgIH07XG59KSgpO1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn1cblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlpiaTdnYlwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL25vZGVfbW9kdWxlc1xcXFxicm93c2VyaWZ5XFxcXG5vZGVfbW9kdWxlc1xcXFxwcm9jZXNzXFxcXGJyb3dzZXIuanNcIixcIi9ub2RlX21vZHVsZXNcXFxcYnJvd3NlcmlmeVxcXFxub2RlX21vZHVsZXNcXFxccHJvY2Vzc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cblxudmFyIGJhc2U2NCA9IHJlcXVpcmUoJ2Jhc2U2NC1qcycpXG52YXIgaWVlZTc1NCA9IHJlcXVpcmUoJ2llZWU3NTQnKVxuXG5leHBvcnRzLkJ1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5TbG93QnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTID0gNTBcbkJ1ZmZlci5wb29sU2l6ZSA9IDgxOTJcblxuLyoqXG4gKiBJZiBgQnVmZmVyLl91c2VUeXBlZEFycmF5c2A6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBVc2UgT2JqZWN0IGltcGxlbWVudGF0aW9uIChjb21wYXRpYmxlIGRvd24gdG8gSUU2KVxuICovXG5CdWZmZXIuX3VzZVR5cGVkQXJyYXlzID0gKGZ1bmN0aW9uICgpIHtcbiAgLy8gRGV0ZWN0IGlmIGJyb3dzZXIgc3VwcG9ydHMgVHlwZWQgQXJyYXlzLiBTdXBwb3J0ZWQgYnJvd3NlcnMgYXJlIElFIDEwKywgRmlyZWZveCA0KyxcbiAgLy8gQ2hyb21lIDcrLCBTYWZhcmkgNS4xKywgT3BlcmEgMTEuNissIGlPUyA0LjIrLiBJZiB0aGUgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGFkZGluZ1xuICAvLyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YCBpbnN0YW5jZXMsIHRoZW4gdGhhdCdzIHRoZSBzYW1lIGFzIG5vIGBVaW50OEFycmF5YCBzdXBwb3J0XG4gIC8vIGJlY2F1c2Ugd2UgbmVlZCB0byBiZSBhYmxlIHRvIGFkZCBhbGwgdGhlIG5vZGUgQnVmZmVyIEFQSSBtZXRob2RzLiBUaGlzIGlzIGFuIGlzc3VlXG4gIC8vIGluIEZpcmVmb3ggNC0yOS4gTm93IGZpeGVkOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02OTU0MzhcbiAgdHJ5IHtcbiAgICB2YXIgYnVmID0gbmV3IEFycmF5QnVmZmVyKDApXG4gICAgdmFyIGFyciA9IG5ldyBVaW50OEFycmF5KGJ1ZilcbiAgICBhcnIuZm9vID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gNDIgfVxuICAgIHJldHVybiA0MiA9PT0gYXJyLmZvbygpICYmXG4gICAgICAgIHR5cGVvZiBhcnIuc3ViYXJyYXkgPT09ICdmdW5jdGlvbicgLy8gQ2hyb21lIDktMTAgbGFjayBgc3ViYXJyYXlgXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufSkoKVxuXG4vKipcbiAqIENsYXNzOiBCdWZmZXJcbiAqID09PT09PT09PT09PT1cbiAqXG4gKiBUaGUgQnVmZmVyIGNvbnN0cnVjdG9yIHJldHVybnMgaW5zdGFuY2VzIG9mIGBVaW50OEFycmF5YCB0aGF0IGFyZSBhdWdtZW50ZWRcbiAqIHdpdGggZnVuY3Rpb24gcHJvcGVydGllcyBmb3IgYWxsIHRoZSBub2RlIGBCdWZmZXJgIEFQSSBmdW5jdGlvbnMuIFdlIHVzZVxuICogYFVpbnQ4QXJyYXlgIHNvIHRoYXQgc3F1YXJlIGJyYWNrZXQgbm90YXRpb24gd29ya3MgYXMgZXhwZWN0ZWQgLS0gaXQgcmV0dXJuc1xuICogYSBzaW5nbGUgb2N0ZXQuXG4gKlxuICogQnkgYXVnbWVudGluZyB0aGUgaW5zdGFuY2VzLCB3ZSBjYW4gYXZvaWQgbW9kaWZ5aW5nIHRoZSBgVWludDhBcnJheWBcbiAqIHByb3RvdHlwZS5cbiAqL1xuZnVuY3Rpb24gQnVmZmVyIChzdWJqZWN0LCBlbmNvZGluZywgbm9aZXJvKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBCdWZmZXIpKVxuICAgIHJldHVybiBuZXcgQnVmZmVyKHN1YmplY3QsIGVuY29kaW5nLCBub1plcm8pXG5cbiAgdmFyIHR5cGUgPSB0eXBlb2Ygc3ViamVjdFxuXG4gIC8vIFdvcmthcm91bmQ6IG5vZGUncyBiYXNlNjQgaW1wbGVtZW50YXRpb24gYWxsb3dzIGZvciBub24tcGFkZGVkIHN0cmluZ3NcbiAgLy8gd2hpbGUgYmFzZTY0LWpzIGRvZXMgbm90LlxuICBpZiAoZW5jb2RpbmcgPT09ICdiYXNlNjQnICYmIHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgc3ViamVjdCA9IHN0cmluZ3RyaW0oc3ViamVjdClcbiAgICB3aGlsZSAoc3ViamVjdC5sZW5ndGggJSA0ICE9PSAwKSB7XG4gICAgICBzdWJqZWN0ID0gc3ViamVjdCArICc9J1xuICAgIH1cbiAgfVxuXG4gIC8vIEZpbmQgdGhlIGxlbmd0aFxuICB2YXIgbGVuZ3RoXG4gIGlmICh0eXBlID09PSAnbnVtYmVyJylcbiAgICBsZW5ndGggPSBjb2VyY2Uoc3ViamVjdClcbiAgZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpXG4gICAgbGVuZ3RoID0gQnVmZmVyLmJ5dGVMZW5ndGgoc3ViamVjdCwgZW5jb2RpbmcpXG4gIGVsc2UgaWYgKHR5cGUgPT09ICdvYmplY3QnKVxuICAgIGxlbmd0aCA9IGNvZXJjZShzdWJqZWN0Lmxlbmd0aCkgLy8gYXNzdW1lIHRoYXQgb2JqZWN0IGlzIGFycmF5LWxpa2VcbiAgZWxzZVxuICAgIHRocm93IG5ldyBFcnJvcignRmlyc3QgYXJndW1lbnQgbmVlZHMgdG8gYmUgYSBudW1iZXIsIGFycmF5IG9yIHN0cmluZy4nKVxuXG4gIHZhciBidWZcbiAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICAvLyBQcmVmZXJyZWQ6IFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlIGZvciBiZXN0IHBlcmZvcm1hbmNlXG4gICAgYnVmID0gQnVmZmVyLl9hdWdtZW50KG5ldyBVaW50OEFycmF5KGxlbmd0aCkpXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBUSElTIGluc3RhbmNlIG9mIEJ1ZmZlciAoY3JlYXRlZCBieSBgbmV3YClcbiAgICBidWYgPSB0aGlzXG4gICAgYnVmLmxlbmd0aCA9IGxlbmd0aFxuICAgIGJ1Zi5faXNCdWZmZXIgPSB0cnVlXG4gIH1cblxuICB2YXIgaVxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cyAmJiB0eXBlb2Ygc3ViamVjdC5ieXRlTGVuZ3RoID09PSAnbnVtYmVyJykge1xuICAgIC8vIFNwZWVkIG9wdGltaXphdGlvbiAtLSB1c2Ugc2V0IGlmIHdlJ3JlIGNvcHlpbmcgZnJvbSBhIHR5cGVkIGFycmF5XG4gICAgYnVmLl9zZXQoc3ViamVjdClcbiAgfSBlbHNlIGlmIChpc0FycmF5aXNoKHN1YmplY3QpKSB7XG4gICAgLy8gVHJlYXQgYXJyYXktaXNoIG9iamVjdHMgYXMgYSBieXRlIGFycmF5XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoQnVmZmVyLmlzQnVmZmVyKHN1YmplY3QpKVxuICAgICAgICBidWZbaV0gPSBzdWJqZWN0LnJlYWRVSW50OChpKVxuICAgICAgZWxzZVxuICAgICAgICBidWZbaV0gPSBzdWJqZWN0W2ldXG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgYnVmLndyaXRlKHN1YmplY3QsIDAsIGVuY29kaW5nKVxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdudW1iZXInICYmICFCdWZmZXIuX3VzZVR5cGVkQXJyYXlzICYmICFub1plcm8pIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGJ1ZltpXSA9IDBcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnVmXG59XG5cbi8vIFNUQVRJQyBNRVRIT0RTXG4vLyA9PT09PT09PT09PT09PVxuXG5CdWZmZXIuaXNFbmNvZGluZyA9IGZ1bmN0aW9uIChlbmNvZGluZykge1xuICBzd2l0Y2ggKFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgY2FzZSAncmF3JzpcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuQnVmZmVyLmlzQnVmZmVyID0gZnVuY3Rpb24gKGIpIHtcbiAgcmV0dXJuICEhKGIgIT09IG51bGwgJiYgYiAhPT0gdW5kZWZpbmVkICYmIGIuX2lzQnVmZmVyKVxufVxuXG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGZ1bmN0aW9uIChzdHIsIGVuY29kaW5nKSB7XG4gIHZhciByZXRcbiAgc3RyID0gc3RyICsgJydcbiAgc3dpdGNoIChlbmNvZGluZyB8fCAndXRmOCcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aCAvIDJcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gdXRmOFRvQnl0ZXMoc3RyKS5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAncmF3JzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IGJhc2U2NFRvQnl0ZXMoc3RyKS5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGggKiAyXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLmNvbmNhdCA9IGZ1bmN0aW9uIChsaXN0LCB0b3RhbExlbmd0aCkge1xuICBhc3NlcnQoaXNBcnJheShsaXN0KSwgJ1VzYWdlOiBCdWZmZXIuY29uY2F0KGxpc3QsIFt0b3RhbExlbmd0aF0pXFxuJyArXG4gICAgICAnbGlzdCBzaG91bGQgYmUgYW4gQXJyYXkuJylcblxuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcigwKVxuICB9IGVsc2UgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGxpc3RbMF1cbiAgfVxuXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdG90YWxMZW5ndGggIT09ICdudW1iZXInKSB7XG4gICAgdG90YWxMZW5ndGggPSAwXG4gICAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRvdGFsTGVuZ3RoICs9IGxpc3RbaV0ubGVuZ3RoXG4gICAgfVxuICB9XG5cbiAgdmFyIGJ1ZiA9IG5ldyBCdWZmZXIodG90YWxMZW5ndGgpXG4gIHZhciBwb3MgPSAwXG4gIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldXG4gICAgaXRlbS5jb3B5KGJ1ZiwgcG9zKVxuICAgIHBvcyArPSBpdGVtLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZcbn1cblxuLy8gQlVGRkVSIElOU1RBTkNFIE1FVEhPRFNcbi8vID09PT09PT09PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIF9oZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuXG4gIC8vIG11c3QgYmUgYW4gZXZlbiBudW1iZXIgb2YgZGlnaXRzXG4gIHZhciBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGFzc2VydChzdHJMZW4gJSAyID09PSAwLCAnSW52YWxpZCBoZXggc3RyaW5nJylcblxuICBpZiAobGVuZ3RoID4gc3RyTGVuIC8gMikge1xuICAgIGxlbmd0aCA9IHN0ckxlbiAvIDJcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGJ5dGUgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgYXNzZXJ0KCFpc05hTihieXRlKSwgJ0ludmFsaWQgaGV4IHN0cmluZycpXG4gICAgYnVmW29mZnNldCArIGldID0gYnl0ZVxuICB9XG4gIEJ1ZmZlci5fY2hhcnNXcml0dGVuID0gaSAqIDJcbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gX3V0ZjhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF9hc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF9iaW5hcnlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBfYXNjaWlXcml0ZShidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIF9iYXNlNjRXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX3V0ZjE2bGVXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcih1dGYxNmxlVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gU3VwcG9ydCBib3RoIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZylcbiAgLy8gYW5kIHRoZSBsZWdhY3kgKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIGlmICghaXNGaW5pdGUobGVuZ3RoKSkge1xuICAgICAgZW5jb2RpbmcgPSBsZW5ndGhcbiAgICAgIGxlbmd0aCA9IHVuZGVmaW5lZFxuICAgIH1cbiAgfSBlbHNlIHsgIC8vIGxlZ2FjeVxuICAgIHZhciBzd2FwID0gZW5jb2RpbmdcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIG9mZnNldCA9IGxlbmd0aFxuICAgIGxlbmd0aCA9IHN3YXBcbiAgfVxuXG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpXG5cbiAgdmFyIHJldFxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IF9oZXhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSBfdXRmOFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIHJldCA9IF9hc2NpaVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXQgPSBfYmluYXJ5V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IF9iYXNlNjRXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gX3V0ZjE2bGVXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpXG4gIHN0YXJ0ID0gTnVtYmVyKHN0YXJ0KSB8fCAwXG4gIGVuZCA9IChlbmQgIT09IHVuZGVmaW5lZClcbiAgICA/IE51bWJlcihlbmQpXG4gICAgOiBlbmQgPSBzZWxmLmxlbmd0aFxuXG4gIC8vIEZhc3RwYXRoIGVtcHR5IHN0cmluZ3NcbiAgaWYgKGVuZCA9PT0gc3RhcnQpXG4gICAgcmV0dXJuICcnXG5cbiAgdmFyIHJldFxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IF9oZXhTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSBfdXRmOFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIHJldCA9IF9hc2NpaVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXQgPSBfYmluYXJ5U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IF9iYXNlNjRTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gX3V0ZjE2bGVTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uICh0YXJnZXQsIHRhcmdldF9zdGFydCwgc3RhcnQsIGVuZCkge1xuICB2YXIgc291cmNlID0gdGhpc1xuXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCAmJiBlbmQgIT09IDApIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICghdGFyZ2V0X3N0YXJ0KSB0YXJnZXRfc3RhcnQgPSAwXG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm5cbiAgaWYgKHRhcmdldC5sZW5ndGggPT09IDAgfHwgc291cmNlLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgLy8gRmF0YWwgZXJyb3IgY29uZGl0aW9uc1xuICBhc3NlcnQoZW5kID49IHN0YXJ0LCAnc291cmNlRW5kIDwgc291cmNlU3RhcnQnKVxuICBhc3NlcnQodGFyZ2V0X3N0YXJ0ID49IDAgJiYgdGFyZ2V0X3N0YXJ0IDwgdGFyZ2V0Lmxlbmd0aCxcbiAgICAgICd0YXJnZXRTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KHN0YXJ0ID49IDAgJiYgc3RhcnQgPCBzb3VyY2UubGVuZ3RoLCAnc291cmNlU3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChlbmQgPj0gMCAmJiBlbmQgPD0gc291cmNlLmxlbmd0aCwgJ3NvdXJjZUVuZCBvdXQgb2YgYm91bmRzJylcblxuICAvLyBBcmUgd2Ugb29iP1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpXG4gICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgPCBlbmQgLSBzdGFydClcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0X3N0YXJ0ICsgc3RhcnRcblxuICB2YXIgbGVuID0gZW5kIC0gc3RhcnRcblxuICBpZiAobGVuIDwgMTAwIHx8ICFCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0X3N0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICB9IGVsc2Uge1xuICAgIHRhcmdldC5fc2V0KHRoaXMuc3ViYXJyYXkoc3RhcnQsIHN0YXJ0ICsgbGVuKSwgdGFyZ2V0X3N0YXJ0KVxuICB9XG59XG5cbmZ1bmN0aW9uIF9iYXNlNjRTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGlmIChzdGFydCA9PT0gMCAmJiBlbmQgPT09IGJ1Zi5sZW5ndGgpIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYuc2xpY2Uoc3RhcnQsIGVuZCkpXG4gIH1cbn1cblxuZnVuY3Rpb24gX3V0ZjhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXMgPSAnJ1xuICB2YXIgdG1wID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgaWYgKGJ1ZltpXSA8PSAweDdGKSB7XG4gICAgICByZXMgKz0gZGVjb2RlVXRmOENoYXIodG1wKSArIFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICAgICAgdG1wID0gJydcbiAgICB9IGVsc2Uge1xuICAgICAgdG1wICs9ICclJyArIGJ1ZltpXS50b1N0cmluZygxNilcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzICsgZGVjb2RlVXRmOENoYXIodG1wKVxufVxuXG5mdW5jdGlvbiBfYXNjaWlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspXG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIF9iaW5hcnlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHJldHVybiBfYXNjaWlTbGljZShidWYsIHN0YXJ0LCBlbmQpXG59XG5cbmZ1bmN0aW9uIF9oZXhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG5cbiAgaWYgKCFzdGFydCB8fCBzdGFydCA8IDApIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCB8fCBlbmQgPCAwIHx8IGVuZCA+IGxlbikgZW5kID0gbGVuXG5cbiAgdmFyIG91dCA9ICcnXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgb3V0ICs9IHRvSGV4KGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIF91dGYxNmxlU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgYnl0ZXMgPSBidWYuc2xpY2Uoc3RhcnQsIGVuZClcbiAgdmFyIHJlcyA9ICcnXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSArIGJ5dGVzW2krMV0gKiAyNTYpXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIHN0YXJ0ID0gY2xhbXAoc3RhcnQsIGxlbiwgMClcbiAgZW5kID0gY2xhbXAoZW5kLCBsZW4sIGxlbilcblxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIHJldHVybiBCdWZmZXIuX2F1Z21lbnQodGhpcy5zdWJhcnJheShzdGFydCwgZW5kKSlcbiAgfSBlbHNlIHtcbiAgICB2YXIgc2xpY2VMZW4gPSBlbmQgLSBzdGFydFxuICAgIHZhciBuZXdCdWYgPSBuZXcgQnVmZmVyKHNsaWNlTGVuLCB1bmRlZmluZWQsIHRydWUpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGljZUxlbjsgaSsrKSB7XG4gICAgICBuZXdCdWZbaV0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gICAgcmV0dXJuIG5ld0J1ZlxuICB9XG59XG5cbi8vIGBnZXRgIHdpbGwgYmUgcmVtb3ZlZCBpbiBOb2RlIDAuMTMrXG5CdWZmZXIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChvZmZzZXQpIHtcbiAgY29uc29sZS5sb2coJy5nZXQoKSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdXNpbmcgYXJyYXkgaW5kZXhlcyBpbnN0ZWFkLicpXG4gIHJldHVybiB0aGlzLnJlYWRVSW50OChvZmZzZXQpXG59XG5cbi8vIGBzZXRgIHdpbGwgYmUgcmVtb3ZlZCBpbiBOb2RlIDAuMTMrXG5CdWZmZXIucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uICh2LCBvZmZzZXQpIHtcbiAgY29uc29sZS5sb2coJy5zZXQoKSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdXNpbmcgYXJyYXkgaW5kZXhlcyBpbnN0ZWFkLicpXG4gIHJldHVybiB0aGlzLndyaXRlVUludDgodiwgb2Zmc2V0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5mdW5jdGlvbiBfcmVhZFVJbnQxNiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWxcbiAgaWYgKGxpdHRsZUVuZGlhbikge1xuICAgIHZhbCA9IGJ1ZltvZmZzZXRdXG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdIDw8IDhcbiAgfSBlbHNlIHtcbiAgICB2YWwgPSBidWZbb2Zmc2V0XSA8PCA4XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdXG4gIH1cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQxNih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQxNih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRVSW50MzIgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsXG4gIGlmIChsaXR0bGVFbmRpYW4pIHtcbiAgICBpZiAob2Zmc2V0ICsgMiA8IGxlbilcbiAgICAgIHZhbCA9IGJ1ZltvZmZzZXQgKyAyXSA8PCAxNlxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXSA8PCA4XG4gICAgdmFsIHw9IGJ1ZltvZmZzZXRdXG4gICAgaWYgKG9mZnNldCArIDMgPCBsZW4pXG4gICAgICB2YWwgPSB2YWwgKyAoYnVmW29mZnNldCArIDNdIDw8IDI0ID4+PiAwKVxuICB9IGVsc2Uge1xuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsID0gYnVmW29mZnNldCArIDFdIDw8IDE2XG4gICAgaWYgKG9mZnNldCArIDIgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDJdIDw8IDhcbiAgICBpZiAob2Zmc2V0ICsgMyA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgM11cbiAgICB2YWwgPSB2YWwgKyAoYnVmW29mZnNldF0gPDwgMjQgPj4+IDApXG4gIH1cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQzMih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50OCA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgdmFyIG5lZyA9IHRoaXNbb2Zmc2V0XSAmIDB4ODBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmYgLSB0aGlzW29mZnNldF0gKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbmZ1bmN0aW9uIF9yZWFkSW50MTYgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsID0gX3JlYWRVSW50MTYoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgdHJ1ZSlcbiAgdmFyIG5lZyA9IHZhbCAmIDB4ODAwMFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZmZmIC0gdmFsICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MTYodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDE2KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZEludDMyIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbCA9IF9yZWFkVUludDMyKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIHRydWUpXG4gIHZhciBuZWcgPSB2YWwgJiAweDgwMDAwMDAwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmZmZmZmZmIC0gdmFsICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MzIodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZEZsb2F0IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHJldHVybiBpZWVlNzU0LnJlYWQoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRmxvYXQodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkRG91YmxlIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgKyA3IDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHJldHVybiBpZWVlNzU0LnJlYWQoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRG91YmxlKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRG91YmxlKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDggPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZilcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpIHJldHVyblxuXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlXG59XG5cbmZ1bmN0aW9uIF93cml0ZVVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmZmYpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGxlbiAtIG9mZnNldCwgMik7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPVxuICAgICAgICAodmFsdWUgJiAoMHhmZiA8PCAoOCAqIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpKSkpID4+PlxuICAgICAgICAgICAgKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkgKiA4XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZVVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmZmZmZmZmKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihsZW4gLSBvZmZzZXQsIDQpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID1cbiAgICAgICAgKHZhbHVlID4+PiAobGl0dGxlRW5kaWFuID8gaSA6IDMgLSBpKSAqIDgpICYgMHhmZlxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmLCAtMHg4MClcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgdGhpcy53cml0ZVVJbnQ4KHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgdGhpcy53cml0ZVVJbnQ4KDB4ZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2ZmZiwgLTB4ODAwMClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIF93cml0ZVVJbnQxNihidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICBfd3JpdGVVSW50MTYoYnVmLCAweGZmZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICBfd3JpdGVVSW50MzIoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgX3dyaXRlVUludDMyKGJ1ZiwgMHhmZmZmZmZmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVGbG9hdCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAzLjQwMjgyMzQ2NjM4NTI4ODZlKzM4LCAtMy40MDI4MjM0NjYzODUyODg2ZSszOClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVEb3VibGUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgNyA8IGJ1Zi5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmSUVFRTc1NCh2YWx1ZSwgMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgsIC0xLjc5NzY5MzEzNDg2MjMxNTdFKzMwOClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuLy8gZmlsbCh2YWx1ZSwgc3RhcnQ9MCwgZW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiAodmFsdWUsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCF2YWx1ZSkgdmFsdWUgPSAwXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCkgZW5kID0gdGhpcy5sZW5ndGhcblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHZhbHVlID0gdmFsdWUuY2hhckNvZGVBdCgwKVxuICB9XG5cbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgIWlzTmFOKHZhbHVlKSwgJ3ZhbHVlIGlzIG5vdCBhIG51bWJlcicpXG4gIGFzc2VydChlbmQgPj0gc3RhcnQsICdlbmQgPCBzdGFydCcpXG5cbiAgLy8gRmlsbCAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm5cbiAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICBhc3NlcnQoc3RhcnQgPj0gMCAmJiBzdGFydCA8IHRoaXMubGVuZ3RoLCAnc3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChlbmQgPj0gMCAmJiBlbmQgPD0gdGhpcy5sZW5ndGgsICdlbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICB0aGlzW2ldID0gdmFsdWVcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBvdXQgPSBbXVxuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIG91dFtpXSA9IHRvSGV4KHRoaXNbaV0pXG4gICAgaWYgKGkgPT09IGV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMpIHtcbiAgICAgIG91dFtpICsgMV0gPSAnLi4uJ1xuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBvdXQuam9pbignICcpICsgJz4nXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBgQXJyYXlCdWZmZXJgIHdpdGggdGhlICpjb3BpZWQqIG1lbW9yeSBvZiB0aGUgYnVmZmVyIGluc3RhbmNlLlxuICogQWRkZWQgaW4gTm9kZSAwLjEyLiBPbmx5IGF2YWlsYWJsZSBpbiBicm93c2VycyB0aGF0IHN1cHBvcnQgQXJyYXlCdWZmZXIuXG4gKi9cbkJ1ZmZlci5wcm90b3R5cGUudG9BcnJheUJ1ZmZlciA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgICByZXR1cm4gKG5ldyBCdWZmZXIodGhpcykpLmJ1ZmZlclxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYnVmID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5sZW5ndGgpXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYnVmLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKVxuICAgICAgICBidWZbaV0gPSB0aGlzW2ldXG4gICAgICByZXR1cm4gYnVmLmJ1ZmZlclxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0J1ZmZlci50b0FycmF5QnVmZmVyIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyJylcbiAgfVxufVxuXG4vLyBIRUxQRVIgRlVOQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIHN0cmluZ3RyaW0gKHN0cikge1xuICBpZiAoc3RyLnRyaW0pIHJldHVybiBzdHIudHJpbSgpXG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG59XG5cbnZhciBCUCA9IEJ1ZmZlci5wcm90b3R5cGVcblxuLyoqXG4gKiBBdWdtZW50IGEgVWludDhBcnJheSAqaW5zdGFuY2UqIChub3QgdGhlIFVpbnQ4QXJyYXkgY2xhc3MhKSB3aXRoIEJ1ZmZlciBtZXRob2RzXG4gKi9cbkJ1ZmZlci5fYXVnbWVudCA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgYXJyLl9pc0J1ZmZlciA9IHRydWVcblxuICAvLyBzYXZlIHJlZmVyZW5jZSB0byBvcmlnaW5hbCBVaW50OEFycmF5IGdldC9zZXQgbWV0aG9kcyBiZWZvcmUgb3ZlcndyaXRpbmdcbiAgYXJyLl9nZXQgPSBhcnIuZ2V0XG4gIGFyci5fc2V0ID0gYXJyLnNldFxuXG4gIC8vIGRlcHJlY2F0ZWQsIHdpbGwgYmUgcmVtb3ZlZCBpbiBub2RlIDAuMTMrXG4gIGFyci5nZXQgPSBCUC5nZXRcbiAgYXJyLnNldCA9IEJQLnNldFxuXG4gIGFyci53cml0ZSA9IEJQLndyaXRlXG4gIGFyci50b1N0cmluZyA9IEJQLnRvU3RyaW5nXG4gIGFyci50b0xvY2FsZVN0cmluZyA9IEJQLnRvU3RyaW5nXG4gIGFyci50b0pTT04gPSBCUC50b0pTT05cbiAgYXJyLmNvcHkgPSBCUC5jb3B5XG4gIGFyci5zbGljZSA9IEJQLnNsaWNlXG4gIGFyci5yZWFkVUludDggPSBCUC5yZWFkVUludDhcbiAgYXJyLnJlYWRVSW50MTZMRSA9IEJQLnJlYWRVSW50MTZMRVxuICBhcnIucmVhZFVJbnQxNkJFID0gQlAucmVhZFVJbnQxNkJFXG4gIGFyci5yZWFkVUludDMyTEUgPSBCUC5yZWFkVUludDMyTEVcbiAgYXJyLnJlYWRVSW50MzJCRSA9IEJQLnJlYWRVSW50MzJCRVxuICBhcnIucmVhZEludDggPSBCUC5yZWFkSW50OFxuICBhcnIucmVhZEludDE2TEUgPSBCUC5yZWFkSW50MTZMRVxuICBhcnIucmVhZEludDE2QkUgPSBCUC5yZWFkSW50MTZCRVxuICBhcnIucmVhZEludDMyTEUgPSBCUC5yZWFkSW50MzJMRVxuICBhcnIucmVhZEludDMyQkUgPSBCUC5yZWFkSW50MzJCRVxuICBhcnIucmVhZEZsb2F0TEUgPSBCUC5yZWFkRmxvYXRMRVxuICBhcnIucmVhZEZsb2F0QkUgPSBCUC5yZWFkRmxvYXRCRVxuICBhcnIucmVhZERvdWJsZUxFID0gQlAucmVhZERvdWJsZUxFXG4gIGFyci5yZWFkRG91YmxlQkUgPSBCUC5yZWFkRG91YmxlQkVcbiAgYXJyLndyaXRlVUludDggPSBCUC53cml0ZVVJbnQ4XG4gIGFyci53cml0ZVVJbnQxNkxFID0gQlAud3JpdGVVSW50MTZMRVxuICBhcnIud3JpdGVVSW50MTZCRSA9IEJQLndyaXRlVUludDE2QkVcbiAgYXJyLndyaXRlVUludDMyTEUgPSBCUC53cml0ZVVJbnQzMkxFXG4gIGFyci53cml0ZVVJbnQzMkJFID0gQlAud3JpdGVVSW50MzJCRVxuICBhcnIud3JpdGVJbnQ4ID0gQlAud3JpdGVJbnQ4XG4gIGFyci53cml0ZUludDE2TEUgPSBCUC53cml0ZUludDE2TEVcbiAgYXJyLndyaXRlSW50MTZCRSA9IEJQLndyaXRlSW50MTZCRVxuICBhcnIud3JpdGVJbnQzMkxFID0gQlAud3JpdGVJbnQzMkxFXG4gIGFyci53cml0ZUludDMyQkUgPSBCUC53cml0ZUludDMyQkVcbiAgYXJyLndyaXRlRmxvYXRMRSA9IEJQLndyaXRlRmxvYXRMRVxuICBhcnIud3JpdGVGbG9hdEJFID0gQlAud3JpdGVGbG9hdEJFXG4gIGFyci53cml0ZURvdWJsZUxFID0gQlAud3JpdGVEb3VibGVMRVxuICBhcnIud3JpdGVEb3VibGVCRSA9IEJQLndyaXRlRG91YmxlQkVcbiAgYXJyLmZpbGwgPSBCUC5maWxsXG4gIGFyci5pbnNwZWN0ID0gQlAuaW5zcGVjdFxuICBhcnIudG9BcnJheUJ1ZmZlciA9IEJQLnRvQXJyYXlCdWZmZXJcblxuICByZXR1cm4gYXJyXG59XG5cbi8vIHNsaWNlKHN0YXJ0LCBlbmQpXG5mdW5jdGlvbiBjbGFtcCAoaW5kZXgsIGxlbiwgZGVmYXVsdFZhbHVlKSB7XG4gIGlmICh0eXBlb2YgaW5kZXggIT09ICdudW1iZXInKSByZXR1cm4gZGVmYXVsdFZhbHVlXG4gIGluZGV4ID0gfn5pbmRleDsgIC8vIENvZXJjZSB0byBpbnRlZ2VyLlxuICBpZiAoaW5kZXggPj0gbGVuKSByZXR1cm4gbGVuXG4gIGlmIChpbmRleCA+PSAwKSByZXR1cm4gaW5kZXhcbiAgaW5kZXggKz0gbGVuXG4gIGlmIChpbmRleCA+PSAwKSByZXR1cm4gaW5kZXhcbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gY29lcmNlIChsZW5ndGgpIHtcbiAgLy8gQ29lcmNlIGxlbmd0aCB0byBhIG51bWJlciAocG9zc2libHkgTmFOKSwgcm91bmQgdXBcbiAgLy8gaW4gY2FzZSBpdCdzIGZyYWN0aW9uYWwgKGUuZy4gMTIzLjQ1NikgdGhlbiBkbyBhXG4gIC8vIGRvdWJsZSBuZWdhdGUgdG8gY29lcmNlIGEgTmFOIHRvIDAuIEVhc3ksIHJpZ2h0P1xuICBsZW5ndGggPSB+fk1hdGguY2VpbCgrbGVuZ3RoKVxuICByZXR1cm4gbGVuZ3RoIDwgMCA/IDAgOiBsZW5ndGhcbn1cblxuZnVuY3Rpb24gaXNBcnJheSAoc3ViamVjdCkge1xuICByZXR1cm4gKEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHN1YmplY3QpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHN1YmplY3QpID09PSAnW29iamVjdCBBcnJheV0nXG4gIH0pKHN1YmplY3QpXG59XG5cbmZ1bmN0aW9uIGlzQXJyYXlpc2ggKHN1YmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXkoc3ViamVjdCkgfHwgQnVmZmVyLmlzQnVmZmVyKHN1YmplY3QpIHx8XG4gICAgICBzdWJqZWN0ICYmIHR5cGVvZiBzdWJqZWN0ID09PSAnb2JqZWN0JyAmJlxuICAgICAgdHlwZW9mIHN1YmplY3QubGVuZ3RoID09PSAnbnVtYmVyJ1xufVxuXG5mdW5jdGlvbiB0b0hleCAobikge1xuICBpZiAobiA8IDE2KSByZXR1cm4gJzAnICsgbi50b1N0cmluZygxNilcbiAgcmV0dXJuIG4udG9TdHJpbmcoMTYpXG59XG5cbmZ1bmN0aW9uIHV0ZjhUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGIgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGlmIChiIDw9IDB4N0YpXG4gICAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSlcbiAgICBlbHNlIHtcbiAgICAgIHZhciBzdGFydCA9IGlcbiAgICAgIGlmIChiID49IDB4RDgwMCAmJiBiIDw9IDB4REZGRikgaSsrXG4gICAgICB2YXIgaCA9IGVuY29kZVVSSUNvbXBvbmVudChzdHIuc2xpY2Uoc3RhcnQsIGkrMSkpLnN1YnN0cigxKS5zcGxpdCgnJScpXG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGgubGVuZ3RoOyBqKyspXG4gICAgICAgIGJ5dGVBcnJheS5wdXNoKHBhcnNlSW50KGhbal0sIDE2KSlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiB1dGYxNmxlVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBjLCBoaSwgbG9cbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaGkgPSBjID4+IDhcbiAgICBsbyA9IGMgJSAyNTZcbiAgICBieXRlQXJyYXkucHVzaChsbylcbiAgICBieXRlQXJyYXkucHVzaChoaSlcbiAgfVxuXG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYmFzZTY0VG9CeXRlcyAoc3RyKSB7XG4gIHJldHVybiBiYXNlNjQudG9CeXRlQXJyYXkoc3RyKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIHBvc1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKChpICsgb2Zmc2V0ID49IGRzdC5sZW5ndGgpIHx8IChpID49IHNyYy5sZW5ndGgpKVxuICAgICAgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBkZWNvZGVVdGY4Q2hhciAoc3RyKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChzdHIpXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4RkZGRCkgLy8gVVRGIDggaW52YWxpZCBjaGFyXG4gIH1cbn1cblxuLypcbiAqIFdlIGhhdmUgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIHZhbHVlIGlzIGEgdmFsaWQgaW50ZWdlci4gVGhpcyBtZWFucyB0aGF0IGl0XG4gKiBpcyBub24tbmVnYXRpdmUuIEl0IGhhcyBubyBmcmFjdGlvbmFsIGNvbXBvbmVudCBhbmQgdGhhdCBpdCBkb2VzIG5vdFxuICogZXhjZWVkIHRoZSBtYXhpbXVtIGFsbG93ZWQgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHZlcmlmdWludCAodmFsdWUsIG1heCkge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPj0gMCwgJ3NwZWNpZmllZCBhIG5lZ2F0aXZlIHZhbHVlIGZvciB3cml0aW5nIGFuIHVuc2lnbmVkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGlzIGxhcmdlciB0aGFuIG1heGltdW0gdmFsdWUgZm9yIHR5cGUnKVxuICBhc3NlcnQoTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlLCAndmFsdWUgaGFzIGEgZnJhY3Rpb25hbCBjb21wb25lbnQnKVxufVxuXG5mdW5jdGlvbiB2ZXJpZnNpbnQgKHZhbHVlLCBtYXgsIG1pbikge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgbGFyZ2VyIHRoYW4gbWF4aW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlID49IG1pbiwgJ3ZhbHVlIHNtYWxsZXIgdGhhbiBtaW5pbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQoTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlLCAndmFsdWUgaGFzIGEgZnJhY3Rpb25hbCBjb21wb25lbnQnKVxufVxuXG5mdW5jdGlvbiB2ZXJpZklFRUU3NTQgKHZhbHVlLCBtYXgsIG1pbikge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgbGFyZ2VyIHRoYW4gbWF4aW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlID49IG1pbiwgJ3ZhbHVlIHNtYWxsZXIgdGhhbiBtaW5pbXVtIGFsbG93ZWQgdmFsdWUnKVxufVxuXG5mdW5jdGlvbiBhc3NlcnQgKHRlc3QsIG1lc3NhZ2UpIHtcbiAgaWYgKCF0ZXN0KSB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSB8fCAnRmFpbGVkIGFzc2VydGlvbicpXG59XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiWmJpN2diXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbm9kZV9tb2R1bGVzXFxcXGJ1ZmZlclxcXFxpbmRleC5qc1wiLFwiL25vZGVfbW9kdWxlc1xcXFxidWZmZXJcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5leHBvcnRzLnJlYWQgPSBmdW5jdGlvbiAoYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbVxuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIG5CaXRzID0gLTdcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxuICB2YXIgZCA9IGlzTEUgPyAtMSA6IDFcbiAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV1cblxuICBpICs9IGRcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBzID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBlTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSBlICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgZSA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gbUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gbSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhc1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pXG4gICAgZSA9IGUgLSBlQmlhc1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pXG59XG5cbmV4cG9ydHMud3JpdGUgPSBmdW5jdGlvbiAoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGNcbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMClcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxuICB2YXIgZCA9IGlzTEUgPyAxIDogLTFcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICh2YWx1ZSAqIGMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gZSArIGVCaWFzXG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IDBcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KSB7fVxuXG4gIGUgPSAoZSA8PCBtTGVuKSB8IG1cbiAgZUxlbiArPSBtTGVuXG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCkge31cblxuICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjhcbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJaYmk3Z2JcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9ub2RlX21vZHVsZXNcXFxcaWVlZTc1NFxcXFxpbmRleC5qc1wiLFwiL25vZGVfbW9kdWxlc1xcXFxpZWVlNzU0XCIpIl19
