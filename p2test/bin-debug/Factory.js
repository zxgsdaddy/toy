var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Factory = (function () {
    function Factory(world) {
        this.factor = 50;
        this.world = world;
        this.stoneM = new p2.Material(2);
        this.boxM = new p2.Material(1);
        this.world.addContactMaterial(new p2.ContactMaterial(this.stoneM, this.boxM, {
            frictionRelaxation: 0,
            stiffness: 1e10
        }));
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
        body.damping = .1;
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
        // let shape = type === 'circle' ? new p2.Circle({ radius: 90 }) : new p2.Particle();
        shape.material = this.stoneM;
        body.addShape(shape);
        body.type = p2.Body.DYNAMIC;
        this.world.addBody(body);
        return body;
    };
    Factory.prototype.createTrapezoid = function (point, rad, index) {
        var points = {
            '10': [887, 799],
            '30': [894, 756],
            '50': [918, 719],
            '70': [954, 695],
            '90': [1000, 685],
            '110': [1046, 693],
            '130': [1084, 721],
            '150': [1107, 758],
            '170': [1115, 802],
            '190': [1107, 845],
            '210': [1082, 883],
            '230': [1043, 907],
            '250': [1000, 914],
            '270': [955, 907],
            '290': [918, 882],
            '310': [894, 844]
        };
        var _id = (index + 1) * 10;
        var _point = points[_id];
        var _angle = index * rad;
        // let offset = 1;
        // if (_angle >= 0 && _angle <= Math.PI / 2) {
        // 	offset = 1;
        // } else if (_angle >= Math.PI / 2 && _angle <= Math.PI) {
        // 	offset = 2;
        // } else if (_angle >= Math.PI && _angle <= Math.PI * 3 / 2) {
        // 	offset = 3;
        // } else {
        // 	offset = 4;
        // }
        // let point_x = point.x + 80 * (index % 10);
        // let point_y = point.y + 80 * offset;
        //圆环=>梯形
        var r = 93, thickness = 200, out_r = r + thickness, _cal_x = function (r) { return out_r - r * Math.cos(rad); }, _cal_y = function (r) { return r * Math.sin(rad); }, vertices_list = [], out_x = _cal_x(out_r), out_y = _cal_y(out_r), inner_x = _cal_x(r), inner_y = _cal_y(r);
        vertices_list.push([out_x, -out_y]);
        vertices_list.push([inner_x, -inner_y]);
        vertices_list.push([inner_x, inner_y]);
        vertices_list.push([out_x, out_y]);
        var body = new p2.Body({
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