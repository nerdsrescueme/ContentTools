(function() {
  var BaseEditorApp, ImageUploader, WebmaxEditor,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ImageUploader = (function() {
    ImageUploader.imagePath = 'image.png';

    ImageUploader.imageSize = [600, 174];

    function ImageUploader(dialog) {
      this._dialog = dialog;
      this._dialog.addEventListener('cancel', (function(_this) {
        return function() {
          return _this._onCancel();
        };
      })(this));
      this._dialog.addEventListener('imageuploader.cancelupload', (function(_this) {
        return function() {
          return _this._onCancelUpload();
        };
      })(this));
      this._dialog.addEventListener('imageuploader.clear', (function(_this) {
        return function() {
          return _this._onClear();
        };
      })(this));
      this._dialog.addEventListener('imageuploader.fileready', (function(_this) {
        return function(ev) {
          return _this._onFileReady(ev.detail().file);
        };
      })(this));
      this._dialog.addEventListener('imageuploader.mount', (function(_this) {
        return function() {
          return _this._onMount();
        };
      })(this));
      this._dialog.addEventListener('imageuploader.rotateccw', (function(_this) {
        return function() {
          return _this._onRotateCCW();
        };
      })(this));
      this._dialog.addEventListener('imageuploader.rotatecw', (function(_this) {
        return function() {
          return _this._onRotateCW();
        };
      })(this));
      this._dialog.addEventListener('imageuploader.save', (function(_this) {
        return function() {
          return _this._onSave();
        };
      })(this));
      this._dialog.addEventListener('imageuploader.unmount', (function(_this) {
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
      console.log(file);
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

  ContentTools.ActionBarUI = (function(_super) {
    __extends(ActionBarUI, _super);

    function ActionBarUI() {
      ActionBarUI.__super__.constructor.call(this);
      this._actions = [];
    }

    ActionBarUI.prototype.mount = function() {
      var actionUI, i, _i, _len, _ref, _results;
      this._domElement = this.constructor.createDiv(['ct-widget', 'ct-action-bar']);
      this.parent().domElement().appendChild(this._domElement);
      this._domActions = this.constructor.createDiv(['ct-action-bar__actions', 'ct-actions']);
      this._domElement.appendChild(this._domActions);
      this._addDOMEventListeners();
      if (0 === this._actions.length) {
        this.addDefaultActions();
      }
      _ref = this._actions;
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        actionUI = _ref[i];
        _results.push(actionUI.mount(this._domActions));
      }
      return _results;
    };

    ActionBarUI.prototype.unmount = function() {
      ActionBarUI.__super__.unmount.call(this);
      return this._domActions = null;
    };

    ActionBarUI.prototype.addDefaultActions = function() {
      this._actions.push(new ContentTools.ActionUI('addPage', 'Add page'));
      this._actions.push(new ContentTools.ActionUI('addBlock', 'Add block'));
      return this._actions.push(new ContentTools.ActionUI('metadata', 'Manage metadata'));
    };

    return ActionBarUI;

  })(ContentTools.WidgetUI);

  ContentTools.Actions = {
    addPage: function(domElement, event) {
      return alert('Show create page dialog');
    },
    addBlock: function(domElement, event) {
      return alert('Show create block dialog');
    },
    metadata: function(domElement, event) {
      return alert('Show manage metadata dialog');
    }
  };

  ContentTools.ActionUI = (function(_super) {
    __extends(ActionUI, _super);

    function ActionUI(name, label, action) {
      this._onMouseDown = __bind(this._onMouseDown, this);
      ActionUI.__super__.constructor.call(this);
      this.name = name;
      this.label = label;
      this.action = action || function() {};
    }

    ActionUI.prototype.mount = function(domParent, before) {
      if (before == null) {
        before = null;
      }
      this._domElement = this.constructor.createDiv(['ct-action', 'ct-action__button', 'ct-action__button--' + this.name]);
      this._domElement.setAttribute('data-tooltip', ContentEdit._(this.label));
      return ActionUI.__super__.mount.call(this, domParent, before);
    };

    ActionUI.prototype._addDOMEventListeners = function() {
      return this._domElement.addEventListener('mousedown', this._onMouseDown);
    };

    ActionUI.prototype._onMouseDown = function(ev) {
      ev.preventDefault();
      return ContentTools.Actions[this.name].call(this, this._domElement, ev);
    };

    return ActionUI;

  })(ContentTools.AnchoredComponentUI);

  BaseEditorApp = ContentTools.EditorApp.getCls();

  WebmaxEditor = (function(_super) {
    __extends(WebmaxEditor, _super);

    function WebmaxEditor() {
      WebmaxEditor.__super__.constructor.call(this);
      this._actionBar = null;
    }

    WebmaxEditor.prototype.init = function(queryOrDOMElements, namingProp) {
      if (namingProp == null) {
        namingProp = 'id';
      }
      WebmaxEditor.__super__.init.call(this, queryOrDOMElements, namingProp);
      this._actionBar = new ContentTools.ActionBarUI();
      return this.attach(this._actionBar);
    };

    WebmaxEditor.prototype.start = function() {
      WebmaxEditor.__super__.start.call(this);
      return this._actionBar.show();
    };

    WebmaxEditor.prototype.stop = function(save) {
      WebmaxEditor.__super__.stop.call(this, save);
      return this._actionBar.hide();
    };

    WebmaxEditor.prototype.unmount = function() {
      WebmaxEditor.__super__.unmount.call(this);
      return this._actionBar = null;
    };

    return WebmaxEditor;

  })(BaseEditorApp);

  ContentTools.EditorApp.getCls = function() {
    return WebmaxEditor;
  };

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
    return editor.addEventListener('saved', function(ev) {
      var content, def, outputData, region, regions, saved;
      regions = ev.detail().regions;
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
      saved = function(to) {
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
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        return xhr.send(JSON.stringify(outputData));
      };
      return saved(putEndpoint);
    });
  };

}).call(this);
