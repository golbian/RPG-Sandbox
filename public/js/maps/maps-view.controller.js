    angular.module('app.maps').controller('MapsViewController', MapsViewController);

    MapsViewController.$inject = ['$scope', 'connection', '$compile', 'userService', 'mapModel', '$routeParams', '$uibModal', '$timeout', 'map'];

    function MapsViewController ($scope, connection, $compile, userService, mapModel, $routeParams, $uibModal, $timeout, map) {
        const vm = this;
        vm.map = map;
        $scope.selectedMap = {};
        $scope.selectedMap._id = vm.map._id;
        $scope.selectedMap.chat = {};
        $scope.mapNameModal = 'partials/map/modals/mapNameModal.html';
        $scope.gameListModal = 'partials/map/modals/gameListModal.html';
        $scope.mode = 'edit';
        $scope.duplicateOptions = {};
        $scope.duplicateOptions.freeze = false;
        $scope.duplicateOptions.header = 'Duplicate map';
        $scope.mapObject = true;
        $scope.tokenObject = false;
        $scope.mapLock = false;
        $scope.tokenLock = false;

        var socket = new WebSocket('ws://127.0.0.1:9090/&num/maps/edit/'+vm.map._id, [], {'force new connection':true} );

        socket.onopen = () => {
          console.log('socket on');
        }

          socket.addEventListener('message', function(msg){

              var data = msg.data;
              data = JSON.parse(data);

              if (data.type === 'msg') {
                $('#chat-output').append('<div style="font-size:20px; font-family:Palatino Linotype, Book Antiqua, Palatino, serif; " class="msg">'+'<span>'+ data.user +' : '+ data.msg +'</span>'+'</div>');
                }

                if (data.type === 'roll') {
                  $('#chat-output').append('<div style="font-size:20px; font-family:Palatino Linotype, Book Antiqua, Palatino, serif; " class="rollMsg">'+'<span>'+ data.user +' : Rolling ('+ data.input +') => '+ data.output +'</span>'+'</div>');
                }

                if (data.type === 'objectModified') {
                  var objects = canvas.getObjects();
                  for (object of objects) {
                    if (object.tokenID === data.id) {
                      object.top = data.top;
                      object.left = data.left;
                      object.scaleX = data.scaleX;
                      object.scaleY =data.scaleY;
                      object.angle = data.angle;
                    }
                  }
                  canvas.renderAll();
                }
            });


        $scope.$on('loadMapStrucutureForGame', function (event, args) {
            var map = args.map;

            $scope.selectedMap = map;
            $scope.mode = 'edit';
            $scope.isForGame = true;

          });

        $('.chatForm').submit(function (e) {

          userService.getCurrentUser().then(function(result){
            var user = result.userName;


          if ($scope.selectedMap.chat.messages.startsWith('/roll')) {
            var inputRoll = $scope.selectedMap.chat.messages.slice(5);
            var outputRoll = d20.roll(inputRoll);

            var messages = {
              user: user,
              type: 'roll',
              input: inputRoll,
              output: outputRoll
            }

            socket.send(JSON.stringify(messages));

          } else {
            var messages = {
              user: user,
              type: 'msg',
              msg: $scope.selectedMap.chat.messages
            };
            socket.send(JSON.stringify(messages));
          }
        });
      });

        $scope.initMapList = function () {
            $scope.navigation.page = 1;

            return $scope.getMaps().then(function () {
                $scope.mode = 'list';
            });
        };

      var initCanvas = function() {
          _loadJSON(vm.map.properties);
        };

        var _loadJSON = function(json) {
          canvas.loadFromJSON(json, function(){
            canvas.renderAll();
          });
        };

        initCanvas();


    $scope.mapName = function () {
            if ($scope.mode === 'edit') {
                $('#theMapNameModal').modal('show');
                $scope.mapNameSave();
            }
        };

        $scope.mapNameSave = function () {

          var saveJSON = JSON.stringify(canvas.toJSON(['tokenID']));

          $scope.selectedMap.properties = saveJSON;

            return mapModel.saveAsMap($scope.selectedMap, $scope.mode).then(function () {
                $('#theMapNameModal').modal('hide');
                $('.modal-backdrop').hide();
                $scope.goBack();
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

          if ($scope.mapObject === false) {

            let newToken = {
                health: '0',
                mana: '0',
                stamina: '0',
                companyID: 'COMPID',
                owner: '5d12fccb1b2ea11164aa3df9'
            };

            canvas.on('object:added', function() {
              connection.post('/api/token/create', newToken).then( function (result) {
                var tokens = canvas.getObjects();
                for (token of tokens) {
                  if (!token.group) {
                    if(!token.tokenID) {
                token.toObject = (function(toObject) {
                  return function() {
                    return fabric.util.object.extend(toObject.call(this), {
                      tokenID: this.tokenID,
                    });
                  };
                })(token.toObject);

                token.tokenID = result.item._id;

                }
              }
            }
              });
            });
        }

          new fabric.Image.fromURL(url[1],  function(oImg) {
              canvas.add(oImg);
          });

          console.log("Drop started");
          $('#canvas').removeClass('highlight');;

          console.log('Drop done');
        }
      $main.on('drop', dropImage);
      $main.on('dragover dragenter', dragIn);
      $main.on('dragexit dragleave', dragOut);

      fabric.Canvas.prototype.getAbsoluteCoords = function(object) {
        return {
          left: object.left + this._offset.left,
          top: object.top + this._offset.top
        };
      }

      function copy() {
	//getObject then Copy it.
	var object = canvas.getActiveObject();

  if (object.tokenID) {
    window.tokenType = 'token';
  }

  object.clone(function(cloned) {
		_clipboard = cloned;
	});
}

function paste() {
	// clone again, so you can do multiple copies.
	_clipboard.clone(function(clonedObj) {
		canvas.discardActiveObject();
		clonedObj.set({
			left: clonedObj.left + 10,
			top: clonedObj.top + 10,
			evented: true,
		});
      let newToken = {
          health: '0',
          mana: '0',
          stamina: '0',
          companyID: 'COMPID',
          owner: '5d12fccb1b2ea11164aa3df9'
      };

        if (window.tokenType === 'token') {
          connection.post('/api/token/create', newToken).then( function (result) {
            var tokens = canvas.getObjects();
            for (token of tokens) {
              if (!token.group) {
                if(!token.tokenID) {
            token.toObject = (function(toObject) {
              return function() {
                return fabric.util.object.extend(toObject.call(this), {
                  tokenID: this.tokenID,
                });
              };
            })(token.toObject);

            token.tokenID = result.item._id;

            }
          }
        }
          });
        }
			canvas.add(clonedObj);

		_clipboard.top += 10;
		_clipboard.left += 10;
		canvas.setActiveObject(clonedObj);
		canvas.requestRenderAll();
	});
}

      function positionOverlay(activeObject) {
      var absCoords = canvas.getAbsoluteCoords(activeObject);
      var zoom = canvas.getZoom();

      var overlayTokens = $('#overlayToken'+ activeObject.tokenID);
      var healthTokens = $('.health');
      var manaTokens = $('.mana');
      var staminaTokens = $('.stamina');
      var tokenEdits = $('.tokenEdit');

      for (overlayToken of overlayTokens) {
          overlayToken.style.left = (absCoords.left * zoom) + canvas.viewportTransform[4] + 'px';
          overlayToken.style.top = (absCoords.top * zoom) + canvas.viewportTransform[5] + 'px';
          overlayToken.style.height = (activeObject.height * activeObject.scaleY) * zoom + 'px';
          overlayToken.style.width = (activeObject.width  * activeObject.scaleX) * zoom + 'px';
          overlayToken.style.pointerEvents = 'none';
        }

        for (healthToken of healthTokens) {
          healthToken.style.left = '0px';
          healthToken.style.top = -70 - (30 * zoom) +'px';
          healthToken.style.width = (activeObject.width * activeObject.scaleX) * zoom + 'px';
          healthToken.children[0].style.pointerEvents = 'auto';
        }

        for (manaToken of manaTokens) {
          manaToken.style.left = '0px';
          manaToken.style.top = -50 - (30 * zoom) + 'px';
          manaToken.style.width = (activeObject.width * activeObject.scaleX) * zoom  + 'px';
          manaToken.children[0].style.pointerEvents = 'auto';
        }

        for (staminaToken of staminaTokens) {
          staminaToken.style.left = '0px';
          staminaToken.style.top = -30 - (30 * zoom) + 'px';
          staminaToken.style.width = (activeObject.width * activeObject.scaleX) * zoom + 'px';
          staminaToken.children[0].style.pointerEvents = 'auto';
          }

        for (tokenEdit of tokenEdits) {
          tokenEdit.style.top = (activeObject.height * activeObject.scaleY) * zoom +'px';
          tokenEdit.style.left = (activeObject.width * activeObject.scaleX) * zoom + 'px';
          tokenEdit.children[0].style.pointerEvents ='auto';
        }
      }

      canvas.on('object:modified', function(opt) {
        var messages = {
          type: 'objectModified',
          top: opt.target.top,
          left: opt.target.left,
          id: opt.target.tokenID,
          scaleX: opt.target.scaleX,
          scaleY: opt.target.scaleY,
          angle: opt.target.angle,
        }

        socket.send(JSON.stringify(messages));
      });

      canvas.on('object:removed', function(opt) {
        var messages = {
          type: 'objectModified',
          top: opt.target.top,
          left: opt.target.left,
          id: opt.target.tokenID,
          scaleX: opt.target.scaleX,
          scaleY: opt.target.scaleY,
        }

        socket.send(JSON.stringify(messages));
      });

      canvas.on('selection:created', function(opt) {

        var activeObject = canvas.getActiveObject();



        if (activeObject.tokenID) {
          if ($('#overlayToken'+ activeObject.tokenID).length) {

            activeObject.on('moving', function() { positionOverlay(activeObject) });
            activeObject.on('scaling', function() { positionOverlay(activeObject) });
            positionOverlay(activeObject);

            $('#overlayToken'+ activeObject.tokenID).fadeIn();

  } else {

    connection.get('/api/token/find-one', {id : activeObject.tokenID}).then(function(result) {
      var health = result.item.health;
      var mana = result.item.mana;
      var stamina = result.item.stamina;

      $('#bd-wrapper').append('<div id="overlayToken'+ activeObject.tokenID +'" style="position:absolute">'+
        '<div class=" health progress" >'+
        '<span id="healthBar'+activeObject.tokenID+'" class="progress-bar progress-bar-striped progress-bar-animated bg-danger"  style="width:'+health+'%">'+health+'</span>'+
        '</div>'+
        '<div class=" mana progress" >'+
          '<span id="manaBar'+activeObject.tokenID+'" class="progress-bar progress-bar-striped progress-bar-animated" style="width:'+mana+'%">'+mana+'</span>'+
        '</div>'+
        '<div class="stamina progress" >'+
          '<span id="staminaBar'+activeObject.tokenID+'" class="progress-bar progress-bar-striped progress-bar-animated bg-success"  style="width:'+stamina+'%">'+stamina+'</span>'+
        '</div>'+
        '<div class="tokenEdit">'+
          '<button id="settings'+activeObject.tokenID+'" class="btn">'+
          '<i class="fa fa-cogs"></i>'+
          '</button>'+
        '</div>'+
    '</div>')

    $('#settings'+activeObject.tokenID).click(function(){
       const modal = $uibModal.open({
           component: 'appTokenModal',
           resolve: {
             id: () => function() {
               return activeObject.tokenID;
             },
           },
       });
     });

    $('#healthBar'+ activeObject.tokenID).attr('contenteditable', true);
    $('#manaBar'+ activeObject.tokenID).attr('contenteditable', true);
    $('#staminaBar'+ activeObject.tokenID).attr('contenteditable', true);

    activeObject.on('moving', function() { positionOverlay(activeObject) });
    activeObject.on('scaling', function() { positionOverlay(activeObject) });
    positionOverlay(activeObject);

    });
  }
}

document.onkeydown = function(e) {
  if (e.keyCode == 67) {
    copy();
    console.log('copy');
  }

  if (e.keyCode == 86) {
    paste();
    console.log('paste');
  }
};

  });

  canvas.on('selection:updated', function(opt) {

    var previousID = opt.deselected[0].tokenID;
    var activeObject = canvas.getActiveObject();

    if (activeObject.tokenID) {
      if ($('#overlayToken'+ activeObject.tokenID).length) {

        $('#healthBar'+ activeObject.tokenID).attr('contenteditable', true);
        $('#manaBar'+ activeObject.tokenID).attr('contenteditable', true);
        $('#staminaBar'+ activeObject.tokenID).attr('contenteditable', true);

        //$('#overlayToken'+ activeObject.tokenID).fadeOut();
        $('#overlayToken'+ activeObject.tokenID).fadeIn();

        connection.get('/api/token/find-one', {id : activeObject.tokenID}).then(function(result) {
          var health = result.health;
          var mana = result.mana;
          var stamina = result.stamina;
        });

        var previousH = $('#healthBar'+ previousID).text();
        var previousM = $('#manaBar'+ previousID).text();
        var previousS = $('#staminaBar'+ previousID).text();

        let updatedToken = {
            _id: previousID,
            health: previousH,
            mana: previousM,
            stamina: previousS,
            companyID: 'COMPID',
            owner: '5d12fccb1b2ea11164aa3df9'
        };

        connection.post('/api/token/update/' + previousID, updatedToken);

        activeObject.on('moving', function() { positionOverlay(activeObject) });
        activeObject.on('scaling', function() { positionOverlay(activeObject) });
        positionOverlay(activeObject);

        $('#overlayToken'+ previousID).fadeOut();
        //$('#overlayToken'+ previousID).addClass('hide');

    } else {

      connection.get('/api/token/find-one', {id : activeObject.tokenID}).then(function(result) {
        var healthNum = result.item.health;
        var manaNum = result.item.mana;
        var staminaNum = result.item.stamina;

        $('#bd-wrapper').append('<div id="overlayToken'+ activeObject.tokenID +'" style="position:absolute">'+
          '<div class=" health progress" >'+
          '<span id="healthBar'+activeObject.tokenID+'" class="progress-bar progress-bar-striped progress-bar-animated bg-danger"  style="width:'+healthNum+'%">'+healthNum+'</span>'+
          '</div>'+
          '<div class=" mana progress" >'+
            '<span id="manaBar'+activeObject.tokenID+'" class="progress-bar progress-bar-striped progress-bar-animated" style="width:'+manaNum+'%">'+manaNum+'</span>'+
          '</div>'+
          '<div class="stamina progress" >'+
            '<span id="staminaBar'+activeObject.tokenID+'" class="progress-bar progress-bar-striped progress-bar-animated bg-success"  style="width:'+staminaNum+'%">'+staminaNum+'</span>'+
          '</div>'+
        '<div class="tokenEdit">'+
          '<button id="settings'+activeObject.tokenID+'" class="btn">'+
          '<i class="fa fa-cogs"></i>'+
          '</button>'+
        '</div>'+
      '</div>')

      $('#healthBar'+ activeObject.tokenID).attr('contenteditable', true);
      $('#manaBar'+ activeObject.tokenID).attr('contenteditable', true);
      $('#staminaBar'+ activeObject.tokenID).attr('contenteditable', true);

      $('#settings'+activeObject.tokenID).click(function(){
         const modal = $uibModal.open({
             component: 'appTokenModal',
             resolve: {
               id: () => function() {
                 return activeObject.tokenID;
               },
             },
         });
       });

      activeObject.on('moving', function() { positionOverlay(activeObject) });
      activeObject.on('scaling', function() { positionOverlay(activeObject) });
      positionOverlay(activeObject);

      });

    var previousID = opt.deselected[0].tokenID;

    $('#overlayToken'+ previousID).fadeOut();
    //$('#overlayToken'+ previousID).addClass('hide');

    }
  }

  document.onpresskey = function(e) {
    if (e.keyCode == 67) {
      copy();
    }

    if (e.keyCode == 86) {
      paste();
    }

    if (e.keyCode == 46) {
        var activeObjects = canvas.getActiveObjects();
        //canvas.discardActiveObject();
        if (activeObjects.length) {
          canvas.remove.apply(canvas, activeObjects);
        }
      };
  };
  });


  canvas.on('before:selection:cleared', function() {

    var activeObject = canvas.getActiveObject();

    //$('#overlayToken'+ activeObject.tokenID).removeClass('show');
    $('#overlayToken'+ activeObject.tokenID).fadeOut();

  });

    $scope.mapLockOff = function() {
        $scope.mapLock = false;
        var canvasObjects = canvas.getObjects();
        for (object of canvasObjects) {
          if (!object.tokenID) {
              object.set('selectable', true);
              object.set('hoverCursor', 'move');
          }
        }
      }

      $scope.mapLockOn = function() {
        $scope.mapLock = true;
        var canvasObjects = canvas.getObjects();
        for (object of canvasObjects) {
          if (!object.tokenID) {
              object.set('selectable', false);
              object.set('hoverCursor', 'default');
          }
        }
      }

    $scope.tokenLockOff = function() {
        $scope.tokenLock = false;
        var canvasObjects = canvas.getObjects();
        for (object of canvasObjects) {
          if (object.tokenID) {
            object.set('selectable', true);
            object.set('hoverCursor', 'move');
          }
        }
      }

        $scope.tokenLockOn = function() {
        $scope.tokenLock = true;
        var canvasObjects = canvas.getObjects();
        for (object of canvasObjects) {
          if (object.tokenID) {
            object.set('selectable', false);
            object.set('hoverCursor', 'default');
          }
        }
      }

      var googleKey =  'AIzaSyDDj8FP9qZBQPEf6lxsjO-ozuk6WhbrEvM';

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


         $('#chat-msg').submit(function () {

         })

         canvas.on('mouse:down', function(opt) {
           var evt = opt.e;

           if (evt.ctrlKey === true) {
              this.isDragging = true;
              this.selection = false;
              this.lastPosX = evt.clientX;
              this.lastPosY = evt.clientY;
          }
        });

        canvas.on('mouse:up', function(opt) {
          this.isDragging = false;
          this.selection = true;
          var objects = canvas.getObjects();
          for (object of objects) {
            object.setCoords();
          }
        })

        canvas.on('mouse:move', function(opt) {
          if (this.isDragging) {
            var e = opt.e;
            this.viewportTransform[4] += e.clientX - this.lastPosX;
            this.viewportTransform[5] += e.clientY - this.lastPosY;
            this.requestRenderAll();
            this.lastPosX = e.clientX;
            this.lastPosY = e.clientY;
          }
        });

        canvas.on('mouse:wheel', function(opt) {
          var delta = opt.e.deltaY;
          var pointer = canvas.getPointer(opt.e);
          var zoom = canvas.getZoom();
          zoom = zoom + -delta/200;
          if (zoom > 20) zoom = 20;
          if (zoom < 0.01) zoom = 0.01;
          canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
          opt.e.preventDefault();
          opt.e.stopPropagation();
    });
  };
