import {
  getLabelLineStatesModels,
  setLabelLineStyle,
  updateLabelLinePoints
} from "./chunk-535PLOHE.js";
import {
  animateLabelValue,
  getECData,
  hideOverlap,
  initProps,
  isElementRemoved,
  labelInner,
  makeInner,
  parsePercent,
  prepareLayoutList,
  shiftLayoutOnX,
  shiftLayoutOnY,
  updateProps
} from "./chunk-VBNTIDHT.js";
import {
  BoundingRect_default,
  Transformable_default,
  each,
  filter,
  indexOf,
  isFunction,
  keys,
  normalizeRadian,
  retrieve2
} from "./chunk-QGQOLPAV.js";

// ../../../../code/project/Sports-Group-buying/node_modules/echarts/lib/label/LabelManager.js
function cloneArr(points) {
  if (points) {
    var newPoints = [];
    for (var i = 0; i < points.length; i++) {
      newPoints.push(points[i].slice());
    }
    return newPoints;
  }
}
function prepareLayoutCallbackParams(labelItem, hostEl) {
  var label = labelItem.label;
  var labelLine = hostEl && hostEl.getTextGuideLine();
  return {
    dataIndex: labelItem.dataIndex,
    dataType: labelItem.dataType,
    seriesIndex: labelItem.seriesModel.seriesIndex,
    text: labelItem.label.style.text,
    rect: labelItem.hostRect,
    labelRect: labelItem.rect,
    // x: labelAttr.x,
    // y: labelAttr.y,
    align: label.style.align,
    verticalAlign: label.style.verticalAlign,
    labelLinePoints: cloneArr(labelLine && labelLine.shape.points)
  };
}
var LABEL_OPTION_TO_STYLE_KEYS = ["align", "verticalAlign", "width", "height", "fontSize"];
var dummyTransformable = new Transformable_default();
var labelLayoutInnerStore = makeInner();
var labelLineAnimationStore = makeInner();
function extendWithKeys(target, source, keys2) {
  for (var i = 0; i < keys2.length; i++) {
    var key = keys2[i];
    if (source[key] != null) {
      target[key] = source[key];
    }
  }
}
var LABEL_LAYOUT_PROPS = ["x", "y", "rotation"];
var LabelManager = (
  /** @class */
  function() {
    function LabelManager2() {
      this._labelList = [];
      this._chartViewList = [];
    }
    LabelManager2.prototype.clearLabels = function() {
      this._labelList = [];
      this._chartViewList = [];
    };
    LabelManager2.prototype._addLabel = function(dataIndex, dataType, seriesModel, label, layoutOption) {
      var labelStyle = label.style;
      var hostEl = label.__hostTarget;
      var textConfig = hostEl.textConfig || {};
      var labelTransform = label.getComputedTransform();
      var labelRect = label.getBoundingRect().plain();
      BoundingRect_default.applyTransform(labelRect, labelRect, labelTransform);
      if (labelTransform) {
        dummyTransformable.setLocalTransform(labelTransform);
      } else {
        dummyTransformable.x = dummyTransformable.y = dummyTransformable.rotation = dummyTransformable.originX = dummyTransformable.originY = 0;
        dummyTransformable.scaleX = dummyTransformable.scaleY = 1;
      }
      dummyTransformable.rotation = normalizeRadian(dummyTransformable.rotation);
      var host = label.__hostTarget;
      var hostRect;
      if (host) {
        hostRect = host.getBoundingRect().plain();
        var transform = host.getComputedTransform();
        BoundingRect_default.applyTransform(hostRect, hostRect, transform);
      }
      var labelGuide = hostRect && host.getTextGuideLine();
      this._labelList.push({
        label,
        labelLine: labelGuide,
        seriesModel,
        dataIndex,
        dataType,
        layoutOption,
        computedLayoutOption: null,
        rect: labelRect,
        hostRect,
        // Label with lower priority will be hidden when overlapped
        // Use rect size as default priority
        priority: hostRect ? hostRect.width * hostRect.height : 0,
        // Save default label attributes.
        // For restore if developers want get back to default value in callback.
        defaultAttr: {
          ignore: label.ignore,
          labelGuideIgnore: labelGuide && labelGuide.ignore,
          x: dummyTransformable.x,
          y: dummyTransformable.y,
          scaleX: dummyTransformable.scaleX,
          scaleY: dummyTransformable.scaleY,
          rotation: dummyTransformable.rotation,
          style: {
            x: labelStyle.x,
            y: labelStyle.y,
            align: labelStyle.align,
            verticalAlign: labelStyle.verticalAlign,
            width: labelStyle.width,
            height: labelStyle.height,
            fontSize: labelStyle.fontSize
          },
          cursor: label.cursor,
          attachedPos: textConfig.position,
          attachedRot: textConfig.rotation
        }
      });
    };
    LabelManager2.prototype.addLabelsOfSeries = function(chartView) {
      var _this = this;
      this._chartViewList.push(chartView);
      var seriesModel = chartView.__model;
      var layoutOption = seriesModel.get("labelLayout");
      if (!(isFunction(layoutOption) || keys(layoutOption).length)) {
        return;
      }
      chartView.group.traverse(function(child) {
        if (child.ignore) {
          return true;
        }
        var textEl = child.getTextContent();
        var ecData = getECData(child);
        if (textEl && !textEl.disableLabelLayout) {
          _this._addLabel(ecData.dataIndex, ecData.dataType, seriesModel, textEl, layoutOption);
        }
      });
    };
    LabelManager2.prototype.updateLayoutConfig = function(api) {
      var width = api.getWidth();
      var height = api.getHeight();
      function createDragHandler(el, labelLineModel) {
        return function() {
          updateLabelLinePoints(el, labelLineModel);
        };
      }
      for (var i = 0; i < this._labelList.length; i++) {
        var labelItem = this._labelList[i];
        var label = labelItem.label;
        var hostEl = label.__hostTarget;
        var defaultLabelAttr = labelItem.defaultAttr;
        var layoutOption = void 0;
        if (isFunction(labelItem.layoutOption)) {
          layoutOption = labelItem.layoutOption(prepareLayoutCallbackParams(labelItem, hostEl));
        } else {
          layoutOption = labelItem.layoutOption;
        }
        layoutOption = layoutOption || {};
        labelItem.computedLayoutOption = layoutOption;
        var degreeToRadian = Math.PI / 180;
        if (hostEl) {
          hostEl.setTextConfig({
            // Force to set local false.
            local: false,
            // Ignore position and rotation config on the host el if x or y is changed.
            position: layoutOption.x != null || layoutOption.y != null ? null : defaultLabelAttr.attachedPos,
            // Ignore rotation config on the host el if rotation is changed.
            rotation: layoutOption.rotate != null ? layoutOption.rotate * degreeToRadian : defaultLabelAttr.attachedRot,
            offset: [layoutOption.dx || 0, layoutOption.dy || 0]
          });
        }
        var needsUpdateLabelLine = false;
        if (layoutOption.x != null) {
          label.x = parsePercent(layoutOption.x, width);
          label.setStyle("x", 0);
          needsUpdateLabelLine = true;
        } else {
          label.x = defaultLabelAttr.x;
          label.setStyle("x", defaultLabelAttr.style.x);
        }
        if (layoutOption.y != null) {
          label.y = parsePercent(layoutOption.y, height);
          label.setStyle("y", 0);
          needsUpdateLabelLine = true;
        } else {
          label.y = defaultLabelAttr.y;
          label.setStyle("y", defaultLabelAttr.style.y);
        }
        if (layoutOption.labelLinePoints) {
          var guideLine = hostEl.getTextGuideLine();
          if (guideLine) {
            guideLine.setShape({
              points: layoutOption.labelLinePoints
            });
            needsUpdateLabelLine = false;
          }
        }
        var labelLayoutStore = labelLayoutInnerStore(label);
        labelLayoutStore.needsUpdateLabelLine = needsUpdateLabelLine;
        label.rotation = layoutOption.rotate != null ? layoutOption.rotate * degreeToRadian : defaultLabelAttr.rotation;
        label.scaleX = defaultLabelAttr.scaleX;
        label.scaleY = defaultLabelAttr.scaleY;
        for (var k = 0; k < LABEL_OPTION_TO_STYLE_KEYS.length; k++) {
          var key = LABEL_OPTION_TO_STYLE_KEYS[k];
          label.setStyle(key, layoutOption[key] != null ? layoutOption[key] : defaultLabelAttr.style[key]);
        }
        if (layoutOption.draggable) {
          label.draggable = true;
          label.cursor = "move";
          if (hostEl) {
            var hostModel = labelItem.seriesModel;
            if (labelItem.dataIndex != null) {
              var data = labelItem.seriesModel.getData(labelItem.dataType);
              hostModel = data.getItemModel(labelItem.dataIndex);
            }
            label.on("drag", createDragHandler(hostEl, hostModel.getModel("labelLine")));
          }
        } else {
          label.off("drag");
          label.cursor = defaultLabelAttr.cursor;
        }
      }
    };
    LabelManager2.prototype.layout = function(api) {
      var width = api.getWidth();
      var height = api.getHeight();
      var labelList = prepareLayoutList(this._labelList);
      var labelsNeedsAdjustOnX = filter(labelList, function(item) {
        return item.layoutOption.moveOverlap === "shiftX";
      });
      var labelsNeedsAdjustOnY = filter(labelList, function(item) {
        return item.layoutOption.moveOverlap === "shiftY";
      });
      shiftLayoutOnX(labelsNeedsAdjustOnX, 0, width);
      shiftLayoutOnY(labelsNeedsAdjustOnY, 0, height);
      var labelsNeedsHideOverlap = filter(labelList, function(item) {
        return item.layoutOption.hideOverlap;
      });
      hideOverlap(labelsNeedsHideOverlap);
    };
    LabelManager2.prototype.processLabelsOverall = function() {
      var _this = this;
      each(this._chartViewList, function(chartView) {
        var seriesModel = chartView.__model;
        var ignoreLabelLineUpdate = chartView.ignoreLabelLineUpdate;
        var animationEnabled = seriesModel.isAnimationEnabled();
        chartView.group.traverse(function(child) {
          if (child.ignore && !child.forceLabelAnimation) {
            return true;
          }
          var needsUpdateLabelLine = !ignoreLabelLineUpdate;
          var label = child.getTextContent();
          if (!needsUpdateLabelLine && label) {
            needsUpdateLabelLine = labelLayoutInnerStore(label).needsUpdateLabelLine;
          }
          if (needsUpdateLabelLine) {
            _this._updateLabelLine(child, seriesModel);
          }
          if (animationEnabled) {
            _this._animateLabels(child, seriesModel);
          }
        });
      });
    };
    LabelManager2.prototype._updateLabelLine = function(el, seriesModel) {
      var textEl = el.getTextContent();
      var ecData = getECData(el);
      var dataIndex = ecData.dataIndex;
      if (textEl && dataIndex != null) {
        var data = seriesModel.getData(ecData.dataType);
        var itemModel = data.getItemModel(dataIndex);
        var defaultStyle = {};
        var visualStyle = data.getItemVisual(dataIndex, "style");
        if (visualStyle) {
          var visualType = data.getVisual("drawType");
          defaultStyle.stroke = visualStyle[visualType];
        }
        var labelLineModel = itemModel.getModel("labelLine");
        setLabelLineStyle(el, getLabelLineStatesModels(itemModel), defaultStyle);
        updateLabelLinePoints(el, labelLineModel);
      }
    };
    LabelManager2.prototype._animateLabels = function(el, seriesModel) {
      var textEl = el.getTextContent();
      var guideLine = el.getTextGuideLine();
      if (textEl && (el.forceLabelAnimation || !textEl.ignore && !textEl.invisible && !el.disableLabelAnimation && !isElementRemoved(el))) {
        var layoutStore = labelLayoutInnerStore(textEl);
        var oldLayout = layoutStore.oldLayout;
        var ecData = getECData(el);
        var dataIndex = ecData.dataIndex;
        var newProps = {
          x: textEl.x,
          y: textEl.y,
          rotation: textEl.rotation
        };
        var data = seriesModel.getData(ecData.dataType);
        if (!oldLayout) {
          textEl.attr(newProps);
          if (!labelInner(textEl).valueAnimation) {
            var oldOpacity = retrieve2(textEl.style.opacity, 1);
            textEl.style.opacity = 0;
            initProps(textEl, {
              style: {
                opacity: oldOpacity
              }
            }, seriesModel, dataIndex);
          }
        } else {
          textEl.attr(oldLayout);
          var prevStates = el.prevStates;
          if (prevStates) {
            if (indexOf(prevStates, "select") >= 0) {
              textEl.attr(layoutStore.oldLayoutSelect);
            }
            if (indexOf(prevStates, "emphasis") >= 0) {
              textEl.attr(layoutStore.oldLayoutEmphasis);
            }
          }
          updateProps(textEl, newProps, seriesModel, dataIndex);
        }
        layoutStore.oldLayout = newProps;
        if (textEl.states.select) {
          var layoutSelect = layoutStore.oldLayoutSelect = {};
          extendWithKeys(layoutSelect, newProps, LABEL_LAYOUT_PROPS);
          extendWithKeys(layoutSelect, textEl.states.select, LABEL_LAYOUT_PROPS);
        }
        if (textEl.states.emphasis) {
          var layoutEmphasis = layoutStore.oldLayoutEmphasis = {};
          extendWithKeys(layoutEmphasis, newProps, LABEL_LAYOUT_PROPS);
          extendWithKeys(layoutEmphasis, textEl.states.emphasis, LABEL_LAYOUT_PROPS);
        }
        animateLabelValue(textEl, dataIndex, data, seriesModel, seriesModel);
      }
      if (guideLine && !guideLine.ignore && !guideLine.invisible) {
        var layoutStore = labelLineAnimationStore(guideLine);
        var oldLayout = layoutStore.oldLayout;
        var newLayout = {
          points: guideLine.shape.points
        };
        if (!oldLayout) {
          guideLine.setShape(newLayout);
          guideLine.style.strokePercent = 0;
          initProps(guideLine, {
            style: {
              strokePercent: 1
            }
          }, seriesModel);
        } else {
          guideLine.attr({
            shape: oldLayout
          });
          updateProps(guideLine, {
            shape: newLayout
          }, seriesModel);
        }
        layoutStore.oldLayout = newLayout;
      }
    };
    return LabelManager2;
  }()
);
var LabelManager_default = LabelManager;

// ../../../../code/project/Sports-Group-buying/node_modules/echarts/lib/label/installLabelLayout.js
var getLabelManager = makeInner();
function installLabelLayout(registers) {
  registers.registerUpdateLifecycle("series:beforeupdate", function(ecModel, api, params) {
    var labelManager = getLabelManager(api).labelManager;
    if (!labelManager) {
      labelManager = getLabelManager(api).labelManager = new LabelManager_default();
    }
    labelManager.clearLabels();
  });
  registers.registerUpdateLifecycle("series:layoutlabels", function(ecModel, api, params) {
    var labelManager = getLabelManager(api).labelManager;
    params.updatedSeries.forEach(function(series) {
      labelManager.addLabelsOfSeries(api.getViewOfSeriesModel(series));
    });
    labelManager.updateLayoutConfig(api);
    labelManager.layout(api);
    labelManager.processLabelsOverall();
  });
}

export {
  installLabelLayout
};
//# sourceMappingURL=chunk-TWD4YHWQ.js.map
