'use strict';
/**
 * Project: flash-on-angularjs.
 * Copyright (c) 2013, Eugene-Krevenets
 */

var module = angular.module('flashExample', ['flashContainer']);

function ImageUploaderCtrl($scope) {
    console.log('TestCtrl');
    $scope.flashvars = {
        id: '46',
        inProgressImageUrl: '/images/loading.gif',
        defaultImageUrl: 'http://beta.celebvideomessages.com/i/inprogress.gif',
        imageUrl: 'http://dl.realaxy.com/3q7tl3dnv0rp16h4l038p9fcov',
        postUrl: 'http://beta.celebvideomessages.com/api/v1/profile/edit/',
        postTemplate: '{"id" : "{{id}}", "userpic_data" : "{{userpic_data}}" }',
        uploadButtonIsVisible: true,
        //
        //fetch
        fetchCompleteHandler: 'api.fetchCompleteHandler',
        //push
        pushCompleteHandler: 'api.pushCompleteHandler',
        //user upload image
        userUploadImageHandler: 'api.userUploadImageHandler',
        sendBack: 'ImageUploaderCtrl.receiveFromFlash'
    };

    $scope.message = 'You can type here!';

    var updateFromFlash = false;

    $scope.$watch('message', function(value) {
        if (updateFromFlash) {
            updateFromFlash = false;
            return;
        }
        var element = document.getElementById('testFlash');
        console.log('element', element);
        if (element) {
            element.sendMessage(value);
        }
    })

    ImageUploaderCtrl.receiveFromFlash = function(message) {
        console.log(message);
        $scope.$apply(function() {
            updateFromFlash = true;
            $scope.message = message;
        });
    }
}

angular.module('flashContainer', []).directive('flash', ['$compile', function factory($compile) {
    var UNDEF = "undefined",
        OBJECT = "object";
    console.log('request flash');
    function setDefaultFor(scope, param, defValue) {
        scope.$watch(param, function(value) {
            if (value === '' || value == null) {
                scope[param] = defValue;
            }
        })
    }

    return {
        restrict: 'EACM',
        template: '<div>' +
                    '    <p>' +
                    '        To view this page ensure that Adobe Flash Player version' +
                    '        {{version}} or greater is installed.' +
                    '    </p>' +
                    '    <a href=\'http://www.adobe.com/go/getflashplayer\'><img src=\'http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif\' alt=\'Get Adobe Flash player\'/></a>' +
                    '</div>',
        replace: true,
        scope:{
            flashId: '@',
            source: '@',
            movie: '@source',
            width: '@',
            height: '@',
            quality: '@',
            bgcolor: '@',
            version: '@',
            allowScriptAccess: '@',
            allowFullScreen: '@',
            flashvars: '@',
            // To use express install, set to playerProductInstall.swf, otherwise the empty string.
            xiSwfUrlStr: '@'
        },
        link: function(scope, elm, attrs, ctrl) {
            setDefaultFor(scope, 'width', '100%');
            setDefaultFor(scope, 'height', '100%');
            setDefaultFor(scope, 'quality', 'high');
            setDefaultFor(scope, 'bgcolor', '#ffffff');
            setDefaultFor(scope, 'allowScriptAccess', 'sameDomain');
            setDefaultFor(scope, 'allowFullScreen', 'true');
            setDefaultFor(scope, 'version', '11.4.0');
            setDefaultFor(scope, 'xiSwfUrlStr', 'lib/playerProductInstall.swf');

            scope.$watch('width', function(value) {
                console.log('width ' + value);
            })

            attrs.$observe('quality', function(value) {
                invalidateView();
            });

            attrs.$observe('source', function(value) {
                invalidateView();
            });

            attrs.$observe('bgcolor', function(value) {
                invalidateView();
            });

            attrs.$observe('allowScriptAccess', function(value) {
                invalidateView();
            });

            attrs.$observe('allowFullScreen', function(value) {
                invalidateView();
            });

            attrs.$observe('flashvars', function(value) {
                invalidateView();
                scope.flashvarsString = '';
                if (value == null || value == '') {
                    return;
                }
                var flashVarObj = JSON.parse(value);
                scope.flashvarsObj = flashVarObj;
                if (flashVarObj && typeof flashVarObj === OBJECT) {
                    for (var k in flashVarObj) { // copy object to avoid the use of references, because web authors often reuse flashvarsObj for multiple SWFs
                        if (scope.flashvarsString !== '') {
                            scope.flashvarsString += "&" + k + "=" + flashVarObj[k];
                        } else {
                            scope.flashvarsString = k + "=" + flashVarObj[k];
                        }
                    }
                }

                scope.flashvarsString = scope.flashvarsString.replace(/"/g, '&quot;');

                console.log('scope.flashvarsString = ' + scope.flashvarsString);

                invalidateView();
            });


            var _invalide = false;

            function invalidateView() {
                if (_invalide) {
                    return;
                }

                _invalide = true;
                setTimeout(function() {
                    _invalide = false;
                    validateView();
                }, 0);
            }

            function validateView() {
                if(!scope.flashId) {
                    scope.flashId = 'id_' + Date.now() + Math.random();
                }

                elm.attr('id', scope.flashId);

                console.log('elm.id' + elm.attr('id'));

                var params = {};
                params.quality = scope.quality;
                params.bgcolor = scope.bgcolor;
                params.allowscriptaccess = scope.allowscriptaccess;
                params.allowfullscreen = scope.allowfullscreen;
                params.allownetworking = scope.allownetworking;

                var attributes = {};
                attributes.id = scope.flashId;
                attributes.name = scope.flashId;
                attributes.align = scope.align;

                swfobject.embedSWF(
                    scope.source, elm.attr('id'),
                    scope.width, scope.height,
                    scope.version, scope.xiSwfUrlStr,
                    scope.flashvarsObj, params, attributes);
            }
        }
    }
}])