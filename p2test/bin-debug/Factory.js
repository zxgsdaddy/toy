var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Factory = (function () {
    function Factory(world) {
        this.factor = 50;
        this.world = world;
        // this.stoneM = new p2.Material(2);
        // this.boxM = new p2.Material(1);
        // this.world.addContactMaterial(new p2.ContactMaterial(this.stoneM, this.boxM, {
        // 	frictionRelaxation: 0,
        // 	stiffness: 1e10
        // }));
    }
    Factory.prototype.createStone = function (point, parent, type) {
        if (type === void 0) { type = 'circle'; }
        var factor = this.factor, 
        // let factor = 1,
        display = new eui.Image('ft_pic_stone_png');
        display.x = point.x;
        display.y = point.y;
        display.width = display.height = 12;
        display.anchorOffsetX = display.width / 2;
        display.anchorOffsetY = display.height / 2;
        var body = new p2.Body({
            mass: 10,
            position: [point.x / factor, point.y / factor],
            allowSleep: false
        });
        body.damping = .1;
        var shape = type === 'circle' ? new p2.Circle({ radius: 0.1 }) : new p2.Particle();
        // let shape = type === 'circle' ? new p2.Circle({ radius: 6 }) : new p2.Particle();
        // shape.material = this.stoneM;
        body.addShape(shape);
        body.displays = [display];
        body.type = p2.Body.DYNAMIC;
        parent.addChild(display);
        this.world.addBody(body);
        return body;
    };
    Factory.prototype.createStoneDD = function (point) {
        var factor = 1, body = new p2.Body({
            mass: 5,
            position: [point.x / factor, point.y / factor],
            allowSleep: false
        });
        body.damping = 0.02;
        var shape = new p2.Circle({ radius: 0.1 * this.factor });
        // shape.material = this.stoneM;
        body.addShape(shape);
        body.type = p2.Body.DYNAMIC;
        this.world.addBody(body);
        return body;
    };
    Factory.prototype.createBBall = function (point, type) {
        if (type === void 0) { type = 'circle'; }
        var factor = 1, body = new p2.Body({
            mass: 0,
            position: [point.x / factor, point.y / factor],
        });
        var shape = type === 'circle' ? new p2.Circle({ radius: 90 }) : new p2.Particle();
        shape.material = this.stoneM;
        body.addShape(shape);
        body.type = p2.Body.STATIC;
        this.world.addBody(body);
        return body;
    };
    Factory.prototype.createBox = function (parent, point, rad, index) {
        var r = 200 / this.factor, _id = (index + 1) * 10, _angle = index * rad;
        var offset = 1;
        var _point = [(point.x + 185 * Math.sin(_angle)) / this.factor, (point.y - 185 * Math.cos(_angle)) / this.factor];
        var body = new p2.Body({
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
            var display = new eui.Image('ft_pic_glass_cover_png');
            display.anchorOffsetX = 94;
            display.anchorOffsetY = -94;
            body.displays = [display];
            parent.addChild(display);
        }
        return body;
    };
    Factory.prototype.drawConvexDD = function (point) {
        var total_rad = Math.PI / 2 / 8, thickness = 50, r = 93, d = 93 * 2, tem_v1 = [], tem_v2 = [], vertices_list = [];
        for (var i = 0; i < 2; i++) {
            var x1 = r + thickness - (Math.cos(i * total_rad) * r << 0), y1 = Math.sin(i * total_rad) * r << 0, x2 = (r + thickness - Math.cos(i * total_rad) * (r + thickness)) << 0, y2 = (Math.sin(i * total_rad) * (r + thickness)) << 0;
            tem_v1.push([x1, y1]);
            tem_v2.push([x2, y2]);
        }
        vertices_list.push.apply(vertices_list, tem_v2);
        vertices_list.push.apply(vertices_list, tem_v1.reverse());
        var body = new p2.Body({
            mass: 0,
            fixedRotation: true,
            position: [10, 10],
            angle: Math.PI / 2
        });
        // let shape = new p2.Convex({
        // 	vertices: vertices_list
        // });
        console.log('vertices_list', vertices_list);
        body.fromPolygon(vertices_list, {});
        body.type = p2.Body.STATIC;
        // body.addShape(shape);
        this.world.addBody(body);
        return body;
    };
    Factory.prototype.updatePosition = function (body) {
        var disp = body.displays[0];
        disp.x = body.position[0] * this.factor;
        disp.y = body.position[1] * this.factor;
    };
    return Factory;
}());
__reflect(Factory.prototype, "Factory");
//# sourceMappingURL=Factory.js.map