// Von https://github.com/quietshu/apple-pencil-safari-api-test/blob/gh-pages/index.html
var _context, _linewidth, _isdown, _points, _scalex, _scaley, _usetouch, _config;
  
function _ispencil(e) {
  return e.touches && e.touches[0] && typeof e.touches[0]["force"] !== "undefined" && (_usetouch || e.touches[0]["force"] > 0);
}
  
function _handledown(e) {
  var x, y;
  if (!_ispencil(e)) return;
  x = e.touches[0].pageX * _scalex;
  y = e.touches[0].pageY * _scaley;
  _isdown = true;
  _linewidth = _config.pentype === 'eraser' ? _config.pensize * 5 : _config.pensize;
  _context.globalCompositeOperation = _config.pentype === 'eraser' ? 'destination-out' : 'source-over';
  _context.lineWidth = _linewidth;
  _context.strokeStyle = _config.pentype === 'eraser' ? '#0008' : _config.pencolor;
  _context.lineCap = 'round';
  _context.lineJoin = 'round';
  _context.beginPath();
  _context.moveTo(x, y);
  _points.push({
    x: x, y: y, linewidth: _linewidth
  });
  window.dispatchEvent(new Event('pagechanged'));
}

function _handlemove(e) {
  e.preventDefault();
  if (!_isdown || !_ispencil(e)) return;
  var x, y;
  x = e.touches[0].pageX * _scalex;
  y = e.touches[0].pageY * _scaley;
  _points.push({
    x: x, y: y, linewidth: _linewidth
  });
  _context.lineCap = 'round';
  _context.lineJoin = 'round';
  if (_points.length >= 3) {
    var l = _points.length - 1;
    var xc = (_points[l].x + _points[l - 1].x) / 2;
    var yc = (_points[l].y + _points[l - 1].y) / 2;
    _context.lineWidth = _points[l - 1].linewidth;
    _context.quadraticCurveTo(_points[l - 1].x, _points[l - 1].y, xc, yc);
    _context.stroke();
    _context.beginPath();
    _context.moveTo(xc, yc);
  }
}

function _handleup(e) {
  var x, y;
  if (!_ispencil(e)) return;
  x = e.touches[0].pageX * _scalex;
  y = e.touches[0].pageY * _scaley;
  _isdown = false;
  _context.lineCap = 'round';
  _context.lineJoin = 'round';
  if (_points.length >= 3) {
    var l = _points.length - 1;
    _context.quadraticCurveTo(_points[l].x, _points[l].y, x, y);
    _context.stroke();
  }
  _points = [];
}

export function init(canvas, config, usetouch) {
  _linewidth = 0;
  _isdown = false;
  _context = canvas.getContext('2d');
  _points = [];
  _scalex = config.width / canvas.clientWidth;
  _scaley = config.height / canvas.clientHeight;
  _usetouch = usetouch;
  _config = config;
  canvas.addEventListener("touchstart", _handledown);
  canvas.addEventListener("mousedown", _handledown);
  canvas.addEventListener("touchmove", _handlemove);
  canvas.addEventListener("mousemove", _handlemove);
  canvas.addEventListener("touchend", _handleup);
  canvas.addEventListener("touchleave", _handleup);
  canvas.addEventListener("mouseup", _handleup);
}
