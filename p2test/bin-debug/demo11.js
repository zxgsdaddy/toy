var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var Main1 = (function (_super) {
    __extends(Main1, _super);
    function Main1() {
        var _this = _super.call(this) || this;
        _this.types = ["box", "circle", "capsule", "line", "particle"];
        _this.once(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main1.prototype.onAddToStage = function () {
        this.addEventListener(egret.Event.ENTER_FRAME, this.loop, this);
        //鼠标点击添加刚体
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.addOneBox, this);
        this.createWorld();
        this.createGround();
        this.createBodies();
        this.createDebug();
    };
    Main1.prototype.createWorld = function () {
        var wrd = new p2.World();
        wrd.sleepMode = p2.World.BODY_SLEEPING;
        wrd.gravity = [0, 10];
        this.world = wrd;
    };
    Main1.prototype.createGround = function () {
        var stageHeight = egret.MainContext.instance.stage.stageHeight;
        var groundShape = new p2.Plane();
        var groundBody = new p2.Body();
        groundBody.position[1] = stageHeight - 100;
        groundBody.angle = Math.PI;
        groundBody.addShape(groundShape);
        this.world.addBody(groundBody);
    };
    Main1.prototype.createBodies = function () {
        //var boxShape: p2.Shape = new p2.Rectangle(100, 50);
        var boxShape = new p2.Box({ width: 100, height: 50 });
        var boxBody = new p2.Body({ mass: 1, position: [200, 200] });
        boxBody.addShape(boxShape);
        this.world.addBody(boxBody);
        //var boxShape: p2.Shape = new p2.Rectangle(50, 50);
        var boxShape = new p2.Box({ width: 50, height: 50 });
        var boxBody = new p2.Body({ mass: 1, position: [200, 180], angularVelocity: 1 });
        boxBody.addShape(boxShape);
        this.world.addBody(boxBody);
    };
    Main1.prototype.createDebug = function () {
        //创建调试试图
        this.debugDraw = new p2DebugDraw(this.world);
        var sprite = new egret.Sprite();
        this.addChild(sprite);
        this.debugDraw.setSprite(sprite);
    };
    Main1.prototype.loop = function () {
        this.world.step(60 / 1000);
        this.debugDraw.drawDebug();
    };
    Main1.prototype.addOneBox = function (e) {
        var positionX = Math.floor(e.stageX);
        var positionY = Math.floor(e.stageY);
        var shape;
        var body = new p2.Body({ mass: 1, position: [positionX, positionY], angularVelocity: 1 });
        var shapeType = this.types[Math.floor((Math.random() * this.types.length))];
        //shapeType = "particle";
        switch (shapeType) {
            case "box":
                //shape = new p2.Rectangle(Math.random() * 150 + 50, 100);
                shape = new p2.Box({ width: Math.random() * 150 + 50, height: 100 });
                break;
            case "circle":
                //shape = new p2.Circle(50);
                shape = new p2.Circle({ radius: 50 });
                break;
            case "capsule":
                //shape = new p2.Capsule(50, 10);
                shape = new p2.Capsule({ length: 50, radius: 10 });
                break;
            case "line":
                //shape = new p2.Line(150);
                shape = new p2.Line({ length: 150 });
                break;
            case "particle":
                shape = new p2.Particle();
                break;
        }
        body.addShape(shape);
        this.world.addBody(body);
    };
    return Main1;
}(egret.DisplayObjectContainer));
__reflect(Main1.prototype, "Main1");
//# sourceMappingURL=demo11.js.map