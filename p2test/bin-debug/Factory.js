var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Factory = (function () {
    function Factory(world) {
        this.factor = 50;
        this.world = world;
    }
    Factory.prototype.createStone = function (point, parent, type) {
        if (type === void 0) { type = 'circle'; }
        var factor = this.factor, display = new eui.Image('ft_pic_stone_png');
        display.x = point.x;
        display.y = point.y;
        display.width = display.height = 12;
        display.anchorOffsetX = display.width / 2;
        display.anchorOffsetY = display.height / 2;
        var body = new p2.Body({
            mass: 2,
            position: [point.x / factor, point.y / factor],
        });
        body.damping = .3;
        var shape = type === 'circle' ? new p2.Circle({ radius: 0.1 }) : new p2.Particle();
        shape.material = this.stoneM;
        body.addShape(shape);
        body.displays = [display];
        body.type = p2.Body.DYNAMIC;
        parent.addChild(display);
        this.world.addBody(body);
        return body;
    };
    Factory.prototype.createStoneDD = function (point, type) {
        if (type === void 0) { type = 'circle'; }
        var factor = 1, body = new p2.Body({
            mass: 2,
            position: [point.x / factor, point.y / factor],
        });
        body.damping = .3;
        var shape = type === 'circle' ? new p2.Circle({ radius: 0.1 * this.factor }) : new p2.Particle();
        shape.material = this.stoneM;
        body.addShape(shape);
        body.type = p2.Body.DYNAMIC;
        this.world.addBody(body);
        return body;
    };
    Factory.prototype.drawConvexDD = function (point) {
        var rad_precise = 0.15, thickness = 50, r = 93, d = 93 * 2, tem_v1 = [], tem_v2 = [], vertices_list = [];
        vertices_list.push([0, 0]);
        for (var i = 0, len = (Math.PI / 2 / rad_precise) << 0; i < len; i++) {
            var _w = Math.cos(i * rad_precise) * r << 0, x = r - _w + thickness, y = Math.sin(i * rad_precise) * r << 0;
            tem_v1.push([x, y]);
            tem_v2.push([x + 2 * _w, y]);
        }
        vertices_list.push.apply(vertices_list, tem_v1);
        vertices_list.push([r + thickness, r]);
        // vertices_list.push(...tem_v2.reverse());
        // vertices_list.push([2 * thickness + d, 0]);
        // vertices_list.push([2 * thickness + d, r + thickness]);
        vertices_list.push([r + thickness, r + thickness]);
        vertices_list.push([0, r + thickness]);
        var body = new p2.Body({
            mass: 0,
            fixedRotation: true,
            position: [10, 10],
            allowSleep: false
        });
        var shape = new p2.Convex({
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