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


	private factor = 50;
	private world: p2.World;
	private debugDraw: p2DebugDraw;
	private tzds: p2.Body[] = [];
	private stones: p2.Body[] = [];
	/**
	 * 创建游戏场景
	 */
	private createGameScene(): void {
		this.addEventListener(egret.Event.ENTER_FRAME, () => this.loop(), this);
		let world: p2.World = new p2.World({ gravity: [0, 0] });
		world.sleepMode = p2.World.BODY_SLEEPING;
		world.useWorldGravityAsFrictionGravity = true;
		this.world = world;
		// this.createDebug();
		let factory = new Factory(this.world);
		let rad = Math.PI / 2 / 4,
			len = 2 * Math.PI / rad;
		for (let i = 0; i < len; i++) {
			let body = factory.createBox(this, egret.Point.create(500, 500), rad, i);
			this.tzds.push(body);
		}

		// this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, (evt: egret.TouchEvent) => {
		// 	Array(...Array(10)).forEach((_, i) => {
		// 		this.stones.push(factory.createStone(egret.Point.create(evt.$stageX, evt.$stageY), this));
		// 	});
		// }, this);
		this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, (evt: egret.TouchEvent) => {
			Array(...Array(10)).forEach((_, i) => {
				this.stones.push(factory.createStone(egret.Point.create(evt.$stageX, evt.$stageY), this));
			});
			Array(...Array(2)).forEach((_, i) => {
				this.stones.push(factory.createStone(egret.Point.create(evt.$stageX, evt.$stageY), this, 'p'));
			});
			this.addChild(this.tzds[0].displays[0]);
		}, this);

		// factory.createBBall(egret.Point.create(300, 500));
		// this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, (evt: egret.TouchEvent) => {
		// 	this.tzds[this._i].position = [evt.$stageX, evt.$stageY];
		// }, this);

	}


	public pre_stageY = 0;
	public _i = 0;

	public _cal() {
		this.tzds.forEach(body => console.log(body.id, body.position));
	}
	private createDebug(): void {
		this.debugDraw = new p2DebugDraw(this.world);
		var sprite: egret.Sprite = new egret.Sprite();
		this.addChild(sprite);
		this.debugDraw.setSprite(sprite);
	}

	private dis_y = 1 / this.factor;
	private dis_x = 10 / this.factor;
	private shake = false;
	private loop(): void {
		this.world.step(1 / 60, 1);
		// this.debugDraw.drawDebug();
		let box = this.tzds[0],
			box_position = box.position;
		if (this.shake) {
			egret.setTimeout(() => this.shake = false, this, 3000);
			if ((box_position[1] > 500 / this.factor && this.dis_y > 0) || (box_position[1] < 300 / this.factor && this.dis_y < 0)) {
				this.dis_y *= -1;
			}
			if ((box_position[0] > 700 / this.factor && this.dis_x > 0) || (box_position[0] < 600 / this.factor && this.dis_x < 0)) {
				this.dis_x *= -1;
			}
			for (let i = 0, len = this.tzds.length; i < len; i++) {
				let cur_b = this.tzds[i];
				let pre_position = cur_b.position;
				cur_b.position = [pre_position[0] + this.dis_x, pre_position[1] + this.dis_y];
			}
		}
		let disp: eui.Image = box.displays[0];
		disp.x = box_position[0] * this.factor;
		disp.y = box_position[1] * this.factor;
		this.stones.forEach(s => {
			let disp = s.displays[0];
			disp.x = s.position[0] * this.factor;
			disp.y = s.position[1] * this.factor;
		})
	}

}
