(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.unknown = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.clamp = _clamp;
  _exports.cyclic = _cyclic;
  _exports.gcd = gcd;
  _exports.invlerp = _invlerp;
  _exports.lerp = _lerp;
  _exports.project = project;
  _exports.steps = steps;
  _exports.units = _exports.Units = void 0;

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var Lens = /*#__PURE__*/function () {
    function Lens() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$unit = _ref.unit,
          unit = _ref$unit === void 0 ? 1 : _ref$unit,
          _ref$is = _ref.is,
          is = _ref$is === void 0 ? 1 : _ref$is,
          _ref$as = _ref.as,
          as = _ref$as === void 0 ? 1 : _ref$as,
          _ref$min = _ref.min,
          min = _ref$min === void 0 ? 0 : _ref$min,
          _ref$max = _ref.max,
          max = _ref$max === void 0 ? 1 : _ref$max,
          _ref$grid = _ref.grid,
          grid = _ref$grid === void 0 ? 1 : _ref$grid,
          _ref$origin = _ref.origin,
          origin = _ref$origin === void 0 ? 0 : _ref$origin;

      _classCallCheck(this, Lens);

      this.data = {
        unit: unit,
        is: is,
        as: as,
        min: min,
        max: max,
        grid: grid,
        origin: origin
      }; // Would improve flexibility by wrapping all getters in Lens with this, allowing Units and Lens to use the same normalization function
      // this.normalize = normalize || Units.normalize
    }

    _createClass(Lens, [{
      key: "unit",
      get: function get() {
        return this.data.unit || this.data.is || 1;
      }
    }, {
      key: "is",
      get: function get() {
        return this.data.is || this.unit;
      }
    }, {
      key: "as",
      get: function get() {
        return this.data.as || this.unit;
      }
    }, {
      key: "min",
      get: function get() {
        return this.data.min || 0;
      }
    }, {
      key: "max",
      get: function get() {
        return this.data.max || Number.MAX_SAFE_INTEGER;
      }
    }, {
      key: "grid",
      get: function get() {
        return this.data.grid || 1;
      }
    }, {
      key: "origin",
      get: function get() {
        return this.data.origin || 0;
      }
    }, {
      key: "use",
      value: function use(data) {
        return Object.assign({}, this.data, data);
      }
    }, {
      key: "assign",
      value: function assign(data) {
        this.data = this.use(data);
        return this;
      }
    }]);

    return Lens;
  }();
  /**
   * Recursively calculates the greatest common denominator (GCD) between two values
   *
   * @param {Number} x
   * @param {Number} y
   * @returns {Number}
   */


  function gcd(x, y) {
    return y === 0 ? x : gcd(y, x % y);
  }
  /**
   * Modifies a value so that it is always between x and y
   *
   * @param {Number} value
   * @param {Number} x
   * @param {Number} y
   * @returns {Number}
   */


  function _clamp(value) {
    var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    return Math.min(y, Math.max(x, value));
  }
  /**
   * Interpolation function returning the value between x and y at a specific ratio
   *
   * @param {Number} value
   * @param {Number} x
   * @param {Number} y
   * @returns {Number}
   */


  function _lerp(ratio, x, y) {
    return x * (1 - ratio) + y * ratio;
  }
  /**
   * Interpolation function returning the ratio of a value clamped between x and y
   *
   * @param {Number} value
   * @param {Number} x
   * @param {Number} y
   * @returns {Number}
   */


  function _invlerp(value, x, y) {
    return _clamp((value - x) / (y - x));
  }
  /**
   * Cycles a value around an range (from x to y).
   *
   * @param {Number} value
   * @param {Number} x
   * @param {Number} y
   * @returns {Number}
  */


  function _cyclic(value, x, y) {
    return (value >= x ? value : value + y) % y;
  }
  /**
   * Projects a value given a source domain (from) to a target domain (to).
   * Domains are provided as range tuples ([min, max]).
   *
   * @param {Number} value
   * @param {Array<Number>} from
   * @param {Array<Number>} to
   * @returns {Number}
   */


  function project(value) {
    var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0];
    var to = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0];
    return (value - from[0]) / (from[1] - from[0]) * (to[1] - to[0]) + to[0];
  }
  /**
   * Determines the element found in an array at a given ratio
   *
   * @param {Float} ratio
   * @param {Array} all
   */


  function steps(ratio, all) {
    ratio %= 1;
    if (ratio < 0) ratio += 1;
    return all[Math.floor(ratio * all.length)];
  } // TODO: Support calc method for allowing conversion of units via string (like CSS):


  var Units = /*#__PURE__*/function () {
    function Units() {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref2$map = _ref2.map,
          map = _ref2$map === void 0 ? {} : _ref2$map,
          _ref2$lens = _ref2.lens,
          lens = _ref2$lens === void 0 ? {} : _ref2$lens;

      _classCallCheck(this, Units);

      this.map = map;
      this.lens = new Lens(lens);
    }

    _createClass(Units, [{
      key: "normalize",
      value: function normalize(unit) {
        if (typeof unit === 'number') {
          return unit;
        }

        if (typeof unit === 'string') {
          var value = this.map[unit] || 1;
          return typeof value === 'function' ? value(unit, this) : Number(value);
        }

        return 1;
      }
    }, {
      key: "scope",
      value: function scope() {
        var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
        var lens = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.lens;

        var _this$lens$use = this.lens.use(lens),
            is = _this$lens$use.is,
            as = _this$lens$use.as,
            min = _this$lens$use.min,
            max = _this$lens$use.max,
            origin = _this$lens$use.origin;

        var index = this.cast(value - origin, {
          is: is,
          as: as
        });
        var head = this.cast(min || 0, {
          is: is,
          as: as
        });
        var tail = this.cast(max || value, {
          is: is,
          as: as
        });
        return {
          value: value,
          index: index,
          head: head,
          tail: tail
        };
      } // TODO: Allow `is` and `as` to be provided as mapping functions

    }, {
      key: "cast",
      value: function cast() {
        var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

        var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref3$is = _ref3.is,
            is = _ref3$is === void 0 ? this.lens.unit : _ref3$is,
            _ref3$as = _ref3.as,
            as = _ref3$as === void 0 ? this.lens.unit : _ref3$as;

        return this.normalize(value) / (this.normalize(as) / this.normalize(is));
      }
    }, {
      key: "snap",
      value: function snap(value) {
        var lens = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.lens;

        var _this$scope = this.scope(value, lens),
            index = _this$scope.index;

        var unit = this.normalize(lens.as || lens.unit);
        var calc = typeof lens.calc === 'function' ? lens.calc : Math.floor;
        return calc(index) * unit;
      }
    }, {
      key: "clamp",
      value: function clamp(value, lens) {
        var _this$scope2 = this.scope(value, lens),
            index = _this$scope2.index,
            head = _this$scope2.head,
            tail = _this$scope2.tail;

        return _clamp(index, head, tail);
      }
    }, {
      key: "cyclic",
      value: function cyclic(value, lens) {
        var _this$scope3 = this.scope(value, lens),
            index = _this$scope3.index,
            head = _this$scope3.head,
            tail = _this$scope3.tail;

        return _cyclic(index, head, tail);
      }
    }, {
      key: "lerp",
      value: function lerp(ratio, lens) {
        var _this$scope4 = this.scope(0, lens),
            head = _this$scope4.head,
            tail = _this$scope4.tail;

        return _lerp(ratio, head, tail);
      }
    }, {
      key: "invlerp",
      value: function invlerp(value, lens) {
        var _this$scope5 = this.scope(value, lens),
            index = _this$scope5.index,
            head = _this$scope5.head,
            tail = _this$scope5.tail;

        return _invlerp(index, head, tail);
      }
    }, {
      key: "delta",
      value: function delta(value, lens) {
        var _this$scope6 = this.scope(value, lens),
            index = _this$scope6.index,
            head = _this$scope6.head;

        return index - head;
      }
    }, {
      key: "range",
      value: function range(value, lens) {
        var _this$scope7 = this.scope(value, lens),
            head = _this$scope7.head,
            tail = _this$scope7.tail;

        return tail - head;
      }
    }, {
      key: "progress",
      value: function progress(value, lens) {
        var delta = this.delta(value, lens);
        var range = this.range(value, lens);
        return delta / range;
      }
    }, {
      key: "fold",
      value: function fold(value) {
        var lens = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.lens;
        var grid = lens.grid || 1;
        var basis = gcd(value, grid);
        var size = this.clamp(value, lens);
        var container = this.snap(size, {
          as: basis
        });
        var ratio = Math.max(1, Math.min(value / basis, grid));
        var min = value >= grid ? grid : basis;
        return Math.max(min, this.snap(container, {
          as: ratio
        }));
      } // Changes the base unit to the provided key by recalculating and replacing the unit map pairs.
      // TODO: Test, and ensure that the base unit is equal to 1 (or, could just use scale)

    }, {
      key: "rebase",
      value: function rebase() {
        var _this = this;

        var unit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.lens.unit;
        if (unit === this.lens.unit) return this;
        var map = Object.entries(this.map).reduce(function (map, _ref4) {
          var _ref5 = _slicedToArray(_ref4, 2),
              key = _ref5[0],
              value = _ref5[1];

          return Object.assign(map, _defineProperty({}, key, _this.cast(value, {
            is: _this.lens.is,
            as: unit
          })), _defineProperty({}, unit, 1));
        });
        this.map = map;
        this.lens.unit = unit;
        return this;
      }
    }, {
      key: "clone",
      value: function clone(props) {
        var map = Object.assign({}, this.map, props.map);
        var lens = Object.assign({}, this.lens, props.lens);
        return new Units({
          map: map,
          lens: lens
        });
      }
    }], [{
      key: "use",
      value: function use(props) {
        return new Units(props);
      }
    }]);

    return Units;
  }();

  _exports.Units = Units;

  var units = function units(props) {
    return new Units(props);
  };

  _exports.units = units;
});
//# sourceMappingURL=segu.umd.js.map
