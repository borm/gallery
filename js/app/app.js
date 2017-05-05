/**
 * Created by borm on 04.05.17.
 */
var fex = {};

(function (window, app) {

  function extend(Child, Parent) {
    var F = function() { };
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.superclass = Parent.prototype;
  }

  function Component() {
    this.init();
  }

  Component.prototype.init = function () {};

  app.component = {
    create: function (component) {
      extend(component, Component);
    }
  };

  app.config = {
    api: 'http://82.196.1.83:9571/'
  };

})(window, fex);