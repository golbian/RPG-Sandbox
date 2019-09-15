angular.module('app').directive('fileModal', function ($http, fileService) {
    return {

      templateUrl: 'partials/files/galleryModal.html',

        link: function ($scope) {
            $scope.init = function () {
                $scope.catalogImages = [];
                $scope.catalogIcons = [];

                // for (var i = 1; i < 100; ++i) {
                //     var image = {};
                //     var imgnbr = '';
                //     if (i < 10) { imgnbr = '0' + i; } else { imgnbr = i; }
                //
                //     image.url = '/resources/images/tumbnails100/PNG/sprite-' + imgnbr + '_1.png';
                //     image.source1400 = '/resources/images/width1400/PNG/sprite-' + imgnbr + '_1.png';
                //     image.source700 = '/resources/images/width700/PNG/sprite-' + imgnbr + '_1.png';
                //
                //     $scope.catalogImages.push(image);
                // }

                return fileService.getFiles().then(function (files) {
                    $scope.files = files;
                });
            };


            $scope.modalOptions = {
                ok: function (result) {
                    $('#fileGalleryModal').modal('hide');
                },
                close: function (result) {
                    $('#fileGalleryModal').modal('hide');
                }
            };

            var activeObject = canvas.getActiveObject();
            var absCoords = canvas.getAbsoluteCoords(activeObject);

              var spriteOption = {
                spriteWidth: 64,
                spriteHeight: 64,
                totalWidth: 640,
                totalHeight: 384,
                animationFrameDuration: 50
              }

            $scope.onFileSelected = function (file) {

        function animateImgFromURL(imgURL, options, callback) {
            const left = options.left || 0;
            const top = options.top || 0;
            let x = 0;
            let y = 0;
            fabric.Image.fromURL(
                imgURL,
                image => {
                    setTimeout(() => {
                        setInterval(() => {
                            x = (x - options.spriteWidth) % options.totalWidth;
                            if (x === 0) {
                                y = (y - options.spriteHeight) % options.totalHeight;
                            }
                            image.set("left",absCoords.left + x + (activeObject.width/2));
                            image.set("top",absCoords.top + y + (activeObject.height/2));
                            image.set("selectable", false);
                            image.set("hasControls", false);
                        }, options.animationFrameDuration)
                    });
                    callback(image);
                }, {
                    width: options.totalWidth,
                    height: options.totalHeight,
                    left: left,
                    top: top,
                    clipTo: ctx => {
                        ctx.rect(-x - options.totalWidth / 2, -y - options.totalHeight / 2, options.spriteWidth, options.spriteHeight);
                    }
                });
              };

        animateImgFromURL(file.url, spriteOption, image => canvas.add(image));

        (function render() {
          canvas.renderAll();
          fabric.util.requestAnimFrame(render);
      })();

                $('#fileGalleryModal').modal('hide');
            };

            $scope.upload = function (file) {
                if (!file) {
                    return;
                }

                const type = file.type.split('/')[0];
                if (type !== 'image') {
                    noty({ text: 'You may only upload images', timeout: 4000, type: 'error' });
                    return;
                }

                var uploadPromise = fileService.uploadFile(file);

                var newFile = {
                    loading: true
                };
                $scope.files.push(newFile);

                uploadPromise.then(file => {
                    $.extend(newFile, file);
                    newFile.loading = false;
                    $scope.$digest();
                });
            };

            // https://api.unsplash.com/search/photos/?client_id=65d94c5d3440b6da10c6cd390059fd709a1f33ffc8f46f46ed44d6b6c6759559&query=office
        }
    };
});
