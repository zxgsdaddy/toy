class Factory {
	private world: p2.World;

	private factor = 50;
	private stoneM: p2.Material;
	private boxM: p2.Material;

	public constructor(world: p2.World) {
		this.world = world;
		// this.stoneM = new p2.Material(2);
		// this.boxM = new p2.Material(1);
		// this.world.addContactMaterial(new p2.ContactMaterial(this.stoneM, this.boxM, {
		// 	frictionRelaxation: 0,
		// 	stiffness: 1e10
		// }));
	}

	public createStone(point: egret.Point, parent: egret.DisplayObjectContainer, type = 'circle') {
		let factor = this.factor,
			// let factor = 1,
			display = new eui.Image('ft_pic_stone_png');
		display.x = point.x;
		display.y = point.y;
		display.width = display.height = 12;
		display.anchorOffsetX = display.width / 2;
		display.anchorOffsetY = display.height / 2;
		let body = new p2.Body({
			mass: 10,
			position: [point.x / factor, point.y / factor],
			allowSleep: false
		});
		body.damping = .1;
		let shape = type === 'circle' ? new p2.Circle({ radius: 0.1 }) : new p2.Particle();
		// let shape = type === 'circle' ? new p2.Circle({ radius: 6 }) : new p2.Particle();
		// shape.material = this.stoneM;
		body.addShape(shape);
		body.displays = [display];
		body.type = p2.Body.DYNAMIC;
		parent.addChild(display);
		this.world.addBody(body);
		return body;
	}

	public createStoneDD(point: egret.Point) {
		let factor = 1,
			body = new p2.Body({
				mass: 5,
				position: [point.x / factor, point.y / factor],
				allowSleep: false
			});
		body.damping = 0.02;
		let shape = new p2.Circle({ radius: 0.1 * this.factor });
		// shape.material = this.stoneM;
		body.addShape(shape);
		body.type = p2.Body.DYNAMIC;
		this.world.addBody(body);
		return body;
	}

	public createBBall(point: egret.Point, type = 'circle') {
		let factor = 1,
			body = new p2.Body({
				mass: 0,
				position: [point.x / factor, point.y / factor],
			});
		let shape = type === 'circle' ? new p2.Circle({ radius: 90 }) : new p2.Particle();
		shape.material = this.stoneM;
		body.addShape(shape);
		body.type = p2.Body.STATIC;
		this.world.addBody(body);
		return body;
	}

	public createBox(parent: egret.DisplayObjectContainer, point: egret.Point, rad: number, index: number) {
		let r = 200 / this.factor,
			_id = (index + 1) * 10,
			_angle = index * rad;
		let offset = 1;
		let _point = [(point.x + 185 * Math.sin(_angle)) / this.factor, (point.y - 185 * Math.cos(_angle)) / this.factor];
		let body = new p2.Body({
			mass: 0,
			fixedRotation: true,
			position: _point,
			angle: _angle,
			id: _id
		});
		body.addShape(new p2.Box({
			width: r,
			height: r
		}));
		// body.damping = 0;
		body.type = p2.Body.STATIC;
		this.world.addBody(body);
		if (index === 0) {
			let display = new eui.Image('ft_pic_glass_cover_png');
			display.anchorOffsetX = 94;
			display.anchorOffsetY = -94;
			body.displays = [display];
			parent.addChild(display);
		}
		return body;
	}


	public drawConvexDD(point: egret.Point) {
		let total_rad = Math.PI / 2 / 8,
			thickness = 50,
			r = 93,
			d = 93 * 2,
			tem_v1 = [],
			tem_v2 = [],
			vertices_list: number[][] = [];
		for (let i = 0; i < 2; i++) {
			let x1 = r + thickness - (Math.cos(i * total_rad) * r << 0),
				y1 = Math.sin(i * total_rad) * r << 0,
				x2 = (r + thickness - Math.cos(i * total_rad) * (r + thickness)) << 0,
				y2 = (Math.sin(i * total_rad) * (r + thickness)) << 0;
			tem_v1.push([x1, y1]);
			tem_v2.push([x2, y2]);
		}
		vertices_list.push(...tem_v2);
		vertices_list.push(...tem_v1.reverse());
		let body = new p2.Body({
			mass: 0,
			fixedRotation: true,
			position: [10, 10],
			angle: Math.PI / 2
		});

		// let shape = new p2.Convex({
		// 	vertices: vertices_list
		// });
		console.log('vertices_list', vertices_list);
		body.fromPolygon(vertices_list, {
			// removeCollinearPoints: true,
			// optimalDecomp: true
		});
		body.type = p2.Body.STATIC;
		// body.addShape(shape);
		this.world.addBody(body);
		return body;
	}

	private updatePosition(body: p2.Body) {
		let disp = body.displays[0];
		disp.x = body.position[0] * this.factor;
		disp.y = body.position[1] * this.factor;
	}
}