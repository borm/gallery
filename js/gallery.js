/**
 * Created by borm on 04.05.17.
 */
(function (window, app) {

  function Gallery(element, name, template) {
    this.element = element;
    this.name = name;
    Gallery.superclass.constructor.apply(this, arguments);
  }

  Gallery.name = 'Gallery';

  app.component.create(Gallery);

  Gallery.prototype.init = function () {
    // this.element.style.visibility = 'hidden';

    app.ajax({
      url: app.config.api,
      method: 'get'
    }).done(function (res) {
      this.images = res.data;
      this.preload();
      this.width = this.element.offsetWidth;

      var offsetWidth;
      window.addEventListener('resize', function () {
        offsetWidth = this.element.offsetWidth;

        if ( offsetWidth !== this.width ) {
          this.width = offsetWidth;
          this.group();
          this.resize();
        }

      }.bind(this));

    }.bind(this));
  };

  Gallery.prototype.preload = function () {

    var images = this.images
      , $image, $imageContainer;

    var $element = this.element;

    var initialHeight = 200, ratio
      , originalWidth, originalHeight, style;

    images.forEach(function (img) {
      $imageContainer = document.createElement('span');

      $image = document.createElement('img');
      $image.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

      originalWidth = img.width;
      originalHeight = img.height;

      ratio = originalHeight / initialHeight;

      style = {
        width: originalWidth / ratio,
        height: initialHeight
      };

      $imageContainer.dataset.originalImage = app.config.api + img.filename;
      $imageContainer.dataset.originalWidth = style.width;
      $imageContainer.dataset.originalHeight = style.height;

      $imageContainer.style.width = style.width + 'px';
      $imageContainer.style.height = style.height + 'px';

      $imageContainer.appendChild($image);

      $element.appendChild($imageContainer);
    });

    this.group();
    this.resize();
    this.load();

  };

  Gallery.prototype.group = function () {
    var nodes = [].slice.call(this.element.children)
      , $node, nodeOffsetWidth;

    var elemWidth = this.element.offsetWidth;

    var rowWidth = 0;

    this.rows = [];

    var i ,l, index = 0;

    for (i = 0, l = nodes.length; i < l; i++) {
      $node = nodes[i];
      nodeOffsetWidth = Math.ceil($node.dataset.originalWidth);

      rowWidth += nodeOffsetWidth;

      if ( !this.rows[index] ) {
        this.rows[index] = {
          width: 0,
          nodes: []
        };
      }

      if ( rowWidth < elemWidth ) {
        this.rows[index].width = rowWidth;
        this.rows[index].nodes.push($node);
      } else {
        index++;
        rowWidth = nodeOffsetWidth;
        this.rows[index] = {
          width: rowWidth,
          nodes: [$node]
        };
      }
    }
  };

  Gallery.prototype.load = function () {

    var nodes = [].slice.call(this.element.children);

    var updateLoadedCounter = function (node) {
      return function (event) {

        if ( event.type === 'error' ) {
          this.element.removeChild(node);
          this.group();
          this.resize();
        } else {
          node.className = 'loaded';
          node.children[0].src = node.dataset.originalImage
        }

      }.bind(this)
    }.bind(this);

    var loadImage = function (node) {
      var image = new Image;

      image.onload = updateLoadedCounter(node);
      image.onerror = updateLoadedCounter(node);

      image.src = node.dataset.originalImage;
    };

    nodes.forEach(loadImage);

  };

  Gallery.prototype.resize = function () {
    var widthDiff, elemWidth = this.element.offsetWidth
      , rowsLength = this.rows.length;

    this.rows.forEach(function (row, rowIdx) {
      widthDiff = elemWidth - row.width;

      var ratio = ( ( row.width + widthDiff ) / row.width );

      var $img, nodeOriginalWidth, originalHeight;
      row.nodes.forEach(function (node) {
        $img = node.children[0];
        nodeOriginalWidth = +node.dataset.originalWidth;
        originalHeight = +node.dataset.originalHeight;
        if ( rowIdx < rowsLength - 1 ) {
          node.style.width = nodeOriginalWidth * ratio + 'px';
          node.style.height = originalHeight * ratio + 'px';
        } else {
          node.style.width = 'auto';
          node.style.height = originalHeight + 'px';
        }
      })
    })
  };

  new Gallery(document.getElementById('gallery'), 'gallery', 'gallery-item');

})(window, fex);