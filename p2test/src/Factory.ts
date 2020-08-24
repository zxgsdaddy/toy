class Factory {
	private world: p2.World;

	private factor = 50;
	private stoneM: p2.Material;
	private boxM: p2.Material;

	public constructor(world: p2.World) {
		this.world = world;
	}

	public createStone(point: egret.Point, parent: egret.DisplayObjectContainer, type = 'circle') {
		let factor = this.factor,
			display = new eui.Image('ft_pic_stone_png');
		display.x = point.x;
		display.y = point.y;
		display.width = display.height = 12;
		display.anchorOffsetX = display.width / 2;
		display.anchorOffsetY = display.height / 2;
		let body = new p2.Body({
			mass: 2,
			position: [point.x / factor, point.y / factor],
		});
		body.damping = .3;
		let shape = type === 'circle' ? new p2.Circle({ radius: 0.1 }) : new p2.Particle();
		shape.material = this.stoneM;
		body.addShape(shape);
		body.displays = [display];
		body.type = p2.Body.DYNAMIC;
		parent.addChild(display);
		this.world.addBody(body);
		return body;
	}

	public createStoneDD(point: egret.Point, type = 'circle') {
		let factor = 1,
			body = new p2.Body({
				mass: 2,
				position: [point.x / factor, point.y / factor],
			});
		body.damping = .3;
		let shape = type === 'circle' ? new p2.Circle({ radius: 0.1 * this.factor }) : new p2.Particle();
		shape.material = this.stoneM;
		body.addShape(shape);
		body.type = p2.Body.DYNAMIC;
		this.world.addBody(body);
		return body;
	}


	public drawConvexDD(point: egret.Point) {
		let rad_precise: number = 0.15,
			thickness = 50,
			r = 93,
			d = 93 * 2,
			tem_v1 = [],
			tem_v2 = [],
			vertices_list: number[][] = [];
		vertices_list.push([0, 0]);
		for (let i = 0, len = (Math.PI / 2 / rad_precise) << 0; i < len; i++) {
			let _w = Math.cos(i * rad_precise) * r << 0,
				x = r - _w + thickness,
				y = Math.sin(i * rad_precise) * r << 0;
			tem_v1.push([x, y]);
			// tem_v2.push([x + 2 * _w, y]);
		}
		vertices_list.push(...tem_v1);
		vertices_list.push([r + thickness, r]);
		// vertices_list.push(...tem_v2.reverse());
		// vertices_list.push([2 * thickness + d, 0]);
		// vertices_list.push([2 * thickness + d, r + thickness]);
		vertices_list.push([0, r + thickness]);
		let body = new p2.Body({
			mass: 0,
			fixedRotation: true,
			position: [10, 10],
			allowSleep: false
		});

		let shape = new p2.Convex({
			vertices: vertices_list
		});
		console.log('vertices_list', vertices_list);
		// body.fromPolygon(vertices_list, {
		// removeCollinearPoints: true,
		// optimalDecomp: true
		// });
		body.type = p2.Body.STATIC;
		body.addShape(shape);
		this.world.addBody(body);
		return body;
	}

	private updatePosition(body: p2.Body) {
		let disp = body.displays[0];
		disp.x = body.position[0] * this.factor;
		disp.y = body.position[1] * this.factor;
	}
}