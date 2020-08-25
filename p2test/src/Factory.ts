class Factory {
	private world: p2.World;

	private factor = 50;
	private stoneM: p2.Material;
	private boxM: p2.Material;

	public constructor(world: p2.World) {
		this.world = world;
		this.stoneM = new p2.Material(2);
		this.boxM = new p2.Material(1);
		this.world.addContactMaterial(new p2.ContactMaterial(this.stoneM, this.boxM, {
			frictionRelaxation: 0,
			stiffness: 1e10
		}));
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
		body.damping = .1;
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
		body.damping = .1;
		let shape = type === 'circle' ? new p2.Circle({ radius: 0.1 * this.factor }) : new p2.Particle();
		// let shape = type === 'circle' ? new p2.Circle({ radius: 90 }) : new p2.Particle();
		shape.material = this.stoneM;
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

	public createTrapezoid(point: egret.Point, rad: number, index: number) {
		let r = 178,
			thickness = 200;
		let _id = (index + 1) * 10;
		let _angle = index * rad;
		//----------------------------------------------
		let offset = 1;
		let base_point = 500;
		let _point = [base_point + thickness * Math.sin(_angle), base_point - thickness * Math.cos(_angle)];
		//----------------------------------------------
		//圆环=>梯形
		let out_r = r + thickness,
			_cal_x = r => out_r - r * Math.cos(rad),
			_cal_y = r => r * Math.sin(rad),
			vertices_list: number[][] = [],
			out_x = _cal_x(out_r),
			out_y = _cal_y(out_r),
			inner_x = _cal_x(r),
			inner_y = _cal_y(r);
		vertices_list.push([out_x, -out_y]);
		vertices_list.push([inner_x, -inner_y]);
		vertices_list.push([inner_x, inner_y]);
		vertices_list.push([out_x, out_y]);
		let body = new p2.Body({
			mass: 0,
			fixedRotation: true,
			position: _point,
			angle: _angle,
			id: _id
		});
		body.fromPolygon(vertices_list);
		body.shapes[0].material = this.boxM;
		body.type = p2.Body.STATIC;
		this.world.addBody(body);
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