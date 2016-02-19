(function() {
  var ImageUploader,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ImageUploader = (function() {
    ImageUploader.imagePath = 'image.png';

    ImageUploader.imageSize = [600, 174];

    function ImageUploader(dialog) {
      this._dialog = dialog;
      this._dialog.bind('cancel', (function(_this) {
        return function() {
          return _this._onCancel();
        };
      })(this));
      this._dialog.bind('imageUploader.cancelUpload', (function(_this) {
        return function() {
          return _this._onCancelUpload();
        };
      })(this));
      this._dialog.bind('imageUploader.clear', (function(_this) {
        return function() {
          return _this._onClear();
        };
      })(this));
      this._dialog.bind('imageUploader.fileReady', (function(_this) {
        return function(files) {
          return _this._onFileReady(files);
        };
      })(this));
      this._dialog.bind('imageUploader.mount', (function(_this) {
        return function() {
          return _this._onMount();
        };
      })(this));
      this._dialog.bind('imageUploader.rotateCCW', (function(_this) {
        return function() {
          return _this._onRotateCCW();
        };
      })(this));
      this._dialog.bind('imageUploader.rotateCW', (function(_this) {
        return function() {
          return _this._onRotateCW();
        };
      })(this));
      this._dialog.bind('imageUploader.save', (function(_this) {
        return function() {
          return _this._onSave();
        };
      })(this));
      this._dialog.bind('imageUploader.unmount', (function(_this) {
        return function() {
          return _this._onUnmount();
        };
      })(this));
    }

    ImageUploader.prototype._onCancel = function() {};

    ImageUploader.prototype._onCancelUpload = function() {
      clearTimeout(this._uploadingTimeout);
      return this._dialog.state('empty');
    };

    ImageUploader.prototype._onClear = function() {
      return this._dialog.clear();
    };

    ImageUploader.prototype._onFileReady = function(file) {
      var upload;
      this._dialog.progress(0);
      this._dialog.state('uploading');
      upload = (function(_this) {
        return function() {
          var progress;
          progress = _this._dialog.progress();
          progress += 1;
          if (progress <= 100) {
            _this._dialog.progress(progress);
            return _this._uploadingTimeout = setTimeout(upload, 25);
          } else {
            return _this._dialog.populate(ImageUploader.imagePath, ImageUploader.imageSize);
          }
        };
      })(this);
      return this._uploadingTimeout = setTimeout(upload, 25);
    };

    ImageUploader.prototype._onMount = function() {};

    ImageUploader.prototype._onRotateCCW = function() {
      var clearBusy;
      this._dialog.busy(true);
      clearBusy = (function(_this) {
        return function() {
          return _this._dialog.busy(false);
        };
      })(this);
      return setTimeout(clearBusy, 1500);
    };

    ImageUploader.prototype._onRotateCW = function() {
      var clearBusy;
      this._dialog.busy(true);
      clearBusy = (function(_this) {
        return function() {
          return _this._dialog.busy(false);
        };
      })(this);
      return setTimeout(clearBusy, 1500);
    };

    ImageUploader.prototype._onSave = function() {
      var clearBusy;
      this._dialog.busy(true);
      clearBusy = (function(_this) {
        return function() {
          _this._dialog.busy(false);
          return _this._dialog.save(ImageUploader.imagePath, ImageUploader.imageSize, {
            alt: 'Example of bad variable names'
          });
        };
      })(this);
      return setTimeout(clearBusy, 1500);
    };

    ImageUploader.prototype._onUnmount = function() {};

    ImageUploader.createImageUploader = function(dialog) {
      return new ImageUploader(dialog);
    };

    return ImageUploader;

  })();

  window.ImageUploader = ImageUploader;

  window.onload = function() {
    var editor, owner, properties, putEndpoint, schema, subject, type;
    if (!window.CONTENT_ENDPOINT || !window.WORKFLOW_ENDPOINT) {
      console.log('Unable to initialize editor, no endpoints found.');
      return;
    }
    ContentTools.IMAGE_UPLOADER = ImageUploader.createImageUploader;
    ContentTools.StylePalette.add([new ContentTools.Style('By-line', 'article__by-line', ['p']), new ContentTools.Style('Caption', 'article__caption', ['p']), new ContentTools.Style('Example', 'example', ['pre']), new ContentTools.Style('Example + Good', 'example--good', ['pre']), new ContentTools.Style('Example + Bad', 'example--bad', ['pre'])]);
    editor = ContentTools.EditorApp.get();
    owner = document.querySelector('div[about^="phpcr|"]');
    if (!owner) {
      console.log('Unable to initialize editor, no owner document found.');
      return;
    }
    schema = owner.getAttribute('xmlns:schema');
    subject = owner.getAttribute('about');
    type = owner.getAttribute('typeof').replace('schema:', schema);
    if (!schema || !subject || !type) {
      console.log('Unable to initialize editor, owner data is not complete.');
      return;
    }
    putEndpoint = "" + window.CONTENT_ENDPOINT + "/" + subject;
    properties = document.querySelectorAll('*[property^="schema:"]');
    editor.init(properties, 'property');
    return editor.bind('save', function(regions, autoSave) {
      var content, def, outputData, region, save;
      if (0 === Object.keys(regions).length) {
        new ContentTools.FlashUI('ok');
        return;
      }
      editor.busy(true);
      outputData = {};
      outputData['@subject'] = "<" + subject + ">";
      outputData['@type'] = "<" + type + ">";
      for (region in regions) {
        content = regions[region];
        def = region.replace('schema:', schema);
        outputData["<" + def + ">"] = content;
      }
      save = function(to) {
        var xhr;
        xhr = new XMLHttpRequest();
        xhr.addEventListener('readystatechange', function() {
          var data, successResultCodes, _ref;
          if (xhr.readyState === 4) {
            successResultCodes = [200];
            if (_ref = xhr.status, __indexOf.call(successResultCodes, _ref) >= 0) {
              data = JSON.parse(xhr.responseText);
              console.log('data message: ', data.message);
              editor.busy(false);
              return new ContentTools.FlashUI('ok');
            } else {
              console.log('Error loading data...');
              editor.busy(false);
              return new ContentTools.FlashUI('no');
            }
          }
        });
        xhr.open('PUT', to, false);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.setRequestHeader('Accept', 'application/json');
        return xhr.send(JSON.stringify(outputData));
      };
      return save(putEndpoint);
    });
  };

}).call(this);
