import {
  installLabelLayout
} from "./chunk-TWD4YHWQ.js";
import "./chunk-535PLOHE.js";
import {
  DataDiffer_default,
  Polygon_default,
  SERIES_UNIVERSAL_TRANSITION_PROP,
  Sector_default,
  clonePath,
  getAnimationConfig,
  getOldStyle,
  initProps,
  makeInner,
  normalizeToArray,
  warn
} from "./chunk-VBNTIDHT.js";
import {
  BoundingRect_default,
  Displayable_default,
  PathProxy_default,
  Path_default,
  Point_default,
  Rect_default,
  Transformable_default,
  createHashMap,
  cubicSubdivide,
  defaults,
  each,
  extend,
  filter,
  fromPoints,
  isArray,
  lerp,
  map
} from "./chunk-QGQOLPAV.js";
import "./chunk-P2LSHJDD.js";

// ../../../../code/project/Sports-Group-buying/node_modules/zrender/lib/tool/convertPath.js
var CMD = PathProxy_default.CMD;
function aroundEqual(a, b) {
  return Math.abs(a - b) < 1e-5;
}
function pathToBezierCurves(path) {
  var data = path.data;
  var len = path.len();
  var bezierArrayGroups = [];
  var currentSubpath;
  var xi = 0;
  var yi = 0;
  var x0 = 0;
  var y0 = 0;
  function createNewSubpath(x, y) {
    if (currentSubpath && currentSubpath.length > 2) {
      bezierArrayGroups.push(currentSubpath);
    }
    currentSubpath = [x, y];
  }
  function addLine(x02, y02, x12, y12) {
    if (!(aroundEqual(x02, x12) && aroundEqual(y02, y12))) {
      currentSubpath.push(x02, y02, x12, y12, x12, y12);
    }
  }
  function addArc(startAngle2, endAngle2, cx2, cy2, rx2, ry2) {
    var delta = Math.abs(endAngle2 - startAngle2);
    var len2 = Math.tan(delta / 4) * 4 / 3;
    var dir = endAngle2 < startAngle2 ? -1 : 1;
    var c1 = Math.cos(startAngle2);
    var s1 = Math.sin(startAngle2);
    var c2 = Math.cos(endAngle2);
    var s2 = Math.sin(endAngle2);
    var x12 = c1 * rx2 + cx2;
    var y12 = s1 * ry2 + cy2;
    var x4 = c2 * rx2 + cx2;
    var y4 = s2 * ry2 + cy2;
    var hx = rx2 * len2 * dir;
    var hy = ry2 * len2 * dir;
    currentSubpath.push(x12 - hx * s1, y12 + hy * c1, x4 + hx * s2, y4 - hy * c2, x4, y4);
  }
  var x1;
  var y1;
  var x2;
  var y2;
  for (var i = 0; i < len; ) {
    var cmd = data[i++];
    var isFirst = i === 1;
    if (isFirst) {
      xi = data[i];
      yi = data[i + 1];
      x0 = xi;
      y0 = yi;
      if (cmd === CMD.L || cmd === CMD.C || cmd === CMD.Q) {
        currentSubpath = [x0, y0];
      }
    }
    switch (cmd) {
      case CMD.M:
        xi = x0 = data[i++];
        yi = y0 = data[i++];
        createNewSubpath(x0, y0);
        break;
      case CMD.L:
        x1 = data[i++];
        y1 = data[i++];
        addLine(xi, yi, x1, y1);
        xi = x1;
        yi = y1;
        break;
      case CMD.C:
        currentSubpath.push(data[i++], data[i++], data[i++], data[i++], xi = data[i++], yi = data[i++]);
        break;
      case CMD.Q:
        x1 = data[i++];
        y1 = data[i++];
        x2 = data[i++];
        y2 = data[i++];
        currentSubpath.push(xi + 2 / 3 * (x1 - xi), yi + 2 / 3 * (y1 - yi), x2 + 2 / 3 * (x1 - x2), y2 + 2 / 3 * (y1 - y2), x2, y2);
        xi = x2;
        yi = y2;
        break;
      case CMD.A:
        var cx = data[i++];
        var cy = data[i++];
        var rx = data[i++];
        var ry = data[i++];
        var startAngle = data[i++];
        var endAngle = data[i++] + startAngle;
        i += 1;
        var anticlockwise = !data[i++];
        x1 = Math.cos(startAngle) * rx + cx;
        y1 = Math.sin(startAngle) * ry + cy;
        if (isFirst) {
          x0 = x1;
          y0 = y1;
          createNewSubpath(x0, y0);
        } else {
          addLine(xi, yi, x1, y1);
        }
        xi = Math.cos(endAngle) * rx + cx;
        yi = Math.sin(endAngle) * ry + cy;
        var step = (anticlockwise ? -1 : 1) * Math.PI / 2;
        for (var angle = startAngle; anticlockwise ? angle > endAngle : angle < endAngle; angle += step) {
          var nextAngle = anticlockwise ? Math.max(angle + step, endAngle) : Math.min(angle + step, endAngle);
          addArc(angle, nextAngle, cx, cy, rx, ry);
        }
        break;
      case CMD.R:
        x0 = xi = data[i++];
        y0 = yi = data[i++];
        x1 = x0 + data[i++];
        y1 = y0 + data[i++];
        createNewSubpath(x1, y0);
        addLine(x1, y0, x1, y1);
        addLine(x1, y1, x0, y1);
        addLine(x0, y1, x0, y0);
        addLine(x0, y0, x1, y0);
        break;
      case CMD.Z:
        currentSubpath && addLine(xi, yi, x0, y0);
        xi = x0;
        yi = y0;
        break;
    }
  }
  if (currentSubpath && currentSubpath.length > 2) {
    bezierArrayGroups.push(currentSubpath);
  }
  return bezierArrayGroups;
}
function adpativeBezier(x0, y0, x1, y1, x2, y2, x3, y3, out, scale) {
  if (aroundEqual(x0, x1) && aroundEqual(y0, y1) && aroundEqual(x2, x3) && aroundEqual(y2, y3)) {
    out.push(x3, y3);
    return;
  }
  var PIXEL_DISTANCE = 2 / scale;
  var PIXEL_DISTANCE_SQR = PIXEL_DISTANCE * PIXEL_DISTANCE;
  var dx = x3 - x0;
  var dy = y3 - y0;
  var d = Math.sqrt(dx * dx + dy * dy);
  dx /= d;
  dy /= d;
  var dx1 = x1 - x0;
  var dy1 = y1 - y0;
  var dx2 = x2 - x3;
  var dy2 = y2 - y3;
  var cp1LenSqr = dx1 * dx1 + dy1 * dy1;
  var cp2LenSqr = dx2 * dx2 + dy2 * dy2;
  if (cp1LenSqr < PIXEL_DISTANCE_SQR && cp2LenSqr < PIXEL_DISTANCE_SQR) {
    out.push(x3, y3);
    return;
  }
  var projLen1 = dx * dx1 + dy * dy1;
  var projLen2 = -dx * dx2 - dy * dy2;
  var d1Sqr = cp1LenSqr - projLen1 * projLen1;
  var d2Sqr = cp2LenSqr - projLen2 * projLen2;
  if (d1Sqr < PIXEL_DISTANCE_SQR && projLen1 >= 0 && d2Sqr < PIXEL_DISTANCE_SQR && projLen2 >= 0) {
    out.push(x3, y3);
    return;
  }
  var tmpSegX = [];
  var tmpSegY = [];
  cubicSubdivide(x0, x1, x2, x3, 0.5, tmpSegX);
  cubicSubdivide(y0, y1, y2, y3, 0.5, tmpSegY);
  adpativeBezier(tmpSegX[0], tmpSegY[0], tmpSegX[1], tmpSegY[1], tmpSegX[2], tmpSegY[2], tmpSegX[3], tmpSegY[3], out, scale);
  adpativeBezier(tmpSegX[4], tmpSegY[4], tmpSegX[5], tmpSegY[5], tmpSegX[6], tmpSegY[6], tmpSegX[7], tmpSegY[7], out, scale);
}
function pathToPolygons(path, scale) {
  var bezierArrayGroups = pathToBezierCurves(path);
  var polygons = [];
  scale = scale || 1;
  for (var i = 0; i < bezierArrayGroups.length; i++) {
    var beziers = bezierArrayGroups[i];
    var polygon = [];
    var x0 = beziers[0];
    var y0 = beziers[1];
    polygon.push(x0, y0);
    for (var k = 2; k < beziers.length; ) {
      var x1 = beziers[k++];
      var y1 = beziers[k++];
      var x2 = beziers[k++];
      var y2 = beziers[k++];
      var x3 = beziers[k++];
      var y3 = beziers[k++];
      adpativeBezier(x0, y0, x1, y1, x2, y2, x3, y3, polygon, scale);
      x0 = x3;
      y0 = y3;
    }
    polygons.push(polygon);
  }
  return polygons;
}

// ../../../../code/project/Sports-Group-buying/node_modules/zrender/lib/tool/dividePath.js
function getDividingGrids(dimSize, rowDim, count) {
  var rowSize = dimSize[rowDim];
  var columnSize = dimSize[1 - rowDim];
  var ratio = Math.abs(rowSize / columnSize);
  var rowCount = Math.ceil(Math.sqrt(ratio * count));
  var columnCount = Math.floor(count / rowCount);
  if (columnCount === 0) {
    columnCount = 1;
    rowCount = count;
  }
  var grids = [];
  for (var i = 0; i < rowCount; i++) {
    grids.push(columnCount);
  }
  var currentCount = rowCount * columnCount;
  var remained = count - currentCount;
  if (remained > 0) {
    for (var i = 0; i < remained; i++) {
      grids[i % rowCount] += 1;
    }
  }
  return grids;
}
function divideSector(sectorShape, count, outShapes) {
  var r0 = sectorShape.r0;
  var r = sectorShape.r;
  var startAngle = sectorShape.startAngle;
  var endAngle = sectorShape.endAngle;
  var angle = Math.abs(endAngle - startAngle);
  var arcLen = angle * r;
  var deltaR = r - r0;
  var isAngleRow = arcLen > Math.abs(deltaR);
  var grids = getDividingGrids([arcLen, deltaR], isAngleRow ? 0 : 1, count);
  var rowSize = (isAngleRow ? angle : deltaR) / grids.length;
  for (var row = 0; row < grids.length; row++) {
    var columnSize = (isAngleRow ? deltaR : angle) / grids[row];
    for (var column = 0; column < grids[row]; column++) {
      var newShape = {};
      if (isAngleRow) {
        newShape.startAngle = startAngle + rowSize * row;
        newShape.endAngle = startAngle + rowSize * (row + 1);
        newShape.r0 = r0 + columnSize * column;
        newShape.r = r0 + columnSize * (column + 1);
      } else {
        newShape.startAngle = startAngle + columnSize * column;
        newShape.endAngle = startAngle + columnSize * (column + 1);
        newShape.r0 = r0 + rowSize * row;
        newShape.r = r0 + rowSize * (row + 1);
      }
      newShape.clockwise = sectorShape.clockwise;
      newShape.cx = sectorShape.cx;
      newShape.cy = sectorShape.cy;
      outShapes.push(newShape);
    }
  }
}
function divideRect(rectShape, count, outShapes) {
  var width = rectShape.width;
  var height = rectShape.height;
  var isHorizontalRow = width > height;
  var grids = getDividingGrids([width, height], isHorizontalRow ? 0 : 1, count);
  var rowSizeDim = isHorizontalRow ? "width" : "height";
  var columnSizeDim = isHorizontalRow ? "height" : "width";
  var rowDim = isHorizontalRow ? "x" : "y";
  var columnDim = isHorizontalRow ? "y" : "x";
  var rowSize = rectShape[rowSizeDim] / grids.length;
  for (var row = 0; row < grids.length; row++) {
    var columnSize = rectShape[columnSizeDim] / grids[row];
    for (var column = 0; column < grids[row]; column++) {
      var newShape = {};
      newShape[rowDim] = row * rowSize;
      newShape[columnDim] = column * columnSize;
      newShape[rowSizeDim] = rowSize;
      newShape[columnSizeDim] = columnSize;
      newShape.x += rectShape.x;
      newShape.y += rectShape.y;
      outShapes.push(newShape);
    }
  }
}
function crossProduct2d(x1, y1, x2, y2) {
  return x1 * y2 - x2 * y1;
}
function lineLineIntersect(a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y) {
  var mx = a2x - a1x;
  var my = a2y - a1y;
  var nx = b2x - b1x;
  var ny = b2y - b1y;
  var nmCrossProduct = crossProduct2d(nx, ny, mx, my);
  if (Math.abs(nmCrossProduct) < 1e-6) {
    return null;
  }
  var b1a1x = a1x - b1x;
  var b1a1y = a1y - b1y;
  var p = crossProduct2d(b1a1x, b1a1y, nx, ny) / nmCrossProduct;
  if (p < 0 || p > 1) {
    return null;
  }
  return new Point_default(p * mx + a1x, p * my + a1y);
}
function projPtOnLine(pt, lineA, lineB) {
  var dir = new Point_default();
  Point_default.sub(dir, lineB, lineA);
  dir.normalize();
  var dir2 = new Point_default();
  Point_default.sub(dir2, pt, lineA);
  var len = dir2.dot(dir);
  return len;
}
function addToPoly(poly, pt) {
  var last = poly[poly.length - 1];
  if (last && last[0] === pt[0] && last[1] === pt[1]) {
    return;
  }
  poly.push(pt);
}
function splitPolygonByLine(points, lineA, lineB) {
  var len = points.length;
  var intersections = [];
  for (var i = 0; i < len; i++) {
    var p0 = points[i];
    var p1 = points[(i + 1) % len];
    var intersectionPt = lineLineIntersect(p0[0], p0[1], p1[0], p1[1], lineA.x, lineA.y, lineB.x, lineB.y);
    if (intersectionPt) {
      intersections.push({
        projPt: projPtOnLine(intersectionPt, lineA, lineB),
        pt: intersectionPt,
        idx: i
      });
    }
  }
  if (intersections.length < 2) {
    return [{ points }, { points }];
  }
  intersections.sort(function(a, b) {
    return a.projPt - b.projPt;
  });
  var splitPt0 = intersections[0];
  var splitPt1 = intersections[intersections.length - 1];
  if (splitPt1.idx < splitPt0.idx) {
    var tmp = splitPt0;
    splitPt0 = splitPt1;
    splitPt1 = tmp;
  }
  var splitPt0Arr = [splitPt0.pt.x, splitPt0.pt.y];
  var splitPt1Arr = [splitPt1.pt.x, splitPt1.pt.y];
  var newPolyA = [splitPt0Arr];
  var newPolyB = [splitPt1Arr];
  for (var i = splitPt0.idx + 1; i <= splitPt1.idx; i++) {
    addToPoly(newPolyA, points[i].slice());
  }
  addToPoly(newPolyA, splitPt1Arr);
  addToPoly(newPolyA, splitPt0Arr);
  for (var i = splitPt1.idx + 1; i <= splitPt0.idx + len; i++) {
    addToPoly(newPolyB, points[i % len].slice());
  }
  addToPoly(newPolyB, splitPt0Arr);
  addToPoly(newPolyB, splitPt1Arr);
  return [{
    points: newPolyA
  }, {
    points: newPolyB
  }];
}
function binaryDividePolygon(polygonShape) {
  var points = polygonShape.points;
  var min = [];
  var max = [];
  fromPoints(points, min, max);
  var boundingRect = new BoundingRect_default(min[0], min[1], max[0] - min[0], max[1] - min[1]);
  var width = boundingRect.width;
  var height = boundingRect.height;
  var x = boundingRect.x;
  var y = boundingRect.y;
  var pt0 = new Point_default();
  var pt1 = new Point_default();
  if (width > height) {
    pt0.x = pt1.x = x + width / 2;
    pt0.y = y;
    pt1.y = y + height;
  } else {
    pt0.y = pt1.y = y + height / 2;
    pt0.x = x;
    pt1.x = x + width;
  }
  return splitPolygonByLine(points, pt0, pt1);
}
function binaryDivideRecursive(divider, shape, count, out) {
  if (count === 1) {
    out.push(shape);
  } else {
    var mid = Math.floor(count / 2);
    var sub = divider(shape);
    binaryDivideRecursive(divider, sub[0], mid, out);
    binaryDivideRecursive(divider, sub[1], count - mid, out);
  }
  return out;
}
function clone(path, count) {
  var paths = [];
  for (var i = 0; i < count; i++) {
    paths.push(clonePath(path));
  }
  return paths;
}
function copyPathProps(source, target) {
  target.setStyle(source.style);
  target.z = source.z;
  target.z2 = source.z2;
  target.zlevel = source.zlevel;
}
function polygonConvert(points) {
  var out = [];
  for (var i = 0; i < points.length; ) {
    out.push([points[i++], points[i++]]);
  }
  return out;
}
function split(path, count) {
  var outShapes = [];
  var shape = path.shape;
  var OutShapeCtor;
  switch (path.type) {
    case "rect":
      divideRect(shape, count, outShapes);
      OutShapeCtor = Rect_default;
      break;
    case "sector":
      divideSector(shape, count, outShapes);
      OutShapeCtor = Sector_default;
      break;
    case "circle":
      divideSector({
        r0: 0,
        r: shape.r,
        startAngle: 0,
        endAngle: Math.PI * 2,
        cx: shape.cx,
        cy: shape.cy
      }, count, outShapes);
      OutShapeCtor = Sector_default;
      break;
    default:
      var m = path.getComputedTransform();
      var scale = m ? Math.sqrt(Math.max(m[0] * m[0] + m[1] * m[1], m[2] * m[2] + m[3] * m[3])) : 1;
      var polygons = map(pathToPolygons(path.getUpdatedPathProxy(), scale), function(poly) {
        return polygonConvert(poly);
      });
      var polygonCount = polygons.length;
      if (polygonCount === 0) {
        binaryDivideRecursive(binaryDividePolygon, {
          points: polygons[0]
        }, count, outShapes);
      } else if (polygonCount === count) {
        for (var i = 0; i < polygonCount; i++) {
          outShapes.push({
            points: polygons[i]
          });
        }
      } else {
        var totalArea_1 = 0;
        var items = map(polygons, function(poly) {
          var min = [];
          var max = [];
          fromPoints(poly, min, max);
          var area = (max[1] - min[1]) * (max[0] - min[0]);
          totalArea_1 += area;
          return { poly, area };
        });
        items.sort(function(a, b) {
          return b.area - a.area;
        });
        var left = count;
        for (var i = 0; i < polygonCount; i++) {
          var item = items[i];
          if (left <= 0) {
            break;
          }
          var selfCount = i === polygonCount - 1 ? left : Math.ceil(item.area / totalArea_1 * count);
          if (selfCount < 0) {
            continue;
          }
          binaryDivideRecursive(binaryDividePolygon, {
            points: item.poly
          }, selfCount, outShapes);
          left -= selfCount;
        }
        ;
      }
      OutShapeCtor = Polygon_default;
      break;
  }
  if (!OutShapeCtor) {
    return clone(path, count);
  }
  var out = [];
  for (var i = 0; i < outShapes.length; i++) {
    var subPath = new OutShapeCtor();
    subPath.setShape(outShapes[i]);
    copyPathProps(path, subPath);
    out.push(subPath);
  }
  return out;
}

// ../../../../code/project/Sports-Group-buying/node_modules/zrender/lib/tool/morphPath.js
function alignSubpath(subpath1, subpath2) {
  var len1 = subpath1.length;
  var len2 = subpath2.length;
  if (len1 === len2) {
    return [subpath1, subpath2];
  }
  var tmpSegX = [];
  var tmpSegY = [];
  var shorterPath = len1 < len2 ? subpath1 : subpath2;
  var shorterLen = Math.min(len1, len2);
  var diff = Math.abs(len2 - len1) / 6;
  var shorterBezierCount = (shorterLen - 2) / 6;
  var eachCurveSubDivCount = Math.ceil(diff / shorterBezierCount) + 1;
  var newSubpath = [shorterPath[0], shorterPath[1]];
  var remained = diff;
  for (var i = 2; i < shorterLen; ) {
    var x0 = shorterPath[i - 2];
    var y0 = shorterPath[i - 1];
    var x1 = shorterPath[i++];
    var y1 = shorterPath[i++];
    var x2 = shorterPath[i++];
    var y2 = shorterPath[i++];
    var x3 = shorterPath[i++];
    var y3 = shorterPath[i++];
    if (remained <= 0) {
      newSubpath.push(x1, y1, x2, y2, x3, y3);
      continue;
    }
    var actualSubDivCount = Math.min(remained, eachCurveSubDivCount - 1) + 1;
    for (var k = 1; k <= actualSubDivCount; k++) {
      var p = k / actualSubDivCount;
      cubicSubdivide(x0, x1, x2, x3, p, tmpSegX);
      cubicSubdivide(y0, y1, y2, y3, p, tmpSegY);
      x0 = tmpSegX[3];
      y0 = tmpSegY[3];
      newSubpath.push(tmpSegX[1], tmpSegY[1], tmpSegX[2], tmpSegY[2], x0, y0);
      x1 = tmpSegX[5];
      y1 = tmpSegY[5];
      x2 = tmpSegX[6];
      y2 = tmpSegY[6];
    }
    remained -= actualSubDivCount - 1;
  }
  return shorterPath === subpath1 ? [newSubpath, subpath2] : [subpath1, newSubpath];
}
function createSubpath(lastSubpathSubpath, otherSubpath) {
  var len = lastSubpathSubpath.length;
  var lastX = lastSubpathSubpath[len - 2];
  var lastY = lastSubpathSubpath[len - 1];
  var newSubpath = [];
  for (var i = 0; i < otherSubpath.length; ) {
    newSubpath[i++] = lastX;
    newSubpath[i++] = lastY;
  }
  return newSubpath;
}
function alignBezierCurves(array1, array2) {
  var _a;
  var lastSubpath1;
  var lastSubpath2;
  var newArray1 = [];
  var newArray2 = [];
  for (var i = 0; i < Math.max(array1.length, array2.length); i++) {
    var subpath1 = array1[i];
    var subpath2 = array2[i];
    var newSubpath1 = void 0;
    var newSubpath2 = void 0;
    if (!subpath1) {
      newSubpath1 = createSubpath(lastSubpath1 || subpath2, subpath2);
      newSubpath2 = subpath2;
    } else if (!subpath2) {
      newSubpath2 = createSubpath(lastSubpath2 || subpath1, subpath1);
      newSubpath1 = subpath1;
    } else {
      _a = alignSubpath(subpath1, subpath2), newSubpath1 = _a[0], newSubpath2 = _a[1];
      lastSubpath1 = newSubpath1;
      lastSubpath2 = newSubpath2;
    }
    newArray1.push(newSubpath1);
    newArray2.push(newSubpath2);
  }
  return [newArray1, newArray2];
}
function centroid(array) {
  var signedArea = 0;
  var cx = 0;
  var cy = 0;
  var len = array.length;
  for (var i = 0, j = len - 2; i < len; j = i, i += 2) {
    var x0 = array[j];
    var y0 = array[j + 1];
    var x1 = array[i];
    var y1 = array[i + 1];
    var a = x0 * y1 - x1 * y0;
    signedArea += a;
    cx += (x0 + x1) * a;
    cy += (y0 + y1) * a;
  }
  if (signedArea === 0) {
    return [array[0] || 0, array[1] || 0];
  }
  return [cx / signedArea / 3, cy / signedArea / 3, signedArea];
}
function findBestRingOffset(fromSubBeziers, toSubBeziers, fromCp, toCp) {
  var bezierCount = (fromSubBeziers.length - 2) / 6;
  var bestScore = Infinity;
  var bestOffset = 0;
  var len = fromSubBeziers.length;
  var len2 = len - 2;
  for (var offset = 0; offset < bezierCount; offset++) {
    var cursorOffset = offset * 6;
    var score = 0;
    for (var k = 0; k < len; k += 2) {
      var idx = k === 0 ? cursorOffset : (cursorOffset + k - 2) % len2 + 2;
      var x0 = fromSubBeziers[idx] - fromCp[0];
      var y0 = fromSubBeziers[idx + 1] - fromCp[1];
      var x1 = toSubBeziers[k] - toCp[0];
      var y1 = toSubBeziers[k + 1] - toCp[1];
      var dx = x1 - x0;
      var dy = y1 - y0;
      score += dx * dx + dy * dy;
    }
    if (score < bestScore) {
      bestScore = score;
      bestOffset = offset;
    }
  }
  return bestOffset;
}
function reverse(array) {
  var newArr = [];
  var len = array.length;
  for (var i = 0; i < len; i += 2) {
    newArr[i] = array[len - i - 2];
    newArr[i + 1] = array[len - i - 1];
  }
  return newArr;
}
function findBestMorphingRotation(fromArr, toArr, searchAngleIteration, searchAngleRange) {
  var result = [];
  var fromNeedsReverse;
  for (var i = 0; i < fromArr.length; i++) {
    var fromSubpathBezier = fromArr[i];
    var toSubpathBezier = toArr[i];
    var fromCp = centroid(fromSubpathBezier);
    var toCp = centroid(toSubpathBezier);
    if (fromNeedsReverse == null) {
      fromNeedsReverse = fromCp[2] < 0 !== toCp[2] < 0;
    }
    var newFromSubpathBezier = [];
    var newToSubpathBezier = [];
    var bestAngle = 0;
    var bestScore = Infinity;
    var tmpArr = [];
    var len = fromSubpathBezier.length;
    if (fromNeedsReverse) {
      fromSubpathBezier = reverse(fromSubpathBezier);
    }
    var offset = findBestRingOffset(fromSubpathBezier, toSubpathBezier, fromCp, toCp) * 6;
    var len2 = len - 2;
    for (var k = 0; k < len2; k += 2) {
      var idx = (offset + k) % len2 + 2;
      newFromSubpathBezier[k + 2] = fromSubpathBezier[idx] - fromCp[0];
      newFromSubpathBezier[k + 3] = fromSubpathBezier[idx + 1] - fromCp[1];
    }
    newFromSubpathBezier[0] = fromSubpathBezier[offset] - fromCp[0];
    newFromSubpathBezier[1] = fromSubpathBezier[offset + 1] - fromCp[1];
    if (searchAngleIteration > 0) {
      var step = searchAngleRange / searchAngleIteration;
      for (var angle = -searchAngleRange / 2; angle <= searchAngleRange / 2; angle += step) {
        var sa = Math.sin(angle);
        var ca = Math.cos(angle);
        var score = 0;
        for (var k = 0; k < fromSubpathBezier.length; k += 2) {
          var x0 = newFromSubpathBezier[k];
          var y0 = newFromSubpathBezier[k + 1];
          var x1 = toSubpathBezier[k] - toCp[0];
          var y1 = toSubpathBezier[k + 1] - toCp[1];
          var newX1 = x1 * ca - y1 * sa;
          var newY1 = x1 * sa + y1 * ca;
          tmpArr[k] = newX1;
          tmpArr[k + 1] = newY1;
          var dx = newX1 - x0;
          var dy = newY1 - y0;
          score += dx * dx + dy * dy;
        }
        if (score < bestScore) {
          bestScore = score;
          bestAngle = angle;
          for (var m = 0; m < tmpArr.length; m++) {
            newToSubpathBezier[m] = tmpArr[m];
          }
        }
      }
    } else {
      for (var i_1 = 0; i_1 < len; i_1 += 2) {
        newToSubpathBezier[i_1] = toSubpathBezier[i_1] - toCp[0];
        newToSubpathBezier[i_1 + 1] = toSubpathBezier[i_1 + 1] - toCp[1];
      }
    }
    result.push({
      from: newFromSubpathBezier,
      to: newToSubpathBezier,
      fromCp,
      toCp,
      rotation: -bestAngle
    });
  }
  return result;
}
function isCombineMorphing(path) {
  return path.__isCombineMorphing;
}
var SAVED_METHOD_PREFIX = "__mOriginal_";
function saveAndModifyMethod(obj, methodName, modifiers) {
  var savedMethodName = SAVED_METHOD_PREFIX + methodName;
  var originalMethod = obj[savedMethodName] || obj[methodName];
  if (!obj[savedMethodName]) {
    obj[savedMethodName] = obj[methodName];
  }
  var replace = modifiers.replace;
  var after = modifiers.after;
  var before = modifiers.before;
  obj[methodName] = function() {
    var args = arguments;
    var res;
    before && before.apply(this, args);
    if (replace) {
      res = replace.apply(this, args);
    } else {
      res = originalMethod.apply(this, args);
    }
    after && after.apply(this, args);
    return res;
  };
}
function restoreMethod(obj, methodName) {
  var savedMethodName = SAVED_METHOD_PREFIX + methodName;
  if (obj[savedMethodName]) {
    obj[methodName] = obj[savedMethodName];
    obj[savedMethodName] = null;
  }
}
function applyTransformOnBeziers(bezierCurves, mm) {
  for (var i = 0; i < bezierCurves.length; i++) {
    var subBeziers = bezierCurves[i];
    for (var k = 0; k < subBeziers.length; ) {
      var x = subBeziers[k];
      var y = subBeziers[k + 1];
      subBeziers[k++] = mm[0] * x + mm[2] * y + mm[4];
      subBeziers[k++] = mm[1] * x + mm[3] * y + mm[5];
    }
  }
}
function prepareMorphPath(fromPath, toPath) {
  var fromPathProxy = fromPath.getUpdatedPathProxy();
  var toPathProxy = toPath.getUpdatedPathProxy();
  var _a = alignBezierCurves(pathToBezierCurves(fromPathProxy), pathToBezierCurves(toPathProxy)), fromBezierCurves = _a[0], toBezierCurves = _a[1];
  var fromPathTransform = fromPath.getComputedTransform();
  var toPathTransform = toPath.getComputedTransform();
  function updateIdentityTransform() {
    this.transform = null;
  }
  fromPathTransform && applyTransformOnBeziers(fromBezierCurves, fromPathTransform);
  toPathTransform && applyTransformOnBeziers(toBezierCurves, toPathTransform);
  saveAndModifyMethod(toPath, "updateTransform", { replace: updateIdentityTransform });
  toPath.transform = null;
  var morphingData = findBestMorphingRotation(fromBezierCurves, toBezierCurves, 10, Math.PI);
  var tmpArr = [];
  saveAndModifyMethod(toPath, "buildPath", { replace: function(path) {
    var t = toPath.__morphT;
    var onet = 1 - t;
    var newCp = [];
    for (var i = 0; i < morphingData.length; i++) {
      var item = morphingData[i];
      var from = item.from;
      var to = item.to;
      var angle = item.rotation * t;
      var fromCp = item.fromCp;
      var toCp = item.toCp;
      var sa = Math.sin(angle);
      var ca = Math.cos(angle);
      lerp(newCp, fromCp, toCp, t);
      for (var m = 0; m < from.length; m += 2) {
        var x0_1 = from[m];
        var y0_1 = from[m + 1];
        var x1 = to[m];
        var y1 = to[m + 1];
        var x = x0_1 * onet + x1 * t;
        var y = y0_1 * onet + y1 * t;
        tmpArr[m] = x * ca - y * sa + newCp[0];
        tmpArr[m + 1] = x * sa + y * ca + newCp[1];
      }
      var x0 = tmpArr[0];
      var y0 = tmpArr[1];
      path.moveTo(x0, y0);
      for (var m = 2; m < from.length; ) {
        var x1 = tmpArr[m++];
        var y1 = tmpArr[m++];
        var x2 = tmpArr[m++];
        var y2 = tmpArr[m++];
        var x3 = tmpArr[m++];
        var y3 = tmpArr[m++];
        if (x0 === x1 && y0 === y1 && x2 === x3 && y2 === y3) {
          path.lineTo(x3, y3);
        } else {
          path.bezierCurveTo(x1, y1, x2, y2, x3, y3);
        }
        x0 = x3;
        y0 = y3;
      }
    }
  } });
}
function morphPath(fromPath, toPath, animationOpts) {
  if (!fromPath || !toPath) {
    return toPath;
  }
  var oldDone = animationOpts.done;
  var oldDuring = animationOpts.during;
  prepareMorphPath(fromPath, toPath);
  toPath.__morphT = 0;
  function restoreToPath() {
    restoreMethod(toPath, "buildPath");
    restoreMethod(toPath, "updateTransform");
    toPath.__morphT = -1;
    toPath.createPathProxy();
    toPath.dirtyShape();
  }
  toPath.animateTo({
    __morphT: 1
  }, defaults({
    during: function(p) {
      toPath.dirtyShape();
      oldDuring && oldDuring(p);
    },
    done: function() {
      restoreToPath();
      oldDone && oldDone();
    }
  }, animationOpts));
  return toPath;
}
function hilbert(x, y, minX, minY, maxX, maxY) {
  var bits = 16;
  x = maxX === minX ? 0 : Math.round(32767 * (x - minX) / (maxX - minX));
  y = maxY === minY ? 0 : Math.round(32767 * (y - minY) / (maxY - minY));
  var d = 0;
  var tmp;
  for (var s = (1 << bits) / 2; s > 0; s /= 2) {
    var rx = 0;
    var ry = 0;
    if ((x & s) > 0) {
      rx = 1;
    }
    if ((y & s) > 0) {
      ry = 1;
    }
    d += s * s * (3 * rx ^ ry);
    if (ry === 0) {
      if (rx === 1) {
        x = s - 1 - x;
        y = s - 1 - y;
      }
      tmp = x;
      x = y;
      y = tmp;
    }
  }
  return d;
}
function sortPaths(pathList) {
  var xMin = Infinity;
  var yMin = Infinity;
  var xMax = -Infinity;
  var yMax = -Infinity;
  var cps = map(pathList, function(path) {
    var rect = path.getBoundingRect();
    var m = path.getComputedTransform();
    var x = rect.x + rect.width / 2 + (m ? m[4] : 0);
    var y = rect.y + rect.height / 2 + (m ? m[5] : 0);
    xMin = Math.min(x, xMin);
    yMin = Math.min(y, yMin);
    xMax = Math.max(x, xMax);
    yMax = Math.max(y, yMax);
    return [x, y];
  });
  var items = map(cps, function(cp, idx) {
    return {
      cp,
      z: hilbert(cp[0], cp[1], xMin, yMin, xMax, yMax),
      path: pathList[idx]
    };
  });
  return items.sort(function(a, b) {
    return a.z - b.z;
  }).map(function(item) {
    return item.path;
  });
}
function defaultDividePath(param) {
  return split(param.path, param.count);
}
function createEmptyReturn() {
  return {
    fromIndividuals: [],
    toIndividuals: [],
    count: 0
  };
}
function combineMorph(fromList, toPath, animationOpts) {
  var fromPathList = [];
  function addFromPath(fromList2) {
    for (var i2 = 0; i2 < fromList2.length; i2++) {
      var from2 = fromList2[i2];
      if (isCombineMorphing(from2)) {
        addFromPath(from2.childrenRef());
      } else if (from2 instanceof Path_default) {
        fromPathList.push(from2);
      }
    }
  }
  addFromPath(fromList);
  var separateCount = fromPathList.length;
  if (!separateCount) {
    return createEmptyReturn();
  }
  var dividePath = animationOpts.dividePath || defaultDividePath;
  var toSubPathList = dividePath({
    path: toPath,
    count: separateCount
  });
  if (toSubPathList.length !== separateCount) {
    console.error("Invalid morphing: unmatched splitted path");
    return createEmptyReturn();
  }
  fromPathList = sortPaths(fromPathList);
  toSubPathList = sortPaths(toSubPathList);
  var oldDone = animationOpts.done;
  var oldDuring = animationOpts.during;
  var individualDelay = animationOpts.individualDelay;
  var identityTransform = new Transformable_default();
  for (var i = 0; i < separateCount; i++) {
    var from = fromPathList[i];
    var to = toSubPathList[i];
    to.parent = toPath;
    to.copyTransform(identityTransform);
    if (!individualDelay) {
      prepareMorphPath(from, to);
    }
  }
  toPath.__isCombineMorphing = true;
  toPath.childrenRef = function() {
    return toSubPathList;
  };
  function addToSubPathListToZr(zr) {
    for (var i2 = 0; i2 < toSubPathList.length; i2++) {
      toSubPathList[i2].addSelfToZr(zr);
    }
  }
  saveAndModifyMethod(toPath, "addSelfToZr", {
    after: function(zr) {
      addToSubPathListToZr(zr);
    }
  });
  saveAndModifyMethod(toPath, "removeSelfFromZr", {
    after: function(zr) {
      for (var i2 = 0; i2 < toSubPathList.length; i2++) {
        toSubPathList[i2].removeSelfFromZr(zr);
      }
    }
  });
  function restoreToPath() {
    toPath.__isCombineMorphing = false;
    toPath.__morphT = -1;
    toPath.childrenRef = null;
    restoreMethod(toPath, "addSelfToZr");
    restoreMethod(toPath, "removeSelfFromZr");
  }
  var toLen = toSubPathList.length;
  if (individualDelay) {
    var animating_1 = toLen;
    var eachDone = function() {
      animating_1--;
      if (animating_1 === 0) {
        restoreToPath();
        oldDone && oldDone();
      }
    };
    for (var i = 0; i < toLen; i++) {
      var indivdualAnimationOpts = individualDelay ? defaults({
        delay: (animationOpts.delay || 0) + individualDelay(i, toLen, fromPathList[i], toSubPathList[i]),
        done: eachDone
      }, animationOpts) : animationOpts;
      morphPath(fromPathList[i], toSubPathList[i], indivdualAnimationOpts);
    }
  } else {
    toPath.__morphT = 0;
    toPath.animateTo({
      __morphT: 1
    }, defaults({
      during: function(p) {
        for (var i2 = 0; i2 < toLen; i2++) {
          var child = toSubPathList[i2];
          child.__morphT = toPath.__morphT;
          child.dirtyShape();
        }
        oldDuring && oldDuring(p);
      },
      done: function() {
        restoreToPath();
        for (var i2 = 0; i2 < fromList.length; i2++) {
          restoreMethod(fromList[i2], "updateTransform");
        }
        oldDone && oldDone();
      }
    }, animationOpts));
  }
  if (toPath.__zr) {
    addToSubPathListToZr(toPath.__zr);
  }
  return {
    fromIndividuals: fromPathList,
    toIndividuals: toSubPathList,
    count: toLen
  };
}
function separateMorph(fromPath, toPathList, animationOpts) {
  var toLen = toPathList.length;
  var fromPathList = [];
  var dividePath = animationOpts.dividePath || defaultDividePath;
  function addFromPath(fromList) {
    for (var i2 = 0; i2 < fromList.length; i2++) {
      var from = fromList[i2];
      if (isCombineMorphing(from)) {
        addFromPath(from.childrenRef());
      } else if (from instanceof Path_default) {
        fromPathList.push(from);
      }
    }
  }
  if (isCombineMorphing(fromPath)) {
    addFromPath(fromPath.childrenRef());
    var fromLen = fromPathList.length;
    if (fromLen < toLen) {
      var k = 0;
      for (var i = fromLen; i < toLen; i++) {
        fromPathList.push(clonePath(fromPathList[k++ % fromLen]));
      }
    }
    fromPathList.length = toLen;
  } else {
    fromPathList = dividePath({ path: fromPath, count: toLen });
    var fromPathTransform = fromPath.getComputedTransform();
    for (var i = 0; i < fromPathList.length; i++) {
      fromPathList[i].setLocalTransform(fromPathTransform);
    }
    if (fromPathList.length !== toLen) {
      console.error("Invalid morphing: unmatched splitted path");
      return createEmptyReturn();
    }
  }
  fromPathList = sortPaths(fromPathList);
  toPathList = sortPaths(toPathList);
  var individualDelay = animationOpts.individualDelay;
  for (var i = 0; i < toLen; i++) {
    var indivdualAnimationOpts = individualDelay ? defaults({
      delay: (animationOpts.delay || 0) + individualDelay(i, toLen, fromPathList[i], toPathList[i])
    }, animationOpts) : animationOpts;
    morphPath(fromPathList[i], toPathList[i], indivdualAnimationOpts);
  }
  return {
    fromIndividuals: fromPathList,
    toIndividuals: toPathList,
    count: toPathList.length
  };
}

// ../../../../code/project/Sports-Group-buying/node_modules/echarts/lib/animation/morphTransitionHelper.js
function isMultiple(elements) {
  return isArray(elements[0]);
}
function prepareMorphBatches(one, many) {
  var batches = [];
  var batchCount = one.length;
  for (var i = 0; i < batchCount; i++) {
    batches.push({
      one: one[i],
      many: []
    });
  }
  for (var i = 0; i < many.length; i++) {
    var len = many[i].length;
    var k = void 0;
    for (k = 0; k < len; k++) {
      batches[k % batchCount].many.push(many[i][k]);
    }
  }
  var off = 0;
  for (var i = batchCount - 1; i >= 0; i--) {
    if (!batches[i].many.length) {
      var moveFrom = batches[off].many;
      if (moveFrom.length <= 1) {
        if (off) {
          off = 0;
        } else {
          return batches;
        }
      }
      var len = moveFrom.length;
      var mid = Math.ceil(len / 2);
      batches[i].many = moveFrom.slice(mid, len);
      batches[off].many = moveFrom.slice(0, mid);
      off++;
    }
  }
  return batches;
}
var pathDividers = {
  clone: function(params) {
    var ret = [];
    var approxOpacity = 1 - Math.pow(1 - params.path.style.opacity, 1 / params.count);
    for (var i = 0; i < params.count; i++) {
      var cloned = clonePath(params.path);
      cloned.setStyle("opacity", approxOpacity);
      ret.push(cloned);
    }
    return ret;
  },
  // Use the default divider
  split: null
};
function applyMorphAnimation(from, to, divideShape, seriesModel, dataIndex, animateOtherProps) {
  if (!from.length || !to.length) {
    return;
  }
  var updateAnimationCfg = getAnimationConfig("update", seriesModel, dataIndex);
  if (!(updateAnimationCfg && updateAnimationCfg.duration > 0)) {
    return;
  }
  var animationDelay = seriesModel.getModel("universalTransition").get("delay");
  var animationCfg = Object.assign({
    // Need to setToFinal so the further calculation based on the style can be correct.
    // Like emphasis color.
    setToFinal: true
  }, updateAnimationCfg);
  var many;
  var one;
  if (isMultiple(from)) {
    many = from;
    one = to;
  }
  if (isMultiple(to)) {
    many = to;
    one = from;
  }
  function morphOneBatch(batch, fromIsMany2, animateIndex2, animateCount2, forceManyOne) {
    var batchMany = batch.many;
    var batchOne = batch.one;
    if (batchMany.length === 1 && !forceManyOne) {
      var batchFrom = fromIsMany2 ? batchMany[0] : batchOne;
      var batchTo = fromIsMany2 ? batchOne : batchMany[0];
      if (isCombineMorphing(batchFrom)) {
        morphOneBatch({
          many: [batchFrom],
          one: batchTo
        }, true, animateIndex2, animateCount2, true);
      } else {
        var individualAnimationCfg = animationDelay ? defaults({
          delay: animationDelay(animateIndex2, animateCount2)
        }, animationCfg) : animationCfg;
        morphPath(batchFrom, batchTo, individualAnimationCfg);
        animateOtherProps(batchFrom, batchTo, batchFrom, batchTo, individualAnimationCfg);
      }
    } else {
      var separateAnimationCfg = defaults({
        dividePath: pathDividers[divideShape],
        individualDelay: animationDelay && function(idx, count2, fromPath, toPath) {
          return animationDelay(idx + animateIndex2, animateCount2);
        }
      }, animationCfg);
      var _a = fromIsMany2 ? combineMorph(batchMany, batchOne, separateAnimationCfg) : separateMorph(batchOne, batchMany, separateAnimationCfg), fromIndividuals = _a.fromIndividuals, toIndividuals = _a.toIndividuals;
      var count = fromIndividuals.length;
      for (var k = 0; k < count; k++) {
        var individualAnimationCfg = animationDelay ? defaults({
          delay: animationDelay(k, count)
        }, animationCfg) : animationCfg;
        animateOtherProps(fromIndividuals[k], toIndividuals[k], fromIsMany2 ? batchMany[k] : batch.one, fromIsMany2 ? batch.one : batchMany[k], individualAnimationCfg);
      }
    }
  }
  var fromIsMany = many ? many === from : from.length > to.length;
  var morphBatches = many ? prepareMorphBatches(one, many) : prepareMorphBatches(fromIsMany ? to : from, [fromIsMany ? from : to]);
  var animateCount = 0;
  for (var i = 0; i < morphBatches.length; i++) {
    animateCount += morphBatches[i].many.length;
  }
  var animateIndex = 0;
  for (var i = 0; i < morphBatches.length; i++) {
    morphOneBatch(morphBatches[i], fromIsMany, animateIndex, animateCount);
    animateIndex += morphBatches[i].many.length;
  }
}
function getPathList(elements) {
  if (!elements) {
    return [];
  }
  if (isArray(elements)) {
    var pathList_1 = [];
    for (var i = 0; i < elements.length; i++) {
      pathList_1.push(getPathList(elements[i]));
    }
    return pathList_1;
  }
  var pathList = [];
  elements.traverse(function(el) {
    if (el instanceof Path_default && !el.disableMorphing && !el.invisible && !el.ignore) {
      pathList.push(el);
    }
  });
  return pathList;
}

// ../../../../code/project/Sports-Group-buying/node_modules/echarts/lib/animation/universalTransition.js
var DATA_COUNT_THRESHOLD = 1e4;
var TRANSITION_NONE = 0;
var TRANSITION_P2C = 1;
var TRANSITION_C2P = 2;
var getUniversalTransitionGlobalStore = makeInner();
function getDimension(data, visualDimension) {
  var dimensions = data.dimensions;
  for (var i = 0; i < dimensions.length; i++) {
    var dimInfo = data.getDimensionInfo(dimensions[i]);
    if (dimInfo && dimInfo.otherDims[visualDimension] === 0) {
      return dimensions[i];
    }
  }
}
function getValueByDimension(data, dataIndex, dimension) {
  var dimInfo = data.getDimensionInfo(dimension);
  var dimOrdinalMeta = dimInfo && dimInfo.ordinalMeta;
  if (dimInfo) {
    var value = data.get(dimInfo.name, dataIndex);
    if (dimOrdinalMeta) {
      return dimOrdinalMeta.categories[value] || value + "";
    }
    return value + "";
  }
}
function getGroupId(data, dataIndex, dataGroupId, isChild) {
  var visualDimension = isChild ? "itemChildGroupId" : "itemGroupId";
  var groupIdDim = getDimension(data, visualDimension);
  if (groupIdDim) {
    var groupId = getValueByDimension(data, dataIndex, groupIdDim);
    return groupId;
  }
  var rawDataItem = data.getRawDataItem(dataIndex);
  var property = isChild ? "childGroupId" : "groupId";
  if (rawDataItem && rawDataItem[property]) {
    return rawDataItem[property] + "";
  }
  if (isChild) {
    return;
  }
  return dataGroupId || data.getId(dataIndex);
}
function flattenDataDiffItems(list) {
  var items = [];
  each(list, function(seriesInfo) {
    var data = seriesInfo.data;
    var dataGroupId = seriesInfo.dataGroupId;
    if (data.count() > DATA_COUNT_THRESHOLD) {
      if (true) {
        warn("Universal transition is disabled on large data > 10k.");
      }
      return;
    }
    var indices = data.getIndices();
    for (var dataIndex = 0; dataIndex < indices.length; dataIndex++) {
      items.push({
        data,
        groupId: getGroupId(data, dataIndex, dataGroupId, false),
        childGroupId: getGroupId(data, dataIndex, dataGroupId, true),
        divide: seriesInfo.divide,
        dataIndex
      });
    }
  });
  return items;
}
function fadeInElement(newEl, newSeries, newIndex) {
  newEl.traverse(function(el) {
    if (el instanceof Path_default) {
      initProps(el, {
        style: {
          opacity: 0
        }
      }, newSeries, {
        dataIndex: newIndex,
        isFrom: true
      });
    }
  });
}
function removeEl(el) {
  if (el.parent) {
    var computedTransform = el.getComputedTransform();
    el.setLocalTransform(computedTransform);
    el.parent.remove(el);
  }
}
function stopAnimation(el) {
  el.stopAnimation();
  if (el.isGroup) {
    el.traverse(function(child) {
      child.stopAnimation();
    });
  }
}
function animateElementStyles(el, dataIndex, seriesModel) {
  var animationConfig = getAnimationConfig("update", seriesModel, dataIndex);
  animationConfig && el.traverse(function(child) {
    if (child instanceof Displayable_default) {
      var oldStyle = getOldStyle(child);
      if (oldStyle) {
        child.animateFrom({
          style: oldStyle
        }, animationConfig);
      }
    }
  });
}
function isAllIdSame(oldDiffItems, newDiffItems) {
  var len = oldDiffItems.length;
  if (len !== newDiffItems.length) {
    return false;
  }
  for (var i = 0; i < len; i++) {
    var oldItem = oldDiffItems[i];
    var newItem = newDiffItems[i];
    if (oldItem.data.getId(oldItem.dataIndex) !== newItem.data.getId(newItem.dataIndex)) {
      return false;
    }
  }
  return true;
}
function transitionBetween(oldList, newList, api) {
  var oldDiffItems = flattenDataDiffItems(oldList);
  var newDiffItems = flattenDataDiffItems(newList);
  function updateMorphingPathProps(from, to, rawFrom, rawTo, animationCfg) {
    if (rawFrom || from) {
      to.animateFrom({
        style: rawFrom && rawFrom !== from ? extend(extend({}, rawFrom.style), from.style) : from.style
      }, animationCfg);
    }
  }
  var hasMorphAnimation = false;
  var direction = TRANSITION_NONE;
  var oldGroupIds = createHashMap();
  var oldChildGroupIds = createHashMap();
  oldDiffItems.forEach(function(item) {
    item.groupId && oldGroupIds.set(item.groupId, true);
    item.childGroupId && oldChildGroupIds.set(item.childGroupId, true);
  });
  for (var i = 0; i < newDiffItems.length; i++) {
    var newGroupId = newDiffItems[i].groupId;
    if (oldChildGroupIds.get(newGroupId)) {
      direction = TRANSITION_P2C;
      break;
    }
    var newChildGroupId = newDiffItems[i].childGroupId;
    if (newChildGroupId && oldGroupIds.get(newChildGroupId)) {
      direction = TRANSITION_C2P;
      break;
    }
  }
  function createKeyGetter(isOld, onlyGetId) {
    return function(diffItem) {
      var data = diffItem.data;
      var dataIndex = diffItem.dataIndex;
      if (onlyGetId) {
        return data.getId(dataIndex);
      }
      if (isOld) {
        return direction === TRANSITION_P2C ? diffItem.childGroupId : diffItem.groupId;
      } else {
        return direction === TRANSITION_C2P ? diffItem.childGroupId : diffItem.groupId;
      }
    };
  }
  var useId = isAllIdSame(oldDiffItems, newDiffItems);
  var isElementStillInChart = {};
  if (!useId) {
    for (var i = 0; i < newDiffItems.length; i++) {
      var newItem = newDiffItems[i];
      var el = newItem.data.getItemGraphicEl(newItem.dataIndex);
      if (el) {
        isElementStillInChart[el.id] = true;
      }
    }
  }
  function updateOneToOne(newIndex, oldIndex) {
    var oldItem = oldDiffItems[oldIndex];
    var newItem2 = newDiffItems[newIndex];
    var newSeries = newItem2.data.hostModel;
    var oldEl = oldItem.data.getItemGraphicEl(oldItem.dataIndex);
    var newEl = newItem2.data.getItemGraphicEl(newItem2.dataIndex);
    if (oldEl === newEl) {
      newEl && animateElementStyles(newEl, newItem2.dataIndex, newSeries);
      return;
    }
    if (
      // We can't use the elements that already being morphed
      oldEl && isElementStillInChart[oldEl.id]
    ) {
      return;
    }
    if (newEl) {
      stopAnimation(newEl);
      if (oldEl) {
        stopAnimation(oldEl);
        removeEl(oldEl);
        hasMorphAnimation = true;
        applyMorphAnimation(getPathList(oldEl), getPathList(newEl), newItem2.divide, newSeries, newIndex, updateMorphingPathProps);
      } else {
        fadeInElement(newEl, newSeries, newIndex);
      }
    }
  }
  new DataDiffer_default(oldDiffItems, newDiffItems, createKeyGetter(true, useId), createKeyGetter(false, useId), null, "multiple").update(updateOneToOne).updateManyToOne(function(newIndex, oldIndices) {
    var newItem2 = newDiffItems[newIndex];
    var newData = newItem2.data;
    var newSeries = newData.hostModel;
    var newEl = newData.getItemGraphicEl(newItem2.dataIndex);
    var oldElsList = filter(map(oldIndices, function(idx) {
      return oldDiffItems[idx].data.getItemGraphicEl(oldDiffItems[idx].dataIndex);
    }), function(oldEl) {
      return oldEl && oldEl !== newEl && !isElementStillInChart[oldEl.id];
    });
    if (newEl) {
      stopAnimation(newEl);
      if (oldElsList.length) {
        each(oldElsList, function(oldEl) {
          stopAnimation(oldEl);
          removeEl(oldEl);
        });
        hasMorphAnimation = true;
        applyMorphAnimation(getPathList(oldElsList), getPathList(newEl), newItem2.divide, newSeries, newIndex, updateMorphingPathProps);
      } else {
        fadeInElement(newEl, newSeries, newItem2.dataIndex);
      }
    }
  }).updateOneToMany(function(newIndices, oldIndex) {
    var oldItem = oldDiffItems[oldIndex];
    var oldEl = oldItem.data.getItemGraphicEl(oldItem.dataIndex);
    if (oldEl && isElementStillInChart[oldEl.id]) {
      return;
    }
    var newElsList = filter(map(newIndices, function(idx) {
      return newDiffItems[idx].data.getItemGraphicEl(newDiffItems[idx].dataIndex);
    }), function(el2) {
      return el2 && el2 !== oldEl;
    });
    var newSeris = newDiffItems[newIndices[0]].data.hostModel;
    if (newElsList.length) {
      each(newElsList, function(newEl) {
        return stopAnimation(newEl);
      });
      if (oldEl) {
        stopAnimation(oldEl);
        removeEl(oldEl);
        hasMorphAnimation = true;
        applyMorphAnimation(
          getPathList(oldEl),
          getPathList(newElsList),
          oldItem.divide,
          // Use divide on old.
          newSeris,
          newIndices[0],
          updateMorphingPathProps
        );
      } else {
        each(newElsList, function(newEl) {
          return fadeInElement(newEl, newSeris, newIndices[0]);
        });
      }
    }
  }).updateManyToMany(function(newIndices, oldIndices) {
    new DataDiffer_default(oldIndices, newIndices, function(rawIdx) {
      return oldDiffItems[rawIdx].data.getId(oldDiffItems[rawIdx].dataIndex);
    }, function(rawIdx) {
      return newDiffItems[rawIdx].data.getId(newDiffItems[rawIdx].dataIndex);
    }).update(function(newIndex, oldIndex) {
      updateOneToOne(newIndices[newIndex], oldIndices[oldIndex]);
    }).execute();
  }).execute();
  if (hasMorphAnimation) {
    each(newList, function(_a) {
      var data = _a.data;
      var seriesModel = data.hostModel;
      var view = seriesModel && api.getViewOfSeriesModel(seriesModel);
      var animationCfg = getAnimationConfig("update", seriesModel, 0);
      if (view && seriesModel.isAnimationEnabled() && animationCfg && animationCfg.duration > 0) {
        view.group.traverse(function(el2) {
          if (el2 instanceof Path_default && !el2.animators.length) {
            el2.animateFrom({
              style: {
                opacity: 0
              }
            }, animationCfg);
          }
        });
      }
    });
  }
}
function getSeriesTransitionKey(series) {
  var seriesKey = series.getModel("universalTransition").get("seriesKey");
  if (!seriesKey) {
    return series.id;
  }
  return seriesKey;
}
function convertArraySeriesKeyToString(seriesKey) {
  if (isArray(seriesKey)) {
    return seriesKey.sort().join(",");
  }
  return seriesKey;
}
function getDivideShapeFromData(data) {
  if (data.hostModel) {
    return data.hostModel.getModel("universalTransition").get("divideShape");
  }
}
function findTransitionSeriesBatches(globalStore, params) {
  var updateBatches = createHashMap();
  var oldDataMap = createHashMap();
  var oldDataMapForSplit = createHashMap();
  each(globalStore.oldSeries, function(series, idx) {
    var oldDataGroupId = globalStore.oldDataGroupIds[idx];
    var oldData = globalStore.oldData[idx];
    var transitionKey = getSeriesTransitionKey(series);
    var transitionKeyStr = convertArraySeriesKeyToString(transitionKey);
    oldDataMap.set(transitionKeyStr, {
      dataGroupId: oldDataGroupId,
      data: oldData
    });
    if (isArray(transitionKey)) {
      each(transitionKey, function(key) {
        oldDataMapForSplit.set(key, {
          key: transitionKeyStr,
          dataGroupId: oldDataGroupId,
          data: oldData
        });
      });
    }
  });
  function checkTransitionSeriesKeyDuplicated(transitionKeyStr) {
    if (updateBatches.get(transitionKeyStr)) {
      warn("Duplicated seriesKey in universalTransition " + transitionKeyStr);
    }
  }
  each(params.updatedSeries, function(series) {
    if (series.isUniversalTransitionEnabled() && series.isAnimationEnabled()) {
      var newDataGroupId = series.get("dataGroupId");
      var newData = series.getData();
      var transitionKey = getSeriesTransitionKey(series);
      var transitionKeyStr = convertArraySeriesKeyToString(transitionKey);
      var oldData = oldDataMap.get(transitionKeyStr);
      if (oldData) {
        if (true) {
          checkTransitionSeriesKeyDuplicated(transitionKeyStr);
        }
        updateBatches.set(transitionKeyStr, {
          oldSeries: [{
            dataGroupId: oldData.dataGroupId,
            divide: getDivideShapeFromData(oldData.data),
            data: oldData.data
          }],
          newSeries: [{
            dataGroupId: newDataGroupId,
            divide: getDivideShapeFromData(newData),
            data: newData
          }]
        });
      } else {
        if (isArray(transitionKey)) {
          if (true) {
            checkTransitionSeriesKeyDuplicated(transitionKeyStr);
          }
          var oldSeries_1 = [];
          each(transitionKey, function(key) {
            var oldData2 = oldDataMap.get(key);
            if (oldData2.data) {
              oldSeries_1.push({
                dataGroupId: oldData2.dataGroupId,
                divide: getDivideShapeFromData(oldData2.data),
                data: oldData2.data
              });
            }
          });
          if (oldSeries_1.length) {
            updateBatches.set(transitionKeyStr, {
              oldSeries: oldSeries_1,
              newSeries: [{
                dataGroupId: newDataGroupId,
                data: newData,
                divide: getDivideShapeFromData(newData)
              }]
            });
          }
        } else {
          var oldData_1 = oldDataMapForSplit.get(transitionKey);
          if (oldData_1) {
            var batch = updateBatches.get(oldData_1.key);
            if (!batch) {
              batch = {
                oldSeries: [{
                  dataGroupId: oldData_1.dataGroupId,
                  data: oldData_1.data,
                  divide: getDivideShapeFromData(oldData_1.data)
                }],
                newSeries: []
              };
              updateBatches.set(oldData_1.key, batch);
            }
            batch.newSeries.push({
              dataGroupId: newDataGroupId,
              data: newData,
              divide: getDivideShapeFromData(newData)
            });
          }
        }
      }
    }
  });
  return updateBatches;
}
function querySeries(series, finder) {
  for (var i = 0; i < series.length; i++) {
    var found = finder.seriesIndex != null && finder.seriesIndex === series[i].seriesIndex || finder.seriesId != null && finder.seriesId === series[i].id;
    if (found) {
      return i;
    }
  }
}
function transitionSeriesFromOpt(transitionOpt, globalStore, params, api) {
  var from = [];
  var to = [];
  each(normalizeToArray(transitionOpt.from), function(finder) {
    var idx = querySeries(globalStore.oldSeries, finder);
    if (idx >= 0) {
      from.push({
        dataGroupId: globalStore.oldDataGroupIds[idx],
        data: globalStore.oldData[idx],
        // TODO can specify divideShape in transition.
        divide: getDivideShapeFromData(globalStore.oldData[idx]),
        groupIdDim: finder.dimension
      });
    }
  });
  each(normalizeToArray(transitionOpt.to), function(finder) {
    var idx = querySeries(params.updatedSeries, finder);
    if (idx >= 0) {
      var data = params.updatedSeries[idx].getData();
      to.push({
        dataGroupId: globalStore.oldDataGroupIds[idx],
        data,
        divide: getDivideShapeFromData(data),
        groupIdDim: finder.dimension
      });
    }
  });
  if (from.length > 0 && to.length > 0) {
    transitionBetween(from, to, api);
  }
}
function installUniversalTransition(registers) {
  registers.registerUpdateLifecycle("series:beforeupdate", function(ecMOdel, api, params) {
    each(normalizeToArray(params.seriesTransition), function(transOpt) {
      each(normalizeToArray(transOpt.to), function(finder) {
        var series = params.updatedSeries;
        for (var i = 0; i < series.length; i++) {
          if (finder.seriesIndex != null && finder.seriesIndex === series[i].seriesIndex || finder.seriesId != null && finder.seriesId === series[i].id) {
            series[i][SERIES_UNIVERSAL_TRANSITION_PROP] = true;
          }
        }
      });
    });
  });
  registers.registerUpdateLifecycle("series:transition", function(ecModel, api, params) {
    var globalStore = getUniversalTransitionGlobalStore(api);
    if (globalStore.oldSeries && params.updatedSeries && params.optionChanged) {
      var transitionOpt = params.seriesTransition;
      if (transitionOpt) {
        each(normalizeToArray(transitionOpt), function(opt) {
          transitionSeriesFromOpt(opt, globalStore, params, api);
        });
      } else {
        var updateBatches_1 = findTransitionSeriesBatches(globalStore, params);
        each(updateBatches_1.keys(), function(key) {
          var batch = updateBatches_1.get(key);
          transitionBetween(batch.oldSeries, batch.newSeries, api);
        });
      }
      each(params.updatedSeries, function(series) {
        if (series[SERIES_UNIVERSAL_TRANSITION_PROP]) {
          series[SERIES_UNIVERSAL_TRANSITION_PROP] = false;
        }
      });
    }
    var allSeries = ecModel.getSeries();
    var savedSeries = globalStore.oldSeries = [];
    var savedDataGroupIds = globalStore.oldDataGroupIds = [];
    var savedData = globalStore.oldData = [];
    for (var i = 0; i < allSeries.length; i++) {
      var data = allSeries[i].getData();
      if (data.count() < DATA_COUNT_THRESHOLD) {
        savedSeries.push(allSeries[i]);
        savedDataGroupIds.push(allSeries[i].get("dataGroupId"));
        savedData.push(data);
      }
    }
  });
}
export {
  installLabelLayout as LabelLayout,
  installUniversalTransition as UniversalTransition
};
//# sourceMappingURL=echarts_features.js.map
