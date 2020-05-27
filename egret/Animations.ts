namespace util {
	export namespace AnimationtUtil {

		//常用ease函数： 类似电流不稳定开关灯 bounceIn/Out 拍入 quintIn 回弹效果 backOut/In 循环时明灭不定bounceOut/bounceIn 匀加速get(-1)  匀减速get(1)

		/**淡入淡出 */
		export const fadeInOutAni = (obj: egret.DisplayObject, is_fade_in = true, duration = 500, ease?: Function, accompany_change_func?: Function) => {
			return new Promise(resovle => {
				duration = duration > 0 ? duration : 0;
				egret.Tween.removeTweens(obj);
				obj.alpha = is_fade_in ? 0 : 1;
				obj.visible = true;
				egret.Tween.get(obj, {
					onChange: accompany_change_func && accompany_change_func(obj)
				})
					.to({ alpha: is_fade_in ? 1 : 0 }, duration, ease)
					.call(resovle);
			});
		}

		/**比例缩放 */
		export const changeScaleAni = (obj: egret.DisplayObject, start_size: number, end_size: number, duration = 500, ease?: Function, accompany_change_func?: Function) => {
			return new Promise(resolve => {
				duration = duration > 0 ? duration : 0;
				obj.scaleX = obj.scaleY = start_size;
				egret.Tween.get(obj, {
					onChange: accompany_change_func && accompany_change_func(obj)
				})
					.call(() => obj.visible = true)
					.to({ scaleX: end_size, scaleY: end_size }, duration, ease)
					.call(resolve);
			});
		}

		/**旋转 动画 */
		export const rotateAni = (obj: egret.DisplayObject, rotate_angle = 360, duration = 500, ease?: Function, accompany_change_func?: Function) => {
			return new Promise(resolve => {
				let rota = obj.rotation + rotate_angle;
				egret.Tween.removeTweens(obj);
				egret.Tween.get(obj, {
					onChange: accompany_change_func && accompany_change_func(obj)
				})
					.to({ rotation: rota }, duration, ease)
					.call(resolve);
			});
		}

		/**
		 * 旋转动效
		 * @param 要旋转的物体
		 * @param duration 持续时间  一圈
		 * @param type  方向 1 顺时针 -1逆时针
		 * @param totalAngle 总共要转多少度
		 * @param ease  函数
		 */
		export const rotateAni2 = (obj: egret.DisplayObject, duration: number, type = 1, totalAngle: number, ease?: Function, accompany_change_func?: Function) => {
			return new Promise(resolve => {
				egret.Tween.removeTweens(obj);
				let destRotation,
					//获取争取的rotation 防止类似 270° 自动转换成变成 -90° 
					orignRotation = (obj.rotation + (type === 1 ? 360 : -360)) % 360;
				if (totalAngle === 360) { //转整圈
					destRotation = orignRotation + (type === 1 ? 1 : -1) * 360;
				} else { //转到指定角度
					//如果要转到的角度已经过了，则应该转一个大弧度（360-角度差绝对值），而不是反向转小的弧度
					destRotation = Math.abs(orignRotation) > Math.abs(totalAngle) ? (type === 1 ? 1 : -1) * 360 + totalAngle : totalAngle;
					duration = ((duration * Math.abs((destRotation - orignRotation) / 360)) << 0) || duration;
				}
				egret.Tween.get(
					obj,
					{
						onChange: accompany_change_func && accompany_change_func(obj)
					}
				).to({ rotation: destRotation }, duration, ease).call(resolve);
			});
		}


		/**斜抛动画 */
		export const castAni = (obj: egret.DisplayObject, inital_velocity: number, start_angle: number, range_of_time = 200, duration = 10 * 1000, accompany_change_func?: Function) => {
			return new Promise(resovle => {
				let orig_x = obj.x,
					orig_y = obj.y,
					v = inital_velocity,  //初速度
					rad = start_angle * Math.PI / 180, //初始角度转弧度
					time = { t: 0 };
				egret.Tween.get(time, {
					onChange: () => {
						obj.x = orig_x + v * time.t * Math.cos(rad);
						obj.y = orig_y - (v * time.t * Math.sin(rad) - 9.78 * time.t * time.t / 2);
						accompany_change_func && accompany_change_func(obj);
					}
				})
					.to({ t: range_of_time }, duration)
					.call(resovle);
			});
		}

		/**
		* @param obj 需要漂浮的物体
		* @param shadow 影子
		* @param arg_y 漂浮物体原始y坐标 以此为准上下浮动
		* @param base_drution 漂浮动效时间
		* @param base_move_range 每次最少偏移多少
		* @param random_move_range 随机偏移量
		* @param shadow_scale_rate
		*/
		export const floatAni = (obj: eui.Group, shadow: eui.Image, org_y: number, base_drution: number, base_move_range = 10, random_move_range = 15, shadow_scale_rate = 0.15) => {
			egret.Tween.removeTweens(obj);
			if (obj.stage && obj.visible) {
				let now_y = obj.y,
					next_y = now_y + ((now_y > org_y) ? -1 : 1) * ((Math.random() * base_move_range << 0) + random_move_range),
					total_range = base_move_range + random_move_range;
				let duration = (Math.abs(next_y - now_y) * base_drution * (Number(Math.random() * 0.7) + 0.3)) << 0;
				egret.Tween
					.get(obj, {
						//影子面积随物体漂浮 有大小变化 0.15的系数可以自己根据实际调整
						onChange: () => shadow.scaleY = shadow.scaleX = ((obj.y - org_y) / total_range) * random_move_range + 1,
					})
					.to({ y: next_y }, duration)
					.call(() => util.EffectUtil.floatAni(obj, shadow, org_y, base_drution));
			}
		}

		/**抖动动画 */
		export const shakeAni = (diplayCon: egret.DisplayObject, shake_range = 2, duration = 35) => {
			return new Promise(resolve => {
				egret.Tween.removeTweens(diplayCon);
				egret.Tween.get(diplayCon)
					.to({ verticalCenter: shake_range, horizontalCenter: shake_range }, duration)
					.to({ verticalCenter: 0, horizontalCenter: 0 }, duration)
					.call(resolve);
			});
		}


        /** 
         * 两个点之间弧线飞行  弯曲方向随机 计算飞行的贝塞尔曲线偏移点 
        */
		export const calOffsetPoint = (beginPoint, destPoint): egret.Point => {
			let point = new egret.Point(),
				corePoint = new egret.Point((destPoint.x + beginPoint.x) / 2, (destPoint.y + beginPoint.y) / 2),
				offsetMaxDistance = Math.sqrt(Math.pow((destPoint.x - beginPoint.x), 2) + Math.pow((destPoint.y - beginPoint.y), 2)), //最大偏移距离 根据需要调整
				rand1 = (Math.random() < 0.5 ? 1 : -1),
				offsetDistance = util.NumberUtil.getRandom(offsetMaxDistance / 2, offsetMaxDistance * 2 / 3), //随机生成偏移距离 根据需要调整
				offsetX = 0,
				offsetY = 0;
			if (destPoint.x === beginPoint.x) { //如果是垂直
				offsetX = offsetDistance * rand1;
			} else {
				let k = Math.abs((beginPoint.y - destPoint.y) / (destPoint.x - beginPoint.x));
				offsetX = rand1 * Math.sin(Math.atan(k)) * offsetDistance;
				offsetY = rand1 * Math.cos(Math.atan(k)) * offsetDistance;
			}
			let rand2 = (Math.random() < 0.5 ? 1 : -1); //向上向下弯曲随机
			point.x = (corePoint.x + (offsetX * rand2)) << 0;
			point.y = (corePoint.y + (destPoint.x - beginPoint.x < 0 ? -1 : 1) * (offsetY * rand2)) << 0;  //根据游戏实际情况 x y  加的数 符号相反或相同
			return point;
		}


		/**画贝塞尔曲线 */
		export const drawBezier = (line_num: number, shape: egret.Shape, points: egret.Point[], base_duraton: number, timeRate = 1, preDrawPoint?: egret.Point) => {
			return new Promise(resolve => {
				let factor = { v: 0 },
					//加入timeRate 简单化处理由于弧线产生的速度差（一般我根据角度估计，并不严谨）
					duration = egret.Point.distance(points[0], points[1]) / 1000 * base_duraton * timeRate;
				egret.Tween.get(factor, {
					onChange: () => {
						//从上次的地方继续画线，用于同时画分叉的线路，单根线走到头的则不需要
						preDrawPoint && shape.graphics.moveTo(preDrawPoint.x, preDrawPoint.y);
						let nextLineToPoint = util.NumberUtil.calBezierPoint(points[0], points[1], points[2], factor.v);
						shape.graphics.lineTo(nextLineToPoint.x, nextLineToPoint.y);
						preDrawPoint && (preDrawPoint = nextLineToPoint);
					}
				})
					.to({ v: 1 }, duration)
					.call(resolve);
			});
		}


		/**画直线 */
		export const drawLine = (line_num: number, shape: egret.Shape, startPoint: egret.Point, base_duraton: number, endPoint: egret.Point, preDrawPoint?: egret.Point) => {
			return new Promise(resolve => {
				let factor = { x: startPoint.x, y: startPoint.y },
					duration = egret.Point.distance(startPoint, endPoint) / 1000 * base_duraton;
				egret.Tween.get(factor, {
					onChange: () => {
						preDrawPoint && shape.graphics.moveTo(preDrawPoint.x, preDrawPoint.y);
						shape.graphics.lineTo(factor.x, factor.y);
						preDrawPoint && preDrawPoint.setTo(factor.x, factor.y);
					}
				}).to({ x: endPoint.x, y: endPoint.y }, duration).call(resolve);
			});
		}

		/**画虚线 */
		export const setLineDash = (line: egret.Shape, thickness?: number, color?: number, alpha = 1, pixelHinting?: boolean, miterLimit = 3, lineDash = [20, 20]) => {
			line.graphics.lineStyle(thickness, color, 1, pixelHinting, 'normal', null, null, miterLimit, lineDash);
		}

		/**播放帧动效  start_frame分正负 其他不分*/
		export const playMC = (mc: ui.control.MovieClip, play_times = 1, frame_reate = 10, is_reverse = false, start_frame?: number) => {
			mc.currentFrame = start_frame !== undefined ? start_frame : (is_reverse ? -1 : 0);
			mc.playTimes = play_times;
			mc.frameRate = is_reverse ? -frame_reate : frame_reate;
			mc.isPlaying = true;
			mc.visible = true;
		}

		/**停止播放帧动效 */
		export const stopPlayMC = (mc: ui.control.MovieClip, is_visible = false, curr_frame?: number) => {
			mc.isPlaying = false;
			mc.visible = is_visible;
			curr_frame !== undefined && (mc.currentFrame = curr_frame);
		}

		/**帧动画添加监听 */
		export const addEvtToMc = (mc: ui.control.MovieClip, call_back: Function, this_object: any, evt_type = egret.Event.COMPLETE, is_once = false) => {
			mc.hasEventListener(evt_type) && mc.removeEventListener(evt_type, call_back, this_object);
			if (is_once) {
				mc.once(evt_type, call_back, this_object);
			} else {
				mc.addEventListener(evt_type, call_back, this_object);
			}
		}
	}
}
