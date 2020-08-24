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

class Main extends eui.UILayer {


    protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());


        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        const result = await RES.getResAsync("description_json")
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);
    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await this.loadTheme();
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }

    private textfield: egret.TextField;

    //debug模式，使用图形绘制
    private isDebug: boolean = false;

    private factor = 50;

    private updatePosition(body: p2.Body, ) {
        let disp = body.displays[0];
        disp.x = body.position[0] * this.factor;
        disp.y = body.position[1] * this.factor;
        // if (body.sleepState === p2.Body.SLEEPING) {
        //     body.applyImpulse([Math.random() < 0.5 ? -50 : 50, 50], [0, 0]);
        // }

    }

    private createStone(world: p2.World, point: egret.Point, parent: egret.DisplayObjectContainer, type = 0) {
        let display = new eui.Image('ft_pic_stone_png');
        display.width = display.height = 12;
        display.anchorOffsetX = display.width / 2;
        display.anchorOffsetY = display.height / 2;
        let body = new p2.Body({
            mass: 2,
            position: [point.x / this.factor, point.y / this.factor],
        });
        body.damping = .3;
        let shape = type ? new p2.Particle() : new p2.Circle({ radius: 0.1 });
        shape.material = this.stoneM;
        body.addShape(shape);
        body.displays = [display];
        body.type = p2.Body.DYNAMIC;
        this.updatePosition(body);
        parent.addChild(display);
        world.addBody(body);
        return body;
    }

    private createBox(world: p2.World, point: egret.Point, parent: egret.DisplayObjectContainer) {
        let box_arr: p2.Body[] = [];
        for (let i = 0; i < 4; i++) {
            // let display = new eui.Image('ft_pic_glass_cover_png'),
            let len = 186,
                display = new eui.Rect(0, 0, 0xfff000);
            display.width = (i % 2 === 0 ? 2 : 1) * len
            display.height = (i % 2 === 0 ? 1 : 2) * len;
            display.anchorOffsetX = display.width / 2;
            display.anchorOffsetY = display.height / 2;
            let _position = [point.x / this.factor, point.y / this.factor];
            switch (i) {
                case 0: _position = [(point.x) / this.factor, (point.y - display.height) / this.factor]; break;
                case 1: _position = [(point.x + display.width) / this.factor, (point.y) / this.factor]; break;
                case 2: _position = [(point.x) / this.factor, (point.y + display.height) / this.factor]; break;
                case 3: _position = [(point.x - display.width) / this.factor, (point.y) / this.factor]; break;
            }
            let body = new p2.Body({
                mass: 0,
                fixedRotation: true,
                position: _position
            });
            let shape = new p2.Box({
                width: display.width / this.factor,
                height: display.height / this.factor,
            });
            shape.material = this.boxM;
            body.addShape(shape);
            body.displays = [display];
            body.type = p2.Body.STATIC;
            this.updatePosition(body);
            parent.addChild(display);
            world.addBody(body);
            box_arr.push(body);
        }
        return box_arr;
    }

    private drawConvex() {
        let rad_precise: number = 0.15,
            // let rad_precise: number = 0.5,
            thickness = 10,
            r = 93,
            d = 93 * 2,
            tem_v1 = [],
            tem_v2 = [],
            vertices_list: number[][] = [];
        vertices_list.push([0, 0]);
        // for (let i = 0, len = (Math.PI / 2 / rad_precise) << 0; i < len; i++) {
        //     let _w = Math.cos(i * rad_precise) * r << 0,
        //         x = r - _w + thickness,
        //         y = Math.sin(i * rad_precise) * r << 0;
        //     tem_v1.push([x, y]);
        //     tem_v2.push([x + 2 * _w, y]);
        // }
        // vertices_list.push(...tem_v1);
        vertices_list.push([r + thickness, r]);
        vertices_list.push([r + thickness, r + thickness]);
        // vertices_list.push(...tem_v2.reverse());
        // vertices_list.push([2 * thickness + d, 0]);
        // vertices_list.push([2 * thickness + d, r + thickness]);
        vertices_list.push([0, r + thickness]);
        // vertices_list = vertices_list.map(pos => [pos[0] / this.factor, pos[1] / this.factor]);
        let body = new p2.Body({
            mass: 0,
            fixedRotation: true,
            position: [10, 10],
            allowSleep: false
        });

        let shape = new p2.Convex({
            vertices: vertices_list
        });
        // vertices_list = [[0, 0], [10, 0], [10, 10], [0, 10]];
        console.log('vertices_list', vertices_list);
        body.fromPolygon(vertices_list, {
            removeCollinearPoints: true,
            optimalDecomp: true
        });
        body.type = p2.Body.STATIC;
        // body.addShape(shape);
        let display = new eui.Image('ft_pic_glass_cover_png');
        this.stage.addChild(display);
        body.displays = [display];
        this.world.addBody(body);
        this.updatePosition(body);
        // this.debugDraw.drawConvex(shape, body);
        return body;
    }

    private debugDraw: p2DebugDraw;
    private createDebug(): void {
        //创建调试试图
        this.debugDraw = new p2DebugDraw(this.world);
        var sprite: egret.Sprite = new egret.Sprite();
        this.stage.addChild(sprite);
        this.debugDraw.setSprite(sprite);
    }

    private world: p2.World;

    private stoneM: p2.Material;
    private boxM: p2.Material;

    /**
     * 创建游戏场景
     */
    private createGameScene(): void {
        //创建world
        let world: p2.World = new p2.World({ gravity: [0, 0] });
        world.sleepMode = p2.World.NO_SLEEPING;
        world.useWorldGravityAsFrictionGravity = true;
        this.world = world;

        this.createDebug();
        this.stoneM = new p2.Material(1);
        this.boxM = new p2.Material(0);

        world.addContactMaterial(new p2.ContactMaterial(this.stoneM, this.boxM, {
            frictionRelaxation: 0,
            stiffness: 1e5
        }));

        world.addContactMaterial(new p2.ContactMaterial(this.stoneM, this.stoneM, {
            frictionRelaxation: 10,
            stiffness: 10
        }));

        let c = this.drawConvex();

        let stones: p2.Body[] = [];
        // Array(...Array(10)).forEach((_, i) => {
        //     stones.push(this.createStone(world, egret.Point.create(510 + i * 2, 510 + i * 2), this.stage));
        // });
        Array(...Array(10)).forEach((_, i) => {
            stones.push(this.createStone(world, egret.Point.create(500 + i * 10, 500 + i * 10), this.stage));
        });
        // Array(...Array(10)).forEach((_, i) => {
        //     stones.push(this.createStone(world, egret.Point.create(600 - i * 2, 510 + i * 2), this.stage, 1));
        // });
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, (evt: egret.TouchEvent) => {
            c.position = [evt.$stageX / this.factor, evt.$stageY / this.factor];
            // this.world.bodies[this.world.bodies.length - 1].position = [evt.$stageX / this.factor, evt.$stageY / this.factor];
        }, this);
        this.addEventListener(egret.Event.ENTER_FRAME, () => {
            this.world.step(60 / 1000);
            this.debugDraw.drawDebug();
            stones.forEach(stone => this.updatePosition(stone));
            this.updatePosition(c);
            // egret.log(c.position);
            // egret.log(this.world.bodies[this.world.bodies.length - 1].position);
        }, this);

    }
}
