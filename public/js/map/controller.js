angular.module('app').controller('mapCtrl', function ($scope, connection, $compile, $routeParams, $timeout, mapModel) {
    $scope.mapNameModal = 'partials/map/modals/mapNameModal.html';
    $scope.gameListModal = 'partials/map/modals/gameListModal.html';

    $scope.selectedMap = {};
    $scope.selectedMap.mapName = 'NewMap';
    $scope.mode = 'add';
    $scope.duplicateOptions = {};
    $scope.duplicateOptions.freeze = false;
    $scope.duplicateOptions.header = 'Duplicate map';

    $scope.initMapList = function () {
        $scope.navigation.page = 1;

        return $scope.getMaps().then(function () {
            $scope.mode = 'list';
        });
    };



    //console.log(jsonSaveString);

$scope.mapName = function () {
        if ($scope.mode === 'add') {
            $('#theMapNameModal').modal('show');
              $scope.mapNameSave();
        }
    };

    $scope.mapNameSave = function () {
        return mapModel.saveAsMap($scope.selectedMap, $scope.mode).then(function () {
            $('#theMapNameModal').modal('hide');
            $('.modal-backdrop').hide();
            //$scope.goBack();
        });
};

    $scope.canvas = canvas;
    $scope.getActiveStyle = getActiveStyle;

    addAccessors($scope);
    watchCanvas($scope);

    function getActiveStyle(styleName, object) {
    object = object || canvas.getActiveObject();
    if (!object) return '';

    return (object.getSelectionStyles && object.isEditing)
      ? (object.getSelectionStyles()[styleName] || '')
      : (object[styleName] || '');
  };

  function setActiveStyle(styleName, value, object) {
    object = object || canvas.getActiveObject();
    if (!object) return;

    if (object.setSelectionStyles && object.isEditing) {
      var style = { };
      style[styleName] = value;
      object.setSelectionStyles(style);
      object.setCoords();
    }
    else {
      object.set(styleName, value);
    }

    object.setCoords();
    canvas.requestRenderAll();
  };

  function getActiveProp(name) {
    var object = canvas.getActiveObject();
    if (!object) return '';

    return object[name] || '';
  }

  function setActiveProp(name, value) {
    var object = canvas.getActiveObject();
    if (!object) return;
    object.set(name, value).setCoords();
    canvas.renderAll();
  }

  function addAccessors($scope) {

    var pattern = new fabric.Pattern({
      source: '/assets/ladybug.png',
      repeat: 'repeat'
    });

    $scope.getOpacity = function() {
      return getActiveStyle('opacity') * 100;
    };
    $scope.setOpacity = function(value) {
      setActiveStyle('opacity', parseInt(value, 10) / 100);
    };

    $scope.getFill = function() {
      return getActiveStyle('fill');
    };
    $scope.setFill = function(value) {
      setActiveStyle('fill', value);
    };

    $scope.isBold = function() {
      return getActiveStyle('fontWeight') === 'bold';
    };
    $scope.toggleBold = function() {
      setActiveStyle('fontWeight',
        getActiveStyle('fontWeight') === 'bold' ? '' : 'bold');
    };
    $scope.isItalic = function() {
      return getActiveStyle('fontStyle') === 'italic';
    };
    $scope.toggleItalic = function() {
      setActiveStyle('fontStyle',
        getActiveStyle('fontStyle') === 'italic' ? '' : 'italic');
    };

    $scope.isUnderline = function() {
      return getActiveStyle('textDecoration').indexOf('underline') > -1 || getActiveStyle('underline');
    };
    $scope.toggleUnderline = function() {
      var value = $scope.isUnderline()
        ? getActiveStyle('textDecoration').replace('underline', '')
        : (getActiveStyle('textDecoration') + ' underline');

      setActiveStyle('textDecoration', value);
      setActiveStyle('underline', !getActiveStyle('underline'));
    };

    $scope.isLinethrough = function() {
      return getActiveStyle('textDecoration').indexOf('line-through') > -1 || getActiveStyle('linethrough');
    };
    $scope.toggleLinethrough = function() {
      var value = $scope.isLinethrough()
        ? getActiveStyle('textDecoration').replace('line-through', '')
        : (getActiveStyle('textDecoration') + ' line-through');

      setActiveStyle('textDecoration', value);
      setActiveStyle('linethrough', !getActiveStyle('linethrough'));
    };
    $scope.isOverline = function() {
      return getActiveStyle('textDecoration').indexOf('overline') > -1 || getActiveStyle('overline');
    };
    $scope.toggleOverline = function() {
      var value = $scope.isOverline()
        ? getActiveStyle('textDecoration').replace('overline', '')
        : (getActiveStyle('textDecoration') + ' overline');

      setActiveStyle('textDecoration', value);
      setActiveStyle('overline', !getActiveStyle('overline'));
    };

    $scope.getText = function() {
      return getActiveProp('text');
    };
    $scope.setText = function(value) {
      setActiveProp('text', value);
    };

    $scope.getSplitByGrapheme = function() {
      return getActiveProp('splitByGrapheme');
    };
    $scope.setSplitByGrapheme = function(value) {
      setActiveProp('splitByGrapheme', value);
    };

    $scope.getTextAlign = function() {
      return capitalize(getActiveProp('textAlign'));
    };
    $scope.setTextAlign = function(value) {
      setActiveProp('textAlign', value.toLowerCase());
    };

    $scope.getFontFamily = function() {
      return getActiveProp('fontFamily').toLowerCase();
    };
    $scope.setFontFamily = function(value) {
      setActiveProp('fontFamily', value.toLowerCase());
    };

    $scope.getBgColor = function() {
      return getActiveProp('backgroundColor');
    };
    $scope.setBgColor = function(value) {
      setActiveProp('backgroundColor', value);
    };

    $scope.getTextBgColor = function() {
      return getActiveProp('textBackgroundColor');
    };
    $scope.setTextBgColor = function(value) {
      setActiveProp('textBackgroundColor', value);
    };

    $scope.getStroke = function() {
      return getActiveStyle('stroke');
    };
    $scope.setStroke = function(value) {
      setActiveStyle('stroke', value);
    };

    $scope.getStrokeWidth = function() {
      return getActiveStyle('strokeWidth');
    };
    $scope.setStrokeWidth = function(value) {
      setActiveStyle('strokeWidth', parseInt(value, 10));
    };

    $scope.getFontSize = function() {
      return getActiveStyle('fontSize');
    };
    $scope.setFontSize = function(value) {
      setActiveStyle('fontSize', parseInt(value, 10));
    };

    $scope.getLineHeight = function() {
      return getActiveStyle('lineHeight');
    };
    $scope.setLineHeight = function(value) {
      setActiveStyle('lineHeight', parseFloat(value, 10));
    };
    $scope.getCharSpacing = function() {
      return getActiveStyle('charSpacing');
    };
    $scope.setCharSpacing = function(value) {
      setActiveStyle('charSpacing', value);
    };

    $scope.getBold = function() {
      return getActiveStyle('fontWeight');
    };
    $scope.setBold = function(value) {
      setActiveStyle('fontWeight', value ? 'bold' : '');
    };

    $scope.setPatternStyle = function(value) {
      var obj = canvas.getActiveObject();
      if (obj && obj.fill instanceof fabric.Pattern) {
        obj.fill.repeat = value;
        obj.dirty = true;
        canvas.requestRenderAll();
      }
    };

    $scope.hasPattern = function() {
      return getActiveStyle('fill') instanceof fabric.Pattern;
    };

    $scope.getPatternRepeat = function() {
      if ($scope.hasPattern()) {
        return getActiveStyle('fill').repeat;
      }
    };

    $scope.addResizeFilter = function() {
      setActiveStyle('resizeFilter', new fabric.Image.filters.Resize());
      canvas.requestRenderAll();
    }

    $scope.addInvertFilter = function() {
      setActiveStyle('filters', [new fabric.Image.filters.Invert()]);
      var obj = canvas.getActiveObject();
      obj.applyFilters && obj.applyFilters();
    }

    $scope.addContrastFilter = function() {
      setActiveStyle('filters', [new fabric.Image.filters.Contrast({ contrast: 0.7 })]);
      var obj = canvas.getActiveObject();
      obj.applyFilters && obj.applyFilters();
    }

    $scope.getCanvasBgColor = function() {
      return canvas.backgroundColor;
    };
    $scope.setCanvasBgColor = function(value) {
      canvas.backgroundColor = value;
      canvas.renderAll();
    };

    $scope.setSubScript = function() {
      var obj = canvas.getActiveObject();
      obj.setSubScript();
    };

    $scope.setSuperScript = function() {
      var obj = canvas.getActiveObject();
      obj.setSuperScript();
    };

    $scope.addRect = function() {
      var coord = getRandomLeftTop();

      canvas.add(new fabric.Rect({
        left: coord.left,
        top: coord.top,
        fill: '#' + getRandomColor(),
        width: 50,
        height: 50,
        opacity: 0.8
      }));
    };

    $scope.addCircle = function() {
      var coord = getRandomLeftTop();

      canvas.add(new fabric.Circle({
        left: coord.left,
        top: coord.top,
        fill: '#' + getRandomColor(),
        radius: 50,
        opacity: 0.8
      }));
    };

    $scope.addTriangle = function() {
      var coord = getRandomLeftTop();

      canvas.add(new fabric.Triangle({
        left: coord.left,
        top: coord.top,
        fill: '#' + getRandomColor(),
        width: 50,
        height: 50,
        opacity: 0.8
      }));
    };

    $scope.addLine = function() {
      var coord = getRandomLeftTop();

      canvas.add(new fabric.Line([ 50, 100, 200, 200], {
        left: coord.left,
        top: coord.top,
        stroke: '#' + getRandomColor()
      }));
    };

    $scope.addPolygon = function() {
      var coord = getRandomLeftTop();

      this.canvas.add(new fabric.Polygon([
        {x: 185, y: 0},
        {x: 250, y: 100},
        {x: 385, y: 170},
        {x: 0, y: 245} ], {
          left: coord.left,
          top: coord.top,
          fill: '#' + getRandomColor()
        }));
    };

    $scope.addText = function() {
      var text = 'Lorem ipsum dolor sit amet,\nconsectetur adipisicing elit,\nsed do eiusmod tempor incididunt\nut labore et dolore magna aliqua.\n' +
        'Ut enim ad minim veniam,\nquis nostrud exercitation ullamco\nlaboris nisi ut aliquip ex ea commodo consequat.';

      var textSample = new fabric.Text(text.slice(0, getRandomInt(0, text.length)), {
        left: getRandomInt(350, 400),
        top: getRandomInt(350, 400),
        fontFamily: 'helvetica',
        angle: getRandomInt(-10, 10),
        fill: '#' + getRandomColor(),
        scaleX: 0.5,
        scaleY: 0.5,
        fontWeight: '',
        originX: 'left',
        hasRotatingPoint: true,
        centerTransform: true
      });

      canvas.add(textSample);
    };

    $scope.addTextbox = function() {
      var text = 'Lorem ipsum dolor sit amet,\nconsectetur adipisicing elit,\nsed do eiusmod tempor incididunt\nut labore et dolore magna aliqua.\n' +
        'Ut enim ad minim veniam,\nquis nostrud exercitation ullamco\nlaboris nisi ut aliquip ex ea commodo consequat.';

      var textSample = new fabric.Textbox(text.slice(0, getRandomInt(0, text.length)), {
        fontSize: 20,
        left: getRandomInt(350, 400),
        top: getRandomInt(350, 400),
        fontFamily: 'helvetica',
        angle: getRandomInt(-10, 10),
        fill: '#' + getRandomColor(),
        fontWeight: '',
        originX: 'left',
        width: 300,
        hasRotatingPoint: true,
        centerTransform: true
      });

      canvas.add(textSample);
    };

    $scope.addIText = function() {
      var text = 'Lorem ipsum dolor sit amet,\nconsectetur adipisicing elit,\nsed do eiusmod tempor incididunt\nut labore et dolore magna aliqua.\n' +
        'Ut enim ad minim veniam,\nquis nostrud exercitation ullamco\nlaboris nisi ut aliquip ex ea commodo consequat.';

      var textSample = new fabric.IText(text.slice(0, getRandomInt(0, text.length)), {
        left: getRandomInt(350, 400),
        top: getRandomInt(350, 400),
        fontFamily: 'helvetica',
        angle: getRandomInt(-10, 10),
        fill: '#' + getRandomColor(),
        scaleX: 0.5,
        scaleY: 0.5,
        fontWeight: '',
        originX: 'left',
        hasRotatingPoint: true,
        centerTransform: true
      });

      canvas.add(textSample);
    };

    var addShape = function(shapeName) {

      console.log('adding shape', shapeName);

      var coord = getRandomLeftTop();

      fabric.loadSVGFromURL('../assets/' + shapeName + '.svg', function(objects, options) {

        var loadedObject = fabric.util.groupSVGElements(objects, options);

        loadedObject.set({
          left: coord.left,
          top: coord.top,
          angle: getRandomInt(-10, 10)
        })
        .setCoords();

        canvas.add(loadedObject);
      });
    };

    $scope.addPatternRect = function() {
      var coord = getRandomLeftTop();
      var rect = new fabric.Rect({
        width: 300,
        height: 300,
        left: coord.left,
        top: coord.top,
        angle: getRandomInt(-10, 10),
        fill: pattern,
      });
      canvas.add(rect);
    };

    $scope.maybeLoadShape = function(e) {
      var $el = $(e.target).closest('button.shape');
      if (!$el[0]) return;

      var id = $el.prop('id'), match;
      if (match = /\d+$/.exec(id)) {
        addShape(match[0]);
      }
    };

    function addImage(imageName, minScale, maxScale) {
      var coord = getRandomLeftTop();

      fabric.Image.fromURL('../assets/' + imageName, function(image) {

        image.set({
          left: coord.left,
          top: coord.top,
          angle: getRandomInt(-10, 10)
        })
        .scale(getRandomNum(minScale, maxScale))
        .setCoords();

        canvas.add(image);
      });
    };

    $scope.addImage1 = function() {
      addImage('pug.jpg', 0.1, 0.25);
    };

    $scope.addImage2 = function() {
      addImage('logo.png', 0.1, 1);
    };

    $scope.addImage3 = function() {
      addImage('printio.png', 0.5, 0.75);
    };

    $scope.addImage4 = function() {
      var src = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
      var video1El = document.createElement('video');
      video1El.crossOrigin = 'anonymous';
      video1El.src = src;
      video1El.addEventListener('loadeddata', function() {
          // Video is loaded and can be played
         var coord = getRandomLeftTop();
         var video = new fabric.Image(video1El, {
           left: coord.left,
           top: coord.top,
           angle: getRandomInt(-10, 10)
         });
         canvas.add(video);
      }, false);
      video1El.width = 384;
      video1El.height = 206;
      //video1El.style.display = 'none';
      document.body.appendChild(video1El);
      video1El.load();
    };

    $scope.confirmClear = function() {
      if (confirm('Are you sure?')) {
        canvas.clear();
      }
    };

    $scope.rasterize3x = function() {
      $scope.rasterize(3);
    }

    $scope.rasterize = function(multiplier) {
      if (!fabric.Canvas.supports('toDataURL')) {
        alert('This browser doesn\'t provide means to serialize canvas to an image');
      }
      else {
        var data = canvas.toDataURL({ multiplier: multiplier, format: 'png' });
        document.getElementById('canvasRasterizer').src = data;
      }
    };

    $scope.rasterizeSVG = function() {
      document.getElementById('SVGRasterizer').innerHTML = canvas.toSVG();
    };

    $scope.rasterizeJSON = function() {
      $scope.setConsoleJSON(JSON.stringify(canvas));
    };

    $scope.getSelected = function() {
      return canvas.getActiveObject();
    };

    $scope.removeSelected = function() {
      var activeObjects = canvas.getActiveObjects();
      canvas.discardActiveObject()
      if (activeObjects.length) {
        canvas.remove.apply(canvas, activeObjects);
      }
    };

    $scope.getLockScalingFlip = function() {
      return getActiveProp('lockScalingFlip');
    };
    $scope.setLockScalingFlip = function(value) {
      setActiveProp('lockScalingFlip', value);
    };

    $scope.getHorizontalLock = function() {
      return getActiveProp('lockMovementX');
    };
    $scope.setHorizontalLock = function(value) {
      setActiveProp('lockMovementX', value);
    };

    $scope.getVerticalLock = function() {
      return getActiveProp('lockMovementY');
    };
    $scope.setVerticalLock = function(value) {
      setActiveProp('lockMovementY', value);
    };

    $scope.getScaleLockX = function() {
      return getActiveProp('lockScalingX');
    },
    $scope.setScaleLockX = function(value) {
      setActiveProp('lockScalingX', value);
    };

    $scope.getScaleLockY = function() {
      return getActiveProp('lockScalingY');
    };
    $scope.setScaleLockY = function(value) {
      setActiveProp('lockScalingY', value);
    };

    $scope.getRotationLock = function() {
      return getActiveProp('lockRotation');
    };
    $scope.setRotationLock = function(value) {
      setActiveProp('lockRotation', value);
    };

    $scope.getOriginX = function() {
      return getActiveProp('originX') + '';
    };

    $scope.setOriginX = function(value) {
      var num = parseFloat(value);
      setActiveProp('originX', isNaN(num) ? value : num);
    };

    $scope.setCenteredRotation = function(value) {
      setActiveProp('centeredRotation', value);
    };

    $scope.getCenteredRotation = function(value) {
      return getActiveProp('centeredRotation');
    };

    $scope.getOriginY = function() {
      return getActiveProp('originY') + '';
    };
    $scope.setOriginY = function(value) {
      var num = parseFloat(value);
      setActiveProp('originY', isNaN(num) ? value : num);
    };

    $scope.getObjectCaching = function() {
      return getActiveProp('objectCaching');
    };

    $scope.setObjectCaching = function(value) {
      return setActiveProp('objectCaching', value);
    };

    $scope.getNoScaleCache = function() {
      return getActiveProp('noScaleCache');
    };

    $scope.setNoScaleCache = function(value) {
      return setActiveProp('noScaleCache', value);
    };

    $scope.getTransparentCorners = function() {
      return getActiveProp('transparentCorners');
    };

    $scope.setTransparentCorners = function(value) {
      return setActiveProp('transparentCorners', value);
    };

    $scope.getHasBorders = function() {
      return getActiveProp('hasBorders');
    };

    $scope.setHasBorders = function(value) {
      return setActiveProp('hasBorders', value);
    };

    $scope.getHasControls = function() {
      return getActiveProp('hasControls');
    };

    $scope.setHasControls = function(value) {
      return setActiveProp('hasControls', value);
    };

    $scope.sendBackwards = function() {
      var activeObject = canvas.getActiveObject();
      if (activeObject) {
        canvas.sendBackwards(activeObject);
      }
    };

    $scope.sendToBack = function() {
      var activeObject = canvas.getActiveObject();
      if (activeObject) {
        canvas.sendToBack(activeObject);
      }
    };

    $scope.bringForward = function() {
      var activeObject = canvas.getActiveObject();
      if (activeObject) {
        canvas.bringForward(activeObject);
      }
    };

    $scope.bringToFront = function() {
      var activeObject = canvas.getActiveObject();
      if (activeObject) {
        canvas.bringToFront(activeObject);
      }
    };

    $scope.patternify = function() {
      var obj = canvas.getActiveObject();

      if (!obj) return;

      if (obj.fill instanceof fabric.Pattern) {
        obj.set('fill', null);
      }
      else {
        obj.set('fill', pattern);
      }
      canvas.renderAll();
    };

    $scope.play = function() {
      var obj = canvas.getActiveObject();

      if (!obj || !obj.getElement || !obj.getElement().play) return;
      obj.getElement().play();
      renderLoop();
    };

    function renderLoop() {
      canvas.requestRenderAll();
      window.requestAnimationFrame(renderLoop);
    }

    $scope.clip = function() {
      var obj = canvas.getActiveObject();
      if (!obj) return;

      if (obj.clipTo) {
        obj.clipTo = null;
      }
      else {
        var radius = obj.width < obj.height ? (obj.width / 2) : (obj.height / 2);
        obj.clipTo = function (ctx) {
          ctx.arc(0, 0, radius, 0, Math.PI * 2, true);
        };
      }
      canvas.renderAll();
    };

    $scope.shadowify = function() {
      var obj = canvas.getActiveObject();
      if (!obj) return;

      if (obj.shadow) {
        obj.shadow = null;
      }
      else {
        obj.setShadow({
          color: 'rgba(0,0,0,0.3)',
          blur: 10,
          offsetX: 10,
          offsetY: 10
        });
      }
      canvas.renderAll();
    };

    $scope.gradientify = function() {
      var obj = canvas.getActiveObject();
      if (!obj) return;

      obj.setGradient('fill', {
        x1: 0,
        y1: 0,
        x2: (getRandomInt(0, 1) ? 0 : obj.width),
        y2: (getRandomInt(0, 1) ? 0 : obj.height),
        colorStops: {
          0: '#' + getRandomColor(),
          1: '#' + getRandomColor()
        }
      });
      canvas.renderAll();
    };

    $scope.execute = function() {
      if (!(/^\s+$/).test(consoleValue)) {
        eval(consoleValue);
      }
    };

    var consoleSVGValue = (
      '<?xml version="1.0" standalone="no"?>' +
        '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' +
      '<svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">' +
        '<rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:1;stroke:rgb(0,0,0)"/>' +
      '</svg>'
    );

    var consoleValue = (
      '// clear canvas\n' +
      'canvas.clear();\n\n' +
      '// remove currently selected object\n' +
      'canvas.remove(canvas.getActiveObject());\n\n' +
      '// add red rectangle\n' +
      'canvas.add(new fabric.Rect({\n' +
      '  width: 50,\n' +
      '  height: 50,\n' +
      '  left: 50,\n' +
      '  top: 50,\n' +
      "  fill: 'rgb(255,0,0)'\n" +
      '}));\n\n' +
      '// add green, half-transparent circle\n' +
      'canvas.add(new fabric.Circle({\n' +
      '  radius: 40,\n' +
      '  left: 50,\n' +
      '  top: 50,\n' +
      "  fill: 'rgb(0,255,0)',\n" +
      '  opacity: 0.5\n' +
      '}));\n'
    );

    var consoleJSONValue = (
      '{"version":"3.2.0","objects":[{"type":"polygon","version":"3.2.0","originX":"left","originY":"top","left":489,"top":255,"width":385,"height":245,"fill":"#15d37b","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"points":[{"x":185,"y":0},{"x":250,"y":100},{"x":385,"y":170},{"x":0,"y":245}]},{"type":"polygon","version":"3.2.0","originX":"left","originY":"top","left":131,"top":319,"width":385,"height":245,"fill":"#59d0d4","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"points":[{"x":185,"y":0},{"x":250,"y":100},{"x":385,"y":170},{"x":0,"y":245}]},{"type":"polygon","version":"3.2.0","originX":"left","originY":"top","left":373,"top":234,"width":385,"height":245,"fill":"#970097","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"points":[{"x":185,"y":0},{"x":250,"y":100},{"x":385,"y":170},{"x":0,"y":245}]},{"type":"polygon","version":"3.2.0","originX":"left","originY":"top","left":201,"top":109,"width":385,"height":245,"fill":"#045c68","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"points":[{"x":185,"y":0},{"x":250,"y":100},{"x":385,"y":170},{"x":0,"y":245}]},{"type":"polygon","version":"3.2.0","originX":"left","originY":"top","left":60,"top":310,"width":385,"height":245,"fill":"#2745d4","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"points":[{"x":185,"y":0},{"x":250,"y":100},{"x":385,"y":170},{"x":0,"y":245}]},{"type":"polygon","version":"3.2.0","originX":"left","originY":"top","left":214,"top":388,"width":385,"height":245,"fill":"#0b1b65","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"points":[{"x":185,"y":0},{"x":250,"y":100},{"x":385,"y":170},{"x":0,"y":245}]},{"type":"polygon","version":"3.2.0","originX":"left","originY":"top","left":517,"top":86,"width":385,"height":245,"fill":"#638442","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"points":[{"x":185,"y":0},{"x":250,"y":100},{"x":385,"y":170},{"x":0,"y":245}]},{"type":"polygon","version":"3.2.0","originX":"left","originY":"top","left":235,"top":358,"width":385,"height":245,"fill":"#72f456","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"points":[{"x":185,"y":0},{"x":250,"y":100},{"x":385,"y":170},{"x":0,"y":245}]},{"type":"polygon","version":"3.2.0","originX":"left","originY":"top","left":401,"top":137,"width":385,"height":245,"fill":"#679084","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"points":[{"x":185,"y":0},{"x":250,"y":100},{"x":385,"y":170},{"x":0,"y":245}]}]}'
    );



    $scope.getConsoleJSON = function() {
      return consoleJSONValue;
    };
    $scope.setConsoleJSON = function(value) {
      consoleJSONValue = value;
    };
    $scope.getConsoleSVG = function() {
      return consoleSVGValue;
    };
    $scope.setConsoleSVG = function(value) {
      consoleSVGValue = value;
    };
    $scope.getConsole = function() {
      return consoleValue;
    };
    $scope.setConsole = function(value) {
      consoleValue = value;
    };

    $scope.loadSVGWithoutGrouping = function() {
      _loadSVGWithoutGrouping(consoleSVGValue);
    };
    $scope.loadSVG = function() {
      _loadSVG(consoleSVGValue);
    };

    var _loadSVG = function(svg) {
      fabric.loadSVGFromString(svg, function(objects, options) {
        var obj = fabric.util.groupSVGElements(objects, options);
        canvas.add(obj).centerObject(obj).renderAll();
        obj.setCoords();
      });
    };

    var _loadSVGWithoutGrouping = function(svg) {
      fabric.loadSVGFromString(svg, function(objects) {
        canvas.renderOnAddRemove = false;
        canvas.add.apply(canvas, objects);
        canvas.renderOnAddRemove = true;
        canvas.renderAll();
      });
    };

    $scope.saveJSON = function(withDefaults) {
      canvas.includeDefaultValues = withDefaults;
      _saveJSON(JSON.stringify(canvas.toJSON()));
    };

    var _saveJSON = function(json) {
      $scope.setConsoleJSON(json);
    };

    $scope.loadJSON = function() {
      _loadJSON(consoleJSONValue);
    };

    var _loadJSON = function(json) {
      canvas.loadFromJSON(json, function(){
        canvas.renderAll();
      });
    };

    function initCustomization() {
      if (typeof Cufon !== 'undefined' && Cufon.fonts.delicious) {
        Cufon.fonts.delicious.offsetLeft = 75;
        Cufon.fonts.delicious.offsetTop = 25;
      }

      if (/(iPhone|iPod|iPad)/i.test(navigator.userAgent)) {
        fabric.Object.prototype.cornerSize = 30;
      }

      fabric.Object.prototype.transparentCorners = false;

      if (document.location.search.indexOf('guidelines') > -1) {
        initCenteringGuidelines(canvas);
        initAligningGuidelines(canvas);
      }
    }

    initCustomization();

    function addTexts() {
      var iText = new fabric.IText('lorem ipsum\ndolor\nsit Amet\nconsectetur', {
        left: 100,
        top: 150,
        fontFamily: 'Helvetica',
        fill: '#333',
        styles: {
          0: {
            0: { fill: 'red', fontSize: 20 },
            1: { fill: 'red', fontSize: 30 },
            2: { fill: 'red', fontSize: 40 },
            3: { fill: 'red', fontSize: 50 },
            4: { fill: 'red', fontSize: 60 },

            6: { textBackgroundColor: 'yellow' },
            7: { textBackgroundColor: 'yellow' },
            8: { textBackgroundColor: 'yellow' },
            9: { textBackgroundColor: 'yellow' }
          },
          1: {
            0: { textDecoration: 'underline' },
            1: { textDecoration: 'underline' },
            2: { fill: 'green', fontStyle: 'italic', textDecoration: 'underline' },
            3: { fill: 'green', fontStyle: 'italic', textDecoration: 'underline' },
            4: { fill: 'green', fontStyle: 'italic', textDecoration: 'underline' }
          },
          2: {
            0: { fill: 'blue', fontWeight: 'bold' },
            1: { fill: 'blue', fontWeight: 'bold' },
            2: { fill: 'blue', fontWeight: 'bold' },

            4: { fontFamily: 'Courier', textDecoration: 'line-through' },
            5: { fontFamily: 'Courier', textDecoration: 'line-through' },
            6: { fontFamily: 'Courier', textDecoration: 'line-through' },
            7: { fontFamily: 'Courier', textDecoration: 'line-through' }
          },
          3: {
            0: { fontFamily: 'Impact', fill: '#666', textDecoration: 'line-through' },
            1: { fontFamily: 'Impact', fill: '#666', textDecoration: 'line-through' },
            2: { fontFamily: 'Impact', fill: '#666', textDecoration: 'line-through' },
            3: { fontFamily: 'Impact', fill: '#666', textDecoration: 'line-through' },
            4: { fontFamily: 'Impact', fill: '#666', textDecoration: 'line-through' }
          }
        }
      });

      var iText2 = new fabric.IText('foo bar\nbaz\nquux', {
        left: 400,
        top: 150,
        fontFamily: 'Helvetica',
        fill: '#333',
        styles: {
          0: {
            0: { fill: 'red' },
            1: { fill: 'red' },
            2: { fill: 'red' }
          },
          2: {
            0: { fill: 'blue' },
            1: { fill: 'blue' },
            2: { fill: 'blue' },
            3: { fill: 'blue' }
          }
        }
      });

      canvas.add(iText, iText2);
    }

    addTexts();


    $scope.getPreserveObjectStacking = function() {
      return canvas.preserveObjectStacking;
    };
    $scope.setPreserveObjectStacking = function(value) {
      return canvas.preserveObjectStacking = value;
    };

    $scope.getEnableRetinaScaling = function() {
      return canvas.enableRetinaScaling;
    };
    $scope.setEnableRetinaScaling = function(value) {
      canvas.enableRetinaScaling = value;
      canvas.setDimensions({
        width: canvas.width,
        height: canvas.height });
      return value
    };

    $scope.getSkipOffscreen = function() {
      return canvas.skipOffscreen;
    };
    $scope.setSkipOffscreen = function(value) {
      return canvas.skipOffscreen = value;
    };

    $scope.getFreeDrawingMode = function() {
      return canvas.isDrawingMode;
    };
    $scope.setFreeDrawingMode = function(value) {
      canvas.isDrawingMode = !!value;
      $scope.$$phase || $scope.$digest();
    };

    $scope.freeDrawingMode = 'Pencil';

    $scope.getDrawingMode = function() {
      return $scope.freeDrawingMode;
    };
    $scope.setDrawingMode = function(type) {
      $scope.freeDrawingMode = type;

      if (type === 'hline') {
        canvas.freeDrawingBrush = $scope.vLinePatternBrush;
      }
      else if (type === 'vline') {
        canvas.freeDrawingBrush = $scope.hLinePatternBrush;
      }
      else if (type === 'square') {
        canvas.freeDrawingBrush = $scope.squarePatternBrush;
      }
      else if (type === 'diamond') {
        canvas.freeDrawingBrush = $scope.diamondPatternBrush;
      }
      else if (type === 'texture') {
        canvas.freeDrawingBrush = $scope.texturePatternBrush;
      }
      else {
        canvas.freeDrawingBrush = new fabric[type + 'Brush'](canvas);
      }

      $scope.$$phase || $scope.$digest();
    };

    $scope.getDrawingLineWidth = function() {
      if (canvas.freeDrawingBrush) {
        return canvas.freeDrawingBrush.width;
      }
    };
    $scope.setDrawingLineWidth = function(value) {
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = parseInt(value, 10) || 1;
      }
    };

    $scope.getDrawingLineColor = function() {
      if (canvas.freeDrawingBrush) {
        return canvas.freeDrawingBrush.color;
      }
    };
    $scope.setDrawingLineColor = function(value) {
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = value;
      }
    };

    $scope.getDrawingLineShadowWidth = function() {
      if (canvas.freeDrawingBrush && canvas.freeDrawingBrush.shadow) {
        return canvas.freeDrawingBrush.shadow.blur || 1;
      }
      else {
        return 0
      }
    };
    $scope.setDrawingLineShadowWidth = function(value) {
      if (canvas.freeDrawingBrush) {
        var blur = parseInt(value, 10) || 1;
        if (blur > 0) {
          canvas.freeDrawingBrush.shadow = new fabric.Shadow({blur: blur, offsetX: 10, offsetY: 10}) ;
        }
        else {
          canvas.freeDrawingBrush.shadow = null;
        }
      }
    };

    function initBrushes() {
      if (!fabric.PatternBrush) return;

      initVLinePatternBrush();
      initHLinePatternBrush();
      initSquarePatternBrush();
      initDiamondPatternBrush();
      initImagePatternBrush();
    }
    initBrushes();

    function initImagePatternBrush() {
      var img = new Image();
      img.src = '../assets/honey_im_subtle.png';

      $scope.texturePatternBrush = new fabric.PatternBrush(canvas);
      $scope.texturePatternBrush.source = img;
    }

    function initDiamondPatternBrush() {
      $scope.diamondPatternBrush = new fabric.PatternBrush(canvas);
      $scope.diamondPatternBrush.getPatternSrc = function() {

        var squareWidth = 10, squareDistance = 5;
        var patternCanvas = fabric.document.createElement('canvas');
        var rect = new fabric.Rect({
          width: squareWidth,
          height: squareWidth,
          angle: 45,
          fill: this.color
        });

        var canvasWidth = rect.getBoundingRect().width;

        patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
        rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 });

        var ctx = patternCanvas.getContext('2d');
        rect.render(ctx);

        return patternCanvas;
      };
    }

    function initSquarePatternBrush() {
      $scope.squarePatternBrush = new fabric.PatternBrush(canvas);
      $scope.squarePatternBrush.getPatternSrc = function() {

        var squareWidth = 10, squareDistance = 2;

        var patternCanvas = fabric.document.createElement('canvas');
        patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
        var ctx = patternCanvas.getContext('2d');

        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, squareWidth, squareWidth);

        return patternCanvas;
      };
    }

    function initVLinePatternBrush() {
      $scope.vLinePatternBrush = new fabric.PatternBrush(canvas);
      $scope.vLinePatternBrush.getPatternSrc = function() {

        var patternCanvas = fabric.document.createElement('canvas');
        patternCanvas.width = patternCanvas.height = 10;
        var ctx = patternCanvas.getContext('2d');

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(0, 5);
        ctx.lineTo(10, 5);
        ctx.closePath();
        ctx.stroke();

        return patternCanvas;
      };
    }

    function initHLinePatternBrush() {
      $scope.hLinePatternBrush = new fabric.PatternBrush(canvas);
      $scope.hLinePatternBrush.getPatternSrc = function() {

        var patternCanvas = fabric.document.createElement('canvas');
        patternCanvas.width = patternCanvas.height = 10;
        var ctx = patternCanvas.getContext('2d');

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(5, 0);
        ctx.lineTo(5, 10);
        ctx.closePath();
        ctx.stroke();

        return patternCanvas;
      };
    }
  }

  function watchCanvas($scope) {

    function updateScope() {
      $scope.$$phase || $scope.$digest();
      canvas.renderAll();
    }

    canvas
      .on('object:selected', updateScope)
      .on('path:created', updateScope)
      .on('selection:cleared', updateScope);
  }

var $main = $('#canvas-wrapper'),
dragIn = function(e) {
      if (e.preventDefault) {
        e.preventDefault();
      }
      $('#canvas').addClass('highlight');
      return false;
    },
    dragOut = function(e) {
      if (e.preventDefault) {
        e.preventDefault();
      }
      $('#canvas').removeClass('highlight');
      return false;
    },
    dropImage = function(e) {
      e.preventDefault();
      e.stopPropagation();
      var img = e.originalEvent.dataTransfer.getData('text/html');
      console.log(img);
      var rex = /src="?([^"\s]+)"?\s*/;
      var url = rex.exec(img);
      fabric.Image.fromURL(url[1], function(oImg) {
        canvas.add(oImg);
      });

      console.log("Drop started");
      $('#canvas').removeClass('highlight');;

      console.log('Drop done');
    }
  $main.on('drop', dropImage);
  $main.on('dragover dragenter', dragIn);
  $main.on('dragexit dragleave', dragOut);

  var googleKey =  'AIzaSyDDj8FP9qZBQPEf6lxsjO-ozuk6WhbrEvM';

   $('#CSE').click(function(e) {
     $('#formCSE').submit(function(e) {
       $('#resultCSE').empty();
       var query =  $('#queryCSE').val();
       $.get('https://www.googleapis.com/customsearch/v1/siterestrict?key='+ googleKey +'&cx=008426595733103543205%3A__a1wiukcxm&q='+ query +'&fileType=png&searchType=image', function(data) {
         for (result of data.items) {

           $('#resultCSE').append('<ul class="list-group">'+
  '<li class="list-group-item">'+'<img height="100px" width="100px" src="'+ result.link +'">'+ result.title + '<\/li>'+
'<\/ul>')

         }
         if(!data.queries.previousPage) {
           $("#previousPage").addClass('hide')
         }

         if(data.queries.previousPage) {
           $("#previousPage").removeClass('hide');
         }

       });

       var index = 1;

       $scope.previousPage = function() {
         $('#resultCSE').empty();
         index = index - 10;
         $.get('https://www.googleapis.com/customsearch/v1/siterestrict?key='+ googleKey +'&cx=008426595733103543205%3A__a1wiukcxm&q='+ query +'&start='+ index +'&fileType=png&searchType=image', function(data) {
           var query =  $('#queryCSE').val();
           for (result of data.items) {
             $('#resultCSE').append('<ul class="list-group">'+
    '<li class="list-group-item">'+'<img height="100px" width="100px" src="'+ result.link +'">'+ result.title + '<\/li>'+
  '<\/ul>')
           }
           if(!data.queries.previousPage) {
             $("#previousPage").addClass('hide')
           }

           if(data.queries.previousPage) {
             $("#previousPage").removeClass('hide');
           }
         });
       };

       $scope.nextPage = function() {
         $('#resultCSE').empty();
         index = index + 10;
         $.get('https://www.googleapis.com/customsearch/v1/siterestrict?key='+ googleKey +'&cx=008426595733103543205%3A__a1wiukcxm&q='+ query +'&start='+ index +'&fileType=png&searchType=image', function(data) {
           var query =  $('#queryCSE').val();
           for (result of data.items) {
             $('#resultCSE').append('<ul class="list-group">'+
    '<li class="list-group-item">'+'<img height="100px" width="100px" src="'+ result.link +'">'+ result.title + '<\/li>'+
  '<\/ul>')
           }
           if(!data.queries.previousPage) {
             $("#previousPage").addClass('hide')
           }

           if(data.queries.previousPage) {
             $("#previousPage").removeClass('hide');
           }
         });
       };
     });
  });
});
