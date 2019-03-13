var bezierColor = "200,200,200,";
canvasBezier("bgcanvas", 0);
function canvasBezier(a, b) {
	function c() {
		f.clearRect(0, 0, cwidth, cheight);
		for (var a = 3; a > 0; a--) {
			d[a - 1] += .5 * a;
			var c = (d[a - 1] + 120 * a) * Math.PI / 180;
			if (b) var e = Math.cos(c) * cheight * .09,
				g = Math.sin(c) * cheight * .06;
			else var e = Math.sin(c) * cheight * .06,
				g = Math.cos(c) * cheight * .09;
			f.setTransform(1, 0, 0, 1, 0, 0), f.strokeStyle = "rgba(" + bezierColor + (.2 * Math.cos(c) + .5) + ")", f.beginPath(), f.moveTo(0, .5 * cheight + e), f.bezierCurveTo(cwidth / 2, .5 * cheight + 2.5 * e, cwidth / 2, .5 * cheight + 2 * g, cwidth, .5 * cheight + g), f.stroke()
		}
	}
	//if (!Modernizr.canvas) return !1;
	var d = [0, 0, 0],
		e = document.getElementById(a),
		f = e.getContext("2d");
	cwidth = $(window).width() >= 1130 ? $(window).width() : 1130, cheight = $(window).height(), e.width = cwidth, e.height = cheight, f.lineWidth = .5, e.timer = setInterval(c, 30), $(window).resize(function() {
		clearInterval(e.timer), cwidth = $(window).width() >= 1130 ? $(window).width() : 1130, cheight = $(window).height(), e.width = cwidth, e.height = cheight, f.lineWidth = 1, e.timer = setInterval(c, 30)
	})



}