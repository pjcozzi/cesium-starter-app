/**
 * Cesium - https://github.com/AnalyticalGraphicsInc/cesium
 *
 * Copyright 2011-2013 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/AnalyticalGraphicsInc/cesium/blob/master/LICENSE.md for full licensing details.
 */
(function () {
/*global define*/
define('Core/defined',[],function() {
    "use strict";

    /**
     * Returns true if the object is defined, returns false otherwise.
     *
     * @exports defined
     *
     * @example
     * if (defined(positions)) {
     *      doSomething();
     * } else {
     *      doSomethingElse();
     * }
     */
    var defined = function(value) {
        return value !== undefined;
    };

    return defined;
});

/*global define*/
define('Core/freezeObject',['./defined'], function(defined) {
    "use strict";

    /**
     * Freezes an object, using Object.freeze if available, otherwise returns
     * the object unchanged.  This function should be used in setup code to prevent
     * errors from completely halting JavaScript execution in legacy browsers.
     *
     * @private
     *
     * @exports freezeObject
     */
    var freezeObject = Object.freeze;
    if (!defined(freezeObject)) {
        freezeObject = function(o) {
            return o;
        };
    }

    return freezeObject;
});
/*global define*/
define('Core/defaultValue',[
        './freezeObject'
    ], function(
        freezeObject) {
    "use strict";

    /**
     * Returns the first parameter if not undefined, otherwise the second parameter.
     * Useful for setting a default value for a parameter.
     *
     * @exports defaultValue
     *
     * @example
     * param = defaultValue(param, 'default');
     */
    var defaultValue = function(a, b) {
        if (a !== undefined) {
            return a;
        }
        return b;
    };

    /**
     * A frozen empty object that can be used as the default value for options passed as
     * an object literal.
     */
    defaultValue.EMPTY_OBJECT = freezeObject({});

    return defaultValue;
});
/*global define*/
define('Core/DeveloperError',['./defined'], function(defined) {
    "use strict";

    /**
     * Constructs an exception object that is thrown due to a developer error, e.g., invalid argument,
     * argument out of range, etc.  This exception should only be thrown during development;
     * it usually indicates a bug in the calling code.  This exception should never be
     * caught; instead the calling code should strive not to generate it.
     * <br /><br />
     * On the other hand, a {@link RuntimeError} indicates an exception that may
     * be thrown at runtime, e.g., out of memory, that the calling code should be prepared
     * to catch.
     *
     * @alias DeveloperError
     *
     * @param {String} [message=undefined] The error message for this exception.
     *
     * @see RuntimeError
     * @constructor
     */
    var DeveloperError = function(message) {
        /**
         * 'DeveloperError' indicating that this exception was thrown due to a developer error.
         * @type {String}
         * @constant
         */
        this.name = 'DeveloperError';

        /**
         * The explanation for why this exception was thrown.
         * @type {String}
         * @constant
         */
        this.message = message;

        var e = new Error();

        /**
         * The stack trace of this exception, if available.
         * @type {String}
         * @constant
         */
        this.stack = e.stack;
    };

    DeveloperError.prototype.toString = function() {
        var str = this.name + ': ' + this.message;

        if (defined(this.stack)) {
            str += '\n' + this.stack.toString();
        }

        return str;
    };

    return DeveloperError;
});

/*global define*/
define('Core/Cartesian3',[
        './defaultValue',
        './defined',
        './DeveloperError',
        './freezeObject'
    ], function(
        defaultValue,
        defined,
        DeveloperError,
        freezeObject) {
    "use strict";

    /**
     * A 3D Cartesian point.
     * @alias Cartesian3
     * @constructor
     *
     * @param {Number} [x=0.0] The X component.
     * @param {Number} [y=0.0] The Y component.
     * @param {Number} [z=0.0] The Z component.
     *
     * @see Cartesian2
     * @see Cartesian4
     * @see Packable
     */
    var Cartesian3 = function(x, y, z) {
        /**
         * The X component.
         * @type {Number}
         * @default 0.0
         */
        this.x = defaultValue(x, 0.0);

        /**
         * The Y component.
         * @type {Number}
         * @default 0.0
         */
        this.y = defaultValue(y, 0.0);

        /**
         * The Z component.
         * @type {Number}
         * @default 0.0
         */
        this.z = defaultValue(z, 0.0);
    };

    /**
     * Converts the provided Spherical into Cartesian3 coordinates.
     * @memberof Cartesian3
     *
     * @param {Spherical} spherical The Spherical to be converted to Cartesian3.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
     *
     * @exception {DeveloperError} spherical is required.
     */
    Cartesian3.fromSpherical = function(spherical, result) {
        if (!defined(spherical)) {
            throw new DeveloperError('spherical is required');
        }
        if (!defined(result)) {
            result = new Cartesian3();
        }
        var clock = spherical.clock;
        var cone = spherical.cone;
        var magnitude = defaultValue(spherical.magnitude, 1.0);
        var radial = magnitude * Math.sin(cone);
        result.x = radial * Math.cos(clock);
        result.y = radial * Math.sin(clock);
        result.z = magnitude * Math.cos(cone);
        return result;
    };

    /**
     * Creates a Cartesian3 instance from x, y and z coordinates.
     * @memberof Cartesian3
     *
     * @param {Number} x The x coordinate.
     * @param {Number} y The y coordinate.
     * @param {Number} z The z coordinate.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
     */
    Cartesian3.fromElements = function(x, y, z, result) {
        if (!defined(result)) {
            return new Cartesian3(x, y, z);
        }

        result.x = x;
        result.y = y;
        result.z = z;
        return result;
    };

    /**
     * Duplicates a Cartesian3 instance.
     * @memberof Cartesian3
     *
     * @param {Cartesian3} cartesian The Cartesian to duplicate.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided. (Returns undefined if cartesian is undefined)
     */
    Cartesian3.clone = function(cartesian, result) {
        if (!defined(cartesian)) {
            return undefined;
        }

        if (!defined(result)) {
            return new Cartesian3(cartesian.x, cartesian.y, cartesian.z);
        }

        result.x = cartesian.x;
        result.y = cartesian.y;
        result.z = cartesian.z;
        return result;
    };

    /**
     * Creates a Cartesian3 instance from an existing Cartesian4.  This simply takes the
     * x, y, and z properties of the Cartesian4 and drops w.
     * @function
     *
     * @param {Cartesian4} cartesian The Cartesian4 instance to create a Cartesian3 instance from.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
     *
     * @exception {DeveloperError} cartesian is required.
     */
    Cartesian3.fromCartesian4 = Cartesian3.clone;

    /**
     * The number of elements used to pack the object into an array.
     * @Type {Number}
     */
    Cartesian3.packedLength = 3;

    /**
     * Stores the provided instance into the provided array.
     * @memberof Cartesian3
     *
     * @param {Cartesian3} value The value to pack.
     * @param {Array} array The array to pack into.
     * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
     *
     * @exception {DeveloperError} value is required.
     * @exception {DeveloperError} array is required.
     */
    Cartesian3.pack = function(value, array, startingIndex) {
        if (!defined(value)) {
            throw new DeveloperError('value is required');
        }

        if (!defined(array)) {
            throw new DeveloperError('array is required');
        }

        startingIndex = defaultValue(startingIndex, 0);

        array[startingIndex++] = value.x;
        array[startingIndex++] = value.y;
        array[startingIndex] = value.z;
    };

    /**
     * Retrieves an instance from a packed array.
     * @memberof Cartesian3
     *
     * @param {Array} array The packed array.
     * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
     * @param {Cartesian3} [result] The object into which to store the result.
     *
     * @exception {DeveloperError} array is required.
     */
    Cartesian3.unpack = function(array, startingIndex, result) {
        if (!defined(array)) {
            throw new DeveloperError('array is required');
        }

        startingIndex = defaultValue(startingIndex, 0);

        if (!defined(result)) {
            result = new Cartesian3();
        }
        result.x = array[startingIndex++];
        result.y = array[startingIndex++];
        result.z = array[startingIndex];
        return result;
    };

    /**
     * Creates a Cartesian3 from three consecutive elements in an array.
     * @memberof Cartesian3
     *
     * @param {Array} array The array whose three consecutive elements correspond to the x, y, and z components, respectively.
     * @param {Number} [startingIndex=0] The offset into the array of the first element, which corresponds to the x component.
     * @param {Cartesian3} [result] The object onto which to store the result.
     *
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
     *
     * @exception {DeveloperError} array is required.
     *
     * @example
     * // Create a Cartesian3 with (1.0, 2.0, 3.0)
     * var v = [1.0, 2.0, 3.0];
     * var p = Cartesian3.fromArray(v);
     *
     * // Create a Cartesian3 with (1.0, 2.0, 3.0) using an offset into an array
     * var v2 = [0.0, 0.0, 1.0, 2.0, 3.0];
     * var p2 = Cartesian3.fromArray(v2, 2);
     */
    Cartesian3.fromArray = Cartesian3.unpack;

    /**
     * Computes the value of the maximum component for the supplied Cartesian.
     * @memberof Cartesian3
     *
     * @param {Cartesian3} The cartesian to use.
     * @returns {Number} The value of the maximum component.
     *
     * @exception {DeveloperError} cartesian is required.
     */
    Cartesian3.getMaximumComponent = function(cartesian) {
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required');
        }
        return Math.max(cartesian.x, cartesian.y, cartesian.z);
    };

    /**
     * Computes the value of the minimum component for the supplied Cartesian.
     * @memberof Cartesian3
     *
     * @param {Cartesian3} The cartesian to use.
     * @returns {Number} The value of the minimum component.
     *
     * @exception {DeveloperError} cartesian is required.
     */
    Cartesian3.getMinimumComponent = function(cartesian) {
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required');
        }
        return Math.min(cartesian.x, cartesian.y, cartesian.z);
    };

    /**
     * Computes the provided Cartesian's squared magnitude.
     * @memberof Cartesian3
     *
     * @param {Cartesian3} cartesian The Cartesian instance whose squared magnitude is to be computed.
     * @returns {Number} The squared magnitude.
     *
     * @exception {DeveloperError} cartesian is required.
     */
    Cartesian3.magnitudeSquared = function(cartesian) {
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required');
        }
        return cartesian.x * cartesian.x + cartesian.y * cartesian.y + cartesian.z * cartesian.z;
    };

    /**
     * Computes the Cartesian's magnitude (length).
     * @memberof Cartesian3
     *
     * @param {Cartesian3} cartesian The Cartesian instance whose magnitude is to be computed.
     * @returns {Number} The magnitude.
     *
     * @exception {DeveloperError} cartesian is required.
     */
    Cartesian3.magnitude = function(cartesian) {
        return Math.sqrt(Cartesian3.magnitudeSquared(cartesian));
    };

    var distanceScratch = new Cartesian3();

    /**
     * Computes the distance between two points
     * @memberof Cartesian3
     *
     * @param {Cartesian3} left The first point to compute the distance from.
     * @param {Cartesian3} right The second point to compute the distance to.
     *
     * @returns {Number} The distance between two points.
     *
     * @exception {DeveloperError} left and right are required.
     *
     * @example
     * // Returns 1.0
     * var d = Cartesian3.distance(new Cartesian3(1.0, 0.0, 0.0), new Cartesian3(2.0, 0.0, 0.0));
     */
    Cartesian3.distance = function(left, right) {
        if (!defined(left) || !defined(right)) {
            throw new DeveloperError('left and right are required.');
        }

        Cartesian3.subtract(left, right, distanceScratch);
        return Cartesian3.magnitude(distanceScratch);
    };

    /**
     * Computes the normalized form of the supplied Cartesian.
     * @memberof Cartesian3
     *
     * @param {Cartesian3} cartesian The Cartesian to be normalized.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
     *
     * @exception {DeveloperError} cartesian is required.
     */
    Cartesian3.normalize = function(cartesian, result) {
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required');
        }
        var magnitude = Cartesian3.magnitude(cartesian);
        if (!defined(result)) {
            return new Cartesian3(cartesian.x / magnitude, cartesian.y / magnitude, cartesian.z / magnitude);
        }
        result.x = cartesian.x / magnitude;
        result.y = cartesian.y / magnitude;
        result.z = cartesian.z / magnitude;
        return result;
    };

    /**
     * Computes the dot (scalar) product of two Cartesians.
     * @memberof Cartesian3
     *
     * @param {Cartesian3} left The first Cartesian.
     * @param {Cartesian3} right The second Cartesian.
     * @returns {Number} The dot product.
     *
     * @exception {DeveloperError} left is required.
     * @exception {DeveloperError} right is required.
     */
    Cartesian3.dot = function(left, right) {
        if (!defined(left)) {
            throw new DeveloperError('left is required');
        }
        if (!defined(right)) {
            throw new DeveloperError('right is required');
        }
        return left.x * right.x + left.y * right.y + left.z * right.z;
    };

    /**
     * Computes the componentwise product of two Cartesians.
     * @memberof Cartesian3
     *
     * @param {Cartesian3} left The first Cartesian.
     * @param {Cartesian3} right The second Cartesian.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
     *
     * @exception {DeveloperError} left is required.
     * @exception {DeveloperError} right is required.
     */
    Cartesian3.multiplyComponents = function(left, right, result) {
        if (!defined(left)) {
            throw new DeveloperError('left is required');
        }
        if (!defined(right)) {
            throw new DeveloperError('right is required');
        }
        if (!defined(result)) {
            return new Cartesian3(left.x * right.x, left.y * right.y, left.z * right.z);
        }
        result.x = left.x * right.x;
        result.y = left.y * right.y;
        result.z = left.z * right.z;
        return result;
    };

    /**
     * Computes the componentwise sum of two Cartesians.
     * @memberof Cartesian3
     *
     * @param {Cartesian3} left The first Cartesian.
     * @param {Cartesian3} right The second Cartesian.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
     *
     * @exception {DeveloperError} left is required.
     * @exception {DeveloperError} right is required.
     */
    Cartesian3.add = function(left, right, result) {
        if (!defined(left)) {
            throw new DeveloperError('left is required');
        }
        if (!defined(right)) {
            throw new DeveloperError('right is required');
        }
        if (!defined(result)) {
            return new Cartesian3(left.x + right.x, left.y + right.y, left.z + right.z);
        }
        result.x = left.x + right.x;
        result.y = left.y + right.y;
        result.z = left.z + right.z;
        return result;
    };

    /**
     * Computes the componentwise difference of two Cartesians.
     * @memberof Cartesian3
     *
     * @param {Cartesian3} left The first Cartesian.
     * @param {Cartesian3} right The second Cartesian.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
     *
     * @exception {DeveloperError} left is required.
     * @exception {DeveloperError} right is required.
     */
    Cartesian3.subtract = function(left, right, result) {
        if (!defined(left)) {
            throw new DeveloperError('left is required');
        }
        if (!defined(right)) {
            throw new DeveloperError('right is required');
        }
        if (!defined(result)) {
            return new Cartesian3(left.x - right.x, left.y - right.y, left.z - right.z);
        }
        result.x = left.x - right.x;
        result.y = left.y - right.y;
        result.z = left.z - right.z;
        return result;
    };

    /**
     * Multiplies the provided Cartesian componentwise by the provided scalar.
     * @memberof Cartesian3
     *
     * @param {Cartesian3} cartesian The Cartesian to be scaled.
     * @param {Number} scalar The scalar to multiply with.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
     *
     * @exception {DeveloperError} cartesian is required.
     * @exception {DeveloperError} scalar is required and must be a number.
     */
    Cartesian3.multiplyByScalar = function(cartesian, scalar, result) {
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required');
        }
        if (typeof scalar !== 'number') {
            throw new DeveloperError('scalar is required and must be a number.');
        }
        if (!defined(result)) {
            return new Cartesian3(cartesian.x * scalar,  cartesian.y * scalar,  cartesian.z * scalar);
        }
        result.x = cartesian.x * scalar;
        result.y = cartesian.y * scalar;
        result.z = cartesian.z * scalar;
        return result;
    };

    /**
     * Divides the provided Cartesian componentwise by the provided scalar.
     * @memberof Cartesian3
     *
     * @param {Cartesian3} cartesian The Cartesian to be divided.
     * @param {Number} scalar The scalar to divide by.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
     *
     * @exception {DeveloperError} cartesian is required.
     * @exception {DeveloperError} scalar is required and must be a number.
     */
    Cartesian3.divideByScalar = function(cartesian, scalar, result) {
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required');
        }
        if (typeof scalar !== 'number') {
            throw new DeveloperError('scalar is required and must be a number.');
        }
        if (!defined(result)) {
            return new Cartesian3(cartesian.x / scalar, cartesian.y / scalar, cartesian.z / scalar);
        }
        result.x = cartesian.x / scalar;
        result.y = cartesian.y / scalar;
        result.z = cartesian.z / scalar;
        return result;
    };

    /**
     * Negates the provided Cartesian.
     * @memberof Cartesian3
     *
     * @param {Cartesian3} cartesian The Cartesian to be negated.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
     *
     * @exception {DeveloperError} cartesian is required.
     */
    Cartesian3.negate = function(cartesian, result) {
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required');
        }
        if (!defined(result)) {
            return new Cartesian3(-cartesian.x, -cartesian.y, -cartesian.z);
        }
        result.x = -cartesian.x;
        result.y = -cartesian.y;
        result.z = -cartesian.z;
        return result;
    };

    /**
     * Computes the absolute value of the provided Cartesian.
     * @memberof Cartesian3
     *
     * @param {Cartesian3} cartesian The Cartesian whose absolute value is to be computed.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
     *
     * @exception {DeveloperError} cartesian is required.
     */
    Cartesian3.abs = function(cartesian, result) {
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required');
        }
        if (!defined(result)) {
            return new Cartesian3(Math.abs(cartesian.x), Math.abs(cartesian.y), Math.abs(cartesian.z));
        }
        result.x = Math.abs(cartesian.x);
        result.y = Math.abs(cartesian.y);
        result.z = Math.abs(cartesian.z);
        return result;
    };

    var lerpScratch = new Cartesian3();
    /**
     * Computes the linear interpolation or extrapolation at t using the provided cartesians.
     * @memberof Cartesian3
     *
     * @param start The value corresponding to t at 0.0.
     * @param end The value corresponding to t at 1.0.
     * @param t The point along t at which to interpolate.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
     *
     * @exception {DeveloperError} start is required.
     * @exception {DeveloperError} end is required.
     * @exception {DeveloperError} t is required and must be a number.
     */
    Cartesian3.lerp = function(start, end, t, result) {
        if (!defined(start)) {
            throw new DeveloperError('start is required.');
        }
        if (!defined(end)) {
            throw new DeveloperError('end is required.');
        }
        if (typeof t !== 'number') {
            throw new DeveloperError('t is required and must be a number.');
        }
        Cartesian3.multiplyByScalar(end, t, lerpScratch);
        result = Cartesian3.multiplyByScalar(start, 1.0 - t, result);
        return Cartesian3.add(lerpScratch, result, result);
    };

    var angleBetweenScratch = new Cartesian3();
    var angleBetweenScratch2 = new Cartesian3();
    /**
     * Returns the angle, in radians, between the provided Cartesians.
     * @memberof Cartesian3
     *
     * @param {Cartesian3} left The first Cartesian.
     * @param {Cartesian3} right The second Cartesian.
     * @returns {Number} The angle between the Cartesians.
     *
     * @exception {DeveloperError} left is required.
     * @exception {DeveloperError} right is required.
     */
    Cartesian3.angleBetween = function(left, right) {
        if (!defined(left)) {
            throw new DeveloperError('left is required');
        }
        if (!defined(right)) {
            throw new DeveloperError('right is required');
        }
        Cartesian3.normalize(left, angleBetweenScratch);
        Cartesian3.normalize(right, angleBetweenScratch2);
        var cosine = Cartesian3.dot(angleBetweenScratch, angleBetweenScratch2);
        var sine = Cartesian3.magnitude(Cartesian3.cross(angleBetweenScratch, angleBetweenScratch2, angleBetweenScratch));
        return Math.atan2(sine, cosine);
    };

    var mostOrthogonalAxisScratch = new Cartesian3();
    /**
     * Returns the axis that is most orthogonal to the provided Cartesian.
     * @memberof Cartesian3
     *
     * @param {Cartesian3} cartesian The Cartesian on which to find the most orthogonal axis.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The most orthogonal axis.
     *
     * @exception {DeveloperError} cartesian is required.
     */
    Cartesian3.mostOrthogonalAxis = function(cartesian, result) {
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required.');
        }

        var f = Cartesian3.normalize(cartesian, mostOrthogonalAxisScratch);
        Cartesian3.abs(f, f);

        if (f.x <= f.y) {
            if (f.x <= f.z) {
                result = Cartesian3.clone(Cartesian3.UNIT_X, result);
            } else {
                result = Cartesian3.clone(Cartesian3.UNIT_Z, result);
            }
        } else {
            if (f.y <= f.z) {
                result = Cartesian3.clone(Cartesian3.UNIT_Y, result);
            } else {
                result = Cartesian3.clone(Cartesian3.UNIT_Z, result);
            }
        }

        return result;
    };

    /**
     * Compares the provided Cartesians componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     * @memberof Cartesian3
     *
     * @param {Cartesian3} [left] The first Cartesian.
     * @param {Cartesian3} [right] The second Cartesian.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    Cartesian3.equals = function(left, right) {
        return (left === right) ||
               ((defined(left)) &&
                (defined(right)) &&
                (left.x === right.x) &&
                (left.y === right.y) &&
                (left.z === right.z));
    };

    /**
     * Compares the provided Cartesians componentwise and returns
     * <code>true</code> if they are within the provided epsilon,
     * <code>false</code> otherwise.
     * @memberof Cartesian3
     *
     * @param {Cartesian3} [left] The first Cartesian.
     * @param {Cartesian3} [right] The second Cartesian.
     * @param {Number} epsilon The epsilon to use for equality testing.
     * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
     *
     * @exception {DeveloperError} epsilon is required and must be a number.
     */
    Cartesian3.equalsEpsilon = function(left, right, epsilon) {
        if (typeof epsilon !== 'number') {
            throw new DeveloperError('epsilon is required and must be a number.');
        }
        return (left === right) ||
               ((defined(left)) &&
                (defined(right)) &&
                (Math.abs(left.x - right.x) <= epsilon) &&
                (Math.abs(left.y - right.y) <= epsilon) &&
                (Math.abs(left.z - right.z) <= epsilon));
    };

    /**
     * Computes the cross (outer) product of two Cartesians.
     * @memberof Cartesian3
     *
     * @param {Cartesian3} left The first Cartesian.
     * @param {Cartesian3} right The second Cartesian.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The cross product.
     *
     * @exception {DeveloperError} left is required.
     * @exception {DeveloperError} right is required.
     */
    Cartesian3.cross = function(left, right, result) {
        if (!defined(left)) {
            throw new DeveloperError('left is required');
        }
        if (!defined(right)) {
            throw new DeveloperError('right is required');
        }

        var leftX = left.x;
        var leftY = left.y;
        var leftZ = left.z;
        var rightX = right.x;
        var rightY = right.y;
        var rightZ = right.z;

        var x = leftY * rightZ - leftZ * rightY;
        var y = leftZ * rightX - leftX * rightZ;
        var z = leftX * rightY - leftY * rightX;

        if (!defined(result)) {
            return new Cartesian3(x, y, z);
        }
        result.x = x;
        result.y = y;
        result.z = z;
        return result;
    };

    /**
     * An immutable Cartesian3 instance initialized to (0.0, 0.0, 0.0).
     * @memberof Cartesian3
     */
    Cartesian3.ZERO = freezeObject(new Cartesian3(0.0, 0.0, 0.0));

    /**
     * An immutable Cartesian3 instance initialized to (1.0, 0.0, 0.0).
     * @memberof Cartesian3
     */
    Cartesian3.UNIT_X = freezeObject(new Cartesian3(1.0, 0.0, 0.0));

    /**
     * An immutable Cartesian3 instance initialized to (0.0, 1.0, 0.0).
     * @memberof Cartesian3
     */
    Cartesian3.UNIT_Y = freezeObject(new Cartesian3(0.0, 1.0, 0.0));

    /**
     * An immutable Cartesian3 instance initialized to (0.0, 0.0, 1.0).
     * @memberof Cartesian3
     */
    Cartesian3.UNIT_Z = freezeObject(new Cartesian3(0.0, 0.0, 1.0));

    /**
     * Duplicates this Cartesian3 instance.
     * @memberof Cartesian3
     *
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
     */
    Cartesian3.prototype.clone = function(result) {
        return Cartesian3.clone(this, result);
    };

    /**
     * Creates a string representing this Cartesian in the format '(x, y, z)'.
     * @memberof Cartesian3
     *
     * @returns {String} A string representing this Cartesian in the format '(x, y, z)'.
     */
    Cartesian3.prototype.toString = function() {
        return '(' + this.x + ', ' + this.y + ', ' + this.z + ')';
    };

    return Cartesian3;
});

/*global define*/
define('Core/Cartesian4',[
        './defaultValue',
        './defined',
        './DeveloperError',
        './freezeObject'
    ], function(
        defaultValue,
        defined,
        DeveloperError,
        freezeObject) {
    "use strict";

    /**
     * A 4D Cartesian point.
     * @alias Cartesian4
     * @constructor
     *
     * @param {Number} [x=0.0] The X component.
     * @param {Number} [y=0.0] The Y component.
     * @param {Number} [z=0.0] The Z component.
     * @param {Number} [w=0.0] The W component.
     *
     * @see Cartesian2
     * @see Cartesian3
     * @see Packable
     */
    var Cartesian4 = function(x, y, z, w) {
        /**
         * The X component.
         * @type {Number}
         * @default 0.0
         */
        this.x = defaultValue(x, 0.0);

        /**
         * The Y component.
         * @type {Number}
         * @default 0.0
         */
        this.y = defaultValue(y, 0.0);

        /**
         * The Z component.
         * @type {Number}
         * @default 0.0
         */
        this.z = defaultValue(z, 0.0);

        /**
         * The W component.
         * @type {Number}
         * @default 0.0
         */
        this.w = defaultValue(w, 0.0);
    };

    /**
     * Creates a Cartesian4 instance from x, y, z and w coordinates.
     * @memberof Cartesian4
     *
     * @param {Number} x The x coordinate.
     * @param {Number} y The y coordinate.
     * @param {Number} z The z coordinate.
     * @param {Number} w The w coordinate.
     * @param {Cartesian4} [result] The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided.
     */
    Cartesian4.fromElements = function(x, y, z, w, result) {
        if (!defined(result)) {
            return new Cartesian4(x, y, z, w);
        }

        result.x = x;
        result.y = y;
        result.z = z;
        result.w = w;
        return result;
    };

    /**
     * Duplicates a Cartesian4 instance.
     * @memberof Cartesian4
     *
     * @param {Cartesian4} cartesian The Cartesian to duplicate.
     * @param {Cartesian4} [result] The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided. (Returns undefined if cartesian is undefined)
     */
    Cartesian4.clone = function(cartesian, result) {
        if (!defined(cartesian)) {
            return undefined;
        }

        if (!defined(result)) {
            return new Cartesian4(cartesian.x, cartesian.y, cartesian.z, cartesian.w);
        }

        result.x = cartesian.x;
        result.y = cartesian.y;
        result.z = cartesian.z;
        result.w = cartesian.w;
        return result;
    };


    /**
     * The number of elements used to pack the object into an array.
     * @Type {Number}
     */
    Cartesian4.packedLength = 4;

    /**
     * Stores the provided instance into the provided array.
     * @memberof Cartesian4
     *
     * @param {Cartesian4} value The value to pack.
     * @param {Array} array The array to pack into.
     * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
     *
     * @exception {DeveloperError} value is required.
     * @exception {DeveloperError} array is required.
     */
    Cartesian4.pack = function(value, array, startingIndex) {
        if (!defined(value)) {
            throw new DeveloperError('value is required');
        }

        if (!defined(array)) {
            throw new DeveloperError('array is required');
        }

        startingIndex = defaultValue(startingIndex, 0);

        array[startingIndex++] = value.x;
        array[startingIndex++] = value.y;
        array[startingIndex++] = value.z;
        array[startingIndex] = value.w;
    };

    /**
     * Retrieves an instance from a packed array.
     * @memberof Cartesian4
     *
     * @param {Array} array The packed array.
     * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
     * @param {Cartesian4} [result] The object into which to store the result.
     *
     * @exception {DeveloperError} array is required.
     */
    Cartesian4.unpack = function(array, startingIndex, result) {
        if (!defined(array)) {
            throw new DeveloperError('array is required');
        }

        startingIndex = defaultValue(startingIndex, 0);

        if (!defined(result)) {
            result = new Cartesian4();
        }
        result.x = array[startingIndex++];
        result.y = array[startingIndex++];
        result.z = array[startingIndex++];
        result.w = array[startingIndex];
        return result;
    };



    /**
     * Creates a Cartesian4 from four consecutive elements in an array.
     * @memberof Cartesian4
     *
     * @param {Array} array The array whose four consecutive elements correspond to the x, y, z, and w components, respectively.
     * @param {Number} [startingIndex=0] The offset into the array of the first element, which corresponds to the x component.
     * @param {Cartesian4} [result] The object onto which to store the result.
     *
     * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided.
     *
     * @exception {DeveloperError} array is required.
     *
     * @example
     * // Create a Cartesian4 with (1.0, 2.0, 3.0, 4.0)
     * var v = [1.0, 2.0, 3.0, 4.0];
     * var p = Cartesian4.fromArray(v);
     *
     * // Create a Cartesian4 with (1.0, 2.0, 3.0, 4.0) using an offset into an array
     * var v2 = [0.0, 0.0, 1.0, 2.0, 3.0, 4.0];
     * var p2 = Cartesian4.fromArray(v2, 2);
     */
    Cartesian4.fromArray = Cartesian4.unpack;

    /**
     * Computes the value of the maximum component for the supplied Cartesian.
     * @memberof Cartesian4
     *
     * @param {Cartesian4} The cartesian to use.
     * @returns {Number} The value of the maximum component.
     *
     * @exception {DeveloperError} cartesian is required.
     */
    Cartesian4.getMaximumComponent = function(cartesian) {
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required');
        }
        return Math.max(cartesian.x, cartesian.y, cartesian.z, cartesian.w);
    };

    /**
     * Computes the value of the minimum component for the supplied Cartesian.
     * @memberof Cartesian4
     *
     * @param {Cartesian4} The cartesian to use.
     * @returns {Number} The value of the minimum component.
     *
     * @exception {DeveloperError} cartesian is required.
     */
    Cartesian4.getMinimumComponent = function(cartesian) {
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required');
        }
        return Math.min(cartesian.x, cartesian.y, cartesian.z, cartesian.w);
    };

    /**
     * Computes the provided Cartesian's squared magnitude.
     * @memberof Cartesian4
     *
     * @param {Cartesian4} cartesian The Cartesian instance whose squared magnitude is to be computed.
     * @returns {Number} The squared magnitude.
     *
     * @exception {DeveloperError} cartesian is required.
     */
    Cartesian4.magnitudeSquared = function(cartesian) {
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required');
        }
        return cartesian.x * cartesian.x + cartesian.y * cartesian.y + cartesian.z * cartesian.z + cartesian.w * cartesian.w;
    };

    /**
     * Computes the Cartesian's magnitude (length).
     * @memberof Cartesian4
     *
     * @param {Cartesian4} cartesian The Cartesian instance whose magnitude is to be computed.
     * @returns {Number} The magnitude.
     *
     * @exception {DeveloperError} cartesian is required.
     */
    Cartesian4.magnitude = function(cartesian) {
        return Math.sqrt(Cartesian4.magnitudeSquared(cartesian));
    };

    var distanceScratch = new Cartesian4();

    /**
     * Computes the 4-space distance between two points
     * @memberof Cartesian4
     *
     * @param {Cartesian4} left The first point to compute the distance from.
     * @param {Cartesian4} right The second point to compute the distance to.
     *
     * @returns {Number} The distance between two points.
     *
     * @exception {DeveloperError} left and right are required.
     *
     * @example
     * // Returns 1.0
     * var d = Cartesian4.distance(new Cartesian4(1.0, 0.0, 0.0, 0.0), new Cartesian4(2.0, 0.0, 0.0, 0.0));
     */
    Cartesian4.distance = function(left, right) {
        if (!defined(left) || !defined(right)) {
            throw new DeveloperError('left and right are required.');
        }

        Cartesian4.subtract(left, right, distanceScratch);
        return Cartesian4.magnitude(distanceScratch);
    };

    /**
     * Computes the normalized form of the supplied Cartesian.
     * @memberof Cartesian4
     *
     * @param {Cartesian4} cartesian The Cartesian to be normalized.
     * @param {Cartesian4} [result] The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided.
     *
     * @exception {DeveloperError} cartesian is required.
     */
    Cartesian4.normalize = function(cartesian, result) {
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required');
        }
        var magnitude = Cartesian4.magnitude(cartesian);
        if (!defined(result)) {
            return new Cartesian4(cartesian.x / magnitude, cartesian.y / magnitude, cartesian.z / magnitude, cartesian.w / magnitude);
        }
        result.x = cartesian.x / magnitude;
        result.y = cartesian.y / magnitude;
        result.z = cartesian.z / magnitude;
        result.w = cartesian.w / magnitude;
        return result;
    };

    /**
     * Computes the dot (scalar) product of two Cartesians.
     * @memberof Cartesian4
     *
     * @param {Cartesian4} left The first Cartesian.
     * @param {Cartesian4} right The second Cartesian.
     * @returns {Number} The dot product.
     *
     * @exception {DeveloperError} left is required.
     * @exception {DeveloperError} right is required.
     */
    Cartesian4.dot = function(left, right) {
        if (!defined(left)) {
            throw new DeveloperError('left is required');
        }
        if (!defined(right)) {
            throw new DeveloperError('right is required');
        }
        return left.x * right.x + left.y * right.y + left.z * right.z + left.w * right.w;
    };

    /**
     * Computes the componentwise product of two Cartesians.
     * @memberof Cartesian4
     *
     * @param {Cartesian4} left The first Cartesian.
     * @param {Cartesian4} right The second Cartesian.
     * @param {Cartesian4} [result] The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided.
     *
     * @exception {DeveloperError} left is required.
     * @exception {DeveloperError} right is required.
     */
    Cartesian4.multiplyComponents = function(left, right, result) {
        if (!defined(left)) {
            throw new DeveloperError('left is required');
        }
        if (!defined(right)) {
            throw new DeveloperError('right is required');
        }
        if (!defined(result)) {
            return new Cartesian4(left.x * right.x, left.y * right.y, left.z * right.z, left.w * right.w);
        }
        result.x = left.x * right.x;
        result.y = left.y * right.y;
        result.z = left.z * right.z;
        result.w = left.w * right.w;
        return result;
    };

    /**
     * Computes the componentwise sum of two Cartesians.
     * @memberof Cartesian4
     *
     * @param {Cartesian4} left The first Cartesian.
     * @param {Cartesian4} right The second Cartesian.
     * @param {Cartesian4} [result] The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided.
     *
     * @exception {DeveloperError} left is required.
     * @exception {DeveloperError} right is required.
     */
    Cartesian4.add = function(left, right, result) {
        if (!defined(left)) {
            throw new DeveloperError('left is required');
        }
        if (!defined(right)) {
            throw new DeveloperError('right is required');
        }
        if (!defined(result)) {
            return new Cartesian4(left.x + right.x, left.y + right.y, left.z + right.z, left.w + right.w);
        }
        result.x = left.x + right.x;
        result.y = left.y + right.y;
        result.z = left.z + right.z;
        result.w = left.w + right.w;
        return result;
    };

    /**
     * Computes the componentwise difference of two Cartesians.
     * @memberof Cartesian4
     *
     * @param {Cartesian4} left The first Cartesian.
     * @param {Cartesian4} right The second Cartesian.
     * @param {Cartesian4} [result] The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided.
     *
     * @exception {DeveloperError} left is required.
     * @exception {DeveloperError} right is required.
     */
    Cartesian4.subtract = function(left, right, result) {
        if (!defined(left)) {
            throw new DeveloperError('left is required');
        }
        if (!defined(right)) {
            throw new DeveloperError('right is required');
        }
        if (!defined(result)) {
            return new Cartesian4(left.x - right.x, left.y - right.y, left.z - right.z, left.w - right.w);
        }
        result.x = left.x - right.x;
        result.y = left.y - right.y;
        result.z = left.z - right.z;
        result.w = left.w - right.w;
        return result;
    };

    /**
     * Multiplies the provided Cartesian componentwise by the provided scalar.
     * @memberof Cartesian4
     *
     * @param {Cartesian4} cartesian The Cartesian to be scaled.
     * @param {Number} scalar The scalar to multiply with.
     * @param {Cartesian4} [result] The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided.
     *
     * @exception {DeveloperError} cartesian is required.
     * @exception {DeveloperError} scalar is required and must be a number.
     */
    Cartesian4.multiplyByScalar = function(cartesian, scalar, result) {
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required');
        }
        if (typeof scalar !== 'number') {
            throw new DeveloperError('scalar is required and must be a number.');
        }
        if (!defined(result)) {
            return new Cartesian4(cartesian.x * scalar, cartesian.y * scalar, cartesian.z * scalar, cartesian.w * scalar);
        }
        result.x = cartesian.x * scalar;
        result.y = cartesian.y * scalar;
        result.z = cartesian.z * scalar;
        result.w = cartesian.w * scalar;
        return result;
    };

    /**
     * Divides the provided Cartesian componentwise by the provided scalar.
     * @memberof Cartesian4
     *
     * @param {Cartesian4} cartesian The Cartesian to be divided.
     * @param {Number} scalar The scalar to divide by.
     * @param {Cartesian4} [result] The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided.
     *
     * @exception {DeveloperError} cartesian is required.
     * @exception {DeveloperError} scalar is required and must be a number.
     */
    Cartesian4.divideByScalar = function(cartesian, scalar, result) {
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required');
        }
        if (typeof scalar !== 'number') {
            throw new DeveloperError('scalar is required and must be a number.');
        }
        if (!defined(result)) {
            return new Cartesian4(cartesian.x / scalar, cartesian.y / scalar, cartesian.z / scalar, cartesian.w / scalar);
        }
        result.x = cartesian.x / scalar;
        result.y = cartesian.y / scalar;
        result.z = cartesian.z / scalar;
        result.w = cartesian.w / scalar;
        return result;
    };

    /**
     * Negates the provided Cartesian.
     * @memberof Cartesian4
     *
     * @param {Cartesian4} cartesian The Cartesian to be negated.
     * @param {Cartesian4} [result] The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided.
     *
     * @exception {DeveloperError} cartesian is required.
     */
    Cartesian4.negate = function(cartesian, result) {
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required');
        }
        if (!defined(result)) {
            return new Cartesian4(-cartesian.x, -cartesian.y, -cartesian.z, -cartesian.w);
        }
        result.x = -cartesian.x;
        result.y = -cartesian.y;
        result.z = -cartesian.z;
        result.w = -cartesian.w;
        return result;
    };

    /**
     * Computes the absolute value of the provided Cartesian.
     * @memberof Cartesian4
     *
     * @param {Cartesian4} cartesian The Cartesian whose absolute value is to be computed.
     * @param {Cartesian4} [result] The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided.
     *
     * @exception {DeveloperError} cartesian is required.
     */
    Cartesian4.abs = function(cartesian, result) {
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required');
        }
        if (!defined(result)) {
            return new Cartesian4(Math.abs(cartesian.x), Math.abs(cartesian.y), Math.abs(cartesian.z), Math.abs(cartesian.w));
        }
        result.x = Math.abs(cartesian.x);
        result.y = Math.abs(cartesian.y);
        result.z = Math.abs(cartesian.z);
        result.w = Math.abs(cartesian.w);
        return result;
    };

    var lerpScratch = new Cartesian4();
    /**
     * Computes the linear interpolation or extrapolation at t using the provided cartesians.
     * @memberof Cartesian4
     *
     * @param start The value corresponding to t at 0.0.
     * @param end The value corresponding to t at 1.0.
     * @param t The point along t at which to interpolate.
     * @param {Cartesian4} [result] The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided.
     *
     * @exception {DeveloperError} start is required.
     * @exception {DeveloperError} end is required.
     * @exception {DeveloperError} t is required and must be a number.
     */
    Cartesian4.lerp = function(start, end, t, result) {
        if (!defined(start)) {
            throw new DeveloperError('start is required.');
        }
        if (!defined(end)) {
            throw new DeveloperError('end is required.');
        }
        if (typeof t !== 'number') {
            throw new DeveloperError('t is required and must be a number.');
        }
        Cartesian4.multiplyByScalar(end, t, lerpScratch);
        result = Cartesian4.multiplyByScalar(start, 1.0 - t, result);
        return Cartesian4.add(lerpScratch, result, result);
    };

    var mostOrthogonalAxisScratch = new Cartesian4();
    /**
     * Returns the axis that is most orthogonal to the provided Cartesian.
     * @memberof Cartesian4
     *
     * @param {Cartesian4} cartesian The Cartesian on which to find the most orthogonal axis.
     * @param {Cartesian4} [result] The object onto which to store the result.
     * @returns {Cartesian4} The most orthogonal axis.
     *
     * @exception {DeveloperError} cartesian is required.
     */
    Cartesian4.mostOrthogonalAxis = function(cartesian, result) {
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required.');
        }

        var f = Cartesian4.normalize(cartesian, mostOrthogonalAxisScratch);
        Cartesian4.abs(f, f);

        if (f.x <= f.y) {
            if (f.x <= f.z) {
                if (f.x <= f.w) {
                    result = Cartesian4.clone(Cartesian4.UNIT_X, result);
                } else {
                    result = Cartesian4.clone(Cartesian4.UNIT_W, result);
                }
            } else if (f.z <= f.w) {
                result = Cartesian4.clone(Cartesian4.UNIT_Z, result);
            } else {
                result = Cartesian4.clone(Cartesian4.UNIT_W, result);
            }
        } else if (f.y <= f.z) {
            if (f.y <= f.w) {
                result = Cartesian4.clone(Cartesian4.UNIT_Y, result);
            } else {
                result = Cartesian4.clone(Cartesian4.UNIT_W, result);
            }
        } else if (f.z <= f.w) {
            result = Cartesian4.clone(Cartesian4.UNIT_Z, result);
        } else {
            result = Cartesian4.clone(Cartesian4.UNIT_W, result);
        }

        return result;
    };

    /**
     * Compares the provided Cartesians componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     * @memberof Cartesian4
     *
     * @param {Cartesian4} [left] The first Cartesian.
     * @param {Cartesian4} [right] The second Cartesian.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    Cartesian4.equals = function(left, right) {
        return (left === right) ||
               ((defined(left)) &&
                (defined(right)) &&
                (left.x === right.x) &&
                (left.y === right.y) &&
                (left.z === right.z) &&
                (left.w === right.w));
    };

    /**
     * Compares the provided Cartesians componentwise and returns
     * <code>true</code> if they are within the provided epsilon,
     * <code>false</code> otherwise.
     * @memberof Cartesian4
     *
     * @param {Cartesian4} [left] The first Cartesian.
     * @param {Cartesian4} [right] The second Cartesian.
     * @param {Number} epsilon The epsilon to use for equality testing.
     * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
     *
     * @exception {DeveloperError} epsilon is required and must be a number.
     */
    Cartesian4.equalsEpsilon = function(left, right, epsilon) {
        if (typeof epsilon !== 'number') {
            throw new DeveloperError('epsilon is required and must be a number.');
        }
        return (left === right) ||
               ((defined(left)) &&
                (defined(right)) &&
                (Math.abs(left.x - right.x) <= epsilon) &&
                (Math.abs(left.y - right.y) <= epsilon) &&
                (Math.abs(left.z - right.z) <= epsilon) &&
                (Math.abs(left.w - right.w) <= epsilon));
    };

    /**
     * An immutable Cartesian4 instance initialized to (0.0, 0.0, 0.0, 0.0).
     * @memberof Cartesian4
     */
    Cartesian4.ZERO = freezeObject(new Cartesian4(0.0, 0.0, 0.0, 0.0));

    /**
     * An immutable Cartesian4 instance initialized to (1.0, 0.0, 0.0, 0.0).
     * @memberof Cartesian4
     */
    Cartesian4.UNIT_X = freezeObject(new Cartesian4(1.0, 0.0, 0.0, 0.0));

    /**
     * An immutable Cartesian4 instance initialized to (0.0, 1.0, 0.0, 0.0).
     * @memberof Cartesian4
     */
    Cartesian4.UNIT_Y = freezeObject(new Cartesian4(0.0, 1.0, 0.0, 0.0));

    /**
     * An immutable Cartesian4 instance initialized to (0.0, 0.0, 1.0, 0.0).
     * @memberof Cartesian4
     */
    Cartesian4.UNIT_Z = freezeObject(new Cartesian4(0.0, 0.0, 1.0, 0.0));

    /**
     * An immutable Cartesian4 instance initialized to (0.0, 0.0, 0.0, 1.0).
     * @memberof Cartesian4
     */
    Cartesian4.UNIT_W = freezeObject(new Cartesian4(0.0, 0.0, 0.0, 1.0));

    /**
     * Duplicates this Cartesian4 instance.
     * @memberof Cartesian4
     *
     * @param {Cartesian4} [result] The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided.
     */
    Cartesian4.prototype.clone = function(result) {
        return Cartesian4.clone(this, result);
    };

    /**
     * Creates a string representing this Cartesian in the format '(x, y)'.
     * @memberof Cartesian4
     *
     * @returns {String} A string representing the provided Cartesian in the format '(x, y)'.
     */
    Cartesian4.prototype.toString = function() {
        return '(' + this.x + ', ' + this.y + ', ' + this.z + ', ' + this.w + ')';
    };

    return Cartesian4;
});

/*
  I've wrapped Makoto Matsumoto and Takuji Nishimura's code in a namespace
  so it's better encapsulated. Now you can have multiple random number generators
  and they won't stomp all over eachother's state.

  If you want to use this as a substitute for Math.random(), use the random()
  method like so:

  var m = new MersenneTwister();
  var randomNumber = m.random();

  You can also call the other genrand_{foo}() methods on the instance.

  If you want to use a specific seed in order to get a repeatable random
  sequence, pass an integer into the constructor:

  var m = new MersenneTwister(123);

  and that will always produce the same random sequence.

  Sean McCullough (banksean@gmail.com)
*/

/*
   A C-program for MT19937, with initialization improved 2002/1/26.
   Coded by Takuji Nishimura and Makoto Matsumoto.

   Before using, initialize the state by using init_genrand(seed)
   or init_by_array(init_key, key_length).
*/
/**
@license
mersenne-twister.js - https://gist.github.com/banksean/300494

   Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
   All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions
   are met:

     1. Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.

     2. Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.

     3. The names of its contributors may not be used to endorse or promote
        products derived from this software without specific prior written
        permission.

   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
   A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
/*
   Any feedback is very welcome.
   http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
   email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
*/
define('ThirdParty/mersenne-twister',[],function() {
var MersenneTwister = function(seed) {
  if (seed == undefined) {
    seed = new Date().getTime();
  }
  /* Period parameters */
  this.N = 624;
  this.M = 397;
  this.MATRIX_A = 0x9908b0df;   /* constant vector a */
  this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
  this.LOWER_MASK = 0x7fffffff; /* least significant r bits */

  this.mt = new Array(this.N); /* the array for the state vector */
  this.mti=this.N+1; /* mti==N+1 means mt[N] is not initialized */

  this.init_genrand(seed);
}

/* initializes mt[N] with a seed */
MersenneTwister.prototype.init_genrand = function(s) {
  this.mt[0] = s >>> 0;
  for (this.mti=1; this.mti<this.N; this.mti++) {
      var s = this.mt[this.mti-1] ^ (this.mt[this.mti-1] >>> 30);
   this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253)
  + this.mti;
      /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
      /* In the previous versions, MSBs of the seed affect   */
      /* only MSBs of the array mt[].                        */
      /* 2002/01/09 modified by Makoto Matsumoto             */
      this.mt[this.mti] >>>= 0;
      /* for >32 bit machines */
  }
}

/* initialize by an array with array-length */
/* init_key is the array for initializing keys */
/* key_length is its length */
/* slight change for C++, 2004/2/26 */
//MersenneTwister.prototype.init_by_array = function(init_key, key_length) {
//  var i, j, k;
//  this.init_genrand(19650218);
//  i=1; j=0;
//  k = (this.N>key_length ? this.N : key_length);
//  for (; k; k--) {
//    var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30)
//    this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525)))
//      + init_key[j] + j; /* non linear */
//    this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
//    i++; j++;
//    if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
//    if (j>=key_length) j=0;
//  }
//  for (k=this.N-1; k; k--) {
//    var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30);
//    this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941))
//      - i; /* non linear */
//    this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
//    i++;
//    if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
//  }
//
//  this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */
//}

/* generates a random number on [0,0xffffffff]-interval */
MersenneTwister.prototype.genrand_int32 = function() {
  var y;
  var mag01 = new Array(0x0, this.MATRIX_A);
  /* mag01[x] = x * MATRIX_A  for x=0,1 */

  if (this.mti >= this.N) { /* generate N words at one time */
    var kk;

    if (this.mti == this.N+1)   /* if init_genrand() has not been called, */
      this.init_genrand(5489); /* a default initial seed is used */

    for (kk=0;kk<this.N-this.M;kk++) {
      y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
      this.mt[kk] = this.mt[kk+this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
    }
    for (;kk<this.N-1;kk++) {
      y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
      this.mt[kk] = this.mt[kk+(this.M-this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
    }
    y = (this.mt[this.N-1]&this.UPPER_MASK)|(this.mt[0]&this.LOWER_MASK);
    this.mt[this.N-1] = this.mt[this.M-1] ^ (y >>> 1) ^ mag01[y & 0x1];

    this.mti = 0;
  }

  y = this.mt[this.mti++];

  /* Tempering */
  y ^= (y >>> 11);
  y ^= (y << 7) & 0x9d2c5680;
  y ^= (y << 15) & 0xefc60000;
  y ^= (y >>> 18);

  return y >>> 0;
}

/* generates a random number on [0,0x7fffffff]-interval */
//MersenneTwister.prototype.genrand_int31 = function() {
//  return (this.genrand_int32()>>>1);
//}

/* generates a random number on [0,1]-real-interval */
//MersenneTwister.prototype.genrand_real1 = function() {
//  return this.genrand_int32()*(1.0/4294967295.0);
//  /* divided by 2^32-1 */
//}

/* generates a random number on [0,1)-real-interval */
MersenneTwister.prototype.random = function() {
  return this.genrand_int32()*(1.0/4294967296.0);
  /* divided by 2^32 */
}

/* generates a random number on (0,1)-real-interval */
//MersenneTwister.prototype.genrand_real3 = function() {
//  return (this.genrand_int32() + 0.5)*(1.0/4294967296.0);
//  /* divided by 2^32 */
//}

/* generates a random number on [0,1) with 53-bit resolution*/
//MersenneTwister.prototype.genrand_res53 = function() {
//  var a=this.genrand_int32()>>>5, b=this.genrand_int32()>>>6;
//  return(a*67108864.0+b)*(1.0/9007199254740992.0);
//}

/* These real versions are due to Isaku Wada, 2002/01/09 added */

return MersenneTwister;
});
/*global define*/
define('Core/Math',[
        './defaultValue',
        './defined',
        './DeveloperError',
        '../ThirdParty/mersenne-twister'
       ], function(
         defaultValue,
         defined,
         DeveloperError,
         MersenneTwister) {
    "use strict";

    /**
     * Math functions.
     * @exports CesiumMath
     */
    var CesiumMath = {};

    /**
     * 0.1
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON1 = 0.1;

    /**
     * 0.01
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON2 = 0.01;

    /**
     * 0.001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON3 = 0.001;

    /**
     * 0.0001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON4 = 0.0001;

    /**
     * 0.00001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON5 = 0.00001;

    /**
     * 0.000001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON6 = 0.000001;

    /**
     * 0.0000001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON7 = 0.0000001;

    /**
     * 0.00000001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON8 = 0.00000001;

    /**
     * 0.000000001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON9 = 0.000000001;

    /**
     * 0.0000000001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON10 = 0.0000000001;

    /**
     * 0.00000000001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON11 = 0.00000000001;

    /**
     * 0.000000000001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON12 = 0.000000000001;

    /**
     * 0.0000000000001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON13 = 0.0000000000001;

    /**
     * 0.00000000000001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON14 = 0.00000000000001;

    /**
     * 0.000000000000001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON15 = 0.000000000000001;

    /**
     * 0.0000000000000001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON16 = 0.0000000000000001;

    /**
     * 0.00000000000000001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON17 = 0.00000000000000001;

    /**
     * 0.000000000000000001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON18 = 0.000000000000000001;

    /**
     * 0.0000000000000000001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON19 = 0.0000000000000000001;

    /**
     * 0.00000000000000000001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON20 = 0.00000000000000000001;

    /**
     * 3.986004418e14
     * @type {Number}
     * @constant
     */
    CesiumMath.GRAVITATIONALPARAMETER = 3.986004418e14;

    /**
     * Radius of the sun in meters: 6.955e8
     * @type {Number}
     * @constant
     */
    CesiumMath.SOLAR_RADIUS = 6.955e8;

    /**
     * 64 * 1024
     * @type {Number}
     * @constant
     */
    CesiumMath.SIXTY_FOUR_KILOBYTES = 64 * 1024;

    /**
     * Returns the sign of the value; 1 if the value is positive, -1 if the value is
     * negative, or 0 if the value is 0.
     *
     * @param {Number} value The value to return the sign of.
     *
     * @returns {Number} The sign of value.
     */
    CesiumMath.sign = function(value) {
        if (value > 0) {
            return 1;
        }
        if (value < 0) {
            return -1;
        }

        return 0;
    };

    /**
     * Returns the hyperbolic sine of a {@code Number}.
     * The hyperbolic sine of <em>value</em> is defined to be
     * (<em>e<sup>x</sup>&nbsp;-&nbsp;e<sup>-x</sup></em>)/2.0
     * where <i>e</i> is Euler's number, approximately 2.71828183.
     *
     * <p>Special cases:
     *   <ul>
     *     <li>If the argument is NaN, then the result is NaN.</li>
     *
     *     <li>If the argument is infinite, then the result is an infinity
     *     with the same sign as the argument.</li>
     *
     *     <li>If the argument is zero, then the result is a zero with the
     *     same sign as the argument.</li>
     *   </ul>
     *</p>
     *
     * @param value The number whose hyperbolic sine is to be returned.
     *
     * @returns The hyperbolic sine of {@code value}.
     *
     */
    CesiumMath.sinh = function(value) {
        var part1 = Math.pow(Math.E, value);
        var part2 = Math.pow(Math.E, -1.0 * value);

        return (part1 - part2) * 0.5;
    };

    /**
     * Returns the hyperbolic cosine of a {@code Number}.
     * The hyperbolic cosine of <strong>value</strong> is defined to be
     * (<em>e<sup>x</sup>&nbsp;+&nbsp;e<sup>-x</sup></em>)/2.0
     * where <i>e</i> is Euler's number, approximately 2.71828183.
     *
     * <p>Special cases:
     *   <ul>
     *     <li>If the argument is NaN, then the result is NaN.</li>
     *
     *     <li>If the argument is infinite, then the result is positive infinity.</li>
     *
     *     <li>If the argument is zero, then the result is {@code 1.0}.</li>
     *   </ul>
     *</p>
     *
     * @param value The number whose hyperbolic cosine is to be returned.
     *
     * @returns The hyperbolic cosine of {@code value}.
     */
    CesiumMath.cosh = function(value) {
        var part1 = Math.pow(Math.E, value);
        var part2 = Math.pow(Math.E, -1.0 * value);

        return (part1 + part2) * 0.5;
    };

    /**
     * DOC_TBA
     */
    CesiumMath.lerp = function(p, q, time) {
        return ((1.0 - time) * p) + (time * q);
    };

    /**
     * pi
     *
     * @type {Number}
     * @constant
     * @see czm_pi
     */
    CesiumMath.PI = Math.PI;

    /**
     * 1/pi
     *
     * @type {Number}
     * @constant
     * @see czm_oneOverPi
     */
    CesiumMath.ONE_OVER_PI = 1.0 / Math.PI;

    /**
     * pi/2
     *
     * @type {Number}
     * @constant
     * @see czm_piOverTwo
     */
    CesiumMath.PI_OVER_TWO = Math.PI * 0.5;

    /**
     * pi/3
     *
     * @type {Number}
     * @constant
     * @see czm_piOverThree
     */
    CesiumMath.PI_OVER_THREE = Math.PI / 3.0;

    /**
     * pi/4
     *
     * @type {Number}
     * @constant
     * @see czm_piOverFour
     */
    CesiumMath.PI_OVER_FOUR = Math.PI / 4.0;

    /**
     * pi/6
     *
     * @type {Number}
     * @constant
     * @see czm_piOverSix
     */
    CesiumMath.PI_OVER_SIX = Math.PI / 6.0;

    /**
     * 3pi/2
     *
     * @type {Number}
     * @constant
     * @see czm_threePiOver2
     */
    CesiumMath.THREE_PI_OVER_TWO = (3.0 * Math.PI) * 0.5;

    /**
     * 2pi
     *
     * @type {Number}
     * @constant
     * @see czm_twoPi
     */
    CesiumMath.TWO_PI = 2.0 * Math.PI;

    /**
     * 1/2pi
     *
     * @type {Number}
     * @constant
     * @see czm_oneOverTwoPi
     */
    CesiumMath.ONE_OVER_TWO_PI = 1.0 / (2.0 * Math.PI);

    /**
     * The number of radians in a degree.
     *
     * @type {Number}
     * @constant
     * @default Math.PI / 180.0
     * @see czm_radiansPerDegree
     */
    CesiumMath.RADIANS_PER_DEGREE = Math.PI / 180.0;

    /**
     * The number of degrees in a radian.
     *
     * @type {Number}
     * @constant
     * @default 180.0 / Math.PI
     * @see czm_degreesPerRadian
     */
    CesiumMath.DEGREES_PER_RADIAN = 180.0 / Math.PI;

    /**
     * The number of radians in an arc second.
     *
     * @type {Number}
     * @constant
     * @default {@link CesiumMath.RADIANS_PER_DEGREE} / 3600.0
     * @see czm_radiansPerArcSecond
     */
    CesiumMath.RADIANS_PER_ARCSECOND = CesiumMath.RADIANS_PER_DEGREE / 3600.0;

    /**
     * Converts degrees to radians.
     * @param {Number} degrees The angle to convert in degrees.
     * @returns {Number} The corresponding angle in radians.
     */
    CesiumMath.toRadians = function(degrees) {
        return degrees * CesiumMath.RADIANS_PER_DEGREE;
    };

    /**
     * Converts radians to degrees.
     * @param {Number} radians The angle to convert in radians.
     * @returns {Number} The corresponding angle in degrees.
     */
    CesiumMath.toDegrees = function(radians) {
        return radians * CesiumMath.DEGREES_PER_RADIAN;
    };

    /**
     * Converts a longitude value, in radians, to the range [<code>-Math.PI</code>, <code>Math.PI</code>).
     *
     * @param {Number} angle The longitude value, in radians, to convert to the range [<code>-Math.PI</code>, <code>Math.PI</code>).
     *
     * @returns {Number} The equivalent longitude value in the range [<code>-Math.PI</code>, <code>Math.PI</code>).
     *
     * @example
     * // Convert 270 degrees to -90 degrees longitude
     * var longitude = CesiumMath.convertLongitudeRange(CesiumMath.toRadians(270.0));
     */
    CesiumMath.convertLongitudeRange = function(angle) {
        var twoPi = CesiumMath.TWO_PI;

        var simplified = angle - Math.floor(angle / twoPi) * twoPi;

        if (simplified < -Math.PI) {
            return simplified + twoPi;
        }
        if (simplified >= Math.PI) {
            return simplified - twoPi;
        }

        return simplified;
    };

    /**
     * Produces an angle in the range 0 <= angle <= 2Pi which is equivalent to the provided angle.
     * @param {Number} angle in radians
     * @returns {Number} The angle in the range ()<code>-CesiumMath.PI</code>, <code>CesiumMath.PI</code>).
     */
    CesiumMath.negativePiToPi = function(x) {
        var epsilon10 = CesiumMath.EPSILON10;
        var pi = CesiumMath.PI;
        var two_pi = CesiumMath.TWO_PI;
        while (x < -(pi + epsilon10)) {
            x += two_pi;
        }
        if (x < -pi) {
            return -pi;
        }
        while (x > pi + epsilon10) {
            x -= two_pi;
        }
        return x > pi ? pi : x;
    };

    /**
     * Produces an angle in the range -Pi <= angle <= Pi which is equivalent to the provided angle.
     * @param {Number} angle in radians
     * @returns {Number} The angle in the range (0 , <code>CesiumMath.TWO_PI</code>).
     */
    CesiumMath.zeroToTwoPi = function(x) {
        var value = x % CesiumMath.TWO_PI;
        // We do a second modules here if we add 2Pi to ensure that we don't have any numerical issues with very
        // small negative values.
        return (value < 0.0) ? (value + CesiumMath.TWO_PI) % CesiumMath.TWO_PI : value;
    };

    /**
     * DOC_TBA
     */
    CesiumMath.equalsEpsilon = function(left, right, epsilon) {
        epsilon = defaultValue(epsilon, 0.0);
        return Math.abs(left - right) <= epsilon;
    };

    var factorials = [1];

    /**
     * Computes the factorial of the provided number.
     *
     * @memberof CesiumMath
     *
     * @param {Number} n The number whose factorial is to be computed.
     *
     * @returns {Number} The factorial of the provided number or undefined if the number is less than 0.
     *
     * @see <a href='http://en.wikipedia.org/wiki/Factorial'>Factorial on Wikipedia</a>.
     *
     * @example
     * //Compute 7!, which is equal to 5040
     * var computedFactorial = CesiumMath.factorial(7);
     *
     * @exception {DeveloperError} A number greater than or equal to 0 is required.
     */
    CesiumMath.factorial = function(n) {
        if (typeof n !== 'number' || n < 0) {
            throw new DeveloperError('A number greater than or equal to 0 is required.');
        }

        var length = factorials.length;
        if (n >= length) {
            var sum = factorials[length - 1];
            for ( var i = length; i <= n; i++) {
                factorials.push(sum * i);
            }
        }
        return factorials[n];
    };

    /**
     * Increments a number with a wrapping to a minimum value if the number exceeds the maximum value.
     *
     * @memberof CesiumMath
     *
     * @param {Number} [n] The number to be incremented.
     * @param {Number} [maximumValue] The maximum incremented value before rolling over to the minimum value.
     * @param {Number} [minimumValue=0.0] The number reset to after the maximum value has been exceeded.
     *
     * @returns {Number} The incremented number.
     *
     * @example
     * var n = CesiumMath.incrementWrap(5, 10, 0); // returns 6
     * var n = CesiumMath.incrementWrap(10, 10, 0); // returns 0
     *
     * @exception {DeveloperError} Maximum value must be greater than minimum value.
     */
    CesiumMath.incrementWrap = function(n, maximumValue, minimumValue) {
        minimumValue = defaultValue(minimumValue, 0.0);

        if (maximumValue <= minimumValue) {
            throw new DeveloperError('Maximum value must be greater than minimum value.');
        }

        ++n;
        if (n > maximumValue) {
            n = minimumValue;
        }
        return n;
    };

    /**
     * Determines if a positive integer is a power of two.
     *
     * @memberof CesiumMath
     *
     * @param {Number} n The positive integer to test.
     *
     * @returns {Boolean} <code>true</code> if the number if a power of two; otherwise, <code>false</code>.
     *
     * @example
     * var t = CesiumMath.isPowerOfTwo(16); // true
     * var f = CesiumMath.isPowerOfTwo(20); // false
     *
     * @exception {DeveloperError} A number greater than or equal to 0 is required.
     */
    CesiumMath.isPowerOfTwo = function(n) {
        if (typeof n !== 'number' || n < 0) {
            throw new DeveloperError('A number greater than or equal to 0 is required.');
        }

        var m = defaultValue(n, 0);
        return (m !== 0) && ((m & (m - 1)) === 0);
    };

    /**
     * Constraint a value to lie between two values.
     *
     * @memberof CesiumMath
     *
     * @param {Number} value The value to constrain.
     * @param {Number} min The minimum value.
     * @param {Number} max The maximum value.
     * @returns The value clamped so that min <= value <= max.
     */
    CesiumMath.clamp = function(value, min, max) {
        return value < min ? min : value > max ? max : value;
    };

    var randomNumberGenerator = new MersenneTwister();

    /**
     * Sets the seed used by the random number generator
     * in {@link CesiumMath#nextRandomNumber}.
     *
     * @memberof CesiumMath
     *
     * @param {Number} seed An integer used as the seed.
     *
     * @exception {DeveloperError} seed is required.
     */
    CesiumMath.setRandomNumberSeed = function(seed) {
        if (!defined(seed)) {
            throw new DeveloperError('seed is required.');
        }
        randomNumberGenerator = new MersenneTwister(seed);
    };

    /**
     * Generates a random number in the range of [0.0, 1.0)
     * using a Mersenne twister.
     *
     * @memberof CesiumMath
     *
     * @returns A random number in the range of [0.0, 1.0).
     *
     * @see CesiumMath#setRandomNumberSeed
     * @see http://en.wikipedia.org/wiki/Mersenne_twister
     */
    CesiumMath.nextRandomNumber = function() {
        return randomNumberGenerator.random();
    };

    return CesiumMath;
});

/*global define*/
define('Core/Cartographic',[
        './defaultValue',
        './defined',
        './DeveloperError',
        './freezeObject',
        './Math'
    ], function(
        defaultValue,
        defined,
        DeveloperError,
        freezeObject,
        CesiumMath) {
    "use strict";

    /**
     * A position defined by longitude, latitude, and height.
     * @alias Cartographic
     * @constructor
     *
     * @param {Number} [longitude=0.0] The longitude, in radians.
     * @param {Number} [latitude=0.0] The latitude, in radians.
     * @param {Number} [height=0.0] The height, in meters, above the ellipsoid.
     *
     * @see Ellipsoid
     */
    var Cartographic = function(longitude, latitude, height) {
        /**
         * The longitude, in radians.
         * @type {Number}
         * @default 0.0
         */
        this.longitude = defaultValue(longitude, 0.0);

        /**
         * The latitude, in radians.
         * @type {Number}
         * @default 0.0
         */
        this.latitude = defaultValue(latitude, 0.0);

        /**
         * The height, in meters, above the ellipsoid.
         * @type {Number}
         * @default 0.0
         */
        this.height = defaultValue(height, 0.0);
    };

    /**
     * Creates a new Cartographic instance from longitude and latitude
     * specified in degrees.  The values in the resulting object will
     * be in radians.
     * @memberof Cartographic
     *
     * @param {Number} [longitude=0.0] The longitude, in degrees.
     * @param {Number} [latitude=0.0] The latitude, in degrees.
     * @param {Number} [height=0.0] The height, in meters, above the ellipsoid.
     * @param {Cartographic} [result] The object onto which to store the result.
     * @returns {Cartographic} The modified result parameter or a new Cartographic instance if one was not provided.
     */
    Cartographic.fromDegrees = function(longitude, latitude, height, result) {
        longitude = CesiumMath.toRadians(defaultValue(longitude, 0.0));
        latitude = CesiumMath.toRadians(defaultValue(latitude, 0.0));
        height = defaultValue(height, 0.0);

        if (!defined(result)) {
            return new Cartographic(longitude, latitude, height);
        }

        result.longitude = longitude;
        result.latitude = latitude;
        result.height = height;
        return result;
    };

    /**
     * Duplicates a Cartographic instance.
     * @memberof Cartographic
     *
     * @param {Cartographic} cartographic The cartographic to duplicate.
     * @param {Cartographic} [result] The object onto which to store the result.
     * @returns {Cartographic} The modified result parameter or a new Cartographic instance if one was not provided. (Returns undefined if cartographic is undefined)
     */
    Cartographic.clone = function(cartographic, result) {
        if (!defined(cartographic)) {
            return undefined;
        }
        if (!defined(result)) {
            return new Cartographic(cartographic.longitude, cartographic.latitude, cartographic.height);
        }
        result.longitude = cartographic.longitude;
        result.latitude = cartographic.latitude;
        result.height = cartographic.height;
        return result;
    };

    /**
     * Compares the provided cartographics componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     * @memberof Cartographic
     *
     * @param {Cartographic} [left] The first cartographic.
     * @param {Cartographic} [right] The second cartographic.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    Cartographic.equals = function(left, right) {
        return (left === right) ||
                ((defined(left)) &&
                 (defined(right)) &&
                 (left.longitude === right.longitude) &&
                 (left.latitude === right.latitude) &&
                 (left.height === right.height));
    };

    /**
     * Compares the provided cartographics componentwise and returns
     * <code>true</code> if they are within the provided epsilon,
     * <code>false</code> otherwise.
     * @memberof Cartographic
     *
     * @param {Cartographic} [left] The first cartographic.
     * @param {Cartographic} [right] The second cartographic.
     * @param {Number} epsilon The epsilon to use for equality testing.
     * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
     *
     * @exception {DeveloperError} epsilon is required and must be a number.
     */
    Cartographic.equalsEpsilon = function(left, right, epsilon) {
        if (typeof epsilon !== 'number') {
            throw new DeveloperError('epsilon is required and must be a number.');
        }
        return (left === right) ||
               ((defined(left)) &&
                (defined(right)) &&
                (Math.abs(left.longitude - right.longitude) <= epsilon) &&
                (Math.abs(left.latitude - right.latitude) <= epsilon) &&
                (Math.abs(left.height - right.height) <= epsilon));
    };

    /**
     * Creates a string representing the provided cartographic in the format '(longitude, latitude, height)'.
     * @memberof Cartographic
     *
     * @param {Cartographic} cartographic The cartographic to stringify.
     * @returns {String} A string representing the provided cartographic in the format '(longitude, latitude, height)'.
     *
     * @exception {DeveloperError} cartographic is required.
     */
    Cartographic.toString = function(cartographic) {
        if (!defined(cartographic)) {
            throw new DeveloperError('cartographic is required');
        }
        return '(' + cartographic.longitude + ', ' + cartographic.latitude + ', ' + cartographic.height + ')';
    };

    /**
     * An immutable Cartographic instance initialized to (0.0, 0.0, 0.0).
     *
     * @memberof Cartographic
     */
    Cartographic.ZERO = freezeObject(new Cartographic(0.0, 0.0, 0.0));

    /**
     * Duplicates this instance.
     * @memberof Cartographic
     *
     * @param {Cartographic} [result] The object onto which to store the result.
     * @returns {Cartographic} The modified result parameter or a new Cartographic instance if one was not provided.
     */
    Cartographic.prototype.clone = function(result) {
        return Cartographic.clone(this, result);
    };

    /**
     * Compares the provided against this cartographic componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     * @memberof Cartographic
     *
     * @param {Cartographic} [right] The second cartographic.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    Cartographic.prototype.equals = function(right) {
        return Cartographic.equals(this, right);
    };

    /**
     * Compares the provided against this cartographic componentwise and returns
     * <code>true</code> if they are within the provided epsilon,
     * <code>false</code> otherwise.
     * @memberof Cartographic
     *
     * @param {Cartographic} [right] The second cartographic.
     * @param {Number} epsilon The epsilon to use for equality testing.
     * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
     *
     * @exception {DeveloperError} epsilon is required and must be a number.
     */
    Cartographic.prototype.equalsEpsilon = function(right, epsilon) {
        return Cartographic.equalsEpsilon(this, right, epsilon);
    };

    /**
     * Creates a string representing this cartographic in the format '(longitude, latitude, height)'.
     * @memberof Cartographic
     *
     * @returns {String} A string representing the provided cartographic in the format '(longitude, latitude, height)'.
     */
    Cartographic.prototype.toString = function() {
        return Cartographic.toString(this);
    };

    return Cartographic;
});

/*global define*/
define('Core/Ellipsoid',[
        './freezeObject',
        './defaultValue',
        './defined',
        './DeveloperError',
        './Math',
        './Cartesian3',
        './Cartographic'
       ], function(
         freezeObject,
         defaultValue,
         defined,
         DeveloperError,
         CesiumMath,
         Cartesian3,
         Cartographic) {
    "use strict";

    /**
     * A quadratic surface defined in Cartesian coordinates by the equation
     * <code>(x / a)^2 + (y / b)^2 + (z / c)^2 = 1</code>.  Primarily used
     * by Cesium to represent the shape of planetary bodies.
     *
     * Rather than constructing this object directly, one of the provided
     * constants is normally used.
     * @alias Ellipsoid
     * @constructor
     * @immutable
     *
     * @param {Number} [x=0] The radius in the x direction.
     * @param {Number} [y=0] The radius in the y direction.
     * @param {Number} [z=0] The radius in the z direction.
     *
     * @exception {DeveloperError} All radii components must be greater than or equal to zero.
     *
     * @see Ellipsoid.fromCartesian3
     * @see Ellipsoid.WGS84
     * @see Ellipsoid.UNIT_SPHERE
     */
    var Ellipsoid = function(x, y, z) {
        x = defaultValue(x, 0.0);
        y = defaultValue(y, 0.0);
        z = defaultValue(z, 0.0);

        if (x < 0.0 || y < 0.0 || z < 0.0) {
            throw new DeveloperError('All radii components must be greater than or equal to zero.');
        }

        this._radii = new Cartesian3(x, y, z);

        this._radiiSquared = new Cartesian3(x * x,
                                            y * y,
                                            z * z);

        this._radiiToTheFourth = new Cartesian3(x * x * x * x,
                                                y * y * y * y,
                                                z * z * z * z);

        this._oneOverRadii = new Cartesian3(x === 0.0 ? 0.0 : 1.0 / x,
                                            y === 0.0 ? 0.0 : 1.0 / y,
                                            z === 0.0 ? 0.0 : 1.0 / z);

        this._oneOverRadiiSquared = new Cartesian3(x === 0.0 ? 0.0 : 1.0 / (x * x),
                                                   y === 0.0 ? 0.0 : 1.0 / (y * y),
                                                   z === 0.0 ? 0.0 : 1.0 / (z * z));

        this._minimumRadius = Math.min(x, y, z);

        this._maximumRadius = Math.max(x, y, z);

        this._centerToleranceSquared = CesiumMath.EPSILON1;
    };

    /**
     * Duplicates an Ellipsoid instance.
     *
     * @memberof Ellipsoid
     *
     * @param {Ellipsoid} ellipsoid The ellipsoid to duplicate.
     * @param {Ellipsoid} [result] The object onto which to store the result, or undefined if a new
     *                    instance should be created.
     * @returns {Ellipsoid} The cloned Ellipsoid. (Returns undefined if ellipsoid is undefined)
     */
    Ellipsoid.clone = function(ellipsoid, result) {
        if (!defined(ellipsoid)) {
            return undefined;
        }
        var radii = ellipsoid._radii;

        if (!defined(result)) {
            return new Ellipsoid(radii.x, radii.y, radii.z);
        }

        Cartesian3.clone(radii, result._radii);
        Cartesian3.clone(ellipsoid._radiiSquared, result._radiiSquared);
        Cartesian3.clone(ellipsoid._radiiToTheFourth, result._radiiToTheFourth);
        Cartesian3.clone(ellipsoid._oneOverRadii, result._oneOverRadii);
        Cartesian3.clone(ellipsoid._oneOverRadiiSquared, result._oneOverRadiiSquared);
        result._minimumRadius = ellipsoid._minimumRadius;
        result._maximumRadius = ellipsoid._maximumRadius;
        result._centerToleranceSquared = ellipsoid._centerToleranceSquared;

        return result;
    };

    /**
     * Computes an Ellipsoid from a Cartesian specifying the radii in x, y, and z directions.
     *
     * @param {Cartesian3} [radii=Cartesian3.ZERO] The ellipsoid's radius in the x, y, and z directions.
     * @returns {Ellipsoid} A new Ellipsoid instance.
     *
     * @exception {DeveloperError} All radii components must be greater than or equal to zero.
     *
     * @see Ellipsoid.WGS84
     * @see Ellipsoid.UNIT_SPHERE
     */
    Ellipsoid.fromCartesian3 = function(cartesian) {
        if (!defined(cartesian)) {
            return new Ellipsoid();
        }
        return new Ellipsoid(cartesian.x, cartesian.y, cartesian.z);
    };

    /**
     * An Ellipsoid instance initialized to the WGS84 standard.
     * @memberof Ellipsoid
     *
     * @see czm_getWgs84EllipsoidEC
     */
    Ellipsoid.WGS84 = freezeObject(new Ellipsoid(6378137.0, 6378137.0, 6356752.3142451793));

    /**
     * An Ellipsoid instance initialized to radii of (1.0, 1.0, 1.0).
     * @memberof Ellipsoid
     */
    Ellipsoid.UNIT_SPHERE = freezeObject(new Ellipsoid(1.0, 1.0, 1.0));

    /**
     * @memberof Ellipsoid
     * @returns {Cartesian3} The radii of the ellipsoid.
     */
    Ellipsoid.prototype.getRadii = function() {
        return this._radii;
    };

    /**
     * @memberof Ellipsoid
     * @returns {Cartesian3} The squared radii of the ellipsoid.
     */
    Ellipsoid.prototype.getRadiiSquared = function() {
        return this._radiiSquared;
    };

    /**
     * @memberof Ellipsoid
     * @returns {Cartesian3} The radii of the ellipsoid raised to the fourth power.
     */
    Ellipsoid.prototype.getRadiiToTheFourth = function() {
        return this._radiiToTheFourth;
    };

    /**
     * @memberof Ellipsoid
     * @returns {Cartesian3} One over the radii of the ellipsoid.
     */
    Ellipsoid.prototype.getOneOverRadii = function() {
        return this._oneOverRadii;
    };

    /**
     * @memberof Ellipsoid
     * @returns {Cartesian3} One over the squared radii of the ellipsoid.
     */
    Ellipsoid.prototype.getOneOverRadiiSquared = function() {
        return this._oneOverRadiiSquared;
    };

    /**
     * @memberof Ellipsoid
     * @returns {Cartesian3} The minimum radius of the ellipsoid.
     */
    Ellipsoid.prototype.getMinimumRadius = function() {
        return this._minimumRadius;
    };

    /**
     * @memberof Ellipsoid
     * @returns {Cartesian3} The maximum radius of the ellipsoid.
     */
    Ellipsoid.prototype.getMaximumRadius = function() {
        return this._maximumRadius;
    };

    /**
     * Duplicates an Ellipsoid instance.
     *
     * @memberof Ellipsoid
     *
     * @param {Ellipsoid} [result] The object onto which to store the result, or undefined if a new
     *                    instance should be created.
     * @returns {Ellipsoid} The cloned Ellipsoid.
     */
    Ellipsoid.prototype.clone = function(result) {
        return Ellipsoid.clone(this, result);
    };

    /**
     * Computes the unit vector directed from the center of this ellipsoid toward the provided Cartesian position.
     * @memberof Ellipsoid
     *
     * @param {Cartesian3} cartesian The Cartesian for which to to determine the geocentric normal.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if none was provided.
     *
     * @exception {DeveloperError} cartesian is required.
     */
    Ellipsoid.prototype.geocentricSurfaceNormal = Cartesian3.normalize;

    /**
     * Computes the normal of the plane tangent to the surface of the ellipsoid at the provided position.
     * @memberof Ellipsoid
     *
     * @param {Cartographic} cartographic The cartographic position for which to to determine the geodetic normal.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if none was provided.
     *
     * @exception {DeveloperError} cartographic is required.
     */
    Ellipsoid.prototype.geodeticSurfaceNormalCartographic = function(cartographic, result) {
        if (!defined(cartographic)) {
            throw new DeveloperError('cartographic is required.');
        }

        var longitude = cartographic.longitude;
        var latitude = cartographic.latitude;
        var cosLatitude = Math.cos(latitude);

        var x = cosLatitude * Math.cos(longitude);
        var y = cosLatitude * Math.sin(longitude);
        var z = Math.sin(latitude);

        if (!defined(result)) {
            result = new Cartesian3();
        }
        result.x = x;
        result.y = y;
        result.z = z;
        return Cartesian3.normalize(result, result);
    };

    /**
     * Computes the normal of the plane tangent to the surface of the ellipsoid at the provided position.
     * @memberof Ellipsoid
     *
     * @param {Cartesian3} cartesian The Cartesian position for which to to determine the surface normal.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if none was provided.
     *
     * @exception {DeveloperError} cartesian is required.
     */
    Ellipsoid.prototype.geodeticSurfaceNormal = function(cartesian, result) {
        result = Cartesian3.multiplyComponents(cartesian, this._oneOverRadiiSquared, result);
        return Cartesian3.normalize(result, result);
    };

    var cartographicToCartesianNormal = new Cartesian3();
    var cartographicToCartesianK = new Cartesian3();

    /**
     * Converts the provided cartographic to Cartesian representation.
     * @memberof Ellipsoid
     *
     * @param {Cartographic} cartographic The cartographic position.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if none was provided.
     *
     * @exception {DeveloperError} cartographic is required.
     *
     * @example
     * //Create a Cartographic and determine it's Cartesian representation on a WGS84 ellipsoid.
     * var position = new Cartographic(Math.toRadians(21), Math.toRadians(78), 5000);
     * var cartesianPosition = Ellipsoid.WGS84.cartographicToCartesian(position);
     */
    Ellipsoid.prototype.cartographicToCartesian = function(cartographic, result) {
        //`cartographic is required` is thrown from geodeticSurfaceNormalCartographic.
        var n = cartographicToCartesianNormal;
        var k = cartographicToCartesianK;
        this.geodeticSurfaceNormalCartographic(cartographic, n);
        Cartesian3.multiplyComponents(this._radiiSquared, n, k);
        var gamma = Math.sqrt(Cartesian3.dot(n, k));
        Cartesian3.divideByScalar(k, gamma, k);
        Cartesian3.multiplyByScalar(n, cartographic.height, n);
        return Cartesian3.add(k, n, result);
    };

    /**
     * Converts the provided array of cartographics to an array of Cartesians.
     * @memberof Ellipsoid
     *
     * @param {Array} cartographics An array of cartographic positions.
     * @param {Array} [result] The object onto which to store the result.
     * @returns {Array} The modified result parameter or a new Array instance if none was provided.
     *
     * @exception {DeveloperError} cartographics is required.
     *
     * @example
     * //Convert an array of Cartographics and determine their Cartesian representation on a WGS84 ellipsoid.
     * var positions = [new Cartographic(Math.toRadians(21), Math.toRadians(78), 0),
     *                  new Cartographic(Math.toRadians(21.321), Math.toRadians(78.123), 100),
     *                  new Cartographic(Math.toRadians(21.645), Math.toRadians(78.456), 250)
     * var cartesianPositions = Ellipsoid.WGS84.cartographicArrayToCartesianArray(positions);
     */
    Ellipsoid.prototype.cartographicArrayToCartesianArray = function(cartographics, result) {
        if (!defined(cartographics)) {
            throw new DeveloperError('cartographics is required.');
        }

        var length = cartographics.length;
        if (!defined(result)) {
            result = new Array(length);
        } else {
            result.length = length;
        }
        for ( var i = 0; i < length; i++) {
            result[i] = this.cartographicToCartesian(cartographics[i], result[i]);
        }
        return result;
    };

    var cartesianToCartographicN = new Cartesian3();
    var cartesianToCartographicP = new Cartesian3();
    var cartesianToCartographicH = new Cartesian3();

    /**
     * Converts the provided cartesian to cartographic representation.
     * The cartesian is undefined at the center of the ellipsoid.
     * @memberof Ellipsoid
     *
     * @param {Cartesian3} cartesian The Cartesian position to convert to cartographic representation.
     * @param {Cartographic} [result] The object onto which to store the result.
     * @returns {Cartographic} The modified result parameter, new Cartographic instance if none was provided, or undefined if the cartesian is at the center of the ellipsoid.
     *
     * @exception {DeveloperError} cartesian is required.
     *
     * @example
     * //Create a Cartesian and determine it's Cartographic representation on a WGS84 ellipsoid.
     * var position = new Cartesian(17832.12, 83234.52, 952313.73);
     * var cartographicPosition = Ellipsoid.WGS84.cartesianToCartographic(position);
     */
    Ellipsoid.prototype.cartesianToCartographic = function(cartesian, result) {
        //`cartesian is required.` is thrown from scaleToGeodeticSurface
        var p = this.scaleToGeodeticSurface(cartesian, cartesianToCartographicP);

        if (!defined(p)) {
            return undefined;
        }

        var n = this.geodeticSurfaceNormal(p, cartesianToCartographicN);
        var h = Cartesian3.subtract(cartesian, p, cartesianToCartographicH);

        var longitude = Math.atan2(n.y, n.x);
        var latitude = Math.asin(n.z);
        var height = CesiumMath.sign(Cartesian3.dot(h, cartesian)) * Cartesian3.magnitude(h);

        if (!defined(result)) {
            return new Cartographic(longitude, latitude, height);
        }
        result.longitude = longitude;
        result.latitude = latitude;
        result.height = height;
        return result;
    };

    /**
     * Converts the provided array of cartesians to an array of cartographics.
     * @memberof Ellipsoid
     *
     * @param {Array} cartesians An array of Cartesian positions.
     * @param {Array} [result] The object onto which to store the result.
     * @returns {Array} The modified result parameter or a new Array instance if none was provided.
     *
     * @exception {DeveloperError} cartesians is required.
     *
     * @example
     * //Create an array of Cartesians and determine their Cartographic representation on a WGS84 ellipsoid.
     * var positions = [new Cartesian(17832.12, 83234.52, 952313.73),
     *                  new Cartesian(17832.13, 83234.53, 952313.73),
     *                  new Cartesian(17832.14, 83234.54, 952313.73)]
     * var cartographicPositions = Ellipsoid.WGS84.cartesianArrayToCartographicArray(positions);
     */
    Ellipsoid.prototype.cartesianArrayToCartographicArray = function(cartesians, result) {
        if (!defined(cartesians)) {
            throw new DeveloperError('cartesians is required.');
        }

        var length = cartesians.length;
        if (!defined(result)) {
            result = new Array(length);
        } else {
            result.length = length;
        }
        for ( var i = 0; i < length; ++i) {
            result[i] = this.cartesianToCartographic(cartesians[i], result[i]);
        }
        return result;
    };

    var scaleToGeodeticSurfaceIntersection;
    var scaleToGeodeticSurfaceGradient = new Cartesian3();

    /**
     * Scales the provided Cartesian position along the geodetic surface normal
     * so that it is on the surface of this ellipsoid.  If the position is
     * at the center of the ellipsoid, this function returns undefined.
     * @memberof Ellipsoid
     *
     * @param {Cartesian3} cartesian The Cartesian position to scale.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter, a new Cartesian3 instance if none was provided, or undefined if the position is at the center.
     *
     * @exception {DeveloperError} cartesian is required.
     */
    Ellipsoid.prototype.scaleToGeodeticSurface = function(cartesian, result) {
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required.');
        }

        var positionX = cartesian.x;
        var positionY = cartesian.y;
        var positionZ = cartesian.z;

        var oneOverRadii = this._oneOverRadii;
        var oneOverRadiiX = oneOverRadii.x;
        var oneOverRadiiY = oneOverRadii.y;
        var oneOverRadiiZ = oneOverRadii.z;

        var x2 = positionX * positionX * oneOverRadiiX * oneOverRadiiX;
        var y2 = positionY * positionY * oneOverRadiiY * oneOverRadiiY;
        var z2 = positionZ * positionZ * oneOverRadiiZ * oneOverRadiiZ;

        // Compute the squared ellipsoid norm.
        var squaredNorm = x2 + y2 + z2;
        var ratio = Math.sqrt(1.0 / squaredNorm);

        // As an initial approximation, assume that the radial intersection is the projection point.
        var intersection = Cartesian3.multiplyByScalar(cartesian, ratio, scaleToGeodeticSurfaceIntersection);

        //* If the position is near the center, the iteration will not converge.
        if (squaredNorm < this._centerToleranceSquared) {
            return !isFinite(ratio) ? undefined : Cartesian3.clone(intersection, result);
        }

        var oneOverRadiiSquared = this._oneOverRadiiSquared;
        var oneOverRadiiSquaredX = oneOverRadiiSquared.x;
        var oneOverRadiiSquaredY = oneOverRadiiSquared.y;
        var oneOverRadiiSquaredZ = oneOverRadiiSquared.z;

        // Use the gradient at the intersection point in place of the true unit normal.
        // The difference in magnitude will be absorbed in the multiplier.
        var gradient = scaleToGeodeticSurfaceGradient;
        gradient.x = intersection.x * oneOverRadiiSquaredX * 2.0;
        gradient.y = intersection.y * oneOverRadiiSquaredY * 2.0;
        gradient.z = intersection.z * oneOverRadiiSquaredZ * 2.0;

        // Compute the initial guess at the normal vector multiplier, lambda.
        var lambda = (1.0 - ratio) * Cartesian3.magnitude(cartesian) / (0.5 * Cartesian3.magnitude(gradient));
        var correction = 0.0;

        var func;
        var denominator;
        var xMultiplier;
        var yMultiplier;
        var zMultiplier;
        var xMultiplier2;
        var yMultiplier2;
        var zMultiplier2;
        var xMultiplier3;
        var yMultiplier3;
        var zMultiplier3;

        do {
            lambda -= correction;

            xMultiplier = 1.0 / (1.0 + lambda * oneOverRadiiSquaredX);
            yMultiplier = 1.0 / (1.0 + lambda * oneOverRadiiSquaredY);
            zMultiplier = 1.0 / (1.0 + lambda * oneOverRadiiSquaredZ);

            xMultiplier2 = xMultiplier * xMultiplier;
            yMultiplier2 = yMultiplier * yMultiplier;
            zMultiplier2 = zMultiplier * zMultiplier;

            xMultiplier3 = xMultiplier2 * xMultiplier;
            yMultiplier3 = yMultiplier2 * yMultiplier;
            zMultiplier3 = zMultiplier2 * zMultiplier;

            func = x2 * xMultiplier2 + y2 * yMultiplier2 + z2 * zMultiplier2 - 1.0;

            // "denominator" here refers to the use of this expression in the velocity and acceleration
            // computations in the sections to follow.
            denominator = x2 * xMultiplier3 * oneOverRadiiSquaredX + y2 * yMultiplier3 * oneOverRadiiSquaredY + z2 * zMultiplier3 * oneOverRadiiSquaredZ;

            var derivative = -2.0 * denominator;

            correction = func / derivative;
        } while (Math.abs(func) > CesiumMath.EPSILON12);

        if (!defined(result)) {
            return new Cartesian3(positionX * xMultiplier, positionY * yMultiplier, positionZ * zMultiplier);
        }
        result.x = positionX * xMultiplier;
        result.y = positionY * yMultiplier;
        result.z = positionZ * zMultiplier;
        return result;
    };

    /**
     * Scales the provided Cartesian position along the geocentric surface normal
     * so that it is on the surface of this ellipsoid.
     * @memberof Ellipsoid
     *
     * @param {Cartesian3} cartesian The Cartesian position to scale.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if none was provided.
     *
     * @exception {DeveloperError} cartesian is required.
     */
    Ellipsoid.prototype.scaleToGeocentricSurface = function(cartesian, result) {
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required.');
        }

        var positionX = cartesian.x;
        var positionY = cartesian.y;
        var positionZ = cartesian.z;
        var oneOverRadiiSquared = this._oneOverRadiiSquared;

        var beta = 1.0 / Math.sqrt((positionX * positionX) * oneOverRadiiSquared.x +
                                   (positionY * positionY) * oneOverRadiiSquared.y +
                                   (positionZ * positionZ) * oneOverRadiiSquared.z);

        return Cartesian3.multiplyByScalar(cartesian, beta, result);
    };

    /**
     * Transforms a Cartesian X, Y, Z position to the ellipsoid-scaled space by multiplying
     * its components by the result of {@link Ellipsoid#getOneOverRadii}.
     *
     * @memberof Ellipsoid
     *
     * @param {Cartesian3} position The position to transform.
     * @param {Cartesian3} [result] The position to which to copy the result, or undefined to create and
     *        return a new instance.
     * @returns {Cartesian3} The position expressed in the scaled space.  The returned instance is the
     *          one passed as the result parameter if it is not undefined, or a new instance of it is.
     */
    Ellipsoid.prototype.transformPositionToScaledSpace = function(position, result) {
        return Cartesian3.multiplyComponents(position, this._oneOverRadii, result);
    };

    /**
     * Compares this Ellipsoid against the provided Ellipsoid componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     * @memberof Ellipsoid
     *
     * @param {Ellipsoid} [right] The other Ellipsoid.
     * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
     */
    Ellipsoid.prototype.equals = function(right) {
        return (this === right) ||
               (defined(right) &&
                Cartesian3.equals(this._radii, right._radii));
    };

    /**
     * Creates a string representing this Ellipsoid in the format '(radii.x, radii.y, radii.z)'.
     * @memberof Ellipsoid
     *
     * @returns {String} A string representing this ellipsoid in the format '(radii.x, radii.y, radii.z)'.
     */
    Ellipsoid.prototype.toString = function() {
        return this._radii.toString();
    };

    return Ellipsoid;
});

/*global define*/
define('Core/GeographicProjection',[
        './defaultValue',
        './defined',
        './Cartesian3',
        './Cartographic',
        './Ellipsoid'
    ], function(
        defaultValue,
        defined,
        Cartesian3,
        Cartographic,
        Ellipsoid) {
    "use strict";

    /**
     * A simple map projection where longitude and latitude are linearly mapped to X and Y by multiplying
     * them by the {@link Ellipsoid#getMaximumRadius}.  This projection
     * is commonly known as geographic, equirectangular, equidistant cylindrical, or plate carrée.  It
     * is also known as EPSG:4326.
     *
     * @alias GeographicProjection
     * @constructor
     * @immutable
     *
     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid.
     *
     * @see WebMercatorProjection
     */
    var GeographicProjection = function(ellipsoid) {
        this._ellipsoid = defaultValue(ellipsoid, Ellipsoid.WGS84);
        this._semimajorAxis = this._ellipsoid.getMaximumRadius();
        this._oneOverSemimajorAxis = 1.0 / this._semimajorAxis;
    };

    /**
     * Gets the {@link Ellipsoid}.
     *
     * @memberof GeographicProjection
     *
     * @returns {Ellipsoid} The ellipsoid.
     */
    GeographicProjection.prototype.getEllipsoid = function() {
        return this._ellipsoid;
    };

    /**
     * Projects a set of {@link Cartographic} coordinates, in radians, to map coordinates, in meters.
     * X and Y are the longitude and latitude, respectively, multiplied by the maximum radius of the
     * ellipsoid.  Z is the unmodified height.
     *
     * @memberof GeographicProjection
     *
     * @param {Cartographic} cartographic The coordinates to project.
     * @param {Cartesian3} [result] An instance into which to copy the result.  If this parameter is
     *        undefined, a new instance is created and returned.
     * @returns {Cartesian3} The projected coordinates.  If the result parameter is not undefined, the
     *          coordinates are copied there and that instance is returned.  Otherwise, a new instance is
     *          created and returned.
     */
    GeographicProjection.prototype.project = function(cartographic, result) {
        // Actually this is the special case of equidistant cylindrical called the plate carree
        var semimajorAxis = this._semimajorAxis;
        var x = cartographic.longitude * semimajorAxis;
        var y = cartographic.latitude * semimajorAxis;
        var z = cartographic.height;

        if (!defined(result)) {
            return new Cartesian3(x, y, z);
        }

        result.x = x;
        result.y = y;
        result.z = z;
        return result;
    };

    /**
     * Unprojects a set of projected {@link Cartesian3} coordinates, in meters, to {@link Cartographic}
     * coordinates, in radians.  Longitude and Latitude are the X and Y coordinates, respectively,
     * divided by the maximum radius of the ellipsoid.  Height is the unmodified Z coordinate.
     *
     * @memberof GeographicProjection
     *
     * @param {Cartesian3} cartesian The coordinate to unproject.
     * @param {Cartographic} [result] An instance into which to copy the result.  If this parameter is
     *        undefined, a new instance is created and returned.
     * @returns {Cartographic} The unprojected coordinates.  If the result parameter is not undefined, the
     *          coordinates are copied there and that instance is returned.  Otherwise, a new instance is
     *          created and returned.
     */
    GeographicProjection.prototype.unproject = function(cartesian, result) {
        var oneOverEarthSemimajorAxis = this._oneOverSemimajorAxis;
        var longitude = cartesian.x * oneOverEarthSemimajorAxis;
        var latitude = cartesian.y * oneOverEarthSemimajorAxis;
        var height = cartesian.z;

        if (!defined(result)) {
            return new Cartographic(longitude, latitude, height);
        }

        result.longitude = longitude;
        result.latitude = latitude;
        result.height = height;
        return result;
    };

    return GeographicProjection;
});

/*global define*/
define('Core/Enumeration',['./defined'], function(defined) {
    "use strict";

    /**
     * Constructs an enumeration that contains both a numeric value and a name.
     * This is used so the name of the enumeration is available in the debugger.
     *
     * @param {Number} [value=undefined] The numeric value of the enumeration.
     * @param {String} [name=undefined] The name of the enumeration for debugging purposes.
     * @param {Object} [properties=undefined] An object containing extra properties to be added to the enumeration.
     *
     * @alias Enumeration
     * @constructor
     * @example
     * // Create an object with two enumerations.
     * var filter = {
     *     NEAREST : new Enumeration(0x2600, 'NEAREST'),
     *     LINEAR : new Enumeration(0x2601, 'LINEAR')
     * };
     */
    var Enumeration = function(value, name, properties) {
        /**
         * The numeric value of the enumeration.
         * @type {Number}
         * @default undefined
         */
        this.value = value;

        /**
         * The name of the enumeration for debugging purposes.
         * @type {String}
         * @default undefined
         */
        this.name = name;

        if (defined(properties)) {
            for ( var propertyName in properties) {
                if (properties.hasOwnProperty(propertyName)) {
                    this[propertyName] = properties[propertyName];
                }
            }
        }
    };

    /**
     * Returns the numeric value of the enumeration.
     *
     * @memberof Enumeration
     *
     * @returns {Number} The numeric value of the enumeration.
     */
    Enumeration.prototype.valueOf = function() {
        return this.value;
    };

    /**
     * Returns the name of the enumeration for debugging purposes.
     *
     * @memberof Enumeration
     *
     * @returns {String} The name of the enumeration for debugging purposes.
     */
    Enumeration.prototype.toString = function() {
        return this.name;
    };

    return Enumeration;
});

/*global define*/
define('Core/Intersect',['./Enumeration'], function(Enumeration) {
    "use strict";

    /**
     * This enumerated type is used in determining where, relative to the frustum, an
     * object is located. The object can either be fully contained within the frustum (INSIDE),
     * partially inside the frustum and partially outside (INTERSECTING), or somwhere entirely
     * outside of the frustum's 6 planes (OUTSIDE).
     *
     * @exports Intersect
     */
    var Intersect = {
        /**
         * Represents that an object is not contained within the frustum.
         *
         * @type {Enumeration}
         * @constant
         * @default -1
         */
        OUTSIDE : new Enumeration(-1, 'OUTSIDE'),

        /**
         * Represents that an object intersects one of the frustum's planes.
         *
         * @type {Enumeration}
         * @constant
         * @default 0
         */
        INTERSECTING : new Enumeration(0, 'INTERSECTING'),

        /**
         * Represents that an object is fully within the frustum.
         *
         * @type {Enumeration}
         * @constant
         * @default 1
         */
        INSIDE : new Enumeration(1, 'INSIDE')
    };

    return Intersect;
});

/*global define*/
define('Core/Interval',['./defaultValue'], function(defaultValue) {
    "use strict";

    /**
     * Represents the closed interval [start, stop].
     * @alias Interval
     * @constructor
     *
     * @param {Number} [start=0.0] The beginning of the interval.
     * @param {Number} [stop=0.0] The end of the interval.
     */
    var Interval = function(start, stop) {
        /**
         * The beginning of the interval.
         * @type {Number}
         * @default 0.0
         */
        this.start = defaultValue(start, 0.0);
        /**
         * The end of the interval.
         * @type {Number}
         * @default 0.0
         */
        this.stop = defaultValue(stop, 0.0);
    };

    return Interval;
});

/*global define*/
define('Core/Matrix3',[
        './Cartesian3',
        './defaultValue',
        './defined',
        './DeveloperError',
        './freezeObject'
    ], function(
        Cartesian3,
        defaultValue,
        defined,
        DeveloperError,
        freezeObject) {
    "use strict";

    /**
     * A 3x3 matrix, indexable as a column-major order array.
     * Constructor parameters are in row-major order for code readability.
     * @alias Matrix3
     * @constructor
     *
     * @param {Number} [column0Row0=0.0] The value for column 0, row 0.
     * @param {Number} [column1Row0=0.0] The value for column 1, row 0.
     * @param {Number} [column2Row0=0.0] The value for column 2, row 0.
     * @param {Number} [column0Row1=0.0] The value for column 0, row 1.
     * @param {Number} [column1Row1=0.0] The value for column 1, row 1.
     * @param {Number} [column2Row1=0.0] The value for column 2, row 1.
     * @param {Number} [column0Row2=0.0] The value for column 0, row 2.
     * @param {Number} [column1Row2=0.0] The value for column 1, row 2.
     * @param {Number} [column2Row2=0.0] The value for column 2, row 2.
     *
     * @see Matrix3.fromColumnMajor
     * @see Matrix3.fromRowMajorArray
     * @see Matrix3.fromQuaternion
     * @see Matrix3.fromScale
     * @see Matrix3.fromUniformScale
     * @see Matrix2
     * @see Matrix4
     */
    var Matrix3 = function(column0Row0, column1Row0, column2Row0,
                           column0Row1, column1Row1, column2Row1,
                           column0Row2, column1Row2, column2Row2) {
        this[0] = defaultValue(column0Row0, 0.0);
        this[1] = defaultValue(column0Row1, 0.0);
        this[2] = defaultValue(column0Row2, 0.0);
        this[3] = defaultValue(column1Row0, 0.0);
        this[4] = defaultValue(column1Row1, 0.0);
        this[5] = defaultValue(column1Row2, 0.0);
        this[6] = defaultValue(column2Row0, 0.0);
        this[7] = defaultValue(column2Row1, 0.0);
        this[8] = defaultValue(column2Row2, 0.0);
    };

    /**
     * Duplicates a Matrix3 instance.
     * @memberof Matrix3
     *
     * @param {Matrix3} matrix The matrix to duplicate.
     * @param {Matrix3} [result] The object onto which to store the result.
     * @returns {Matrix3} The modified result parameter or a new Matrix3 instance if one was not provided. (Returns undefined if matrix is undefined)
     */
    Matrix3.clone = function(values, result) {
        if (!defined(values)) {
            return undefined;
        }
        if (!defined(result)) {
            return new Matrix3(values[0], values[3], values[6],
                               values[1], values[4], values[7],
                               values[2], values[5], values[8]);
        }
        result[0] = values[0];
        result[1] = values[1];
        result[2] = values[2];
        result[3] = values[3];
        result[4] = values[4];
        result[5] = values[5];
        result[6] = values[6];
        result[7] = values[7];
        result[8] = values[8];
        return result;
    };

    /**
     * Creates a Matrix3 instance from a column-major order array.
     * @memberof Matrix3
     * @function
     *
     * @param {Array} values The column-major order array.
     * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns The modified result parameter, or a new Matrix3 instance if one was not provided.
     *
     * @exception {DeveloperError} values is required.
     */
    Matrix3.fromColumnMajorArray = function(values, result) {
        if (!defined(values)) {
            throw new DeveloperError('values parameter is required');
        }
        return Matrix3.clone(values, result);
    };

    /**
     * Creates a Matrix3 instance from a row-major order array.
     * The resulting matrix will be in column-major order.
     * @memberof Matrix3
     *
     * @param {Array} values The row-major order array.
     * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns The modified result parameter, or a new Matrix3 instance if one was not provided.
     *
     * @exception {DeveloperError} values is required.
     */
    Matrix3.fromRowMajorArray = function(values, result) {
        if (!defined(values)) {
            throw new DeveloperError('values is required.');
        }
        if (!defined(result)) {
            return new Matrix3(values[0], values[1], values[2],
                               values[3], values[4], values[5],
                               values[6], values[7], values[8]);
        }
        result[0] = values[0];
        result[1] = values[3];
        result[2] = values[6];
        result[3] = values[1];
        result[4] = values[4];
        result[5] = values[7];
        result[6] = values[2];
        result[7] = values[5];
        result[8] = values[8];
        return result;
    };

    /**
     * Computes a 3x3 rotation matrix from the provided quaternion.
     * @memberof Matrix3
     *
     * @param {Quaternion} quaternion the quaternion to use.
     *
     * @returns {Matrix3} The 3x3 rotation matrix from this quaternion.
     */
    Matrix3.fromQuaternion = function(quaternion, result) {
        if (!defined(quaternion)) {
            throw new DeveloperError('quaternion is required');
        }
        var x2 = quaternion.x * quaternion.x;
        var xy = quaternion.x * quaternion.y;
        var xz = quaternion.x * quaternion.z;
        var xw = quaternion.x * quaternion.w;
        var y2 = quaternion.y * quaternion.y;
        var yz = quaternion.y * quaternion.z;
        var yw = quaternion.y * quaternion.w;
        var z2 = quaternion.z * quaternion.z;
        var zw = quaternion.z * quaternion.w;
        var w2 = quaternion.w * quaternion.w;

        var m00 = x2 - y2 - z2 + w2;
        var m01 = 2.0 * (xy + zw);
        var m02 = 2.0 * (xz - yw);

        var m10 = 2.0 * (xy - zw);
        var m11 = -x2 + y2 - z2 + w2;
        var m12 = 2.0 * (yz + xw);

        var m20 = 2.0 * (xz + yw);
        var m21 = 2.0 * (yz - xw);
        var m22 = -x2 - y2 + z2 + w2;

        if (!defined(result)) {
            return new Matrix3(m00, m01, m02,
                               m10, m11, m12,
                               m20, m21, m22);
        }
        result[0] = m00;
        result[1] = m10;
        result[2] = m20;
        result[3] = m01;
        result[4] = m11;
        result[5] = m21;
        result[6] = m02;
        result[7] = m12;
        result[8] = m22;
        return result;
    };

    /**
     * Computes a Matrix3 instance representing a non-uniform scale.
     * @memberof Matrix3
     *
     * @param {Cartesian3} scale The x, y, and z scale factors.
     * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns The modified result parameter, or a new Matrix3 instance if one was not provided.
     *
     * @exception {DeveloperError} scale is required.
     *
     * @example
     * // Creates
     * //   [7.0, 0.0, 0.0]
     * //   [0.0, 8.0, 0.0]
     * //   [0.0, 0.0, 9.0]
     * var m = Matrix3.fromScale(new Cartesian3(7.0, 8.0, 9.0));
     */
    Matrix3.fromScale = function(scale, result) {
        if (!defined(scale)) {
            throw new DeveloperError('scale is required.');
        }
        if (!defined(result)) {
            return new Matrix3(
                scale.x, 0.0,     0.0,
                0.0,     scale.y, 0.0,
                0.0,     0.0,     scale.z);
        }

        result[0] = scale.x;
        result[1] = 0.0;
        result[2] = 0.0;
        result[3] = 0.0;
        result[4] = scale.y;
        result[5] = 0.0;
        result[6] = 0.0;
        result[7] = 0.0;
        result[8] = scale.z;
        return result;
    };

    /**
     * Computes a Matrix3 instance representing a uniform scale.
     * @memberof Matrix3
     *
     * @param {Number} scale The uniform scale factor.
     * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns The modified result parameter, or a new Matrix3 instance if one was not provided.
     *
     * @exception {DeveloperError} scale is required.
     *
     * @example
     * // Creates
     * //   [2.0, 0.0, 0.0]
     * //   [0.0, 2.0, 0.0]
     * //   [0.0, 0.0, 2.0]
     * var m = Matrix3.fromUniformScale(2.0);
     */
    Matrix3.fromUniformScale = function(scale, result) {
        if (typeof scale !== 'number') {
            throw new DeveloperError('scale is required.');
        }
        if (!defined(result)) {
            return new Matrix3(
                scale, 0.0,   0.0,
                0.0,   scale, 0.0,
                0.0,   0.0,   scale);
        }

        result[0] = scale;
        result[1] = 0.0;
        result[2] = 0.0;
        result[3] = 0.0;
        result[4] = scale;
        result[5] = 0.0;
        result[6] = 0.0;
        result[7] = 0.0;
        result[8] = scale;
        return result;
    };

    /**
     * Creates a rotation matrix around the x-axis.
     *
     * @param {Number} angle The angle, in radians, of the rotation.  Positive angles are counterclockwise.
     * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
     *
     * @returns The modified result parameter, or a new Matrix3 instance if one was not provided.
     *
     * @exception {DeveloperError} angle is required.
     *
     * @example
     * // Rotate a point 45 degrees counterclockwise around the x-axis.
     * var p = new Cartesian3(5, 6, 7);
     * var m = Matrix3.fromRotationX(CesiumMath.toRadians(45.0));
     * var rotated = m.multiplyByVector(p);
     */
    Matrix3.fromRotationX = function(angle, result) {
        if (!defined(angle)) {
            throw new DeveloperError('angle is required.');
        }

        var cosAngle = Math.cos(angle);
        var sinAngle = Math.sin(angle);

        if (!defined(result)) {
            return new Matrix3(
                1.0, 0.0, 0.0,
                0.0, cosAngle, -sinAngle,
                0.0, sinAngle, cosAngle);
        }

        result[0] = 1.0;
        result[1] = 0.0;
        result[2] = 0.0;
        result[3] = 0.0;
        result[4] = cosAngle;
        result[5] = sinAngle;
        result[6] = 0.0;
        result[7] = -sinAngle;
        result[8] = cosAngle;

        return result;
    };

    /**
     * Creates a rotation matrix around the y-axis.
     *
     * @param {Number} angle The angle, in radians, of the rotation.  Positive angles are counterclockwise.
     * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
     *
     * @returns The modified result parameter, or a new Matrix3 instance if one was not provided.
     *
     * @exception {DeveloperError} angle is required.
     *
     * @example
     * // Rotate a point 45 degrees counterclockwise around the y-axis.
     * var p = new Cartesian3(5, 6, 7);
     * var m = Matrix3.fromRotationY(CesiumMath.toRadians(45.0));
     * var rotated = m.multiplyByVector(p);
     */
    Matrix3.fromRotationY = function(angle, result) {
        if (!defined(angle)) {
            throw new DeveloperError('angle is required.');
        }

        var cosAngle = Math.cos(angle);
        var sinAngle = Math.sin(angle);

        if (!defined(result)) {
            return new Matrix3(
                cosAngle, 0.0, sinAngle,
                0.0, 1.0, 0.0,
                -sinAngle, 0.0, cosAngle);
        }

        result[0] = cosAngle;
        result[1] = 0.0;
        result[2] = -sinAngle;
        result[3] = 0.0;
        result[4] = 1.0;
        result[5] = 0.0;
        result[6] = sinAngle;
        result[7] = 0.0;
        result[8] = cosAngle;

        return result;
    };

    /**
     * Creates a rotation matrix around the z-axis.
     *
     * @param {Number} angle The angle, in radians, of the rotation.  Positive angles are counterclockwise.
     * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
     *
     * @returns The modified result parameter, or a new Matrix3 instance if one was not provided.
     *
     * @exception {DeveloperError} angle is required.
     *
     * @example
     * // Rotate a point 45 degrees counterclockwise around the z-axis.
     * var p = new Cartesian3(5, 6, 7);
     * var m = Matrix3.fromRotationZ(CesiumMath.toRadians(45.0));
     * var rotated = m.multiplyByVector(p);
     */
    Matrix3.fromRotationZ = function(angle, result) {
        if (!defined(angle)) {
            throw new DeveloperError('angle is required.');
        }

        var cosAngle = Math.cos(angle);
        var sinAngle = Math.sin(angle);

        if (!defined(result)) {
            return new Matrix3(
                cosAngle, -sinAngle, 0.0,
                sinAngle, cosAngle, 0.0,
                0.0, 0.0, 1.0);
        }

        result[0] = cosAngle;
        result[1] = sinAngle;
        result[2] = 0.0;
        result[3] = -sinAngle;
        result[4] = cosAngle;
        result[5] = 0.0;
        result[6] = 0.0;
        result[7] = 0.0;
        result[8] = 1.0;

        return result;
    };

    /**
     * Creates an Array from the provided Matrix3 instance.
     * The array will be in column-major order.
     * @memberof Matrix3
     *
     * @param {Matrix3} matrix The matrix to use..
     * @param {Array} [result] The Array onto which to store the result.
     * @returns {Array} The modified Array parameter or a new Array instance if one was not provided.
     *
     * @exception {DeveloperError} matrix is required.
     */
    Matrix3.toArray = function(matrix, result) {
        if (!defined(matrix)) {
            throw new DeveloperError('matrix is required');
        }
        if (!defined(result)) {
            return [matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5], matrix[6], matrix[7], matrix[8]];
        }
        result[0] = matrix[0];
        result[1] = matrix[1];
        result[2] = matrix[2];
        result[3] = matrix[3];
        result[4] = matrix[4];
        result[5] = matrix[5];
        result[6] = matrix[6];
        result[7] = matrix[7];
        result[8] = matrix[8];
        return result;
    };

    /**
     * Computes the array index of the element at the provided row and column.
     * @memberof Matrix3
     *
     * @param {Number} row The zero-based index of the row.
     * @param {Number} column The zero-based index of the column.
     * @returns {Number} The index of the element at the provided row and column.
     *
     * @exception {DeveloperError} row is required and must be 0, 1, or 2.
     * @exception {DeveloperError} column is required and must be 0, 1, or 2.
     *
     * @example
     * var myMatrix = new Matrix3();
     * var column1Row0Index = Matrix3.getElementIndex(1, 0);
     * var column1Row0 = myMatrix[column1Row0Index]
     * myMatrix[column1Row0Index] = 10.0;
     */
    Matrix3.getElementIndex = function(column, row) {
        if (typeof row !== 'number' || row < 0 || row > 2) {
            throw new DeveloperError('row is required and must be 0, 1, or 2.');
        }
        if (typeof column !== 'number' || column < 0 || column > 2) {
            throw new DeveloperError('column is required and must be 0, 1, or 2.');
        }
        return column * 3 + row;
    };

    /**
     * Retrieves a copy of the matrix column at the provided index as a Cartesian3 instance.
     * @memberof Matrix3
     *
     * @param {Matrix3} matrix The matrix to use.
     * @param {Number} index The zero-based index of the column to retrieve.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
     *
     * @exception {DeveloperError} matrix is required.
     * @exception {DeveloperError} index is required and must be 0, 1, or 2.
     *
     * @see Cartesian3
     */
    Matrix3.getColumn = function(matrix, index, result) {
        if (!defined(matrix)) {
            throw new DeveloperError('matrix is required.');
        }

        if (typeof index !== 'number' || index < 0 || index > 2) {
            throw new DeveloperError('index is required and must be 0, 1, or 2.');
        }

        var startIndex = index * 3;
        var x = matrix[startIndex];
        var y = matrix[startIndex + 1];
        var z = matrix[startIndex + 2];

        if (!defined(result)) {
            return new Cartesian3(x, y, z);
        }
        result.x = x;
        result.y = y;
        result.z = z;
        return result;
    };

    /**
     * Computes a new matrix that replaces the specified column in the provided matrix with the provided Cartesian3 instance.
     * @memberof Matrix3
     *
     * @param {Matrix3} matrix The matrix to use.
     * @param {Number} index The zero-based index of the column to set.
     * @param {Cartesian3} cartesian The Cartesian whose values will be assigned to the specified column.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Matrix3} The modified result parameter or a new Matrix3 instance if one was not provided.
     *
     * @exception {DeveloperError} matrix is required.
     * @exception {DeveloperError} cartesian is required.
     * @exception {DeveloperError} index is required and must be 0, 1, or 2.
     *
     * @see Cartesian3
     */
    Matrix3.setColumn = function(matrix, index, cartesian, result) {
        if (!defined(matrix)) {
            throw new DeveloperError('matrix is required');
        }
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required');
        }
        if (typeof index !== 'number' || index < 0 || index > 2) {
            throw new DeveloperError('index is required and must be 0, 1, or 2.');
        }
        result = Matrix3.clone(matrix, result);
        var startIndex = index * 3;
        result[startIndex] = cartesian.x;
        result[startIndex + 1] = cartesian.y;
        result[startIndex + 2] = cartesian.z;
        return result;
    };

    /**
     * Retrieves a copy of the matrix row at the provided index as a Cartesian3 instance.
     * @memberof Matrix3
     *
     * @param {Matrix3} matrix The matrix to use.
     * @param {Number} index The zero-based index of the row to retrieve.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
     *
     * @exception {DeveloperError} matrix is required.
     * @exception {DeveloperError} index is required and must be 0, 1, or 2.
     *
     * @see Cartesian3
     */
    Matrix3.getRow = function(matrix, index, result) {
        if (!defined(matrix)) {
            throw new DeveloperError('matrix is required.');
        }

        if (typeof index !== 'number' || index < 0 || index > 2) {
            throw new DeveloperError('index is required and must be 0, 1, or 2.');
        }

        var x = matrix[index];
        var y = matrix[index + 3];
        var z = matrix[index + 6];

        if (!defined(result)) {
            return new Cartesian3(x, y, z);
        }
        result.x = x;
        result.y = y;
        result.z = z;
        return result;
    };

    /**
     * Computes a new matrix that replaces the specified row in the provided matrix with the provided Cartesian3 instance.
     * @memberof Matrix3
     *
     * @param {Matrix3} matrix The matrix to use.
     * @param {Number} index The zero-based index of the row to set.
     * @param {Cartesian3} cartesian The Cartesian whose values will be assigned to the specified row.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Matrix3} The modified result parameter or a new Matrix3 instance if one was not provided.
     *
     * @exception {DeveloperError} matrix is required.
     * @exception {DeveloperError} cartesian is required.
     * @exception {DeveloperError} index is required and must be 0, 1, or 2.
     *
     * @see Cartesian3
     */
    Matrix3.setRow = function(matrix, index, cartesian, result) {
        if (!defined(matrix)) {
            throw new DeveloperError('matrix is required');
        }
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required');
        }
        if (typeof index !== 'number' || index < 0 || index > 2) {
            throw new DeveloperError('index is required and must be 0, 1, or 2.');
        }

        result = Matrix3.clone(matrix, result);
        result[index] = cartesian.x;
        result[index + 3] = cartesian.y;
        result[index + 6] = cartesian.z;
        return result;
    };

    /**
     * Computes the product of two matrices.
     * @memberof Matrix3
     *
     * @param {Matrix3} left The first matrix.
     * @param {Matrix3} right The second matrix.
     * @param {Matrix3} [result] The object onto which to store the result.
     * @returns {Matrix3} The modified result parameter or a new Matrix3 instance if one was not provided.
     *
     * @exception {DeveloperError} left is required.
     * @exception {DeveloperError} right is required.
     */
    Matrix3.multiply = function(left, right, result) {
        if (!defined(left)) {
            throw new DeveloperError('left is required');
        }
        if (!defined(right)) {
            throw new DeveloperError('right is required');
        }

        var column0Row0 = left[0] * right[0] + left[3] * right[1] + left[6] * right[2];
        var column0Row1 = left[1] * right[0] + left[4] * right[1] + left[7] * right[2];
        var column0Row2 = left[2] * right[0] + left[5] * right[1] + left[8] * right[2];

        var column1Row0 = left[0] * right[3] + left[3] * right[4] + left[6] * right[5];
        var column1Row1 = left[1] * right[3] + left[4] * right[4] + left[7] * right[5];
        var column1Row2 = left[2] * right[3] + left[5] * right[4] + left[8] * right[5];

        var column2Row0 = left[0] * right[6] + left[3] * right[7] + left[6] * right[8];
        var column2Row1 = left[1] * right[6] + left[4] * right[7] + left[7] * right[8];
        var column2Row2 = left[2] * right[6] + left[5] * right[7] + left[8] * right[8];

        if (!defined(result)) {
            return new Matrix3(column0Row0, column1Row0, column2Row0,
                               column0Row1, column1Row1, column2Row1,
                               column0Row2, column1Row2, column2Row2);
        }
        result[0] = column0Row0;
        result[1] = column0Row1;
        result[2] = column0Row2;
        result[3] = column1Row0;
        result[4] = column1Row1;
        result[5] = column1Row2;
        result[6] = column2Row0;
        result[7] = column2Row1;
        result[8] = column2Row2;
        return result;
    };

    /**
     * Computes the product of a matrix and a column vector.
     * @memberof Matrix3
     *
     * @param {Matrix3} matrix The matrix.
     * @param {Cartesian3} cartesian The column.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
     *
     * @exception {DeveloperError} matrix is required.
     * @exception {DeveloperError} cartesian is required.
     */
    Matrix3.multiplyByVector = function(matrix, cartesian, result) {
        if (!defined(matrix)) {
            throw new DeveloperError('matrix is required');
        }
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required');
        }

        var vX = cartesian.x;
        var vY = cartesian.y;
        var vZ = cartesian.z;

        var x = matrix[0] * vX + matrix[3] * vY + matrix[6] * vZ;
        var y = matrix[1] * vX + matrix[4] * vY + matrix[7] * vZ;
        var z = matrix[2] * vX + matrix[5] * vY + matrix[8] * vZ;

        if (!defined(result)) {
            return new Cartesian3(x, y, z);
        }
        result.x = x;
        result.y = y;
        result.z = z;
        return result;
    };

    /**
     * Computes the product of a matrix and a scalar.
     * @memberof Matrix3
     *
     * @param {Matrix3} matrix The matrix.
     * @param {Number} scalar The number to multiply by.
     * @param {Matrix3} [result] The object onto which to store the result.
     * @returns {Matrix3} The modified result parameter or a new Cartesian3 instance if one was not provided.
     *
     * @exception {DeveloperError} matrix is required.
     * @exception {DeveloperError} scalar is required and must be a number.
     */
    Matrix3.multiplyByScalar = function(matrix, scalar, result) {
        if (!defined(matrix)) {
            throw new DeveloperError('matrix is required');
        }
        if (typeof scalar !== 'number') {
            throw new DeveloperError('scalar is required and must be a number');
        }

        if (!defined(result)) {
            return new Matrix3(matrix[0] * scalar, matrix[3] * scalar, matrix[6] * scalar,
                               matrix[1] * scalar, matrix[4] * scalar, matrix[7] * scalar,
                               matrix[2] * scalar, matrix[5] * scalar, matrix[8] * scalar);
        }
        result[0] = matrix[0] * scalar;
        result[1] = matrix[1] * scalar;
        result[2] = matrix[2] * scalar;
        result[3] = matrix[3] * scalar;
        result[4] = matrix[4] * scalar;
        result[5] = matrix[5] * scalar;
        result[6] = matrix[6] * scalar;
        result[7] = matrix[7] * scalar;
        result[8] = matrix[8] * scalar;
        return result;
    };

    /**
     * Creates a negated copy of the provided matrix.
     * @memberof Matrix3
     *
     * @param {Matrix3} matrix The matrix to negate.
     * @param {Matrix3} [result] The object onto which to store the result.
     * @returns {Matrix3} The modified result parameter or a new Matrix3 instance if one was not provided.
     *
     * @exception {DeveloperError} matrix is required.
     */
    Matrix3.negate = function(matrix, result) {
        if (!defined(matrix)) {
            throw new DeveloperError('matrix is required');
        }

        if (!defined(result)) {
            return new Matrix3(-matrix[0], -matrix[3], -matrix[6],
                               -matrix[1], -matrix[4], -matrix[7],
                               -matrix[2], -matrix[5], -matrix[8]);
        }
        result[0] = -matrix[0];
        result[1] = -matrix[1];
        result[2] = -matrix[2];
        result[3] = -matrix[3];
        result[4] = -matrix[4];
        result[5] = -matrix[5];
        result[6] = -matrix[6];
        result[7] = -matrix[7];
        result[8] = -matrix[8];
        return result;
    };

    /**
     * Computes the transpose of the provided matrix.
     * @memberof Matrix3
     *
     * @param {Matrix3} matrix The matrix to transpose.
     * @param {Matrix3} [result] The object onto which to store the result.
     * @returns {Matrix3} The modified result parameter or a new Matrix3 instance if one was not provided.
     *
     * @exception {DeveloperError} matrix is required.
     */
    Matrix3.transpose = function(matrix, result) {
        if (!defined(matrix)) {
            throw new DeveloperError('matrix is required');
        }

        var column0Row0 = matrix[0];
        var column0Row1 = matrix[3];
        var column0Row2 = matrix[6];
        var column1Row0 = matrix[1];
        var column1Row1 = matrix[4];
        var column1Row2 = matrix[7];
        var column2Row0 = matrix[2];
        var column2Row1 = matrix[5];
        var column2Row2 = matrix[8];

        if (!defined(result)) {
            return new Matrix3(column0Row0, column1Row0, column2Row0,
                               column0Row1, column1Row1, column2Row1,
                               column0Row2, column1Row2, column2Row2);
        }
        result[0] = column0Row0;
        result[1] = column0Row1;
        result[2] = column0Row2;
        result[3] = column1Row0;
        result[4] = column1Row1;
        result[5] = column1Row2;
        result[6] = column2Row0;
        result[7] = column2Row1;
        result[8] = column2Row2;
        return result;
    };

    /**
     * Compares the provided matrices componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     * @memberof Matrix3
     *
     * @param {Matrix3} [left] The first matrix.
     * @param {Matrix3} [right] The second matrix.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    Matrix3.equals = function(left, right) {
        return (left === right) ||
               (defined(left) &&
                defined(right) &&
                left[0] === right[0] &&
                left[1] === right[1] &&
                left[2] === right[2] &&
                left[3] === right[3] &&
                left[4] === right[4] &&
                left[5] === right[5] &&
                left[6] === right[6] &&
                left[7] === right[7] &&
                left[8] === right[8]);
    };

    /**
     * Compares the provided matrices componentwise and returns
     * <code>true</code> if they are within the provided epsilon,
     * <code>false</code> otherwise.
     * @memberof Matrix3
     *
     * @param {Matrix3} [left] The first matrix.
     * @param {Matrix3} [right] The second matrix.
     * @param {Number} epsilon The epsilon to use for equality testing.
     * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
     *
     * @exception {DeveloperError} epsilon is required and must be a number.
     */
    Matrix3.equalsEpsilon = function(left, right, epsilon) {
        if (typeof epsilon !== 'number') {
            throw new DeveloperError('epsilon is required and must be a number');
        }

        return (left === right) ||
                (defined(left) &&
                defined(right) &&
                Math.abs(left[0] - right[0]) <= epsilon &&
                Math.abs(left[1] - right[1]) <= epsilon &&
                Math.abs(left[2] - right[2]) <= epsilon &&
                Math.abs(left[3] - right[3]) <= epsilon &&
                Math.abs(left[4] - right[4]) <= epsilon &&
                Math.abs(left[5] - right[5]) <= epsilon &&
                Math.abs(left[6] - right[6]) <= epsilon &&
                Math.abs(left[7] - right[7]) <= epsilon &&
                Math.abs(left[8] - right[8]) <= epsilon);
    };

    /**
     * An immutable Matrix3 instance initialized to the identity matrix.
     * @memberof Matrix3
     */
    Matrix3.IDENTITY = freezeObject(new Matrix3(1.0, 0.0, 0.0,
                                                0.0, 1.0, 0.0,
                                                0.0, 0.0, 1.0));

    /**
     * The index into Matrix3 for column 0, row 0.
     * @memberof Matrix3
     */
    Matrix3.COLUMN0ROW0 = 0;

    /**
     * The index into Matrix3 for column 0, row 1.
     * @memberof Matrix3
     */
    Matrix3.COLUMN0ROW1 = 1;

    /**
     * The index into Matrix3 for column 0, row 2.
     * @memberof Matrix3
     */
    Matrix3.COLUMN0ROW2 = 2;

    /**
     * The index into Matrix3 for column 1, row 0.
     * @memberof Matrix3
     */
    Matrix3.COLUMN1ROW0 = 3;

    /**
     * The index into Matrix3 for column 1, row 1.
     * @memberof Matrix3
     */
    Matrix3.COLUMN1ROW1 = 4;

    /**
     * The index into Matrix3 for column 1, row 2.
     * @memberof Matrix3
     */
    Matrix3.COLUMN1ROW2 = 5;

    /**
     * The index into Matrix3 for column 2, row 0.
     * @memberof Matrix3
     */
    Matrix3.COLUMN2ROW0 = 6;

    /**
     * The index into Matrix3 for column 2, row 1.
     * @memberof Matrix3
     */
    Matrix3.COLUMN2ROW1 = 7;

    /**
     * The index into Matrix3 for column 2, row 2.
     * @memberof Matrix3
     */
    Matrix3.COLUMN2ROW2 = 8;

    /**
     * Duplicates the provided Matrix3 instance.
     * @memberof Matrix3
     *
     * @param {Matrix3} [result] The object onto which to store the result.
     * @returns {Matrix3} The modified result parameter or a new Matrix3 instance if one was not provided.
     */
    Matrix3.prototype.clone = function(result) {
        return Matrix3.clone(this, result);
    };

    /**
     * Creates an Array from this Matrix3 instance.
     * @memberof Matrix3
     *
     * @param {Array} [result] The Array onto which to store the result.
     * @returns {Array} The modified Array parameter or a new Array instance if one was not provided.
     */
    Matrix3.prototype.toArray = function(result) {
        return Matrix3.toArray(this, result);
    };

    /**
     * Retrieves a copy of the matrix column at the provided index as a Cartesian3 instance.
     * @memberof Matrix3
     *
     * @param {Number} index The zero-based index of the column to retrieve.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
     *
     * @exception {DeveloperError} index is required and must be 0, 1, or 2.
     *
     * @see Cartesian3
     */
    Matrix3.prototype.getColumn = function(index, result) {
        return Matrix3.getColumn(this, index, result);
    };

    /**
     * Computes a new matrix that replaces the specified column in this matrix with the provided Cartesian3 instance.
     * @memberof Matrix3
     *
     * @param {Number} index The zero-based index of the column to set.
     * @param {Cartesian3} cartesian The Cartesian whose values will be assigned to the specified column.
     *
     * @exception {DeveloperError} cartesian is required.
     * @exception {DeveloperError} index is required and must be 0, 1, or 2.
     *
     * @see Cartesian3
     */
    Matrix3.prototype.setColumn = function(index, cartesian, result) {
        return Matrix3.setColumn(this, index, cartesian, result);
    };

    /**
     * Retrieves a copy of the matrix row at the provided index as a Cartesian3 instance.
     * @memberof Matrix3
     *
     * @param {Number} index The zero-based index of the row to retrieve.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
     *
     * @exception {DeveloperError} index is required and must be 0, 1, or 2.
     *
     * @see Cartesian3
     */
    Matrix3.prototype.getRow = function(index, result) {
        return Matrix3.getRow(this, index, result);
    };

    /**
     * Computes a new matrix that replaces the specified row in this matrix with the provided Cartesian3 instance.
     * @memberof Matrix3
     *
     * @param {Number} index The zero-based index of the row to set.
     * @param {Cartesian3} cartesian The Cartesian whose values will be assigned to the specified row.
     *
     * @exception {DeveloperError} cartesian is required.
     * @exception {DeveloperError} index is required and must be 0, 1, or 2.
     *
     * @see Cartesian3
     */
    Matrix3.prototype.setRow = function(index, cartesian, result) {
        return Matrix3.setRow(this, index, cartesian, result);
    };

    /**
     * Computes the product of this matrix and the provided matrix.
     * @memberof Matrix3
     *
     * @param {Matrix3} right The right hand side matrix.
     * @param {Matrix3} [result] The object onto which to store the result.
     * @returns {Matrix3} The modified result parameter or a new Matrix3 instance if one was not provided.
     *
     * @exception {DeveloperError} right is required.
     */
    Matrix3.prototype.multiply = function(right, result) {
        return Matrix3.multiply(this, right, result);
    };

    /**
     * Computes the product of this matrix and a column vector.
     * @memberof Matrix3
     *
     * @param {Cartesian3} cartesian The column.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
     *
     * @exception {DeveloperError} cartesian is required.
     */
    Matrix3.prototype.multiplyByVector = function(cartesian, result) {
        return Matrix3.multiplyByVector(this, cartesian, result);
    };

    /**
     * Computes the product of this matrix and a scalar.
     * @memberof Matrix3
     *
     * @param {Number} scalar The number to multiply by.
     * @param {Matrix3} [result] The object onto which to store the result.
     * @returns {Matrix3} The modified result parameter or a new Cartesian3 instance if one was not provided.
     *
     * @exception {DeveloperError} scalar is required and must be a number.
     */
    Matrix3.prototype.multiplyByScalar = function(scalar, result) {
        return Matrix3.multiplyByScalar(this, scalar, result);
    };
    /**
     * Creates a negated copy of this matrix.
     * @memberof Matrix3
     *
     * @param {Matrix3} matrix The matrix to negate.
     * @param {Matrix3} [result] The object onto which to store the result.
     * @returns {Matrix3} The modified result parameter or a new Matrix3 instance if one was not provided.
     *
     * @exception {DeveloperError} matrix is required.
     */
    Matrix3.prototype.negate = function(result) {
        return Matrix3.negate(this, result);
    };

    /**
     * Computes the transpose of this matrix.
     * @memberof Matrix3
     *
     * @param {Matrix3} [result] The object onto which to store the result.
     * @returns {Matrix3} The modified result parameter or a new Matrix3 instance if one was not provided.
     */
    Matrix3.prototype.transpose = function(result) {
        return Matrix3.transpose(this, result);
    };

    /**
     * Compares this matrix to the provided matrix componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     * @memberof Matrix3
     *
     * @param {Matrix3} [right] The right hand side matrix.
     * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
     */
    Matrix3.prototype.equals = function(right) {
        return Matrix3.equals(this, right);
    };

    /**
     * Compares this matrix to the provided matrix componentwise and returns
     * <code>true</code> if they are within the provided epsilon,
     * <code>false</code> otherwise.
     * @memberof Matrix3
     *
     * @param {Matrix3} [right] The right hand side matrix.
     * @param {Number} epsilon The epsilon to use for equality testing.
     * @returns {Boolean} <code>true</code> if they are within the provided epsilon, <code>false</code> otherwise.
     *
     * @exception {DeveloperError} epsilon is required and must be a number.
     */
    Matrix3.prototype.equalsEpsilon = function(right, epsilon) {
        return Matrix3.equalsEpsilon(this, right, epsilon);
    };

    /**
     * Creates a string representing this Matrix with each row being
     * on a separate line and in the format '(column0, column1, column2)'.
     * @memberof Matrix3
     *
     * @returns {String} A string representing the provided Matrix with each row being on a separate line and in the format '(column0, column1, column2)'.
     */
    Matrix3.prototype.toString = function() {
        return '(' + this[0] + ', ' + this[3] + ', ' + this[6] + ')\n' +
               '(' + this[1] + ', ' + this[4] + ', ' + this[7] + ')\n' +
               '(' + this[2] + ', ' + this[5] + ', ' + this[8] + ')';
    };

    return Matrix3;
});
/*global define*/
define('Core/RuntimeError',['./defined'], function(defined) {
    "use strict";

    /**
     * Constructs an exception object that is thrown due to an error that can occur at runtime, e.g.,
     * out of memory, could not compile shader, etc.  If a function may throw this
     * exception, the calling code should be prepared to catch it.
     * <br /><br />
     * On the other hand, a {@link DeveloperError} indicates an exception due
     * to a developer error, e.g., invalid argument, that usually indicates a bug in the
     * calling code.
     *
     * @alias RuntimeError
     *
     * @param {String} [message=undefined] The error message for this exception.
     *
     * @see DeveloperError
     * @constructor
     */
    var RuntimeError = function(message) {
        /**
         * 'RuntimeError' indicating that this exception was thrown due to a runtime error.
         * @type {String}
         * @constant
         * @default
         */
        this.name = 'RuntimeError';

        /**
         * The explanation for why this exception was thrown.
         * @type {String}
         * @constant
         */
        this.message = message;

        var e = new Error();

        /**
         * The stack trace of this exception, if available.
         * @type {String}
         * @constant
         */
        this.stack = e.stack;
    };

    RuntimeError.prototype.toString = function() {
        var str = this.name + ': ' + this.message;

        if (defined(this.stack)) {
            str += '\n' + this.stack.toString();
        }

        return str;
    };

    return RuntimeError;
});

/*global define*/
define('Core/Matrix4',[
        './Cartesian3',
        './Cartesian4',
        './defaultValue',
        './defined',
        './DeveloperError',
        './freezeObject',
        './Math',
        './Matrix3',
        './RuntimeError'
    ], function(
        Cartesian3,
        Cartesian4,
        defaultValue,
        defined,
        DeveloperError,
        freezeObject,
        CesiumMath,
        Matrix3,
        RuntimeError) {
    "use strict";

    /**
     * A 4x4 matrix, indexable as a column-major order array.
     * Constructor parameters are in row-major order for code readability.
     * @alias Matrix4
     * @constructor
     *
     * @param {Number} [column0Row0=0.0] The value for column 0, row 0.
     * @param {Number} [column1Row0=0.0] The value for column 1, row 0.
     * @param {Number} [column2Row0=0.0] The value for column 2, row 0.
     * @param {Number} [column3Row0=0.0] The value for column 3, row 0.
     * @param {Number} [column0Row1=0.0] The value for column 0, row 1.
     * @param {Number} [column1Row1=0.0] The value for column 1, row 1.
     * @param {Number} [column2Row1=0.0] The value for column 2, row 1.
     * @param {Number} [column3Row1=0.0] The value for column 3, row 1.
     * @param {Number} [column0Row2=0.0] The value for column 0, row 2.
     * @param {Number} [column1Row2=0.0] The value for column 1, row 2.
     * @param {Number} [column2Row2=0.0] The value for column 2, row 2.
     * @param {Number} [column3Row2=0.0] The value for column 3, row 2.
     * @param {Number} [column0Row3=0.0] The value for column 0, row 3.
     * @param {Number} [column1Row3=0.0] The value for column 1, row 3.
     * @param {Number} [column2Row3=0.0] The value for column 2, row 3.
     * @param {Number} [column3Row3=0.0] The value for column 3, row 3.
     *
     * @see Matrix4.fromColumnMajorArray
     * @see Matrix4.fromRowMajorArray
     * @see Matrix4.fromRotationTranslation
     * @see Matrix4.fromTranslation
     * @see Matrix4.fromScale
     * @see Matrix4.fromUniformScale
     * @see Matrix4.fromCamera
     * @see Matrix4.computePerspectiveFieldOfView
     * @see Matrix4.computeOrthographicOffCenter
     * @see Matrix4.computePerspectiveOffCenter
     * @see Matrix4.computeInfinitePerspectiveOffCenter
     * @see Matrix4.computeViewportTransformation
     * @see Matrix2
     * @see Matrix3
     */
    var Matrix4 = function(column0Row0, column1Row0, column2Row0, column3Row0,
                           column0Row1, column1Row1, column2Row1, column3Row1,
                           column0Row2, column1Row2, column2Row2, column3Row2,
                           column0Row3, column1Row3, column2Row3, column3Row3) {
        this[0] = defaultValue(column0Row0, 0.0);
        this[1] = defaultValue(column0Row1, 0.0);
        this[2] = defaultValue(column0Row2, 0.0);
        this[3] = defaultValue(column0Row3, 0.0);
        this[4] = defaultValue(column1Row0, 0.0);
        this[5] = defaultValue(column1Row1, 0.0);
        this[6] = defaultValue(column1Row2, 0.0);
        this[7] = defaultValue(column1Row3, 0.0);
        this[8] = defaultValue(column2Row0, 0.0);
        this[9] = defaultValue(column2Row1, 0.0);
        this[10] = defaultValue(column2Row2, 0.0);
        this[11] = defaultValue(column2Row3, 0.0);
        this[12] = defaultValue(column3Row0, 0.0);
        this[13] = defaultValue(column3Row1, 0.0);
        this[14] = defaultValue(column3Row2, 0.0);
        this[15] = defaultValue(column3Row3, 0.0);
    };

    /**
     * Duplicates a Matrix4 instance.
     * @memberof Matrix4
     *
     * @param {Matrix4} matrix The matrix to duplicate.
     * @param {Matrix4} [result] The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if one was not provided. (Returns undefined if matrix is undefined)
     */
    Matrix4.clone = function(matrix, result) {
        if (!defined(matrix)) {
            return undefined;
        }
        if (!defined(result)) {
            return new Matrix4(matrix[0], matrix[4], matrix[8], matrix[12],
                               matrix[1], matrix[5], matrix[9], matrix[13],
                               matrix[2], matrix[6], matrix[10], matrix[14],
                               matrix[3], matrix[7], matrix[11], matrix[15]);
        }
        result[0] = matrix[0];
        result[1] = matrix[1];
        result[2] = matrix[2];
        result[3] = matrix[3];
        result[4] = matrix[4];
        result[5] = matrix[5];
        result[6] = matrix[6];
        result[7] = matrix[7];
        result[8] = matrix[8];
        result[9] = matrix[9];
        result[10] = matrix[10];
        result[11] = matrix[11];
        result[12] = matrix[12];
        result[13] = matrix[13];
        result[14] = matrix[14];
        result[15] = matrix[15];
        return result;
    };

    /**
     * Computes a Matrix4 instance from a column-major order array.
     * @memberof Matrix4
     * @function
     *
     * @param {Array} values The column-major order array.
     * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns The modified result parameter, or a new Matrix4 instance if one was not provided.
     *
     * @exception {DeveloperError} values is required.
     */
    Matrix4.fromColumnMajorArray = function(values, result) {
        if (!defined(values)) {
            throw new DeveloperError('values parameter is required');
        }
        return Matrix4.clone(values, result);
    };

    /**
     * Computes a Matrix4 instance from a row-major order array.
     * The resulting matrix will be in column-major order.
     * @memberof Matrix4
     *
     * @param {Array} values The row-major order array.
     * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns The modified result parameter, or a new Matrix4 instance if one was not provided.
     *
     * @exception {DeveloperError} values is required.
     */
    Matrix4.fromRowMajorArray = function(values, result) {
        if (!defined(values)) {
            throw new DeveloperError('values is required.');
        }
        if (!defined(result)) {
            return new Matrix4(values[0], values[1], values[2], values[3],
                               values[4], values[5], values[6], values[7],
                               values[8], values[9], values[10], values[11],
                               values[12], values[13], values[14], values[15]);
        }
        result[0] = values[0];
        result[1] = values[4];
        result[2] = values[8];
        result[3] = values[12];
        result[4] = values[1];
        result[5] = values[5];
        result[6] = values[9];
        result[7] = values[13];
        result[8] = values[2];
        result[9] = values[6];
        result[10] = values[10];
        result[11] = values[14];
        result[12] = values[3];
        result[13] = values[7];
        result[14] = values[11];
        result[15] = values[15];
        return result;
    };

    /**
     * Computes a Matrix4 instance from a Matrix3 representing the rotation
     * and a Cartesian3 representing the translation.
     * @memberof Matrix4
     *
     * @param {Matrix3} rotation The upper left portion of the matrix representing the rotation.
     * @param {Cartesian3} translation The upper right portion of the matrix representing the translation.
     * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns The modified result parameter, or a new Matrix4 instance if one was not provided.
     *
     * @exception {DeveloperError} rotation is required.
     * @exception {DeveloperError} translation is required.
     */
    Matrix4.fromRotationTranslation = function(rotation, translation, result) {
        if (!defined(rotation)) {
            throw new DeveloperError('rotation is required.');
        }
        if (!defined(translation)) {
            throw new DeveloperError('translation is required.');
        }
        if (!defined(result)) {
            return new Matrix4(rotation[0], rotation[3], rotation[6], translation.x,
                               rotation[1], rotation[4], rotation[7], translation.y,
                               rotation[2], rotation[5], rotation[8], translation.z,
                                       0.0,         0.0,         0.0,           1.0);
        }

        result[0] = rotation[0];
        result[1] = rotation[1];
        result[2] = rotation[2];
        result[3] = 0.0;
        result[4] = rotation[3];
        result[5] = rotation[4];
        result[6] = rotation[5];
        result[7] = 0.0;
        result[8] = rotation[6];
        result[9] = rotation[7];
        result[10] = rotation[8];
        result[11] = 0.0;
        result[12] = translation.x;
        result[13] = translation.y;
        result[14] = translation.z;
        result[15] = 1.0;
        return result;
    };

    /**
     * Creates a Matrix4 instance from a Cartesian3 representing the translation.
     * @memberof Matrix4
     *
     * @param {Cartesian3} translation The upper right portion of the matrix representing the translation.
     * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns The modified result parameter, or a new Matrix4 instance if one was not provided.
     *
     * @see Matrix4.multiplyByTranslation
     *
     * @exception {DeveloperError} translation is required.
     */
    Matrix4.fromTranslation = function(translation, result) {
        return Matrix4.fromRotationTranslation(Matrix3.IDENTITY, translation, result);
    };

    /**
     * Computes a Matrix4 instance representing a non-uniform scale.
     * @memberof Matrix4
     *
     * @param {Cartesian3} scale The x, y, and z scale factors.
     * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns The modified result parameter, or a new Matrix4 instance if one was not provided.
     *
     * @exception {DeveloperError} scale is required.
     *
     * @example
     * // Creates
     * //   [7.0, 0.0, 0.0, 0.0]
     * //   [0.0, 8.0, 0.0, 0.0]
     * //   [0.0, 0.0, 9.0, 0.0]
     * //   [0.0, 0.0, 0.0, 1.0]
     * var m = Matrix4.fromScale(new Cartesian3(7.0, 8.0, 9.0));
     */
    Matrix4.fromScale = function(scale, result) {
        if (!defined(scale)) {
            throw new DeveloperError('scale is required.');
        }
        if (!defined(result)) {
            return new Matrix4(
                scale.x, 0.0,     0.0,     0.0,
                0.0,     scale.y, 0.0,     0.0,
                0.0,     0.0,     scale.z, 0.0,
                0.0,     0.0,     0.0,     1.0);
        }

        result[0] = scale.x;
        result[1] = 0.0;
        result[2] = 0.0;
        result[3] = 0.0;
        result[4] = 0.0;
        result[5] = scale.y;
        result[6] = 0.0;
        result[7] = 0.0;
        result[8] = 0.0;
        result[9] = 0.0;
        result[10] = scale.z;
        result[11] = 0.0;
        result[12] = 0.0;
        result[13] = 0.0;
        result[14] = 0.0;
        result[15] = 1.0;
        return result;
    };

    /**
     * Computes a Matrix4 instance representing a uniform scale.
     * @memberof Matrix4
     *
     * @param {Number} scale The uniform scale factor.
     * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns The modified result parameter, or a new Matrix4 instance if one was not provided.
     *
     * @exception {DeveloperError} scale is required.
     *
     * @example
     * // Creates
     * //   [2.0, 0.0, 0.0, 0.0]
     * //   [0.0, 2.0, 0.0, 0.0]
     * //   [0.0, 0.0, 2.0, 0.0]
     * //   [0.0, 0.0, 0.0, 1.0]
     * var m = Matrix4.fromScale(2.0);
     */
    Matrix4.fromUniformScale = function(scale, result) {
        if (typeof scale !== 'number') {
            throw new DeveloperError('scale is required.');
        }
        if (!defined(result)) {
            return new Matrix4(scale, 0.0,   0.0,   0.0,
                               0.0,   scale, 0.0,   0.0,
                               0.0,   0.0,   scale, 0.0,
                               0.0,   0.0,   0.0,   1.0);
        }

        result[0] = scale;
        result[1] = 0.0;
        result[2] = 0.0;
        result[3] = 0.0;
        result[4] = 0.0;
        result[5] = scale;
        result[6] = 0.0;
        result[7] = 0.0;
        result[8] = 0.0;
        result[9] = 0.0;
        result[10] = scale;
        result[11] = 0.0;
        result[12] = 0.0;
        result[13] = 0.0;
        result[14] = 0.0;
        result[15] = 1.0;
        return result;
    };

    var fromCameraF = new Cartesian3();
    var fromCameraS = new Cartesian3();
    var fromCameraU = new Cartesian3();

    /**
     * Computes a Matrix4 instance from a Camera.
     * @memberof Matrix4
     *
     * @param {Camera} camera The camera to use.
     * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns The modified result parameter, or a new Matrix4 instance if one was not provided.
     *
     * @exception {DeveloperError} camera is required.
     * @exception {DeveloperError} camera.eye is required.
     * @exception {DeveloperError} camera.target is required.
     * @exception {DeveloperError} camera.up is required.
     */
    Matrix4.fromCamera = function(camera, result) {
        if (!defined(camera)) {
            throw new DeveloperError('camera is required.');
        }

        var eye = camera.eye;
        var target = camera.target;
        var up = camera.up;

        if (!defined(eye)) {
            throw new DeveloperError('camera.eye is required.');
        }
        if (!defined(target)) {
            throw new DeveloperError('camera.target is required.');
        }
        if (!defined(up)) {
            throw new DeveloperError('camera.up is required.');
        }

        Cartesian3.normalize(Cartesian3.subtract(target, eye, fromCameraF), fromCameraF);
        Cartesian3.normalize(Cartesian3.cross(fromCameraF, up, fromCameraS), fromCameraS);
        Cartesian3.normalize(Cartesian3.cross(fromCameraS, fromCameraF, fromCameraU), fromCameraU);

        var sX = fromCameraS.x;
        var sY = fromCameraS.y;
        var sZ = fromCameraS.z;
        var fX = fromCameraF.x;
        var fY = fromCameraF.y;
        var fZ = fromCameraF.z;
        var uX = fromCameraU.x;
        var uY = fromCameraU.y;
        var uZ = fromCameraU.z;
        var eyeX = eye.x;
        var eyeY = eye.y;
        var eyeZ = eye.z;
        var t0 = sX * -eyeX + sY * -eyeY+ sZ * -eyeZ;
        var t1 = uX * -eyeX + uY * -eyeY+ uZ * -eyeZ;
        var t2 = fX * eyeX + fY * eyeY + fZ * eyeZ;

        //The code below this comment is an optimized
        //version of the commented lines.
        //Rather that create two matrices and then multiply,
        //we just bake in the multiplcation as part of creation.
        //var rotation = new Matrix4(
        //                sX,  sY,  sZ, 0.0,
        //                uX,  uY,  uZ, 0.0,
        //               -fX, -fY, -fZ, 0.0,
        //                0.0,  0.0,  0.0, 1.0);
        //var translation = new Matrix4(
        //                1.0, 0.0, 0.0, -eye.x,
        //                0.0, 1.0, 0.0, -eye.y,
        //                0.0, 0.0, 1.0, -eye.z,
        //                0.0, 0.0, 0.0, 1.0);
        //return rotation.multiply(translation);
        if (!defined(result)) {
            return new Matrix4(
                    sX,   sY,  sZ, t0,
                    uX,   uY,  uZ, t1,
                   -fX,  -fY, -fZ, t2,
                    0.0, 0.0, 0.0, 1.0);
        }
        result[0] = sX;
        result[1] = uX;
        result[2] = -fX;
        result[3] = 0.0;
        result[4] = sY;
        result[5] = uY;
        result[6] = -fY;
        result[7] = 0.0;
        result[8] = sZ;
        result[9] = uZ;
        result[10] = -fZ;
        result[11] = 0.0;
        result[12] = t0;
        result[13] = t1;
        result[14] = t2;
        result[15] = 1.0;
        return result;

    };

     /**
      * Computes a Matrix4 instance representing a perspective transformation matrix.
      * @memberof Matrix4
      *
      * @param {Number} fovY The field of view along the Y axis in radians.
      * @param {Number} aspectRatio The aspect ratio.
      * @param {Number} near The distance to the near plane in meters.
      * @param {Number} far The distance to the far plane in meters.
      * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
      * @returns The modified result parameter, or a new Matrix4 instance if one was not provided.
      *
      * @exception {DeveloperError} fovY must be in [0, PI).
      * @exception {DeveloperError} aspectRatio must be greater than zero.
      * @exception {DeveloperError} near must be greater than zero.
      * @exception {DeveloperError} far must be greater than zero.
      */
    Matrix4.computePerspectiveFieldOfView = function(fovY, aspectRatio, near, far, result) {
        if (fovY <= 0.0 || fovY > Math.PI) {
            throw new DeveloperError('fovY must be in [0, PI).');
        }

        if (aspectRatio <= 0.0) {
            throw new DeveloperError('aspectRatio must be greater than zero.');
        }

        if (near <= 0.0) {
            throw new DeveloperError('near must be greater than zero.');
        }

        if (far <= 0.0) {
            throw new DeveloperError('far must be greater than zero.');
        }

        var bottom = Math.tan(fovY * 0.5);

        var column1Row1 = 1.0 / bottom;
        var column0Row0 = column1Row1 / aspectRatio;
        var column2Row2 = (far + near) / (near - far);
        var column3Row2 = (2.0 * far * near) / (near - far);

        if (!defined(result)) {
            return new Matrix4(column0Row0,         0.0,         0.0,         0.0,
                                       0.0, column1Row1,         0.0,         0.0,
                                       0.0,         0.0, column2Row2, column3Row2,
                                       0.0,         0.0,        -1.0,         0.0);
         }

        result[0] = column0Row0;
        result[1] = 0.0;
        result[2] = 0.0;
        result[3] = 0.0;
        result[4] = 0.0;
        result[5] = column1Row1;
        result[6] = 0.0;
        result[7] = 0.0;
        result[8] = 0.0;
        result[9] = 0.0;
        result[10] = column2Row2;
        result[11] = -1.0;
        result[12] = 0.0;
        result[13] = 0.0;
        result[14] = column3Row2;
        result[15] = 0.0;
        return result;
    };

    /**
    * Computes a Matrix4 instance representing an orthographic transformation matrix.
    * @memberof Matrix4
    *
    * @param {Number} left The number of meters to the left of the camera that will be in view.
    * @param {Number} right The number of meters to the right of the camera that will be in view.
    * @param {Number} bottom The number of meters below of the camera that will be in view.
    * @param {Number} top The number of meters above of the camera that will be in view.
    * @param {Number} near The distance to the near plane in meters.
    * @param {Number} far The distance to the far plane in meters.
    * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
    * @returns The modified result parameter, or a new Matrix4 instance if one was not provided.
    *
    * @exception {DeveloperError} left is required.
    * @exception {DeveloperError} right is required.
    * @exception {DeveloperError} bottom is required.
    * @exception {DeveloperError} top is required.
    * @exception {DeveloperError} near is required.
    * @exception {DeveloperError} far is required.
    */
    Matrix4.computeOrthographicOffCenter = function(left, right, bottom, top, near, far, result) {
        if (!defined(left)) {
            throw new DeveloperError('left is required.');
        }
        if (!defined(right)) {
            throw new DeveloperError('right is required.');
        }
        if (!defined(bottom)) {
            throw new DeveloperError('bottom is required.');
        }
        if (!defined(top)) {
            throw new DeveloperError('top is required.');
        }
        if (!defined(near)) {
            throw new DeveloperError('near is required.');
        }
        if (!defined(far)) {
            throw new DeveloperError('far is required.');
        }

        var a = 1.0 / (right - left);
        var b = 1.0 / (top - bottom);
        var c = 1.0 / (far - near);

        var tx = -(right + left) * a;
        var ty = -(top + bottom) * b;
        var tz = -(far + near) * c;
        a *= 2.0;
        b *= 2.0;
        c *= -2.0;

        if (!defined(result)) {
            return new Matrix4(  a, 0.0, 0.0, tx,
                               0.0,   b, 0.0, ty,
                               0.0, 0.0,   c, tz,
                               0.0, 0.0, 0.0, 1.0);
        }

        result[0] = a;
        result[1] = 0.0;
        result[2] = 0.0;
        result[3] = 0.0;
        result[4] = 0.0;
        result[5] = b;
        result[6] = 0.0;
        result[7] = 0.0;
        result[8] = 0.0;
        result[9] = 0.0;
        result[10] = c;
        result[11] = 0.0;
        result[12] = tx;
        result[13] = ty;
        result[14] = tz;
        result[15] = 1.0;
        return result;
    };

    /**
     * Computes a Matrix4 instance representing an off center perspective transformation.
     * @memberof Matrix4
     *
     * @param {Number} left The number of meters to the left of the camera that will be in view.
     * @param {Number} right The number of meters to the right of the camera that will be in view.
     * @param {Number} bottom The number of meters below of the camera that will be in view.
     * @param {Number} top The number of meters above of the camera that will be in view.
     * @param {Number} near The distance to the near plane in meters.
     * @param {Number} far The distance to the far plane in meters.
     * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns The modified result parameter, or a new Matrix4 instance if one was not provided.
     *
     * @exception {DeveloperError} left is required.
     * @exception {DeveloperError} right is required.
     * @exception {DeveloperError} bottom is required.
     * @exception {DeveloperError} top is required.
     * @exception {DeveloperError} near is required.
     * @exception {DeveloperError} far is required.
     */
    Matrix4.computePerspectiveOffCenter = function(left, right, bottom, top, near, far, result) {
        if (!defined(left)) {
            throw new DeveloperError('left is required.');
        }
        if (!defined(right)) {
            throw new DeveloperError('right is required.');
        }
        if (!defined(bottom)) {
            throw new DeveloperError('bottom is required.');
        }
        if (!defined(top)) {
            throw new DeveloperError('top is required.');
        }
        if (!defined(near)) {
            throw new DeveloperError('near is required.');
        }
        if (!defined(far)) {
            throw new DeveloperError('far is required.');
        }

        var column0Row0 = 2.0 * near / (right - left);
        var column1Row1 = 2.0 * near / (top - bottom);
        var column2Row0 = (right + left) / (right - left);
        var column2Row1 = (top + bottom) / (top - bottom);
        var column2Row2 = -(far + near) / (far - near);
        var column2Row3 = -1.0;
        var column3Row2 = -2.0 * far * near / (far - near);

        if (!defined(result)) {
            return new Matrix4(column0Row0, 0.0,         column2Row0, 0.0,
                                       0.0, column1Row1, column2Row1, 0.0,
                                       0.0, 0.0,         column2Row2, column3Row2,
                                       0.0, 0.0,         column2Row3, 0.0);
        }

        result[0] = column0Row0;
        result[1] = 0.0;
        result[2] = 0.0;
        result[3] = 0.0;
        result[4] = 0.0;
        result[5] = column1Row1;
        result[6] = 0.0;
        result[7] = 0.0;
        result[8] = column2Row0;
        result[9] = column2Row1;
        result[10] = column2Row2;
        result[11] = column2Row3;
        result[12] = 0.0;
        result[13] = 0.0;
        result[14] = column3Row2;
        result[15] = 0.0;
        return result;
    };

    /**
     * Computes a Matrix4 instance representing an infinite off center perspective transformation.
     * @memberof Matrix4
     *
     * @param {Number} left The number of meters to the left of the camera that will be in view.
     * @param {Number} right The number of meters to the right of the camera that will be in view.
     * @param {Number} bottom The number of meters below of the camera that will be in view.
     * @param {Number} top The number of meters above of the camera that will be in view.
     * @param {Number} near The distance to the near plane in meters.
     * @param {Number} far The distance to the far plane in meters.
     * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns The modified result parameter, or a new Matrix4 instance if one was not provided.
     *
     * @exception {DeveloperError} left is required.
     * @exception {DeveloperError} right is required.
     * @exception {DeveloperError} bottom is required.
     * @exception {DeveloperError} top is required.
     * @exception {DeveloperError} near is required.
     */
    Matrix4.computeInfinitePerspectiveOffCenter = function(left, right, bottom, top, near, result) {
        if (!defined(left)) {
            throw new DeveloperError('left is required.');
        }
        if (!defined(right)) {
            throw new DeveloperError('right is required.');
        }
        if (!defined(bottom)) {
            throw new DeveloperError('bottom is required.');
        }
        if (!defined(top)) {
            throw new DeveloperError('top is required.');
        }
        if (!defined(near)) {
            throw new DeveloperError('near is required.');
        }

        var column0Row0 = 2.0 * near / (right - left);
        var column1Row1 = 2.0 * near / (top - bottom);
        var column2Row0 = (right + left) / (right - left);
        var column2Row1 = (top + bottom) / (top - bottom);
        var column2Row2 = -1.0;
        var column2Row3 = -1.0;
        var column3Row2 = -2.0 * near;

        if (!defined(result)) {
            return new Matrix4(column0Row0, 0.0,         column2Row0, 0.0,
                                       0.0, column1Row1, column2Row1, 0.0,
                                       0.0, 0.0,         column2Row2, column3Row2,
                                       0.0, 0.0,         column2Row3, 0.0);
        }

        result[0] = column0Row0;
        result[1] = 0.0;
        result[2] = 0.0;
        result[3] = 0.0;
        result[4] = 0.0;
        result[5] = column1Row1;
        result[6] = 0.0;
        result[7] = 0.0;
        result[8] = column2Row0;
        result[9] = column2Row1;
        result[10] = column2Row2;
        result[11] = column2Row3;
        result[12] = 0.0;
        result[13] = 0.0;
        result[14] = column3Row2;
        result[15] = 0.0;
        return result;
    };

    /**
     * Computes a Matrix4 instance that transforms from normalized device coordinates to window coordinates.
     * @memberof Matrix4
     *
     * @param {Object}[viewport = { x : 0.0, y : 0.0, width : 0.0, height : 0.0 }] The viewport's corners as shown in Example 1.
     * @param {Number}[nearDepthRange = 0.0] The near plane distance in window coordinates.
     * @param {Number}[farDepthRange = 1.0] The far plane distance in window coordinates.
     * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns The modified result parameter, or a new Matrix4 instance if one was not provided.
     *
     * @see czm_viewportTransformation
     * @see Context#getViewport
     *
     * @example
     * // Example 1.  Create viewport transformation using an explicit viewport and depth range.
     * var m = Matrix4.computeViewportTransformation({
     *     x : 0.0,
     *     y : 0.0,
     *     width : 1024.0,
     *     height : 768.0
     * }, 0.0, 1.0);
     *
     * // Example 2.  Create viewport transformation using the context's viewport.
     * var m = Matrix4.computeViewportTransformation(context.getViewport());
     */
    Matrix4.computeViewportTransformation = function(viewport, nearDepthRange, farDepthRange, result) {
        viewport = defaultValue(viewport, defaultValue.EMPTY_OBJECT);
        var x = defaultValue(viewport.x, 0.0);
        var y = defaultValue(viewport.y, 0.0);
        var width = defaultValue(viewport.width, 0.0);
        var height = defaultValue(viewport.height, 0.0);
        nearDepthRange = defaultValue(nearDepthRange, 0.0);
        farDepthRange = defaultValue(farDepthRange, 1.0);

        var halfWidth = width * 0.5;
        var halfHeight = height * 0.5;
        var halfDepth = (farDepthRange - nearDepthRange) * 0.5;

        var column0Row0 = halfWidth;
        var column1Row1 = halfHeight;
        var column2Row2 = halfDepth;
        var column3Row0 = x + halfWidth;
        var column3Row1 = y + halfHeight;
        var column3Row2 = nearDepthRange + halfDepth;
        var column3Row3 = 1.0;

        if (!defined(result)) {
            return new Matrix4(column0Row0, 0.0,         0.0,         column3Row0,
                               0.0,         column1Row1, 0.0,         column3Row1,
                               0.0,         0.0,         column2Row2, column3Row2,
                               0.0,         0.0,         0.0,         column3Row3);
        }
        result[0] = column0Row0;
        result[1] = 0.0;
        result[2] = 0.0;
        result[3] = 0.0;
        result[4] = 0.0;
        result[5] = column1Row1;
        result[6] = 0.0;
        result[7] = 0.0;
        result[8] = 0.0;
        result[9] = 0.0;
        result[10] = column2Row2;
        result[11] = 0.0;
        result[12] = column3Row0;
        result[13] = column3Row1;
        result[14] = column3Row2;
        result[15] = column3Row3;
        return result;
    };

    /**
     * Computes an Array from the provided Matrix4 instance.
     * The array will be in column-major order.
     * @memberof Matrix4
     *
     * @param {Matrix4} matrix The matrix to use..
     * @param {Array} [result] The Array onto which to store the result.
     * @returns {Array} The modified Array parameter or a new Array instance if one was not provided.
     *
     * @exception {DeveloperError} matrix is required.
     *
     * @example
     * //create an array from an instance of Matrix4
     * // m = [10.0, 14.0, 18.0, 22.0]
     * //     [11.0, 15.0, 19.0, 23.0]
     * //     [12.0, 16.0, 20.0, 24.0]
     * //     [13.0, 17.0, 21.0, 25.0]
     * var a = Matrix4.toArray(m);
     *
     * // m remains the same
     * //creates a = [10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 17.0, 18.0, 19.0, 20.0, 21.0, 22.0, 23.0, 24.0, 25.0]
     *
     */
    Matrix4.toArray = function(matrix, result) {
        if (!defined(matrix)) {
            throw new DeveloperError('matrix is required');
        }
        if (!defined(result)) {
            return [matrix[0], matrix[1], matrix[2], matrix[3],
                    matrix[4], matrix[5], matrix[6], matrix[7],
                    matrix[8], matrix[9], matrix[10], matrix[11],
                    matrix[12], matrix[13], matrix[14], matrix[15]];
        }
        result[0] = matrix[0];
        result[1] = matrix[1];
        result[2] = matrix[2];
        result[3] = matrix[3];
        result[4] = matrix[4];
        result[5] = matrix[5];
        result[6] = matrix[6];
        result[7] = matrix[7];
        result[8] = matrix[8];
        result[9] = matrix[9];
        result[10] = matrix[10];
        result[11] = matrix[11];
        result[12] = matrix[12];
        result[13] = matrix[13];
        result[14] = matrix[14];
        result[15] = matrix[15];
        return result;
    };

    /**
     * Computes the array index of the element at the provided row and column.
     * @memberof Matrix4
     *
     * @param {Number} row The zero-based index of the row.
     * @param {Number} column The zero-based index of the column.
     * @returns {Number} The index of the element at the provided row and column.
     *
     * @exception {DeveloperError} row is required and must be 0, 1, 2, or 3.
     * @exception {DeveloperError} column is required and must be 0, 1, 2, or 3.
     *
     * @example
     * var myMatrix = new Matrix4();
     * var column1Row0Index = Matrix4.getElementIndex(1, 0);
     * var column1Row0 = myMatrix[column1Row0Index]
     * myMatrix[column1Row0Index] = 10.0;
     */
    Matrix4.getElementIndex = function(column, row) {
        if (typeof row !== 'number' || row < 0 || row > 3) {
            throw new DeveloperError('row is required and must be 0, 1, 2, or 3.');
        }
        if (typeof column !== 'number' || column < 0 || column > 3) {
            throw new DeveloperError('column is required and must be 0, 1, 2, or 3.');
        }
        return column * 4 + row;
    };

    /**
     * Retrieves a copy of the matrix column at the provided index as a Cartesian4 instance.
     * @memberof Matrix4
     *
     * @param {Matrix4} matrix The matrix to use.
     * @param {Number} index The zero-based index of the column to retrieve.
     * @param {Cartesian4} [result] The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided.
     *
     * @exception {DeveloperError} matrix is required.
     * @exception {DeveloperError} index is required and must be 0, 1, 2, or 3.
     *
     * @see Cartesian4
     *
     * @example
     * //returns a Cartesian4 instance with values from the specified column
     * // m = [10.0, 11.0, 12.0, 13.0]
     * //     [14.0, 15.0, 16.0, 17.0]
     * //     [18.0, 19.0, 20.0, 21.0]
     * //     [22.0, 23.0, 24.0, 25.0]
     *
     * //Example 1: Creates an instance of Cartesian
     * var a = Matrix4.getColumn(m, 2);
     *
     * //Example 2: Sets values for Cartesian instance
     * var a = new Cartesian4();
     * Matrix4.getColumn(m, 2, a);
     *
     * // a.x = 12.0; a.y = 16.0; a.z = 20.0; a.w = 24.0;
     *
     */
    Matrix4.getColumn = function(matrix, index, result) {
        if (!defined(matrix)) {
            throw new DeveloperError('matrix is required.');
        }

        if (typeof index !== 'number' || index < 0 || index > 3) {
            throw new DeveloperError('index is required and must be 0, 1, 2, or 3.');
        }

        var startIndex = index * 4;
        var x = matrix[startIndex];
        var y = matrix[startIndex + 1];
        var z = matrix[startIndex + 2];
        var w = matrix[startIndex + 3];

        if (!defined(result)) {
            return new Cartesian4(x, y, z, w);
        }
        result.x = x;
        result.y = y;
        result.z = z;
        result.w = w;
        return result;
    };

    /**
     * Computes a new matrix that replaces the specified column in the provided matrix with the provided Cartesian4 instance.
     * @memberof Matrix4
     *
     * @param {Matrix4} matrix The matrix to use.
     * @param {Number} index The zero-based index of the column to set.
     * @param {Cartesian4} cartesian The Cartesian whose values will be assigned to the specified column.
     * @param {Cartesian4} [result] The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if one was not provided.
     *
     * @exception {DeveloperError} matrix is required.
     * @exception {DeveloperError} cartesian is required.
     * @exception {DeveloperError} index is required and must be 0, 1, 2, or 3.
     *
     * @see Cartesian4
     *
     * @example
     * //creates a new Matrix4 instance with new column values from the Cartesian4 instance
     * // m = [10.0, 11.0, 12.0, 13.0]
     * //     [14.0, 15.0, 16.0, 17.0]
     * //     [18.0, 19.0, 20.0, 21.0]
     * //     [22.0, 23.0, 24.0, 25.0]
     *
     * var a = Matrix4.setColumn(m, 2, new Cartesian4(99.0, 98.0, 97.0, 96.0));
     *
     * // m remains the same
     * // a = [10.0, 11.0, 99.0, 13.0]
     * //     [14.0, 15.0, 98.0, 17.0]
     * //     [18.0, 19.0, 97.0, 21.0]
     * //     [22.0, 23.0, 96.0, 25.0]
     *
     */
    Matrix4.setColumn = function(matrix, index, cartesian, result) {
        if (!defined(matrix)) {
            throw new DeveloperError('matrix is required');
        }
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required');
        }
        if (typeof index !== 'number' || index < 0 || index > 3) {
            throw new DeveloperError('index is required and must be 0, 1, 2, or 3.');
        }
        result = Matrix4.clone(matrix, result);
        var startIndex = index * 4;
        result[startIndex] = cartesian.x;
        result[startIndex + 1] = cartesian.y;
        result[startIndex + 2] = cartesian.z;
        result[startIndex + 3] = cartesian.w;
        return result;
    };

    /**
     * Retrieves a copy of the matrix row at the provided index as a Cartesian4 instance.
     * @memberof Matrix4
     *
     * @param {Matrix4} matrix The matrix to use.
     * @param {Number} index The zero-based index of the row to retrieve.
     * @param {Cartesian4} [result] The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided.
     *
     * @exception {DeveloperError} matrix is required.
     * @exception {DeveloperError} index is required and must be 0, 1, 2, or 3.
     *
     * @see Cartesian4
     *
     * @example
     * //returns a Cartesian4 instance with values from the specified column
     * // m = [10.0, 11.0, 12.0, 13.0]
     * //     [14.0, 15.0, 16.0, 17.0]
     * //     [18.0, 19.0, 20.0, 21.0]
     * //     [22.0, 23.0, 24.0, 25.0]
     *
     * //Example 1: Returns an instance of Cartesian
     * var a = Matrix4.getRow(m, 2);
     *
     * //Example 1: Sets values for a Cartesian instance
     * var a = new Cartesian4();
     * Matrix4.getRow(m, 2, a);
     *
     * // a.x = 18.0; a.y = 19.0; a.z = 20.0; a.w = 21.0;
     */
    Matrix4.getRow = function(matrix, index, result) {
        if (!defined(matrix)) {
            throw new DeveloperError('matrix is required.');
        }

        if (typeof index !== 'number' || index < 0 || index > 3) {
            throw new DeveloperError('index is required and must be 0, 1, 2, or 3.');
        }

        var x = matrix[index];
        var y = matrix[index + 4];
        var z = matrix[index + 8];
        var w = matrix[index + 12];

        if (!defined(result)) {
            return new Cartesian4(x, y, z, w);
        }
        result.x = x;
        result.y = y;
        result.z = z;
        result.w = w;
        return result;
    };

    /**
     * Computes a new matrix that replaces the specified row in the provided matrix with the provided Cartesian4 instance.
     * @memberof Matrix4
     *
     * @param {Matrix4} matrix The matrix to use.
     * @param {Number} index The zero-based index of the row to set.
     * @param {Cartesian4} cartesian The Cartesian whose values will be assigned to the specified row.
     * @param {Cartesian4} [result] The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if one was not provided.
     *
     * @exception {DeveloperError} matrix is required.
     * @exception {DeveloperError} cartesian is required.
     * @exception {DeveloperError} index is required and must be 0, 1, 2, or 3.
     *
     * @see Cartesian4
     *
     * @example
     * //create a new Matrix4 instance with new row values from the Cartesian4 instance
     * // m = [10.0, 11.0, 12.0, 13.0]
     * //     [14.0, 15.0, 16.0, 17.0]
     * //     [18.0, 19.0, 20.0, 21.0]
     * //     [22.0, 23.0, 24.0, 25.0]
     *
     * var a = Matrix4.setRow(m, 2, new Cartesian4(99.0, 98.0, 97.0, 96.0));
     *
     * // m remains the same
     * // a = [10.0, 11.0, 12.0, 13.0]
     * //     [14.0, 15.0, 16.0, 17.0]
     * //     [99.0, 98.0, 97.0, 96.0]
     * //     [22.0, 23.0, 24.0, 25.0]
     *
     */
    Matrix4.setRow = function(matrix, index, cartesian, result) {
        if (!defined(matrix)) {
            throw new DeveloperError('matrix is required');
        }
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required');
        }
        if (typeof index !== 'number' || index < 0 || index > 3) {
            throw new DeveloperError('index is required and must be 0, 1, 2, or 3.');
        }

        result = Matrix4.clone(matrix, result);
        result[index] = cartesian.x;
        result[index + 4] = cartesian.y;
        result[index + 8] = cartesian.z;
        result[index + 12] = cartesian.w;
        return result;
    };

    /**
     * Computes the product of two matrices.
     * @memberof Matrix4
     *
     * @param {Matrix4} left The first matrix.
     * @param {Matrix4} right The second matrix.
     * @param {Matrix4} [result] The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if one was not provided.
     *
     * @exception {DeveloperError} left is required.
     * @exception {DeveloperError} right is required.
     */
    Matrix4.multiply = function(left, right, result) {
        if (!defined(left)) {
            throw new DeveloperError('left is required');
        }
        if (!defined(right)) {
            throw new DeveloperError('right is required');
        }

        var left0 = left[0];
        var left1 = left[1];
        var left2 = left[2];
        var left3 = left[3];
        var left4 = left[4];
        var left5 = left[5];
        var left6 = left[6];
        var left7 = left[7];
        var left8 = left[8];
        var left9 = left[9];
        var left10 = left[10];
        var left11 = left[11];
        var left12 = left[12];
        var left13 = left[13];
        var left14 = left[14];
        var left15 = left[15];

        var right0 = right[0];
        var right1 = right[1];
        var right2 = right[2];
        var right3 = right[3];
        var right4 = right[4];
        var right5 = right[5];
        var right6 = right[6];
        var right7 = right[7];
        var right8 = right[8];
        var right9 = right[9];
        var right10 = right[10];
        var right11 = right[11];
        var right12 = right[12];
        var right13 = right[13];
        var right14 = right[14];
        var right15 = right[15];

        var column0Row0 = left0 * right0 + left4 * right1 + left8 * right2 + left12 * right3;
        var column0Row1 = left1 * right0 + left5 * right1 + left9 * right2 + left13 * right3;
        var column0Row2 = left2 * right0 + left6 * right1 + left10 * right2 + left14 * right3;
        var column0Row3 = left3 * right0 + left7 * right1 + left11 * right2 + left15 * right3;

        var column1Row0 = left0 * right4 + left4 * right5 + left8 * right6 + left12 * right7;
        var column1Row1 = left1 * right4 + left5 * right5 + left9 * right6 + left13 * right7;
        var column1Row2 = left2 * right4 + left6 * right5 + left10 * right6 + left14 * right7;
        var column1Row3 = left3 * right4 + left7 * right5 + left11 * right6 + left15 * right7;

        var column2Row0 = left0 * right8 + left4 * right9 + left8 * right10 + left12 * right11;
        var column2Row1 = left1 * right8 + left5 * right9 + left9 * right10 + left13 * right11;
        var column2Row2 = left2 * right8 + left6 * right9 + left10 * right10 + left14 * right11;
        var column2Row3 = left3 * right8 + left7 * right9 + left11 * right10 + left15 * right11;

        var column3Row0 = left0 * right12 + left4 * right13 + left8 * right14 + left12 * right15;
        var column3Row1 = left1 * right12 + left5 * right13 + left9 * right14 + left13 * right15;
        var column3Row2 = left2 * right12 + left6 * right13 + left10 * right14 + left14 * right15;
        var column3Row3 = left3 * right12 + left7 * right13 + left11 * right14 + left15 * right15;

        if (!defined(result)) {
            return new Matrix4(column0Row0, column1Row0, column2Row0, column3Row0,
                               column0Row1, column1Row1, column2Row1, column3Row1,
                               column0Row2, column1Row2, column2Row2, column3Row2,
                               column0Row3, column1Row3, column2Row3, column3Row3);
        }
        result[0] = column0Row0;
        result[1] = column0Row1;
        result[2] = column0Row2;
        result[3] = column0Row3;
        result[4] = column1Row0;
        result[5] = column1Row1;
        result[6] = column1Row2;
        result[7] = column1Row3;
        result[8] = column2Row0;
        result[9] = column2Row1;
        result[10] = column2Row2;
        result[11] = column2Row3;
        result[12] = column3Row0;
        result[13] = column3Row1;
        result[14] = column3Row2;
        result[15] = column3Row3;
        return result;
    };

    /**
     * Multiplies a transformation matrix (with a bottom row of <code>[0.0, 0.0, 0.0, 1.0]</code>)
     * by an implicit translation matrix defined by a {@link Cartesian3}.  This is an optimization
     * for <code>Matrix4.multiply(m, Matrix4.fromTranslation(position), m);</code> with less allocations and arithmetic operations.
     *
     * @memberof Matrix4
     *
     * @param {Matrix4} matrix The matrix on the left-hand side.
     * @param {Cartesian3} translation The translation on the right-hand side.
     * @param {Matrix4} [result] The object onto which to store the result.
     *
     * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if one was not provided.
     *
     * @exception {DeveloperError} matrix is required.
     * @exception {DeveloperError} translation is required.
     *
     * @see Matrix4#fromTranslation
     *
     * @example
     * // Instead of Matrix4.multiply(m, Matrix4.fromTranslation(position), m);
     * Matrix4.multiplyByTranslation(m, position, m);
     */
    Matrix4.multiplyByTranslation = function(matrix, translation, result) {
        if (!defined(matrix)) {
            throw new DeveloperError('matrix is required');
        }
        if (!defined(translation)) {
            throw new DeveloperError('translation is required');
        }

        var x = translation.x;
        var y = translation.y;
        var z = translation.z;

        var tx = (x * matrix[0]) + (y * matrix[4]) + (z * matrix[8]) + matrix[12];
        var ty = (x * matrix[1]) + (y * matrix[5]) + (z * matrix[9]) + matrix[13];
        var tz = (x * matrix[2]) + (y * matrix[6]) + (z * matrix[10]) + matrix[14];

        if (!defined(result)) {
            return new Matrix4(matrix[0], matrix[4], matrix[8], tx,
                               matrix[1], matrix[5], matrix[9], ty,
                               matrix[2], matrix[6], matrix[10], tz,
                               matrix[3], matrix[7], matrix[11], matrix[15]);
        }

        result[0] = matrix[0];
        result[1] = matrix[1];
        result[2] = matrix[2];
        result[3] = matrix[3];
        result[4] = matrix[4];
        result[5] = matrix[5];
        result[6] = matrix[6];
        result[7] = matrix[7];
        result[8] = matrix[8];
        result[9] = matrix[9];
        result[10] = matrix[10];
        result[11] = matrix[11];
        result[12] = tx;
        result[13] = ty;
        result[14] = tz;
        result[15] = matrix[15];
        return result;
    };

    /**
     * Multiplies a transformation matrix (with a bottom row of <code>[0.0, 0.0, 0.0, 1.0]</code>)
     * by an implicit uniform scale matrix.  This is an optimization
     * for <code>Matrix4.multiply(m, Matrix4.fromScale(scale), m);</code> with less allocations and arithmetic operations.
     *
     * @memberof Matrix4
     *
     * @param {Matrix4} matrix The matrix on the left-hand side.
     * @param {Number} scale The uniform scale on the right-hand side.
     * @param {Matrix4} [result] The object onto which to store the result.
     *
     * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if one was not provided.
     *
     * @exception {DeveloperError} matrix is required.
     * @exception {DeveloperError} scale is required.
     *
     * @see Matrix4#fromUniformScale
     *
     * @example
     * // Instead of Matrix4.multiply(m, Matrix4.fromUniformScale(scale), m);
     * Matrix4.multiplyByUniformScale(m, scale, m);
     */
    Matrix4.multiplyByUniformScale = function(matrix, scale, result) {
        if (!defined(matrix)) {
            throw new DeveloperError('matrix is required');
        }
        if (typeof scale !== 'number') {
            throw new DeveloperError('scale is required');
        }

        if (scale === 1.0) {
            return Matrix4.clone(matrix, result);
        }

        if (!defined(result)) {
            return new Matrix4(
                scale * matrix[0], scale * matrix[4], scale * matrix[8],  matrix[12],
                scale * matrix[1], scale * matrix[5], scale * matrix[9],  matrix[13],
                scale * matrix[2], scale * matrix[6], scale * matrix[10], matrix[14],
                0.0,               0.0,               0.0,                1.0);
        }

        result[0] = scale * matrix[0];
        result[1] = scale * matrix[1];
        result[2] = scale * matrix[2];
        result[3] = 0.0;
        result[4] = scale * matrix[4];
        result[5] = scale * matrix[5];
        result[6] = scale * matrix[6];
        result[7] = 0.0;
        result[8] = scale * matrix[8];
        result[9] = scale * matrix[9];
        result[10] = scale * matrix[10];
        result[11] = 0.0;
        result[12] = matrix[12];
        result[13] = matrix[13];
        result[14] = matrix[14];
        result[15] = 1.0;
        return result;
    };

    /**
     * Computes the product of a matrix and a column vector.
     * @memberof Matrix4
     *
     * @param {Matrix4} matrix The matrix.
     * @param {Cartesian4} cartesian The vector.
     * @param {Cartesian4} [result] The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided.
     *
     * @exception {DeveloperError} matrix is required.
     * @exception {DeveloperError} cartesian is required.
     */
    Matrix4.multiplyByVector = function(matrix, cartesian, result) {
        if (!defined(matrix)) {
            throw new DeveloperError('matrix is required');
        }
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required');
        }

        var vX = cartesian.x;
        var vY = cartesian.y;
        var vZ = cartesian.z;
        var vW = cartesian.w;

        var x = matrix[0] * vX + matrix[4] * vY + matrix[8] * vZ + matrix[12] * vW;
        var y = matrix[1] * vX + matrix[5] * vY + matrix[9] * vZ + matrix[13] * vW;
        var z = matrix[2] * vX + matrix[6] * vY + matrix[10] * vZ + matrix[14] * vW;
        var w = matrix[3] * vX + matrix[7] * vY + matrix[11] * vZ + matrix[15] * vW;

        if (!defined(result)) {
            return new Cartesian4(x, y, z, w);
        }
        result.x = x;
        result.y = y;
        result.z = z;
        result.w = w;
        return result;
    };

    var scratchPoint = new Cartesian4(0.0, 0.0, 0.0, 1.0);

    /**
     * Computes the product of a matrix and a {@link Cartesian3}.  This is equivalent to calling {@link Matrix4.multiplyByVector}
     * with a {@link Cartesian4} with a <code>w</code> component of one.
     * @memberof Matrix4
     *
     * @param {Matrix4} matrix The matrix.
     * @param {Cartesian3} cartesian The point.
     * @param {Cartesian4} [result] The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided.
     *
     * @exception {DeveloperError} cartesian is required.
     * @exception {DeveloperError} matrix is required.
     *
     * @example
     * Cartesian3 p = new Cartesian3(1.0, 2.0, 3.0);
     * Matrix4.multiplyByPoint(matrix, p, result);
     * // A shortcut for
     * //   Cartesian3 p = ...
     * //   Matrix4.multiplyByVector(matrix, new Cartesian4(p.x, p.y, p.z, 1.0), result);
     */
    Matrix4.multiplyByPoint = function(matrix, cartesian, result) {
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required');
        }

        scratchPoint.x = cartesian.x;
        scratchPoint.y = cartesian.y;
        scratchPoint.z = cartesian.z;
        // scratchPoint.w is one.  See above.

        return Matrix4.multiplyByVector(matrix, scratchPoint, result);
    };

    /**
     * Computes the product of a matrix and a scalar.
     * @memberof Matrix4
     *
     * @param {Matrix4} matrix The matrix.
     * @param {Number} scalar The number to multiply by.
     * @param {Matrix4} [result] The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter or a new Cartesian4 instance if one was not provided.
     *
     * @exception {DeveloperError} matrix is required.
     * @exception {DeveloperError} scalar is required and must be a number.
     *
     * @example
     * //create a Matrix4 instance which is a scaled version of the supplied Matrix4
     * // m = [10.0, 11.0, 12.0, 13.0]
     * //     [14.0, 15.0, 16.0, 17.0]
     * //     [18.0, 19.0, 20.0, 21.0]
     * //     [22.0, 23.0, 24.0, 25.0]
     *
     * var a = Matrix4.multiplyByScalar(m, -2);
     *
     * // m remains the same
     * // a = [-20.0, -22.0, -24.0, -26.0]
     * //     [-28.0, -30.0, -32.0, -34.0]
     * //     [-36.0, -38.0, -40.0, -42.0]
     * //     [-44.0, -46.0, -48.0, -50.0]
     *
     */
    Matrix4.multiplyByScalar = function(matrix, scalar, result) {
        if (!defined(matrix)) {
            throw new DeveloperError('matrix is required');
        }
        if (typeof scalar !== 'number') {
            throw new DeveloperError('scalar is required and must be a number');
        }

        if (!defined(result)) {
            return new Matrix4(matrix[0] * scalar, matrix[4] * scalar, matrix[8] * scalar, matrix[12] * scalar,
                               matrix[1] * scalar, matrix[5] * scalar, matrix[9] * scalar, matrix[13] * scalar,
                               matrix[2] * scalar, matrix[6] * scalar, matrix[10] * scalar, matrix[14] * scalar,
                               matrix[3] * scalar, matrix[7] * scalar, matrix[11] * scalar, matrix[15] * scalar);
        }
        result[0] = matrix[0] * scalar;
        result[1] = matrix[1] * scalar;
        result[2] = matrix[2] * scalar;
        result[3] = matrix[3] * scalar;
        result[4] = matrix[4] * scalar;
        result[5] = matrix[5] * scalar;
        result[6] = matrix[6] * scalar;
        result[7] = matrix[7] * scalar;
        result[8] = matrix[8] * scalar;
        result[9] = matrix[9] * scalar;
        result[10] = matrix[10] * scalar;
        result[11] = matrix[11] * scalar;
        result[12] = matrix[12] * scalar;
        result[13] = matrix[13] * scalar;
        result[14] = matrix[14] * scalar;
        result[15] = matrix[15] * scalar;
        return result;
    };

    /**
     * Computes a negated copy of the provided matrix.
     * @memberof Matrix4
     *
     * @param {Matrix4} matrix The matrix to negate.
     * @param {Matrix4} [result] The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if one was not provided.
     *
     * @exception {DeveloperError} matrix is required.
     *
     * @example
     * //create a new Matrix4 instance which is a negation of a Matrix4
     * // m = [10.0, 11.0, 12.0, 13.0]
     * //     [14.0, 15.0, 16.0, 17.0]
     * //     [18.0, 19.0, 20.0, 21.0]
     * //     [22.0, 23.0, 24.0, 25.0]
     *
     * var a = Matrix4.negate(m);
     *
     * // m remains the same
     * // a = [-10.0, -11.0, -12.0, -13.0]
     * //     [-14.0, -15.0, -16.0, -17.0]
     * //     [-18.0, -19.0, -20.0, -21.0]
     * //     [-22.0, -23.0, -24.0, -25.0]
     *
     */
    Matrix4.negate = function(matrix, result) {
        if (!defined(matrix)) {
            throw new DeveloperError('matrix is required');
        }

        if (!defined(result)) {
            return new Matrix4(-matrix[0], -matrix[4], -matrix[8], -matrix[12],
                               -matrix[1], -matrix[5], -matrix[9], -matrix[13],
                               -matrix[2], -matrix[6], -matrix[10], -matrix[14],
                               -matrix[3], -matrix[7], -matrix[11], -matrix[15]);
        }
        result[0] = -matrix[0];
        result[1] = -matrix[1];
        result[2] = -matrix[2];
        result[3] = -matrix[3];
        result[4] = -matrix[4];
        result[5] = -matrix[5];
        result[6] = -matrix[6];
        result[7] = -matrix[7];
        result[8] = -matrix[8];
        result[9] = -matrix[9];
        result[10] = -matrix[10];
        result[11] = -matrix[11];
        result[12] = -matrix[12];
        result[13] = -matrix[13];
        result[14] = -matrix[14];
        result[15] = -matrix[15];
        return result;
    };

    /**
     * Computes the transpose of the provided matrix.
     * @memberof Matrix4
     *
     * @param {Matrix4} matrix The matrix to transpose.
     * @param {Matrix4} [result] The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if one was not provided.
     *
     * @exception {DeveloperError} matrix is required.
     *
     * @example
     * //returns transpose of a Matrix4
     * // m = [10.0, 11.0, 12.0, 13.0]
     * //     [14.0, 15.0, 16.0, 17.0]
     * //     [18.0, 19.0, 20.0, 21.0]
     * //     [22.0, 23.0, 24.0, 25.0]
     *
     * var a = Matrix4.negate(m);
     *
     * // m remains the same
     * // a = [10.0, 14.0, 18.0, 22.0]
     * //     [11.0, 15.0, 19.0, 23.0]
     * //     [12.0, 16.0, 20.0, 24.0]
     * //     [13.0, 17.0, 21.0, 25.0]
     *
     */
    Matrix4.transpose = function(matrix, result) {
        if (!defined(matrix)) {
            throw new DeveloperError('matrix is required');
        }
        if (!defined(result)) {
            return new Matrix4(matrix[0], matrix[1], matrix[2], matrix[3],
                               matrix[4], matrix[5], matrix[6], matrix[7],
                               matrix[8], matrix[9], matrix[10], matrix[11],
                               matrix[12], matrix[13], matrix[14], matrix[15]);
        }

        var matrix1 = matrix[1];
        var matrix2 = matrix[2];
        var matrix3 = matrix[3];
        var matrix6 = matrix[6];
        var matrix7 = matrix[7];
        var matrix11 = matrix[11];

        result[0] = matrix[0];
        result[1] = matrix[4];
        result[2] = matrix[8];
        result[3] = matrix[12];
        result[4] = matrix1;
        result[5] = matrix[5];
        result[6] = matrix[9];
        result[7] = matrix[13];
        result[8] = matrix2;
        result[9] = matrix6;
        result[10] = matrix[10];
        result[11] = matrix[14];
        result[12] = matrix3;
        result[13] = matrix7;
        result[14] = matrix11;
        result[15] = matrix[15];
        return result;
    };

    /**
     * Compares the provided matrices componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     * @memberof Matrix4
     *
     * @param {Matrix4} [left] The first matrix.
     * @param {Matrix4} [right] The second matrix.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     *
     * @example
     * //compares two Matrix4 instances
     *
     * // a = [10.0, 14.0, 18.0, 22.0]
     * //     [11.0, 15.0, 19.0, 23.0]
     * //     [12.0, 16.0, 20.0, 24.0]
     * //     [13.0, 17.0, 21.0, 25.0]
     *
     * // b = [10.0, 14.0, 18.0, 22.0]
     * //     [11.0, 15.0, 19.0, 23.0]
     * //     [12.0, 16.0, 20.0, 24.0]
     * //     [13.0, 17.0, 21.0, 25.0]
     *
     * if(Matrix4.equals(a,b)) {
     *      console.log("Both matrices are equal");
     * } else {
     *      console.log("They are not equal");
     * }
     *
     * //Prints "Both matrices are equal" on the console
     *
     */
    Matrix4.equals = function(left, right) {
        return (left === right) ||
               (defined(left) &&
                defined(right) &&
                left[0] === right[0] &&
                left[1] === right[1] &&
                left[2] === right[2] &&
                left[3] === right[3] &&
                left[4] === right[4] &&
                left[5] === right[5] &&
                left[6] === right[6] &&
                left[7] === right[7] &&
                left[8] === right[8] &&
                left[9] === right[9] &&
                left[10] === right[10] &&
                left[11] === right[11] &&
                left[12] === right[12] &&
                left[13] === right[13] &&
                left[14] === right[14] &&
                left[15] === right[15]);
    };

    /**
     * Compares the provided matrices componentwise and returns
     * <code>true</code> if they are within the provided epsilon,
     * <code>false</code> otherwise.
     * @memberof Matrix4
     *
     * @param {Matrix4} [left] The first matrix.
     * @param {Matrix4} [right] The second matrix.
     * @param {Number} epsilon The epsilon to use for equality testing.
     * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
     *
     * @exception {DeveloperError} epsilon is required and must be a number.
     *
     * @example
     * //compares two Matrix4 instances
     *
     * // a = [10.5, 14.5, 18.5, 22.5]
     * //     [11.5, 15.5, 19.5, 23.5]
     * //     [12.5, 16.5, 20.5, 24.5]
     * //     [13.5, 17.5, 21.5, 25.5]
     *
     * // b = [10.0, 14.0, 18.0, 22.0]
     * //     [11.0, 15.0, 19.0, 23.0]
     * //     [12.0, 16.0, 20.0, 24.0]
     * //     [13.0, 17.0, 21.0, 25.0]
     *
     * if(Matrix4.equalsEpsilon(a,b,0.1)){
     *      console.log("Difference between both the matrices is less than 0.1");
     * } else {
     *      console.log("Difference between both the matrices is not less than 0.1");
     * }
     *
     * //Prints "Difference between both the matrices is not less than 0.1" on the console
     *
     */
    Matrix4.equalsEpsilon = function(left, right, epsilon) {
        if (typeof epsilon !== 'number') {
            throw new DeveloperError('epsilon is required and must be a number');
        }

        return (left === right) ||
                (defined(left) &&
                defined(right) &&
                Math.abs(left[0] - right[0]) <= epsilon &&
                Math.abs(left[1] - right[1]) <= epsilon &&
                Math.abs(left[2] - right[2]) <= epsilon &&
                Math.abs(left[3] - right[3]) <= epsilon &&
                Math.abs(left[4] - right[4]) <= epsilon &&
                Math.abs(left[5] - right[5]) <= epsilon &&
                Math.abs(left[6] - right[6]) <= epsilon &&
                Math.abs(left[7] - right[7]) <= epsilon &&
                Math.abs(left[8] - right[8]) <= epsilon &&
                Math.abs(left[9] - right[9]) <= epsilon &&
                Math.abs(left[10] - right[10]) <= epsilon &&
                Math.abs(left[11] - right[11]) <= epsilon &&
                Math.abs(left[12] - right[12]) <= epsilon &&
                Math.abs(left[13] - right[13]) <= epsilon &&
                Math.abs(left[14] - right[14]) <= epsilon &&
                Math.abs(left[15] - right[15]) <= epsilon);
    };

    /**
     * Gets the translation portion of the provided matrix, assuming the matrix is a affine transformation matrix.
     * @memberof Matrix4
     *
     * @param {Matrix4} matrix The matrix to use.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
     *
     * @exception {DeveloperError} matrix is required.
     *
     * @see Cartesian3
     */
    Matrix4.getTranslation = function(matrix, result) {
        if (!defined(matrix)) {
            throw new DeveloperError('matrix is required');
        }
        if (!defined(result)) {
            return new Cartesian3(matrix[12], matrix[13], matrix[14]);
        }
        result.x = matrix[12];
        result.y = matrix[13];
        result.z = matrix[14];
        return result;
    };

    /**
     * Gets the upper left 3x3 rotation matrix of the provided matrix, assuming the matrix is a affine transformation matrix.
     * @memberof Matrix4
     *
     * @param {Matrix4} matrix The matrix to use.
     * @param {Matrix3} [result] The object onto which to store the result.
     * @returns {Matrix3} The modified result parameter or a new Cartesian3 instance if one was not provided.
     *
     * @exception {DeveloperError} matrix is required.
     *
     * @see Matrix3
     *
     * @example
     * // returns a Matrix3 instance from a Matrix4 instance
     *
     * // m = [10.0, 14.0, 18.0, 22.0]
     * //     [11.0, 15.0, 19.0, 23.0]
     * //     [12.0, 16.0, 20.0, 24.0]
     * //     [13.0, 17.0, 21.0, 25.0]
     *
     * var b = new Matrix3();
     * Matrix4.getRotation(m,b);
     *
     * // b = [10.0, 14.0, 18.0]
     * //     [11.0, 15.0, 19.0]
     * //     [12.0, 16.0, 20.0]
     *
     */
    Matrix4.getRotation = function(matrix, result) {
        if (!defined(matrix)) {
            throw new DeveloperError('matrix is required');
        }
        if (!defined(result)) {
            return new Matrix3(matrix[0], matrix[4], matrix[8],
                               matrix[1], matrix[5], matrix[9],
                               matrix[2], matrix[6], matrix[10]);
        }
        result[0] = matrix[0];
        result[1] = matrix[1];
        result[2] = matrix[2];
        result[3] = matrix[4];
        result[4] = matrix[5];
        result[5] = matrix[6];
        result[6] = matrix[8];
        result[7] = matrix[9];
        result[8] = matrix[10];
        return result;
    };

     /**
      * Computes the inverse of the provided matrix using Cramers Rule.
      * If the determinant is zero, the matrix can not be inverted, and an exception is thrown.
      * If the matrix is an affine transformation matrix, it is more efficient
      * to invert it with {@link #inverseTransformation}.
      * @memberof Matrix4
      *
      * @param {Matrix4} matrix The matrix to invert.
      * @param {Matrix4} [result] The object onto which to store the result.
      * @returns {Matrix4} The modified result parameter or a new Cartesian3 instance if one was not provided.
      *
      * @exception {DeveloperError} matrix is required.
      * @exception {RuntimeError} matrix is not invertible because its determinate is zero.
      */
    Matrix4.inverse = function(matrix, result) {
        if (!defined(matrix)) {
            throw new DeveloperError('matrix is required');
        }

        //
        // Ported from:
        //   ftp://download.intel.com/design/PentiumIII/sml/24504301.pdf
        //
        var src0 = matrix[0];
        var src1 = matrix[4];
        var src2 = matrix[8];
        var src3 = matrix[12];
        var src4 = matrix[1];
        var src5 = matrix[5];
        var src6 = matrix[9];
        var src7 = matrix[13];
        var src8 = matrix[2];
        var src9 = matrix[6];
        var src10 = matrix[10];
        var src11 = matrix[14];
        var src12 = matrix[3];
        var src13 = matrix[7];
        var src14 = matrix[11];
        var src15 = matrix[15];

        // calculate pairs for first 8 elements (cofactors)
        var tmp0 = src10 * src15;
        var tmp1 = src11 * src14;
        var tmp2 = src9 * src15;
        var tmp3 = src11 * src13;
        var tmp4 = src9 * src14;
        var tmp5 = src10 * src13;
        var tmp6 = src8 * src15;
        var tmp7 = src11 * src12;
        var tmp8 = src8 * src14;
        var tmp9 = src10 * src12;
        var tmp10 = src8 * src13;
        var tmp11 = src9 * src12;

        // calculate first 8 elements (cofactors)
        var dst0 = (tmp0 * src5 + tmp3 * src6 + tmp4 * src7) - (tmp1 * src5 + tmp2 * src6 + tmp5 * src7);
        var dst1 = (tmp1 * src4 + tmp6 * src6 + tmp9 * src7) - (tmp0 * src4 + tmp7 * src6 + tmp8 * src7);
        var dst2 = (tmp2 * src4 + tmp7 * src5 + tmp10 * src7) - (tmp3 * src4 + tmp6 * src5 + tmp11 * src7);
        var dst3 = (tmp5 * src4 + tmp8 * src5 + tmp11 * src6) - (tmp4 * src4 + tmp9 * src5 + tmp10 * src6);
        var dst4 = (tmp1 * src1 + tmp2 * src2 + tmp5 * src3) - (tmp0 * src1 + tmp3 * src2 + tmp4 * src3);
        var dst5 = (tmp0 * src0 + tmp7 * src2 + tmp8 * src3) - (tmp1 * src0 + tmp6 * src2 + tmp9 * src3);
        var dst6 = (tmp3 * src0 + tmp6 * src1 + tmp11 * src3) - (tmp2 * src0 + tmp7 * src1 + tmp10 * src3);
        var dst7 = (tmp4 * src0 + tmp9 * src1 + tmp10 * src2) - (tmp5 * src0 + tmp8 * src1 + tmp11 * src2);

        // calculate pairs for second 8 elements (cofactors)
        tmp0 = src2 * src7;
        tmp1 = src3 * src6;
        tmp2 = src1 * src7;
        tmp3 = src3 * src5;
        tmp4 = src1 * src6;
        tmp5 = src2 * src5;
        tmp6 = src0 * src7;
        tmp7 = src3 * src4;
        tmp8 = src0 * src6;
        tmp9 = src2 * src4;
        tmp10 = src0 * src5;
        tmp11 = src1 * src4;

        // calculate second 8 elements (cofactors)
        var dst8 = (tmp0 * src13 + tmp3 * src14 + tmp4 * src15) - (tmp1 * src13 + tmp2 * src14 + tmp5 * src15);
        var dst9 = (tmp1 * src12 + tmp6 * src14 + tmp9 * src15) - (tmp0 * src12 + tmp7 * src14 + tmp8 * src15);
        var dst10 = (tmp2 * src12 + tmp7 * src13 + tmp10 * src15) - (tmp3 * src12 + tmp6 * src13 + tmp11 * src15);
        var dst11 = (tmp5 * src12 + tmp8 * src13 + tmp11 * src14) - (tmp4 * src12 + tmp9 * src13 + tmp10 * src14);
        var dst12 = (tmp2 * src10 + tmp5 * src11 + tmp1 * src9) - (tmp4 * src11 + tmp0 * src9 + tmp3 * src10);
        var dst13 = (tmp8 * src11 + tmp0 * src8 + tmp7 * src10) - (tmp6 * src10 + tmp9 * src11 + tmp1 * src8);
        var dst14 = (tmp6 * src9 + tmp11 * src11 + tmp3 * src8) - (tmp10 * src11 + tmp2 * src8 + tmp7 * src9);
        var dst15 = (tmp10 * src10 + tmp4 * src8 + tmp9 * src9) - (tmp8 * src9 + tmp11 * src10 + tmp5 * src8);

        // calculate determinant
        var det = src0 * dst0 + src1 * dst1 + src2 * dst2 + src3 * dst3;

        if (Math.abs(det) < CesiumMath.EPSILON20) {
            throw new RuntimeError('matrix is not invertible because its determinate is zero.');
        }

        // calculate matrix inverse
        det = 1.0 / det;
        if (!defined(result)) {
            return new Matrix4(dst0 * det, dst4 * det, dst8 * det, dst12 * det,
                               dst1 * det, dst5 * det, dst9 * det, dst13 * det,
                               dst2 * det, dst6 * det, dst10 * det, dst14 * det,
                               dst3 * det, dst7 * det, dst11 * det, dst15 * det);
        }

        result[0] = dst0 * det;
        result[1] = dst1 * det;
        result[2] = dst2 * det;
        result[3] = dst3 * det;
        result[4] = dst4 * det;
        result[5] = dst5 * det;
        result[6] = dst6 * det;
        result[7] = dst7 * det;
        result[8] = dst8 * det;
        result[9] = dst9 * det;
        result[10] = dst10 * det;
        result[11] = dst11 * det;
        result[12] = dst12 * det;
        result[13] = dst13 * det;
        result[14] = dst14 * det;
        result[15] = dst15 * det;
        return result;
    };

    /**
     * Computes the inverse of the provided matrix assuming it is
     * an affine transformation matrix, where the upper left 3x3 elements
     * are a rotation matrix, and the upper three elements in the fourth
     * column are the translation.  The bottom row is assumed to be [0, 0, 0, 1].
     * The matrix is not verified to be in the proper form.
     * This method is faster than computing the inverse for a general 4x4
     * matrix using {@link #inverse}.
     * @memberof Matrix4
     *
     * @param {Matrix4} matrix The matrix to invert.
     * @param {Matrix4} [result] The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter or a new Cartesian3 instance if one was not provided.
     *
     * @exception {DeveloperError} matrix is required.
     */
    Matrix4.inverseTransformation = function(matrix, result) {
        if (!defined(matrix)) {
            throw new DeveloperError('matrix is required');
        }

        //This function is an optimized version of the below 4 lines.
        //var rT = Matrix3.transpose(Matrix4.getRotation(matrix));
        //var rTN = Matrix3.negate(rT);
        //var rTT = Matrix3.multiplyByVector(rTN, Matrix4.getTranslation(matrix));
        //return Matrix4.fromRotationTranslation(rT, rTT, result);

        var matrix0 = matrix[0];
        var matrix1 = matrix[1];
        var matrix2 = matrix[2];
        var matrix4 = matrix[4];
        var matrix5 = matrix[5];
        var matrix6 = matrix[6];
        var matrix8 = matrix[8];
        var matrix9 = matrix[9];
        var matrix10 = matrix[10];

        var vX = matrix[12];
        var vY = matrix[13];
        var vZ = matrix[14];

        var x = -matrix0 * vX - matrix1 * vY - matrix2 * vZ;
        var y = -matrix4 * vX - matrix5 * vY - matrix6 * vZ;
        var z = -matrix8 * vX - matrix9 * vY - matrix10 * vZ;

        if (!defined(result)) {
            return new Matrix4(matrix0, matrix1, matrix2,  x,
                               matrix4, matrix5, matrix6,  y,
                               matrix8, matrix9, matrix10, z,
                               0.0,         0.0,      0.0, 1.0);
        }
        result[0] = matrix0;
        result[1] = matrix4;
        result[2] = matrix8;
        result[3] = 0.0;
        result[4] = matrix1;
        result[5] = matrix5;
        result[6] = matrix9;
        result[7] = 0.0;
        result[8] = matrix2;
        result[9] = matrix6;
        result[10] = matrix10;
        result[11] = 0.0;
        result[12] = x;
        result[13] = y;
        result[14] = z;
        result[15] = 1.0;
        return result;
    };

    /**
     * An immutable Matrix4 instance initialized to the identity matrix.
     * @memberof Matrix4
     */
    Matrix4.IDENTITY = freezeObject(new Matrix4(1.0, 0.0, 0.0, 0.0,
                                                0.0, 1.0, 0.0, 0.0,
                                                0.0, 0.0, 1.0, 0.0,
                                                0.0, 0.0, 0.0, 1.0));

    /**
     * The index into Matrix4 for column 0, row 0.
     * @memberof Matrix4
     */
    Matrix4.COLUMN0ROW0 = 0;

    /**
     * The index into Matrix4 for column 0, row 1.
     * @memberof Matrix4
     */
    Matrix4.COLUMN0ROW1 = 1;

    /**
     * The index into Matrix4 for column 0, row 2.
     * @memberof Matrix4
     */
    Matrix4.COLUMN0ROW2 = 2;

    /**
     * The index into Matrix4 for column 0, row 3.
     * @memberof Matrix4
     */
    Matrix4.COLUMN0ROW3 = 3;

    /**
     * The index into Matrix4 for column 1, row 0.
     * @memberof Matrix4
     */
    Matrix4.COLUMN1ROW0 = 4;

    /**
     * The index into Matrix4 for column 1, row 1.
     * @memberof Matrix4
     */
    Matrix4.COLUMN1ROW1 = 5;

    /**
     * The index into Matrix4 for column 1, row 2.
     * @memberof Matrix4
     */
    Matrix4.COLUMN1ROW2 = 6;

    /**
     * The index into Matrix4 for column 1, row 3.
     * @memberof Matrix4
     */
    Matrix4.COLUMN1ROW3 = 7;

    /**
     * The index into Matrix4 for column 2, row 0.
     * @memberof Matrix4
     */
    Matrix4.COLUMN2ROW0 = 8;

    /**
     * The index into Matrix4 for column 2, row 1.
     * @memberof Matrix4
     */
    Matrix4.COLUMN2ROW1 = 9;

    /**
     * The index into Matrix4 for column 2, row 2.
     * @memberof Matrix4
     */
    Matrix4.COLUMN2ROW2 = 10;

    /**
     * The index into Matrix4 for column 2, row 3.
     * @memberof Matrix4
     */
    Matrix4.COLUMN2ROW3 = 11;

    /**
     * The index into Matrix4 for column 3, row 0.
     * @memberof Matrix4
     */
    Matrix4.COLUMN3ROW0 = 12;

    /**
     * The index into Matrix4 for column 3, row 1.
     * @memberof Matrix4
     */
    Matrix4.COLUMN3ROW1 = 13;

    /**
     * The index into Matrix4 for column 3, row 2.
     * @memberof Matrix4
     */
    Matrix4.COLUMN3ROW2 = 14;

    /**
     * The index into Matrix4 for column 3, row 3.
     * @memberof Matrix4
     */
    Matrix4.COLUMN3ROW3 = 15;

    /**
     * Duplicates the provided Matrix4 instance.
     * @memberof Matrix4
     *
     * @param {Matrix4} [result] The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if one was not provided.
     */
    Matrix4.prototype.clone = function(result) {
        return Matrix4.clone(this, result);
    };

    /**
     * Computes an Array from this Matrix4 instance.
     * @memberof Matrix4
     *
     * @param {Array} [result] The Array onto which to store the result.
     * @returns {Array} The modified Array parameter or a new Array instance if one was not provided.
     */
    Matrix4.prototype.toArray = function(result) {
        return Matrix4.toArray(this, result);
    };

    /**
     * Retrieves a copy of the matrix column at the provided index as a Cartesian4 instance.
     * @memberof Matrix4
     *
     * @param {Number} index The zero-based index of the column to retrieve.
     * @param {Cartesian4} [result] The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided.
     *
     * @exception {DeveloperError} index is required and must be 0, 1, 2, or 3.
     *
     * @see Cartesian4
     */
    Matrix4.prototype.getColumn = function(index, result) {
        return Matrix4.getColumn(this, index, result);
    };

    /**
     * Computes a new matrix that replaces the specified column in this matrix with the provided Cartesian4 instance.
     * @memberof Matrix4
     *
     * @param {Number} index The zero-based index of the column to set.
     * @param {Cartesian4} cartesian The Cartesian whose values will be assigned to the specified column.
     *
     * @exception {DeveloperError} cartesian is required.
     * @exception {DeveloperError} index is required and must be 0, 1, 2, or 3.
     *
     * @see Cartesian4
     */
    Matrix4.prototype.setColumn = function(index, cartesian, result) {
        return Matrix4.setColumn(this, index, cartesian, result);
    };

    /**
     * Retrieves a copy of the matrix row at the provided index as a Cartesian4 instance.
     * @memberof Matrix4
     *
     * @param {Number} index The zero-based index of the row to retrieve.
     * @param {Cartesian4} [result] The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided.
     *
     * @exception {DeveloperError} index is required and must be 0, 1, 2, or 3.
     *
     * @see Cartesian4
     */
    Matrix4.prototype.getRow = function(index, result) {
        return Matrix4.getRow(this, index, result);
    };

    /**
     * Computes a new matrix that replaces the specified row in this matrix with the provided Cartesian4 instance.
     * @memberof Matrix4
     *
     * @param {Number} index The zero-based index of the row to set.
     * @param {Cartesian4} cartesian The Cartesian whose values will be assigned to the specified row.
     *
     * @exception {DeveloperError} cartesian is required.
     * @exception {DeveloperError} index is required and must be 0, 1, 2, or 3.
     *
     * @see Cartesian4
     */
    Matrix4.prototype.setRow = function(index, cartesian, result) {
        return Matrix4.setRow(this, index, cartesian, result);
    };

    /**
     * Computes the product of this matrix and the provided matrix.
     * @memberof Matrix4
     *
     * @param {Matrix4} right The right hand side matrix.
     * @param {Matrix4} [result] The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if one was not provided.
     *
     * @exception {DeveloperError} right is required.
     */
    Matrix4.prototype.multiply = function(right, result) {
        return Matrix4.multiply(this, right, result);
    };

    /**
     * Multiplies this matrix, assuming it is a transformation matrix (with a bottom row of
     * <code>[0.0, 0.0, 0.0, 1.0]</code>), by an implicit translation matrix defined by a {@link Cartesian3}.
     *
     * @memberof Matrix4
     *
     * @param {Cartesian3} translation The translation on the right-hand side of the multiplication.
     * @param {Matrix4} [result] The object onto which to store the result.
     *
     * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if one was not provided.
     *
     * @exception {DeveloperError} translation is required.
     */
    Matrix4.prototype.multiplyByTranslation = function(translation, result) {
        return Matrix4.multiplyByTranslation(this, translation, result);
    };

    /**
     * Multiplies this matrix, assuming it is a transformation matrix (with a bottom row of
     * <code>[0.0, 0.0, 0.0, 1.0]</code>), by an implicit uniform scale matrix.
     *
     * @memberof Matrix4
     *
     * @param {Number} scale The scale on the right-hand side of the multiplication.
     * @param {Matrix4} [result] The object onto which to store the result.
     *
     * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if one was not provided.
     *
     * @exception {DeveloperError} scale is required.
     */
    Matrix4.prototype.multiplyByUniformScale = function(scale, result) {
        return Matrix4.multiplyByUniformScale(this, scale, result);
    };

    /**
     * Computes the product of this matrix and a column vector.
     * @memberof Matrix4
     *
     * @param {Cartesian4} cartesian The vector.
     * @param {Cartesian4} [result] The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided.
     *
     * @exception {DeveloperError} cartesian is required.
     */
    Matrix4.prototype.multiplyByVector = function(cartesian, result) {
        return Matrix4.multiplyByVector(this, cartesian, result);
    };

    /**
     * Computes the product of a matrix and a {@link Cartesian3}.  This is equivalent to calling {@link Matrix4#multiplyByVector}
     * with a {@link Cartesian4} with a <code>w</code> component of one.
     * @memberof Matrix4
     *
     * @param {Cartesian3} cartesian The point.
     * @param {Cartesian4} [result] The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided.
     *
     * @exception {DeveloperError} cartesian is required.
     */
    Matrix4.prototype.multiplyByPoint = function(cartesian, result) {
        return Matrix4.multiplyByPoint(this, cartesian, result);
    };

    /**
     * Computes the product of this matrix and a scalar.
     * @memberof Matrix4
     *
     * @param {Number} scalar The number to multiply by.
     * @param {Matrix4} [result] The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter or a new Cartesian4 instance if one was not provided.
     *
     * @exception {DeveloperError} scalar is required and must be a number.
     */
    Matrix4.prototype.multiplyByScalar = function(scalar, result) {
        return Matrix4.multiplyByScalar(this, scalar, result);
    };
    /**
     * Computes a negated copy of this matrix.
     * @memberof Matrix4
     *
     * @param {Matrix4} matrix The matrix to negate.
     * @param {Matrix4} [result] The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if one was not provided.
     *
     * @exception {DeveloperError} matrix is required.
     */
    Matrix4.prototype.negate = function(result) {
        return Matrix4.negate(this, result);
    };

    /**
     * Computes the transpose of this matrix.
     * @memberof Matrix4
     *
     * @param {Matrix4} [result] The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if one was not provided.
     */
    Matrix4.prototype.transpose = function(result) {
        return Matrix4.transpose(this, result);
    };

    /**
     * Compares this matrix to the provided matrix componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     * @memberof Matrix4
     *
     * @param {Matrix4} [right] The right hand side matrix.
     * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
     */
    Matrix4.prototype.equals = function(right) {
        return Matrix4.equals(this, right);
    };

    /**
     * Compares this matrix to the provided matrix componentwise and returns
     * <code>true</code> if they are within the provided epsilon,
     * <code>false</code> otherwise.
     * @memberof Matrix4
     *
     * @param {Matrix4} [right] The right hand side matrix.
     * @param {Number} epsilon The epsilon to use for equality testing.
     * @returns {Boolean} <code>true</code> if they are within the provided epsilon, <code>false</code> otherwise.
     *
     * @exception {DeveloperError} epsilon is required and must be a number.
     */
    Matrix4.prototype.equalsEpsilon = function(right, epsilon) {
        return Matrix4.equalsEpsilon(this, right, epsilon);
    };

    /**
     * Computes a string representing this Matrix with each row being
     * on a separate line and in the format '(column0, column1, column2, column3)'.
     * @memberof Matrix4
     *
     * @returns {String} A string representing the provided Matrix with each row being on a separate line and in the format '(column0, column1, column2, column3)'.
     */
    Matrix4.prototype.toString = function() {
        return '(' + this[0] + ', ' + this[4] + ', ' + this[8] + ', ' + this[12] +')\n' +
               '(' + this[1] + ', ' + this[5] + ', ' + this[9] + ', ' + this[13] +')\n' +
               '(' + this[2] + ', ' + this[6] + ', ' + this[10] + ', ' + this[14] +')\n' +
               '(' + this[3] + ', ' + this[7] + ', ' + this[11] + ', ' + this[15] +')';
    };

    /**
     * Gets the translation portion of this matrix, assuming the matrix is a affine transformation matrix.
     * @memberof Matrix4
     *
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
     *
     * @see Cartesian3
     */
    Matrix4.prototype.getTranslation = function(result) {
        return Matrix4.getTranslation(this, result);
    };

    /**
     * Gets the upper left 3x3 rotation matrix of this matrix, assuming the matrix is a affine transformation matrix.
     * @memberof Matrix4
     *
     * @param {Matrix3} [result] The object onto which to store the result.
     * @returns {Matrix3} The modified result parameter or a new Cartesian3 instance if one was not provided.
     *
     * @see Matrix3
     */
    Matrix4.prototype.getRotation = function(result) {
        return Matrix4.getRotation(this, result);
    };

    /**
     * Computes the inverse of this matrix using Cramers Rule.
     * If the determinant is zero, the matrix can not be inverted, and an exception is thrown.
     * If the matrix is an affine transformation matrix, it is more efficient
     * to invert it with {@link #inverseTransformation}.
     * @memberof Matrix4
     *
     * @param {Matrix4} [result] The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter or a new Cartesian3 instance if one was not provided.
     *
     * @exception {RuntimeError} matrix is not invertible because its determinate is zero.
     */
    Matrix4.prototype.inverse = function(result) {
        return Matrix4.inverse(this, result);
    };

    /**
     * Computes the inverse of this matrix assuming it is
     * an affine transformation matrix, where the upper left 3x3 elements
     * are a rotation matrix, and the upper three elements in the fourth
     * column are the translation.  The bottom row is assumed to be [0, 0, 0, 1].
     * The matrix is not verified to be in the proper form.
     * This method is faster than computing the inverse for a general 4x4
     * matrix using {@link #inverse}.
     * @memberof Matrix4
     *
     * @param {Matrix4} [result] The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter or a new Cartesian3 instance if one was not provided.
     */
    Matrix4.prototype.inverseTransformation = function(result) {
        return Matrix4.inverseTransformation(this, result);
    };

    return Matrix4;
});

/*global define*/
define('Core/BoundingSphere',[
        './defaultValue',
        './defined',
        './DeveloperError',
        './Cartesian3',
        './Cartesian4',
        './Cartographic',
        './Ellipsoid',
        './GeographicProjection',
        './Intersect',
        './Interval',
        './Matrix4'
    ], function(
        defaultValue,
        defined,
        DeveloperError,
        Cartesian3,
        Cartesian4,
        Cartographic,
        Ellipsoid,
        GeographicProjection,
        Intersect,
        Interval,
        Matrix4) {
    "use strict";

    /**
     * A bounding sphere with a center and a radius.
     * @alias BoundingSphere
     * @constructor
     *
     * @param {Cartesian3} [center=Cartesian3.ZERO] The center of the bounding sphere.
     * @param {Number} [radius=0.0] The radius of the bounding sphere.
     *
     * @see AxisAlignedBoundingBox
     * @see BoundingRectangle
     */
    var BoundingSphere = function(center, radius) {
        /**
         * The center point of the sphere.
         * @type {Cartesian3}
         * @default {@link Cartesian3.ZERO}
         */
        this.center = Cartesian3.clone(defaultValue(center, Cartesian3.ZERO));

        /**
         * The radius of the sphere.
         * @type {Number}
         * @default 0.0
         */
        this.radius = defaultValue(radius, 0.0);
    };

    var fromPointsXMin = new Cartesian3();
    var fromPointsYMin = new Cartesian3();
    var fromPointsZMin = new Cartesian3();
    var fromPointsXMax = new Cartesian3();
    var fromPointsYMax = new Cartesian3();
    var fromPointsZMax = new Cartesian3();
    var fromPointsCurrentPos = new Cartesian3();
    var fromPointsScratch = new Cartesian3();
    var fromPointsRitterCenter = new Cartesian3();
    var fromPointsMinBoxPt = new Cartesian3();
    var fromPointsMaxBoxPt = new Cartesian3();
    var fromPointsNaiveCenterScratch = new Cartesian3();

    /**
     * Computes a tight-fitting bounding sphere enclosing a list of 3D Cartesian points.
     * The bounding sphere is computed by running two algorithms, a naive algorithm and
     * Ritter's algorithm. The smaller of the two spheres is used to ensure a tight fit.
     * @memberof BoundingSphere
     *
     * @param {Array} positions An array of points that the bounding sphere will enclose.  Each point must have <code>x</code>, <code>y</code>, and <code>z</code> properties.
     * @param {BoundingSphere} [result] The object onto which to store the result.
     * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if one was not provided.
     *
     * @see <a href='http://blogs.agi.com/insight3d/index.php/2008/02/04/a-bounding/'>Bounding Sphere computation article</a>
     */
    BoundingSphere.fromPoints = function(positions, result) {
        if (!defined(result)) {
            result = new BoundingSphere();
        }

        if (!defined(positions) || positions.length === 0) {
            result.center = Cartesian3.clone(Cartesian3.ZERO, result.center);
            result.radius = 0.0;
            return result;
        }

        var currentPos = Cartesian3.clone(positions[0], fromPointsCurrentPos);

        var xMin = Cartesian3.clone(currentPos, fromPointsXMin);
        var yMin = Cartesian3.clone(currentPos, fromPointsYMin);
        var zMin = Cartesian3.clone(currentPos, fromPointsZMin);

        var xMax = Cartesian3.clone(currentPos, fromPointsXMax);
        var yMax = Cartesian3.clone(currentPos, fromPointsYMax);
        var zMax = Cartesian3.clone(currentPos, fromPointsZMax);

        var numPositions = positions.length;
        for ( var i = 1; i < numPositions; i++) {
            Cartesian3.clone(positions[i], currentPos);

            var x = currentPos.x;
            var y = currentPos.y;
            var z = currentPos.z;

            // Store points containing the the smallest and largest components
            if (x < xMin.x) {
                Cartesian3.clone(currentPos, xMin);
            }

            if (x > xMax.x) {
                Cartesian3.clone(currentPos, xMax);
            }

            if (y < yMin.y) {
                Cartesian3.clone(currentPos, yMin);
            }

            if (y > yMax.y) {
                Cartesian3.clone(currentPos, yMax);
            }

            if (z < zMin.z) {
                Cartesian3.clone(currentPos, zMin);
            }

            if (z > zMax.z) {
                Cartesian3.clone(currentPos, zMax);
            }
        }

        // Compute x-, y-, and z-spans (Squared distances b/n each component's min. and max.).
        var xSpan = Cartesian3.magnitudeSquared(Cartesian3.subtract(xMax, xMin, fromPointsScratch));
        var ySpan = Cartesian3.magnitudeSquared(Cartesian3.subtract(yMax, yMin, fromPointsScratch));
        var zSpan = Cartesian3.magnitudeSquared(Cartesian3.subtract(zMax, zMin, fromPointsScratch));

        // Set the diameter endpoints to the largest span.
        var diameter1 = xMin;
        var diameter2 = xMax;
        var maxSpan = xSpan;
        if (ySpan > maxSpan) {
            maxSpan = ySpan;
            diameter1 = yMin;
            diameter2 = yMax;
        }
        if (zSpan > maxSpan) {
            maxSpan = zSpan;
            diameter1 = zMin;
            diameter2 = zMax;
        }

        // Calculate the center of the initial sphere found by Ritter's algorithm
        var ritterCenter = fromPointsRitterCenter;
        ritterCenter.x = (diameter1.x + diameter2.x) * 0.5;
        ritterCenter.y = (diameter1.y + diameter2.y) * 0.5;
        ritterCenter.z = (diameter1.z + diameter2.z) * 0.5;

        // Calculate the radius of the initial sphere found by Ritter's algorithm
        var radiusSquared = Cartesian3.magnitudeSquared(Cartesian3.subtract(diameter2, ritterCenter, fromPointsScratch));
        var ritterRadius = Math.sqrt(radiusSquared);

        // Find the center of the sphere found using the Naive method.
        var minBoxPt = fromPointsMinBoxPt;
        minBoxPt.x = xMin.x;
        minBoxPt.y = yMin.y;
        minBoxPt.z = zMin.z;

        var maxBoxPt = fromPointsMaxBoxPt;
        maxBoxPt.x = xMax.x;
        maxBoxPt.y = yMax.y;
        maxBoxPt.z = zMax.z;

        var naiveCenter = Cartesian3.multiplyByScalar(Cartesian3.add(minBoxPt, maxBoxPt, fromPointsScratch), 0.5, fromPointsNaiveCenterScratch);

        // Begin 2nd pass to find naive radius and modify the ritter sphere.
        var naiveRadius = 0;
        for (i = 0; i < numPositions; i++) {
            Cartesian3.clone(positions[i], currentPos);

            // Find the furthest point from the naive center to calculate the naive radius.
            var r = Cartesian3.magnitude(Cartesian3.subtract(currentPos, naiveCenter, fromPointsScratch));
            if (r > naiveRadius) {
                naiveRadius = r;
            }

            // Make adjustments to the Ritter Sphere to include all points.
            var oldCenterToPointSquared = Cartesian3.magnitudeSquared(Cartesian3.subtract(currentPos, ritterCenter, fromPointsScratch));
            if (oldCenterToPointSquared > radiusSquared) {
                var oldCenterToPoint = Math.sqrt(oldCenterToPointSquared);
                // Calculate new radius to include the point that lies outside
                ritterRadius = (ritterRadius + oldCenterToPoint) * 0.5;
                radiusSquared = ritterRadius * ritterRadius;
                // Calculate center of new Ritter sphere
                var oldToNew = oldCenterToPoint - ritterRadius;
                ritterCenter.x = (ritterRadius * ritterCenter.x + oldToNew * currentPos.x) / oldCenterToPoint;
                ritterCenter.y = (ritterRadius * ritterCenter.y + oldToNew * currentPos.y) / oldCenterToPoint;
                ritterCenter.z = (ritterRadius * ritterCenter.z + oldToNew * currentPos.z) / oldCenterToPoint;
            }
        }

        if (ritterRadius < naiveRadius) {
            Cartesian3.clone(ritterCenter, result.center);
            result.radius = ritterRadius;
        } else {
            Cartesian3.clone(naiveCenter, result.center);
            result.radius = naiveRadius;
        }

        return result;
    };

    var defaultProjection = new GeographicProjection();
    var fromExtent2DLowerLeft = new Cartesian3();
    var fromExtent2DUpperRight = new Cartesian3();
    var fromExtent2DSouthwest = new Cartographic();
    var fromExtent2DNortheast = new Cartographic();

    /**
     * Computes a bounding sphere from an extent projected in 2D.
     *
     * @memberof BoundingSphere
     *
     * @param {Extent} extent The extent around which to create a bounding sphere.
     * @param {Object} [projection=GeographicProjection] The projection used to project the extent into 2D.
     * @param {BoundingSphere} [result] The object onto which to store the result.
     * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
     */
    BoundingSphere.fromExtent2D = function(extent, projection, result) {
        return BoundingSphere.fromExtentWithHeights2D(extent, projection, 0.0, 0.0, result);
    };

    /**
     * Computes a bounding sphere from an extent projected in 2D.  The bounding sphere accounts for the
     * object's minimum and maximum heights over the extent.
     *
     * @memberof BoundingSphere
     *
     * @param {Extent} extent The extent around which to create a bounding sphere.
     * @param {Object} [projection=GeographicProjection] The projection used to project the extent into 2D.
     * @param {Number} [minimumHeight=0.0] The minimum height over the extent.
     * @param {Number} [maximumHeight=0.0] The maximum height over the extent.
     * @param {BoundingSphere} [result] The object onto which to store the result.
     * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
     */
    BoundingSphere.fromExtentWithHeights2D = function(extent, projection, minimumHeight, maximumHeight, result) {
        if (!defined(result)) {
            result = new BoundingSphere();
        }

        if (!defined(extent)) {
            result.center = Cartesian3.clone(Cartesian3.ZERO, result.center);
            result.radius = 0.0;
            return result;
        }

        projection = defaultValue(projection, defaultProjection);

        extent.getSouthwest(fromExtent2DSouthwest);
        fromExtent2DSouthwest.height = minimumHeight;
        extent.getNortheast(fromExtent2DNortheast);
        fromExtent2DNortheast.height = maximumHeight;

        var lowerLeft = projection.project(fromExtent2DSouthwest, fromExtent2DLowerLeft);
        var upperRight = projection.project(fromExtent2DNortheast, fromExtent2DUpperRight);

        var width = upperRight.x - lowerLeft.x;
        var height = upperRight.y - lowerLeft.y;
        var elevation = upperRight.z - lowerLeft.z;

        result.radius = Math.sqrt(width * width + height * height + elevation * elevation) * 0.5;
        var center = result.center;
        center.x = lowerLeft.x + width * 0.5;
        center.y = lowerLeft.y + height * 0.5;
        center.z = lowerLeft.z + elevation * 0.5;
        return result;
    };

    var fromExtent3DScratch = [];

    /**
     * Computes a bounding sphere from an extent in 3D. The bounding sphere is created using a subsample of points
     * on the ellipsoid and contained in the extent. It may not be accurate for all extents on all types of ellipsoids.
     * @memberof BoundingSphere
     *
     * @param {Extent} extent The valid extent used to create a bounding sphere.
     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid used to determine positions of the extent.
     * @param {Number} [surfaceHeight=0.0] The height above the surface of the ellipsoid.
     * @param {BoundingSphere} [result] The object onto which to store the result.
     * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
     */
    BoundingSphere.fromExtent3D = function(extent, ellipsoid, surfaceHeight, result) {
        ellipsoid = defaultValue(ellipsoid, Ellipsoid.WGS84);
        surfaceHeight = defaultValue(surfaceHeight, 0.0);

        var positions;
        if (defined(extent)) {
            positions = extent.subsample(ellipsoid, surfaceHeight, fromExtent3DScratch);
        }

        return BoundingSphere.fromPoints(positions, result);
    };

    /**
     * Computes a tight-fitting bounding sphere enclosing a list of 3D points, where the points are
     * stored in a flat array in X, Y, Z, order.  The bounding sphere is computed by running two
     * algorithms, a naive algorithm and Ritter's algorithm. The smaller of the two spheres is used to
     * ensure a tight fit.
     *
     * @memberof BoundingSphere
     *
     * @param {Array} positions An array of points that the bounding sphere will enclose.  Each point
     *        is formed from three elements in the array in the order X, Y, Z.
     * @param {Cartesian3} [center=Cartesian3.ZERO] The position to which the positions are relative, which need not be the
     *        origin of the coordinate system.  This is useful when the positions are to be used for
     *        relative-to-center (RTC) rendering.
     * @param {Number} [stride=3] The number of array elements per vertex.  It must be at least 3, but it may
     *        be higher.  Regardless of the value of this parameter, the X coordinate of the first position
     *        is at array index 0, the Y coordinate is at array index 1, and the Z coordinate is at array index
     *        2.  When stride is 3, the X coordinate of the next position then begins at array index 3.  If
     *        the stride is 5, however, two array elements are skipped and the next position begins at array
     *        index 5.
     * @param {BoundingSphere} [result] The object onto which to store the result.
     * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if one was not provided.
     *
     * @see <a href='http://blogs.agi.com/insight3d/index.php/2008/02/04/a-bounding/'>Bounding Sphere computation article</a>
     *
     * @example
     * // Compute the bounding sphere from 3 positions, each specified relative to a center.
     * // In addition to the X, Y, and Z coordinates, the points array contains two additional
     * // elements per point which are ignored for the purpose of computing the bounding sphere.
     * var center = new Cartesian3(1.0, 2.0, 3.0);
     * var points = [1.0, 2.0, 3.0, 0.1, 0.2,
     *               4.0, 5.0, 6.0, 0.1, 0.2,
     *               7.0, 8.0, 9.0, 0.1, 0.2];
     * var sphere = BoundingSphere.fromVertices(points, center, 5);
     */
    BoundingSphere.fromVertices = function(positions, center, stride, result) {
        if (!defined(result)) {
            result = new BoundingSphere();
        }

        if (!defined(positions) || positions.length === 0) {
            result.center = Cartesian3.clone(Cartesian3.ZERO, result.center);
            result.radius = 0.0;
            return result;
        }

        center = defaultValue(center, Cartesian3.ZERO);

        stride = defaultValue(stride, 3);

        if (stride < 3) {
            throw new DeveloperError('stride must be 3 or greater.');
        }

        var currentPos = fromPointsCurrentPos;
        currentPos.x = positions[0] + center.x;
        currentPos.y = positions[1] + center.y;
        currentPos.z = positions[2] + center.z;

        var xMin = Cartesian3.clone(currentPos, fromPointsXMin);
        var yMin = Cartesian3.clone(currentPos, fromPointsYMin);
        var zMin = Cartesian3.clone(currentPos, fromPointsZMin);

        var xMax = Cartesian3.clone(currentPos, fromPointsXMax);
        var yMax = Cartesian3.clone(currentPos, fromPointsYMax);
        var zMax = Cartesian3.clone(currentPos, fromPointsZMax);

        var numElements = positions.length;
        for (var i = 0; i < numElements; i += stride) {
            var x = positions[i] + center.x;
            var y = positions[i + 1] + center.y;
            var z = positions[i + 2] + center.z;

            currentPos.x = x;
            currentPos.y = y;
            currentPos.z = z;

            // Store points containing the the smallest and largest components
            if (x < xMin.x) {
                Cartesian3.clone(currentPos, xMin);
            }

            if (x > xMax.x) {
                Cartesian3.clone(currentPos, xMax);
            }

            if (y < yMin.y) {
                Cartesian3.clone(currentPos, yMin);
            }

            if (y > yMax.y) {
                Cartesian3.clone(currentPos, yMax);
            }

            if (z < zMin.z) {
                Cartesian3.clone(currentPos, zMin);
            }

            if (z > zMax.z) {
                Cartesian3.clone(currentPos, zMax);
            }
        }

        // Compute x-, y-, and z-spans (Squared distances b/n each component's min. and max.).
        var xSpan = Cartesian3.magnitudeSquared(Cartesian3.subtract(xMax, xMin, fromPointsScratch));
        var ySpan = Cartesian3.magnitudeSquared(Cartesian3.subtract(yMax, yMin, fromPointsScratch));
        var zSpan = Cartesian3.magnitudeSquared(Cartesian3.subtract(zMax, zMin, fromPointsScratch));

        // Set the diameter endpoints to the largest span.
        var diameter1 = xMin;
        var diameter2 = xMax;
        var maxSpan = xSpan;
        if (ySpan > maxSpan) {
            maxSpan = ySpan;
            diameter1 = yMin;
            diameter2 = yMax;
        }
        if (zSpan > maxSpan) {
            maxSpan = zSpan;
            diameter1 = zMin;
            diameter2 = zMax;
        }

        // Calculate the center of the initial sphere found by Ritter's algorithm
        var ritterCenter = fromPointsRitterCenter;
        ritterCenter.x = (diameter1.x + diameter2.x) * 0.5;
        ritterCenter.y = (diameter1.y + diameter2.y) * 0.5;
        ritterCenter.z = (diameter1.z + diameter2.z) * 0.5;

        // Calculate the radius of the initial sphere found by Ritter's algorithm
        var radiusSquared = Cartesian3.magnitudeSquared(Cartesian3.subtract(diameter2, ritterCenter, fromPointsScratch));
        var ritterRadius = Math.sqrt(radiusSquared);

        // Find the center of the sphere found using the Naive method.
        var minBoxPt = fromPointsMinBoxPt;
        minBoxPt.x = xMin.x;
        minBoxPt.y = yMin.y;
        minBoxPt.z = zMin.z;

        var maxBoxPt = fromPointsMaxBoxPt;
        maxBoxPt.x = xMax.x;
        maxBoxPt.y = yMax.y;
        maxBoxPt.z = zMax.z;

        var naiveCenter = Cartesian3.multiplyByScalar(Cartesian3.add(minBoxPt, maxBoxPt, fromPointsScratch), 0.5, fromPointsNaiveCenterScratch);

        // Begin 2nd pass to find naive radius and modify the ritter sphere.
        var naiveRadius = 0;
        for (i = 0; i < numElements; i += stride) {
            currentPos.x = positions[i] + center.x;
            currentPos.y = positions[i + 1] + center.y;
            currentPos.z = positions[i + 2] + center.z;

            // Find the furthest point from the naive center to calculate the naive radius.
            var r = Cartesian3.magnitude(Cartesian3.subtract(currentPos, naiveCenter, fromPointsScratch));
            if (r > naiveRadius) {
                naiveRadius = r;
            }

            // Make adjustments to the Ritter Sphere to include all points.
            var oldCenterToPointSquared = Cartesian3.magnitudeSquared(Cartesian3.subtract(currentPos, ritterCenter, fromPointsScratch));
            if (oldCenterToPointSquared > radiusSquared) {
                var oldCenterToPoint = Math.sqrt(oldCenterToPointSquared);
                // Calculate new radius to include the point that lies outside
                ritterRadius = (ritterRadius + oldCenterToPoint) * 0.5;
                radiusSquared = ritterRadius * ritterRadius;
                // Calculate center of new Ritter sphere
                var oldToNew = oldCenterToPoint - ritterRadius;
                ritterCenter.x = (ritterRadius * ritterCenter.x + oldToNew * currentPos.x) / oldCenterToPoint;
                ritterCenter.y = (ritterRadius * ritterCenter.y + oldToNew * currentPos.y) / oldCenterToPoint;
                ritterCenter.z = (ritterRadius * ritterCenter.z + oldToNew * currentPos.z) / oldCenterToPoint;
            }
        }

        if (ritterRadius < naiveRadius) {
            Cartesian3.clone(ritterCenter, result.center);
            result.radius = ritterRadius;
        } else {
            Cartesian3.clone(naiveCenter, result.center);
            result.radius = naiveRadius;
        }

        return result;
    };

    /**
     * Computes a bounding sphere from the corner points of an axis-aligned bounding box.  The sphere
     * tighly and fully encompases the box.
     *
     * @memberof BoundingSphere
     *
     * @param {Number} [corner] The minimum height over the extent.
     * @param {Number} [oppositeCorner] The maximum height over the extent.
     * @param {BoundingSphere} [result] The object onto which to store the result.
     *
     * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
     *
     * @exception {DeveloperError} corner and oppositeCorner are required.
     *
     * @example
     * // Create a bounding sphere around the unit cube
     * var sphere = BoundingSphere.fromCornerPoints(new Cartesian3(-0.5, -0.5, -0.5), new Cartesian3(0.5, 0.5, 0.5));
     */
    BoundingSphere.fromCornerPoints = function(corner, oppositeCorner, result) {
        if (!defined(corner) || !defined(oppositeCorner)) {
            throw new DeveloperError('corner and oppositeCorner are required.');
        }

        if (!defined(result)) {
            result = new BoundingSphere();
        }

        var center = result.center;
        Cartesian3.add(corner, oppositeCorner, center);
        Cartesian3.multiplyByScalar(center, 0.5, center);
        result.radius = Cartesian3.distance(center, oppositeCorner);
        return result;
    };

    /**
     * Creates a bounding sphere encompassing an ellipsoid.
     *
     * @memberof BoundingSphere
     *
     * @param {Ellipsoid} ellipsoid The ellipsoid around which to create a bounding sphere.
     * @param {BoundingSphere} [result] The object onto which to store the result.
     *
     * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
     *
     * @exception {DeveloperError} ellipsoid is required.
     *
     * @example
     * var boundingSphere = BoundingSphere.fromEllipsoid(ellipsoid);
     */
    BoundingSphere.fromEllipsoid = function(ellipsoid, result) {
        if (!defined(ellipsoid)) {
            throw new DeveloperError('ellipsoid is required.');
        }

        if (!defined(result)) {
            result = new BoundingSphere();
        }

        Cartesian3.clone(Cartesian3.ZERO, result.center);
        result.radius = ellipsoid.getMaximumRadius();
        return result;
    };

    /**
     * Duplicates a BoundingSphere instance.
     * @memberof BoundingSphere
     *
     * @param {BoundingSphere} sphere The bounding sphere to duplicate.
     * @param {BoundingSphere} [result] The object onto which to store the result.
     * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided. (Returns undefined if sphere is undefined)
     */
    BoundingSphere.clone = function(sphere, result) {
        if (!defined(sphere)) {
            return undefined;
        }

        if (!defined(result)) {
            return new BoundingSphere(sphere.center, sphere.radius);
        }

        result.center = Cartesian3.clone(sphere.center, result.center);
        result.radius = sphere.radius;
        return result;
    };

    var unionScratch = new Cartesian3();
    var unionScratchCenter = new Cartesian3();
    /**
     * Computes a bounding sphere that contains both the left and right bounding spheres.
     * @memberof BoundingSphere
     *
     * @param {BoundingSphere} left A sphere to enclose in a bounding sphere.
     * @param {BoundingSphere} right A sphere to enclose in a bounding sphere.
     * @param {BoundingSphere} [result] The object onto which to store the result.
     * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
     *
     * @exception {DeveloperError} left is required.
     * @exception {DeveloperError} right is required.
     */
    BoundingSphere.union = function(left, right, result) {
        if (!defined(left)) {
            throw new DeveloperError('left is required.');
        }

        if (!defined(right)) {
            throw new DeveloperError('right is required.');
        }

        if (!defined(result)) {
            result = new BoundingSphere();
        }

        var leftCenter = left.center;
        var rightCenter = right.center;

        Cartesian3.add(leftCenter, rightCenter, unionScratchCenter);
        var center = Cartesian3.multiplyByScalar(unionScratchCenter, 0.5, unionScratchCenter);

        var radius1 = Cartesian3.magnitude(Cartesian3.subtract(leftCenter, center, unionScratch)) + left.radius;
        var radius2 = Cartesian3.magnitude(Cartesian3.subtract(rightCenter, center, unionScratch)) + right.radius;

        result.radius = Math.max(radius1, radius2);
        Cartesian3.clone(center, result.center);

        return result;
    };

    var expandScratch = new Cartesian3();
    /**
     * Computes a bounding sphere by enlarging the provided sphere to contain the provided point.
     * @memberof BoundingSphere
     *
     * @param {BoundingSphere} sphere A sphere to expand.
     * @param {Cartesian3} point A point to enclose in a bounding sphere.
     * @param {BoundingSphere} [result] The object onto which to store the result.
     * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
     *
     * @exception {DeveloperError} sphere is required.
     * @exception {DeveloperError} point is required.
     */
    BoundingSphere.expand = function(sphere, point, result) {
        if (!defined(sphere)) {
            throw new DeveloperError('sphere is required.');
        }

        if (!defined(point)) {
            throw new DeveloperError('point is required.');
        }

        result = BoundingSphere.clone(sphere, result);

        var radius = Cartesian3.magnitude(Cartesian3.subtract(point, result.center, expandScratch));
        if (radius > result.radius) {
            result.radius = radius;
        }

        return result;
    };

    /**
     * Determines which side of a plane a sphere is located.
     * @memberof BoundingSphere
     *
     * @param {BoundingSphere} sphere The bounding sphere to test.
     * @param {Cartesian4} plane The coefficients of the plane in the for ax + by + cz + d = 0
     *                           where the coefficients a, b, c, and d are the components x, y, z,
     *                           and w of the {Cartesian4}, respectively.
     * @returns {Intersect} {Intersect.INSIDE} if the entire sphere is on the side of the plane the normal
     *                     is pointing, {Intersect.OUTSIDE} if the entire sphere is on the opposite side,
     *                     and {Intersect.INTERSETING} if the sphere intersects the plane.
     *
     * @exception {DeveloperError} sphere is required.
     * @exception {DeveloperError} plane is required.
     */
    BoundingSphere.intersect = function(sphere, plane) {
        if (!defined(sphere)) {
            throw new DeveloperError('sphere is required.');
        }

        if (!defined(plane)) {
            throw new DeveloperError('plane is required.');
        }

        var center = sphere.center;
        var radius = sphere.radius;
        var distanceToPlane = Cartesian3.dot(plane, center) + plane.w;

        if (distanceToPlane < -radius) {
            // The center point is negative side of the plane normal
            return Intersect.OUTSIDE;
        } else if (distanceToPlane < radius) {
            // The center point is positive side of the plane, but radius extends beyond it; partial overlap
            return Intersect.INTERSECTING;
        }
        return Intersect.INSIDE;
    };

    var transformCart4 = Cartesian4.clone(Cartesian4.UNIT_W);
    var columnScratch = new Cartesian3();
    /**
     * Applies a 4x4 affine transformation matrix to a bounding sphere.
     * @memberof BoundingSphere
     *
     * @param {BoundingSphere} sphere The bounding sphere to apply the transformation to.
     * @param {Matrix4} transform The transformation matrix to apply to the bounding sphere.
     * @param {BoundingSphere} [result] The object onto which to store the result.
     * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
     *
     * @exception {DeveloperError} sphere is required.
     * @exception {DeveloperError} transform is required.
     */
    BoundingSphere.transform = function(sphere, transform, result) {
        if (!defined(sphere)) {
            throw new DeveloperError('sphere is required.');
        }

        if (!defined(transform)) {
            throw new DeveloperError('transform is required.');
        }

        if (!defined(result)) {
            result = new BoundingSphere();
        }

        Matrix4.multiplyByPoint(transform, sphere.center, transformCart4);

        result.center = Cartesian3.clone(transformCart4, result.center);
        result.radius = Math.max(Cartesian3.magnitude(Matrix4.getColumn(transform, 0, columnScratch)),
                Cartesian3.magnitude(Matrix4.getColumn(transform, 1, columnScratch)),
                Cartesian3.magnitude(Matrix4.getColumn(transform, 2, columnScratch))) * sphere.radius;

        return result;
    };

    var scratchCartesian3 = new Cartesian3();
    /**
     * The distances calculated by the vector from the center of the bounding sphere to position projected onto direction
     * plus/minus the radius of the bounding sphere.
     * <br>
     * If you imagine the infinite number of planes with normal direction, this computes the smallest distance to the
     * closest and farthest planes from position that intersect the bounding sphere.
     * @memberof BoundingSphere
     *
     * @param {BoundingSphere} sphere The bounding sphere to calculate the distance to.
     * @param {Cartesian3} position The position to calculate the distance from.
     * @param {Cartesian3} direction The direction from position.
     * @param {Cartesian2} [result] A Cartesian2 to store the nearest and farthest distances.
     * @returns {Interval} The nearest and farthest distances on the bounding sphere from position in direction.
     *
     * @exception {DeveloperError} sphere is required.
     * @exception {DeveloperError} position is required.
     * @exception {DeveloperError} direction is required.
     */
    BoundingSphere.getPlaneDistances = function(sphere, position, direction, result) {
        if (!defined(sphere)) {
            throw new DeveloperError('sphere is required.');
        }

        if (!defined(position)) {
            throw new DeveloperError('position is required.');
        }

        if (!defined(direction)) {
            throw new DeveloperError('direction is required.');
        }

        if (!defined(result)) {
            result = new Interval();
        }

        var toCenter = Cartesian3.subtract(sphere.center, position, scratchCartesian3);
        var proj = Cartesian3.multiplyByScalar(direction, Cartesian3.dot(direction, toCenter), scratchCartesian3);
        var mag = Cartesian3.magnitude(proj);

        result.start = mag - sphere.radius;
        result.stop = mag + sphere.radius;
        return result;
    };

    var projectTo2DNormalScratch = new Cartesian3();
    var projectTo2DEastScratch = new Cartesian3();
    var projectTo2DNorthScratch = new Cartesian3();
    var projectTo2DWestScratch = new Cartesian3();
    var projectTo2DSouthScratch = new Cartesian3();
    var projectTo2DCartographicScratch = new Cartographic();
    var projectTo2DPositionsScratch = new Array(8);
    for (var n = 0; n < 8; ++n) {
        projectTo2DPositionsScratch[n] = new Cartesian3();
    }
    var projectTo2DProjection = new GeographicProjection();
    /**
     * Creates a bounding sphere in 2D from a bounding sphere in 3D world coordinates.
     * @memberof BoundingSphere
     *
     * @param {BoundingSphere} sphere The bounding sphere to transform to 2D.
     * @param {Object} [projection=GeographicProjection] The projection to 2D.
     * @param {BoundingSphere} [result] The object onto which to store the result.
     * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
     *
     * @exception {DeveloperError} sphere is required.
     */
    BoundingSphere.projectTo2D = function(sphere, projection, result) {
        if (!defined(sphere)) {
            throw new DeveloperError('sphere is required.');
        }

        projection = defaultValue(projection, projectTo2DProjection);

        var ellipsoid = projection.getEllipsoid();
        var center = sphere.center;
        var radius = sphere.radius;

        var normal = ellipsoid.geodeticSurfaceNormal(center, projectTo2DNormalScratch);
        var east = Cartesian3.cross(Cartesian3.UNIT_Z, normal, projectTo2DEastScratch);
        Cartesian3.normalize(east, east);
        var north = Cartesian3.cross(normal, east, projectTo2DNorthScratch);
        Cartesian3.normalize(north, north);

        Cartesian3.multiplyByScalar(normal, radius, normal);
        Cartesian3.multiplyByScalar(north, radius, north);
        Cartesian3.multiplyByScalar(east, radius, east);

        var south = Cartesian3.negate(north, projectTo2DSouthScratch);
        var west = Cartesian3.negate(east, projectTo2DWestScratch);

        var positions = projectTo2DPositionsScratch;

        // top NE corner
        var corner = positions[0];
        Cartesian3.add(normal, north, corner);
        Cartesian3.add(corner, east, corner);

        // top NW corner
        corner = positions[1];
        Cartesian3.add(normal, north, corner);
        Cartesian3.add(corner, west, corner);

        // top SW corner
        corner = positions[2];
        Cartesian3.add(normal, south, corner);
        Cartesian3.add(corner, west, corner);

        // top SE corner
        corner = positions[3];
        Cartesian3.add(normal, south, corner);
        Cartesian3.add(corner, east, corner);

        Cartesian3.negate(normal, normal);

        // bottom NE corner
        corner = positions[4];
        Cartesian3.add(normal, north, corner);
        Cartesian3.add(corner, east, corner);

        // bottom NW corner
        corner = positions[5];
        Cartesian3.add(normal, north, corner);
        Cartesian3.add(corner, west, corner);

        // bottom SW corner
        corner = positions[6];
        Cartesian3.add(normal, south, corner);
        Cartesian3.add(corner, west, corner);

        // bottom SE corner
        corner = positions[7];
        Cartesian3.add(normal, south, corner);
        Cartesian3.add(corner, east, corner);

        var length = positions.length;
        for (var i = 0; i < length; ++i) {
            var position = positions[i];
            Cartesian3.add(center, position, position);
            var cartographic = ellipsoid.cartesianToCartographic(position, projectTo2DCartographicScratch);
            projection.project(cartographic, position);
        }

        result = BoundingSphere.fromPoints(positions, result);

        // swizzle center components
        center = result.center;
        var x = center.x;
        var y = center.y;
        var z = center.z;
        center.x = z;
        center.y = x;
        center.z = y;

        return result;
    };

    /**
     * Compares the provided BoundingSphere componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     * @memberof BoundingSphere
     *
     * @param {BoundingSphere} [left] The first BoundingSphere.
     * @param {BoundingSphere} [right] The second BoundingSphere.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    BoundingSphere.equals = function(left, right) {
        return (left === right) ||
               ((defined(left)) &&
                (defined(right)) &&
                Cartesian3.equals(left.center, right.center) &&
                left.radius === right.radius);
    };

    /**
     * Duplicates this BoundingSphere instance.
     * @memberof BoundingSphere
     *
     * @param {BoundingSphere} [result] The object onto which to store the result.
     * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
     */
    BoundingSphere.prototype.clone = function(result) {
        return BoundingSphere.clone(this, result);
    };

    /**
     * Computes a bounding sphere that contains both this bounding sphere and the argument sphere.
     * @memberof BoundingSphere
     *
     * @param {BoundingSphere} right The sphere to enclose in this bounding sphere.
     * @param {BoundingSphere} [result] The object onto which to store the result.
     * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
     *
     * @exception {DeveloperError} sphere is required.
     */
    BoundingSphere.prototype.union = function(right, result) {
        return BoundingSphere.union(this, right, result);
    };

    /**
     * Computes a bounding sphere that is sphere expanded to contain point.
     * @memberof BoundingSphere
     *
     * @param {Cartesian3} point A point to enclose in a bounding sphere.
     * @param {BoundingSphere} [result] The object onto which to store the result.
     * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if one was not provided.
     *
     * @exception {DeveloperError} point is required.
     */
    BoundingSphere.prototype.expand = function(point, result) {
        return BoundingSphere.expand(this, point, result);
    };

    /**
     * Determines which side of a plane the sphere is located.
     * @memberof BoundingSphere
     *
     * @param {Cartesian4} plane The coefficients of the plane in the for ax + by + cz + d = 0
     *                           where the coefficients a, b, c, and d are the components x, y, z,
     *                           and w of the {Cartesian4}, respectively.
     * @returns {Intersect} {Intersect.INSIDE} if the entire sphere is on the side of the plane the normal
     *                     is pointing, {Intersect.OUTSIDE} if the entire sphere is on the opposite side,
     *                     and {Intersect.INTERSETING} if the sphere intersects the plane.
     *
     * @exception {DeveloperError} plane is required.
     */
    BoundingSphere.prototype.intersect = function(plane) {
        return BoundingSphere.intersect(this, plane);
    };

    /**
     * Applies a 4x4 affine transformation matrix to this bounding sphere.
     * @memberof BoundingSphere
     *
     * @param {Matrix4} transform The transformation matrix to apply to the bounding sphere.
     * @param {BoundingSphere} [result] The object onto which to store the result.
     * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
     *
     * @exception {DeveloperError} transform is required.
     */
    BoundingSphere.prototype.transform = function(transform, result) {
        return BoundingSphere.transform(this, transform, result);
    };

    /**
     * The distances calculated by the vector from the center of the bounding sphere to position projected onto direction
     * plus/minus the radius of the bounding sphere.
     * <br>
     * If you imagine the infinite number of planes with normal direction, this computes the smallest distance to the
     * closest and farthest planes from position that intersect the bounding sphere.
     * @memberof BoundingSphere
     *
     * @param {Cartesian3} position The position to calculate the distance from.
     * @param {Cartesian3} direction The direction from position.
     * @param {Cartesian2} [result] A Cartesian2 to store the nearest and farthest distances.
     * @returns {Interval} The nearest and farthest distances on the bounding sphere from position in direction.
     *
     * @exception {DeveloperError} position is required.
     * @exception {DeveloperError} direction is required.
     */
    BoundingSphere.prototype.getPlaneDistances = function(position, direction, result) {
        return BoundingSphere.getPlaneDistances(this, position, direction, result);
    };

    /**
     * Creates a bounding sphere in 2D from this bounding sphere. This bounding sphere must be in 3D world coordinates.
     * @memberof BoundingSphere
     *
     * @param {Object} [projection=GeographicProjection] The projection to 2D.
     * @param {BoundingSphere} [result] The object onto which to store the result.
     * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
     */
    BoundingSphere.prototype.projectTo2D = function(projection, result) {
        return BoundingSphere.projectTo2D(this, projection, result);
    };

    /**
     * Compares this BoundingSphere against the provided BoundingSphere componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     * @memberof BoundingSphere
     *
     * @param {BoundingSphere} [right] The right hand side BoundingSphere.
     * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
     */
    BoundingSphere.prototype.equals = function(right) {
        return BoundingSphere.equals(this, right);
    };

    return BoundingSphere;
});

/*global define*/
define('Core/Fullscreen',['./defined'], function(defined) {
    "use strict";

    var _supportsFullscreen;
    var _names = {
        requestFullscreen : undefined,
        exitFullscreen : undefined,
        fullscreenEnabled : undefined,
        fullscreenElement : undefined,
        fullscreenchange : undefined,
        fullscreenerror : undefined
    };

    /**
     * Browser-independent functions for working with the standard fullscreen API.
     *
     * @exports Fullscreen
     *
     * @see <a href='http://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html'>W3C Fullscreen Living Specification</a>
     */
    var Fullscreen = {};

    /**
     * Detects whether the browser supports the standard fullscreen API.
     *
     * @returns <code>true</code> if the browser supports the standard fullscreen API,
     * <code>false</code> otherwise.
     */
    Fullscreen.supportsFullscreen = function() {
        if (defined(_supportsFullscreen)) {
            return _supportsFullscreen;
        }

        _supportsFullscreen = false;

        var body = document.body;
        if (typeof body.requestFullscreen === 'function') {
            // go with the unprefixed, standard set of names
            _names.requestFullscreen = 'requestFullscreen';
            _names.exitFullscreen = 'exitFullscreen';
            _names.fullscreenEnabled = 'fullscreenEnabled';
            _names.fullscreenElement = 'fullscreenElement';
            _names.fullscreenchange = 'fullscreenchange';
            _names.fullscreenerror = 'fullscreenerror';
            _supportsFullscreen = true;
            return _supportsFullscreen;
        }

        //check for the correct combination of prefix plus the various names that browsers use
        var prefixes = ['webkit', 'moz', 'o', 'ms', 'khtml'];
        var name;
        for ( var i = 0, len = prefixes.length; i < len; ++i) {
            var prefix = prefixes[i];

            // casing of Fullscreen differs across browsers
            name = prefix + 'RequestFullscreen';
            if (typeof body[name] === 'function') {
                _names.requestFullscreen = name;
                _supportsFullscreen = true;
            } else {
                name = prefix + 'RequestFullScreen';
                if (typeof body[name] === 'function') {
                    _names.requestFullscreen = name;
                    _supportsFullscreen = true;
                }
            }

            // disagreement about whether it's "exit" as per spec, or "cancel"
            name = prefix + 'ExitFullscreen';
            if (typeof document[name] === 'function') {
                _names.exitFullscreen = name;
            } else {
                name = prefix + 'CancelFullScreen';
                if (typeof document[name] === 'function') {
                    _names.exitFullscreen = name;
                }
            }

            // casing of Fullscreen differs across browsers
            name = prefix + 'FullscreenEnabled';
            if (defined(document[name])) {
                _names.fullscreenEnabled = name;
            } else {
                name = prefix + 'FullScreenEnabled';
                if (defined(document[name])) {
                    _names.fullscreenEnabled = name;
                }
            }

            // casing of Fullscreen differs across browsers
            name = prefix + 'FullscreenElement';
            if (defined(document[name])) {
                _names.fullscreenElement = name;
            } else {
                name = prefix + 'FullScreenElement';
                if (defined(document[name])) {
                    _names.fullscreenElement = name;
                }
            }

            // thankfully, event names are all lowercase per spec
            name = prefix + 'fullscreenchange';
            // event names do not have 'on' in the front, but the property on the document does
            if (defined(document['on' + name])) {
                _names.fullscreenchange = name;
            }

            name = prefix + 'fullscreenerror';
            if (defined(document['on' + name])) {
                _names.fullscreenerror = name;
            }
        }

        return _supportsFullscreen;
    };

    /**
     * Asynchronously requests the browser to enter fullscreen mode on the given element.
     * If fullscreen mode is not supported by the browser, does nothing.
     *
     * @param {Object} element The HTML element which will be placed into fullscreen mode.
     *
     * @example
     * // Put the entire page into fullscreen.
     * Fullscreen.requestFullscreen(document.body)
     *
     * // Place only the Cesium canvas into fullscreen.
     * Fullscreen.requestFullscreen(scene.getCanvas())
     */
    Fullscreen.requestFullscreen = function(element) {
        if (!Fullscreen.supportsFullscreen()) {
            return;
        }

        element[_names.requestFullscreen]();
    };

    /**
     * Asynchronously exits fullscreen mode.  If the browser is not currently
     * in fullscreen, or if fullscreen mode is not supported by the browser, does nothing.
     */
    Fullscreen.exitFullscreen = function() {
        if (!Fullscreen.supportsFullscreen()) {
            return;
        }

        document[_names.exitFullscreen]();
    };

    /**
     * Determine whether the browser will allow an element to be made fullscreen, or not.
     * For example, by default, iframes cannot go fullscreen unless the containing page
     * adds an "allowfullscreen" attribute (or prefixed equivalent).
     *
     * @returns {Boolean} <code>true</code> if the browser is able to enter fullscreen mode,
     * <code>false</code> if not, and <code>undefined</code> if the browser does not
     * support fullscreen mode.
     */
    Fullscreen.isFullscreenEnabled = function() {
        if (!Fullscreen.supportsFullscreen()) {
            return undefined;
        }

        return document[_names.fullscreenEnabled];
    };

    /**
     * Gets the element that is currently fullscreen, if any.  To simply check if the
     * browser is in fullscreen mode or not, use {@link Fullscreen#isFullscreen}.
     *
     * @returns {Object} the element that is currently fullscreen, or <code>null</code> if the browser is
     * not in fullscreen mode, or <code>undefined</code> if the browser does not support fullscreen
     * mode.
     */
    Fullscreen.getFullscreenElement = function() {
        if (!Fullscreen.supportsFullscreen()) {
            return undefined;
        }

        return document[_names.fullscreenElement];
    };

    /**
     * Determines if the browser is currently in fullscreen mode.
     *
     * @returns {Boolean} <code>true</code> if the browser is currently in fullscreen mode, <code>false</code>
     * if it is not, or <code>undefined</code> if the browser does not support fullscreen mode.
     */
    Fullscreen.isFullscreen = function() {
        if (!Fullscreen.supportsFullscreen()) {
            return undefined;
        }

        return Fullscreen.getFullscreenElement() !== null;
    };

    /**
     * Gets the name of the event on the document that is fired when fullscreen is
     * entered or exited.  This event name is intended for use with addEventListener.
     *
     * In your event handler, to determine if the browser is in fullscreen mode or not,
     * use {@link Fullscreen#isFullscreen}.
     *
     * @returns {String} the name of the event that is fired when fullscreen is entered or
     * exited, or <code>undefined</code> if fullscreen is not supported.
     */
    Fullscreen.getFullscreenChangeEventName = function() {
        if (!Fullscreen.supportsFullscreen()) {
            return undefined;
        }

        return _names.fullscreenchange;
    };

    /**
     * Gets the name of the event that is fired when a fullscreen error
     * occurs.  This event name is intended for use with addEventListener.
     *
     * @returns {String} the name of the event that is fired when a fullscreen error occurs,
     * or <code>undefined</code> if fullscreen is not supported.
     */
    Fullscreen.getFullscreenErrorEventName = function() {
        if (!Fullscreen.supportsFullscreen()) {
            return undefined;
        }

        return _names.fullscreenerror;
    };

    return Fullscreen;
});
/*global define*/
define('Core/FeatureDetection',[
        './defined',
        './Fullscreen'
    ], function(
        defined,
        Fullscreen) {
    "use strict";

    function extractVersion(versionString) {
        var parts = versionString.split('.');
        for ( var i = 0, len = parts.length; i < len; ++i) {
            parts[i] = parseInt(parts[i], 10);
        }
    }

    var isChromeResult;
    var chromeVersionResult;
    function isChrome() {
        if (!defined(isChromeResult)) {
            var fields = (/ Chrome\/([\.0-9]+)/).exec(navigator.userAgent);
            if (fields === null) {
                isChromeResult = false;
            } else {
                isChromeResult = true;
                chromeVersionResult = extractVersion(fields[1]);
            }
        }

        return isChromeResult;
    }

    function chromeVersion() {
        return isChrome() && chromeVersionResult;
    }

    var isSafariResult;
    var safariVersionResult;
    function isSafari() {
        if (!defined(isSafariResult)) {
            // Chrome contains Safari in the user agent too
            if (isChrome() || !(/ Safari\/[\.0-9]+/).test(navigator.userAgent)) {
                isSafariResult = false;
            } else {
                var fields = (/ Version\/([\.0-9]+)/).exec(navigator.userAgent);
                if (fields === null) {
                    isSafariResult = false;
                } else {
                    isSafariResult = true;
                    safariVersionResult = extractVersion(fields[1]);
                }
            }
        }

        return isSafariResult;
    }

    function safariVersion() {
        return isSafari() && safariVersionResult;
    }

    var isWebkitResult;
    var webkitVersionResult;
    function isWebkit() {
        if (!defined(isWebkitResult)) {
            var fields = (/ AppleWebKit\/([\.0-9]+)(\+?)/).exec(navigator.userAgent);
            if (fields === null) {
                isWebkitResult = false;
            } else {
                isWebkitResult = true;
                webkitVersionResult = extractVersion(fields[1]);
                webkitVersionResult.isNightly = !!fields[2];
            }
        }

        return isWebkitResult;
    }

    function webkitVersion() {
        return isWebkit() && webkitVersionResult;
    }

    var isInternetExplorerResult;
    var internetExplorerVersionResult;
    function isInternetExplorer() {
        if (!defined(isInternetExplorerResult)) {
            var fields = (/ MSIE ([\.0-9]+)/).exec(navigator.userAgent);
            if (fields === null) {
                isInternetExplorerResult = false;
            } else {
                isInternetExplorerResult = true;
                internetExplorerVersionResult = extractVersion(fields[1]);
            }
        }
        return isInternetExplorerResult;
    }

    function internetExplorerVersion() {
        return isInternetExplorer() && internetExplorerVersionResult;
    }

    /**
     * A set of functions to detect whether the current browser supports
     * various features.
     *
     * @exports FeatureDetection
     */
    var FeatureDetection = {
        isChrome : isChrome,
        chromeVersion : chromeVersion,
        isSafari : isSafari,
        safariVersion : safariVersion,
        isWebkit : isWebkit,
        webkitVersion : webkitVersion,
        isInternetExplorer : isInternetExplorer,
        internetExplorerVersion : internetExplorerVersion
    };

    var supportsCrossOriginImagery;

    /**
     * Detects whether the current browser supports the use of cross-origin
     * requests to load streaming imagery.
     *
     * @returns true if the browser can load cross-origin streaming imagery, false if not.
     *
     * @see <a href='http://www.w3.org/TR/cors/'>Cross-Origin Resource Sharing</a>
     */
    FeatureDetection.supportsCrossOriginImagery = function() {
        if (!defined(supportsCrossOriginImagery)) {
            if (isSafari() && webkitVersion()[0] < 536) {
                // versions of Safari below this incorrectly throw a DOM error when calling
                // readPixels on a canvas containing a cross-origin image.
                supportsCrossOriginImagery = false;
            } else {
                // any other versions of browsers that incorrectly block
                // readPixels on canvas containing crossOrigin images?
                supportsCrossOriginImagery = 'withCredentials' in new XMLHttpRequest();
            }
        }
        return supportsCrossOriginImagery;
    };

    /**
     * Detects whether the current browser supports the full screen standard.
     *
     * @returns true if the browser supports the full screen standard, false if not.
     *
     * @see Fullscreen
     * @see <a href='http://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html'>W3C Fullscreen Living Specification</a>
     */
    FeatureDetection.supportsFullscreen = function() {
        return Fullscreen.supportsFullscreen();
    };

    /**
     * Detects whether the current browser supports typed arrays.
     *
     * @returns true if the browser supports typed arrays, false if not.
     *
     * @see <a href='http://www.khronos.org/registry/typedarray/specs/latest/'>Typed Array Specification</a>
     */
    FeatureDetection.supportsTypedArrays = function() {
        return typeof ArrayBuffer !== 'undefined';
    };

    return FeatureDetection;
});
/*global define*/
define('Core/ComponentDatatype',[
        './defined',
        './DeveloperError',
        './FeatureDetection',
        './Enumeration'
    ], function(
        defined,
        DeveloperError,
        FeatureDetection,
        Enumeration) {
    "use strict";

    // Bail out if the browser doesn't support typed arrays, to prevent the setup function
    // from failing, since we won't be able to create a WebGL context anyway.
    if (!FeatureDetection.supportsTypedArrays()) {
        return {};
    }

    /**
     * Enumerations for WebGL component datatypes.  Components are intrinsics,
     * which form attributes, which form vertices.
     *
     * @alias ComponentDatatype
     * @enumeration
     */
    var ComponentDatatype = {
        /**
         * 8-bit signed byte enumeration corresponding to <code>gl.BYTE</code> and the type
         * of an element in <code>Int8Array</code>.
         *
         * @type {Enumeration}
         * @constant
         * @default 0x1400
         */
        BYTE : new Enumeration(0x1400, 'BYTE', {
            sizeInBytes : Int8Array.BYTES_PER_ELEMENT
        }),

        /**
         * 8-bit unsigned byte enumeration corresponding to <code>UNSIGNED_BYTE</code> and the type
         * of an element in <code>Uint8Array</code>.
         *
         * @type {Enumeration}
         * @constant
         * @default 0x1401
         */
        UNSIGNED_BYTE : new Enumeration(0x1401, 'UNSIGNED_BYTE', {
            sizeInBytes : Uint8Array.BYTES_PER_ELEMENT
        }),

        /**
         * 16-bit signed short enumeration corresponding to <code>SHORT</code> and the type
         * of an element in <code>Int16Array</code>.
         *
         * @type {Enumeration}
         * @constant
         * @default 0x1402
         */
        SHORT : new Enumeration(0x1402, 'SHORT', {
            sizeInBytes : Int16Array.BYTES_PER_ELEMENT
        }),

        /**
         * 16-bit unsigned short enumeration corresponding to <code>UNSIGNED_SHORT</code> and the type
         * of an element in <code>Uint16Array</code>.
         *
         * @type {Enumeration}
         * @constant
         * @default 0x1403
         */
        UNSIGNED_SHORT : new Enumeration(0x1403, 'UNSIGNED_SHORT', {
            sizeInBytes : Uint16Array.BYTES_PER_ELEMENT
        }),

        /**
         * 32-bit floating-point enumeration corresponding to <code>FLOAT</code> and the type
         * of an element in <code>Float32Array</code>.
         *
         * @type {Enumeration}
         * @constant
         * @default 0x1406
         */
        FLOAT : new Enumeration(0x1406, 'FLOAT', {
            sizeInBytes : Float32Array.BYTES_PER_ELEMENT
        }),

        /**
         * 64-bit floating-point enumeration corresponding to <code>gl.DOUBLE</code> (in Desktop OpenGL;
         * this is not supported in WebGL, and is emulated in Cesium via {@link GeometryPipeline.encodeAttribute})
         * and the type of an element in <code>Float64Array</code>.
         *
         * @memberOf ComponentDatatype
         *
         * @type {Enumeration}
         * @constant
         * @default 0x140A
         */
        DOUBLE : new Enumeration(0x140A, 'DOUBLE', {
            sizeInBytes : Float64Array.BYTES_PER_ELEMENT
        })
    };

    /**
     * Validates that the provided component datatype is a valid {@link ComponentDatatype}
     *
     * @param {ComponentDatatype} componentDatatype The component datatype to validate.
     *
     * @returns {Boolean} <code>true</code> if the provided component datatype is a valid enumeration value; otherwise, <code>false</code>.
     *
     * @example
     * if (!ComponentDatatype.validate(componentDatatype)) {
     *   throw new DeveloperError('componentDatatype must be a valid enumeration value.');
     * }
     */
    ComponentDatatype.validate = function(componentDatatype) {
        return defined(componentDatatype) && defined(componentDatatype.value) &&
               (componentDatatype.value === ComponentDatatype.BYTE.value ||
                componentDatatype.value === ComponentDatatype.UNSIGNED_BYTE.value ||
                componentDatatype.value === ComponentDatatype.SHORT.value ||
                componentDatatype.value === ComponentDatatype.UNSIGNED_SHORT.value ||
                componentDatatype.value === ComponentDatatype.FLOAT.value ||
                componentDatatype.value === ComponentDatatype.DOUBLE.value);
    };

    /**
     * Creates a typed array corresponding to component data type.
     * @memberof ComponentDatatype
     *
     * @param {ComponentDatatype} componentDatatype The component data type.
     * @param {Number|Array} valuesOrLength The length of the array to create or an array.
     *
     * @returns {Int8Array|Uint8Array|Int16Array|Uint16Array|Float32Array|Float64Array} A typed array.
     *
     * @exception {DeveloperError} componentDatatype is required.
     * @exception {DeveloperError} valuesOrLength is required.
     * @exception {DeveloperError} componentDatatype is not a valid enumeration value.
     *
     * @example
     * // creates a Float32Array with length of 100
     * var typedArray = ComponentDatatype.createTypedArray(ComponentDatatype.FLOAT, 100);
     */
    ComponentDatatype.createTypedArray = function(componentDatatype, valuesOrLength) {
        if (!defined(componentDatatype)) {
            throw new DeveloperError('componentDatatype is required.');
        }

        if (!defined(valuesOrLength)) {
            throw new DeveloperError('valuesOrLength is required.');
        }

        switch (componentDatatype.value) {
        case ComponentDatatype.BYTE.value:
            return new Int8Array(valuesOrLength);
        case ComponentDatatype.UNSIGNED_BYTE.value:
            return new Uint8Array(valuesOrLength);
        case ComponentDatatype.SHORT.value:
            return new Int16Array(valuesOrLength);
        case ComponentDatatype.UNSIGNED_SHORT.value:
            return new Uint16Array(valuesOrLength);
        case ComponentDatatype.FLOAT.value:
            return new Float32Array(valuesOrLength);
        case ComponentDatatype.DOUBLE.value:
            return new Float64Array(valuesOrLength);
        default:
            throw new DeveloperError('componentDatatype is not a valid enumeration value.');
        }
    };

    /**
     * Creates a typed view of an array of bytes.
     * @memberof ComponentDatatype
     *
     * @param {ComponentDatatype} componentDatatype The type of the view to create.
     * @param {ArrayBuffer} buffer The buffer storage to use for the view.
     * @param {Number} [byteOffset] The offset, in bytes, to the first element in the view.
     * @param {Number} [length] The number of elements in the view.
     *
     * @returns {Int8Array|Uint8Array|Int16Array|Uint16Array|Float32Array|Float64Array} A typed array view of the buffer.
     *
     * @exception {DeveloperError} componentDatatype is required.
     * @exception {DeveloperError} buffer is required.
     * @exception {DeveloperError} componentDatatype is not a valid enumeration value.
     */
    ComponentDatatype.createArrayBufferView = function(componentDatatype, buffer, byteOffset, length) {
        if (!defined(componentDatatype)) {
            throw new DeveloperError('componentDatatype is required.');
        }

        if (!defined(buffer)) {
            throw new DeveloperError('buffer is required.');
        }

        switch (componentDatatype.value) {
        case ComponentDatatype.BYTE.value:
            return new Int8Array(buffer, byteOffset);
        case ComponentDatatype.UNSIGNED_BYTE.value:
            return new Uint8Array(buffer, byteOffset);
        case ComponentDatatype.SHORT.value:
            return new Int16Array(buffer, byteOffset);
        case ComponentDatatype.UNSIGNED_SHORT.value:
            return new Uint16Array(buffer, byteOffset);
        case ComponentDatatype.FLOAT.value:
            return new Float32Array(buffer, byteOffset);
        case ComponentDatatype.DOUBLE.value:
            return new Float64Array(buffer, byteOffset);
        default:
            throw new DeveloperError('componentDatatype is not a valid enumeration value.');
        }
    };

    return ComponentDatatype;
});

/*global define*/
define('Core/IndexDatatype',[
        './Enumeration',
        './defined',
        './DeveloperError',
        './FeatureDetection',
        './Math'
    ], function(
        Enumeration,
        defined,
        DeveloperError,
        FeatureDetection,
        CesiumMath) {
    "use strict";

    // Bail out if the browser doesn't support typed arrays, to prevent the setup function
    // from failing, since we won't be able to create a WebGL context anyway.
    if (!FeatureDetection.supportsTypedArrays()) {
        return {};
    }

    /**
     * Enumerations for WebGL index datatypes.  These corresponds to the
     * <code>type</code> parameter of <a href="http://www.khronos.org/opengles/sdk/docs/man/xhtml/glDrawElements.xml">drawElements</a>.
     *
     * @alias IndexDatatype
     * @enumeration
     */
    var IndexDatatype = {
        /**
         * 8-bit unsigned byte enumeration corresponding to <code>UNSIGNED_BYTE</code> and the type
         * of an element in <code>Uint8Array</code>.
         *
         * @type {Enumeration}
         * @constant
         * @default 0x1401
         */
        UNSIGNED_BYTE : new Enumeration(0x1401, 'UNSIGNED_BYTE', {
            sizeInBytes : Uint8Array.BYTES_PER_ELEMENT
        }),

        /**
         * 16-bit unsigned short enumeration corresponding to <code>UNSIGNED_SHORT</code> and the type
         * of an element in <code>Uint16Array</code>.
         *
         * @type {Enumeration}
         * @constant
         * @default 0x1403
         */
        UNSIGNED_SHORT : new Enumeration(0x1403, 'UNSIGNED_SHORT', {
            sizeInBytes : Uint16Array.BYTES_PER_ELEMENT
        }),

        /**
         * 32-bit unsigned int enumeration corresponding to <code>UNSIGNED_INT</code> and the type
         * of an element in <code>Uint32Array</code>.
         *
         * @type {Enumeration}
         * @constant
         * @default 0x1405
         */
        UNSIGNED_INT : new Enumeration(0x1405, 'UNSIGNED_INT', {
            sizeInBytes : Uint32Array.BYTES_PER_ELEMENT
        })
    };

    /**
     * Validates that the provided index datatype is a valid {@link IndexDatatype}.
     *
     * @param {IndexDatatype} indexDatatype The index datatype to validate.
     *
     * @returns {Boolean} <code>true</code> if the provided index datatype is a valid enumeration value; otherwise, <code>false</code>.
     *
     * @example
     * if (!IndexDatatype.validate(indexDatatype)) {
     *   throw new DeveloperError('indexDatatype must be a valid enumeration value.');
     * }
     */
    IndexDatatype.validate = function(indexDatatype) {
        return defined(indexDatatype) && defined(indexDatatype.value) &&
               (indexDatatype.value === IndexDatatype.UNSIGNED_BYTE.value ||
                indexDatatype.value === IndexDatatype.UNSIGNED_SHORT.value ||
                indexDatatype.value === IndexDatatype.UNSIGNED_INT.value);
    };

    /**
     * Creates a typed array that will store indices, using either <code><Uint16Array</code>
     * or <code>Uint32Array</code> depending on the number of vertices.
     *
     * @param {Number} numberOfVertices Number of vertices that the indices will reference.
     * @param {Any} indicesLengthOrArray Passed through to the typed array constructor.
     *
     * @returns {Array} A <code>Uint16Array</code> or <code>Uint32Array</code> constructed with <code>indicesLengthOrArray</code>.
     *
     * @exception {DeveloperError} center is required.
     *
     * @example
     * this.indices = IndexDatatype.createTypedArray(positions.length / 3, numberOfIndices);
     */
    IndexDatatype.createTypedArray = function(numberOfVertices, indicesLengthOrArray) {
        if (!defined(numberOfVertices)) {
            throw new DeveloperError('numberOfVertices is required.');
        }

        if (numberOfVertices > CesiumMath.SIXTY_FOUR_KILOBYTES) {
            return new Uint32Array(indicesLengthOrArray);
        }

        return new Uint16Array(indicesLengthOrArray);
    };

    return IndexDatatype;
});

/*global define*/
define('Core/Geometry',[
        './defaultValue',
        './defined',
        './DeveloperError',
        './BoundingSphere'
    ], function(
        defaultValue,
        defined,
        DeveloperError,
        BoundingSphere) {
    "use strict";

    /**
     * A geometry representation with attributes forming vertices and optional index data
     * defining primitives.  Geometries and an {@link Appearance}, which describes the shading,
     * can be assigned to a {@link Primitive} for visualization.  A <code>Primitive</code> can
     * be created from many heterogeneous - in many cases - geometries for performance.
     * <p>
     * In low-level rendering code, a vertex array can be created from a geometry using
     * {@link Context#createVertexArrayFromGeometry}.
     * </p>
     * <p>
     * Geometries can be transformed and optimized using functions in {@link GeometryPipeline}.
     * </p>
     *
     * @alias Geometry
     * @constructor
     *
     * @param {GeometryAttributes} options.attributes Attributes, which make up the geometry's vertices.
     * @param {PrimitiveType} options.primitiveType The type of primitives in the geometry.
     * @param {Array} [options.indices] Optional index data that determines the primitives in the geometry.
     * @param {BoundingSphere} [options.boundingSphere] An optional bounding sphere that fully enclosed the geometry.

     * @exception {DeveloperError} options.attributes is required.
     * @exception {DeveloperError} options.primitiveType is required.
     *
     * @example
     * // Create geometry with a position attribute and indexed lines.
     * var positions = new Float64Array([
     *   0.0, 0.0, 0.0,
     *   7500000.0, 0.0, 0.0,
     *   0.0, 7500000.0, 0.0
     * ]);
     *
     * var geometry = new Geometry({
     *   attributes : {
     *     position : new GeometryAttribute({
     *       componentDatatype : ComponentDatatype.DOUBLE,
     *       componentsPerAttribute : 3,
     *       values : positions
     *     })
     *   },
     *   indices : new Uint16Array([0, 1, 1, 2, 2, 0]),
     *   primitiveType : PrimitiveType.LINES,
     *   boundingSphere : BoundingSphere.fromVertices(positions)
     * });
     *
     * @demo <a href="http://cesium.agi.com/Cesium/Apps/Sandcastle/index.html?src=Geometry%20and%20Appearances.html">Geometry and Appearances Demo</a>
     *
     * @see PolygonGeometry
     * @see ExtentGeometry
     * @see EllipseGeometry
     * @see CircleGeometry
     * @see WallGeometry
     * @see SimplePolylineGeometry
     * @see BoxGeometry
     * @see EllipsoidGeometry
     */
    var Geometry = function(options) {
        options = defaultValue(options, defaultValue.EMPTY_OBJECT);

        if (!defined(options.attributes)) {
            throw new DeveloperError('options.attributes is required.');
        }

        if (!defined(options.primitiveType)) {
            throw new DeveloperError('options.primitiveType is required.');
        }

        /**
         * Attributes, which make up the geometry's vertices.  Each property in this object corresponds to a
         * {@link GeometryAttribute} containing the attribute's data.
         * <p>
         * Attributes are always stored non-interleaved in a Geometry.  When geometry is prepared for rendering
         * with {@link Context#createVertexArrayFromGeometry}, attributes are generally written interleaved
         * into the vertex buffer for better rendering performance.
         * </p>
         * <p>
         * There are reserved attribute names with well-known semantics.  The following attributes
         * are created by a Geometry (depending on the provided {@link VertexFormat}.
         * <ul>
         *    <li><code>position</code> - 3D vertex position.  64-bit floating-point (for precision).  3 components per attribute.  See {@link VertexFormat#position}.</li>
         *    <li><code>normal</code> - Normal (normalized), commonly used for lighting.  32-bit floating-point.  3 components per attribute.  See {@link VertexFormat#normal}.</li>
         *    <li><code>st</code> - 2D texture coordinate.  32-bit floating-point.  2 components per attribute.  See {@link VertexFormat#st}.</li>
         *    <li><code>binormal</code> - Binormal (normalized), used for tangent-space effects like bump mapping.  32-bit floating-point.  3 components per attribute.  See {@link VertexFormat#binormal}.</li>
         *    <li><code>tangent</code> - Tangent (normalized), used for tangent-space effects like bump mapping.  32-bit floating-point.  3 components per attribute.  See {@link VertexFormat#tangent}.</li>
         * </ul>
         * </p>
         * <p>
         * The following attribute names are generally not created by a Geometry, but are added
         * to a Geometry by a {@link Primitive} or {@link GeometryPipeline} functions to prepare
         * the geometry for rendering.
         * <ul>
         *    <li><code>position3DHigh</code> - High 32 bits for encoded 64-bit position computed with {@link GeometryPipeline.encodeAttribute}.  32-bit floating-point.  4 components per attribute.</li>
         *    <li><code>position3DLow</code> - Low 32 bits for encoded 64-bit position computed with {@link GeometryPipeline.encodeAttribute}.  32-bit floating-point.  4 components per attribute.</li>
         *    <li><code>position3DHigh</code> - High 32 bits for encoded 64-bit 2D (Columbus view) position computed with {@link GeometryPipeline.encodeAttribute}.  32-bit floating-point.  4 components per attribute.</li>
         *    <li><code>position2DLow</code> - Low 32 bits for encoded 64-bit 2D (Columbus view) position computed with {@link GeometryPipeline.encodeAttribute}.  32-bit floating-point.  4 components per attribute.</li>
         *    <li><code>color</code> - RGBA color (normalized) usually from {@link GeometryInstance#color}.  32-bit floating-point.  4 components per attribute.</li>
         *    <li><code>pickColor</code> - RGBA color used for picking, created from {@link Context#createPickId}.  32-bit floating-point.  4 components per attribute.</li>
         * </ul>
         * </p>
         *
         * @type GeometryAttributes
         *
         * @default undefined
         *
         * @example
         * geometry.attributes.position = new GeometryAttribute({
         *   componentDatatype : ComponentDatatype.FLOAT,
         *   componentsPerAttribute : 3,
         *   values : new Float32Array()
         * });
         *
         * @see GeometryAttribute
         * @see VertexFormat
         */
        this.attributes = options.attributes;

        /**
         * Optional index data that - along with {@link Geometry#primitiveType} -
         * determines the primitives in the geometry.
         *
         * @type Array
         *
         * @default undefined
         */
        this.indices = options.indices;

        /**
         * The type of primitives in the geometry.  This is most often {@link PrimitiveType.TRIANGLES},
         * but can varying based on the specific geometry.
         *
         * @type PrimitiveType
         *
         * @default undefined
         */
        this.primitiveType = options.primitiveType;

        /**
         * An optional bounding sphere that fully encloses the geometry.  This is
         * commonly used for culling.
         *
         * @type BoundingSphere
         *
         * @default undefined
         */
        this.boundingSphere = options.boundingSphere;
    };

    /**
     * Computes the number of vertices in a geometry.  The runtime is linear with
     * respect to the number of attributes in a vertex, not the number of vertices.
     *
     * @memberof Geometry
     *
     * @param {Cartesian3} geometry The geometry.
     *
     * @returns {Number} The number of vertices in the geometry.
     *
     * @exception {DeveloperError} geometries is required.
     *
     * @example
     * var numVertices = Geometry.computeNumberOfVertices(geometry);
     */
    Geometry.computeNumberOfVertices = function(geometry) {
        if (!defined(geometry)) {
            throw new DeveloperError('geometry is required.');
        }

        var numberOfVertices = -1;
        for ( var property in geometry.attributes) {
            if (geometry.attributes.hasOwnProperty(property) &&
                    defined(geometry.attributes[property]) &&
                    defined(geometry.attributes[property].values)) {

                var attribute = geometry.attributes[property];
                var num = attribute.values.length / attribute.componentsPerAttribute;
                if ((numberOfVertices !== num) && (numberOfVertices !== -1)) {
                    throw new DeveloperError('All attribute lists must have the same number of attributes.');
                }
                numberOfVertices = num;
            }
        }

        return numberOfVertices;
    };

    return Geometry;
});

/*global define*/
define('Core/GeometryAttribute',[
        './defaultValue',
        './defined',
        './DeveloperError'
    ], function(
        defaultValue,
        defined,
        DeveloperError) {
    "use strict";

    /**
     * Values and type information for geometry attributes.  A {@link Geometry}
     * generally contains one or more attributes.  All attributes together form
     * the geometry's vertices.
     *
     * @alias GeometryAttribute
     * @constructor
     *
     * @param {ComponentDatatype} [options.componentDatatype=undefined] The datatype of each component in the attribute, e.g., individual elements in values.
     * @param {Number} [options.componentsPerAttribute=undefined] A number between 1 and 4 that defines the number of components in an attributes.
     * @param {Boolean} [options.normalize=false] When <code>true</code> and <code>componentDatatype</code> is an integer format, indicate that the components should be mapped to the range [0, 1] (unsigned) or [-1, 1] (signed) when they are accessed as floating-point for rendering.
     * @param {Array} [options.values=undefined] The values for the attributes stored in a typed array.
     *
     * @exception {DeveloperError} options.componentDatatype is required.
     * @exception {DeveloperError} options.componentsPerAttribute is required.
     * @exception {DeveloperError} options.componentsPerAttribute must be between 1 and 4.
     * @exception {DeveloperError} options.values is required.
     *
     * @example
     * var geometry = new Geometry({
     *   attributes : {
     *     position : new GeometryAttribute({
     *       componentDatatype : ComponentDatatype.FLOAT,
     *       componentsPerAttribute : 3,
     *       values : [
     *         0.0, 0.0, 0.0,
     *         7500000.0, 0.0, 0.0,
     *         0.0, 7500000.0, 0.0
     *       ]
     *     })
     *   },
     *   primitiveType : PrimitiveType.LINE_LOOP
     * });
     *
     * @see Geometry
     */
    var GeometryAttribute = function(options) {
        options = defaultValue(options, defaultValue.EMPTY_OBJECT);

        if (!defined(options.componentDatatype)) {
            throw new DeveloperError('options.componentDatatype is required.');
        }

        if (!defined(options.componentsPerAttribute)) {
            throw new DeveloperError('options.componentsPerAttribute is required.');
        }

        if (options.componentsPerAttribute < 1 || options.componentsPerAttribute > 4) {
            throw new DeveloperError('options.componentsPerAttribute must be between 1 and 4.');
        }

        if (!defined(options.values)) {
            throw new DeveloperError('options.values is required.');
        }

        /**
         * The datatype of each component in the attribute, e.g., individual elements in
         * {@see GeometryAttribute#values}.
         *
         * @type ComponentDatatype
         *
         * @default undefined
         */
        this.componentDatatype = options.componentDatatype;

        /**
         * A number between 1 and 4 that defines the number of components in an attributes.
         * For example, a position attribute with x, y, and z components would have 3 as
         * shown in the code example.
         *
         * @type Number
         *
         * @default undefined
         *
         * @example
         * attribute.componentDatatype : ComponentDatatype.FLOAT,
         * attribute.componentsPerAttribute : 3,
         * attribute.values = new Float32Array([
         *   0.0, 0.0, 0.0,
         *   7500000.0, 0.0, 0.0,
         *   0.0, 7500000.0, 0.0
         * ]);
         */
        this.componentsPerAttribute = options.componentsPerAttribute;

        /**
         * When <code>true</code> and <code>componentDatatype</code> is an integer format,
         * indicate that the components should be mapped to the range [0, 1] (unsigned)
         * or [-1, 1] (signed) when they are accessed as floating-point for rendering.
         * <p>
         * This is commonly used when storing colors using {@ ComponentDatatype.UNSIGNED_BYTE}.
         * </p>
         *
         * @type Boolean
         *
         * @default false
         *
         * @example
         * attribute.componentDatatype : ComponentDatatype.UNSIGNED_BYTE,
         * attribute.componentsPerAttribute : 4,
         * attribute.normalize = true;
         * attribute.values = new Uint8Array([
         *   Color.floatToByte(color.red)
         *   Color.floatToByte(color.green)
         *   Color.floatToByte(color.blue)
         *   Color.floatToByte(color.alpha)
         * ]);
         */
        this.normalize = defaultValue(options.normalize, false);

        /**
         * The values for the attributes stored in a typed array.  In the code example,
         * every three elements in <code>values</code> defines one attributes since
         * <code>componentsPerAttribute</code> is 3.
         *
         * @type Array
         *
         * @default undefined
         *
         * @example
         * attribute.componentDatatype : ComponentDatatype.FLOAT,
         * attribute.componentsPerAttribute : 3,
         * attribute.values = new Float32Array([
         *   0.0, 0.0, 0.0,
         *   7500000.0, 0.0, 0.0,
         *   0.0, 7500000.0, 0.0
         * ]);
         */
        this.values = options.values;
    };

    return GeometryAttribute;
});

/*global define*/
define('Core/GeometryAttributes',['./defaultValue'], function(defaultValue) {
    "use strict";

    /**
     * Attributes, which make up a geometry's vertices.  Each property in this object corresponds to a
     * {@link GeometryAttribute} containing the attribute's data.
     * <p>
     * Attributes are always stored non-interleaved in a Geometry.  When geometry is prepared for rendering
     * with {@link Context#createVertexArrayFromGeometry}, attributes are generally written interleaved
     * into the vertex buffer for better rendering performance.
     * </p>
     *
     * @alias VertexFormat
     * @constructor
     */
    var GeometryAttributes = function(options) {
        options = defaultValue(options, defaultValue.EMPTY_OBJECT);

        /**
         * The 3D position attribute.
         * <p>
         * 64-bit floating-point (for precision).  3 components per attribute.
         * </p>
         *
         * @type GeometryAttribute
         *
         * @default undefined
         */
        this.position = options.position;

        /**
         * The normal attribute (normalized), which is commonly used for lighting.
         * <p>
         * 32-bit floating-point.  3 components per attribute.
         * </p>
         *
         * @type GeometryAttribute
         *
         * @default undefined
         */
        this.normal = options.normal;

        /**
         * The 2D texture coordinate attribute.
         * <p>
         * 32-bit floating-point.  2 components per attribute
         * </p>
         *
         * @type GeometryAttribute
         *
         * @default undefined
         */
        this.st = options.st;

        /**
         * The binormal attribute (normalized), which is used for tangent-space effects like bump mapping.
         * <p>
         * 32-bit floating-point.  3 components per attribute.
         * </p>
         *
         * @type GeometryAttribute
         *
         * @default undefined
         */
        this.binormal = options.binormal;

        /**
         * The tangent attribute (normalized), which is used for tangent-space effects like bump mapping.
         * <p>
         * 32-bit floating-point.  3 components per attribute.
         * </p>
         *
         * @type GeometryAttribute
         *
         * @default undefined
         */
        this.tangent = options.tangent;

        /**
         * The color attribute.
         * <p>
         * 8-bit unsigned integer. 4 components per attribute.
         * </p>
         *
         * @type GeometryAttribute
         *
         * @default undefined
         */
        this.color = options.color;
    };

    return GeometryAttributes;
});
/*global define*/
define('Core/PrimitiveType',['./Enumeration'], function(Enumeration) {
    "use strict";

    /**
     * DOC_TBA
     *
     * @exports PrimitiveType
     */
    var PrimitiveType = {
        /**
         * DOC_TBA
         *
         * @type {Enumeration}
         * @constant
         * @default 0x0000
         */
        POINTS : new Enumeration(0x0000, 'POINTS'),
        /**
         * DOC_TBA
         *
         * @type {Enumeration}
         * @constant
         * @default 0x0001
         */
        LINES : new Enumeration(0x0001, 'LINES'),
        /**
         * DOC_TBA
         *
         * @type {Enumeration}
         * @constant
         * @default 0x0002
         */
        LINE_LOOP : new Enumeration(0x0002, 'LINE_LOOP'),
        /**
         * DOC_TBA
         *
         * @type {Enumeration}
         * @constant
         * @default 0x0003
         */
        LINE_STRIP : new Enumeration(0x0003, 'LINE_STRIP'),
        /**
         * DOC_TBA
         *
         * @type {Enumeration}
         * @constant
         * @default 0x0004
         */
        TRIANGLES : new Enumeration(0x0004, 'TRIANGLES'),
        /**
         * DOC_TBA
         *
         * @type {Enumeration}
         * @constant
         * @default 0x0004
         */
        TRIANGLE_STRIP : new Enumeration(0x0005, 'TRIANGLE_STRIP'),
        /**
         * DOC_TBA
         *
         * @type {Enumeration}
         * @constant
         * @default 0x0006
         */
        TRIANGLE_FAN : new Enumeration(0x0006, 'TRIANGLE_FAN'),

        /**
         * DOC_TBA
         *
         * @param {PrimitiveType} primitiveType
         *
         * @returns {Boolean}
         */
        validate : function(primitiveType) {
            return ((primitiveType.value === PrimitiveType.POINTS.value) ||
                    (primitiveType.value === PrimitiveType.LINES.value) ||
                    (primitiveType.value === PrimitiveType.LINE_LOOP.value) ||
                    (primitiveType.value === PrimitiveType.LINE_STRIP.value) ||
                    (primitiveType.value === PrimitiveType.TRIANGLES.value) ||
                    (primitiveType.value === PrimitiveType.TRIANGLE_STRIP.value) ||
                    (primitiveType.value === PrimitiveType.TRIANGLE_FAN.value));
        }
    };

    return PrimitiveType;
});

/*global define*/
define('Core/VertexFormat',[
        './defaultValue',
        './freezeObject'
    ], function(
        defaultValue,
        freezeObject) {
    "use strict";

    /**
     * A vertex format defines what attributes make up a vertex.  A VertexFormat can be provided
     * to a {@link Geometry} to request that certain properties be computed, e.g., just position,
     * position and normal, etc.
     *
     * @param {Object} [options=undefined] An object with boolean properties corresponding to VertexFormat properties as shown in the code example.
     *
     * @alias VertexFormat
     * @constructor
     *
     * @example
     * // Create a vertex format with position and 2D texture coordinate attributes.
     * var format = new VertexFormat({
     *   position : true,
     *   st : true
     * });
     *
     * @see Geometry#attributes
     */
    var VertexFormat = function(options) {
        options = defaultValue(options, defaultValue.EMPTY_OBJECT);

        /**
         * When <code>true</code>, the vertex has a 3D position attribute.
         * <p>
         * 64-bit floating-point (for precision).  3 components per attribute.
         * </p>
         *
         * @type Boolean
         *
         * @default false
         */
        this.position = defaultValue(options.position, false);

        /**
         * When <code>true</code>, the vertex has a normal attribute (normalized), which is commonly used for lighting.
         * <p>
         * 32-bit floating-point.  3 components per attribute.
         * </p>
         *
         * @type Boolean
         *
         * @default false
         */
        this.normal = defaultValue(options.normal, false);

        /**
         * When <code>true</code>, the vertex has a 2D texture coordinate attribute.
         * <p>
         * 32-bit floating-point.  2 components per attribute
         * </p>
         *
         * @type Boolean
         *
         * @default false
         */
        this.st = defaultValue(options.st, false);

        /**
         * When <code>true</code>, the vertex has a binormal attribute (normalized), which is used for tangent-space effects like bump mapping.
         * <p>
         * 32-bit floating-point.  3 components per attribute.
         * </p>
         *
         * @type Boolean
         *
         * @default false
         */
        this.binormal = defaultValue(options.binormal, false);

        /**
         * When <code>true</code>, the vertex has a tangent attribute (normalized), which is used for tangent-space effects like bump mapping.
         * <p>
         * 32-bit floating-point.  3 components per attribute.
         * </p>
         *
         * @type Boolean
         *
         * @default false
         */
        this.tangent = defaultValue(options.tangent, false);
    };

    /**
     * An immutable vertex format with only a position attribute.
     *
     * @memberof VertexFormat
     *
     * @see VertexFormat#position
     */
    VertexFormat.POSITION_ONLY = freezeObject(new VertexFormat({
        position : true
    }));

    /**
     * An immutable vertex format with position and normal attributes.
     * This is compatible with per-instance color appearances like {@link PerInstanceColorAppearance}.
     *
     * @memberof VertexFormat
     *
     * @see VertexFormat#position
     * @see VertexFormat#normal
     */
    VertexFormat.POSITION_AND_NORMAL = freezeObject(new VertexFormat({
        position : true,
        normal : true
    }));

    /**
     * An immutable vertex format with position, normal, and st attributes.
     * This is compatible with {@link MaterialAppearance} when {@link MaterialAppearance#materialSupport}
     * is <code>TEXTURED/code>.
     *
     * @memberof VertexFormat
     *
     * @see VertexFormat#position
     * @see VertexFormat#normal
     * @see VertexFormat#st
     */
    VertexFormat.POSITION_NORMAL_AND_ST = freezeObject(new VertexFormat({
        position : true,
        normal : true,
        st : true
    }));

    /**
     * An immutable vertex format with position and st attributes.
     * This is compatible with {@link EllipsoidSurfaceAppearance}.
     *
     * @memberof VertexFormat
     *
     * @see VertexFormat#position
     * @see VertexFormat#st
     */
    VertexFormat.POSITION_AND_ST = freezeObject(new VertexFormat({
        position : true,
        st : true
    }));

    /**
     * An immutable vertex format with all well-known attributes: position, normal, st, binormal, and tangent.
     *
     * @memberof VertexFormat
     *
     * @see VertexFormat#position
     * @see VertexFormat#normal
     * @see VertexFormat#st
     * @see VertexFormat#binormal
     * @see VertexFormat#tangent
     */
    VertexFormat.ALL = freezeObject(new VertexFormat({
        position : true,
        normal : true,
        st : true,
        binormal : true,
        tangent  : true
    }));

    /**
     * An immutable vertex format with position, normal, and st attributes.
     * This is compatible with most appearances and materials; however
     * normal and st attributes are not always required.  When this is
     * known in advance, another <code>VertexFormat</code> should be used.
     *
     * @memberof VertexFormat
     *
     * @see VertexFormat#position
     * @see VertexFormat#normal
     */
    VertexFormat.DEFAULT = VertexFormat.POSITION_NORMAL_AND_ST;

    return VertexFormat;
});
/**
 * @fileOverview
 * @license
 *
 * Grauw URI utilities
 *
 * See: http://hg.grauw.nl/grauw-lib/file/tip/src/uri.js
 *
 * @author Laurens Holst (http://www.grauw.nl/)
 *
 *   Copyright 2012 Laurens Holst
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
/*global define*/
define('ThirdParty/Uri',[],function() {

	/**
	 * Constructs a URI object.
	 * @constructor
	 * @class Implementation of URI parsing and base URI resolving algorithm in RFC 3986.
	 * @param {string|URI} uri A string or URI object to create the object from.
	 */
	function URI(uri) {
		if (uri instanceof URI) {  // copy constructor
			this.scheme = uri.scheme;
			this.authority = uri.authority;
			this.path = uri.path;
			this.query = uri.query;
			this.fragment = uri.fragment;
		} else if (uri) {  // uri is URI string or cast to string
			var c = parseRegex.exec(uri);
			this.scheme = c[1];
			this.authority = c[2];
			this.path = c[3];
			this.query = c[4];
			this.fragment = c[5];
		}
	};

	// Initial values on the prototype
	URI.prototype.scheme    = null;
	URI.prototype.authority = null;
	URI.prototype.path      = '';
	URI.prototype.query     = null;
	URI.prototype.fragment  = null;

	// Regular expression from RFC 3986 appendix B
	var parseRegex = new RegExp('^(?:([^:/?#]+):)?(?://([^/?#]*))?([^?#]*)(?:\\?([^#]*))?(?:#(.*))?$');

	/**
	 * Returns the scheme part of the URI.
	 * In "http://example.com:80/a/b?x#y" this is "http".
	 */
	URI.prototype.getScheme = function() {
		return this.scheme;
	};

	/**
	 * Returns the authority part of the URI.
	 * In "http://example.com:80/a/b?x#y" this is "example.com:80".
	 */
	URI.prototype.getAuthority = function() {
		return this.authority;
	};

	/**
	 * Returns the path part of the URI.
	 * In "http://example.com:80/a/b?x#y" this is "/a/b".
	 * In "mailto:mike@example.com" this is "mike@example.com".
	 */
	URI.prototype.getPath = function() {
		return this.path;
	};

	/**
	 * Returns the query part of the URI.
	 * In "http://example.com:80/a/b?x#y" this is "x".
	 */
	URI.prototype.getQuery = function() {
		return this.query;
	};

	/**
	 * Returns the fragment part of the URI.
	 * In "http://example.com:80/a/b?x#y" this is "y".
	 */
	URI.prototype.getFragment = function() {
		return this.fragment;
	};

	/**
	 * Tests whether the URI is an absolute URI.
	 * See RFC 3986 section 4.3.
	 */
	URI.prototype.isAbsolute = function() {
		return !!this.scheme && !this.fragment;
	};

	///**
	//* Extensive validation of the URI against the ABNF in RFC 3986
	//*/
	//URI.prototype.validate

	/**
	 * Tests whether the URI is a same-document reference.
	 * See RFC 3986 section 4.4.
	 *
	 * To perform more thorough comparison, you can normalise the URI objects.
	 */
	URI.prototype.isSameDocumentAs = function(uri) {
		return uri.scheme == this.scheme &&
		    uri.authority == this.authority &&
		         uri.path == this.path &&
		        uri.query == this.query;
	};

	/**
	 * Simple String Comparison of two URIs.
	 * See RFC 3986 section 6.2.1.
	 *
	 * To perform more thorough comparison, you can normalise the URI objects.
	 */
	URI.prototype.equals = function(uri) {
		return this.isSameDocumentAs(uri) && uri.fragment == this.fragment;
	};

	/**
	 * Normalizes the URI using syntax-based normalization.
	 * This includes case normalization, percent-encoding normalization and path segment normalization.
	 * XXX: Percent-encoding normalization does not escape characters that need to be escaped.
	 *      (Although that would not be a valid URI in the first place. See validate().)
	 * See RFC 3986 section 6.2.2.
	 */
	URI.prototype.normalize = function() {
		this.removeDotSegments();
		if (this.scheme)
			this.scheme = this.scheme.toLowerCase();
		if (this.authority)
			this.authority = this.authority.replace(authorityRegex, replaceAuthority).
									replace(caseRegex, replaceCase);
		if (this.path)
			this.path = this.path.replace(caseRegex, replaceCase);
		if (this.query)
			this.query = this.query.replace(caseRegex, replaceCase);
		if (this.fragment)
			this.fragment = this.fragment.replace(caseRegex, replaceCase);
	};

	var caseRegex = /%[0-9a-z]{2}/gi;
	var percentRegex = /[a-zA-Z0-9\-\._~]/;
	var authorityRegex = /(.*@)?([^@:]*)(:.*)?/;

	function replaceCase(str) {
		var dec = unescape(str);
		return percentRegex.test(dec) ? dec : str.toUpperCase();
	}

	function replaceAuthority(str, p1, p2, p3) {
		return (p1 || '') + p2.toLowerCase() + (p3 || '');
	}

	/**
	 * Resolve a relative URI (this) against a base URI.
	 * The base URI must be an absolute URI.
	 * See RFC 3986 section 5.2
	 */
	URI.prototype.resolve = function(baseURI) {
		var uri = new URI();
		if (this.scheme) {
			uri.scheme = this.scheme;
			uri.authority = this.authority;
			uri.path = this.path;
			uri.query = this.query;
		} else {
			uri.scheme = baseURI.scheme;
			if (this.authority) {
				uri.authority = this.authority;
				uri.path = this.path;
				uri.query = this.query;
			} else {
				uri.authority = baseURI.authority;
				if (this.path == '') {
					uri.path = baseURI.path;
					uri.query = this.query || baseURI.query;
				} else {
					if (this.path.charAt(0) == '/') {
						uri.path = this.path;
						uri.removeDotSegments();
					} else {
						if (baseURI.authority && baseURI.path == '') {
							uri.path = '/' + this.path;
						} else {
							uri.path = baseURI.path.substring(0, baseURI.path.lastIndexOf('/') + 1) + this.path;
						}
						uri.removeDotSegments();
					}
					uri.query = this.query;
				}
			}
		}
		uri.fragment = this.fragment;
		return uri;
	};

	/**
	 * Remove dot segments from path.
	 * See RFC 3986 section 5.2.4
	 * @private
	 */
	URI.prototype.removeDotSegments = function() {
		var input = this.path.split('/'),
			output = [],
			segment,
			absPath = input[0] == '';
		if (absPath)
			input.shift();
		var sFirst = input[0] == '' ? input.shift() : null;
		while (input.length) {
			segment = input.shift();
			if (segment == '..') {
				output.pop();
			} else if (segment != '.') {
				output.push(segment);
			}
		}
		if (segment == '.' || segment == '..')
			output.push('');
		if (absPath)
			output.unshift('');
		this.path = output.join('/');
	};

	/**
	 * Resolves a relative URI against an absolute base URI.
	 * Convenience method.
	 * @param {String} uri the relative URI to resolve
	 * @param {String} baseURI the base URI (must be absolute) to resolve against
	 */
	URI.resolve = function(sURI, sBaseURI) {
		var uri = cache[sURI] || (cache[sURI] = new URI(sURI));
		var baseURI = cache[sBaseURI] || (cache[sBaseURI] = new URI(sBaseURI));
		return uri.resolve(baseURI).toString();
	};

	var cache = {};

	/**
	 * Serialises the URI to a string.
	 */
	URI.prototype.toString = function() {
		var result = '';
		if (this.scheme)
			result += this.scheme + ':';
		if (this.authority)
			result += '//' + this.authority;
		result += this.path;
		if (this.query)
			result += '?' + this.query;
		if (this.fragment)
			result += '#' + this.fragment;
		return result;
	};

return URI;
});

/*global define*/
define('Core/buildModuleUrl',[
        'require',
        './defined',
        './DeveloperError',
        '../ThirdParty/Uri'
    ], function(
        require,
        defined,
        DeveloperError,
        Uri) {
    "use strict";
    /*global CESIUM_BASE_URL*/

    var cesiumScriptRegex = /((?:.*\/)|^)cesium[\w-]*\.js(?:\W|$)/i;
    function getBaseUrlFromCesiumScript() {
        var scripts = document.getElementsByTagName('script');
        for ( var i = 0, len = scripts.length; i < len; ++i) {
            var src = scripts[i].getAttribute('src');
            var result = cesiumScriptRegex.exec(src);
            if (result !== null) {
                return result[1];
            }
        }
        return undefined;
    }

    var baseUrl;
    function getCesiumBaseUrl() {
        if (defined(baseUrl)) {
            return baseUrl;
        }

        var baseUrlString;
        if (typeof CESIUM_BASE_URL !== 'undefined') {
            baseUrlString = CESIUM_BASE_URL;
        } else {
            baseUrlString = getBaseUrlFromCesiumScript();
        }

        if (!defined(baseUrlString)) {
            throw new DeveloperError('Unable to determine Cesium base URL automatically, try defining a global variable called CESIUM_BASE_URL.');
        }

        baseUrl = new Uri(baseUrlString).resolve(new Uri(document.location.href));

        return baseUrl;
    }

    function buildModuleUrlFromRequireToUrl(moduleID) {
        //moduleID will be non-relative, so require it relative to this module, in Core.
        return require.toUrl('../' + moduleID);
    }

    function buildModuleUrlFromBaseUrl(moduleID) {
        return new Uri(moduleID).resolve(getCesiumBaseUrl()).toString();
    }

    var implementation;
    var a;

    /**
     * Given a non-relative moduleID, returns an absolute URL to the file represented by that module ID,
     * using, in order of preference, require.toUrl, the value of a global CESIUM_BASE_URL, or
     * the base URL of the Cesium.js script.
     *
     * @private
     */
    var buildModuleUrl = function(moduleID) {
        if (!defined(implementation)) {
            //select implementation
            if (defined(require.toUrl)) {
                implementation = buildModuleUrlFromRequireToUrl;
            } else {
                implementation = buildModuleUrlFromBaseUrl;
            }
        }

        if (!defined(a)) {
            a = document.createElement('a');
        }

        var url = implementation(moduleID);

        a.href = url;
        a.href = a.href; // IE only absolutizes href on get, not set

        return a.href;
    };

    // exposed for testing
    buildModuleUrl._cesiumScriptRegex = cesiumScriptRegex;

    return buildModuleUrl;
});
/*global define*/
define('Core/Iau2006XysSample',[],function() {
    "use strict";

    /**
     * An IAU 2006 XYS value sampled at a particular time.
     *
     * @alias Iau2006XysSample
     * @constructor
     *
     * @param {Number} x The X value.
     * @param {Number} y The Y value.
     * @param {Number} s The S value.
     */
    var Iau2006XysSample = function Iau2006XysSample(x, y, s) {
        /**
         * The X value.
         * @type {Number}
         */
        this.x = x;

        /**
         * The Y value.
         * @type {Number}
         */
        this.y = y;

        /**
         * The S value.
         * @type {Number}
         */
        this.s = s;
    };

    return Iau2006XysSample;
});
/*global define*/
define('Core/binarySearch',[
        './defined',
        './DeveloperError'
    ], function(
        defined,
        DeveloperError) {
    "use strict";

    /**
     * Finds an item in a sorted array.
     *
     * @exports binarySearch
     *
     * @param {Array} array The sorted array to search.
     * @param {Object} itemToFind The item to find in the array.
     *
     * @param {Function} comparator The function to use to compare the item to elements in the array.
     *        The first parameter passed to the comparator function is an item in the array, the
     *        second is <code>itemToFind</code>.  If the array item is less than <code>itemToFind</code>,
     *        the function should return a negative value.  If it is greater, the function should return
     *        a positive value.  If the items are equal, it should return 0.
     *
     * @returns {Number} The index of <code>itemToFind</code> in the array, if it exists.  If <code>itemToFind</code>
     *        does not exist, the return value is a negative number which is the bitwise complement (~)
     *        of the index before which the itemToFind should be inserted in order to maintain the
     *        sorted order of the array.
     *
     * @exception {DeveloperError} <code>array</code> is required.
     * @exception {DeveloperError} <code>toFind</code> is required.
     * @exception {DeveloperError} <code>comparator</code> is required.
     *
     * @example
     * // Create a comparator function to search through an array of numbers.
     * var comparator = function (a, b) {
     *     return a - b;
     * };
     * var numbers = [0, 2, 4, 6, 8];
     * var index = binarySearch(numbers, 6, comparator); // 3
     */
    var binarySearch = function(array, itemToFind, comparator) {
        if (!defined(array)) {
            throw new DeveloperError('array is required.');
        }
        if (!defined(itemToFind)) {
            throw new DeveloperError('itemToFind is required.');
        }
        if (!defined(comparator)) {
            throw new DeveloperError('comparator is required.');
        }

        var low = 0;
        var high = array.length - 1;
        var i;
        var comparison;

        while (low <= high) {
            i = ~~((low + high) / 2);
            comparison = comparator(array[i], itemToFind);
            if (comparison < 0) {
                low = i + 1;
                continue;
            }
            if (comparison > 0) {
                high = i - 1;
                continue;
            }
            return i;
        }
        return ~(high + 1);
    };

    return binarySearch;
});
/*global define*/
define('Core/TimeConstants',[],function() {
    "use strict";

    /**
     * Constants for time conversions like those done by {@link JulianDate}.
     *
     * @exports TimeConstants
     *
     * @see JulianDate
     */
    var TimeConstants = {
        /**
         * The number of seconds in one millisecond: <code>0.001</code>
         * @type {Number}
         * @constant
         * @default
         */
        SECONDS_PER_MILLISECOND : 0.001,

        /**
         * The number of seconds in one minute: <code>60</code>.
         * @type {Number}
         * @constant
         * @default
         */
        SECONDS_PER_MINUTE : 60.0,

        /**
         * The number of minutes in one hour: <code>60</code>.
         * @type {Number}
         * @constant
         * @default
         */
        MINUTES_PER_HOUR : 60.0,

        /**
         * The number of hours in one day: <code>24</code>.
         * @type {Number}
         * @constant
         * @default
         */
        HOURS_PER_DAY : 24.0,

        /**
         * The number of seconds in one hour: <code>3600</code>.
         * @type {Number}
         * @constant
         * @default
         */
        SECONDS_PER_HOUR : 3600.0,

        /**
         * The number of minutes in one day: <code>1440</code>.
         * @type {Number}
         * @constant
         * @default
         */
        MINUTES_PER_DAY : 1440.0,

        /**
         * The number of seconds in one day, ignoring leap seconds: <code>86400</code>.
         * @type {Number}
         * @constant
         * @default
         */
        SECONDS_PER_DAY : 86400.0,

        /**
         * The number of days in one Julian century: <code>36525</code>.
         * @type {Number}
         * @constant
         * @default
         */
        DAYS_PER_JULIAN_CENTURY : 36525.0,

        /**
         * One trillionth of a second.
         * @type {Number}
         * @constant
         * @default
         */
        PICOSECOND : 0.000000001,

        /**
         * DOC_TBA
         * @type {Number}
         * @constant
         * @default
         */
        MODIFIED_JULIAN_DATE_DIFFERENCE : 2400000.5
    };

    return TimeConstants;
});

/*global define*/
define('Core/LeapSecond',[
        './defined',
        './DeveloperError'
    ], function(
        defined,
        DeveloperError) {
    "use strict";

    /**
     * Describes a single leap second, which is constructed from a {@link JulianDate} and a
     * numerical offset representing the number of seconds TAI is ahead of the UTC time standard.
     *
     * @alias LeapSecond
     * @constructor
     *
     * @param {JulianDate} date A Julian date representing the time of the leap second.
     * @param {Number} offset The cumulative number of seconds, that TAI is ahead of UTC at provided date.
     *
     * @exception {DeveloperError} <code>date</code> is required.
     * @exception {DeveloperError} <code>offset</code> is required.
     *
     * @see JulianDate
     * @see TimeStandard
     *
     * @example
     * // Example 1. Construct a LeapSecond using a JulianDate
     * var date = new Date('January 1, 1990 00:00:00 UTC');
     * var leapSecond = new LeapSecond(JulianDate.fromDate(date), 25.0);
     * var offset = leapSecond.offset;    // 25.0
     *
     * //////////////////////////////////////////////////////////////////
     *
     * // Example 2. Construct a LeapSecond using a date string
     * var date = 'January 1, 1990 00:00:00 UTC';
     * var leapSecond = new LeapSecond(date, 25.0);
     */
    var LeapSecond = function(date, offset) {
        if (!defined(date)) {
            throw new DeveloperError('date is required.');
        }

        if (offset === null || isNaN(offset)) {
            throw new DeveloperError('offset is required and must be a number.');
        }

        /**
         * The Julian date at which this leap second occurs.
         *
         * @type {JulianDate}
         */
        this.julianDate = date;

        /**
         * The cumulative number of seconds between the UTC and TAI time standards at the time
         * of this leap second.
         *
         * @type {Number}
         */
        this.offset = offset;
    };

    /**
     * Sets the list of leap seconds used throughout Cesium.
     *
     * @memberof LeapSecond
     *
     * @param {Array} leapSeconds An array of {@link LeapSecond} objects.
     * @exception {DeveloperErrpr} leapSeconds is required and must be an array.
     *
     * @see LeapSecond.setLeapSeconds
     *
     * @example
     * LeapSecond.setLeapSeconds([
     *                            new LeapSecond(new JulianDate(2453736, 43233.0, TimeStandard.TAI), 33), // January 1, 2006 00:00:00 UTC
     *                            new LeapSecond(new JulianDate(2454832, 43234.0, TimeStandard.TAI), 34), // January 1, 2009 00:00:00 UTC
     *                            new LeapSecond(new JulianDate(2456109, 43235.0, TimeStandard.TAI), 35)  // July 1, 2012 00:00:00 UTC
     *                           ]);
     */
    LeapSecond.setLeapSeconds = function(leapSeconds) {
        if (!Array.isArray(leapSeconds)) {
            throw new DeveloperError("leapSeconds is required and must be an array.");
        }
        LeapSecond._leapSeconds = leapSeconds;
        LeapSecond._leapSeconds.sort(LeapSecond.compareLeapSecondDate);
    };

    /**
     * Returns a copy of the array of leap seconds used throughout Cesium. By default, this is the
     * official list of leap seconds that was available when Cesium was released.
     *
     * @memberof LeapSecond
     *
     * @returns {Array} A list of {@link LeapSecond} objects.
     *
     * @see LeapSecond.setLeapSeconds
     */
    LeapSecond.getLeapSeconds = function() {
        return LeapSecond._leapSeconds;
    };

    /**
     * Checks whether two leap seconds are equivalent to each other.
     *
     * @memberof LeapSecond
     *
     * @param {LeapSecond} other The leap second to compare against.
     *
     * @returns {Boolean} <code>true</code> if the leap seconds are equal; otherwise, <code>false</code>.
     *
     * @example
     * var date = new Date('January 1, 1990 00:00:00 UTC');
     * var leapSecond1 = new LeapSecond(JulianDate.fromDate(date), 25.0);
     * var leapSecond2 = new LeapSecond(JulianDate.fromDate(date), 25.0);
     * leapSecond1.equals(leapSecond2);     // true
     */
    LeapSecond.prototype.equals = function(other) {
        return this.julianDate.equals(other.julianDate) && (this.offset === other.offset);
    };

    /**
     * Given two leap seconds, determines which comes before the other by comparing
     * their respective Julian dates.
     *
     * @memberof LeapSecond
     *
     * @param {LeapSecond} leapSecond1 The first leap second to be compared.
     * @param {LeapSecond} leapSecond2 The second leap second to be compared.
     *
     * @returns {Number} A negative value if the first leap second is earlier than the second,
     *                  a positive value if the first leap second is later than the second, or
     *                  zero if the two leap seconds are equal (ignoring their offsets).
     *
     * @see JulianDate#lessThan
     * @see JulianDate#isAfter
     *
     * @example
     * var date = new Date('January 1, 2006 00:00:00 UTC');
     * var leapSecond1 = new LeapSecond(JulianDate.fromDate(date), 33.0);
     * var leapSecond2 = new LeapSecond(JulianDate.fromDate(date), 34.0);
     * LeapSecond.compareLeapSecondDate(leapSecond1, leapSecond2);    // returns 0
     */
    LeapSecond.compareLeapSecondDate = function(leapSecond1, leapSecond2) {
        return leapSecond1.julianDate.compareTo(leapSecond2.julianDate);
    };

    LeapSecond._leapSeconds = [];

    return LeapSecond;
});
/*global define*/
define('Core/TimeStandard',[],function() {
    "use strict";

    /**
     * Provides the type of time standards which JulianDate can take as input.
     *
     * @exports TimeStandard
     *
     * @see JulianDate
     */
    var TimeStandard = {
        /**
         * Represents the coordinated Universal Time (UTC) time standard.
         *
         * UTC is related to TAI according to the relationship
         * <code>UTC = TAI - deltaT</code> where <code>deltaT</code> is the number of leap
         * seconds which have been introduced as of the time in TAI.
         *
         */
        UTC : 0,

        /**
         * Represents the International Atomic Time (TAI) time standard.
         * TAI is the principal time standard to which the other time standards are related.
         */
        TAI : 1
    };

    return TimeStandard;
});
/*global define*/
define('Core/isLeapYear',[
        './DeveloperError'
    ], function(
        DeveloperError) {
    "use strict";

    /**
     * Determines if a given date is a leap year.
     *
     * @exports isLeapYear
     *
     * @param {Number} year The year to be tested.
     *
     * @returns {Boolean} True if <code>year</code> is a leap yer.
     *
     * @exception {DeveloperError} year is required and must be a number.
     *
     * @example
     * var leapYear = isLeapYear(2000); // true
     */
    function isLeapYear(year) {
        if (year === null || isNaN(year)) {
            throw new DeveloperError('year is required and must be a number.');
        }
        return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
    }

    return isLeapYear;
});

/**
@license
sprintf.js from the php.js project - https://github.com/kvz/phpjs
Directly from https://github.com/kvz/phpjs/blob/master/functions/strings/sprintf.js

php.js is copyright 2012 Kevin van Zonneveld.

Portions copyright Brett Zamir (http://brett-zamir.me), Kevin van Zonneveld
(http://kevin.vanzonneveld.net), Onno Marsman, Theriault, Michael White
(http://getsprink.com), Waldo Malqui Silva, Paulo Freitas, Jack, Jonas
Raoni Soares Silva (http://www.jsfromhell.com), Philip Peterson, Legaev
Andrey, Ates Goral (http://magnetiq.com), Alex, Ratheous, Martijn Wieringa,
Rafa? Kukawski (http://blog.kukawski.pl), lmeyrick
(https://sourceforge.net/projects/bcmath-js/), Nate, Philippe Baumann,
Enrique Gonzalez, Webtoolkit.info (http://www.webtoolkit.info/), Carlos R.
L. Rodrigues (http://www.jsfromhell.com), Ash Searle
(http://hexmen.com/blog/), Jani Hartikainen, travc, Ole Vrijenhoek,
Erkekjetter, Michael Grier, Rafa? Kukawski (http://kukawski.pl), Johnny
Mast (http://www.phpvrouwen.nl), T.Wild, d3x,
http://stackoverflow.com/questions/57803/how-to-convert-decimal-to-hex-in-javascript,
Rafa? Kukawski (http://blog.kukawski.pl/), stag019, pilus, WebDevHobo
(http://webdevhobo.blogspot.com/), marrtins, GeekFG
(http://geekfg.blogspot.com), Andrea Giammarchi
(http://webreflection.blogspot.com), Arpad Ray (mailto:arpad@php.net),
gorthaur, Paul Smith, Tim de Koning (http://www.kingsquare.nl), Joris, Oleg
Eremeev, Steve Hilder, majak, gettimeofday, KELAN, Josh Fraser
(http://onlineaspect.com/2007/06/08/auto-detect-a-time-zone-with-javascript/),
Marc Palau, Martin
(http://www.erlenwiese.de/), Breaking Par Consulting Inc
(http://www.breakingpar.com/bkp/home.nsf/0/87256B280015193F87256CFB006C45F7),
Chris, Mirek Slugen, saulius, Alfonso Jimenez
(http://www.alfonsojimenez.com), Diplom@t (http://difane.com/), felix,
Mailfaker (http://www.weedem.fr/), Tyler Akins (http://rumkin.com), Caio
Ariede (http://caioariede.com), Robin, Kankrelune
(http://www.webfaktory.info/), Karol Kowalski, Imgen Tata
(http://www.myipdf.com/), mdsjack (http://www.mdsjack.bo.it), Dreamer,
Felix Geisendoerfer (http://www.debuggable.com/felix), Lars Fischer, AJ,
David, Aman Gupta, Michael White, Public Domain
(http://www.json.org/json2.js), Steven Levithan
(http://blog.stevenlevithan.com), Sakimori, Pellentesque Malesuada,
Thunder.m, Dj (http://phpjs.org/functions/htmlentities:425#comment_134018),
Steve Clay, David James, Francois, class_exists, nobbler, T. Wild, Itsacon
(http://www.itsacon.net/), date, Ole Vrijenhoek (http://www.nervous.nl/),
Fox, Raphael (Ao RUDLER), Marco, noname, Mateusz "loonquawl" Zalega, Frank
Forte, Arno, ger, mktime, john (http://www.jd-tech.net), Nick Kolosov
(http://sammy.ru), marc andreu, Scott Cariss, Douglas Crockford
(http://javascript.crockford.com), madipta, Slawomir Kaniecki,
ReverseSyntax, Nathan, Alex Wilson, kenneth, Bayron Guevara, Adam Wallner
(http://web2.bitbaro.hu/), paulo kuong, jmweb, Lincoln Ramsay, djmix,
Pyerre, Jon Hohle, Thiago Mata (http://thiagomata.blog.com), lmeyrick
(https://sourceforge.net/projects/bcmath-js/this.), Linuxworld, duncan,
Gilbert, Sanjoy Roy, Shingo, sankai, Oskar Larsson H?gfeldt
(http://oskar-lh.name/), Denny Wardhana, 0m3r, Everlasto, Subhasis Deb,
josh, jd, Pier Paolo Ramon (http://www.mastersoup.com/), P, merabi, Soren
Hansen, Eugene Bulkin (http://doubleaw.com/), Der Simon
(http://innerdom.sourceforge.net/), echo is bad, Ozh, XoraX
(http://www.xorax.info), EdorFaus, JB, J A R, Marc Jansen, Francesco, LH,
Stoyan Kyosev (http://www.svest.org/), nord_ua, omid
(http://phpjs.org/functions/380:380#comment_137122), Brad Touesnard, MeEtc
(http://yass.meetcweb.com), Peter-Paul Koch
(http://www.quirksmode.org/js/beat.html), Olivier Louvignes
(http://mg-crea.com/), T0bsn, Tim Wiel, Bryan Elliott, Jalal Berrami,
Martin, JT, David Randall, Thomas Beaucourt (http://www.webapp.fr), taith,
vlado houba, Pierre-Luc Paour, Kristof Coomans (SCK-CEN Belgian Nucleair
Research Centre), Martin Pool, Kirk Strobeck, Rick Waldron, Brant Messenger
(http://www.brantmessenger.com/), Devan Penner-Woelk, Saulo Vallory, Wagner
B. Soares, Artur Tchernychev, Valentina De Rosa, Jason Wong
(http://carrot.org/), Christoph, Daniel Esteban, strftime, Mick@el, rezna,
Simon Willison (http://simonwillison.net), Anton Ongson, Gabriel Paderni,
Marco van Oort, penutbutterjelly, Philipp Lenssen, Bjorn Roesbeke
(http://www.bjornroesbeke.be/), Bug?, Eric Nagel, Tomasz Wesolowski,
Evertjan Garretsen, Bobby Drake, Blues (http://tech.bluesmoon.info/), Luke
Godfrey, Pul, uestla, Alan C, Ulrich, Rafal Kukawski, Yves Sucaet,
sowberry, Norman "zEh" Fuchs, hitwork, Zahlii, johnrembo, Nick Callen,
Steven Levithan (stevenlevithan.com), ejsanders, Scott Baker, Brian Tafoya
(http://www.premasolutions.com/), Philippe Jausions
(http://pear.php.net/user/jausions), Aidan Lister
(http://aidanlister.com/), Rob, e-mike, HKM, ChaosNo1, metjay, strcasecmp,
strcmp, Taras Bogach, jpfle, Alexander Ermolaev
(http://snippets.dzone.com/user/AlexanderErmolaev), DxGx, kilops, Orlando,
dptr1988, Le Torbi, James (http://www.james-bell.co.uk/), Pedro Tainha
(http://www.pedrotainha.com), James, Arnout Kazemier
(http://www.3rd-Eden.com), Chris McMacken, gabriel paderni, Yannoo,
FGFEmperor, baris ozdil, Tod Gentille, Greg Frazier, jakes, 3D-GRAF, Allan
Jensen (http://www.winternet.no), Howard Yeend, Benjamin Lupton, davook,
daniel airton wermann (http://wermann.com.br), Atli T¨®r, Maximusya, Ryan
W Tenney (http://ryan.10e.us), Alexander M Beedie, fearphage
(http://http/my.opera.com/fearphage/), Nathan Sepulveda, Victor, Matteo,
Billy, stensi, Cord, Manish, T.J. Leahy, Riddler
(http://www.frontierwebdev.com/), Rafa? Kukawski, FremyCompany, Matt
Bradley, Tim de Koning, Luis Salazar (http://www.freaky-media.com/), Diogo
Resende, Rival, Andrej Pavlovic, Garagoth, Le Torbi
(http://www.letorbi.de/), Dino, Josep Sanz (http://www.ws3.es/), rem,
Russell Walker (http://www.nbill.co.uk/), Jamie Beck
(http://www.terabit.ca/), setcookie, Michael, YUI Library:
http://developer.yahoo.com/yui/docs/YAHOO.util.DateLocale.html, Blues at
http://hacks.bluesmoon.info/strftime/strftime.js, Ben
(http://benblume.co.uk/), DtTvB
(http://dt.in.th/2008-09-16.string-length-in-bytes.html), Andreas, William,
meo, incidence, Cagri Ekin, Amirouche, Amir Habibi
(http://www.residence-mixte.com/), Luke Smith (http://lucassmith.name),
Kheang Hok Chin (http://www.distantia.ca/), Jay Klehr, Lorenzo Pisani,
Tony, Yen-Wei Liu, Greenseed, mk.keck, Leslie Hoare, dude, booeyOH, Ben
Bryan

Licensed under the MIT (MIT-LICENSE.txt) license.

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL KEVIN VAN ZONNEVELD BE LIABLE FOR ANY CLAIM, DAMAGES
OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

/*global define*/
define('ThirdParty/sprintf',[],function() {

function sprintf () {
  // http://kevin.vanzonneveld.net
  // +   original by: Ash Searle (http://hexmen.com/blog/)
  // + namespaced by: Michael White (http://getsprink.com)
  // +    tweaked by: Jack
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      input by: Paulo Freitas
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      input by: Brett Zamir (http://brett-zamir.me)
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Dj
  // +   improved by: Allidylls
  // *     example 1: sprintf("%01.2f", 123.1);
  // *     returns 1: 123.10
  // *     example 2: sprintf("[%10s]", 'monkey');
  // *     returns 2: '[    monkey]'
  // *     example 3: sprintf("[%'#10s]", 'monkey');
  // *     returns 3: '[####monkey]'
  // *     example 4: sprintf("%d", 123456789012345);
  // *     returns 4: '123456789012345'
  var regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g;
  var a = arguments,
    i = 0,
    format = a[i++];

  // pad()
  var pad = function (str, len, chr, leftJustify) {
    if (!chr) {
      chr = ' ';
    }
    var padding = (str.length >= len) ? '' : Array(1 + len - str.length >>> 0).join(chr);
    return leftJustify ? str + padding : padding + str;
  };

  // justify()
  var justify = function (value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
    var diff = minWidth - value.length;
    if (diff > 0) {
      if (leftJustify || !zeroPad) {
        value = pad(value, minWidth, customPadChar, leftJustify);
      } else {
        value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
      }
    }
    return value;
  };

  // formatBaseX()
  var formatBaseX = function (value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
    // Note: casts negative numbers to positive ones
    var number = value >>> 0;
    prefix = prefix && number && {
      '2': '0b',
      '8': '0',
      '16': '0x'
    }[base] || '';
    value = prefix + pad(number.toString(base), precision || 0, '0', false);
    return justify(value, prefix, leftJustify, minWidth, zeroPad);
  };

  // formatString()
  var formatString = function (value, leftJustify, minWidth, precision, zeroPad, customPadChar) {
    if (precision != null) {
      value = value.slice(0, precision);
    }
    return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
  };

  // doFormat()
  var doFormat = function (substring, valueIndex, flags, minWidth, _, precision, type) {
    var number;
    var prefix;
    var method;
    var textTransform;
    var value;

    if (substring == '%%') {
      return '%';
    }

    // parse flags
    var leftJustify = false,
      positivePrefix = '',
      zeroPad = false,
      prefixBaseX = false,
      customPadChar = ' ';
    var flagsl = flags.length;
    for (var j = 0; flags && j < flagsl; j++) {
      switch (flags.charAt(j)) {
      case ' ':
        positivePrefix = ' ';
        break;
      case '+':
        positivePrefix = '+';
        break;
      case '-':
        leftJustify = true;
        break;
      case "'":
        customPadChar = flags.charAt(j + 1);
        break;
      case '0':
        zeroPad = true;
        break;
      case '#':
        prefixBaseX = true;
        break;
      }
    }

    // parameters may be null, undefined, empty-string or real valued
    // we want to ignore null, undefined and empty-string values
    if (!minWidth) {
      minWidth = 0;
    } else if (minWidth == '*') {
      minWidth = +a[i++];
    } else if (minWidth.charAt(0) == '*') {
      minWidth = +a[minWidth.slice(1, -1)];
    } else {
      minWidth = +minWidth;
    }

    // Note: undocumented perl feature:
    if (minWidth < 0) {
      minWidth = -minWidth;
      leftJustify = true;
    }

    if (!isFinite(minWidth)) {
      throw new Error('sprintf: (minimum-)width must be finite');
    }

    if (!precision) {
      precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type == 'd') ? 0 : undefined;
    } else if (precision == '*') {
      precision = +a[i++];
    } else if (precision.charAt(0) == '*') {
      precision = +a[precision.slice(1, -1)];
    } else {
      precision = +precision;
    }

    // grab value using valueIndex if required?
    value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];

    switch (type) {
    case 's':
      return formatString(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar);
    case 'c':
      return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
    case 'b':
      return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
    case 'o':
      return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
    case 'x':
      return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
    case 'X':
      return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).toUpperCase();
    case 'u':
      return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
    case 'i':
    case 'd':
      number = +value || 0;
      number = Math.round(number - number % 1); // Plain Math.round doesn't just truncate
      prefix = number < 0 ? '-' : positivePrefix;
      value = prefix + pad(String(Math.abs(number)), precision, '0', false);
      return justify(value, prefix, leftJustify, minWidth, zeroPad);
    case 'e':
    case 'E':
    case 'f': // Should handle locales (as per setlocale)
    case 'F':
    case 'g':
    case 'G':
      number = +value;
      prefix = number < 0 ? '-' : positivePrefix;
      method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
      textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
      value = prefix + Math.abs(number)[method](precision);
      return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
    default:
      return substring;
    }
  };

  return format.replace(regex, doFormat);
}

return sprintf;
});
/*global define*/
define('Core/JulianDate',[
        './DeveloperError',
        './binarySearch',
        './defined',
        './TimeConstants',
        './LeapSecond',
        './TimeStandard',
        './isLeapYear',
        '../ThirdParty/sprintf'
    ], function(
        DeveloperError,
        binarySearch,
        defined,
        TimeConstants,
        LeapSecond,
        TimeStandard,
        isLeapYear,
        sprintf) {
    "use strict";

    /**
     * The object returned by {@link JulianDate#toGregorianDate}.
     *
     * @alias GregorianDate
     * @see JulianDate#toGregorianDate
     * @constructor
     */
    var GregorianDate = function(year, month, day, hour, minute, second, millisecond, isLeapSecond) {
        /**
         * The year, a whole number.
         * @type {Number}
         */
        this.year = year;
        /**
         * The month, a whole number with range [1, 12].
         * @type {Number}
         */
        this.month = month;
        /**
         * The day, a whole number with range 1.
         * @type {Number}
         */
        this.day = day;
        /**
         * The hour, a whole number with range [0, 23].
         * @type {Number}
         */
        this.hour = hour;
        /**
         * The minute, a whole number with range [0, 59].
         * @type {Number}
         */
        this.minute = minute;
        /**
         * The second, a whole number with range [0, 60], with 60 representing a leap second.
         * @type {Number}
         */
        this.second = second;
        /**
         * The millisecond, a floating point number with range [0.0, 1000.0).
         * @type {Number}
         */
        this.millisecond = millisecond;
        /**
         * True if this date is during a leap second.
         * @type {Boolean}
         */
        this.isLeapSecond = isLeapSecond;
    };

    var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var daysInLeapFeburary = 29;

    // we don't really need a leap second instance, anything with a julianDate property will do
    var binarySearchScratchLeapSecond = {
        julianDate : undefined
    };
    function convertUtcToTai(julianDate) {
        //Even though julianDate is in UTC, we'll treat it as TAI and
        //search the leap second table for it.
        binarySearchScratchLeapSecond.julianDate = julianDate;
        var leapSeconds = LeapSecond.getLeapSeconds();
        var index = binarySearch(leapSeconds, binarySearchScratchLeapSecond, LeapSecond.compareLeapSecondDate);

        if (index < 0) {
            index = ~index;
        }

        if (index >= leapSeconds.length) {
            index = leapSeconds.length - 1;
        }

        var offset = leapSeconds[index].offset;
        if (index > 0) {
            //Now we have the index of the closest leap second that comes on or after our UTC time.
            //However, if the difference between the UTC date being converted and the TAI
            //defined leap second is greater than the offset, we are off by one and need to use
            //the previous leap second.
            var difference = julianDate.getSecondsDifference(leapSeconds[index].julianDate);
            if (difference > offset) {
                index--;
                offset = leapSeconds[index].offset;
            }
        }

        julianDate.addSeconds(offset, julianDate);
    }

    function convertTaiToUtc(julianDate, result) {
        binarySearchScratchLeapSecond.julianDate = julianDate;
        var leapSeconds = LeapSecond.getLeapSeconds();
        var index = binarySearch(leapSeconds, binarySearchScratchLeapSecond, LeapSecond.compareLeapSecondDate);
        if (index < 0) {
            index = ~index;
        }

        //All times before our first leap second get the first offset.
        if (index === 0) {
            return julianDate.addSeconds(-leapSeconds[0].offset, result);
        }

        //All times after our leap second get the last offset.
        if (index >= leapSeconds.length) {
            return julianDate.addSeconds(-leapSeconds[index - 1].offset, result);
        }

        //Compute the difference between the found leap second and the time we are converting.
        var difference = julianDate.getSecondsDifference(leapSeconds[index].julianDate);

        if (difference === 0) {
            //The date is in our leap second table.
            return julianDate.addSeconds(-leapSeconds[index].offset, result);
        }

        if (difference <= 1.0) {
            //The requested date is during the moment of a leap second, then we cannot convert to UTC
            return undefined;
        }

        //The time is in between two leap seconds, index is the leap second after the date
        //we're converting, so we subtract one to get the correct LeapSecond instance.
        return julianDate.addSeconds(-leapSeconds[--index].offset, result);
    }

    function setComponents(wholeDays, secondsOfDay, julianDate) {
        var extraDays = (secondsOfDay / TimeConstants.SECONDS_PER_DAY) | 0;
        wholeDays += extraDays;
        secondsOfDay -= TimeConstants.SECONDS_PER_DAY * extraDays;

        if (secondsOfDay < 0) {
            wholeDays--;
            secondsOfDay += TimeConstants.SECONDS_PER_DAY;
        }

        if (!defined(julianDate)) {
            return new JulianDate(wholeDays, secondsOfDay, TimeStandard.TAI);
        }

        julianDate._julianDayNumber = wholeDays;
        julianDate._secondsOfDay = secondsOfDay;
        return julianDate;
    }

    function computeJulianDateComponents(year, month, day, hour, minute, second, millisecond) {
        // Algorithm from page 604 of the Explanatory Supplement to the
        // Astronomical Almanac (Seidelmann 1992).

        var a = ((month - 14) / 12) | 0;
        var b = year + 4800 + a;
        var dayNumber = (((1461 * b) / 4) | 0) + (((367 * (month - 2 - 12 * a)) / 12) | 0) - (((3 * ((b + 100) / 100)) / 4) | 0) + day - 32075;

        // JulianDates are noon-based
        hour = hour - 12;
        if (hour < 0) {
            hour += 24;
        }

        var secondsOfDay = second + ((hour * TimeConstants.SECONDS_PER_HOUR) + (minute * TimeConstants.SECONDS_PER_MINUTE) + (millisecond * TimeConstants.SECONDS_PER_MILLISECOND));

        if (secondsOfDay >= 43200.0) {
            dayNumber -= 1;
        }

        return [dayNumber, secondsOfDay];
    }

    function computeJulianDateComponentsFromDate(date) {
        return computeJulianDateComponents(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
    }

    //Regular expressions used for ISO8601 date parsing.
    //YYYY
    var matchCalendarYear = /^(\d{4})$/;
    //YYYY-MM (YYYYMM is invalid)
    var matchCalendarMonth = /^(\d{4})-(\d{2})$/;
    //YYYY-DDD or YYYYDDD
    var matchOrdinalDate = /^(\d{4})-?(\d{3})$/;
    //YYYY-Www or YYYYWww or YYYY-Www-D or YYYYWwwD
    var matchWeekDate = /^(\d{4})-?W(\d{2})-?(\d{1})?$/;
    //YYYY-MM-DD or YYYYMMDD
    var matchCalendarDate = /^(\d{4})-?(\d{2})-?(\d{2})$/;
    // Match utc offset
    var utcOffset = /([Z+\-])?(\d{2})?:?(\d{2})?$/;
    // Match hours HH or HH.xxxxx
    var matchHours = /^(\d{2})(\.\d+)?/.source + utcOffset.source;
    // Match hours/minutes HH:MM HHMM.xxxxx
    var matchHoursMinutes = /^(\d{2}):?(\d{2})(\.\d+)?/.source + utcOffset.source;
    // Match hours/minutes HH:MM:SS HHMMSS.xxxxx
    var matchHoursMinutesSeconds = /^(\d{2}):?(\d{2}):?(\d{2})(\.\d+)?/.source + utcOffset.source;

    var iso8601ErrorMessage = 'Valid ISO 8601 date string required.';

    /**
     * Constructs a JulianDate instance from a Julian day number, the number of seconds elapsed
     * into that day, and the time standard which the parameters are in.  Passing no parameters will
     * construct a JulianDate that represents the current system time.
     *
     * An astronomical Julian date is the number of days since noon on January 1, -4712 (4713 BC).
     * For increased precision, this class stores the whole number part of the date and the seconds
     * part of the date in separate components.  In order to be safe for arithmetic and represent
     * leap seconds, the date is always stored in the International Atomic Time standard
     * {@link TimeStandard.TAI}.
     *
     * @alias JulianDate
     * @constructor
     * @immutable
     *
     * @param {Number} julianDayNumber The Julian Day Number representing the number of whole days.  Fractional days will also be handled correctly.
     * @param {Number} julianSecondsOfDay The number of seconds into the current Julian Day Number.  Fractional seconds, negative seconds and seconds greater than a day will be handled correctly.
     * @param {TimeStandard} [timeStandard = TimeStandard.UTC] The time standard in which the first two parameters are defined.
     *
     * @exception {DeveloperError} timeStandard is not a known TimeStandard.
     * @exception {DeveloperError} julianDayNumber is required.
     * @exception {DeveloperError} julianSecondsOfDay is required.
     *
     * @see JulianDate.fromDate
     * @see JulianDate.fromTotalDays
     * @see JulianDate.fromIso8601
     * @see TimeStandard
     * @see LeapSecond
     *
     * @example
     * // Example 1. Construct a JulianDate representing the current system time.
     * var julianDate = new JulianDate();
     *
     * // Example 2. Construct a JulianDate from a Julian day number and seconds of the day.
     * var julianDayNumber = 2448257;   // January 1, 1991
     * var secondsOfDay = 21600;        // 06:00:00
     * var julianDate = new JulianDate(julianDayNumber, secondsOfDay, TimeStandard.UTC);
     */
    var JulianDate = function(julianDayNumber, julianSecondsOfDay, timeStandard) {
        this._julianDayNumber = undefined;
        this._secondsOfDay = undefined;

        var wholeDays;
        var secondsOfDay;
        //If any of the properties are defined, then we are constructing from components.
        if (defined(julianDayNumber) || defined(julianSecondsOfDay) || defined(timeStandard)) {
            if (!defined(timeStandard)) {
                timeStandard = TimeStandard.UTC;
            } else if (timeStandard !== TimeStandard.UTC && timeStandard !== TimeStandard.TAI) {
                throw new DeveloperError('timeStandard is not a known TimeStandard.');
            }

            if (julianDayNumber === null || isNaN(julianDayNumber)) {
                throw new DeveloperError('julianDayNumber is required.');
            }

            if (julianSecondsOfDay === null || isNaN(julianSecondsOfDay)) {
                throw new DeveloperError('julianSecondsOfDay is required.');
            }

            //coerce to integer
            wholeDays = julianDayNumber | 0;
            //If julianDayNumber was fractional, add the number of seconds the fraction represented
            secondsOfDay = julianSecondsOfDay + (julianDayNumber - wholeDays) * TimeConstants.SECONDS_PER_DAY;
        } else {
            //Create a new date from the current time.
            var date = new Date();
            var components = computeJulianDateComponentsFromDate(date);
            wholeDays = components[0];
            secondsOfDay = components[1];
            timeStandard = TimeStandard.UTC;
        }

        setComponents(wholeDays, secondsOfDay, this);

        if (timeStandard === TimeStandard.UTC) {
            convertUtcToTai(this);
        }
    };

    /**
     * Duplicates a JulianDate instance.
     * @memberof JulianDate
     *
     * @param {Cartesian3} date The JulianDate to duplicate.
     * @param {Cartesian3} [result] The object onto which to store the JulianDate.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided. (Returns undefined if date is undefined)
     */
    JulianDate.clone = function(date, result) {
        if (!defined(date)) {
            return undefined;
        }
        if (!defined(result)) {
            return new JulianDate(date._julianDayNumber, date._secondsOfDay, TimeStandard.TAI);
        }
        result._julianDayNumber = date._julianDayNumber;
        result._secondsOfDay = date._secondsOfDay;
        return result;
    };

    /**
     * Creates a JulianDate instance from a JavaScript Date object.
     * While the JavaScript Date object defaults to the system's local time zone,
     * the JulianDate is computed using the UTC values.
     *
     * @memberof JulianDate
     *
     * @param {Date} date The JavaScript Date object representing the time to be converted to a JulianDate.
     * @param {TimeStandard} [timeStandard = TimeStandard.UTC] Indicates the time standard in which this JulianDate is represented.
     *
     * @returns {JulianDate} The new {@Link JulianDate} instance.
     *
     * @exception {DeveloperError} date must be a valid JavaScript Date.
     *
     * @see JulianDate
     * @see JulianDate.fromTotalDays
     * @see JulianDate.fromIso8601
     * @see TimeStandard
     * @see LeapSecond
     * @see <a href='http://www.w3schools.com/js/js_obj_date.asp'>JavaScript Date Object on w3schools</a>.
     * @see <a href='http://www.w3schools.com/jsref/jsref_obj_date.asp'>JavaScript Date Object Reference on w3schools</a>.
     *
     * @example
     * // Construct a JulianDate specifying the UTC time standard
     * var date = new Date('January 1, 2011 12:00:00 EST');
     * var julianDate = JulianDate.fromDate(date, TimeStandard.UTC);
     */
    JulianDate.fromDate = function(date, timeStandard) {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            throw new DeveloperError('date must be a valid JavaScript Date.');
        }

        var components = computeJulianDateComponentsFromDate(date);
        return new JulianDate(components[0], components[1], timeStandard);
    };

    /**
     * Creates a JulianDate instance from an ISO 8601 date string.  Unlike Date.parse,
     * this method properly accounts for all valid formats defined by the ISO 8601
     * specification.  It also properly handles leap seconds and sub-millisecond times.
     *
     * @memberof JulianDate
     *
     * @param {String} iso8601String The ISO 8601 date string representing the time to be converted to a JulianDate.
     *
     * @returns {JulianDate} The new {@Link JulianDate} instance.
     *
     * @exception {DeveloperError} Valid ISO 8601 date string required.
     *
     * @see JulianDate
     * @see JulianDate.fromTotalDays
     * @see JulianDate.fromDate
     * @see LeapSecond
     * @see <a href='http://en.wikipedia.org/wiki/ISO_8601'>ISO 8601 on Wikipedia</a>.
     *
     * @example
     * // Example 1. Construct a JulianDate in UTC at April 24th, 2012 6:08PM UTC
     * var julianDate = JulianDate.fromIso8601('2012-04-24T18:08Z');
     * // Example 2. Construct a JulianDate in local time April 24th, 2012 12:00 AM
     * var localDay = JulianDate.fromIso8601('2012-04-24');
     * // Example 3. Construct a JulianDate 5 hours behind UTC April 24th, 2012 5:00 pm UTC
     * var localDay = JulianDate.fromIso8601('2012-04-24T12:00-05:00');
     */
    JulianDate.fromIso8601 = function(iso8601String) {
        if (typeof iso8601String !== 'string') {
            throw new DeveloperError(iso8601ErrorMessage);
        }

        //Comma and decimal point both indicate a fractional number according to ISO 8601,
        //start out by blanket replacing , with . which is the only valid such symbol in JS.
        iso8601String = iso8601String.replace(',', '.');

        //Split the string into its date and time components, denoted by a mandatory T
        var tokens = iso8601String.split('T');
        var year;
        var month = 1;
        var day = 1;
        var hour = 0;
        var minute = 0;
        var second = 0;
        var millisecond = 0;

        //Lacking a time is okay, but a missing date is illegal.
        var date = tokens[0];
        var time = tokens[1];
        var tmp;
        var inLeapYear;
        if (!defined(date)) {
            throw new DeveloperError(iso8601ErrorMessage);
        }

        var dashCount;

        //First match the date against possible regular expressions.
        tokens = date.match(matchCalendarDate);
        if (tokens !== null) {
            dashCount = date.split('-').length - 1;
            if (dashCount > 0 && dashCount !== 2) {
                throw new DeveloperError(iso8601ErrorMessage);
            }
            year = +tokens[1];
            month = +tokens[2];
            day = +tokens[3];
        } else {
            tokens = date.match(matchCalendarMonth);
            if (tokens !== null) {
                year = +tokens[1];
                month = +tokens[2];
            } else {
                tokens = date.match(matchCalendarYear);
                if (tokens !== null) {
                    year = +tokens[1];
                } else {
                    //Not a year/month/day so it must be an ordinal date.
                    var dayOfYear;
                    tokens = date.match(matchOrdinalDate);
                    if (tokens !== null) {

                        year = +tokens[1];
                        dayOfYear = +tokens[2];
                        inLeapYear = isLeapYear(year);

                        //This validation is only applicable for this format.
                        if (dayOfYear < 1 || (inLeapYear && dayOfYear > 366) || (!inLeapYear && dayOfYear > 365)) {
                            throw new DeveloperError(iso8601ErrorMessage);
                        }
                    } else {
                        tokens = date.match(matchWeekDate);
                        if (tokens !== null) {
                            //ISO week date to ordinal date from
                            //http://en.wikipedia.org/w/index.php?title=ISO_week_date&oldid=474176775
                            year = +tokens[1];
                            var weekNumber = +tokens[2];
                            var dayOfWeek = +tokens[3] || 0;

                            dashCount = date.split('-').length - 1;
                            if (dashCount > 0 &&
                               ((!defined(tokens[3]) && dashCount !== 1) ||
                               (defined(tokens[3]) && dashCount !== 2))) {
                                throw new DeveloperError(iso8601ErrorMessage);
                            }

                            var january4 = new Date(Date.UTC(year, 0, 4));
                            dayOfYear = (weekNumber * 7) + dayOfWeek - january4.getUTCDay() - 3;
                        } else {
                            //None of our regular expressions succeeded in parsing the date properly.
                            throw new DeveloperError(iso8601ErrorMessage);
                        }
                    }
                    //Split an ordinal date into month/day.
                    tmp = new Date(Date.UTC(year, 0, 1));
                    tmp.setUTCDate(dayOfYear);
                    month = tmp.getUTCMonth() + 1;
                    day = tmp.getUTCDate();
                }
            }
        }

        //Now that we have all of the date components, validate them to make sure nothing is out of range.
        inLeapYear = isLeapYear(year);
        if (month < 1 || month > 12 || day < 1 || ((month !== 2 || !inLeapYear) && day > daysInMonth[month - 1]) || (inLeapYear && month === 2 && day > daysInLeapFeburary)) {
            throw new DeveloperError(iso8601ErrorMessage);
        }

        //Not move onto the time string, which is much simpler.
        var offsetIndex;
        if (defined(time)) {
            tokens = time.match(matchHoursMinutesSeconds);
            if (tokens !== null) {
                dashCount = time.split(':').length - 1;
                if (dashCount > 0 && dashCount !== 2 && dashCount !== 3) {
                    throw new DeveloperError(iso8601ErrorMessage);
                }

                hour = +tokens[1];
                minute = +tokens[2];
                second = +tokens[3];
                millisecond = +(tokens[4] || 0) * 1000.0;
                offsetIndex = 5;
            } else {
                tokens = time.match(matchHoursMinutes);
                if (tokens !== null) {
                    dashCount = time.split(':').length - 1;
                    if (dashCount > 0 && dashCount !== 1) {
                        throw new DeveloperError(iso8601ErrorMessage);
                    }

                    hour = +tokens[1];
                    minute = +tokens[2];
                    second = +(tokens[3] || 0) * 60.0;
                    offsetIndex = 4;
                } else {
                    tokens = time.match(matchHours);
                    if (tokens !== null) {
                        hour = +tokens[1];
                        minute = +(tokens[2] || 0) * 60.0;
                        offsetIndex = 3;
                    } else {
                        throw new DeveloperError(iso8601ErrorMessage);
                    }
                }
            }

            //Validate that all values are in proper range.  Minutes and hours have special cases at 60 and 24.
            if (minute >= 60 || second >= 61 || hour > 24 || (hour === 24 && (minute > 0 || second > 0 || millisecond > 0))) {
                throw new DeveloperError(iso8601ErrorMessage);
            }

            //Check the UTC offset value, if no value exists, use local time
            //a Z indicates UTC, + or - are offsets.
            var offset = tokens[offsetIndex];
            var offsetHours = +(tokens[offsetIndex + 1]);
            var offsetMinutes = +(tokens[offsetIndex + 2] || 0);
            switch (offset) {
            case '+':
                hour = hour - offsetHours;
                minute = minute - offsetMinutes;
                break;
            case '-':
                hour = hour + offsetHours;
                minute = minute + offsetMinutes;
                break;
            case 'Z':
                break;
            default:
                minute = minute + new Date(Date.UTC(year, month - 1, day, hour, minute)).getTimezoneOffset();
                break;
            }
        } else {
            //If no time is specified, it is considered the beginning of the day, local time.
            minute = minute + new Date(Date.UTC(year, month - 1, day)).getTimezoneOffset();
        }

        //ISO8601 denotes a leap second by any time having a seconds component of 60 seconds.
        //If that's the case, we need to temporarily subtract a second in order to build a UTC date.
        //Then we add it back in after converting to TAI.
        var isLeapSecond = second === 60;
        if (isLeapSecond) {
            second--;
        }

        //Even if we successfully parsed the string into its components, after applying UTC offset or
        //special cases like 24:00:00 denoting midnight, we need to normalize the data appropriately.

        //milliseconds can never be greater than 1000, and seconds can't be above 60, so we start with minutes
        while (minute >= 60) {
            minute -= 60;
            hour++;
        }

        while (hour >= 24) {
            hour -= 24;
            day++;
        }

        tmp = (inLeapYear && month === 2) ? daysInLeapFeburary : daysInMonth[month - 1];
        while (day > tmp) {
            day -= tmp;
            month++;

            if (month > 12) {
                month -= 12;
                year++;
            }

            tmp = (inLeapYear && month === 2) ? daysInLeapFeburary : daysInMonth[month - 1];
        }

        //If UTC offset is at the beginning/end of the day, minutes can be negative.
        while (minute < 0) {
            minute += 60;
            hour--;
        }

        while (hour < 0) {
            hour += 24;
            day--;
        }

        while (day < 1) {
            month--;
            if (month < 1) {
                month += 12;
                year--;
            }

            tmp = (inLeapYear && month === 2) ? daysInLeapFeburary : daysInMonth[month - 1];
            day += tmp;
        }

        //Now create the JulianDate components from the Gregorian date and actually create our instance.
        var components = computeJulianDateComponents(year, month, day, hour, minute, second, millisecond);
        var result = new JulianDate(components[0], components[1], TimeStandard.UTC);

        //If we were on a leap second, add it back.
        if (isLeapSecond) {
            result.addSeconds(1, result);
        }

        return result;
    };

    /**
     * Creates a JulianDate instance from a single number representing the Julian day and fractional day.
     *
     * @memberof JulianDate
     *
     * @param {Number} totalDays The combined Julian Day Number and fractional day.
     * @param {TimeStandard} [timeStandard = TimeStandard.UTC] Indicates the time standard in which the first parameter is defined.
     *
     * @returns {JulianDate} The new {@Link JulianDate} instance.
     *
     * @exception {DeveloperError} totalDays is required.
     *
     * @see JulianDate
     * @see JulianDate.fromDate
     * @see JulianDate.fromIso8601
     * @see TimeStandard
     * @see LeapSecond
     *
     * @example
     * // Construct a date which corresponds to January 1, 1991 06:00:00 UTC.
     * var julianDate = JulianDate.fromTotalDays(2448257.75, TimeStandard.UTC);
     */
    JulianDate.fromTotalDays = function(totalDays, timeStandard) {
        if (totalDays === null || isNaN(totalDays)) {
            throw new DeveloperError('totalDays is required.');
        }
        return new JulianDate(totalDays, 0, timeStandard);
    };

    /**
     * Compares two JulianDate instances.
     *
     * @memberof JulianDate
     *
     * @param {JulianDate} a The first instance.
     * @param {JulianDate} b The second instance.
     *
     * @returns {Number} A negative value if a is less than b,
     *                  a positive value if a is greater than b,
     *                  or zero if a and b are equal.
     */
    JulianDate.compare = function(a, b) {
        var julianDayNumberDifference = a._julianDayNumber - b._julianDayNumber;
        if (julianDayNumberDifference !== 0) {
            return julianDayNumberDifference;
        }
        return a._secondsOfDay - b._secondsOfDay;
    };

    /**
     * Returns true if the first JulianDate equals the second JulianDate.
     * @memberof JulianDate
     *
     * @param {JulianDate} left The first JulianDate to compare for equality.
     * @param {JulianDate} right The second JulianDate to compare for equality.
     * @returns {Boolean} <code>true</code> if the JulianDates are equal; otherwise, <code>false</code>.
     */
    JulianDate.equals = function(left, right) {
        return (left === right) ||
               (defined(left) &&
                defined(right) &&
                left._julianDayNumber === right._julianDayNumber &&
                left._secondsOfDay === right._secondsOfDay);
    };

    /**
     * Duplicates this JulianDate.
     * @memberof JulianDate
     *
     * @param {Cartesian3} [result] The object onto which to store the JulianDate.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
     */
    JulianDate.prototype.clone = function(result) {
        return JulianDate.clone(this, result);
    };

    /**
     * Returns the total number of whole and fractional days represented by this astronomical Julian date.
     *
     * @memberof JulianDate
     *
     * @returns {Number} The Julian date as single floating point number.
     *
     * @see JulianDate#getJulianDayNumber
     * @see JulianDate#getJulianTimeFraction
     */
    JulianDate.prototype.getTotalDays = function() {
        return this._julianDayNumber + (this._secondsOfDay / TimeConstants.SECONDS_PER_DAY);
    };

    /**
     * Returns the whole number component of the Julian date.
     *
     * @memberof JulianDate
     *
     * @returns {Number} A whole number representing the Julian day number.
     *
     * @see JulianDate#getTotalDays
     * @see JulianDate#getJulianTimeFraction
     */
    JulianDate.prototype.getJulianDayNumber = function() {
        return this._julianDayNumber;
    };

    /**
     * Returns the floating point component of the Julian date representing the time of day.
     *
     * @memberof JulianDate
     *
     * @returns {Number} The floating point component of the Julian date representing the time of day.
     *
     * @see JulianDate#getTotalDays
     * @see JulianDate#getJulianDayNumber
     */
    JulianDate.prototype.getJulianTimeFraction = function() {
        return this._secondsOfDay / TimeConstants.SECONDS_PER_DAY;
    };

    /**
     * Return the number of seconds elapsed into the current Julian day (starting at noon).
     *
     * @memberof JulianDate
     *
     * @returns {Number} The number of seconds elapsed into the current day.
     *
     * @see JulianDate#getJulianDayNumber
     */
    JulianDate.prototype.getSecondsOfDay = function() {
        return this._secondsOfDay;
    };

    var toGregorianDateScratch = new JulianDate(0, 0, TimeStandard.TAI);

    /**
     * Creates a GregorianDate representation of this date in UTC.
     * @memberof JulianDate
     *
     * @returns {GregorianDate} A gregorian date.
     */
    JulianDate.prototype.toGregorianDate = function() {
        var isLeapSecond = false;
        var thisUtc = convertTaiToUtc(this, toGregorianDateScratch);
        if (!defined(thisUtc)) {
            //Conversion to UTC will fail if we are during a leap second.
            //If that's the case, subtract a second and convert again.
            //JavaScript doesn't support leap seconds, so this results in second 59 being repeated twice.
            this.addSeconds(-1, toGregorianDateScratch);
            thisUtc = convertTaiToUtc(toGregorianDateScratch, toGregorianDateScratch);
            isLeapSecond = true;
        }

        var julianDayNumber = thisUtc._julianDayNumber;
        var secondsOfDay = thisUtc._secondsOfDay;

        if (secondsOfDay >= 43200.0) {
            julianDayNumber += 1;
        }

        // Algorithm from page 604 of the Explanatory Supplement to the
        // Astronomical Almanac (Seidelmann 1992).
        var L = (julianDayNumber + 68569) | 0;
        var N = (4 * L / 146097) | 0;
        L = (L - (((146097 * N + 3) / 4) | 0)) | 0;
        var I = ((4000 * (L + 1)) / 1461001) | 0;
        L = (L - (((1461 * I) / 4) | 0) + 31) | 0;
        var J = ((80 * L) / 2447) | 0;
        var day = (L - (((2447 * J) / 80) | 0)) | 0;
        L = (J / 11) | 0;
        var month = (J + 2 - 12 * L) | 0;
        var year = (100 * (N - 49) + I + L) | 0;

        var hour = (secondsOfDay / TimeConstants.SECONDS_PER_HOUR) | 0;
        var remainingSeconds = secondsOfDay - (hour * TimeConstants.SECONDS_PER_HOUR);
        var minute = (remainingSeconds / TimeConstants.SECONDS_PER_MINUTE) | 0;
        remainingSeconds = remainingSeconds - (minute * TimeConstants.SECONDS_PER_MINUTE);
        var second = remainingSeconds | 0;
        var millisecond = ((remainingSeconds - second) / TimeConstants.SECONDS_PER_MILLISECOND);

        // JulianDates are noon-based
        hour += 12;
        if (hour > 23) {
            hour -= 24;
        }

        //If we were on a leap second, add it back.
        if (isLeapSecond) {
            second += 1;
        }

        return new GregorianDate(year, month, day, hour, minute, second, millisecond, isLeapSecond);
    };

    /**
     * Creates a JavaScript Date representation of this date in UTC.
     * Javascript dates are only accurate to the nearest millisecond.
     * @memberof JulianDate
     *
     * @returns {Date} A new JavaScript Date equivalent to this JulianDate.
     */
    JulianDate.prototype.toDate = function() {
        var gDate = this.toGregorianDate();
        var second = gDate.second;
        if (gDate.isLeapSecond) {
            second -= 1;
        }
        return new Date(Date.UTC(gDate.year, gDate.month - 1, gDate.day, gDate.hour, gDate.minute, second, gDate.millisecond));
    };

    /**
     * Creates an ISO8601 string represenation of this JulianDate in UTC.
     * @memberof JulianDate
     *
     * @param {Number} [precision] The number of fractional digits used to represent the seconds component.  By default, the most precise representation is used.
     * @returns {String} An ISO8601 string represenation of this JulianDate.
     */
    JulianDate.prototype.toIso8601 = function(precision) {
        var gDate = this.toGregorianDate();
        var millisecondStr;

        if (!defined(precision) && gDate.millisecond !== 0) {
            //Forces milliseconds into a number with at least 3 digits to whatever the default toString() precision is.
            millisecondStr = (gDate.millisecond * 0.01).toString().replace('.', '');
            return sprintf("%04d-%02d-%02dT%02d:%02d:%02d.%sZ", gDate.year, gDate.month, gDate.day, gDate.hour, gDate.minute, gDate.second, millisecondStr);
        }

        //Precision is either 0 or milliseconds is 0 with undefined precision, in either case, leave off milliseconds entirely
        if (!defined(precision) || precision === 0) {
            return sprintf("%04d-%02d-%02dT%02d:%02d:%02dZ", gDate.year, gDate.month, gDate.day, gDate.hour, gDate.minute, gDate.second);
        }

        //Forces milliseconds into a number with at least 3 digits to whatever the specified precision is.
        millisecondStr = (gDate.millisecond * 0.01).toFixed(precision).replace('.', '').slice(0, precision);
        return sprintf("%04d-%02d-%02dT%02d:%02d:%02d.%sZ", gDate.year, gDate.month, gDate.day, gDate.hour, gDate.minute, gDate.second, millisecondStr);
    };

    /**
     * Computes the number of seconds that have elapsed from this JulianDate to the <code>other</code>
     * JulianDate.
     *
     * @memberof JulianDate
     *
     * @param {JulianDate} other The other JulianDate, which is the end of the interval.
     *
     * @returns {Number} The number of seconds that have elpased from this JulianDate to the other JulianDate.
     *
     * @see JulianDate#getMinutesDifference
     * @see JulianDate#getDaysDifference
     *
     * @example
     * var start = JulianDate.fromDate(new Date('July 4, 2011 12:00:00'));
     * var end = JulianDate.fromDate(new Date('July 5, 2011 12:01:00'));
     * var difference = start.getSecondsDifference(end);    // 86460.0 seconds
     */
    JulianDate.prototype.getSecondsDifference = function(other) {
        var julianDate1 = this;
        var julianDate2 = other;
        var dayDifference = (julianDate2._julianDayNumber - julianDate1._julianDayNumber) * TimeConstants.SECONDS_PER_DAY;
        return (dayDifference + (julianDate2._secondsOfDay - julianDate1._secondsOfDay));
    };

    /**
     * Computes the number of minutes that have elapsed from this JulianDate to the <code>other</code>
     * JulianDate.
     *
     * @memberof JulianDate
     *
     * @param {JulianDate} other The other JulianDate, which is the end of the interval.
     *
     * @returns {Number} The number of seconds that have elpased from this JulianDate to the other JulianDate.
     *
     * @see JulianDate#getSecondsDifference
     * @see JulianDate#getDaysDifference
     *
     * @example
     * var start = JulianDate.fromDate(new Date('July 4, 2011 12:00:00'));
     * var end = JulianDate.fromDate(new Date('July 5, 2011 12:01:00'));
     * var difference = start.getMinutesDifference(end);    // 1441.0 minutes
     */
    JulianDate.prototype.getMinutesDifference = function(other) {
        return this.getSecondsDifference(other) / TimeConstants.SECONDS_PER_MINUTE;
    };

    /**
     * Computes the number of days that have elapsed from this JulianDate to the <code>other</code>
     * JulianDate.  A day is always exactly 86400.0 seconds.
     *
     * @memberof JulianDate
     *
     * @param {JulianDate} other The other JulianDate, which is the end of the interval.
     *
     * @returns {Number} The number of days that have elpased from this JulianDate to the other JulianDate.
     *
     * @see JulianDate#getSecondsDifference
     * @see JulianDate#getMinutesDifference
     *
     * @example
     * var start = JulianDate.fromDate(new Date('July 4, 2011 12:00:00'));
     * var end = JulianDate.fromDate(new Date('July 5, 2011 14:24:00'));
     * var difference = start.getDaysDifference(end);    // 1.1 days
     */
    JulianDate.prototype.getDaysDifference = function(other) {
        var julianDate1 = this;
        var julianDate2 = other;
        var dayDifference = (julianDate2._julianDayNumber - julianDate1._julianDayNumber);
        var secondDifference = (julianDate2._secondsOfDay - julianDate1._secondsOfDay) / TimeConstants.SECONDS_PER_DAY;
        return dayDifference + secondDifference;
    };

    /**
     * Returns the number of seconds this TAI date is ahead of UTC.
     *
     * @memberof JulianDate
     *
     * @returns {Number} The number of seconds this TAI date is ahead of UTC
     *
     * @see LeapSecond
     * @see TimeStandard
     *
     * @example
     * var date = new Date('August 1, 2012 12:00:00 UTC');
     * var julianDate = JulianDate.fromDate(date);
     * var difference = julianDate.getTaiMinusUtc(); //35
     */
    JulianDate.prototype.getTaiMinusUtc = function() {
        binarySearchScratchLeapSecond.julianDate = this;
        var leapSeconds = LeapSecond.getLeapSeconds();
        var index = binarySearch(leapSeconds, binarySearchScratchLeapSecond, LeapSecond.compareLeapSecondDate);
        if (index < 0) {
            index = ~index;
            --index;
            if (index < 0) {
                index = 0;
            }
        }
        return leapSeconds[index].offset;
    };

    /**
     * Returns a new JulianDate representing a time <code>duration</code> seconds later
     * (or earlier in the case of a negative amount).
     *
     * @memberof JulianDate
     *
     * @param {Number} seconds The number of seconds to add or subtract.
     * @param {JulianDate} [result] The JulianDate to store the result into.
     *
     * @returns {JulianDate} The modified result parameter or a new JulianDate instance if it was not provided.
     *
     * @exception {DeveloperError} seconds is required and must be a number.
     *
     * @see JulianDate#addMinutes
     * @see JulianDate#addHours
     * @see JulianDate#addDays
     *
     * @example
     * var date = new Date();
     * date.setUTCFullYear(2011, 6, 4);     // July 4, 2011 @ 12:00:00 UTC
     * date.setUTCHours(12, 0, 00, 0);
     * var start = JulianDate.fromDate(date);
     * var end = start.addSeconds(95);      // July 4, 2011 @ 12:01:35 UTC
     */
    JulianDate.prototype.addSeconds = function(seconds, result) {
        if (seconds === null || isNaN(seconds)) {
            throw new DeveloperError('seconds is required and must be a number.');
        }
        return setComponents(this._julianDayNumber, this._secondsOfDay + seconds, result);
    };

    /**
     * Returns a new JulianDate representing a time <code>duration</code> minutes later
     * (or earlier in the case of a negative amount).
     *
     * @memberof JulianDate
     *
     * @param {Number} duration An integer number of minutes to add or subtract.
     *
     * @returns {JulianDate} A new JulianDate object
     *
     * @exception {DeveloperError} duration is required and must be a number.
     *
     * @see JulianDate#addSeconds
     * @see JulianDate#addHours
     * @see JulianDate#addDays
     *
     * @example
     * var date = new Date();
     * date.setUTCFullYear(2011, 6, 4);     // July 4, 2011 @ 12:00 UTC
     * date.setUTCHours(12, 0, 0, 0);
     * var start = JulianDate.fromDate(date);
     * var end = start.addMinutes(65);      // July 4, 2011 @ 13:05 UTC
     */
    JulianDate.prototype.addMinutes = function(duration) {
        if (duration === null || isNaN(duration)) {
            throw new DeveloperError('duration is required and must be a number.');
        }
        var newSecondsOfDay = this._secondsOfDay + (duration * TimeConstants.SECONDS_PER_MINUTE);
        return new JulianDate(this._julianDayNumber, newSecondsOfDay, TimeStandard.TAI);
    };

    /**
     * Returns a new JulianDate representing a time <code>duration</code> hours later
     * (or earlier in the case of a negative amount).
     *
     * @memberof JulianDate
     *
     * @param {Number} duration An integer number of hours to add or subtract.
     *
     * @returns {JulianDate} A new JulianDate object
     *
     * @exception {DeveloperError} duration is required and must be a number.
     *
     * @see JulianDate#addSeconds
     * @see JulianDate#addMinutes
     * @see JulianDate#addDays
     *
     * @example
     * var date = new Date();
     * date.setUTCFullYear(2011, 6, 4);     // July 4, 2011 @ 12:00 UTC
     * date.setUTCHours(12, 0, 0, 0);
     * var start = JulianDate.fromDate(date);
     * var end = start.addHours(6);         // July 4, 2011 @ 18:00 UTC
     */
    JulianDate.prototype.addHours = function(duration) {
        if (duration === null || isNaN(duration)) {
            throw new DeveloperError('duration is required and must be a number.');
        }
        var newSecondsOfDay = this._secondsOfDay + (duration * TimeConstants.SECONDS_PER_HOUR);
        return new JulianDate(this._julianDayNumber, newSecondsOfDay, TimeStandard.TAI);
    };

    /**
     * Returns a new JulianDate representing a time <code>duration</code> days later
     * (or earlier in the case of a negative amount).
     *
     * @memberof JulianDate
     *
     * @param {Number} duration An integer number of days to add or subtract.
     *
     * @returns {JulianDate} A new JulianDate object
     *
     * @exception {DeveloperError} duration is required and must be a number.
     *
     * @see JulianDate#addSeconds
     * @see JulianDate#addMinutes
     * @see JulianDate#addHours
     *
     * @example
     * var date = new Date();
     * date.setUTCFullYear(2011, 6, 4);     // July 4, 2011 @ 12:00 UTC
     * date.setUTCHours(12, 0, 0, 0);
     * var start = JulianDate.fromDate(date);
     * var end = start.addDays(5);         // July 9, 2011 @ 12:00 UTC
     */
    JulianDate.prototype.addDays = function(duration) {
        if (duration === null || isNaN(duration)) {
            throw new DeveloperError('duration is required and must be a number.');
        }
        var newJulianDayNumber = this._julianDayNumber + duration;
        return new JulianDate(newJulianDayNumber, this._secondsOfDay, TimeStandard.TAI);
    };

    /**
     * Returns true if <code>other</code> occurs after this JulianDate.
     *
     * @memberof JulianDate
     *
     * @param {JulianDate} other The JulianDate to be compared.
     *
     * @returns {Boolean} <code>true</code> if this JulianDate is chronologically earlier than <code>other</code>; otherwise, <code>false</code>.
     *
     * @see JulianDate#lessThanOrEquals
     * @see JulianDate#greaterThan
     * @see JulianDate#greaterThanOrEquals
     *
     * @example
     * var start = JulianDate.fromDate(new Date('July 6, 1991 12:00:00'));
     * var end = JulianDate.fromDate(new Date('July 6, 2011 12:01:00'));
     * start.lessThan(end);     // true
     */
    JulianDate.prototype.lessThan = function(other) {
        return JulianDate.compare(this, other) < 0;
    };

    /**
     * Returns true if <code>other</code> occurs at or after this JulianDate.
     *
     * @memberof JulianDate
     *
     * @param {JulianDate} other The JulianDate to be compared.
     *
     * @returns {Boolean} <code>true</code> if this JulianDate is chronologically less than or equal to<code>other</code>; otherwise, <code>false</code>.
     *
     * @see JulianDate#lessThan
     * @see JulianDate#greaterThan
     * @see JulianDate#greaterThanOrEquals
     *
     * @example
     * var start = JulianDate.fromDate(new Date('July 6, 1991 12:00:00'));
     * var end = JulianDate.fromDate(new Date('July 6, 2011 12:00:00'));
     * start.lessThanOrEquals(end);     // true
     */
    JulianDate.prototype.lessThanOrEquals = function(other) {
        return JulianDate.compare(this, other) <= 0;
    };

    /**
     * Returns true if <code>other</code> occurs before this JulianDate.
     *
     * @memberof JulianDate
     *
     * @param {JulianDate} other The JulianDate to be compared.
     *
     * @returns {Boolean} <code>true</code> if this JulianDate is chronologically later than <code>other</code>; otherwise, <code>false</code>.
     *
     * @see JulianDate#lessThan
     * @see JulianDate#lessThanOrEquals
     * @see JulianDate#greaterThanOrEquals
     *
     * @example
     * var start = JulianDate.fromDate(new Date('July 6, 1991 12:00:00'));
     * var end = JulianDate.fromDate(new Date('July 6, 2011 12:01:00'));
     * end.greaterThan(start);      // true
     */
    JulianDate.prototype.greaterThan = function(other) {
        return JulianDate.compare(this, other) > 0;
    };

    /**
     * Returns true if <code>other</code> occurs at or before this JulianDate.
     *
     * @memberof JulianDate
     *
     * @param {JulianDate} other The JulianDate to be compared.
     *
     * @returns {Boolean} <code>true</code> if this JulianDate is chronologically later than or equal to <code>other</code>; otherwise, <code>false</code>.
     *
     * @see JulianDate#lessThan
     * @see JulianDate#lessThanOrEquals
     * @see JulianDate#greaterThan
     *
     * @example
     * var start = JulianDate.fromDate(new Date('July 6, 1991 12:00:00'));
     * var end = JulianDate.fromDate(new Date('July 6, 2011 12:00:00'));
     * end.greaterThanOrEquals(start);      // true
     */
    JulianDate.prototype.greaterThanOrEquals = function(other) {
        return JulianDate.compare(this, other) >= 0;
    };

    /**
     * Compares this date to another date.
     *
     * @memberof JulianDate
     *
     * @param {JulianDate} other The other JulianDate to compare to.
     *
     * @returns {Number} A negative value if this instance is less than the other,
     *                  a positive value if this instance is greater than the other,
     *                  or zero if this instance and the other are equal.
     */
    JulianDate.prototype.compareTo = function(other) {
        return JulianDate.compare(this, other);
    };

    /**
     * Returns <code>true</code> if this date is equivalent to the specified date.
     *
     * @memberof JulianDate
     *
     * @param {JulianDate} other The JulianDate to be compared.
     *
     * @returns {Boolean} <code>true</code> if the two JulianDates are equal; otherwise <code>false</code>.
     *
     * @see JulianDate#equalsEpsilon
     *
     * @example
     * var original = JulianDate.fromDate(new Date('July 4, 2011 12:00:00'));
     * var clone = JulianDate.fromDate(new Date('July 4, 2011 12:00:00'));
     * original.equals(clone);      // true
     */
    JulianDate.prototype.equals = function(other) {
        return JulianDate.equals(this, other);
    };

    /**
     * Returns <code>true</code> if this date is within <code>epsilon</code> seconds of the
     * specified date.  That is, in order for the dates to be considered equal (and for
     * this function to return <code>true</code>), the absolute value of the difference between them, in
     * seconds, must be less than <code>epsilon</code>.
     *
     * @memberof JulianDate
     *
     * @param {JulianDate} other The JulianDate to be compared.
     * @param {Number} epsilon The number of seconds that should separate the two JulianDates
     *
     * @returns {Boolean} <code>true</code> if the two JulianDates are within <code>epsilon</code> seconds of each other; otherwise <code>false</code>.
     *
     * @exception {DeveloperError} epsilon is required and must be number.
     *
     * @see JulianDate#equals
     *
     * @example
     * var original = JulianDate.fromDate(new Date('July 4, 2011 12:00:00'));
     * var clone = JulianDate.fromDate(new Date('July 4, 2011 12:00:01'));
     * original.equalsEpsilon(clone, 2);    // true
     */
    JulianDate.prototype.equalsEpsilon = function(other, epsilon) {
        if (epsilon === null || isNaN(epsilon)) {
            throw new DeveloperError('epsilon is required and must be number.');
        }
        return Math.abs(this.getSecondsDifference(other)) <= epsilon;
    };

    //To avoid circular dependencies, we load the default list of leap seconds
    //here, rather than in the LeapSecond class itself.
    if (LeapSecond._leapSeconds.length === 0) {
        LeapSecond._leapSeconds = [
                                   new LeapSecond(new JulianDate(2441317, 43210.0, TimeStandard.TAI), 10), // January 1, 1972 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2441499, 43211.0, TimeStandard.TAI), 11), // July 1, 1972 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2441683, 43212.0, TimeStandard.TAI), 12), // January 1, 1973 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2442048, 43213.0, TimeStandard.TAI), 13), // January 1, 1974 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2442413, 43214.0, TimeStandard.TAI), 14), // January 1, 1975 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2442778, 43215.0, TimeStandard.TAI), 15), // January 1, 1976 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2443144, 43216.0, TimeStandard.TAI), 16), // January 1, 1977 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2443509, 43217.0, TimeStandard.TAI), 17), // January 1, 1978 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2443874, 43218.0, TimeStandard.TAI), 18), // January 1, 1979 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2444239, 43219.0, TimeStandard.TAI), 19), // January 1, 1980 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2444786, 43220.0, TimeStandard.TAI), 20), // July 1, 1981 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2445151, 43221.0, TimeStandard.TAI), 21), // July 1, 1982 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2445516, 43222.0, TimeStandard.TAI), 22), // July 1, 1983 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2446247, 43223.0, TimeStandard.TAI), 23), // July 1, 1985 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2447161, 43224.0, TimeStandard.TAI), 24), // January 1, 1988 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2447892, 43225.0, TimeStandard.TAI), 25), // January 1, 1990 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2448257, 43226.0, TimeStandard.TAI), 26), // January 1, 1991 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2448804, 43227.0, TimeStandard.TAI), 27), // July 1, 1992 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2449169, 43228.0, TimeStandard.TAI), 28), // July 1, 1993 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2449534, 43229.0, TimeStandard.TAI), 29), // July 1, 1994 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2450083, 43230.0, TimeStandard.TAI), 30), // January 1, 1996 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2450630, 43231.0, TimeStandard.TAI), 31), // July 1, 1997 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2451179, 43232.0, TimeStandard.TAI), 32), // January 1, 1999 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2453736, 43233.0, TimeStandard.TAI), 33), // January 1, 2006 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2454832, 43234.0, TimeStandard.TAI), 34), // January 1, 2009 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2456109, 43235.0, TimeStandard.TAI), 35)  // July 1, 2012 00:00:00 UTC
                                 ];
    }

    return JulianDate;
});

/*global define*/
define('Core/clone',[
        './defaultValue'
    ], function(
        defaultValue) {
    "use strict";

    /**
     * Clones an object, returning a new object containing the same properties.
     *
     * @exports clone
     *
     * @param {Object} object The object to clone.
     * @param {Boolean} [deep=false] If true, all properties will be deep cloned recursively.
     */
    var clone = function(object, deep) {
        if (object === null || typeof object !== 'object') {
            return object;
        }

        deep = defaultValue(deep, false);

        var result = new object.constructor();
        for ( var propertyName in object) {
            if (object.hasOwnProperty(propertyName)) {
                var value = object[propertyName];
                if (deep) {
                    value = clone(value, deep);
                }
                result[propertyName] = value;
            }
        }

        return result;
    };

    return clone;
});

/*global define*/
define('Core/RequestErrorEvent',['./defined'], function(defined) {
    "use strict";

    /**
     * An event that is raised when a request encounters an error.
     *
     * @constructor
     * @alias RequestErrorEvent
     *
     * @param {Number} [statusCode] The HTTP error status code, such as 404.
     * @param {Object} [response] The response included along with the error.
     */
    var RequestErrorEvent = function RequestErrorEvent(statusCode, response) {
        /**
         * The HTTP error status code, such as 404.  If the error does not have a particular
         * HTTP code, this property will be undefined.
         *
         * @type {Number}
         */
        this.statusCode = statusCode;

        /**
         * The response included along with the error.  If the error does not include a response,
         * this property will be undefined.
         *
         * @type {Object}
         */
        this.response = response;
    };

    /**
     * Creates a string representing this RequestErrorEvent.
     * @memberof RequestErrorEvent
     *
     * @returns {String} A string representing the provided RequestErrorEvent.
     */
    RequestErrorEvent.prototype.toString = function() {
        var str = 'Request has failed.';
        if (defined(this.statusCode)) {
            str += ' Status Code: ' + this.statusCode;
        }
        return str;
    };

    return RequestErrorEvent;
});
/**
  @license
  when.js - https://github.com/cujojs/when

  MIT License (c) copyright B Cavalier & J Hann

 * A lightweight CommonJS Promises/A and when() implementation
 * when is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @version 1.7.1
 */

(function(define) { 'use strict';
define('ThirdParty/when',[],function () {
	var reduceArray, slice, undef;

	//
	// Public API
	//

	when.defer     = defer;     // Create a deferred
	when.resolve   = resolve;   // Create a resolved promise
	when.reject    = reject;    // Create a rejected promise

	when.join      = join;      // Join 2 or more promises

	when.all       = all;       // Resolve a list of promises
	when.map       = map;       // Array.map() for promises
	when.reduce    = reduce;    // Array.reduce() for promises

	when.any       = any;       // One-winner race
	when.some      = some;      // Multi-winner race

	when.chain     = chain;     // Make a promise trigger another resolver

	when.isPromise = isPromise; // Determine if a thing is a promise

	/**
	 * Register an observer for a promise or immediate value.
	 *
	 * @param {*} promiseOrValue
	 * @param {function?} [onFulfilled] callback to be called when promiseOrValue is
	 *   successfully fulfilled.  If promiseOrValue is an immediate value, callback
	 *   will be invoked immediately.
	 * @param {function?} [onRejected] callback to be called when promiseOrValue is
	 *   rejected.
	 * @param {function?} [onProgress] callback to be called when progress updates
	 *   are issued for promiseOrValue.
	 * @returns {Promise} a new {@link Promise} that will complete with the return
	 *   value of callback or errback or the completion value of promiseOrValue if
	 *   callback and/or errback is not supplied.
	 */
	function when(promiseOrValue, onFulfilled, onRejected, onProgress) {
		// Get a trusted promise for the input promiseOrValue, and then
		// register promise handlers
		return resolve(promiseOrValue).then(onFulfilled, onRejected, onProgress);
	}

	/**
	 * Returns promiseOrValue if promiseOrValue is a {@link Promise}, a new Promise if
	 * promiseOrValue is a foreign promise, or a new, already-fulfilled {@link Promise}
	 * whose value is promiseOrValue if promiseOrValue is an immediate value.
	 *
	 * @param {*} promiseOrValue
	 * @returns Guaranteed to return a trusted Promise.  If promiseOrValue is a when.js {@link Promise}
	 *   returns promiseOrValue, otherwise, returns a new, already-resolved, when.js {@link Promise}
	 *   whose resolution value is:
	 *   * the resolution value of promiseOrValue if it's a foreign promise, or
	 *   * promiseOrValue if it's a value
	 */
	function resolve(promiseOrValue) {
		var promise, deferred;

		if(promiseOrValue instanceof Promise) {
			// It's a when.js promise, so we trust it
			promise = promiseOrValue;

		} else {
			// It's not a when.js promise. See if it's a foreign promise or a value.
			if(isPromise(promiseOrValue)) {
				// It's a thenable, but we don't know where it came from, so don't trust
				// its implementation entirely.  Introduce a trusted middleman when.js promise
				deferred = defer();

				// IMPORTANT: This is the only place when.js should ever call .then() on an
				// untrusted promise. Don't expose the return value to the untrusted promise
				promiseOrValue.then(
					function(value)  { deferred.resolve(value); },
					function(reason) { deferred.reject(reason); },
					function(update) { deferred.progress(update); }
				);

				promise = deferred.promise;

			} else {
				// It's a value, not a promise.  Create a resolved promise for it.
				promise = fulfilled(promiseOrValue);
			}
		}

		return promise;
	}

	/**
	 * Returns a rejected promise for the supplied promiseOrValue.  The returned
	 * promise will be rejected with:
	 * - promiseOrValue, if it is a value, or
	 * - if promiseOrValue is a promise
	 *   - promiseOrValue's value after it is fulfilled
	 *   - promiseOrValue's reason after it is rejected
	 * @param {*} promiseOrValue the rejected value of the returned {@link Promise}
	 * @returns {Promise} rejected {@link Promise}
	 */
	function reject(promiseOrValue) {
		return when(promiseOrValue, rejected);
	}

	/**
	 * Trusted Promise constructor.  A Promise created from this constructor is
	 * a trusted when.js promise.  Any other duck-typed promise is considered
	 * untrusted.
	 * @constructor
	 * @name Promise
	 */
	function Promise(then) {
		this.then = then;
	}

	Promise.prototype = {
		/**
		 * Register a callback that will be called when a promise is
		 * fulfilled or rejected.  Optionally also register a progress handler.
		 * Shortcut for .then(onFulfilledOrRejected, onFulfilledOrRejected, onProgress)
		 * @param {function?} [onFulfilledOrRejected]
		 * @param {function?} [onProgress]
		 * @returns {Promise}
		 */
		always: function(onFulfilledOrRejected, onProgress) {
			return this.then(onFulfilledOrRejected, onFulfilledOrRejected, onProgress);
		},

		/**
		 * Register a rejection handler.  Shortcut for .then(undefined, onRejected)
		 * @param {function?} onRejected
		 * @returns {Promise}
		 */
		otherwise: function(onRejected) {
			return this.then(undef, onRejected);
		},

		/**
		 * Shortcut for .then(function() { return value; })
		 * @param  {*} value
		 * @returns {Promise} a promise that:
		 *  - is fulfilled if value is not a promise, or
		 *  - if value is a promise, will fulfill with its value, or reject
		 *    with its reason.
		 */
		yield: function(value) {
			return this.then(function() {
				return value;
			});
		},

		/**
		 * Assumes that this promise will fulfill with an array, and arranges
		 * for the onFulfilled to be called with the array as its argument list
		 * i.e. onFulfilled.spread(undefined, array).
		 * @param {function} onFulfilled function to receive spread arguments
		 * @returns {Promise}
		 */
		spread: function(onFulfilled) {
			return this.then(function(array) {
				// array may contain promises, so resolve its contents.
				return all(array, function(array) {
					return onFulfilled.apply(undef, array);
				});
			});
		}
	};

	/**
	 * Create an already-resolved promise for the supplied value
	 * @private
	 *
	 * @param {*} value
	 * @returns {Promise} fulfilled promise
	 */
	function fulfilled(value) {
		var p = new Promise(function(onFulfilled) {
			// TODO: Promises/A+ check typeof onFulfilled
			try {
				return resolve(onFulfilled ? onFulfilled(value) : value);
			} catch(e) {
				return rejected(e);
			}
		});

		return p;
	}

	/**
	 * Create an already-rejected {@link Promise} with the supplied
	 * rejection reason.
	 * @private
	 *
	 * @param {*} reason
	 * @returns {Promise} rejected promise
	 */
	function rejected(reason) {
		var p = new Promise(function(_, onRejected) {
			// TODO: Promises/A+ check typeof onRejected
			try {
				return onRejected ? resolve(onRejected(reason)) : rejected(reason);
			} catch(e) {
				return rejected(e);
			}
		});

		return p;
	}

	/**
	 * Creates a new, Deferred with fully isolated resolver and promise parts,
	 * either or both of which may be given out safely to consumers.
	 * The Deferred itself has the full API: resolve, reject, progress, and
	 * then. The resolver has resolve, reject, and progress.  The promise
	 * only has then.
	 *
	 * @returns {Deferred}
	 */
	function defer() {
		var deferred, promise, handlers, progressHandlers,
			_then, _progress, _resolve;

		/**
		 * The promise for the new deferred
		 * @type {Promise}
		 */
		promise = new Promise(then);

		/**
		 * The full Deferred object, with {@link Promise} and {@link Resolver} parts
		 * @class Deferred
		 * @name Deferred
		 */
		deferred = {
			then:     then, // DEPRECATED: use deferred.promise.then
			resolve:  promiseResolve,
			reject:   promiseReject,
			// TODO: Consider renaming progress() to notify()
			progress: promiseProgress,

			promise:  promise,

			resolver: {
				resolve:  promiseResolve,
				reject:   promiseReject,
				progress: promiseProgress
			}
		};

		handlers = [];
		progressHandlers = [];

		/**
		 * Pre-resolution then() that adds the supplied callback, errback, and progback
		 * functions to the registered listeners
		 * @private
		 *
		 * @param {function?} [onFulfilled] resolution handler
		 * @param {function?} [onRejected] rejection handler
		 * @param {function?} [onProgress] progress handler
		 */
		_then = function(onFulfilled, onRejected, onProgress) {
			// TODO: Promises/A+ check typeof onFulfilled, onRejected, onProgress
			var deferred, progressHandler;

			deferred = defer();

			progressHandler = typeof onProgress === 'function'
				? function(update) {
					try {
						// Allow progress handler to transform progress event
						deferred.progress(onProgress(update));
					} catch(e) {
						// Use caught value as progress
						deferred.progress(e);
					}
				}
				: function(update) { deferred.progress(update); };

			handlers.push(function(promise) {
				promise.then(onFulfilled, onRejected)
					.then(deferred.resolve, deferred.reject, progressHandler);
			});

			progressHandlers.push(progressHandler);

			return deferred.promise;
		};

		/**
		 * Issue a progress event, notifying all progress listeners
		 * @private
		 * @param {*} update progress event payload to pass to all listeners
		 */
		_progress = function(update) {
			processQueue(progressHandlers, update);
			return update;
		};

		/**
		 * Transition from pre-resolution state to post-resolution state, notifying
		 * all listeners of the resolution or rejection
		 * @private
		 * @param {*} value the value of this deferred
		 */
		_resolve = function(value) {
			value = resolve(value);

			// Replace _then with one that directly notifies with the result.
			_then = value.then;
			// Replace _resolve so that this Deferred can only be resolved once
			_resolve = resolve;
			// Make _progress a noop, to disallow progress for the resolved promise.
			_progress = noop;

			// Notify handlers
			processQueue(handlers, value);

			// Free progressHandlers array since we'll never issue progress events
			progressHandlers = handlers = undef;

			return value;
		};

		return deferred;

		/**
		 * Wrapper to allow _then to be replaced safely
		 * @param {function?} [onFulfilled] resolution handler
		 * @param {function?} [onRejected] rejection handler
		 * @param {function?} [onProgress] progress handler
		 * @returns {Promise} new promise
		 */
		function then(onFulfilled, onRejected, onProgress) {
			// TODO: Promises/A+ check typeof onFulfilled, onRejected, onProgress
			return _then(onFulfilled, onRejected, onProgress);
		}

		/**
		 * Wrapper to allow _resolve to be replaced
		 */
		function promiseResolve(val) {
			return _resolve(val);
		}

		/**
		 * Wrapper to allow _reject to be replaced
		 */
		function promiseReject(err) {
			return _resolve(rejected(err));
		}

		/**
		 * Wrapper to allow _progress to be replaced
		 */
		function promiseProgress(update) {
			return _progress(update);
		}
	}

	/**
	 * Determines if promiseOrValue is a promise or not.  Uses the feature
	 * test from http://wiki.commonjs.org/wiki/Promises/A to determine if
	 * promiseOrValue is a promise.
	 *
	 * @param {*} promiseOrValue anything
	 * @returns {boolean} true if promiseOrValue is a {@link Promise}
	 */
	function isPromise(promiseOrValue) {
		return promiseOrValue && typeof promiseOrValue.then === 'function';
	}

	/**
	 * Initiates a competitive race, returning a promise that will resolve when
	 * howMany of the supplied promisesOrValues have resolved, or will reject when
	 * it becomes impossible for howMany to resolve, for example, when
	 * (promisesOrValues.length - howMany) + 1 input promises reject.
	 *
	 * @param {Array} promisesOrValues array of anything, may contain a mix
	 *      of promises and values
	 * @param howMany {number} number of promisesOrValues to resolve
	 * @param {function?} [onFulfilled] resolution handler
	 * @param {function?} [onRejected] rejection handler
	 * @param {function?} [onProgress] progress handler
	 * @returns {Promise} promise that will resolve to an array of howMany values that
	 * resolved first, or will reject with an array of (promisesOrValues.length - howMany) + 1
	 * rejection reasons.
	 */
	function some(promisesOrValues, howMany, onFulfilled, onRejected, onProgress) {

		checkCallbacks(2, arguments);

		return when(promisesOrValues, function(promisesOrValues) {

			var toResolve, toReject, values, reasons, deferred, fulfillOne, rejectOne, progress, len, i;

			len = promisesOrValues.length >>> 0;

			toResolve = Math.max(0, Math.min(howMany, len));
			values = [];

			toReject = (len - toResolve) + 1;
			reasons = [];

			deferred = defer();

			// No items in the input, resolve immediately
			if (!toResolve) {
				deferred.resolve(values);

			} else {
				progress = deferred.progress;

				rejectOne = function(reason) {
					reasons.push(reason);
					if(!--toReject) {
						fulfillOne = rejectOne = noop;
						deferred.reject(reasons);
					}
				};

				fulfillOne = function(val) {
					// This orders the values based on promise resolution order
					// Another strategy would be to use the original position of
					// the corresponding promise.
					values.push(val);

					if (!--toResolve) {
						fulfillOne = rejectOne = noop;
						deferred.resolve(values);
					}
				};

				for(i = 0; i < len; ++i) {
					if(i in promisesOrValues) {
						when(promisesOrValues[i], fulfiller, rejecter, progress);
					}
				}
			}

			return deferred.then(onFulfilled, onRejected, onProgress);

			function rejecter(reason) {
				rejectOne(reason);
			}

			function fulfiller(val) {
				fulfillOne(val);
			}

		});
	}

	/**
	 * Initiates a competitive race, returning a promise that will resolve when
	 * any one of the supplied promisesOrValues has resolved or will reject when
	 * *all* promisesOrValues have rejected.
	 *
	 * @param {Array|Promise} promisesOrValues array of anything, may contain a mix
	 *      of {@link Promise}s and values
	 * @param {function?} [onFulfilled] resolution handler
	 * @param {function?} [onRejected] rejection handler
	 * @param {function?} [onProgress] progress handler
	 * @returns {Promise} promise that will resolve to the value that resolved first, or
	 * will reject with an array of all rejected inputs.
	 */
	function any(promisesOrValues, onFulfilled, onRejected, onProgress) {

		function unwrapSingleResult(val) {
			return onFulfilled ? onFulfilled(val[0]) : val[0];
		}

		return some(promisesOrValues, 1, unwrapSingleResult, onRejected, onProgress);
	}

	/**
	 * Return a promise that will resolve only once all the supplied promisesOrValues
	 * have resolved. The resolution value of the returned promise will be an array
	 * containing the resolution values of each of the promisesOrValues.
	 * @memberOf when
	 *
	 * @param {Array|Promise} promisesOrValues array of anything, may contain a mix
	 *      of {@link Promise}s and values
	 * @param {function?} [onFulfilled] resolution handler
	 * @param {function?} [onRejected] rejection handler
	 * @param {function?} [onProgress] progress handler
	 * @returns {Promise}
	 */
	function all(promisesOrValues, onFulfilled, onRejected, onProgress) {
		checkCallbacks(1, arguments);
		return map(promisesOrValues, identity).then(onFulfilled, onRejected, onProgress);
	}

	/**
	 * Joins multiple promises into a single returned promise.
	 * @returns {Promise} a promise that will fulfill when *all* the input promises
	 * have fulfilled, or will reject when *any one* of the input promises rejects.
	 */
	function join(/* ...promises */) {
		return map(arguments, identity);
	}

	/**
	 * Traditional map function, similar to `Array.prototype.map()`, but allows
	 * input to contain {@link Promise}s and/or values, and mapFunc may return
	 * either a value or a {@link Promise}
	 *
	 * @param {Array|Promise} promise array of anything, may contain a mix
	 *      of {@link Promise}s and values
	 * @param {function} mapFunc mapping function mapFunc(value) which may return
	 *      either a {@link Promise} or value
	 * @returns {Promise} a {@link Promise} that will resolve to an array containing
	 *      the mapped output values.
	 */
	function map(promise, mapFunc) {
		return when(promise, function(array) {
			var results, len, toResolve, resolve, i, d;

			// Since we know the resulting length, we can preallocate the results
			// array to avoid array expansions.
			toResolve = len = array.length >>> 0;
			results = [];
			d = defer();

			if(!toResolve) {
				d.resolve(results);
			} else {

				resolve = function resolveOne(item, i) {
					when(item, mapFunc).then(function(mapped) {
						results[i] = mapped;

						if(!--toResolve) {
							d.resolve(results);
						}
					}, d.reject);
				};

				// Since mapFunc may be async, get all invocations of it into flight
				for(i = 0; i < len; i++) {
					if(i in array) {
						resolve(array[i], i);
					} else {
						--toResolve;
					}
				}

			}

			return d.promise;

		});
	}

	/**
	 * Traditional reduce function, similar to `Array.prototype.reduce()`, but
	 * input may contain promises and/or values, and reduceFunc
	 * may return either a value or a promise, *and* initialValue may
	 * be a promise for the starting value.
	 *
	 * @param {Array|Promise} promise array or promise for an array of anything,
	 *      may contain a mix of promises and values.
	 * @param {function} reduceFunc reduce function reduce(currentValue, nextValue, index, total),
	 *      where total is the total number of items being reduced, and will be the same
	 *      in each call to reduceFunc.
	 * @returns {Promise} that will resolve to the final reduced value
	 */
	function reduce(promise, reduceFunc /*, initialValue */) {
		var args = slice.call(arguments, 1);

		return when(promise, function(array) {
			var total;

			total = array.length;

			// Wrap the supplied reduceFunc with one that handles promises and then
			// delegates to the supplied.
			args[0] = function (current, val, i) {
				return when(current, function (c) {
					return when(val, function (value) {
						return reduceFunc(c, value, i, total);
					});
				});
			};

			return reduceArray.apply(array, args);
		});
	}

	/**
	 * Ensure that resolution of promiseOrValue will trigger resolver with the
	 * value or reason of promiseOrValue, or instead with resolveValue if it is provided.
	 *
	 * @param promiseOrValue
	 * @param {Object} resolver
	 * @param {function} resolver.resolve
	 * @param {function} resolver.reject
	 * @param {*} [resolveValue]
	 * @returns {Promise}
	 */
	function chain(promiseOrValue, resolver, resolveValue) {
		var useResolveValue = arguments.length > 2;

		return when(promiseOrValue,
			function(val) {
				val = useResolveValue ? resolveValue : val;
				resolver.resolve(val);
				return val;
			},
			function(reason) {
				resolver.reject(reason);
				return rejected(reason);
			},
			resolver.progress
		);
	}

	//
	// Utility functions
	//

	/**
	 * Apply all functions in queue to value
	 * @param {Array} queue array of functions to execute
	 * @param {*} value argument passed to each function
	 */
	function processQueue(queue, value) {
		var handler, i = 0;

		while (handler = queue[i++]) {
			handler(value);
		}
	}

	/**
	 * Helper that checks arrayOfCallbacks to ensure that each element is either
	 * a function, or null or undefined.
	 * @private
	 * @param {number} start index at which to start checking items in arrayOfCallbacks
	 * @param {Array} arrayOfCallbacks array to check
	 * @throws {Error} if any element of arrayOfCallbacks is something other than
	 * a functions, null, or undefined.
	 */
	function checkCallbacks(start, arrayOfCallbacks) {
		// TODO: Promises/A+ update type checking and docs
		var arg, i = arrayOfCallbacks.length;

		while(i > start) {
			arg = arrayOfCallbacks[--i];

			if (arg != null && typeof arg != 'function') {
				throw new Error('arg '+i+' must be a function');
			}
		}
	}

	/**
	 * No-Op function used in method replacement
	 * @private
	 */
	function noop() {}

	slice = [].slice;

	// ES5 reduce implementation if native not available
	// See: http://es5.github.com/#x15.4.4.21 as there are many
	// specifics and edge cases.
	reduceArray = [].reduce ||
		function(reduceFunc /*, initialValue */) {
			/*jshint maxcomplexity: 7*/

			// ES5 dictates that reduce.length === 1

			// This implementation deviates from ES5 spec in the following ways:
			// 1. It does not check if reduceFunc is a Callable

			var arr, args, reduced, len, i;

			i = 0;
			// This generates a jshint warning, despite being valid
			// "Missing 'new' prefix when invoking a constructor."
			// See https://github.com/jshint/jshint/issues/392
			arr = Object(this);
			len = arr.length >>> 0;
			args = arguments;

			// If no initialValue, use first item of array (we know length !== 0 here)
			// and adjust i to start at second item
			if(args.length <= 1) {
				// Skip to the first real element in the array
				for(;;) {
					if(i in arr) {
						reduced = arr[i++];
						break;
					}

					// If we reached the end of the array without finding any real
					// elements, it's a TypeError
					if(++i >= len) {
						throw new TypeError();
					}
				}
			} else {
				// If initialValue provided, use it
				reduced = args[1];
			}

			// Do the actual reduce
			for(;i < len; ++i) {
				// Skip holes
				if(i in arr) {
					reduced = reduceFunc(reduced, arr[i], i, arr);
				}
			}

			return reduced;
		};

	function identity(x) {
		return x;
	}

	return when;
});
})(typeof define == 'function' && define.amd
	? define
	: function (factory) { typeof exports === 'object'
		? (module.exports = factory())
		: (this.when      = factory());
	}
	// Boilerplate for AMD, Node, and browser global
);
/*global define*/
define('Core/loadWithXhr',[
        './defined',
        './DeveloperError',
        './RequestErrorEvent',
        '../ThirdParty/when'
    ], function(
        defined,
        DeveloperError,
        RequestErrorEvent,
        when) {
    "use strict";

    /**
     * Asynchronously loads the given URL.  Returns a promise that will resolve to
     * the result once loaded, or reject if the URL failed to load.  The data is loaded
     * using XMLHttpRequest, which means that in order to make requests to another origin,
     * the server must have Cross-Origin Resource Sharing (CORS) headers enabled.
     *
     * @exports loadWithXhr
     *
     * @param {String|Promise} url The URL of the data, or a promise for the URL.
     * @param {String} responseType The type of response.  This controls the type of item returned.
     * @param {Object} [headers] HTTP headers to send with the requests.
     *
     * @returns {Promise} a promise that will resolve to the requested data when loaded.
     *
     * @see <a href='http://www.w3.org/TR/cors/'>Cross-Origin Resource Sharing</a>
     * @see <a href='http://wiki.commonjs.org/wiki/Promises/A'>CommonJS Promises/A</a>
     *
     * @see loadArrayBuffer
     * @see loadBlob
     * @see loadText
     *
     * @example
     * // load a single URL asynchronously
     * loadWithXhr('some/url', 'blob').then(function(blob) {
     *     // use the data
     * }, function() {
     *     // an error occurred
     * });
     */
    var loadWithXhr = function(url, responseType, headers) {
        if (!defined(url)) {
            throw new DeveloperError('url is required.');
        }

        return when(url, function(url) {
            var deferred = when.defer();

            loadWithXhr.load(url, responseType, headers, deferred);

            return deferred.promise;
        });
    };

    // This is broken out into a separate function so that it can be mocked for testing purposes.
    loadWithXhr.load = function(url, responseType, headers, deferred) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);

        if (defined(headers)) {
            for ( var key in headers) {
                if (headers.hasOwnProperty(key)) {
                    xhr.setRequestHeader(key, headers[key]);
                }
            }
        }

        if (defined(responseType)) {
            xhr.responseType = responseType;
        }

        xhr.onload = function(e) {
            if (xhr.status === 200) {
                deferred.resolve(xhr.response);
            } else {
                deferred.reject(new RequestErrorEvent(xhr.status, xhr.response));
            }
        };

        xhr.onerror = function(e) {
            deferred.reject(new RequestErrorEvent());
        };

        xhr.send();
    };

    loadWithXhr.defaultLoad = loadWithXhr.load;

    return loadWithXhr;
});
/*global define*/
define('Core/loadText',[
        './loadWithXhr'
    ], function(
        loadWithXhr) {
    "use strict";

    /**
     * Asynchronously loads the given URL as text.  Returns a promise that will resolve to
     * a String once loaded, or reject if the URL failed to load.  The data is loaded
     * using XMLHttpRequest, which means that in order to make requests to another origin,
     * the server must have Cross-Origin Resource Sharing (CORS) headers enabled.
     *
     * @exports loadText
     *
     * @param {String|Promise} url The URL to request, or a promise for the URL.
     * @param {Object} [headers] HTTP headers to send with the request.
     * @returns {Promise} a promise that will resolve to the requested data when loaded.
     *
     * @exception {DeveloperError} url is required.
     *
     * @example
     * // load text from a URL, setting a custom header
     * loadText('http://someUrl.com/someJson.txt', {
     *   'X-Custom-Header' : 'some value'
     * }).then(function(text) {
     *     //Do something with the text
     * }, function() {
     *     // an error occurred
     * });
     *
     * @see <a href="http://en.wikipedia.org/wiki/XMLHttpRequest">XMLHttpRequest</a>
     * @see <a href='http://www.w3.org/TR/cors/'>Cross-Origin Resource Sharing</a>
     * @see <a href='http://wiki.commonjs.org/wiki/Promises/A'>CommonJS Promises/A</a>
     */
    var loadText = function(url, headers) {
        return loadWithXhr(url, undefined, headers);
    };

    return loadText;
});
/*global define*/
define('Core/loadJson',[
        './clone',
        './defined',
        './loadText',
        './DeveloperError'
    ], function(
        clone,
        defined,
        loadText,
        DeveloperError) {
    "use strict";

    // note: &#42;&#47;&#42; below is */* but that ends the comment block early
    /**
     * Asynchronously loads the given URL as JSON.  Returns a promise that will resolve to
     * a JSON object once loaded, or reject if the URL failed to load.  The data is loaded
     * using XMLHttpRequest, which means that in order to make requests to another origin,
     * the server must have Cross-Origin Resource Sharing (CORS) headers enabled. This function
     * adds 'Accept: application/json,&#42;&#47;&#42;;q=0.01' to the request headers, if not
     * already specified.
     *
     * @exports loadJson
     *
     * @param {String|Promise} url The URL to request, or a promise for the URL.
     * @param {Object} [headers] HTTP headers to send with the request.
     * 'Accept: application/json,&#42;&#47;&#42;;q=0.01' is added to the request headers automatically
     * if not specified.
     * @returns {Promise} a promise that will resolve to the requested data when loaded.
     *
     * @exception {DeveloperError} url is required.
     *
     * @example
     * loadJson('http://someUrl.com/someJson.txt').then(function(jsonData) {
     *     //Do something with the JSON object
     * }, function() {
     *     // an error occurred
     * });
     *
     * @see loadText
     * @see <a href='http://www.w3.org/TR/cors/'>Cross-Origin Resource Sharing</a>
     * @see <a href='http://wiki.commonjs.org/wiki/Promises/A'>CommonJS Promises/A</a>
     */
    var loadJson = function loadJson(url, headers) {
        if (!defined(url)) {
            throw new DeveloperError('url is required.');
        }

        if (defined(headers) && !defined(headers.Accept)) {
            // clone before adding the Accept header
            headers = clone(headers);
            headers.Accept = 'application/json,*/*;q=0.01';
        }

        return loadText(url, headers).then(function(value) {
            return JSON.parse(value);
        });
    };

    return loadJson;
});
/*global define*/
define('Core/Iau2006XysData',[
        './buildModuleUrl',
        './defaultValue',
        './defined',
        './Iau2006XysSample',
        './JulianDate',
        './loadJson',
        './TimeStandard',
        '../ThirdParty/when'
    ], function(
        buildModuleUrl,
        defaultValue,
        defined,
        Iau2006XysSample,
        JulianDate,
        loadJson,
        TimeStandard,
        when) {
    "use strict";

    /**
     * A set of IAU2006 XYS data that is used to evaluate the transformation between the International
     * Celestial Reference Frame (ICRF) and the International Terrestrial Reference Frame (ITRF).
     *
     * @alias Iau2006XysData
     * @constructor
     *
     * @param {String} [description.xysFileUrlTemplate='Assets/IAU2006_XYS/IAU2006_XYS_{0}.json'] A template URL for obtaining the XYS data.  In the template,
     *                 `{0}` will be replaced with the file index.
     * @param {Number} [description.interpolationOrder=9] The order of interpolation to perform on the XYS data.
     * @param {Number} [description.sampleZeroJulianEphemerisDate=2442396.5] The Julian ephemeris date (JED) of the
     *                 first XYS sample.
     * @param {Number} [description.stepSizeDays=1.0] The step size, in days, between successive XYS samples.
     * @param {Number} [description.samplesPerXysFile=1000] The number of samples in each XYS file.
     * @param {Number} [description.totalSamples=27426] The total number of samples in all XYS files.
     */
    var Iau2006XysData = function Iau2006XysData(description) {
        description = defaultValue(description, defaultValue.EMPTY_OBJECT);

        this._xysFileUrlTemplate = description.xysFileUrlTemplate;
        this._interpolationOrder = defaultValue(description.interpolationOrder, 9);
        this._sampleZeroJulianEphemerisDate = defaultValue(description.sampleZeroJulianEphemerisDate, 2442396.5);
        this._sampleZeroDateTT = new JulianDate(this._sampleZeroJulianEphemerisDate, 0.0, TimeStandard.TAI);
        this._stepSizeDays = defaultValue(description.stepSizeDays, 1.0);
        this._samplesPerXysFile = defaultValue(description.samplesPerXysFile, 1000);
        this._totalSamples = defaultValue(description.totalSamples, 27426);
        this._samples = new Array(this._totalSamples * 3);
        this._chunkDownloadsInProgress = [];

        var order = this._interpolationOrder;

        // Compute denominators and X values for interpolation.
        var denom = this._denominators = new Array(order + 1);
        var xTable = this._xTable = new Array(order + 1);

        var stepN = Math.pow(this._stepSizeDays, order);

        for ( var i = 0; i <= order; ++i) {
            denom[i] = stepN;
            xTable[i] = i * this._stepSizeDays;

            for ( var j = 0; j <= order; ++j) {
                if (j !== i) {
                    denom[i] *= (i - j);
                }
            }

            denom[i] = 1.0 / denom[i];
        }

        // Allocate scratch arrays for interpolation.
        this._work = new Array(order + 1);
        this._coef = new Array(order + 1);
    };

    var julianDateScratch = new JulianDate(0, 0.0, TimeStandard.TAI);

    function getDaysSinceEpoch(xys, dayTT, secondTT) {
        var dateTT = julianDateScratch;
        dateTT._julianDayNumber = dayTT;
        dateTT._secondsOfDay = secondTT;
        return xys._sampleZeroDateTT.getDaysDifference(dateTT);
    }

    /**
     * Preloads XYS data for a specified date range.
     *
     * @memberof Iau2006XysData
     *
     * @param {Number} startDayTT The Julian day number of the beginning of the interval to preload, expressed in
     *                 the Terrestrial Time (TT) time standard.
     * @param {Number} startSecondTT The seconds past noon of the beginning of the interval to preload, expressed in
     *                 the Terrestrial Time (TT) time standard.
     * @param {Number} stopDayTT The Julian day number of the end of the interval to preload, expressed in
     *                 the Terrestrial Time (TT) time standard.
     * @param {Number} stopSecondTT The seconds past noon of the end of the interval to preload, expressed in
     *                 the Terrestrial Time (TT) time standard.

     * @returns {Promise} A promise that, when resolved, indicates that the requested interval has been
     *                    preloaded.
     */
    Iau2006XysData.prototype.preload = function(startDayTT, startSecondTT, stopDayTT, stopSecondTT) {
        var startDaysSinceEpoch = getDaysSinceEpoch(this, startDayTT, startSecondTT);
        var stopDaysSinceEpoch = getDaysSinceEpoch(this, stopDayTT, stopSecondTT);

        var startIndex = (startDaysSinceEpoch / this._stepSizeDays - this._interpolationOrder / 2) | 0;
        if (startIndex < 0) {
            startIndex = 0;
        }

        var stopIndex = (stopDaysSinceEpoch / this._stepSizeDays - this._interpolationOrder / 2) | 0 + this._interpolationOrder;
        if (stopIndex >= this._totalSamples) {
            stopIndex = this._totalSamples - 1;
        }

        var startChunk = (startIndex / this._samplesPerXysFile) | 0;
        var stopChunk = (stopIndex / this._samplesPerXysFile) | 0;

        var promises = [];
        for ( var i = startChunk; i <= stopChunk; ++i) {
            promises.push(requestXysChunk(this, i));
        }

        return when.all(promises);
    };

    /**
     * Computes the XYS values for a given date by interpolating.  If the required data is not yet downloaded,
     * this method will return undefined.
     *
     * @memberof Iau2006XysData
     *
     * @param {Number} dayTT The Julian day number for which to compute the XYS value, expressed in
     *                 the Terrestrial Time (TT) time standard.
     * @param {Number} secondTT The seconds past noon of the date for which to compute the XYS value, expressed in
     *                 the Terrestrial Time (TT) time standard.
     * @param {Iau2006XysSample} [result] The instance to which to copy the interpolated result.  If this parameter
     *                           is undefined, a new instance is allocated and returned.
     * @returns {Iau2006XysSample} The interpolated XYS values, or undefined if the required data for this
     *                             computation has not yet been downloaded.
     *
     * @see Iau2006XysData#preload
     */
    Iau2006XysData.prototype.computeXysRadians = function(dayTT, secondTT, result) {
        var daysSinceEpoch = getDaysSinceEpoch(this, dayTT, secondTT);
        if (daysSinceEpoch < 0.0) {
            // Can't evaluate prior to the epoch of the data.
            return undefined;
        }

        var centerIndex = (daysSinceEpoch / this._stepSizeDays) | 0;
        if (centerIndex >= this._totalSamples) {
            // Can't evaluate after the last sample in the data.
            return undefined;
        }

        var degree = this._interpolationOrder;

        var firstIndex = centerIndex - ((degree / 2) | 0);
        if (firstIndex < 0) {
            firstIndex = 0;
        }
        var lastIndex = firstIndex + degree;
        if (lastIndex >= this._totalSamples) {
            lastIndex = this._totalSamples - 1;
            firstIndex = lastIndex - degree;
            if (firstIndex < 0) {
                firstIndex = 0;
            }
        }

        // Are all the samples we need present?
        // We can assume so if the first and last are present
        var isDataMissing = false;
        var samples = this._samples;
        if (!defined(samples[firstIndex * 3])) {
            requestXysChunk(this, (firstIndex / this._samplesPerXysFile) | 0);
            isDataMissing = true;
        }

        if (!defined(samples[lastIndex * 3])) {
            requestXysChunk(this, (lastIndex / this._samplesPerXysFile) | 0);
            isDataMissing = true;
        }

        if (isDataMissing) {
            return undefined;
        }

        if (!defined(result)) {
            result = new Iau2006XysSample(0.0, 0.0, 0.0);
        } else {
            result.x = 0.0;
            result.y = 0.0;
            result.s = 0.0;
        }

        var x = daysSinceEpoch - firstIndex * this._stepSizeDays;

        var work = this._work;
        var denom = this._denominators;
        var coef = this._coef;
        var xTable = this._xTable;

        var i, j;
        for (i = 0; i <= degree; ++i) {
            work[i] = x - xTable[i];
        }

        for (i = 0; i <= degree; ++i) {
            coef[i] = 1.0;

            for (j = 0; j <= degree; ++j) {
                if (j !== i) {
                    coef[i] *= work[j];
                }
            }

            coef[i] *= denom[i];

            var sampleIndex = (firstIndex + i) * 3;
            result.x += coef[i] * samples[sampleIndex++];
            result.y += coef[i] * samples[sampleIndex++];
            result.s += coef[i] * samples[sampleIndex];
        }

        return result;
    };

    function requestXysChunk(xysData, chunkIndex) {
        if (xysData._chunkDownloadsInProgress[chunkIndex]) {
            // Chunk has already been requested.
            return xysData._chunkDownloadsInProgress[chunkIndex];
        }

        var deferred = when.defer();

        xysData._chunkDownloadsInProgress[chunkIndex] = deferred;

        var chunkUrl;
        var xysFileUrlTemplate = xysData._xysFileUrlTemplate;
        if (defined(xysFileUrlTemplate)) {
            chunkUrl = xysFileUrlTemplate.replace('{0}', chunkIndex);
        } else {
            chunkUrl = buildModuleUrl('Assets/IAU2006_XYS/IAU2006_XYS_' + chunkIndex + '.json');
        }

        when(loadJson(chunkUrl), function(chunk) {
            xysData._chunkDownloadsInProgress[chunkIndex] = false;

            var samples = xysData._samples;
            var newSamples = chunk.samples;
            var startIndex = chunkIndex * xysData._samplesPerXysFile * 3;

            for ( var i = 0, len = newSamples.length; i < len; ++i) {
                samples[startIndex + i] = newSamples[i];
            }

            deferred.resolve();
        });

        return deferred.promise;
    }

    return Iau2006XysData;
});
/*global define*/
define('Core/Cartesian2',[
        './defaultValue',
        './defined',
        './DeveloperError',
        './freezeObject'
    ], function(
        defaultValue,
        defined,
        DeveloperError,
        freezeObject) {
    "use strict";

    /**
     * A 2D Cartesian point.
     * @alias Cartesian2
     * @constructor
     *
     * @param {Number} [x=0.0] The X component.
     * @param {Number} [y=0.0] The Y component.
     *
     * @see Packable
     * @see Cartesian3
     * @see Cartesian4
     */
    var Cartesian2 = function(x, y) {
        /**
         * The Y component.
         * @type {Number}
         * @default 0.0
         */
        this.x = defaultValue(x, 0.0);

        /**
         * The X component.
         * @type {Number}
         * @default 0.0
         */
        this.y = defaultValue(y, 0.0);
    };

    /**
     * Creates a Cartesian2 instance from x and y coordinates.
     * @memberof Cartesian2
     *
     * @param {Number} x The x coordinate.
     * @param {Number} y The y coordinate.
     * @param {Cartesian2} [result] The object onto which to store the result.
     * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided.
     */
    Cartesian2.fromElements = function(x, y, result) {
        if (!defined(result)) {
            return new Cartesian2(x, y);
        }

        result.x = x;
        result.y = y;
        return result;
    };

    /**
     * Duplicates a Cartesian2 instance.
     * @memberof Cartesian2
     *
     * @param {Cartesian2} cartesian The Cartesian to duplicate.
     * @param {Cartesian2} [result] The object onto which to store the result.
     * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided. (Returns undefined if cartesian is undefined)
     */
    Cartesian2.clone = function(cartesian, result) {
        if (!defined(cartesian)) {
            return undefined;
        }

        if (!defined(result)) {
            return new Cartesian2(cartesian.x, cartesian.y);
        }

        result.x = cartesian.x;
        result.y = cartesian.y;
        return result;
    };

    /**
     * Creates a Cartesian2 instance from an existing Cartesian3.  This simply takes the
     * x and y properties of the Cartesian3 and drops z.
     * @memberof Cartesian2
     * @function
     *
     * @param {Cartesian3} cartesian The Cartesian3 instance to create a Cartesian2 instance from.
     * @param {Cartesian2} [result] The object onto which to store the result.
     * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided.
     *
     * @exception {DeveloperError} cartesian is required.
     */
    Cartesian2.fromCartesian3 = Cartesian2.clone;

    /**
     * Creates a Cartesian2 instance from an existing Cartesian4.  This simply takes the
     * x and y properties of the Cartesian4 and drops z and w.
     * @function
     *
     * @param {Cartesian4} cartesian The Cartesian4 instance to create a Cartesian2 instance from.
     * @param {Cartesian2} [result] The object onto which to store the result.
     * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided.
     *
     * @exception {DeveloperError} cartesian is required.
     */
    Cartesian2.fromCartesian4 = Cartesian2.clone;

    /**
     * The number of elements used to pack the object into an array.
     * @Type {Number}
     */
    Cartesian2.packedLength = 2;

    /**
     * Stores the provided instance into the provided array.
     * @memberof Cartesian2
     *
     * @param {Cartesian2} value The value to pack.
     * @param {Array} array The array to pack into.
     * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
     *
     * @exception {DeveloperError} value is required.
     * @exception {DeveloperError} array is required.
     */
    Cartesian2.pack = function(value, array, startingIndex) {
        if (!defined(value)) {
            throw new DeveloperError('value is required');
        }

        if (!defined(array)) {
            throw new DeveloperError('array is required');
        }

        startingIndex = defaultValue(startingIndex, 0);

        array[startingIndex++] = value.x;
        array[startingIndex] = value.y;
    };

    /**
     * Retrieves an instance from a packed array.
     * @memberof Cartesian2
     *
     * @param {Array} array The packed array.
     * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
     * @param {Cartesian2} [result] The object into which to store the result.
     *
     * @exception {DeveloperError} array is required.
     */
    Cartesian2.unpack = function(array, startingIndex, result) {
        if (!defined(array)) {
            throw new DeveloperError('array is required');
        }

        startingIndex = defaultValue(startingIndex, 0);

        if (!defined(result)) {
            result = new Cartesian2();
        }
        result.x = array[startingIndex++];
        result.y = array[startingIndex];
        return result;
    };

    /**
     * Creates a Cartesian2 from two consecutive elements in an array.
     * @memberof Cartesian2
     *
     * @param {Array} array The array whose two consecutive elements correspond to the x and y components, respectively.
     * @param {Number} [startingIndex=0] The offset into the array of the first element, which corresponds to the x component.
     * @param {Cartesian2} [result] The object onto which to store the result.
     *
     * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided.
     *
     * @exception {DeveloperError} array is required.
     *
     * @example
     * // Create a Cartesian2 with (1.0, 2.0)
     * var v = [1.0, 2.0];
     * var p = Cartesian2.fromArray(v);
     *
     * // Create a Cartesian2 with (1.0, 2.0) using an offset into an array
     * var v2 = [0.0, 0.0, 1.0, 2.0];
     * var p2 = Cartesian2.fromArray(v2, 2);
     */
    Cartesian2.fromArray = Cartesian2.unpack;

    /**
     * Computes the value of the maximum component for the supplied Cartesian.
     * @memberof Cartesian2
     *
     * @param {Cartesian2} The cartesian to use.
     * @returns {Number} The value of the maximum component.
     *
     * @exception {DeveloperError} cartesian is required.
     */
    Cartesian2.getMaximumComponent = function(cartesian) {
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required');
        }
        return Math.max(cartesian.x, cartesian.y);
    };

    /**
     * Computes the value of the minimum component for the supplied Cartesian.
     * @memberof Cartesian2
     *
     * @param {Cartesian2} The cartesian to use.
     * @returns {Number} The value of the minimum component.
     *
     * @exception {DeveloperError} cartesian is required.
     */
    Cartesian2.getMinimumComponent = function(cartesian) {
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required');
        }
        return Math.min(cartesian.x, cartesian.y);
    };

    /**
     * Computes the provided Cartesian's squared magnitude.
     * @memberof Cartesian2
     *
     * @param {Cartesian2} cartesian The Cartesian instance whose squared magnitude is to be computed.
     * @returns {Number} The squared magnitude.
     *
     * @exception {DeveloperError} cartesian is required.
     */
    Cartesian2.magnitudeSquared = function(cartesian) {
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required');
        }
        return cartesian.x * cartesian.x + cartesian.y * cartesian.y;
    };

    /**
     * Computes the Cartesian's magnitude (length).
     * @memberof Cartesian2
     *
     * @param {Cartesian2} cartesian The Cartesian instance whose magnitude is to be computed.
     * @returns {Number} The magnitude.
     *
     * @exception {DeveloperError} cartesian is required.
     */
    Cartesian2.magnitude = function(cartesian) {
        return Math.sqrt(Cartesian2.magnitudeSquared(cartesian));
    };

    var distanceScratch = new Cartesian2();

    /**
     * Computes the distance between two points
     * @memberof Cartesian2
     *
     * @param {Cartesian2} left The first point to compute the distance from.
     * @param {Cartesian2} right The second point to compute the distance to.
     *
     * @returns {Number} The distance between two points.
     *
     * @exception {DeveloperError} left and right are required.
     *
     * @example
     * // Returns 1.0
     * var d = Cartesian2.distance(new Cartesian2(1.0, 0.0), new Cartesian2(2.0, 0.0));
     */
    Cartesian2.distance = function(left, right) {
        if (!defined(left) || !defined(right)) {
            throw new DeveloperError('left and right are required.');
        }

        Cartesian2.subtract(left, right, distanceScratch);
        return Cartesian2.magnitude(distanceScratch);
    };

    /**
     * Computes the normalized form of the supplied Cartesian.
     * @memberof Cartesian2
     *
     * @param {Cartesian2} cartesian The Cartesian to be normalized.
     * @param {Cartesian2} [result] The object onto which to store the result.
     * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided.
     *
     * @exception {DeveloperError} cartesian is required.
     */
    Cartesian2.normalize = function(cartesian, result) {
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required');
        }
        var magnitude = Cartesian2.magnitude(cartesian);
        if (!defined(result)) {
            return new Cartesian2(cartesian.x / magnitude, cartesian.y / magnitude);
        }
        result.x = cartesian.x / magnitude;
        result.y = cartesian.y / magnitude;
        return result;
    };

    /**
     * Computes the dot (scalar) product of two Cartesians.
     * @memberof Cartesian2
     *
     * @param {Cartesian2} left The first Cartesian.
     * @param {Cartesian2} right The second Cartesian.
     * @returns {Number} The dot product.
     *
     * @exception {DeveloperError} left is required.
     * @exception {DeveloperError} right is required.
     */
    Cartesian2.dot = function(left, right) {
        if (!defined(left)) {
            throw new DeveloperError('left is required');
        }
        if (!defined(right)) {
            throw new DeveloperError('right is required');
        }
        return left.x * right.x + left.y * right.y;
    };

    /**
     * Computes the componentwise product of two Cartesians.
     * @memberof Cartesian2
     *
     * @param {Cartesian2} left The first Cartesian.
     * @param {Cartesian2} right The second Cartesian.
     * @param {Cartesian2} [result] The object onto which to store the result.
     * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided.
     *
     * @exception {DeveloperError} left is required.
     * @exception {DeveloperError} right is required.
     */
    Cartesian2.multiplyComponents = function(left, right, result) {
        if (!defined(left)) {
            throw new DeveloperError('left is required');
        }
        if (!defined(right)) {
            throw new DeveloperError('right is required');
        }
        if (!defined(result)) {
            return new Cartesian2(left.x * right.x, left.y * right.y);
        }
        result.x = left.x * right.x;
        result.y = left.y * right.y;
        return result;
    };

    /**
     * Computes the componentwise sum of two Cartesians.
     * @memberof Cartesian2
     *
     * @param {Cartesian2} left The first Cartesian.
     * @param {Cartesian2} right The second Cartesian.
     * @param {Cartesian2} [result] The object onto which to store the result.
     * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided.
     *
     * @exception {DeveloperError} left is required.
     * @exception {DeveloperError} right is required.
     */
    Cartesian2.add = function(left, right, result) {
        if (!defined(left)) {
            throw new DeveloperError('left is required');
        }
        if (!defined(right)) {
            throw new DeveloperError('right is required');
        }
        if (!defined(result)) {
            return new Cartesian2(left.x + right.x, left.y + right.y);
        }
        result.x = left.x + right.x;
        result.y = left.y + right.y;
        return result;
    };

    /**
     * Computes the componentwise difference of two Cartesians.
     * @memberof Cartesian2
     *
     * @param {Cartesian2} left The first Cartesian.
     * @param {Cartesian2} right The second Cartesian.
     * @param {Cartesian2} [result] The object onto which to store the result.
     * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided.
     *
     * @exception {DeveloperError} left is required.
     * @exception {DeveloperError} right is required.
     */
    Cartesian2.subtract = function(left, right, result) {
        if (!defined(left)) {
            throw new DeveloperError('left is required');
        }
        if (!defined(right)) {
            throw new DeveloperError('right is required');
        }
        if (!defined(result)) {
            return new Cartesian2(left.x - right.x, left.y - right.y);
        }
        result.x = left.x - right.x;
        result.y = left.y - right.y;
        return result;
    };

    /**
     * Multiplies the provided Cartesian componentwise by the provided scalar.
     * @memberof Cartesian2
     *
     * @param {Cartesian2} cartesian The Cartesian to be scaled.
     * @param {Number} scalar The scalar to multiply with.
     * @param {Cartesian2} [result] The object onto which to store the result.
     * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided.
     *
     * @exception {DeveloperError} cartesian is required.
     * @exception {DeveloperError} scalar is required and must be a number.
     */
    Cartesian2.multiplyByScalar = function(cartesian, scalar, result) {
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required');
        }
        if (typeof scalar !== 'number') {
            throw new DeveloperError('scalar is required and must be a number.');
        }
        if (!defined(result)) {
            return new Cartesian2(cartesian.x * scalar, cartesian.y * scalar);
        }
        result.x = cartesian.x * scalar;
        result.y = cartesian.y * scalar;
        return result;
    };

    /**
     * Divides the provided Cartesian componentwise by the provided scalar.
     * @memberof Cartesian2
     *
     * @param {Cartesian2} cartesian The Cartesian to be divided.
     * @param {Number} scalar The scalar to divide by.
     * @param {Cartesian2} [result] The object onto which to store the result.
     * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided.
     *
     * @exception {DeveloperError} cartesian is required.
     * @exception {DeveloperError} scalar is required and must be a number.
     */
    Cartesian2.divideByScalar = function(cartesian, scalar, result) {
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required');
        }
        if (typeof scalar !== 'number') {
            throw new DeveloperError('scalar is required and must be a number.');
        }
        if (!defined(result)) {
            return new Cartesian2(cartesian.x / scalar, cartesian.y / scalar);
        }
        result.x = cartesian.x / scalar;
        result.y = cartesian.y / scalar;
        return result;
    };

    /**
     * Negates the provided Cartesian.
     * @memberof Cartesian2
     *
     * @param {Cartesian2} cartesian The Cartesian to be negated.
     * @param {Cartesian2} [result] The object onto which to store the result.
     * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided.
     *
     * @exception {DeveloperError} cartesian is required.
     */
    Cartesian2.negate = function(cartesian, result) {
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required');
        }
        if (!defined(result)) {
            return new Cartesian2(-cartesian.x, -cartesian.y);
        }
        result.x = -cartesian.x;
        result.y = -cartesian.y;
        return result;
    };

    /**
     * Computes the absolute value of the provided Cartesian.
     * @memberof Cartesian2
     *
     * @param {Cartesian2} cartesian The Cartesian whose absolute value is to be computed.
     * @param {Cartesian2} [result] The object onto which to store the result.
     * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided.
     *
     * @exception {DeveloperError} cartesian is required.
     */
    Cartesian2.abs = function(cartesian, result) {
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required');
        }
        if (!defined(result)) {
            return new Cartesian2(Math.abs(cartesian.x), Math.abs(cartesian.y));
        }
        result.x = Math.abs(cartesian.x);
        result.y = Math.abs(cartesian.y);
        return result;
    };

    var lerpScratch = new Cartesian2();
    /**
     * Computes the linear interpolation or extrapolation at t using the provided cartesians.
     * @memberof Cartesian2
     *
     * @param start The value corresponding to t at 0.0.
     * @param end The value corresponding to t at 1.0.
     * @param t The point along t at which to interpolate.
     * @param {Cartesian2} [result] The object onto which to store the result.
     * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided.
     *
     * @exception {DeveloperError} start is required.
     * @exception {DeveloperError} end is required.
     * @exception {DeveloperError} t is required and must be a number.
     */
    Cartesian2.lerp = function(start, end, t, result) {
        if (!defined(start)) {
            throw new DeveloperError('start is required.');
        }
        if (!defined(end)) {
            throw new DeveloperError('end is required.');
        }
        if (typeof t !== 'number') {
            throw new DeveloperError('t is required and must be a number.');
        }
        Cartesian2.multiplyByScalar(end, t, lerpScratch);
        result = Cartesian2.multiplyByScalar(start, 1.0 - t, result);
        return Cartesian2.add(lerpScratch, result, result);
    };

    var angleBetweenScratch = new Cartesian2();
    var angleBetweenScratch2 = new Cartesian2();
    /**
     * Returns the angle, in radians, between the provided Cartesians.
     * @memberof Cartesian2
     *
     * @param {Cartesian2} left The first Cartesian.
     * @param {Cartesian2} right The second Cartesian.
     * @returns {Number} The angle between the Cartesians.
     *
     * @exception {DeveloperError} left is required.
     * @exception {DeveloperError} right is required.
     */
    Cartesian2.angleBetween = function(left, right) {
        if (!defined(left)) {
            throw new DeveloperError('left is required');
        }
        if (!defined(right)) {
            throw new DeveloperError('right is required');
        }
        Cartesian2.normalize(left, angleBetweenScratch);
        Cartesian2.normalize(right, angleBetweenScratch2);
        return Math.acos(Cartesian2.dot(angleBetweenScratch, angleBetweenScratch2));
    };

    var mostOrthogonalAxisScratch = new Cartesian2();
    /**
     * Returns the axis that is most orthogonal to the provided Cartesian.
     * @memberof Cartesian2
     *
     * @param {Cartesian2} cartesian The Cartesian on which to find the most orthogonal axis.
     * @param {Cartesian2} [result] The object onto which to store the result.
     * @returns {Cartesian2} The most orthogonal axis.
     *
     * @exception {DeveloperError} cartesian is required.
     */
    Cartesian2.mostOrthogonalAxis = function(cartesian, result) {
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required.');
        }

        var f = Cartesian2.normalize(cartesian, mostOrthogonalAxisScratch);
        Cartesian2.abs(f, f);

        if (f.x <= f.y) {
            result = Cartesian2.clone(Cartesian2.UNIT_X, result);
        } else {
            result = Cartesian2.clone(Cartesian2.UNIT_Y, result);
        }

        return result;
    };

    /**
     * Compares the provided Cartesians componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     * @memberof Cartesian2
     *
     * @param {Cartesian2} [left] The first Cartesian.
     * @param {Cartesian2} [right] The second Cartesian.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    Cartesian2.equals = function(left, right) {
        return (left === right) ||
               ((defined(left)) &&
                (defined(right)) &&
                (left.x === right.x) &&
                (left.y === right.y));
    };

    /**
     * Compares the provided Cartesians componentwise and returns
     * <code>true</code> if they are within the provided epsilon,
     * <code>false</code> otherwise.
     * @memberof Cartesian2
     *
     * @param {Cartesian2} [left] The first Cartesian.
     * @param {Cartesian2} [right] The second Cartesian.
     * @param {Number} epsilon The epsilon to use for equality testing.
     * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
     *
     * @exception {DeveloperError} epsilon is required and must be a number.
     */
    Cartesian2.equalsEpsilon = function(left, right, epsilon) {
        if (typeof epsilon !== 'number') {
            throw new DeveloperError('epsilon is required and must be a number.');
        }
        return (left === right) ||
               ((defined(left)) &&
                (defined(right)) &&
                (Math.abs(left.x - right.x) <= epsilon) &&
                (Math.abs(left.y - right.y) <= epsilon));
    };

    /**
     * An immutable Cartesian2 instance initialized to (0.0, 0.0).
     * @memberof Cartesian2
     */
    Cartesian2.ZERO = freezeObject(new Cartesian2(0.0, 0.0));

    /**
     * An immutable Cartesian2 instance initialized to (1.0, 0.0).
     * @memberof Cartesian2
     */
    Cartesian2.UNIT_X = freezeObject(new Cartesian2(1.0, 0.0));

    /**
     * An immutable Cartesian2 instance initialized to (0.0, 1.0).
     * @memberof Cartesian2
     */
    Cartesian2.UNIT_Y = freezeObject(new Cartesian2(0.0, 1.0));

    /**
     * Duplicates this Cartesian2 instance.
     * @memberof Cartesian2
     *
     * @param {Cartesian2} [result] The object onto which to store the result.
     * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided.
     */
    Cartesian2.prototype.clone = function(result) {
        return Cartesian2.clone(this, result);
    };

    /**
     * Creates a string representing this Cartesian in the format '(x, y)'.
     * @memberof Cartesian2
     *
     * @returns {String} A string representing the provided Cartesian in the format '(x, y)'.
     */
    Cartesian2.prototype.toString = function() {
        return '(' + this.x + ', ' + this.y + ')';
    };

    return Cartesian2;
});

/*global define*/
define('Core/EarthOrientationParametersSample',[],function() {
    "use strict";

    /**
     * A set of Earth Orientation Parameters (EOP) sampled at a time.
     *
     * @alias EarthOrientationParametersSample
     * @constructor
     *
     * @param {Number} xPoleWander The pole wander about the X axis, in radians.
     * @param {Number} yPoleWander The pole wander about the Y axis, in radians.
     * @param {Number} xPoleOffset The offset to the Celestial Intermediate Pole (CIP) about the X axis, in radians.
     * @param {Number} yPoleOffset The offset to the Celestial Intermediate Pole (CIP) about the Y axis, in radians.
     * @param {Number} ut1MinusUtc The difference in time standards, UT1 - UTC, in seconds.
     */
    var EarthOrientationParametersSample = function EarthOrientationParametersSample(xPoleWander, yPoleWander, xPoleOffset, yPoleOffset, ut1MinusUtc) {
        /**
         * The pole wander about the X axis, in radians.
         * @type {Number}
         */
        this.xPoleWander = xPoleWander;

        /**
         * The pole wander about the Y axis, in radians.
         * @type {Number}
         */
        this.yPoleWander = yPoleWander;

        /**
         * The offset to the Celestial Intermediate Pole (CIP) about the X axis, in radians.
         * @type {Number}
         */
        this.xPoleOffset = xPoleOffset;

        /**
         * The offset to the Celestial Intermediate Pole (CIP) about the Y axis, in radians.
         * @type {Number}
         */
        this.yPoleOffset = yPoleOffset;

        /**
         * The difference in time standards, UT1 - UTC, in seconds.
         * @type {Number}
         */
        this.ut1MinusUtc = ut1MinusUtc;
    };

    return EarthOrientationParametersSample;
});
/*global define*/
define('Core/EarthOrientationParameters',[
        './binarySearch',
        './defaultValue',
        './defined',
        './freezeObject',
        './loadJson',
        './EarthOrientationParametersSample',
        './JulianDate',
        './LeapSecond',
        './RuntimeError',
        './TimeConstants',
        './TimeStandard',
        '../ThirdParty/when'
    ],
    function(
        binarySearch,
        defaultValue,
        defined,
        freezeObject,
        loadJson,
        EarthOrientationParametersSample,
        JulianDate,
        LeapSecond,
        RuntimeError,
        TimeConstants,
        TimeStandard,
        when) {
    "use strict";

    /**
     * Specifies Earth polar motion coordinates and the difference between UT1 and UTC.
     * These Earth Orientation Parameters (EOP) are primarily used in the transformation from
     * the International Celestial Reference Frame (ITRF) to the International Terrestrial
     * Reference Frame (ITRF).
     *
     * @alias EarthOrientationParameters
     * @constructor
     *
     * @param {String} [description.url] The URL from which to obtain EOP data.  If neither this
     *                 parameter nor description.data is specified, all EOP values are assumed
     *                 to be 0.0.  If description.data is specified, this parameter is
     *                 ignored.
     * @param {Object} [description.data] The actual EOP data.  If neither this
     *                 parameter nor description.data is specified, all EOP values are assumed
     *                 to be 0.0.
     * @param {Boolean} [description.addNewLeapSeconds=true] True if leap seconds that
     *                  are specified in the EOP data but not in {@link LeapSecond#getLeapSeconds}
     *                  should be added to {@link LeapSecond#getLeapSeconds}.  False if
     *                  new leap seconds should be handled correctly in the context
     *                  of the EOP data but otherwise ignored.
     *
     * @example
     * // An example EOP data file, EOP.json:
     * {
     *   "columnNames" : ["dateIso8601","xPoleWanderRadians","yPoleWanderRadians","ut1MinusUtcSeconds","lengthOfDayCorrectionSeconds","xCelestialPoleOffsetRadians","yCelestialPoleOffsetRadians","taiMinusUtcSeconds"],
     *   "samples" : [
     *      "2011-07-01T00:00:00Z",2.117957047295119e-7,2.111518721609984e-6,-0.2908948,-2.956e-4,3.393695767766752e-11,3.3452143996557983e-10,34.0,
     *      "2011-07-02T00:00:00Z",2.193297093339541e-7,2.115460256837405e-6,-0.29065,-1.824e-4,-8.241832578862112e-11,5.623838700870617e-10,34.0,
     *      "2011-07-03T00:00:00Z",2.262286080161428e-7,2.1191157519929706e-6,-0.2905572,1.9e-6,-3.490658503988659e-10,6.981317007977318e-10,34.0
     *   ]
     * }
     *
     * @example
     * // Loading the EOP data
     * var eop = new EarthOrientationParameters({ url : 'Data/EOP.json' });
     * Transforms.earthOrientationParameters = eop;
     */
    var EarthOrientationParameters = function EarthOrientationParameters(description) {
        description = defaultValue(description, defaultValue.EMPTY_OBJECT);

        this._dates = undefined;
        this._samples = undefined;

        this._dateColumn = -1;
        this._xPoleWanderRadiansColumn = -1;
        this._yPoleWanderRadiansColumn = -1;
        this._ut1MinusUtcSecondsColumn = -1;
        this._xCelestialPoleOffsetRadiansColumn = -1;
        this._yCelestialPoleOffsetRadiansColumn = -1;
        this._taiMinusUtcSecondsColumn = -1;

        this._columnCount = 0;
        this._lastIndex = -1;

        this._downloadPromise = undefined;
        this._dataError = undefined;

        this._addNewLeapSeconds = defaultValue(description.addNewLeapSeconds, true);

        if (defined(description.data)) {
            // Use supplied EOP data.
            onDataReady(this, description.data);
        } else if (defined(description.url)) {
            // Download EOP data.
            var that = this;
            this._downloadPromise = when(loadJson(description.url), function(eopData) {
                onDataReady(that, eopData);
            }, function() {
                that._dataError = 'An error occurred while retrieving the EOP data from the URL ' + description.url + '.';
            });
        } else {
            // Use all zeros for EOP data.
            onDataReady(this, {
                'columnNames' : ['dateIso8601', 'modifiedJulianDateUtc', 'xPoleWanderRadians', 'yPoleWanderRadians', 'ut1MinusUtcSeconds', 'lengthOfDayCorrectionSeconds', 'xCelestialPoleOffsetRadians', 'yCelestialPoleOffsetRadians', 'taiMinusUtcSeconds'],
                'samples' : []
            });
        }
    };

    /**
     * A default {@link EarthOrientationParameters} instance that returns zero for all EOP values.
     */
    EarthOrientationParameters.NONE = freezeObject({
            getPromiseToLoad : function() {
                return when();
            },
            compute : function(date, result) {
                if (!defined(result)) {
                    result = new EarthOrientationParametersSample(0.0, 0.0, 0.0, 0.0, 0.0);
                } else {
                    result.xPoleWander = 0.0;
                    result.yPoleWander = 0.0;
                    result.xPoleOffset = 0.0;
                    result.yPoleOffset = 0.0;
                    result.ut1MinusUtc = 0.0;
                }
                return result;
            }
    });

    /**
     * Gets a promise that, when resolved, indicates that the EOP data has been loaded and is
     * ready to use.
     *
     * @memberof EarthOrientationParameters
     *
     * @returns {Promise} The promise.
     *
     * @see when
     */
    EarthOrientationParameters.prototype.getPromiseToLoad = function() {
        return when(this._downloadPromise);
    };

    /**
     * Computes the Earth Orientation Parameters (EOP) for a given date by interpolating.
     * If the EOP data has not yet been download, this method returns undefined.
     *
     * @memberof EarthOrientationParameters
     *
     * @param {JulianDate} date The date for each to evaluate the EOP.
     * @param {EarthOrientationParametersSample} [result] The instance to which to copy the result.
     *        If this parameter is undefined, a new instance is created and returned.
     * @returns {EarthOrientationParametersSample} The EOP evaluated at the given date, or
     *          undefined if the data necessary to evaluate EOP at the date has not yet been
     *          downloaded.
     *
     * @exception {RuntimeError} The loaded EOP data has an error and cannot be used.
     *
     * @see EarthOrientationParameters#getPromiseToLoad
     */
    EarthOrientationParameters.prototype.compute = function(date, result) {
        // We cannot compute until the samples are available.
        if (!defined(this._samples)) {
            if (defined(this._dataError)) {
                throw new RuntimeError(this._dataError);
            }

            return undefined;
        }

        if (!defined(result)) {
            result = new EarthOrientationParametersSample(0.0, 0.0, 0.0, 0.0, 0.0);
        }

        if (this._samples.length === 0) {
            result.xPoleWander = 0.0;
            result.yPoleWander = 0.0;
            result.xPoleOffset = 0.0;
            result.yPoleOffset = 0.0;
            result.ut1MinusUtc = 0.0;
            return result;
        }

        var dates = this._dates;
        var lastIndex = this._lastIndex;

        var before = 0;
        var after = 0;
        if (defined(lastIndex)) {
            var previousIndexDate = dates[lastIndex];
            var nextIndexDate = dates[lastIndex + 1];
            var isAfterPrevious = previousIndexDate.lessThanOrEquals(date);
            var isAfterLastSample = !defined(nextIndexDate);
            var isBeforeNext = isAfterLastSample || nextIndexDate.greaterThanOrEquals(date);

            if (isAfterPrevious && isBeforeNext) {
                before = lastIndex;

                if (!isAfterLastSample && nextIndexDate.equals(date)) {
                    ++before;
                }
                after = before + 1;

                interpolate(this, dates, this._samples, date, before, after, result);
                return result;
            }
        }

        var index = binarySearch(dates, date, JulianDate.compare, this._dateColumn);
        if (index >= 0) {
            // If the next entry is the same date, use the later entry.  This way, if two entries
            // describe the same moment, one before a leap second and the other after, then we will use
            // the post-leap second data.
            if (index < dates.length - 1 && dates[index + 1].equals(date)) {
                ++index;
            }
            before = index;
            after = index;
        } else {
            after = ~index;
            before = after - 1;

            // Use the first entry if the date requested is before the beginning of the data.
            if (before < 0) {
                before = 0;
            }
        }

        this._lastIndex = before;

        interpolate(this, dates, this._samples, date, before, after, result);
        return result;
    };

    function compareLeapSecondDates(leapSecond, dateToFind) {
        return JulianDate.compare(leapSecond.julianDate, dateToFind);
    }

    function onDataReady(eop, eopData) {
        if (!defined(eopData.columnNames)) {
            eop._dataError = 'Error in loaded EOP data: The columnNames property is required.';
            return;
        }

        if (!defined(eopData.samples)) {
            eop._dataError = 'Error in loaded EOP data: The samples property is required.';
            return;
        }

        var dateColumn = eopData.columnNames.indexOf('modifiedJulianDateUtc');
        var xPoleWanderRadiansColumn = eopData.columnNames.indexOf('xPoleWanderRadians');
        var yPoleWanderRadiansColumn = eopData.columnNames.indexOf('yPoleWanderRadians');
        var ut1MinusUtcSecondsColumn = eopData.columnNames.indexOf('ut1MinusUtcSeconds');
        var xCelestialPoleOffsetRadiansColumn = eopData.columnNames.indexOf('xCelestialPoleOffsetRadians');
        var yCelestialPoleOffsetRadiansColumn = eopData.columnNames.indexOf('yCelestialPoleOffsetRadians');
        var taiMinusUtcSecondsColumn = eopData.columnNames.indexOf('taiMinusUtcSeconds');

        if (dateColumn < 0 || xPoleWanderRadiansColumn < 0 || yPoleWanderRadiansColumn < 0 || ut1MinusUtcSecondsColumn < 0 || xCelestialPoleOffsetRadiansColumn < 0 || yCelestialPoleOffsetRadiansColumn < 0 || taiMinusUtcSecondsColumn < 0) {
            eop._dataError = 'Error in loaded EOP data: The columnNames property must include modifiedJulianDateUtc, xPoleWanderRadians, yPoleWanderRadians, ut1MinusUtcSeconds, xCelestialPoleOffsetRadians, yCelestialPoleOffsetRadians, and taiMinusUtcSeconds columns';
            return;
        }

        var samples = eop._samples = eopData.samples;
        var dates = eop._dates = [];

        eop._dateColumn = dateColumn;
        eop._xPoleWanderRadiansColumn = xPoleWanderRadiansColumn;
        eop._yPoleWanderRadiansColumn = yPoleWanderRadiansColumn;
        eop._ut1MinusUtcSecondsColumn = ut1MinusUtcSecondsColumn;
        eop._xCelestialPoleOffsetRadiansColumn = xCelestialPoleOffsetRadiansColumn;
        eop._yCelestialPoleOffsetRadiansColumn = yCelestialPoleOffsetRadiansColumn;
        eop._taiMinusUtcSecondsColumn = taiMinusUtcSecondsColumn;

        eop._columnCount = eopData.columnNames.length;
        eop._lastIndex = undefined;

        var lastTaiMinusUtc;

        var addNewLeapSeconds = eop._addNewLeapSeconds;

        // Convert the ISO8601 dates to JulianDates.
        for (var i = 0, len = samples.length; i < len; i += eop._columnCount) {
            var mjd = samples[i + dateColumn];
            var taiMinusUtc = samples[i + taiMinusUtcSecondsColumn];
            var day = mjd + TimeConstants.MODIFIED_JULIAN_DATE_DIFFERENCE;
            var date = new JulianDate(day, taiMinusUtc, TimeStandard.TAI);
            dates.push(date);

            if (addNewLeapSeconds) {
                if (taiMinusUtc !== lastTaiMinusUtc && defined(lastTaiMinusUtc)) {
                    // We crossed a leap second boundary, so add the leap second
                    // if it does not already exist.
                    var leapSeconds = LeapSecond.getLeapSeconds();
                    var leapSecondIndex = binarySearch(leapSeconds, date, compareLeapSecondDates);
                    if (leapSecondIndex < 0) {
                        var leapSecond = new LeapSecond(date, taiMinusUtc);
                        leapSeconds.splice(~leapSecondIndex, 0, leapSecond);
                    }
                }
                lastTaiMinusUtc = taiMinusUtc;
            }
        }
    }

    function fillResultFromIndex(eop, samples, index, columnCount, result) {
        var start = index * columnCount;
        result.xPoleWander = samples[start + eop._xPoleWanderRadiansColumn];
        result.yPoleWander = samples[start + eop._yPoleWanderRadiansColumn];
        result.xPoleOffset = samples[start + eop._xCelestialPoleOffsetRadiansColumn];
        result.yPoleOffset = samples[start + eop._yCelestialPoleOffsetRadiansColumn];
        result.ut1MinusUtc = samples[start + eop._ut1MinusUtcSecondsColumn];
    }

    function linearInterp(dx, y1, y2) {
        return y1 + dx * (y2 - y1);
    }

    function interpolate(eop, dates, samples, date, before, after, result) {
        var columnCount = eop._columnCount;

        // First check the bounds on the EOP data
        // If we are after the bounds of the data, return zeros.
        // The 'before' index should never be less than zero.
        if (after > dates.length - 1) {
            result.xPoleWander = 0;
            result.yPoleWander = 0;
            result.xPoleOffset = 0;
            result.yPoleOffset = 0;
            result.ut1MinusUtc = 0;
            return result;
        }

        var beforeDate = dates[before];
        var afterDate = dates[after];
        if (beforeDate.equals(afterDate) || date.equals(beforeDate)) {
            fillResultFromIndex(eop, samples, before, columnCount, result);
            return result;
        } else if (date.equals(afterDate)) {
            fillResultFromIndex(eop, samples, after, columnCount, result);
            return result;
        }

        var factor = beforeDate.getSecondsDifference(date) / beforeDate.getSecondsDifference(afterDate);

        var startBefore = before * columnCount;
        var startAfter = after * columnCount;

        // Handle UT1 leap second edge case
        var beforeUt1MinusUtc = samples[startBefore + eop._ut1MinusUtcSecondsColumn];
        var afterUt1MinusUtc = samples[startAfter + eop._ut1MinusUtcSecondsColumn];

        var offsetDifference = afterUt1MinusUtc - beforeUt1MinusUtc;
        if (offsetDifference > 0.5 || offsetDifference < -0.5) {
            // The absolute difference between the values is more than 0.5, so we may have
            // crossed a leap second.  Check if this is the case and, if so, adjust the
            // afterValue to account for the leap second.  This way, our interpolation will
            // produce reasonable results.
            var beforeTaiMinusUtc = samples[startBefore + eop._taiMinusUtcSecondsColumn];
            var afterTaiMinusUtc = samples[startAfter + eop._taiMinusUtcSecondsColumn];
            if (beforeTaiMinusUtc !== afterTaiMinusUtc) {
                if (afterDate.equals(date)) {
                    // If we are at the end of the leap second interval, take the second value
                    // Otherwise, the interpolation below will yield the wrong side of the
                    // discontinuity
                    // At the end of the leap second, we need to start accounting for the jump
                    beforeUt1MinusUtc = afterUt1MinusUtc;
                } else {
                    // Otherwise, remove the leap second so that the interpolation is correct
                    afterUt1MinusUtc -= afterTaiMinusUtc - beforeTaiMinusUtc;
                }
            }
        }

        result.xPoleWander = linearInterp(factor, samples[startBefore + eop._xPoleWanderRadiansColumn], samples[startAfter + eop._xPoleWanderRadiansColumn]);
        result.yPoleWander = linearInterp(factor, samples[startBefore + eop._yPoleWanderRadiansColumn], samples[startAfter + eop._yPoleWanderRadiansColumn]);
        result.xPoleOffset = linearInterp(factor, samples[startBefore + eop._xCelestialPoleOffsetRadiansColumn], samples[startAfter + eop._xCelestialPoleOffsetRadiansColumn]);
        result.yPoleOffset = linearInterp(factor, samples[startBefore + eop._yCelestialPoleOffsetRadiansColumn], samples[startAfter + eop._yCelestialPoleOffsetRadiansColumn]);
        result.ut1MinusUtc = linearInterp(factor, beforeUt1MinusUtc, afterUt1MinusUtc);
        return result;
    }

    return EarthOrientationParameters;
});
/*global define*/
define('Core/Transforms',[
        './defaultValue',
        './defined',
        './DeveloperError',
        './Iau2006XysData',
        './Iau2006XysSample',
        './Math',
        './Matrix3',
        './Matrix4',
        './Cartesian2',
        './Cartesian3',
        './Cartesian4',
        './TimeConstants',
        './Ellipsoid',
        './EarthOrientationParameters',
        './EarthOrientationParametersSample',
        '../ThirdParty/when'
    ],
    function(
        defaultValue,
        defined,
        DeveloperError,
        Iau2006XysData,
        Iau2006XysSample,
        CesiumMath,
        Matrix3,
        Matrix4,
        Cartesian2,
        Cartesian3,
        Cartesian4,
        TimeConstants,
        Ellipsoid,
        EarthOrientationParameters,
        EarthOrientationParametersSample,
        when) {
    "use strict";

    /**
     * Contains functions for transforming positions to various reference frames.
     * @exports Transforms
     */
    var Transforms = {};

    var eastNorthUpToFixedFrameNormal = new Cartesian3();
    var eastNorthUpToFixedFrameTangent = new Cartesian3();
    var eastNorthUpToFixedFrameBitangent = new Cartesian3();

    /**
     * Computes a 4x4 transformation matrix from a reference frame with an east-north-up axes
     * centered at the provided origin to the provided ellipsoid's fixed reference frame.
     * The local axes are defined as:
     * <ul>
     * <li>The <code>x</code> axis points in the local east direction.</li>
     * <li>The <code>y</code> axis points in the local north direction.</li>
     * <li>The <code>z</code> axis points in the direction of the ellipsoid surface normal which passes through the position.</li>
     * </ul>
     *
     * @memberof Transforms
     *
     * @param {Cartesian3} origin The center point of the local reference frame.
     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid whose fixed frame is used in the transformation.
     * @param {Matrix4} [result] The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if none was provided.
     *
     * @exception {DeveloperError} origin is required.
     *
     * @example
     * // Get the transform from local east-north-up at cartographic (0.0, 0.0) to Earth's fixed frame.
     * var ellipsoid = Ellipsoid.WGS84;
     * var center = ellipsoid.cartographicToCartesian(Cartographic.ZERO);
     * var transform = Transforms.eastNorthUpToFixedFrame(center);
     */
    Transforms.eastNorthUpToFixedFrame = function(origin, ellipsoid, result) {
        if (!defined(origin)) {
            throw new DeveloperError('origin is required.');
        }

        // If x and y are zero, assume origin is at a pole, which is a special case.
        if (CesiumMath.equalsEpsilon(origin.x, 0.0, CesiumMath.EPSILON14) &&
            CesiumMath.equalsEpsilon(origin.y, 0.0, CesiumMath.EPSILON14)) {
            var sign = CesiumMath.sign(origin.z);
            if (!defined(result)) {
                return new Matrix4(
                        0.0, -sign,  0.0, origin.x,
                        1.0,   0.0,  0.0, origin.y,
                        0.0,   0.0, sign, origin.z,
                        0.0,   0.0,  0.0, 1.0);
            }
            result[0] = 0.0;
            result[1] = 1.0;
            result[2] = 0.0;
            result[3] = 0.0;
            result[4] = -sign;
            result[5] = 0.0;
            result[6] = 0.0;
            result[7] = 0.0;
            result[8] = 0.0;
            result[9] = 0.0;
            result[10] = sign;
            result[11] = 0.0;
            result[12] = origin.x;
            result[13] = origin.y;
            result[14] = origin.z;
            result[15] = 1.0;
            return result;
        }

        var normal = eastNorthUpToFixedFrameNormal;
        var tangent  = eastNorthUpToFixedFrameTangent;
        var bitangent = eastNorthUpToFixedFrameBitangent;

        ellipsoid = defaultValue(ellipsoid, Ellipsoid.WGS84);
        ellipsoid.geodeticSurfaceNormal(origin, normal);

        tangent.x = -origin.y;
        tangent.y = origin.x;
        tangent.z = 0.0;
        Cartesian3.normalize(tangent, tangent);

        Cartesian3.cross(normal, tangent, bitangent);

        if (!defined(result)) {
            return new Matrix4(
                    tangent.x, bitangent.x, normal.x, origin.x,
                    tangent.y, bitangent.y, normal.y, origin.y,
                    tangent.z, bitangent.z, normal.z, origin.z,
                    0.0,       0.0,         0.0,      1.0);
        }
        result[0] = tangent.x;
        result[1] = tangent.y;
        result[2] = tangent.z;
        result[3] = 0.0;
        result[4] = bitangent.x;
        result[5] = bitangent.y;
        result[6] = bitangent.z;
        result[7] = 0.0;
        result[8] = normal.x;
        result[9] = normal.y;
        result[10] = normal.z;
        result[11] = 0.0;
        result[12] = origin.x;
        result[13] = origin.y;
        result[14] = origin.z;
        result[15] = 1.0;
        return result;
    };

    var northEastDownToFixedFrameNormal = new Cartesian3();
    var northEastDownToFixedFrameTangent = new Cartesian3();
    var northEastDownToFixedFrameBitangent = new Cartesian3();

    /**
     * Computes a 4x4 transformation matrix from a reference frame with an north-east-down axes
     * centered at the provided origin to the provided ellipsoid's fixed reference frame.
     * The local axes are defined as:
     * <ul>
     * <li>The <code>x</code> axis points in the local north direction.</li>
     * <li>The <code>y</code> axis points in the local east direction.</li>
     * <li>The <code>z</code> axis points in the opposite direction of the ellipsoid surface normal which passes through the position.</li>
     * </ul>
     *
     * @memberof Transforms
     *
     * @param {Cartesian3} origin The center point of the local reference frame.
     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid whose fixed frame is used in the transformation.
     * @param {Matrix4} [result] The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if none was provided.
     *
     * @exception {DeveloperError} origin is required.
     *
     * @example
     * // Get the transform from local north-east-down at cartographic (0.0, 0.0) to Earth's fixed frame.
     * var ellipsoid = Ellipsoid.WGS84;
     * var center = ellipsoid.cartographicToCartesian(Cartographic.ZERO);
     * var transform = Transforms.northEastDownToFixedFrame(center);
     */
    Transforms.northEastDownToFixedFrame = function(origin, ellipsoid, result) {
        if (!defined(origin)) {
            throw new DeveloperError('origin is required.');
        }

        if (CesiumMath.equalsEpsilon(origin.x, 0.0, CesiumMath.EPSILON14) &&
            CesiumMath.equalsEpsilon(origin.y, 0.0, CesiumMath.EPSILON14)) {
            // The poles are special cases.  If x and y are zero, assume origin is at a pole.
            var sign = CesiumMath.sign(origin.z);
            if (!defined(result)) {
                return new Matrix4(
                  -sign, 0.0,   0.0, origin.x,
                    0.0, 1.0,   0.0, origin.y,
                    0.0, 0.0, -sign, origin.z,
                    0.0, 0.0,   0.0, 1.0);
            }
            result[0] = -sign;
            result[1] = 0.0;
            result[2] = 0.0;
            result[3] = 0.0;
            result[4] = 0.0;
            result[5] = 1.0;
            result[6] = 0.0;
            result[7] = 0.0;
            result[8] = 0.0;
            result[9] = 0.0;
            result[10] = -sign;
            result[11] = 0.0;
            result[12] = origin.x;
            result[13] = origin.y;
            result[14] = origin.z;
            result[15] = 1.0;
            return result;
        }

        var normal = northEastDownToFixedFrameNormal;
        var tangent = northEastDownToFixedFrameTangent;
        var bitangent = northEastDownToFixedFrameBitangent;

        ellipsoid = defaultValue(ellipsoid, Ellipsoid.WGS84);
        ellipsoid.geodeticSurfaceNormal(origin, normal);

        tangent.x = -origin.y;
        tangent.y = origin.x;
        tangent.z = 0.0;
        Cartesian3.normalize(tangent, tangent);

        Cartesian3.cross(normal, tangent, bitangent);

        if (!defined(result)) {
            return new Matrix4(
                    bitangent.x, tangent.x, -normal.x, origin.x,
                    bitangent.y, tangent.y, -normal.y, origin.y,
                    bitangent.z, tangent.z, -normal.z, origin.z,
                    0.0,       0.0,         0.0,      1.0);
        }
        result[0] = bitangent.x;
        result[1] = bitangent.y;
        result[2] = bitangent.z;
        result[3] = 0.0;
        result[4] = tangent.x;
        result[5] = tangent.y;
        result[6] = tangent.z;
        result[7] = 0.0;
        result[8] = -normal.x;
        result[9] = -normal.y;
        result[10] = -normal.z;
        result[11] = 0.0;
        result[12] = origin.x;
        result[13] = origin.y;
        result[14] = origin.z;
        result[15] = 1.0;
        return result;
    };

    var gmstConstant0 = 6 * 3600 + 41 * 60 + 50.54841;
    var gmstConstant1 = 8640184.812866;
    var gmstConstant2 = 0.093104;
    var gmstConstant3 = -6.2E-6;
    var rateCoef = 1.1772758384668e-19;
    var wgs84WRPrecessing = 7.2921158553E-5;
    var twoPiOverSecondsInDay = CesiumMath.TWO_PI / 86400.0;

    /**
     * Computes a rotation matrix to transform a point or vector from True Equator Mean Equinox (TEME) axes to the
     * pseudo-fixed axes at a given time.  This method treats the UT1 time standard as equivalent to UTC.
     *
     * @memberof Transforms
     *
     * @param {JulianDate} date The time at which to compute the rotation matrix.
     * @param {Matrix3} [result] The object onto which to store the result.
     * @returns {Matrix3} The modified result parameter or a new Matrix3 instance if none was provided.
     *
     * @exception {DeveloperError} date is required.
     *
     * @example
     * //Set the view to in the inertial frame.
     * function updateAndRender() {
     *     var now = new JulianDate();
     *     scene.initializeFrame();
     *     scene.setSunPosition(Simon1994PlanetaryPositions.ComputeSunPositionInEarthInertialFrame(now));
     *     scene.getCamera().transform = Matrix4.fromRotationTranslation(Transforms.computeTemeToPseudoFixedMatrix(now), Cartesian3.ZERO);
     *     scene.render();
     *     requestAnimationFrame(updateAndRender);
     * }
     * updateAndRender();
     */
    Transforms.computeTemeToPseudoFixedMatrix = function (date, result) {
        if (!defined(date)) {
            throw new DeveloperError('date is required.');
        }

        // GMST is actually computed using UT1.  We're using UTC as an approximation of UT1.
        // We do not want to use the function like convertTaiToUtc in JulianDate because
        // we explicitly do not want to fail when inside the leap second.

        var dateInUtc = date.addSeconds(-date.getTaiMinusUtc());
        var utcDayNumber = dateInUtc.getJulianDayNumber();
        var utcSecondsIntoDay = dateInUtc.getSecondsOfDay();

        var t;
        var diffDays = utcDayNumber - 2451545;
        if (utcSecondsIntoDay >= 43200.0) {
            t = (diffDays + 0.5) / TimeConstants.DAYS_PER_JULIAN_CENTURY;
        } else {
            t = (diffDays - 0.5) / TimeConstants.DAYS_PER_JULIAN_CENTURY;
        }

        var gmst0 = gmstConstant0 + t * (gmstConstant1 + t * (gmstConstant2 + t * gmstConstant3));
        var angle = (gmst0 * twoPiOverSecondsInDay) % CesiumMath.TWO_PI;
        var ratio = wgs84WRPrecessing + rateCoef * (utcDayNumber - 2451545.5);
        var secondsSinceMidnight = (utcSecondsIntoDay + TimeConstants.SECONDS_PER_DAY * 0.5) % TimeConstants.SECONDS_PER_DAY;
        var gha = angle + (ratio * secondsSinceMidnight);
        var cosGha = Math.cos(gha);
        var sinGha = Math.sin(gha);

        if (!defined(result)) {
            return new Matrix3(cosGha, sinGha, 0.0,
                              -sinGha, cosGha, 0.0,
                                  0.0,    0.0, 1.0);
        }
        result[0] = cosGha;
        result[1] = -sinGha;
        result[2] = 0.0;
        result[3] = sinGha;
        result[4] = cosGha;
        result[5] = 0.0;
        result[6] = 0.0;
        result[7] = 0.0;
        result[8] = 1.0;
        return result;
    };

    /**
     * The source of IAU 2006 XYS data, used for computing the transformation between the
     * Fixed and ICRF axes.
     * @type {Iau2006XysData}
     *
     * @memberof Transforms
     *
     * @see Transforms.computeIcrfToFixedMatrix
     * @see Transforms.computeFixedToIcrfMatrix
     */
    Transforms.iau2006XysData = new Iau2006XysData();

    /**
     * The source of Earth Orientation Parameters (EOP) data, used for computing the transformation
     * between the Fixed and ICRF axes.  By default, zero values are used for all EOP values,
     * yielding a reasonable but not completely accurate representation of the ICRF axes.
     * @type {EarthOrientationParameters}
     *
     * @memberof Transforms
     *
     * @see Transforms.computeIcrfToFixedMatrix
     * @see Transforms.computeFixedToIcrfMatrix
     */
    Transforms.earthOrientationParameters = EarthOrientationParameters.NONE;

    var ttMinusTai = 32.184;
    var j2000ttDays = 2451545.0;

    /**
     * Preloads the data necessary to transform between the ICRF and Fixed axes, in either
     * direction, over a given interval.  This function returns a promise that, when resolved,
     * indicates that the preload has completed.
     *
     * @memberof Transforms
     *
     * @param {TimeInterval} timeInterval The interval to preload.
     * @returns {Promise} A promise that, when resolved, indicates that the preload has completed
     *          and evaluation of the transformation between the fixed and ICRF axes will
     *          no longer return undefined for a time inside the interval.
     *
     * @see Transforms.computeIcrfToFixedMatrix
     * @see Transforms.computeFixedToIcrfMatrix
     * @see when
     *
     * @example
     * var interval = new TimeInterval(...);
     * when(preloadIcrfFixed(interval), function() {
     *     // the data is now loaded
     * });
     */
    Transforms.preloadIcrfFixed = function(timeInterval) {
        var startDayTT = timeInterval.start.getJulianDayNumber();
        var startSecondTT = timeInterval.start.getSecondsOfDay() + ttMinusTai;
        var stopDayTT = timeInterval.stop.getJulianDayNumber();
        var stopSecondTT = timeInterval.stop.getSecondsOfDay() + ttMinusTai;

        var xysPromise = Transforms.iau2006XysData.preload(startDayTT, startSecondTT, stopDayTT, stopSecondTT);
        var eopPromise = Transforms.earthOrientationParameters.getPromiseToLoad();

        return when.all([xysPromise, eopPromise]);
    };

    /**
     * Computes a rotation matrix to transform a point or vector from the International Celestial
     * Reference Frame (GCRF/ICRF) inertial frame axes to the Earth-Fixed frame axes (ITRF)
     * at a given time.  This function may return undefined if the data necessary to
     * do the transformation is not yet loaded.
     *
     * @memberof Transforms
     *
     * @param {JulianDate} date The time at which to compute the rotation matrix.
     * @param {Matrix3} [result] The object onto which to store the result.  If this parameter is
     *                  not specified, a new instance is created and returned.
     * @returns {Matrix3} The rotation matrix, or undefined if the data necessary to do the
     *                   transformation is not yet loaded.
     *
     * @exception {DeveloperError} date is required.
     *
     * @see Transforms.preloadIcrfFixed
     *
     * @example
     * //Set the view to the inertial frame.
     * function updateAndRender() {
     *     var now = new JulianDate();
     *     scene.initializeFrame();
     *     scene.setSunPosition(Simon1994PlanetaryPositions.ComputeSunPositionInEarthInertialFrame(now));
     *     var icrfToFixed = Transforms.computeIcrfToFixedMatrix(now);
     *     if (defined(icrfToFixed)) {
     *         scene.getCamera().transform = Matrix4.fromRotationTranslation(icrfToFixed, Cartesian3.ZERO);
     *     }
     *     scene.render();
     *     requestAnimationFrame(updateAndRender);
     * }
     * updateAndRender();
     */
    Transforms.computeIcrfToFixedMatrix = function(date, result) {
        if (!defined(date)) {
            throw new DeveloperError('date is required.');
        }

        var fixedToIcrfMtx = Transforms.computeFixedToIcrfMatrix(date, result);
        if (!defined(fixedToIcrfMtx)) {
            return undefined;
        }

        return fixedToIcrfMtx.transpose(result);
    };

    var xysScratch = new Iau2006XysSample(0.0, 0.0, 0.0);
    var eopScratch = new EarthOrientationParametersSample(0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
    var rotation1Scratch = new Matrix3();
    var rotation2Scratch = new Matrix3();

    /**
     * Computes a rotation matrix to transform a point or vector from the Earth-Fixed frame axes (ITRF)
     * to the International Celestial Reference Frame (GCRF/ICRF) inertial frame axes
     * at a given time.  This function may return undefined if the data necessary to
     * do the transformation is not yet loaded.
     *
     * @memberof Transforms
     *
     * @param {JulianDate} date The time at which to compute the rotation matrix.
     * @param {Matrix3} [result] The object onto which to store the result.  If this parameter is
     *                  not specified, a new instance is created and returned.
     * @returns {Matrix3} The rotation matrix, or undefined if the data necessary to do the
     *                   transformation is not yet loaded.
     *
     * @exception {DeveloperError} date is required.
     *
     * @see Transforms.preloadIcrfFixed
     *
     * @example
     * // Transform a point from the ICRF axes to the Fixed axes.
     * var now = new JulianDate();
     * var pointInFixed = new Cartesian3(...);
     * var fixedToIcrf = Transforms.computeIcrfToFixedMatrix(now);
     * var pointInInertial;
     * if (defined(fixedToIcrf)) {
     *     pointInInertial = fixedToIcrf.multiplyByVector(pointInFixed);
     * }
     */
    Transforms.computeFixedToIcrfMatrix = function(date, result) {
        if (!defined(date)) {
            throw new DeveloperError('date is required.');
        }

        // Compute pole wander
        var eop = Transforms.earthOrientationParameters.compute(date, eopScratch);
        if (!defined(eop)) {
            return undefined;
        }

        // There is no external conversion to Terrestrial Time (TT).
        // So use International Atomic Time (TAI) and convert using offsets.
        // Here we are assuming that dayTT and secondTT are positive
        var dayTT = date.getJulianDayNumber();
        // It's possible here that secondTT could roll over 86400
        // This does not seem to affect the precision (unit tests check for this)
        var secondTT = date.getSecondsOfDay() + ttMinusTai;

        var xys = Transforms.iau2006XysData.computeXysRadians(dayTT, secondTT, xysScratch);
        if (!defined(xys)) {
            return undefined;
        }

        var x = xys.x + eop.xPoleOffset;
        var y = xys.y + eop.yPoleOffset;

        // Compute XYS rotation
        var a = 1.0 / (1.0 + Math.sqrt(1.0 - x * x - y * y));

        var rotation1 = rotation1Scratch;
        rotation1[0] = 1.0 - a * x * x;
        rotation1[3] = -a * x * y;
        rotation1[6] = x;
        rotation1[1] = -a * x * y;
        rotation1[4] = 1 - a * y * y;
        rotation1[7] = y;
        rotation1[2] = -x;
        rotation1[5] = -y;
        rotation1[8] = 1 - a * (x * x + y * y);

        var rotation2 = Matrix3.fromRotationZ(-xys.s, rotation2Scratch);
        var matrixQ = rotation1.multiply(rotation2, rotation1Scratch);

        // Similar to TT conversions above
        // It's possible here that secondTT could roll over 86400
        // This does not seem to affect the precision (unit tests check for this)
        var dateUt1day = date.getJulianDayNumber();
        var dateUt1sec = date.getSecondsOfDay() - date.getTaiMinusUtc() + eop.ut1MinusUtc;

        // Compute Earth rotation angle
        // The IERS standard for era is
        //    era = 0.7790572732640 + 1.00273781191135448 * Tu
        // where
        //    Tu = JulianDateInUt1 - 2451545.0
        // However, you get much more precision if you make the following simplification
        //    era = a + (1 + b) * (JulianDayNumber + FractionOfDay - 2451545)
        //    era = a + (JulianDayNumber - 2451545) + FractionOfDay + b (JulianDayNumber - 2451545 + FractionOfDay)
        //    era = a + FractionOfDay + b (JulianDayNumber - 2451545 + FractionOfDay)
        // since (JulianDayNumber - 2451545) represents an integer number of revolutions which will be discarded anyway.
        var daysSinceJ2000 = dateUt1day - 2451545;
        var fractionOfDay = dateUt1sec / TimeConstants.SECONDS_PER_DAY;
        var era = 0.7790572732640 + fractionOfDay + 0.00273781191135448 * (daysSinceJ2000 + fractionOfDay);
        era = (era % 1.0) * CesiumMath.TWO_PI;

        var earthRotation = Matrix3.fromRotationZ(era, rotation2Scratch);

        // pseudoFixed to ICRF
        var pfToIcrf = matrixQ.multiply(earthRotation, rotation1Scratch);

        // Compute pole wander matrix
        var cosxp = Math.cos(eop.xPoleWander);
        var cosyp = Math.cos(eop.yPoleWander);
        var sinxp = Math.sin(eop.xPoleWander);
        var sinyp = Math.sin(eop.yPoleWander);

        var ttt = (dayTT - j2000ttDays) + secondTT / TimeConstants.SECONDS_PER_DAY;
        ttt /= 36525.0;

        // approximate sp value in rad
        var sp = -47.0e-6 * ttt * CesiumMath.RADIANS_PER_DEGREE / 3600.0;
        var cossp = Math.cos(sp);
        var sinsp = Math.sin(sp);

        var fToPfMtx = rotation2Scratch;
        fToPfMtx[0] = cosxp * cossp;
        fToPfMtx[1] = cosxp * sinsp;
        fToPfMtx[2] = sinxp;
        fToPfMtx[3] = -cosyp * sinsp + sinyp * sinxp * cossp;
        fToPfMtx[4] = cosyp * cossp + sinyp * sinxp * sinsp;
        fToPfMtx[5] = -sinyp * cosxp;
        fToPfMtx[6] = -sinyp * sinsp - cosyp * sinxp * cossp;
        fToPfMtx[7] = sinyp * cossp - cosyp * sinxp * sinsp;
        fToPfMtx[8] = cosyp * cosxp;

        return pfToIcrf.multiply(fToPfMtx, result);
    };

    var pointToWindowCoordinatesTemp = new Cartesian4();

    /**
     * Transform a point from model coordinates to window coordinates.
     *
     * @memberof Transforms
     *
     * @param {Matrix4} modelViewProjectionMatrix The 4x4 model-view-projection matrix.
     * @param {Matrix4} viewportTransformation The 4x4 viewport transformation.
     * @param {Cartesian3} point The point to transform.
     * @param {Cartesian2} [result] The object onto which to store the result.
     * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if none was provided.
     *
     * @exception {DeveloperError} modelViewProjectionMatrix is required.
     * @exception {DeveloperError} viewportTransformation is required.
     * @exception {DeveloperError} point is required.
     *
     * @see UniformState#getModelViewProjection
     * @see czm_modelViewProjection
     * @see UniformState#getViewportTransformation
     * @see czm_viewportTransformation
     */
    Transforms.pointToWindowCoordinates = function (modelViewProjectionMatrix, viewportTransformation, point, result) {
        if (!defined(modelViewProjectionMatrix)) {
            throw new DeveloperError('modelViewProjectionMatrix is required.');
        }

        if (!defined(viewportTransformation)) {
            throw new DeveloperError('viewportTransformation is required.');
        }

        if (!defined(point)) {
            throw new DeveloperError('point is required.');
        }

        var tmp = pointToWindowCoordinatesTemp;

        Matrix4.multiplyByPoint(modelViewProjectionMatrix, point, tmp);
        Cartesian4.multiplyByScalar(tmp, 1.0 / tmp.w, tmp);
        Matrix4.multiplyByVector(viewportTransformation, tmp, tmp);
        return Cartesian2.fromCartesian4(tmp, result);
    };

    return Transforms;
});

/*global define*/
define('Core/AxisAlignedBoundingBox',[
        './defaultValue',
        './defined',
        './DeveloperError',
        './Cartesian3',
        './Intersect'
    ], function(
        defaultValue,
        defined,
        DeveloperError,
        Cartesian3,
        Intersect) {
    "use strict";

    /**
     * Creates an instance of an AxisAlignedBoundingBox from the minimum and maximum points along the x, y, and z axes.
     * @alias AxisAlignedBoundingBox
     * @constructor
     *
     * @param {Cartesian3} [minimum=Cartesian3.ZERO] The minimum point along the x, y, and z axes.
     * @param {Cartesian3} [maximum=Cartesian3.ZERO] The maximum point along the x, y, and z axes.
     * @param {Cartesian3} [center] The center of the box; automatically computed if not supplied.
     *
     * @see BoundingSphere
     */
    var AxisAlignedBoundingBox = function(minimum, maximum, center) {
        /**
         * The minimum point defining the bounding box.
         * @type {Cartesian3}
         * @default {@link Cartesian3.ZERO}
         */
        this.minimum = Cartesian3.clone(defaultValue(minimum, Cartesian3.ZERO));

        /**
         * The maximum point defining the bounding box.
         * @type {Cartesian3}
         * @default {@link Cartesian3.ZERO}
         */
        this.maximum = Cartesian3.clone(defaultValue(maximum, Cartesian3.ZERO));

        //If center was not defined, compute it.
        if (!defined(center)) {
            center = Cartesian3.add(this.minimum, this.maximum);
            Cartesian3.multiplyByScalar(center, 0.5, center);
        } else {
            center = Cartesian3.clone(center);
        }

        /**
         * The center point of the bounding box.
         * @type {Cartesian3}
         */
        this.center = center;
    };

    /**
     * Computes an instance of an AxisAlignedBoundingBox. The box is determined by
     * finding the points spaced the farthest apart on the x, y, and z axes.
     * @memberof AxisAlignedBoundingBox
     *
     * @param {Array} positions List of points that the bounding box will enclose.  Each point must have a <code>x</code>, <code>y</code>, and <code>z</code> properties.
     * @param {AxisAlignedBoundingBox} [result] The object onto which to store the result.
     * @returns {AxisAlignedBoundingBox} The modified result parameter or a new AxisAlignedBoundingBox instance if one was not provided.
     *
     * @example
     * // Compute an axis aligned bounding box enclosing two points.
     * var box = AxisAlignedBoundingBox.fromPoints([new Cartesian3(2, 0, 0), new Cartesian3(-2, 0, 0)]);
     */
    AxisAlignedBoundingBox.fromPoints = function(positions, result) {
        if (!defined(result)) {
            result = new AxisAlignedBoundingBox();
        }

        if (!defined(positions) || positions.length === 0) {
            result.minimum = Cartesian3.clone(Cartesian3.ZERO, result.minimum);
            result.maximum = Cartesian3.clone(Cartesian3.ZERO, result.maximum);
            result.center = Cartesian3.clone(Cartesian3.ZERO, result.center);
            return result;
        }

        var minimumX = positions[0].x;
        var minimumY = positions[0].y;
        var minimumZ = positions[0].z;

        var maximumX = positions[0].x;
        var maximumY = positions[0].y;
        var maximumZ = positions[0].z;

        var length = positions.length;
        for ( var i = 1; i < length; i++) {
            var p = positions[i];
            var x = p.x;
            var y = p.y;
            var z = p.z;

            minimumX = Math.min(x, minimumX);
            maximumX = Math.max(x, maximumX);
            minimumY = Math.min(y, minimumY);
            maximumY = Math.max(y, maximumY);
            minimumZ = Math.min(z, minimumZ);
            maximumZ = Math.max(z, maximumZ);
        }

        var minimum = result.minimum;
        minimum.x = minimumX;
        minimum.y = minimumY;
        minimum.z = minimumZ;

        var maximum = result.maximum;
        maximum.x = maximumX;
        maximum.y = maximumY;
        maximum.z = maximumZ;

        var center = Cartesian3.add(minimum, maximum, result.center);
        Cartesian3.multiplyByScalar(center, 0.5, center);

        return result;
    };

    /**
     * Duplicates a AxisAlignedBoundingBox instance.
     * @memberof AxisAlignedBoundingBox
     *
     * @param {AxisAlignedBoundingBox} box The bounding box to duplicate.
     * @param {AxisAlignedBoundingBox} [result] The object onto which to store the result.
     * @returns {AxisAlignedBoundingBox} The modified result parameter or a new AxisAlignedBoundingBox instance if none was provided. (Returns undefined if box is undefined)
     */
    AxisAlignedBoundingBox.clone = function(box, result) {
        if (!defined(box)) {
            return undefined;
        }

        if (!defined(result)) {
            return new AxisAlignedBoundingBox(box.minimum, box.maximum);
        }

        result.minimum = Cartesian3.clone(box.minimum, result.minimum);
        result.maximum = Cartesian3.clone(box.maximum, result.maximum);
        result.center = Cartesian3.clone(box.center, result.center);
        return result;
    };

    /**
     * Compares the provided AxisAlignedBoundingBox componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     * @memberof AxisAlignedBoundingBox
     *
     * @param {AxisAlignedBoundingBox} [left] The first AxisAlignedBoundingBox.
     * @param {AxisAlignedBoundingBox} [right] The second AxisAlignedBoundingBox.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    AxisAlignedBoundingBox.equals = function(left, right) {
        return (left === right) ||
               ((defined(left)) &&
                (defined(right)) &&
                Cartesian3.equals(left.center, right.center) &&
                Cartesian3.equals(left.minimum, right.minimum) &&
                Cartesian3.equals(left.maximum, right.maximum));
    };

    var intersectScratch = new Cartesian3();
    /**
     * Determines which side of a plane a box is located.
     * @memberof AxisAlignedBoundingBox
     *
     * @param {AxisAlignedBoundingBox} box The bounding box to test.
     * @param {Cartesian4} plane The coefficients of the plane in the form <code>ax + by + cz + d = 0</code>
     *                           where the coefficients a, b, c, and d are the components x, y, z, and w
     *                           of the {Cartesian4}, respectively.
     * @returns {Intersect} {Intersect.INSIDE} if the entire box is on the side of the plane the normal is pointing,
     *                     {Intersect.OUTSIDE} if the entire box is on the opposite side, and {Intersect.INTERSETING}
     *                     if the box intersects the plane.
     *
     * @exception {DeveloperError} box is required.
     * @exception {DeveloperError} plane is required.
     */
    AxisAlignedBoundingBox.intersect = function(box, plane) {
        if (!defined(box)) {
            throw new DeveloperError('box is required.');
        }

        if (!defined(plane)) {
            throw new DeveloperError('plane is required.');
        }

        intersectScratch = Cartesian3.subtract(box.maximum, box.minimum, intersectScratch);
        var h = Cartesian3.multiplyByScalar(intersectScratch, 0.5, intersectScratch); //The positive half diagonal
        var e = h.x * Math.abs(plane.x) + h.y * Math.abs(plane.y) + h.z * Math.abs(plane.z);
        var s = Cartesian3.dot(box.center, plane) + plane.w; //signed distance from center

        if (s - e > 0) {
            return Intersect.INSIDE;
        }

        if (s + e < 0) {
            //Not in front because normals point inward
            return Intersect.OUTSIDE;
        }

        return Intersect.INTERSECTING;
    };

    /**
     * Duplicates this AxisAlignedBoundingBox instance.
     * @memberof AxisAlignedBoundingBox
     *
     * @param {AxisAlignedBoundingBox} [result] The object onto which to store the result.
     * @returns {AxisAlignedBoundingBox} The modified result parameter or a new AxisAlignedBoundingBox instance if one was not provided.
     */
    AxisAlignedBoundingBox.prototype.clone = function(result) {
        return AxisAlignedBoundingBox.clone(this, result);
    };

    /**
     * Determines which side of a plane this box is located.
     * @memberof AxisAlignedBoundingBox
     *
     * @param {Cartesian4} plane The coefficients of the plane in the form <code>ax + by + cz + d = 0</code>
     *                           where the coefficients a, b, c, and d are the components x, y, z, and w
     *                           of the {Cartesian4}, respectively.
     * @returns {Intersect} {Intersect.INSIDE} if the entire box is on the side of the plane the normal is pointing,
     *                     {Intersect.OUTSIDE} if the entire box is on the opposite side, and {Intersect.INTERSETING}
     *                     if the box intersects the plane.
     *
     * @exception {DeveloperError} plane is required.
     */
    AxisAlignedBoundingBox.prototype.intersect = function(plane) {
        return AxisAlignedBoundingBox.intersect(this, plane);
    };

    /**
     * Compares this AxisAlignedBoundingBox against the provided AxisAlignedBoundingBox componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     * @memberof AxisAlignedBoundingBox
     *
     * @param {AxisAlignedBoundingBox} [right] The right hand side AxisAlignedBoundingBox.
     * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
     */
    AxisAlignedBoundingBox.prototype.equals = function(right) {
        return AxisAlignedBoundingBox.equals(this, right);
    };

    return AxisAlignedBoundingBox;
});

/*global define*/
define('Core/QuadraticRealPolynomial',[
        './DeveloperError',
        './Math'
    ],
    function(
        DeveloperError,
        CesiumMath) {
    "use strict";

    /**
     * Defines functions for 2nd order polynomial functions of one variable with only real coefficients.
     *
     * @exports QuadraticRealPolynomial
     */
    var QuadraticRealPolynomial = {};

    /**
     * Provides the discriminant of the quadratic equation from the supplied coefficients.
     * @memberof QuadraticRealPolynomial
     *
     * @param {Number} a The coefficient of the 2nd order monomial.
     * @param {Number} b The coefficient of the 1st order monomial.
     * @param {Number} c The coefficient of the 0th order monomial.
     * @returns {Number} The value of the discriminant.
     *
     * @exception {DeveloperError} a is a required number.
     * @exception {DeveloperError} b is a required number.
     * @exception {DeveloperError} c is a required number.
     */
    QuadraticRealPolynomial.discriminant = function(a, b, c) {
        if (typeof a !== 'number') {
            throw new DeveloperError('a is a required number.');
        }
        if (typeof b !== 'number') {
            throw new DeveloperError('b is a required number.');
        }
        if (typeof c !== 'number') {
            throw new DeveloperError('c is a required number.');
        }

        var discriminant = b * b - 4.0 * a * c;
        return discriminant;
    };

    function addWithCancellationCheck(left, right, tolerance) {
        var difference = left + right;
        if ((CesiumMath.sign(left) !== CesiumMath.sign(right)) &&
                Math.abs(difference / Math.max(Math.abs(left), Math.abs(right))) < tolerance) {
            return 0.0;
        }

        return difference;
    }

    /**
     * Provides the real valued roots of the quadratic polynomial with the provided coefficients.
     * @memberof QuadraticRealPolynomial
     *
     * @param {Number} a The coefficient of the 2nd order monomial.
     * @param {Number} b The coefficient of the 1st order monomial.
     * @param {Number} c The coefficient of the 0th order monomial.
     * @returns {Array} The real valued roots.
     *
     * @exception {DeveloperError} a is a required number.
     * @exception {DeveloperError} b is a required number.
     * @exception {DeveloperError} c is a required number.
     */
    QuadraticRealPolynomial.realRoots = function(a, b, c) {
        if (typeof a !== 'number') {
            throw new DeveloperError('a is a required number.');
        }
        if (typeof b !== 'number') {
            throw new DeveloperError('b is a required number.');
        }
        if (typeof c !== 'number') {
            throw new DeveloperError('c is a required number.');
        }

        var ratio;
        if (a === 0.0) {
            if (b === 0.0) {
                // Constant function: c = 0.
                return [];
            }

            // Linear function: b * x + c = 0.
            return [-c / b];
        } else if (b === 0.0) {
            if (c === 0.0) {
                // 2nd order monomial: a * x^2 = 0.
                return [0.0, 0.0];
            }

            var cMagnitude = Math.abs(c);
            var aMagnitude = Math.abs(a);

            if ((cMagnitude < aMagnitude) && (cMagnitude / aMagnitude < CesiumMath.EPSILON14)) { // c ~= 0.0.
                // 2nd order monomial: a * x^2 = 0.
                return [0.0, 0.0];
            } else if ((cMagnitude > aMagnitude) && (aMagnitude / cMagnitude < CesiumMath.EPSILON14)) { // a ~= 0.0.
                // Constant function: c = 0.
                return [];
            }

            // a * x^2 + c = 0
            ratio = -c / a;

            if (ratio < 0.0) {
                // Both roots are complex.
                return [];
            }

            // Both roots are real.
            var root = Math.sqrt(ratio);
            return [-root, root];
        } else if (c === 0.0) {
            // a * x^2 + b * x = 0
            ratio = -b / a;
            if (ratio < 0.0) {
                return [ratio, 0.0];
            }

            return [0.0, ratio];
        }

        // a * x^2 + b * x + c = 0
        var b2 = b * b;
        var four_ac = 4.0 * a * c;
        var radicand = addWithCancellationCheck(b2, -four_ac, CesiumMath.EPSILON14);

        if (radicand < 0.0) {
            // Both roots are complex.
            return [];
        }

        var q = -0.5 * addWithCancellationCheck(b, CesiumMath.sign(b) * Math.sqrt(radicand), CesiumMath.EPSILON14);
        if (b > 0.0) {
            return [q / a, c / q];
        }

        return [c / q, q / a];
    };

    return QuadraticRealPolynomial;
});
/*global define*/
define('Core/CubicRealPolynomial',[
        './DeveloperError',
        './QuadraticRealPolynomial'
    ], function(
        DeveloperError,
        QuadraticRealPolynomial) {
    "use strict";

    /**
     * Defines functions for 3rd order polynomial functions of one variable with only real coefficients.
     *
     * @exports CubicRealPolynomial
     */
    var CubicRealPolynomial = {};

    /**
     * Provides the discriminant of the cubic equation from the supplied coefficients.
     * @memberof CubicRealPolynomial
     *
     * @param {Number} a The coefficient of the 3rd order monomial.
     * @param {Number} b The coefficient of the 2nd order monomial.
     * @param {Number} c The coefficient of the 1st order monomial.
     * @param {Number} d The coefficient of the 0th order monomial.
     * @returns {Number} The value of the discriminant.
     *
     * @exception {DeveloperError} a is a required number.
     * @exception {DeveloperError} b is a required number.
     * @exception {DeveloperError} c is a required number.
     * @exception {DeveloperError} d is a required number.
     */
    CubicRealPolynomial.discriminant = function(a, b, c, d) {
        if (typeof a !== 'number') {
            throw new DeveloperError('a is a required number.');
        }
        if (typeof b !== 'number') {
            throw new DeveloperError('b is a required number.');
        }
        if (typeof c !== 'number') {
            throw new DeveloperError('c is a required number.');
        }
        if (typeof d !== 'number') {
            throw new DeveloperError('d is a required number.');
        }

        var a2 = a * a;
        var b2 = b * b;
        var c2 = c * c;
        var d2 = d * d;

        var discriminant = 18.0 * a * b * c * d + b2 * c2 - 27.0 * a2 * d2 - 4.0 * (a * c2 * c + b2 * b * d);
        return discriminant;
    };

    function computeRealRoots(a, b, c, d) {
        var A = a;
        var B = b / 3.0;
        var C = c / 3.0;
        var D = d;

        var AC = A * C;
        var BD = B * D;
        var B2 = B * B;
        var C2 = C * C;
        var delta1 = A * C - B2;
        var delta2 = A * D - B * C;
        var delta3 = B * D - C2;

        var discriminant = 4.0 * delta1 * delta3 - delta2 * delta2;
        var temp;
        var temp1;

        if (discriminant < 0.0) {
            var ABar;
            var CBar;
            var DBar;

            if (B2 * BD >= AC * C2) {
                ABar = A;
                CBar = delta1;
                DBar = -2.0 * B * delta1 + A * delta2;
            } else {
                ABar = D;
                CBar = delta3;
                DBar = -D * delta2 + 2.0 * C * delta3;
            }

            var s = (DBar < 0.0) ? -1.0 : 1.0; // This is not Math.Sign()!
            var temp0 = -s * Math.abs(ABar) * Math.sqrt(-discriminant);
            temp1 = -DBar + temp0;

            var x = temp1 / 2.0;
            var p = x < 0.0 ? -Math.pow(-x, 1.0 / 3.0) : Math.pow(x, 1.0 / 3.0);
            var q = (temp1 === temp0) ? -p : -CBar / p;

            temp = (CBar <= 0.0) ? p + q : -DBar / (p * p + q * q + CBar);

            if (B2 * BD >= AC * C2) {
                return [(temp - B) / A];
            }

            return [-D / (temp + C)];
        }

        var CBarA = delta1;
        var DBarA = -2.0 * B * delta1 + A * delta2;

        var CBarD = delta3;
        var DBarD = -D * delta2 + 2.0 * C * delta3;

        var squareRootOfDiscriminant = Math.sqrt(discriminant);
        var halfSquareRootOf3 = Math.sqrt(3.0) / 2.0;

        var theta = Math.abs(Math.atan2(A * squareRootOfDiscriminant, -DBarA) / 3.0);
        temp = 2.0 * Math.sqrt(-CBarA);
        var cosine = Math.cos(theta);
        temp1 = temp * cosine;
        var temp3 = temp * (-cosine / 2.0 - halfSquareRootOf3 * Math.sin(theta));

        var numeratorLarge = (temp1 + temp3 > 2.0 * B) ? temp1 - B : temp3 - B;
        var denominatorLarge = A;

        var root1 = numeratorLarge / denominatorLarge;

        theta = Math.abs(Math.atan2(D * squareRootOfDiscriminant, -DBarD) / 3.0);
        temp = 2.0 * Math.sqrt(-CBarD);
        cosine = Math.cos(theta);
        temp1 = temp * cosine;
        temp3 = temp * (-cosine / 2.0 - halfSquareRootOf3 * Math.sin(theta));

        var numeratorSmall = -D;
        var denominatorSmall = (temp1 + temp3 < 2.0 * C) ? temp1 + C : temp3 + C;

        var root3 = numeratorSmall / denominatorSmall;

        var E = denominatorLarge * denominatorSmall;
        var F = -numeratorLarge * denominatorSmall - denominatorLarge * numeratorSmall;
        var G = numeratorLarge * numeratorSmall;

        var root2 = (C * F - B * G) / (-B * F + C * E);

        if (root1 <= root2) {
            if (root1 <= root3) {
                if (root2 <= root3) {
                    return [root1, root2, root3];
                }
                return [root1, root3, root2];
            }
            return [root3, root1, root2];
        }
        if (root1 <= root3) {
            return [root2, root1, root3];
        }
        if (root2 <= root3) {
            return [root2, root3, root1];
        }
        return [root3, root2, root1];
    }

    /**
     * Provides the real valued roots of the cubic polynomial with the provided coefficients.
     * @memberof CubicRealPolynomial
     *
     * @param {Number} a The coefficient of the 3rd order monomial.
     * @param {Number} b The coefficient of the 2nd order monomial.
     * @param {Number} c The coefficient of the 1st order monomial.
     * @param {Number} d The coefficient of the 0th order monomial.
     * @returns {Array} The real valued roots.
     *
     * @exception {DeveloperError} a is a required number.
     * @exception {DeveloperError} b is a required number.
     * @exception {DeveloperError} c is a required number.
     * @exception {DeveloperError} d is a required number.
     */
    CubicRealPolynomial.realRoots = function(a, b, c, d) {
        if (typeof a !== 'number') {
            throw new DeveloperError('a is a required number.');
        }
        if (typeof b !== 'number') {
            throw new DeveloperError('b is a required number.');
        }
        if (typeof c !== 'number') {
            throw new DeveloperError('c is a required number.');
        }
        if (typeof d !== 'number') {
            throw new DeveloperError('d is a required number.');
        }

        var roots;
        var ratio;
        if (a === 0.0) {
            // Quadratic function: b * x^2 + c * x + d = 0.
            return QuadraticRealPolynomial.realRoots(b, c, d);
        } else if (b === 0.0) {
            if (c === 0.0) {
                if (d === 0.0) {
                    // 3rd order monomial: a * x^3 = 0.
                    return [0.0, 0.0, 0.0];
                }

                // a * x^3 + d = 0
                ratio = -d / a;
                var root = (ratio < 0.0) ? -Math.pow(-ratio, 1.0 / 3.0) : Math.pow(ratio, 1.0 / 3.0);
                return [root, root, root];
            } else if (d === 0.0) {
                // x * (a * x^2 + c) = 0.
                roots = QuadraticRealPolynomial.realRoots(a, 0, c);

                // Return the roots in ascending order.
                if (roots.Length === 0) {
                    return [0.0];
                }
                return [roots[0], 0.0, roots[1]];
            }

            // Deflated cubic polynomial: a * x^3 + c * x + d= 0.
            return computeRealRoots(a, 0, c, d);
        } else if (c === 0.0) {
            if (d === 0.0) {
                // x^2 * (a * x + b) = 0.
                ratio = -b / a;
                if (ratio < 0.0) {
                    return [ratio, 0.0, 0.0];
                }
                return [0.0, 0.0, ratio];
            }
            // a * x^3 + b * x^2 + d = 0.
            return computeRealRoots(a, b, 0, d);
        } else if (d === 0.0) {
            // x * (a * x^2 + b * x + c) = 0
            roots = QuadraticRealPolynomial.realRoots(a, b, c);

            // Return the roots in ascending order.
            if (roots.length === 0) {
                return [0.0];
            } else if (roots[1] <= 0.0) {
                return [roots[0], roots[1], 0.0];
            } else if (roots[0] >= 0.0) {
                return [0.0, roots[0], roots[1]];
            }
            return [roots[0], 0.0, roots[1]];
        }

        return computeRealRoots(a, b, c, d);
    };

    return CubicRealPolynomial;
});
/*global define*/
define('Core/QuarticRealPolynomial',[
        './DeveloperError',
        './Math',
        './CubicRealPolynomial',
        './QuadraticRealPolynomial'
    ],
    function(
        DeveloperError,
        CesiumMath,
        CubicRealPolynomial,
        QuadraticRealPolynomial) {
    "use strict";

    /**
     * Defines functions for 4th order polynomial functions of one variable with only real coefficients.
     *
     * @exports QuarticRealPolynomial
     */
    var QuarticRealPolynomial = {};

    /**
     * Provides the discriminant of the quartic equation from the supplied coefficients.
     * @memberof QuarticRealPolynomial
     *
     * @param {Number} a The coefficient of the 4th order monomial.
     * @param {Number} b The coefficient of the 3rd order monomial.
     * @param {Number} c The coefficient of the 2nd order monomial.
     * @param {Number} d The coefficient of the 1st order monomial.
     * @param {Number} e The coefficient of the 0th order monomial.
     * @returns {Number} The value of the discriminant.
     *
     * @exception {DeveloperError} a is a required number.
     * @exception {DeveloperError} b is a required number.
     * @exception {DeveloperError} c is a required number.
     * @exception {DeveloperError} d is a required number.
     * @exception {DeveloperError} e is a required number.
     */
    QuarticRealPolynomial.discriminant = function(a, b, c, d, e) {
        if (typeof a !== 'number') {
            throw new DeveloperError('a is a required number.');
        }
        if (typeof b !== 'number') {
            throw new DeveloperError('b is a required number.');
        }
        if (typeof c !== 'number') {
            throw new DeveloperError('c is a required number.');
        }
        if (typeof d !== 'number') {
            throw new DeveloperError('d is a required number.');
        }
        if (typeof e !== 'number') {
            throw new DeveloperError('e is a required number.');
        }

        var a2 = a * a;
        var a3 = a2 * a;
        var b2 = b * b;
        var b3 = b2 * b;
        var c2 = c * c;
        var c3 = c2 * c;
        var d2 = d * d;
        var d3 = d2 * d;
        var e2 = e * e;
        var e3 = e2 * e;

        var discriminant = (b2 * c2 * d2 - 4.0 * b3 * d3 - 4.0 * a * c3 * d2 + 18 * a * b * c * d3 - 27.0 * a2 * d2 * d2 + 256.0 * a3 * e3) +
            e * (18.0 * b3 * c * d - 4.0 * b2 * c3 + 16.0 * a * c2 * c2 - 80.0 * a * b * c2 * d - 6.0 * a * b2 * d2 + 144.0 * a2 * c * d2) +
            e2 * (144.0 * a * b2 * c - 27.0 * b2 * b2 - 128.0 * a2 * c2 - 192.0 * a2 * b * d);
        return discriminant;
    };

    function original(a3, a2, a1, a0) {
        var a3Squared = a3 * a3;

        var p = a2 - 3.0 * a3Squared / 8.0;
        var q = a1 - a2 * a3 / 2.0 + a3Squared * a3 / 8.0;
        var r = a0 - a1 * a3 / 4.0 + a2 * a3Squared / 16.0 - 3.0 * a3Squared * a3Squared / 256.0;

        // Find the roots of the cubic equations:  h^6 + 2 p h^4 + (p^2 - 4 r) h^2 - q^2 = 0.
        var cubicRoots = CubicRealPolynomial.realRoots(1.0, 2.0 * p, p * p - 4.0 * r, -q * q);

        if (cubicRoots.length > 0) {
            var temp = -a3 / 4.0;

            // Use the largest positive root.
            var hSquared = cubicRoots[cubicRoots.length - 1];

            if (Math.abs(hSquared) < CesiumMath.EPSILON14) {
                // y^4 + p y^2 + r = 0.
                var roots = QuadraticRealPolynomial.realRoots(1.0, p, r);

                if (roots.length === 2) {
                    var root0 = roots[0];
                    var root1 = roots[1];

                    var y;
                    if (root0 >= 0.0 && root1 >= 0.0) {
                        var y0 = Math.sqrt(root0);
                        var y1 = Math.sqrt(root1);

                        return [temp - y1, temp - y0, temp + y0, temp + y1];
                    } else if (root0 >= 0.0 && root1 < 0.0) {
                        y = Math.sqrt(root0);
                        return [temp - y, temp + y];
                    } else if (root0 < 0.0 && root1 >= 0.0) {
                        y = Math.sqrt(root1);
                        return [temp - y, temp + y];
                    }
                }
                return [];
            } else if (hSquared > 0.0) {
                var h = Math.sqrt(hSquared);

                var m = (p + hSquared - q / h) / 2.0;
                var n = (p + hSquared + q / h) / 2.0;

                // Now solve the two quadratic factors:  (y^2 + h y + m)(y^2 - h y + n);
                var roots1 = QuadraticRealPolynomial.realRoots(1.0, h, m);
                var roots2 = QuadraticRealPolynomial.realRoots(1.0, -h, n);

                if (roots1.length !== 0) {
                    roots1[0] += temp;
                    roots1[1] += temp;

                    if (roots2.length !== 0) {
                        roots2[0] += temp;
                        roots2[1] += temp;

                        if (roots1[1] <= roots2[0]) {
                            return [roots1[0], roots1[1], roots2[0], roots2[1]];
                        } else if (roots2[1] <= roots1[0]) {
                            return [roots2[0], roots2[1], roots1[0], roots1[1]];
                        } else if (roots1[0] >= roots2[0] && roots1[1] <= roots2[1]) {
                            return [roots2[0], roots1[0], roots1[1], roots2[1]];
                        } else if (roots2[0] >= roots1[0] && roots2[1] <= roots1[1]) {
                            return [roots1[0], roots2[0], roots2[1], roots1[1]];
                        } else if (roots1[0] > roots2[0] && roots1[0] < roots2[1]) {
                            return [roots2[0], roots1[0], roots2[1], roots1[1]];
                        }
                        return [roots1[0], roots2[0], roots1[1], roots2[1]];
                    }
                    return roots1;
                }

                if (roots2.length !== 0) {
                    roots2[0] += temp;
                    roots2[1] += temp;

                    return roots2;
                }
                return [];
            }
        }
        return [];
    }

    function neumark(a3, a2, a1, a0) {
        var a1Squared = a1 * a1;
        var a2Squared = a2 * a2;
        var a3Squared = a3 * a3;

        var p = -2.0 * a2;
        var q = a1 * a3 + a2Squared - 4.0 * a0;
        var r = a3Squared * a0 - a1 * a2 * a3 + a1Squared;

        var cubicRoots = CubicRealPolynomial.realRoots(1.0, p, q, r);

        if (cubicRoots.length > 0) {
            // Use the most positive root
            var y = cubicRoots[0];

            var temp = (a2 - y);
            var tempSquared = temp * temp;

            var g1 = a3 / 2.0;
            var h1 = temp / 2.0;

            var m = tempSquared - 4.0 * a0;
            var mError = tempSquared + 4.0 * Math.abs(a0);

            var n = a3Squared - 4.0 * y;
            var nError = a3Squared + 4.0 * Math.abs(y);

            var g2;
            var h2;

            if (y < 0.0 || (m * nError < n * mError)) {
                var squareRootOfN = Math.sqrt(n);
                g2 = squareRootOfN / 2.0;
                h2 = squareRootOfN === 0.0 ? 0.0 : (a3 * h1 - a1) / squareRootOfN;
            } else {
                var squareRootOfM = Math.sqrt(m);
                g2 = squareRootOfM === 0.0 ? 0.0 : (a3 * h1 - a1) / squareRootOfM;
                h2 = squareRootOfM / 2.0;
            }

            var G;
            var g;
            if (g1 === 0.0 && g2 === 0.0) {
                G = 0.0;
                g = 0.0;
            } else if (CesiumMath.sign(g1) === CesiumMath.sign(g2)) {
                G = g1 + g2;
                g = y / G;
            } else {
                g = g1 - g2;
                G = y / g;
            }

            var H;
            var h;
            if (h1 === 0.0 && h2 === 0.0) {
                H = 0.0;
                h = 0.0;
            } else if (CesiumMath.sign(h1) === CesiumMath.sign(h2)) {
                H = h1 + h2;
                h = a0 / H;
            } else {
                h = h1 - h2;
                H = a0 / h;
            }

            // Now solve the two quadratic factors:  (y^2 + G y + H)(y^2 + g y + h);
            var roots1 = QuadraticRealPolynomial.realRoots(1.0, G, H);
            var roots2 = QuadraticRealPolynomial.realRoots(1.0, g, h);

            if (roots1.length !== 0) {
                if (roots2.length !== 0) {
                    if (roots1[1] <= roots2[0]) {
                        return [roots1[0], roots1[1], roots2[0], roots2[1]];
                    } else if (roots2[1] <= roots1[0]) {
                        return [roots2[0], roots2[1], roots1[0], roots1[1]];
                    } else if (roots1[0] >= roots2[0] && roots1[1] <= roots2[1]) {
                        return [roots2[0], roots1[0], roots1[1], roots2[1]];
                    } else if (roots2[0] >= roots1[0] && roots2[1] <= roots1[1]) {
                        return [roots1[0], roots2[0], roots2[1], roots1[1]];
                    } else if (roots1[0] > roots2[0] && roots1[0] < roots2[1]) {
                        return [roots2[0], roots1[0], roots2[1], roots1[1]];
                    } else {
                        return [roots1[0], roots2[0], roots1[1], roots2[1]];
                    }
                }
                return roots1;
            }
            if (roots2.length !== 0) {
                return roots2;
            }
        }
        return [];
    }

    /**
     * Provides the real valued roots of the quartic polynomial with the provided coefficients.
     * @memberof QuarticRealPolynomial
     *
     * @param {Number} a The coefficient of the 4th order monomial.
     * @param {Number} b The coefficient of the 3rd order monomial.
     * @param {Number} c The coefficient of the 2nd order monomial.
     * @param {Number} d The coefficient of the 1st order monomial.
     * @param {Number} e The coefficient of the 0th order monomial.
     * @returns {Array} The real valued roots.
     *
     * @exception {DeveloperError} a is a required number.
     * @exception {DeveloperError} b is a required number.
     * @exception {DeveloperError} c is a required number.
     * @exception {DeveloperError} d is a required number.
     * @exception {DeveloperError} e is a required number.
     */
    QuarticRealPolynomial.realRoots = function(a, b, c, d, e) {
        if (typeof a !== 'number') {
            throw new DeveloperError('a is a required number.');
        }
        if (typeof b !== 'number') {
            throw new DeveloperError('b is a required number.');
        }
        if (typeof c !== 'number') {
            throw new DeveloperError('c is a required number.');
        }
        if (typeof d !== 'number') {
            throw new DeveloperError('d is a required number.');
        }
        if (typeof e !== 'number') {
            throw new DeveloperError('e is a required number.');
        }

        if (Math.abs(a) < CesiumMath.EPSILON15) {
            return CubicRealPolynomial.realRoots(b, c, d, e);
        }
        var a3 = b / a;
        var a2 = c / a;
        var a1 = d / a;
        var a0 = e / a;

        var k = (a3 < 0.0) ? 1 : 0;
        k += (a2 < 0.0) ? k + 1 : k;
        k += (a1 < 0.0) ? k + 1 : k;
        k += (a0 < 0.0) ? k + 1 : k;

        switch (k) {
        case 0:
            return original(a3, a2, a1, a0);
        case 1:
            return neumark(a3, a2, a1, a0);
        case 2:
            return neumark(a3, a2, a1, a0);
        case 3:
            return original(a3, a2, a1, a0);
        case 4:
            return original(a3, a2, a1, a0);
        case 5:
            return neumark(a3, a2, a1, a0);
        case 6:
            return original(a3, a2, a1, a0);
        case 7:
            return original(a3, a2, a1, a0);
        case 8:
            return neumark(a3, a2, a1, a0);
        case 9:
            return original(a3, a2, a1, a0);
        case 10:
            return original(a3, a2, a1, a0);
        case 11:
            return neumark(a3, a2, a1, a0);
        case 12:
            return original(a3, a2, a1, a0);
        case 13:
            return original(a3, a2, a1, a0);
        case 14:
            return original(a3, a2, a1, a0);
        case 15:
            return original(a3, a2, a1, a0);
        default:
            return undefined;
        }
    };

    return QuarticRealPolynomial;
});
/*global define*/
define('Core/IntersectionTests',[
        './defined',
        './DeveloperError',
        './Math',
        './Cartesian3',
        './Cartographic',
        './Matrix3',
        './QuadraticRealPolynomial',
        './QuarticRealPolynomial'
    ],
    function(
        defined,
        DeveloperError,
        CesiumMath,
        Cartesian3,
        Cartographic,
        Matrix3,
        QuadraticRealPolynomial,
        QuarticRealPolynomial) {
    "use strict";

    /**
     * DOC_TBA
     *
     * @exports IntersectionTests
     */
    var IntersectionTests = {};

    /**
     * Computes the intersection of a ray and a plane.
     * @memberof IntersectionTests
     *
     * @param {Ray} ray The ray.
     * @param {Plane} plane The plane.
     * @returns {Cartesian3} The intersection point or undefined if there is no intersections.
     *
     * @exception {DeveloperError} ray is required.
     * @exception {DeveloperError} plane is required.
     */
    IntersectionTests.rayPlane = function(ray, plane, result) {
        if (!defined(ray)) {
            throw new DeveloperError('ray is required.');
        }

        if (!defined(plane)) {
            throw new DeveloperError('plane is required.');
        }

        var origin = ray.origin;
        var direction = ray.direction;
        var normal = plane.normal;
        var denominator = Cartesian3.dot(normal, direction);

        if (Math.abs(denominator) < CesiumMath.EPSILON15) {
            // Ray is parallel to plane.  The ray may be in the polygon's plane.
            return undefined;
        }

        var t = (-plane.distance - Cartesian3.dot(normal, origin)) / denominator;

        if (t < 0) {
            return undefined;
        }

        result = Cartesian3.multiplyByScalar(direction, t, result);
        return Cartesian3.add(origin, result, result);
    };

    /**
     * Computes the intersection points of a ray with an ellipsoid.
     * @memberof IntersectionTests
     *
     * @param {Ray} ray The ray.
     * @param {Ellipsoid} ellipsoid The ellipsoid.
     * @returns {Object} An object with the first (<code>start</code>) and the second (<code>stop</code>) intersection scalars for points along the ray or undefined if there are no intersections.
     *
     * @exception {DeveloperError} ray is required.
     * @exception {DeveloperError} ellipsoid is required.
     */
    IntersectionTests.rayEllipsoid = function(ray, ellipsoid) {
        if (!defined(ray)) {
            throw new DeveloperError('ray is required.');
        }

        if (!defined(ellipsoid)) {
            throw new DeveloperError('ellipsoid is required.');
        }

        var inverseRadii = ellipsoid.getOneOverRadii();
        var q = Cartesian3.multiplyComponents(inverseRadii, ray.origin);
        var w = Cartesian3.multiplyComponents(inverseRadii, ray.direction);

        var q2 = Cartesian3.magnitudeSquared(q);
        var qw = Cartesian3.dot(q, w);

        var difference, w2, product, discriminant, temp;

        if (q2 > 1.0) {
            // Outside ellipsoid.
            if (qw >= 0.0) {
                // Looking outward or tangent (0 intersections).
                return undefined;
            }

            // qw < 0.0.
            var qw2 = qw * qw;
            difference = q2 - 1.0; // Positively valued.
            w2 = Cartesian3.magnitudeSquared(w);
            product = w2 * difference;

            if (qw2 < product) {
                // Imaginary roots (0 intersections).
                return undefined;
            } else if (qw2 > product) {
                // Distinct roots (2 intersections).
                discriminant = qw * qw - product;
                temp = -qw + Math.sqrt(discriminant); // Avoid cancellation.
                var root0 = temp / w2;
                var root1 = difference / temp;
                if (root0 < root1) {
                    return {
                        start : root0,
                        stop : root1
                    };
                }

                return {
                    start : root1,
                    stop : root0
                };
            } else {
                // qw2 == product.  Repeated roots (2 intersections).
                var root = Math.sqrt(difference / w2);
                return {
                    start : root,
                    stop : root
                };
            }
        } else if (q2 < 1.0) {
            // Inside ellipsoid (2 intersections).
            difference = q2 - 1.0; // Negatively valued.
            w2 = Cartesian3.magnitudeSquared(w);
            product = w2 * difference; // Negatively valued.

            discriminant = qw * qw - product;
            temp = -qw + Math.sqrt(discriminant); // Positively valued.
            return {
                start : 0.0,
                stop : temp / w2
            };
        } else {
            // q2 == 1.0. On ellipsoid.
            if (qw < 0.0) {
                // Looking inward.
                w2 = Cartesian3.magnitudeSquared(w);
                return {
                    start : 0.0,
                    stop : -qw / w2
                };
            }

            // qw >= 0.0.  Looking outward or tangent.
            return undefined;
        }
    };

    function addWithCancellationCheck(left, right, tolerance) {
        var difference = left + right;
        if ((CesiumMath.sign(left) !== CesiumMath.sign(right)) &&
                Math.abs(difference / Math.max(Math.abs(left), Math.abs(right))) < tolerance) {
            return 0.0;
        }

        return difference;
    }

    function quadraticVectorExpression(A, b, c, x, w) {
        var xSquared = x * x;
        var wSquared = w * w;

        var l2 = (A[Matrix3.COLUMN1ROW1] - A[Matrix3.COLUMN2ROW2]) * wSquared;
        var l1 = w * (x * addWithCancellationCheck(A[Matrix3.COLUMN1ROW0], A[Matrix3.COLUMN0ROW1], CesiumMath.EPSILON15) + b.y);
        var l0 = (A[Matrix3.COLUMN0ROW0] * xSquared + A[Matrix3.COLUMN2ROW2] * wSquared) + x * b.x + c;

        var r1 = wSquared * addWithCancellationCheck(A[Matrix3.COLUMN2ROW1], A[Matrix3.COLUMN1ROW2], CesiumMath.EPSILON15);
        var r0 = w * (x * addWithCancellationCheck(A[Matrix3.COLUMN2ROW0], A[Matrix3.COLUMN0ROW2]) + b.z);

        var cosines;
        var solutions = [];
        if (r0 === 0.0 && r1 === 0.0) {
            cosines = QuadraticRealPolynomial.realRoots(l2, l1, l0);
            if (cosines.length === 0) {
                return solutions;
            }

            var cosine0 = cosines[0];
            var sine0 = Math.sqrt(Math.max(1.0 - cosine0 * cosine0, 0.0));
            solutions.push(new Cartesian3(x, w * cosine0, w * -sine0));
            solutions.push(new Cartesian3(x, w * cosine0, w * sine0));

            if (cosines.length === 2) {
                var cosine1 = cosines[1];
                var sine1 = Math.sqrt(Math.max(1.0 - cosine1 * cosine1, 0.0));
                solutions.push(new Cartesian3(x, w * cosine1, w * -sine1));
                solutions.push(new Cartesian3(x, w * cosine1, w * sine1));
            }

            return solutions;
        }

        var r0Squared = r0 * r0;
        var r1Squared = r1 * r1;
        var l2Squared = l2 * l2;
        var r0r1 = r0 * r1;

        var c4 = l2Squared + r1Squared;
        var c3 = 2.0 * (l1 * l2 + r0r1);
        var c2 = 2.0 * l0 * l2 + l1 * l1 - r1Squared + r0Squared;
        var c1 = 2.0 * (l0 * l1 - r0r1);
        var c0 = l0 * l0 - r0Squared;

        if (c4 === 0.0 && c3 === 0.0 && c2 === 0.0 && c1 === 0.0) {
            return solutions;
        }

        cosines = QuarticRealPolynomial.realRoots(c4, c3, c2, c1, c0);
        var length = cosines.length;
        if (length === 0) {
            return solutions;
        }

        for ( var i = 0; i < length; ++i) {
            var cosine = cosines[i];
            var cosineSquared = cosine * cosine;
            var sineSquared = Math.max(1.0 - cosineSquared, 0.0);
            var sine = Math.sqrt(sineSquared);

            //var left = l2 * cosineSquared + l1 * cosine + l0;
            var left;
            if (CesiumMath.sign(l2) === CesiumMath.sign(l0)) {
                left = addWithCancellationCheck(l2 * cosineSquared + l0, l1 * cosine, CesiumMath.EPSILON12);
            } else if (CesiumMath.sign(l0) === CesiumMath.sign(l1 * cosine)) {
                left = addWithCancellationCheck(l2 * cosineSquared, l1 * cosine + l0, CesiumMath.EPSILON12);
            } else {
                left = addWithCancellationCheck(l2 * cosineSquared + l1 * cosine, l0, CesiumMath.EPSILON12);
            }

            var right = addWithCancellationCheck(r1 * cosine, r0, CesiumMath.EPSILON15);
            var product = left * right;

            if (product < 0.0) {
                solutions.push(new Cartesian3(x, w * cosine, w * sine));
            } else if (product > 0.0) {
                solutions.push(new Cartesian3(x, w * cosine, w * -sine));
            } else if (sine !== 0.0) {
                solutions.push(new Cartesian3(x, w * cosine, w * -sine));
                solutions.push(new Cartesian3(x, w * cosine, w * sine));
                ++i;
            } else {
                solutions.push(new Cartesian3(x, w * cosine, w * sine));
            }
        }

        return solutions;
    }

    /**
     * Provides the point along the ray which is nearest to the ellipsoid.
     * @memberof IntersectionTests
     *
     * @param {Ray} ray The ray.
     * @param {Ellipsoid} ellipsoid The ellipsoid.
     * @returns {Cartesian} The nearest planetodetic point on the ray.
     *
     * @exception {DeveloperError} ray is required.
     * @exception {DeveloperError} ellipsoid is required.
     */
    IntersectionTests.grazingAltitudeLocation = function(ray, ellipsoid) {
        if (!defined(ray)) {
            throw new DeveloperError('ray is required.');
        }

        if (!defined(ellipsoid)) {
            throw new DeveloperError('ellipsoid is required.');
        }

        var position = ray.origin;
        var direction = ray.direction;

        var normal = ellipsoid.geodeticSurfaceNormal(position);

        if (Cartesian3.dot(direction, normal) >= 0.0) { // The location provided is the closest point in altitude
            return position;
        }

        var intersects = defined(this.rayEllipsoid(ray, ellipsoid));

        // Compute the scaled direction vector.
        var f = ellipsoid.transformPositionToScaledSpace(direction);

        // Constructs a basis from the unit scaled direction vector. Construct its rotation and transpose.
        var firstAxis = Cartesian3.normalize(f);
        var reference = Cartesian3.mostOrthogonalAxis(f);
        var secondAxis = Cartesian3.normalize(Cartesian3.cross(reference, firstAxis));
        var thirdAxis  = Cartesian3.normalize(Cartesian3.cross(firstAxis, secondAxis));
        var B = new Matrix3(firstAxis.x, secondAxis.x, thirdAxis.x,
                            firstAxis.y, secondAxis.y, thirdAxis.y,
                            firstAxis.z, secondAxis.z, thirdAxis.z);
        var B_T = B.transpose();

        // Get the scaling matrix and its inverse.
        var D_I = Matrix3.fromScale(ellipsoid.getRadii());
        var D = Matrix3.fromScale(ellipsoid.getOneOverRadii());

        var C = new Matrix3(0.0, direction.z, -direction.y,
                            -direction.z, 0.0, direction.x,
                            direction.y, -direction.x, 0.0);

        var temp = B_T.multiply(D).multiply(C);
        var A = temp.multiply(D_I).multiply(B);
        var b = temp.multiplyByVector(position);

        // Solve for the solutions to the expression in standard form:
        var solutions = quadraticVectorExpression(A, Cartesian3.negate(b), 0.0, 0.0, 1.0);

        var s;
        var altitude;
        var length = solutions.length;
        if (length > 0) {
            var closest = Cartesian3.ZERO;
            var maximumValue = Number.NEGATIVE_INFINITY;

            for ( var i = 0; i < length; ++i) {
                s = D_I.multiplyByVector(B.multiplyByVector(solutions[i]));
                var v = Cartesian3.normalize(Cartesian3.subtract(s, position));
                var dotProduct = Cartesian3.dot(v, direction);

                if (dotProduct > maximumValue) {
                    maximumValue = dotProduct;
                    closest = s;
                }
            }

            var surfacePoint = ellipsoid.cartesianToCartographic(closest);
            maximumValue = CesiumMath.clamp(maximumValue, 0.0, 1.0);
            altitude = Cartesian3.magnitude(Cartesian3.subtract(closest, position)) * Math.sqrt(1.0 - maximumValue * maximumValue);
            altitude = intersects ? -altitude : altitude;
            return ellipsoid.cartographicToCartesian(new Cartographic(surfacePoint.longitude, surfacePoint.latitude, altitude));
        }

        return undefined;
    };

    var lineSegmentPlaneDifference = new Cartesian3();

    /**
     * Computes the intersection of a line segment and a plane.
     * @memberof IntersectionTests
     *
     * @param {Cartesian3} endPoint0 An end point of the line segment.
     * @param {Cartesian3} endPoint1 The other end point of the line segment.
     * @param {Plane} plane The plane.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The intersection point or undefined if there is no intersection.
     *
     * @exception {DeveloperError} endPoint0 is required.
     * @exception {DeveloperError} endPoint1 is required.
     * @exception {DeveloperError} plane is required.
     *
     * @example
     * var origin = ellipsoid.cartographicToCartesian(Cartographic.fromDegrees(-75.59777, 40.03883, 0.0));
     * var normal = ellipsoid.geodeticSurfaceNormal(origin);
     * var plane = Plane.fromPointNormal(origin, normal);
     *
     * var p0 = new Cartesian3(...);
     * var p1 = new Cartesian3(...);
     *
     * // find the intersection of the line segment from p0 to p1 and the tangent plane at origin.
     * var intersection = IntersectionTests.lineSegmentPlane(p0, p1, plane);
     */
    IntersectionTests.lineSegmentPlane = function(endPoint0, endPoint1, plane, result) {
        if (!defined(endPoint0)) {
            throw new DeveloperError('endPoint0 is required.');
        }

        if (!defined(endPoint1)) {
            throw new DeveloperError('endPoint1 is required.');
        }

        if (!defined(plane)) {
            throw new DeveloperError('plane is required.');
        }

        var difference = Cartesian3.subtract(endPoint1, endPoint0, lineSegmentPlaneDifference);
        var normal = plane.normal;
        var nDotDiff = Cartesian3.dot(normal, difference);

        // check if the segment and plane are parallel
        if (Math.abs(nDotDiff) < CesiumMath.EPSILON6) {
            return undefined;
        }

        var nDotP0 = Cartesian3.dot(normal, endPoint0);
        var t = -(plane.distance + nDotP0) / nDotDiff;

        // intersection only if t is in [0, 1]
        if (t < 0.0 || t > 1.0) {
            return undefined;
        }

        // intersection is endPoint0 + t * (endPoint1 - endPoint0)
        if (!defined(result)) {
            result = new Cartesian3();
        }
        Cartesian3.multiplyByScalar(difference, t, result);
        Cartesian3.add(endPoint0, result, result);
        return result;
    };

    /**
     * Computes the intersection of a triangle and a plane
     * @memberof IntersectionTests
     *
     * @param {Cartesian3} p0 First point of the triangle
     * @param {Cartesian3} p1 Second point of the triangle
     * @param {Cartesian3} p2 Third point of the triangle
     * @param {Plane} plane Intersection plane
     *
     * @returns {Object} An object with properties <code>positions</code> and <code>indices</code>, which are arrays that represent three triangles that do not cross the plane. (Undefined if no intersection exists)
     *
     * @exception {DeveloperError} p0, p1, p2, and plane are required.
     *
     * @example
     * var origin = ellipsoid.cartographicToCartesian(Cartographic.fromDegrees(-75.59777, 40.03883, 0.0));
     * var normal = ellipsoid.geodeticSurfaceNormal(origin);
     * var plane = Plane.fromPointNormal(origin, normal);
     *
     * var p0 = new Cartesian3(...);
     * var p1 = new Cartesian3(...);
     * var p2 = new Cartesian3(...);
     *
     * // convert the triangle composed of points (p0, p1, p2) to three triangles that don't cross the plane
     * var triangles = IntersectionTests.lineSegmentPlane(p0, p1, p2, plane);
     *
     */
    IntersectionTests.trianglePlaneIntersection = function(p0, p1, p2, plane) {
        if ((!defined(p0)) ||
            (!defined(p1)) ||
            (!defined(p2)) ||
            (!defined(plane))) {
            throw new DeveloperError('p0, p1, p2, and plane are required.');
        }

        var planeNormal = plane.normal;
        var planeD = plane.distance;
        var p0Behind = (Cartesian3.dot(planeNormal, p0) + planeD) < 0.0;
        var p1Behind = (Cartesian3.dot(planeNormal, p1) + planeD) < 0.0;
        var p2Behind = (Cartesian3.dot(planeNormal, p2) + planeD) < 0.0;
        // Given these dots products, the calls to lineSegmentPlaneIntersection
        // always have defined results.

        var numBehind = 0;
        numBehind += p0Behind ? 1 : 0;
        numBehind += p1Behind ? 1 : 0;
        numBehind += p2Behind ? 1 : 0;

        var u1, u2;
        if (numBehind === 1 || numBehind === 2) {
            u1 = new Cartesian3();
            u2 = new Cartesian3();
        }

        if (numBehind === 1) {
            if (p0Behind) {
                IntersectionTests.lineSegmentPlane(p0, p1, plane, u1);
                IntersectionTests.lineSegmentPlane(p0, p2, plane, u2);

                return {
                    positions : [p0, p1, p2, u1, u2 ],
                    indices : [
                        // Behind
                        0, 3, 4,

                        // In front
                        1, 2, 4,
                        1, 4, 3
                    ]
                };
            } else if (p1Behind) {
                IntersectionTests.lineSegmentPlane(p1, p2, plane, u1);
                IntersectionTests.lineSegmentPlane(p1, p0, plane, u2);

                return {
                    positions : [p0, p1, p2, u1, u2 ],
                    indices : [
                        // Behind
                        1, 3, 4,

                        // In front
                        2, 0, 4,
                        2, 4, 3
                    ]
                };
            } else if (p2Behind) {
                IntersectionTests.lineSegmentPlane(p2, p0, plane, u1);
                IntersectionTests.lineSegmentPlane(p2, p1, plane, u2);

                return {
                    positions : [p0, p1, p2, u1, u2 ],
                    indices : [
                        // Behind
                        2, 3, 4,

                        // In front
                        0, 1, 4,
                        0, 4, 3
                    ]
                };
            }
        } else if (numBehind === 2) {
            if (!p0Behind) {
                IntersectionTests.lineSegmentPlane(p1, p0, plane, u1);
                IntersectionTests.lineSegmentPlane(p2, p0, plane, u2);

                return {
                    positions : [p0, p1, p2, u1, u2 ],
                    indices : [
                        // Behind
                        1, 2, 4,
                        1, 4, 3,

                        // In front
                        0, 3, 4
                    ]
                };
            } else if (!p1Behind) {
                IntersectionTests.lineSegmentPlane(p2, p1, plane, u1);
                IntersectionTests.lineSegmentPlane(p0, p1, plane, u2);

                return {
                    positions : [p0, p1, p2, u1, u2 ],
                    indices : [
                        // Behind
                        2, 0, 4,
                        2, 4, 3,

                        // In front
                        1, 3, 4
                    ]
                };
            } else if (!p2Behind) {
                IntersectionTests.lineSegmentPlane(p0, p2, plane, u1);
                IntersectionTests.lineSegmentPlane(p1, p2, plane, u2);

                return {
                    positions : [p0, p1, p2, u1, u2 ],
                    indices : [
                        // Behind
                        0, 1, 4,
                        0, 4, 3,

                        // In front
                        2, 3, 4
                    ]
                };
            }
        }

        // if numBehind is 3, the triangle is completely behind the plane;
        // otherwise, it is completely in front (numBehind is 0).
        return undefined;
    };

    return IntersectionTests;
});

/*global define*/
define('Core/Ray',[
        './DeveloperError',
        './defaultValue',
        './Cartesian3'
       ], function(
         DeveloperError,
         defaultValue,
         Cartesian3) {
    "use strict";

    /**
     * Represents a ray that extends infinitely from the provided origin in the provided direction.
     * @alias Ray
     * @constructor
     *
     * @param {Cartesian3} [origin=Cartesian3.ZERO] The origin of the ray.
     * @param {Cartesian3} [direction=Cartesian3.ZERO] The direction of the ray.
     */
    var Ray = function(origin, direction) {
        direction = Cartesian3.clone(defaultValue(direction, Cartesian3.ZERO));
        if (!Cartesian3.equals(direction, Cartesian3.ZERO)) {
            Cartesian3.normalize(direction, direction);
        }

        /**
         * The origin of the ray.
         * @type {Cartesian3}
         * @default {@link Cartesian3.ZERO}
         */
        this.origin = Cartesian3.clone(defaultValue(origin, Cartesian3.ZERO));

        /**
         * The direction of the ray.
         * @type {Cartesian3}
         */
        this.direction = direction;
    };

    /**
     * Computes the point along the ray given by r(t) = o + t*d,
     * where o is the origin of the ray and d is the direction.
     * @memberof Ray
     *
     * @param {Number} t A scalar value.
     * @param {Cartesian3} [result] The object in which the result will be stored.
     * @returns The modified result parameter, or a new instance if none was provided.
     *
     * @exception {DeveloperError} t is a required number
     *
     * @example
     * //Get the first intersection point of a ray and an ellipsoid.
     * var intersection = IntersectionTests.rayEllipsoid(ray, ellipsoid);
     * var point = ray.getPoint(intersection.start);
     */
    Ray.prototype.getPoint = function(t, result) {
        if (typeof t !== 'number') {
            throw new DeveloperError('t is a required number');
        }

        result = Cartesian3.multiplyByScalar(this.direction, t, result);
        return Cartesian3.add(this.origin, result, result);
    };

    return Ray;
});

/*global define*/
define('Core/Plane',[
        './Cartesian3',
        './defined',
        './DeveloperError'
    ], function(
        Cartesian3,
        defined,
        DeveloperError) {
    "use strict";

    /**
     * A plane in Hessian Normal Form defined by
     * <pre>
     * ax + by + cz + d = 0
     * </pre>
     * where (a, b, c) is the plane's <code>normal</code>, d is the signed
     * <code>distance</code> to the plane, and (x, y, z) is any point on
     * the plane.
     *
     * @alias Plane
     * @constructor
     *
     * @param {Cartesian3} normal The plane's normal (normalized).
     * @param {Number} distance The shortest distance from the origin to the plane.  The sign of
     * <code>distance</code> determines which side of the plane the origin
     * is on.  If <code>distance</code> is positive, the origin is in the half-space
     * in the direction of the normal; if negative, the origin is in the half-space
     * opposite to the normal; if zero, the plane passes through the origin.
     *
     * @exception {DeveloperError} normal is required.
     * @exception {DeveloperError} distance is required.
     *
     * @example
     * // The plane x=0
     * var plane = new Plane(Cartesian3.UNIT_X, 0.0);
     */
    var Plane = function(normal, distance) {
        if (!defined(normal))  {
            throw new DeveloperError('normal is required.');
        }

        if (!defined(distance)) {
            throw new DeveloperError('distance is required.');
        }

        /**
         * The plane's normal.
         *
         * @type {Cartesian3}
         */
        this.normal = Cartesian3.clone(normal);

        /**
         * The shortest distance from the origin to the plane.  The sign of
         * <code>distance</code> determines which side of the plane the origin
         * is on.  If <code>distance</code> is positive, the origin is in the half-space
         * in the direction of the normal; if negative, the origin is in the half-space
         * opposite to the normal; if zero, the plane passes through the origin.
         *
         * @type {Number}
         */
        this.distance = distance;
    };

    /**
     * Creates a plane from a normal and a point on the plane.
     * @memberof Plane
     *
     * @param {Cartesian3} point The point on the plane.
     * @param {Cartesian3} normal The plane's normal (normalized).
     * @param {Plane} [result] The object onto which to store the result.
     * @returns {Plane} A new plane instance or the modified result parameter.
     *
     * @exception {DeveloperError} point is required.
     * @exception {DeveloperError} normal is required.
     *
     * @example
     * var point = ellipsoid.cartographicToCartesian(Cartographic.fromDegrees(-72.0, 40.0));
     * var normal = ellipsoid.geodeticSurfaceNormal(point);
     * var tangentPlane = Plane.fromPointNormal(point, normal);
     */
    Plane.fromPointNormal = function(point, normal, result) {
        if (!defined(point)) {
            throw new DeveloperError('point is required.');
        }

        if (!defined(normal)) {
            throw new DeveloperError('normal is required.');
        }

        var distance = -Cartesian3.dot(normal, point);

        if (!defined(result)) {
            return new Plane(normal, distance);
        }

        Cartesian3.clone(normal, result.normal);
        result.distance = distance;
        return result;
    };

    /**
     * Computes the signed shortest distance of a point to a plane.
     * The sign of the distance determines which side of the plane the point
     * is on.  If the distance is positive, the point is in the half-space
     * in the direction of the normal; if negative, the point is in the half-space
     * opposite to the normal; if zero, the plane passes through the point.
     * @memberof Plane
     *
     * @param {Plane} plane The plane.
     * @param {Cartesian3} point The point.
     * @returns {Number} The signed shortest distance of the point to the plane.
     *
     * @exception {DeveloperError} plane is required.
     * @exception {DeveloperError} point is required.
     */
    Plane.getPointDistance = function(plane, point) {
        if (!defined(plane)) {
            throw new DeveloperError('plane is required.');
        }

        if (!defined(point)) {
            throw new DeveloperError('point is required.');
        }

        return Cartesian3.dot(plane.normal, point) + plane.distance;
    };


    /**
     * Computes the signed shortest distance of a point to this plane.
     * The sign of the distance determines which side of this plane the point
     * is on.  If the distance is positive, the point is in the half-space
     * in the direction of the normal; if negative, the point is in the half-space
     * opposite to the normal; if zero, this plane passes through the point.
     * @memberof Plane
     *
     * @param {Cartesian3} point The point.
     * @returns {Number} The signed shortest distance of the point to this plane.
     *
     * @exception {DeveloperError} point is required.
     */
    Plane.prototype.getPointDistance = function(point) {
        return Plane.getPointDistance(this, point);
    };

    return Plane;
});

/*global define*/
define('Core/EllipsoidTangentPlane',[
        './defaultValue',
        './defined',
        './DeveloperError',
        './Transforms',
        './AxisAlignedBoundingBox',
        './IntersectionTests',
        './Cartesian2',
        './Cartesian3',
        './Ellipsoid',
        './Ray',
        './Plane'
    ], function(
        defaultValue,
        defined,
        DeveloperError,
        Transforms,
        AxisAlignedBoundingBox,
        IntersectionTests,
        Cartesian2,
        Cartesian3,
        Ellipsoid,
        Ray,
        Plane) {
    "use strict";

    /**
     * A plane tangent to the provided ellipsoid at the provided origin.
     * If origin is not on the surface of the ellipsoid, it's surface projection will be used.
     * If origin as at the center of the ellipsoid, an exception will be thrown.
     * @alias EllipsoidTangentPlane
     * @constructor
     *
     * @param {Ellipsoid} ellipsoid The ellipsoid to use.
     * @param {Cartesian3} origin The point on the surface of the ellipsoid where the tangent plane touches.
     *
     * @exception {DeveloperError} origin is required.
     * @exception {DeveloperError} origin must not be at the center of the ellipsoid.
     */
    var EllipsoidTangentPlane = function(origin, ellipsoid) {
        if (!defined(origin)) {
            throw new DeveloperError('origin is required.');
        }

        ellipsoid = defaultValue(ellipsoid, Ellipsoid.WGS84);

        origin = ellipsoid.scaleToGeodeticSurface(origin);
        if (!defined(origin)) {
            throw new DeveloperError('origin must not be at the center of the ellipsoid.');
        }
        var eastNorthUp = Transforms.eastNorthUpToFixedFrame(origin, ellipsoid);
        this._ellipsoid = ellipsoid;
        this._origin = Cartesian3.clone(origin);
        this._xAxis = Cartesian3.fromCartesian4(eastNorthUp.getColumn(0));
        this._yAxis = Cartesian3.fromCartesian4(eastNorthUp.getColumn(1));

        var normal = Cartesian3.fromCartesian4(eastNorthUp.getColumn(2));
        this._plane = Plane.fromPointNormal(origin, normal);
    };

    var tmp = new AxisAlignedBoundingBox();
    /**
     * Creates a new instance from the provided ellipsoid and the center
     * point of the provided Cartesians.
     * @memberof EllipsoidTangentPlane
     *
     * @param {Ellipsoid} ellipsoid The ellipsoid to use.
     * @param {Cartesian3} cartesians The list of positions surrounding the center point.
     *
     * @exception {DeveloperError} cartesians is required.
     */
    EllipsoidTangentPlane.fromPoints = function(cartesians, ellipsoid) {
        if (!defined(cartesians)) {
            throw new DeveloperError('cartesians is required.');
        }

        var box = AxisAlignedBoundingBox.fromPoints(cartesians, tmp);
        return new EllipsoidTangentPlane(box.center, ellipsoid);
    };

    /**
     * @memberof EllipsoidTangentPlane
     * @returns {Ellipsoid} Gets the ellipsoid.
     */
    EllipsoidTangentPlane.prototype.getEllipsoid = function() {
        return this._ellipsoid;
    };

    /**
     * @memberof EllipsoidTangentPlane
     * @returns {Cartesian3} Gets the origin.
     */
    EllipsoidTangentPlane.prototype.getOrigin = function() {
        return this._origin;
    };

    var projectPointOntoPlaneRay = new Ray();
    var projectPointOntoPlaneCartesian3 = new Cartesian3();

    /**
     * Computes the projection of the provided 3D position onto the 2D plane.
     * @memberof EllipsoidTangentPlane
     *
     * @param {Cartesian3} cartesian The point to project.
     * @param {Cartesian2} [result] The object onto which to store the result.
     * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if none was provided.
     *
     * @exception {DeveloperError} cartesian is required.
     */
    EllipsoidTangentPlane.prototype.projectPointOntoPlane = function(cartesian, result) {
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required.');
        }

        var ray = projectPointOntoPlaneRay;
        ray.origin = cartesian;
        Cartesian3.normalize(cartesian, ray.direction);

        var intersectionPoint = IntersectionTests.rayPlane(ray, this._plane, projectPointOntoPlaneCartesian3);
        if (!defined(intersectionPoint)) {
            Cartesian3.negate(ray.direction, ray.direction);
            intersectionPoint = IntersectionTests.rayPlane(ray, this._plane, projectPointOntoPlaneCartesian3);
        }

        if (defined(intersectionPoint)) {
            var v = Cartesian3.subtract(intersectionPoint, this._origin, intersectionPoint);
            var x = Cartesian3.dot(this._xAxis, v);
            var y = Cartesian3.dot(this._yAxis, v);

            if (!defined(result)) {
                return new Cartesian2(x, y);
            }
            result.x = x;
            result.y = y;
            return result;
        }
        return undefined;
    };

    /**
     * Computes the projection of the provided 3D positions onto the 2D plane.
     * @memberof EllipsoidTangentPlane
     *
     * @param {Array} cartesians The array of points to project.
     * @param {Array} [result] The array of Cartesian2 instances onto which to store results.
     * @returns {Array} The modified result parameter or a new array of Cartesian2 instances if none was provided.
     *
     * @exception {DeveloperError} cartesians is required.
     */
    EllipsoidTangentPlane.prototype.projectPointsOntoPlane = function(cartesians, result) {
        if (!defined(cartesians)) {
            throw new DeveloperError('cartesians is required.');
        }

        if (!defined(result)) {
            result = [];
        }

        var count = 0;
        var length = cartesians.length;
        for ( var i = 0; i < length; i++) {
            var p = this.projectPointOntoPlane(cartesians[i], result[count]);
            if (defined(p)) {
                result[count] = p;
                count++;
            }
        }
        result.length = count;
        return result;
    };


    var projectPointsOntoEllipsoidScratch = new Cartesian3();
    /**
     * Computes the projection of the provided 2D positions onto the 3D ellipsoid.
     * @memberof EllipsoidTangentPlane
     *
     * @param {Array} cartesians The array of points to project.
     * @param {Array} [result] The array of Cartesian3 instances onto which to store results.
     * @returns {Array} The modified result parameter or a new array of Cartesian3 instances if none was provided.
     *
     * @exception {DeveloperError} cartesians is required.
     */
    EllipsoidTangentPlane.prototype.projectPointsOntoEllipsoid = function(cartesians, result) {
        if (!defined(cartesians)) {
            throw new DeveloperError('cartesians is required.');
        }

        var length = cartesians.length;
        if (!defined(result)) {
            result = new Array(length);
        } else {
            result.length = length;
        }

        var ellipsoid = this._ellipsoid;
        var origin = this._origin;
        var xAxis = this._xAxis;
        var yAxis = this._yAxis;
        var tmp = projectPointsOntoEllipsoidScratch;

        for ( var i = 0; i < length; ++i) {
            var position = cartesians[i];
            Cartesian3.multiplyByScalar(xAxis, position.x, tmp);
            var point = result[i] = Cartesian3.add(origin, tmp, result[i]);
            Cartesian3.multiplyByScalar(yAxis, position.y, tmp);
            Cartesian3.add(point, tmp, point);
            ellipsoid.scaleToGeocentricSurface(point, point);
        }

        return result;
    };

    return EllipsoidTangentPlane;
});

/*global define*/
define('Core/barycentricCoordinates',[
        './Cartesian2',
        './Cartesian3',
        './defined',
        './DeveloperError'
    ], function(
        Cartesian2,
        Cartesian3,
        defined,
        DeveloperError) {
    "use strict";

    var scratchCartesian1 = new Cartesian3();
    var scratchCartesian2 = new Cartesian3();
    var scratchCartesian3 = new Cartesian3();

    /**
     * Computes the barycentric coordinates for a point with respect to a triangle.
     *
     * @exports pointInsideTriangle
     *
     * @param {Cartesian2|Cartesian3} point The point to test.
     * @param {Cartesian2|Cartesian3} p0 The first point of the triangle, corresponding to the barycentric x-axis.
     * @param {Cartesian2|Cartesian3} p1 The second point of the triangle, corresponding to the barycentric y-axis.
     * @param {Cartesian2|Cartesian3} p2 The third point of the triangle, corresponding to the barycentric z-axis.
     * @param {Cartesian3} [result] The object onto which to store the result.
     *
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
     *
     * @exception {DeveloperError} point, p0, p1, and p2 are required.
     *
     * @example
     * // Returns Cartesian3.UNIT_X
     * var p = new Cartesian3(-1.0, 0.0, 0.0);
     * var b = barycentricCoordinates(p,
     *   new Cartesian3(-1.0, 0.0, 0.0),
     *   new Cartesian3( 1.0, 0.0, 0.0),
     *   new Cartesian3( 0.0, 1.0, 1.0));
     */
    var barycentricCoordinates = function(point, p0, p1, p2, result) {
        if (!defined(point) || !defined(p0) || !defined(p1) || !defined(p2)) {
            throw new DeveloperError('point, p0, p1, and p2 are required.');
        }

        if (!defined(result)) {
            result = new Cartesian3();
        }

        // Implementation based on http://www.blackpawn.com/texts/pointinpoly/default.html.
        var v0, v1, v2;
        var dot00, dot01, dot02, dot11, dot12;

        if(!defined(p0.z)) {
          v0 = Cartesian2.subtract(p1, p0, scratchCartesian1);
          v1 = Cartesian2.subtract(p2, p0, scratchCartesian2);
          v2 = Cartesian2.subtract(point, p0, scratchCartesian3);

          dot00 = Cartesian2.dot(v0, v0);
          dot01 = Cartesian2.dot(v0, v1);
          dot02 = Cartesian2.dot(v0, v2);
          dot11 = Cartesian2.dot(v1, v1);
          dot12 = Cartesian2.dot(v1, v2);
        } else {
          v0 = Cartesian3.subtract(p1, p0, scratchCartesian1);
          v1 = Cartesian3.subtract(p2, p0, scratchCartesian2);
          v2 = Cartesian3.subtract(point, p0, scratchCartesian3);

          dot00 = Cartesian3.dot(v0, v0);
          dot01 = Cartesian3.dot(v0, v1);
          dot02 = Cartesian3.dot(v0, v2);
          dot11 = Cartesian3.dot(v1, v1);
          dot12 = Cartesian3.dot(v1, v2);
        }

        var q = 1.0 / (dot00 * dot11 - dot01 * dot01);
        result.y = (dot11 * dot02 - dot01 * dot12) * q;
        result.z = (dot00 * dot12 - dot01 * dot02) * q;
        result.x = 1.0 - result.y - result.z;
        return result;
    };

    return barycentricCoordinates;
});

/*global define*/
define('Core/pointInsideTriangle',[
        './barycentricCoordinates',
        './Cartesian3',
        './DeveloperError'
    ], function(
        barycentricCoordinates,
        Cartesian3,
        DeveloperError) {
    "use strict";

    var coords = new Cartesian3();

    /**
     * Determines if a point is inside a triangle.
     *
     * @exports pointInsideTriangle
     *
     * @param {Cartesian2|Cartesian3} point The point to test.
     * @param {Cartesian2|Cartesian3} p0 The first point of the triangle.
     * @param {Cartesian2|Cartesian3} p1 The second point of the triangle.
     * @param {Cartesian2|Cartesian3} p2 The third point of the triangle.
     *
     * @returns {Boolean} <code>true</code> if the point is inside the triangle; otherwise, <code>false</code>.
     *
     * @exception {DeveloperError} point, p0, p1, and p2 are required.
     *
     * @example
     * // Returns true
     * var p = new Cartesian2(0.25, 0.25);
     * var b = pointInsideTriangle(p,
     *   new Cartesian2(0.0, 0.0),
     *   new Cartesian2(1.0, 0.0),
     *   new Cartesian2(0.0, 1.0));
     */
    var pointInsideTriangle = function(point, p0, p1, p2) {
        barycentricCoordinates(point, p0, p1, p2, coords);
        return (coords.x > 0.0) && (coords.y > 0.0) && (coords.z > 0);
    };

    return pointInsideTriangle;
});

/*global define*/
define('Core/Queue',[],function() {
    "use strict";

    /**
     * A queue that can enqueue items at the end, and dequeue items from the front.
     *
     * @alias Queue
     * @constructor
     */
    var Queue = function() {
        this._array = [];
        this._offset = 0;

        /**
         * The length of the queue.
         */
        this.length = 0;
    };

    /**
     * Enqueues the specified item.
     *
     * @param {Object} item The item to enqueue.
     * @memberof Queue
     */
    Queue.prototype.enqueue = function(item) {
        this._array.push(item);
        this.length++;
    };

    /**
     * Dequeues an item.  Returns undefined if the queue is empty.
     *
     * @memberof Queue
     */
    Queue.prototype.dequeue = function() {
        if (this.length === 0) {
            return undefined;
        }

        var array = this._array;
        var offset = this._offset;
        var item = array[offset];
        array[offset] = undefined;

        offset++;
        if (offset > 10 && offset * 2 > array.length) {
            //compact array
            this._array = array.slice(offset);
            offset = 0;
        }

        this._offset = offset;
        this.length--;

        return item;
    };

    /**
     * Check whether this queue contains the specified item.
     *
     * @param {Object} the item to search for.
     * @memberof Queue
     */
    Queue.prototype.contains = function(item) {
        return this._array.indexOf(item) !== -1;
    };

    /**
     * Remove all items from the queue.
     * @memberof Queue
     */
    Queue.prototype.clear = function() {
        this._array.length = this._offset = this.length = 0;
    };

    /**
     * Sort the items in the queue in-place.
     *
     * @param {Function} compareFunction a function that defines the sort order.
     * @memberof Queue
     */
    Queue.prototype.sort = function(compareFunction) {
        if (this._offset > 0) {
            //compact array
            this._array = this._array.slice(this._offset);
            this._offset = 0;
        }

        this._array.sort(compareFunction);
    };

    return Queue;
});
/*global define*/
define('Core/WindingOrder',['./Enumeration'], function(Enumeration) {
    "use strict";

    /**
     * DOC_TBA
     *
     * @exports WindingOrder
     */
    var WindingOrder = {
        /**
         * DOC_TBA
         *
         * @type {Enumeration}
         * @constant
         * @default 0x0900
         */
        CLOCKWISE : new Enumeration(0x0900, 'CLOCKWISE'), // WebGL: CW
        /**
         * DOC_TBA
         *
         * @type {Enumeration}
         * @constant
         * @default 0x901
         */
        COUNTER_CLOCKWISE : new Enumeration(0x0901, 'COUNTER_CLOCKWISE'), // WebGL CCW

        /**
         * DOC_TBA
         *
         * @param {WindingOrder} windingOrder
         *
         * @returns {Boolean}
         */
        validate : function(windingOrder) {
            return ((windingOrder === WindingOrder.CLOCKWISE) ||
                    (windingOrder === WindingOrder.COUNTER_CLOCKWISE));
        }
    };

    return WindingOrder;
});

/*global define*/
define('Core/PolygonPipeline',[
        './DeveloperError',
        './Math',
        './Cartesian2',
        './Cartesian3',
        './defined',
        './Geometry',
        './GeometryAttribute',
        './Ellipsoid',
        './EllipsoidTangentPlane',
        './defaultValue',
        './pointInsideTriangle',
        './ComponentDatatype',
        './PrimitiveType',
        './Queue',
        './WindingOrder'
    ], function(
        DeveloperError,
        CesiumMath,
        Cartesian2,
        Cartesian3,
        defined,
        Geometry,
        GeometryAttribute,
        Ellipsoid,
        EllipsoidTangentPlane,
        defaultValue,
        pointInsideTriangle,
        ComponentDatatype,
        PrimitiveType,
        Queue,
        WindingOrder) {
    "use strict";

    function isTipConvex(p0, p1, p2) {
        var u = Cartesian2.subtract(p1, p0);
        var v = Cartesian2.subtract(p2, p1);

        // Use the sign of the z component of the cross product
        return ((u.x * v.y) - (u.y * v.x)) >= 0.0;
    }

    /**
     * Returns the index of the vertex with the maximum X value.
     *
     * @param {Array} positions An array of the Cartesian points defining the polygon's vertices.
     * @returns {Number} The index of the positions with the maximum X value.
     *
     * @private
     */
    function getRightmostPositionIndex(positions) {
        var maximumX = positions[0].x;
        var rightmostPositionIndex = 0;
        for ( var i = 0; i < positions.length; i++) {
            if (positions[i].x > maximumX) {
                maximumX = positions[i].x;
                rightmostPositionIndex = i;
            }
        }
        return rightmostPositionIndex;
    }

    /**
     * Returns the index of the ring that contains the rightmost vertex.
     *
     * @param {Array} rings An array of arrays of Cartesians. Each array contains the vertices defining a polygon.
     * @returns {Number} The index of the ring containing the rightmost vertex.
     *
     * @private
     */
    function getRightmostRingIndex(rings) {
        var rightmostX = rings[0][0].x;
        var rightmostRingIndex = 0;
        for ( var ring = 0; ring < rings.length; ring++) {
            var maximumX = rings[ring][getRightmostPositionIndex(rings[ring])].x;
            if (maximumX > rightmostX) {
                rightmostX = maximumX;
                rightmostRingIndex = ring;
            }
        }

        return rightmostRingIndex;
    }

    /**
     * Returns a list containing the reflex vertices for a given polygon.
     *
     * @param {Array} polygon An array of Cartesian elements defining the polygon.
     * @returns {Array}
     *
     * @private
     */
    function getReflexVertices(polygon) {
        var reflexVertices = [];
        for ( var i = 0; i < polygon.length; i++) {
            var p0 = polygon[((i - 1) + polygon.length) % polygon.length];
            var p1 = polygon[i];
            var p2 = polygon[(i + 1) % polygon.length];

            if (!isTipConvex(p0, p1, p2)) {
                reflexVertices.push(p1);
            }
        }
        return reflexVertices;
    }

    /**
     * Returns true if the given point is contained in the list of positions.
     *
     * @param {Array} positions A list of Cartesian elements defining a polygon.
     * @param {Cartesian2} point The point to check.
     * @returns {Number} The index of <code>point</code> in <code>positions</code> or -1 if it was not found.
     *
     * @private
     */
    function isVertex(positions, point) {
        for ( var i = 0; i < positions.length; i++) {
            if (Cartesian2.equals(point, positions[i])) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Given a point inside a polygon, find the nearest point directly to the right that lies on one of the polygon's edges.
     *
     * @param {Cartesian2} point A point inside the polygon defined by <code>ring</code>.
     * @param {Array} ring A list of Cartesian points defining a polygon.
     * @param {Array} [edgeIndices]  An array containing the indices two endpoints of the edge containing the intersection.
     *
     * @returns {Cartesian2} The intersection point.
     *
     * @private
     */
    function intersectPointWithRing(point, ring, edgeIndices) {
        edgeIndices = defaultValue(edgeIndices, []);

        var minDistance = Number.MAX_VALUE;
        var rightmostVertexIndex = getRightmostPositionIndex(ring);
        var intersection = new Cartesian2(ring[rightmostVertexIndex].x, point.y);
        edgeIndices.push(rightmostVertexIndex);
        edgeIndices.push((rightmostVertexIndex + 1) % ring.length);

        var boundaryMinX = ring[0].x;
        var boundaryMaxX = boundaryMinX;
        for ( var i = 1; i < ring.length; ++i) {
            if (ring[i].x < boundaryMinX) {
                boundaryMinX = ring[i].x;
            } else if (ring[i].x > boundaryMaxX) {
                boundaryMaxX = ring[i].x;
            }
        }
        boundaryMaxX += (boundaryMaxX - boundaryMinX);
        var point2 = new Cartesian3(boundaryMaxX, point.y, 0.0);

        // Find the nearest intersection.
        for (i = 0; i < ring.length; i++) {
            var v1 = ring[i];
            var v2 = ring[(i + 1) % ring.length];

            if (((v1.x >= point.x) || (v2.x >= point.x)) && (((v1.y >= point.y) && (v2.y <= point.y)) || ((v1.y <= point.y) && (v2.y >= point.y)))) {
                var temp = ((v2.y - v1.y) * (point2.x - point.x)) - ((v2.x - v1.x) * (point2.y - point.y));
                if (temp !== 0.0) {
                    temp = 1.0 / temp;
                    var ua = (((v2.x - v1.x) * (point.y - v1.y)) - ((v2.y - v1.y) * (point.x - v1.x))) * temp;
                    var ub = (((point2.x - point.x) * (point.y - v1.y)) - ((point2.y - point.y) * (point.x - v1.x))) * temp;
                    if ((ua >= 0.0) && (ua <= 1.0) && (ub >= 0.0) && (ub <= 1.0)) {
                        var tempIntersection = new Cartesian2(point.x + ua * (point2.x - point.x), point.y + ua * (point2.y - point.y));
                        var dist = Cartesian2.subtract(tempIntersection, point);
                        temp = Cartesian2.magnitudeSquared(dist);
                        if (temp < minDistance) {
                            intersection = tempIntersection;
                            minDistance = temp;
                            edgeIndices[0] = i;
                            edgeIndices[1] = (i + 1) % ring.length;
                        }
                    }
                }
            }
        }

        return intersection;
    }

    /**
     * Given an outer ring and multiple inner rings, determine the point on the outer ring that is visible
     * to the rightmost vertex of the rightmost inner ring.
     *
     * @param {Array} outerRing An array of Cartesian points defining the outer boundary of the polygon.
     * @param {Array} innerRings An array of arrays of Cartesian points, where each array represents a hole in the polygon.
     * @returns {Number} The index of the vertex in <code>outerRing</code> that is mutually visible to the rightmost vertex in <code>inenrRing</code>.
     *
     * @private
     */
    function getMutuallyVisibleVertexIndex(outerRing, innerRings) {
        var innerRingIndex = getRightmostRingIndex(innerRings);
        var innerRing = innerRings[innerRingIndex];
        var innerRingVertexIndex = getRightmostPositionIndex(innerRing);
        var innerRingVertex = innerRing[innerRingVertexIndex];
        var edgeIndices = [];
        var intersection = intersectPointWithRing(innerRingVertex, outerRing, edgeIndices);

        var visibleVertex = isVertex(outerRing, intersection);
        if (visibleVertex !== -1) {
            return visibleVertex;
        }

        // Set P to be the edge endpoint closest to the inner ring vertex
        var d1 = Cartesian2.magnitudeSquared(Cartesian2.subtract(outerRing[edgeIndices[0]], innerRingVertex));
        var d2 = Cartesian2.magnitudeSquared(Cartesian2.subtract(outerRing[edgeIndices[1]], innerRingVertex));
        var p = (d1 < d2) ? outerRing[edgeIndices[0]] : outerRing[edgeIndices[1]];

        var reflexVertices = getReflexVertices(outerRing);
        var reflexIndex = reflexVertices.indexOf(p);
        if (reflexIndex !== -1) {
            reflexVertices.splice(reflexIndex, 1); // Do not include p if it happens to be reflex.
        }

        var pointsInside = [];
        for ( var i = 0; i < reflexVertices.length; i++) {
            var vertex = reflexVertices[i];
            if (pointInsideTriangle(vertex, innerRingVertex, intersection, p)) {
                pointsInside.push(vertex);
            }
        }

        // If all reflexive vertices are outside the triangle formed by points
        // innerRingVertex, intersection and P, then P is the visible vertex.
        // Otherwise, return the reflex vertex that minimizes the angle between <1,0> and <k, reflex>.
        var minAngle = Number.MAX_VALUE;
        if (pointsInside.length > 0) {
            var v1 = new Cartesian2(1.0, 0.0);
            for (i = 0; i < pointsInside.length; i++) {
                var v2 = Cartesian2.subtract(pointsInside[i], innerRingVertex);
                var denominator = Cartesian2.magnitude(v1) * Cartesian2.magnitudeSquared(v2);
                if (denominator !== 0) {
                    var angle = Math.abs(Math.acos(Cartesian2.dot(v1, v2) / denominator));
                    if (angle < minAngle) {
                        minAngle = angle;
                        p = pointsInside[i];
                    }
                }
            }
        }

        return outerRing.indexOf(p);
    }

    /**
     * Given a polygon defined by an outer ring with one or more inner rings (holes), return a single list of points representing
     * a polygon with the rightmost hole added to it. The added hole is removed from <code>innerRings</code>.
     *
     * @param {Array} outerRing An array of Cartesian points defining the outer boundary of the polygon.
     * @param {Array} innerRings An array of arrays of Cartesian points, where each array represents a hole in the polygon.
     *
     * @returns {Array} A single list of Cartesian points defining the polygon, including the eliminated inner ring.
     *
     * @private
     */
    function eliminateHole(outerRing, innerRings, ellipsoid) {
        // Check that the holes are defined in the winding order opposite that of the outer ring.
        var windingOrder = PolygonPipeline.computeWindingOrder2D(outerRing);
        for ( var i = 0; i < innerRings.length; i++) {
            var ring = innerRings[i];

            // Ensure each hole's first and last points are the same.
            if (!Cartesian3.equals(ring[0], ring[ring.length - 1])) {
                ring.push(ring[0]);
            }

            var innerWindingOrder = PolygonPipeline.computeWindingOrder2D(ring);
            if (innerWindingOrder === windingOrder) {
                ring.reverse();
            }
        }

        // Project points onto a tangent plane to find the mutually visible vertex.
        var tangentPlane = EllipsoidTangentPlane.fromPoints(outerRing, ellipsoid);
        var tangentOuterRing = tangentPlane.projectPointsOntoPlane(outerRing);
        var tangentInnerRings = [];
        for (i = 0; i < innerRings.length; i++) {
            tangentInnerRings.push(tangentPlane.projectPointsOntoPlane(innerRings[i]));
        }

        var visibleVertexIndex = getMutuallyVisibleVertexIndex(tangentOuterRing, tangentInnerRings);
        var innerRingIndex = getRightmostRingIndex(tangentInnerRings);
        var innerRingVertexIndex = getRightmostPositionIndex(tangentInnerRings[innerRingIndex]);

        var innerRing = innerRings[innerRingIndex];
        var newPolygonVertices = [];

        for (i = 0; i < outerRing.length; i++) {
            newPolygonVertices.push(outerRing[i]);
        }

        var j;
        var holeVerticesToAdd = [];

        // If the rightmost inner vertex is not the starting and ending point of the ring,
        // then some other point is duplicated in the inner ring and should be skipped once.
        if (innerRingVertexIndex !== 0) {
            for (j = 0; j <= innerRing.length; j++) {
                var index = (j + innerRingVertexIndex) % innerRing.length;
                if (index !== 0) {
                    holeVerticesToAdd.push(innerRing[index]);
                }
            }
        } else {
            for (j = 0; j < innerRing.length; j++) {
                holeVerticesToAdd.push(innerRing[(j + innerRingVertexIndex) % innerRing.length]);
            }
        }

        var lastVisibleVertexIndex = newPolygonVertices.lastIndexOf(outerRing[visibleVertexIndex]);

        holeVerticesToAdd.push(outerRing[lastVisibleVertexIndex]);

        var front = newPolygonVertices.slice(0, lastVisibleVertexIndex + 1);
        var back = newPolygonVertices.slice(lastVisibleVertexIndex + 1);
        newPolygonVertices = front.concat(holeVerticesToAdd, back);

        innerRings.splice(innerRingIndex, 1);

        return newPolygonVertices;
    }

    /**
     * Use seeded pseudo-random number to be testable.
     *
     * @param {Number} length
     * @returns {Number} Random integer from 0 to <code>length - 1</code>
     *
     * @private
     */
    function getRandomIndex(length) {
        var random = '0.' + Math.sin(rseed).toString().substr(5);
        rseed += 0.2;
        var i = Math.floor(random * length);
        if (i === length) {
            i--;
        }
        return i;
    }
    var rseed = 0;

    /**
     * Determine whether a cut between two polygon vertices is clean.
     *
     * @param {Number} a1i Index of first vertex.
     * @param {Number} a2i Index of second vertex.
     * @param {Array} pArray Array of <code>{ position, index }</code> objects representing the polygon.
     * @returns {Boolean} If true, a cut from the first vertex to the second is internal and does not cross any other sides.
     *
     * @private
     */
    function cleanCut(a1i, a2i, pArray) {
        return (internalCut(a1i, a2i, pArray) && internalCut(a2i, a1i, pArray)) &&
                !intersectsSide(pArray[a1i].position, pArray[a2i].position, pArray) &&
                !Cartesian2.equals(pArray[a1i].position, pArray[a2i].position);
    }

    /**
     * Determine whether the cut formed between the two vertices is internal
     * to the angle formed by the sides connecting at the first vertex.
     *
     * @param {Number} a1i Index of first vertex.
     * @param {Number} a2i Index of second vertex.
     * @param {Array} pArray Array of <code>{ position, index }</code> objects representing the polygon.
     * @returns {Boolean} If true, the cut formed between the two vertices is internal to the angle at vertex 1
     *
     * @private
     */
    var BEFORE = -1;
    var AFTER = 1;
    function internalCut(a1i, a2i, pArray) {
        // Make sure vertex is valid
        validateVertex(a1i, pArray);

        // Get the nodes from the array
        var a1 = pArray[a1i];
        var a2 = pArray[a2i];

        // Define side and cut vectors
        var before = getNextVertex(a1i, pArray, BEFORE);
        var after = getNextVertex(a1i, pArray, AFTER);

        var s1 = Cartesian2.subtract(pArray[before].position, a1.position);
        var s2 = Cartesian2.subtract(pArray[after].position,  a1.position);
        var cut = Cartesian2.subtract(a2.position, a1.position);

        // Convert to 3-dimensional so we can use cross product
        s1 = new Cartesian3(s1.x, s1.y, 0.0);
        s2 = new Cartesian3(s2.x, s2.y, 0.0);
        cut = new Cartesian3(cut.x, cut.y, 0.0);

        if (isParallel(s1, cut)) { // Cut is parallel to s1
            return isInternalToParallelSide(s1, cut);
        } else if (isParallel(s2, cut)) { // Cut is parallel to s2
            return isInternalToParallelSide(s2, cut);
        } else if (angleLessThan180(s1, s2)) { // Angle at point is less than 180
            if (isInsideSmallAngle(s1, s2, cut)) { // Cut is in-between sides
                return true;
            }

            return false;
        } else if (angleGreaterThan180(s1, s2)) { // Angle at point is greater than 180
            if (isInsideBigAngle(s1, s2, cut)) { // Cut is in-between sides
                return false;
            }

            return true;
        }
    }

    /**
     * Checks whether cut parallel to side is internal.
     *
     *  e.g.
     *
     *  7_________6
     *  |         |
     *  | 4 ______|
     *  |  |       5
     *  |  |______2     Is cut from 1 to 6 internal? No.
     *  | 3       |
     *  |_________|
     * 0           1
     *
     * Note that this function simply checks whether the cut is longer or shorter.
     *
     * An important valid cut:
     *
     * Polygon:
     *
     * 0 ___2__4
     *  |  /\  |
     *  | /  \ |   Is cut 0 to 2 or 2 to 4 internal? Yes.
     *  |/    \|
     * 1       3
     *
     * This situation can occur and the only solution is a cut along a parallel
     * side.
     *
     * This method is technically incomplete, however, for the following case:
     *
     *
     *  7_________6
     *  |         |
     *  |         |______4
     *  |          5     |    Now is 1 to 6 internal? Yes, but we'll never need it.
     *  |         2______|
     *  |         |      5
     *  |_________|
     * 0           1
     *
     * In this case, although the cut from 1 to 6 is valid, the side 1-2 is
     * shorter and thus this cut will be called invalid. Assuming there are no
     * superfluous vertices (a requirement for this method to work), however,
     * we'll never need this cut because we can always find cut 2-5 as a substitute.
     *
     * @param {Cartesian2} side
     * @param {Cartesian2} cut
     * @returns {Boolean}
     *
     * @private
     */
    function isInternalToParallelSide(side, cut) {
        return Cartesian2.magnitude(cut) < Cartesian2.magnitude(side);
    }

    /**
     * Provides next vertex in some direction and also validates that vertex.
     *
     * @param {Number} index Index of original vertex.
     * @param {Number} pArray Array of vertices.
     * @param {Number} direction Direction of traversal.
     * @returns {Number} Index of vertex.
     *
     * @private
     */
    function getNextVertex(index, pArray, direction) {
        var next = index + direction;
        if (next < 0) {
            next = pArray.length - 1;
        }
        if (next === pArray.length) {
            next = 0;
        }

        validateVertex(next, pArray);

        return next;
    }

    /**
     * Checks to make sure vertex is not superfluous.
     *
     * @param {Number} index Index of vertex.
     * @param {Number} pArray Array of vertices.
     *
     * @exception {DeveloperError} Superfluous vertex found.
     *
     * @private
     */
    function validateVertex(index, pArray) {
        var before = index - 1;
        var after = index + 1;
        if (before < 0) {
            before = pArray.length - 1;
        }
        if (after === pArray.length) {
            after = 0;
        }

        var s1 = Cartesian2.subtract(pArray[before].position, pArray[index].position);
        var s2 = Cartesian2.subtract(pArray[after].position,  pArray[index].position);

        // Convert to 3-dimensional so we can use cross product
        s1 = new Cartesian3(s1.x, s1.y, 0.0);
        s2 = new Cartesian3(s2.x, s2.y, 0.0);

        if (isParallel(s1, s2)) {
            var e = new DeveloperError("Superfluous vertex found.");
            e.vertexIndex = index;
            throw e;
        }
    }

    /**
     * Determine whether s1 and s2 are parallel.
     *
     * @param {Cartesian3} s1
     * @param {Cartesian3} s2
     * @returns {Boolean}
     *
     * @private
     */
    function isParallel(s1, s2) {
        return Cartesian3.cross(s1, s2).z === 0.0;
    }

    /**
     * Assuming s1 is to the left of s2, determine whether
     * the angle between them is less than 180 degrees.
     *
     * @param {Cartesian3} s1
     * @param {Cartesian3} s2
     * @returns {Boolean}
     *
     * @private
     */
    function angleLessThan180(s1, s2) {
        return Cartesian3.cross(s1, s2).z < 0.0;
    }

    /**
     * Assuming s1 is to the left of s2, determine whether
     * the angle between them is greater than 180 degrees.
     *
     * @param {Cartesian3} s1
     * @param {Cartesian3} s2
     * @returns {Boolean}
     *
     * @private
     */
    function angleGreaterThan180(s1, s2) {
        return Cartesian3.cross(s1, s2).z > 0.0;
    }

    /**
     * Determines whether s3 is inside the greater-than-180-degree angle
     * between s1 and s2.
     *
     * Important: s1 must be to the left of s2.
     *
     * @param {Cartesian3} s1
     * @param {Cartesian3} s2
     * @param {Cartesian3} s3
     * @returns {Boolean}
     *
     * @private
     */
    function isInsideBigAngle(s1, s2, s3) {
        return (Cartesian3.cross(s1, s3).z > 0.0) && (Cartesian3.cross(s3, s2).z > 0.0);
    }

    /**
     * Determines whether s3 is inside the less-than-180-degree angle
     * between s1 and s2.
     *
     * Important: s1 must be to the left of s2.
     *
     * @param {Cartesian3} s1
     * @param {Cartesian3} s2
     * @param {Cartesian3} s3
     * @returns {Boolean}
     *
     * @private
     */
    function isInsideSmallAngle(s1, s2, s3) {
        return (Cartesian3.cross(s1, s3).z < 0.0) && (Cartesian3.cross(s3, s2).z < 0.0);
    }

    /**
     * Determine whether this segment intersects any other polygon sides.
     *
     * @param {Cartesian2} a1 Position of first vertex.
     * @param {Cartesian2} a2 Position of second vertex.
     * @param {Array} pArray Array of <code>{ position, index }</code> objects representing polygon.
     * @returns {Boolean} The segment between a1 and a2 intersect another polygon side.
     *
     * @private
     */
    function intersectsSide(a1, a2, pArray) {
        for ( var i = 0; i < pArray.length; i++) {
            var b1 = pArray[i].position;
            var b2;
            if (i < pArray.length - 1) {
                b2 = pArray[i + 1].position;
            } else {
                b2 = pArray[0].position;
            }

            // If there's a duplicate point, there's no intersection here.
            if (Cartesian2.equals(a1, b1) || Cartesian2.equals(a2, b2) || Cartesian2.equals(a1, b2) || Cartesian2.equals(a2, b1)) {
                continue;
            }

            // Slopes (NaN means vertical)
            var slopeA = (a2.y - a1.y) / (a2.x - a1.x);
            var slopeB = (b2.y - b1.y) / (b2.x - b1.x);

            // If parallel, no intersection
            if (slopeA === slopeB || (isNaN(slopeA) && isNaN(slopeB))) {
                continue;
            }

            // Calculate intersection point
            var intX;
            if (isNaN(slopeA)) {
                intX = a1.x;
            } else if (isNaN(slopeB)) {
                intX = b1.x;
            } else {
                intX = (a1.y - b1.y - slopeA * a1.x + slopeB * b1.x) / (slopeB - slopeA);
            }
            var intY = slopeA * intX + a1.y - slopeA * a1.x;

            var intersection = new Cartesian2(intX, intY);

            // If intersection is on an endpoint, count no intersection
            if (Cartesian2.equals(intersection, a1) || Cartesian2.equals(intersection, a2) || Cartesian2.equals(intersection, b1) || Cartesian2.equals(intersection, b2)) {
                continue;
            }

            // Is intersection point between segments?
            var intersects = isBetween(intX, a1.x, a2.x) && isBetween(intY, a1.y, a2.y) && isBetween(intX, b1.x, b2.x) && isBetween(intY, b1.y, b2.y);

            // If intersecting, the cut is not clean
            if (intersects) {
                return true;
            }
        }
        return false;
    }

    function triangleInLine(pArray) {
        // Get two sides
        var v1 = pArray[0].position;
        var v2 = pArray[1].position;
        var v3 = pArray[2].position;

        var side1 = Cartesian2.subtract(v2, v1);
        var side2 = Cartesian2.subtract(v3, v1);

        // Convert to 3-dimensional so we can use cross product
        side1 = new Cartesian3(side1.x, side1.y, 0.0);
        side2 = new Cartesian3(side2.x, side2.y, 0.0);

        // If they're parallel, so is the last
        return isParallel(side1, side2);
    }

    /**
     * Determine whether number is between n1 and n2.
     * Do not include number === n1 or number === n2.
     * Do include n1 === n2 === number.
     *
     * @param {number} number The number tested.
     * @param {number} n1 First bound.
     * @param {number} n2 Secound bound.
     * @returns {Boolean} number is between n1 and n2.
     *
     * @private
     */
    function isBetween(number, n1, n2) {
        return ((number > n1 || number > n2) && (number < n1 || number < n2)) || (n1 === n2 && n1 === number);
    }

    /**
     * This recursive algorithm takes a polygon, randomly selects two vertices
     * which form a clean cut through the polygon, and divides the polygon
     * then continues to "chop" the two resulting polygons.
     *
     * @param {Array} nodeArray Array of <code>{ position, index }</code> objects representing polygon
     * @returns {Array} Index array representing triangles that fill the polygon
     *
     * @exception {DeveloperError} Invalid polygon: must have at least three vertices.
     * @exception {DeveloperERror} Tried x times to find a vild cut and couldn't.
     *
     * @private
     */
    function randomChop(nodeArray) {
        // Determine & verify number of vertices
        var numVertices = nodeArray.length;

        // Is it already a triangle?
        if (numVertices === 3) {
            // Only return triangle if it has area (not a line)
            if (!triangleInLine(nodeArray)) {
                return [nodeArray[0].index, nodeArray[1].index, nodeArray[2].index];
            }

            // If it's a line, we don't need it.
            return [];
        } else if (nodeArray.length < 3) {
            throw new DeveloperError('Invalid polygon: must have at least three vertices.');
        }

        // Search for clean cut
        var cutFound = false;
        var tries = 0;
        while (!cutFound) {
            // Make sure we don't go into an endless loop
            var maxTries = nodeArray.length * 10;
            if (tries > maxTries) {
                throw new DeveloperError('Tried ' + maxTries + ' times to find a valid cut and couldn\'t.');
            }
            tries++;

            // Generate random indices
            var index1 = getRandomIndex(nodeArray.length);
            var index2 = index1 + 1;
            while (Math.abs(index1 - index2) < 2 || Math.abs(index1 - index2) > nodeArray.length - 2) {
                index2 = getRandomIndex(nodeArray.length);
            }

            // Make sure index2 is bigger
            if (index1 > index2) {
                var index = index1;
                index1 = index2;
                index2 = index;
            }
            try {
                // Check for a clean cut
                if (cleanCut(index1, index2, nodeArray)) {
                    // Divide polygon
                    var nodeArray2 = nodeArray.splice(index1, (index2 - index1 + 1), nodeArray[index1], nodeArray[index2]);

                    // Chop up resulting polygons
                    return randomChop(nodeArray).concat(randomChop(nodeArray2));
                }
            } catch (exception) {
                // Eliminate superfluous vertex and start over
                if (exception.hasOwnProperty("vertexIndex")) {
                    nodeArray.splice(exception.vertexIndex, 1);
                    return randomChop(nodeArray);
                }
                throw exception;
            }
        }
    }

    var scaleToGeodeticHeightN = new Cartesian3();
    var scaleToGeodeticHeightP = new Cartesian3();

    /**
     * DOC_TBA
     *
     * @exports PolygonPipeline
     */
    var PolygonPipeline = {
        /**
         * DOC_TBA
         *
         * Cleans up a simple polygon by removing duplicate adjacent positions and making
         * the first position not equal the last position.
         *
         * @exception {DeveloperError} positions is required.
         * @exception {DeveloperError} At least three positions are required.
         */
        removeDuplicates : function(positions) {
            if (!defined(positions)) {
                throw new DeveloperError('positions is required.');
            }

            var length = positions.length;
            if (length < 3) {
                throw new DeveloperError('At least three positions are required.');
            }

            var cleanedPositions = [];

            for ( var i0 = length - 1, i1 = 0; i1 < length; i0 = i1++) {
                var v0 = positions[i0];
                var v1 = positions[i1];

                if (!Cartesian3.equals(v0, v1)) {
                    cleanedPositions.push(v1); // Shallow copy!
                }
            }

            return cleanedPositions;
        },

        /**
         * DOC_TBA
         *
         * @exception {DeveloperError} positions is required.
         * @exception {DeveloperError} At least three positions are required.
         */
        computeArea2D : function(positions) {
            if (!defined(positions)) {
                throw new DeveloperError('positions is required.');
            }

            var length = positions.length;
            if (length < 3) {
                throw new DeveloperError('At least three positions are required.');
            }

            var area = 0.0;

            for ( var i0 = length - 1, i1 = 0; i1 < length; i0 = i1++) {
                var v0 = positions[i0];
                var v1 = positions[i1];

                area += (v0.x * v1.y) - (v1.x * v0.y);
            }

            return area * 0.5;
        },

        /**
         * DOC_TBA
         *
         * @returns {WindingOrder} DOC_TBA
         *
         * @exception {DeveloperError} positions is required.
         * @exception {DeveloperError} At least three positions are required.
         */
        computeWindingOrder2D : function(positions) {
            var area = PolygonPipeline.computeArea2D(positions);
            return (area >= 0.0) ? WindingOrder.COUNTER_CLOCKWISE : WindingOrder.CLOCKWISE;
        },

        /**
         * Triangulate a polygon
         *
         * @param {Array} positions - Cartesian2 array containing the vertices of the polygon
         * @returns {Array} - Index array representing triangles that fill the polygon
         *
         * @exception {DeveloperError} positions is required.
         * @exception {DeveloperError} At least three positions are required.
         */
        triangulate : function(positions) {
            if (!defined(positions)) {
                throw new DeveloperError('positions is required.');
            }

            var length = positions.length;
            if (length < 3) {
                throw new DeveloperError('At least three positions are required.');
            }

            // Keep track of indices for later
            var nodeArray = [];
            for ( var i = 0; i < length; ++i) {
                nodeArray[i] = {
                    position : positions[i],
                    index : i
                };
            }

            // Recursive chop
            return randomChop(nodeArray);
        },

        /**
         * This function is used for predictable testing.
         *
         * @private
         */
        resetSeed : function(seed) {
            rseed = defaultValue(seed, 0);
        },

        /**
         * DOC_TBA
         *
         * @param {DOC_TBA} positions DOC_TBA
         * @param {DOC_TBA} indices DOC_TBA
         * @param {Number} [granularity] DOC_TBA
         *
         * @exception {DeveloperError} positions is required.
         * @exception {DeveloperError} indices is required.
         * @exception {DeveloperError} At least three indices are required.
         * @exception {DeveloperError} The number of indices must be divisable by three.
         * @exception {DeveloperError} Granularity must be greater than zero.
         */
        computeSubdivision : function(positions, indices, granularity) {
            if (!defined(positions)) {
                throw new DeveloperError('positions is required.');
            }

            if (!defined(indices)) {
                throw new DeveloperError('indices is required.');
            }

            if (indices.length < 3) {
                throw new DeveloperError('At least three indices are required.');
            }

            if (indices.length % 3 !== 0) {
                throw new DeveloperError('The number of indices must be divisable by three.');
            }

            granularity = defaultValue(granularity, CesiumMath.RADIANS_PER_DEGREE);
            if (granularity <= 0.0) {
                throw new DeveloperError('granularity must be greater than zero.');
            }

            // Use a queue for triangles that need (or might need) to be subdivided.
            var triangles = new Queue();

            var indicesLength = indices.length;
            for ( var j = 0; j < indicesLength; j += 3) {
                triangles.enqueue({
                    i0 : indices[j],
                    i1 : indices[j + 1],
                    i2 : indices[j + 2]
                });
            }

            // New positions due to edge splits are appended to the positions list.
            var subdividedPositions = positions.slice(0); // shallow copy!
            var subdividedIndices = [];

            // Used to make sure shared edges are not split more than once.
            var edges = {};

            var i;
            while (triangles.length > 0) {
                var triangle = triangles.dequeue();

                var v0 = subdividedPositions[triangle.i0];
                var v1 = subdividedPositions[triangle.i1];
                var v2 = subdividedPositions[triangle.i2];

                var g0 = Cartesian3.angleBetween(v0, v1);
                var g1 = Cartesian3.angleBetween(v1, v2);
                var g2 = Cartesian3.angleBetween(v2, v0);

                var max = Math.max(g0, Math.max(g1, g2));
                var edge;
                var mid;

                if (max > granularity) {
                    if (g0 === max) {
                        edge = Math.min(triangle.i0, triangle.i1).toString() + ' ' + Math.max(triangle.i0, triangle.i1).toString();

                        i = edges[edge];
                        if (!i) {
                            mid = Cartesian3.add(v0, v1);
                            Cartesian3.multiplyByScalar(mid, 0.5, mid);
                            subdividedPositions.push(mid);
                            i = subdividedPositions.length - 1;
                            edges[edge] = i;
                        }

                        triangles.enqueue({
                            i0 : triangle.i0,
                            i1 : i,
                            i2 : triangle.i2
                        });
                        triangles.enqueue({
                            i0 : i,
                            i1 : triangle.i1,
                            i2 : triangle.i2
                        });
                    } else if (g1 === max) {
                        edge = Math.min(triangle.i1, triangle.i2).toString() + ' ' + Math.max(triangle.i1, triangle.i2).toString();

                        i = edges[edge];
                        if (!i) {
                            mid = Cartesian3.add(v1, v2);
                            Cartesian3.multiplyByScalar(mid, 0.5, mid);
                            subdividedPositions.push(mid);
                            i = subdividedPositions.length - 1;
                            edges[edge] = i;
                        }

                        triangles.enqueue({
                            i0 : triangle.i1,
                            i1 : i,
                            i2 : triangle.i0
                        });
                        triangles.enqueue({
                            i0 : i,
                            i1 : triangle.i2,
                            i2 : triangle.i0
                        });
                    } else if (g2 === max) {
                        edge = Math.min(triangle.i2, triangle.i0).toString() + ' ' + Math.max(triangle.i2, triangle.i0).toString();

                        i = edges[edge];
                        if (!i) {
                            mid = Cartesian3.add(v2, v0);
                            Cartesian3.multiplyByScalar(mid, 0.5, mid);
                            subdividedPositions.push(mid);
                            i = subdividedPositions.length - 1;
                            edges[edge] = i;
                        }

                        triangles.enqueue({
                            i0 : triangle.i2,
                            i1 : i,
                            i2 : triangle.i1
                        });
                        triangles.enqueue({
                            i0 : i,
                            i1 : triangle.i0,
                            i2 : triangle.i1
                        });
                    }
                } else {
                    subdividedIndices.push(triangle.i0);
                    subdividedIndices.push(triangle.i1);
                    subdividedIndices.push(triangle.i2);
                }
            }

            // PERFORMANCE_IDEA Rather that waste time re-iterating the entire set of positions
            // here, all of the above code can be refactored to flatten as values are added
            // Removing the need for this for loop.
            var length = subdividedPositions.length;
            var flattenedPositions = new Array(length * 3);
            var q = 0;
            for (i = 0; i < length; i++) {
                var item = subdividedPositions[i];
                flattenedPositions[q++] = item.x;
                flattenedPositions[q++] = item.y;
                flattenedPositions[q++] = item.z;
            }

            return new Geometry({
                attributes : {
                    position : new GeometryAttribute({
                        componentDatatype : ComponentDatatype.DOUBLE,
                        componentsPerAttribute : 3,
                        values : flattenedPositions
                    })
                },
                indices : subdividedIndices,
                primitiveType : PrimitiveType.TRIANGLES
            });
        },

        /**
         * DOC_TBA
         *
         * @exception {DeveloperError} ellipsoid is required.
         */
        scaleToGeodeticHeight : function(geometry, height, ellipsoid) {
            ellipsoid = defaultValue(ellipsoid, Ellipsoid.WGS84);

            var n = scaleToGeodeticHeightN;
            var p = scaleToGeodeticHeightP;

            height = defaultValue(height, 0.0);

            if (defined(geometry) && defined(geometry.attributes) && defined(geometry.attributes.position)) {
                var positions = geometry.attributes.position.values;
                var length = positions.length;

                for ( var i = 0; i < length; i += 3) {
                    Cartesian3.fromArray(positions, i, p);

                    ellipsoid.scaleToGeodeticSurface(p, p);
                    ellipsoid.geodeticSurfaceNormal(p, n);
                    Cartesian3.multiplyByScalar(n, height, n);
                    Cartesian3.add(p, n, p);

                    positions[i] = p.x;
                    positions[i + 1] = p.y;
                    positions[i + 2] = p.z;
                }
            }

            return geometry;
        },

        /**
         * Given a polygon defined by an outer ring with one or more inner rings (holes), return a single list of points representing
         * a polygon defined by the outer ring with the inner holes removed.
         *
         * @param {Array} outerRing An array of Cartesian points defining the outer boundary of the polygon.
         * @param {Array} innerRings An array of arrays of Cartesian points, where each array represents a hole in the polygon.
         *
         * @returns A single list of Cartesian points defining the polygon, including the eliminated inner ring.
         *
         * @exception {DeveloperError} <code>outerRing</code> is required.
         * @exception {DeveloperError} <code>outerRing</code> must not be empty.
         * @exception {DeveloperError} <code>innerRings</code> is required.
         *
         * @example
         * // Simplifying a polygon with multiple holes.
         * outerRing = PolygonPipeline.eliminateHoles(outerRing, innerRings);
         * polygon.setPositions(outerRing);
         */
        eliminateHoles : function(outerRing, innerRings, ellipsoid) {
            if (!defined(outerRing)) {
                throw new DeveloperError('outerRing is required.');
            }
            if (outerRing.length === 0) {
                throw new DeveloperError('outerRing must not be empty.');
            }
            if (!defined(innerRings)) {
                throw new DeveloperError('innerRings is required.');
            }
            ellipsoid = defaultValue(ellipsoid, Ellipsoid.WGS84);

            var innerRingsCopy = [];
            for ( var i = 0; i < innerRings.length; i++) {
                var innerRing = [];
                for ( var j = 0; j < innerRings[i].length; j++) {
                    innerRing.push(Cartesian3.clone(innerRings[i][j]));
                }
                innerRingsCopy.push(innerRing);
            }

            var newPolygonVertices = outerRing;
            while (innerRingsCopy.length > 0) {
                newPolygonVertices = eliminateHole(newPolygonVertices, innerRingsCopy, ellipsoid);
            }
            return newPolygonVertices;
        }
    };

    return PolygonPipeline;
});

/*global define*/
define('Core/EllipsoidGeodesic',[
        './freezeObject',
        './defaultValue',
        './defined',
        './DeveloperError',
        './Ellipsoid',
        './Math',
        './Cartesian3',
        './Cartographic'
       ], function(
         freezeObject,
         defaultValue,
         defined,
         DeveloperError,
         Ellipsoid,
         CesiumMath,
         Cartesian3,
         Cartographic) {
    "use strict";

    function setConstants(ellipsoidGeodesic) {
        var uSquared= ellipsoidGeodesic._uSquared;
        var a = ellipsoidGeodesic._ellipsoid.getMaximumRadius();
        var b = ellipsoidGeodesic._ellipsoid.getMinimumRadius();
        var f = (a - b) / a;

        var cosineHeading = Math.cos(ellipsoidGeodesic._startHeading);
        var sineHeading = Math.sin(ellipsoidGeodesic._startHeading);

        var tanU = (1 - f) * Math.tan(ellipsoidGeodesic._start.latitude);

        var cosineU = 1.0 / Math.sqrt(1.0 + tanU * tanU);
        var sineU = cosineU * tanU;

        var sigma = Math.atan2(tanU, cosineHeading);

        var sineAlpha = cosineU * sineHeading;
        var sineSquaredAlpha = sineAlpha * sineAlpha;

        var cosineSquaredAlpha = 1.0 - sineSquaredAlpha;
        var cosineAlpha = Math.sqrt(cosineSquaredAlpha);

        var u2Over4 = uSquared / 4.0;
        var u4Over16 = u2Over4 * u2Over4;
        var u6Over64 = u4Over16 * u2Over4;
        var u8Over256 = u4Over16 * u4Over16;

        var a0 = (1.0 + u2Over4 - 3.0 * u4Over16 / 4.0 + 5.0 * u6Over64 / 4.0 - 175.0 * u8Over256 / 64.0);
        var a1 = (1.0 - u2Over4 + 15.0 * u4Over16 / 8.0 - 35.0 * u6Over64 / 8.0);
        var a2 = (1.0 - 3.0 * u2Over4 + 35.0 * u4Over16 / 4.0);
        var a3 = (1.0 - 5.0 * u2Over4);

        var distanceRatio =  a0 * sigma - a1 * Math.sin(2.0 * sigma) * u2Over4 / 2.0 - a2 * Math.sin(4.0 * sigma) * u4Over16 / 16.0 -
            a3 * Math.sin(6.0 * sigma) * u6Over64 / 48.0 - Math.sin(8.0 * sigma) * 5.0 * u8Over256 / 512;

        var constants = ellipsoidGeodesic._constants;

        constants.a = a;
        constants.b = b;
        constants.f = f;
        constants.cosineHeading = cosineHeading;
        constants.sineHeading = sineHeading;
        constants.tanU = tanU;
        constants.cosineU = cosineU;
        constants.sineU = sineU;
        constants.sigma = sigma;
        constants.sineAlpha = sineAlpha;
        constants.sineSquaredAlpha = sineSquaredAlpha;
        constants.cosineSquaredAlpha = cosineSquaredAlpha;
        constants.cosineAlpha = cosineAlpha;
        constants.u2Over4 = u2Over4;
        constants.u4Over16 = u4Over16;
        constants.u6Over64 = u6Over64;
        constants.u8Over256 = u8Over256;
        constants.a0 = a0;
        constants.a1 = a1;
        constants.a2 = a2;
        constants.a3 = a3;
        constants.distanceRatio = distanceRatio;
    }

    function computeC(f, cosineSquaredAlpha) {
        return f * cosineSquaredAlpha * (4.0 + f * (4.0 - 3.0 * cosineSquaredAlpha)) / 16.0;
    }

    function computeDeltaLambda(f, sineAlpha, cosineSquaredAlpha, sigma, sineSigma, cosineSigma, cosineTwiceSigmaMidpoint) {
        var C = computeC(f, cosineSquaredAlpha);

        return (1.0 - C) * f * sineAlpha * (sigma + C * sineSigma * (cosineTwiceSigmaMidpoint +
                C * cosineSigma * (2.0 * cosineTwiceSigmaMidpoint * cosineTwiceSigmaMidpoint - 1.0)));
    }

    function vincentyInverseFormula(ellipsoidGeodesic, major, minor, firstLongitude, firstLatitude, secondLongitude, secondLatitude) {
        var eff = (major - minor) / major;
        var l = secondLongitude - firstLongitude;

        var u1 = Math.atan((1 - eff) * Math.tan(firstLatitude));
        var u2 = Math.atan((1 - eff) * Math.tan(secondLatitude));

        var cosineU1 = Math.cos(u1);
        var sineU1 = Math.sin(u1);
        var cosineU2 = Math.cos(u2);
        var sineU2 = Math.sin(u2);

        var cc = cosineU1 * cosineU2;
        var cs = cosineU1 * sineU2;
        var ss = sineU1 * sineU2;
        var sc = sineU1 * cosineU2;

        var lambda = l;
        var lambdaDot = CesiumMath.TWO_PI;

        var cosineLambda = Math.cos(lambda);
        var sineLambda = Math.sin(lambda);

        var sigma;
        var cosineSigma;
        var sineSigma;
        var cosineSquaredAlpha;
        var cosineTwiceSigmaMidpoint;

        do {
            cosineLambda = Math.cos(lambda);
            sineLambda = Math.sin(lambda);

            var temp = cs - sc * cosineLambda;
            sineSigma = Math.sqrt(cosineU2 * cosineU2 * sineLambda * sineLambda + temp * temp);
            cosineSigma = ss + cc * cosineLambda;

            sigma = Math.atan2(sineSigma, cosineSigma);

            var sineAlpha;

            if (sineSigma === 0.0) {
                sineAlpha = 0.0;
                cosineSquaredAlpha = 1.0;
            } else {
                sineAlpha = cc * sineLambda / sineSigma;
                cosineSquaredAlpha = 1.0 - sineAlpha * sineAlpha;
            }

            lambdaDot = lambda;

            cosineTwiceSigmaMidpoint = cosineSigma - 2.0 * ss / cosineSquaredAlpha;

            if (isNaN(cosineTwiceSigmaMidpoint)) {
                cosineTwiceSigmaMidpoint = 0.0;
            }

            lambda = l + computeDeltaLambda(eff, sineAlpha, cosineSquaredAlpha,
                sigma, sineSigma, cosineSigma, cosineTwiceSigmaMidpoint);
        } while (Math.abs(lambda - lambdaDot) > CesiumMath.EPSILON12);

        var uSquared = cosineSquaredAlpha * (major * major - minor * minor) / (minor * minor);
        var A = 1.0 + uSquared * (4096.0 + uSquared * (uSquared * (320.0 - 175.0 * uSquared) - 768.0)) / 16384.0;
        var B = uSquared * (256.0 + uSquared * (uSquared * (74.0 - 47.0 * uSquared) - 128.0)) / 1024.0;

        var cosineSquaredTwiceSigmaMidpoint = cosineTwiceSigmaMidpoint * cosineTwiceSigmaMidpoint;
        var deltaSigma =  B * sineSigma * (cosineTwiceSigmaMidpoint + B * (cosineSigma *
                (2.0 * cosineSquaredTwiceSigmaMidpoint - 1.0) - B * cosineTwiceSigmaMidpoint *
                (4.0 * sineSigma * sineSigma - 3.0) * (4.0 * cosineSquaredTwiceSigmaMidpoint - 3.0) / 6.0) / 4.0);

        var distance = minor * A * (sigma - deltaSigma);

        var startHeading = Math.atan2(cosineU2 * sineLambda, cs - sc * cosineLambda);
        var endHeading = Math.atan2(cosineU1 * sineLambda, cs * cosineLambda - sc);

        ellipsoidGeodesic._distance = distance;
        ellipsoidGeodesic._startHeading = startHeading;
        ellipsoidGeodesic._endHeading = endHeading;
        ellipsoidGeodesic._uSquared = uSquared;
    }

    function computeProperties(ellipsoidGeodesic, start, end, ellipsoid) {
        var firstCartesian = Cartesian3.normalize(ellipsoid.cartographicToCartesian(start, scratchCart2), scratchCart1);
        var lastCartesian  = Cartesian3.normalize(ellipsoid.cartographicToCartesian(end,   scratchCart2), scratchCart2);

        if (Math.abs(Math.abs(Cartesian3.angleBetween(firstCartesian, lastCartesian)) - Math.PI) < 0.0125) {
            throw new DeveloperError('geodesic position is not unique');
        }

        vincentyInverseFormula(ellipsoidGeodesic, ellipsoid.getMaximumRadius(), ellipsoid.getMinimumRadius(),
                start.longitude, start.latitude, end.longitude, end.latitude);

        start.height = 0;
        end.height = 0;
        ellipsoidGeodesic._start = Cartographic.clone(start, ellipsoidGeodesic._start);
        ellipsoidGeodesic._end = Cartographic.clone(end, ellipsoidGeodesic._end);

        setConstants(ellipsoidGeodesic);
    }

    var scratchCart1 = new Cartesian3();
    var scratchCart2 = new Cartesian3();
    /**
     * Initializes a geodesic on the ellipsoid connecting the two provided planetodetic points.
     *
     * @alias EllipsoidGeodesic
     * @constructor
     * @immutable
     *
     * @param {Cartographic} [start=undefined] The initial planetodetic point on the path.
     * @param {Cartographic} [end=undefined] The final planetodetic point on the path.
     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid on which the geodesic lies.
     */
    var EllipsoidGeodesic = function(start, end, ellipsoid) {
        var e = defaultValue(ellipsoid, Ellipsoid.WGS84);
        this._ellipsoid = e;
        this._start = new Cartographic();
        this._end = new Cartographic();

        this._constants = {};
        this._startHeading = undefined;
        this._endHeading = undefined;
        this._distance = undefined;
        this._uSquared = undefined;

        if (defined(start) && defined(end)) {
            computeProperties(this, start, end, e);
        }
    };

    /**
     * @memberof EllipsoidGeodesic
     *
     * @returns {Number} The surface distance between the start and end point
     *
     * @exception {DeveloperError} start and end must be set before calling funciton getSurfaceDistance
     */
    EllipsoidGeodesic.prototype.getSurfaceDistance = function() {
        if (!defined(this._distance)) {
            throw new DeveloperError('start and end must be set before calling funciton getSurfaceDistance');
        }

        return this._distance;
    };

    /**
     * Sets the start and end points of the geodesic
     * @memberof EllipsoidGeodesic
     *
     * @param {Cartographic} start The initial planetodetic point on the path.
     * @param {Cartographic} end The final planetodetic point on the path.
     *
     * @exception {DeveloperError} start cartographic position is required
     * @exception {DeveloperError} end cartographic position is required
     */
    EllipsoidGeodesic.prototype.setEndPoints = function(start, end) {
        if (!defined(start)) {
            throw new DeveloperError('start cartographic position is required');
        }
        if (!defined(end)) {
            throw new DeveloperError('end cartgraphic position is required');
        }

        computeProperties(this, start, end, this._ellipsoid);
    };

    /**
     * @memberof EllipsoidGeodesic
     * @returns {Cartographic} The initial planetodetic point on the path.
     */
    EllipsoidGeodesic.prototype.getStart = function() {
        return this._start;
    };

    /**
     * @memberof EllipsoidGeodesic
     * @returns {Cartographic} The final planetodetic point on the path.
     */
    EllipsoidGeodesic.prototype.getEnd = function() {
        return this._end;
    };

    /**
     * @memberof EllipsoidGeodesic
     *
     * @returns {Number} The heading at the initial point.
     *
     * @exception {DeveloperError} start and end must be set before calling funciton getSurfaceDistance
     */
    EllipsoidGeodesic.prototype.getStartHeading = function() {
        if (!defined(this._distance)) {
            throw new DeveloperError('start and end must be set before calling funciton getStartHeading');
        }

        return this._startHeading;
    };

    /**
     * @memberof EllipsoidGeodesic
     *
     * @returns {Number} The heading at the final point.
     *
     * @exception {DeveloperError} start and end must be set before calling funciton getEndHeading
     */
    EllipsoidGeodesic.prototype.getEndHeading = function() {
        if (!defined(this._distance)) {
            throw new DeveloperError('start and end must be set before calling funciton getEndHeading');
        }

        return this._endHeading;
    };

    /**
     * Provides the location of a point at the indicated portion along the geodesic.
     * @memberof EllipsoidGeodesic
     *
     * @param {Number} fraction The portion of the distance between the initial and final points.
     *
     * @returns {Cartographic} The location of the point along the geodesic.
     */
    EllipsoidGeodesic.prototype.interpolateUsingFraction = function(fraction, result) {
        return this.interpolateUsingSurfaceDistance(this._distance * fraction, result);
    };

    /**
     * Provides the location of a point at the indicated distance along the geodesic.
     * @memberof EllipsoidGeodesic
     *
     * @param {Number} distance The distance from the inital point to the point of interest along the geodesic
     *
     * @returns {Cartographic} The location of the point along the geodesic.
     *
     * @exception {DeveloperError} start and end must be set before calling funciton interpolateUsingSurfaceDistance
     */
    EllipsoidGeodesic.prototype.interpolateUsingSurfaceDistance = function(distance, result) {
        if (!defined(this._distance)) {
            throw new DeveloperError('start and end must be set before calling funciton interpolateUsingSurfaceDistance');
        }

        var constants = this._constants;

        var s = constants.distanceRatio + distance / constants.b;

        var cosine2S = Math.cos(2.0 * s);
        var cosine4S = Math.cos(4.0 * s);
        var cosine6S = Math.cos(6.0 * s);
        var sine2S = Math.sin(2.0 * s);
        var sine4S = Math.sin(4.0 * s);
        var sine6S = Math.sin(6.0 * s);
        var sine8S = Math.sin(8.0 * s);

        var s2 = s * s;
        var s3 = s * s2;

        var u8Over256 = constants.u8Over256;
        var u2Over4 = constants.u2Over4;
        var u6Over64 = constants.u6Over64;
        var u4Over16 = constants.u4Over16;
        var sigma = 2.0 * s3 * u8Over256 * cosine2S / 3.0 +
            s * (1.0 - u2Over4 + 7.0 * u4Over16 / 4.0 - 15.0 * u6Over64 / 4.0 + 579.0 * u8Over256 / 64.0 -
            (u4Over16 - 15.0 * u6Over64 / 4.0 + 187.0 * u8Over256 / 16.0) * cosine2S -
            (5.0 * u6Over64 / 4.0 - 115.0 * u8Over256 / 16.0) * cosine4S -
            29.0 * u8Over256 * cosine6S / 16.0) +
            (u2Over4 / 2.0 - u4Over16 + 71.0 * u6Over64 / 32.0 - 85.0 * u8Over256 / 16.0) * sine2S +
            (5.0 * u4Over16 / 16.0 - 5.0 * u6Over64 / 4.0 + 383.0 * u8Over256 / 96.0) * sine4S -
            s2 * ((u6Over64 - 11.0 * u8Over256 / 2.0) * sine2S + 5.0 * u8Over256 * sine4S / 2.0) +
            (29.0 * u6Over64 / 96.0 - 29.0 * u8Over256 / 16.0) * sine6S +
            539.0 * u8Over256 * sine8S / 1536.0;

        var theta = Math.asin(Math.sin(sigma) * constants.cosineAlpha);
        var latitude = Math.atan(constants.a / constants.b * Math.tan(theta));

        // Redefine in terms of relative argument of latitude.
        sigma = sigma - constants.sigma;

        var cosineTwiceSigmaMidpoint = Math.cos(2.0 * constants.sigma + sigma);

        var sineSigma = Math.sin(sigma);
        var cosineSigma = Math.cos(sigma);

        var cc = constants.cosineU * cosineSigma;
        var ss = constants.sineU * sineSigma;

        var lambda = Math.atan2(sineSigma * constants.sineHeading, cc - ss * constants.cosineHeading);

        var l = lambda - computeDeltaLambda(constants.f, constants.sineAlpha, constants.cosineSquaredAlpha,
            sigma, sineSigma, cosineSigma, cosineTwiceSigmaMidpoint);

        if (defined(result)) {
            result.longitude = this._start.longitude + l;
            result.latitude = latitude;
            result.height = 0.0;
            return result;
        }

        return new Cartographic(this._start.longitude + l, latitude, 0.0);
    };

    return EllipsoidGeodesic;
});

/*global define*/
define('Core/PolylinePipeline',[
        './defaultValue',
        './defined',
        './DeveloperError',
        './Cartographic',
        './Cartesian3',
        './Cartesian4',
        './Ellipsoid',
        './EllipsoidGeodesic',
        './IntersectionTests',
        './Math',
        './Matrix4',
        './Plane'
    ], function(
        defaultValue,
        defined,
        DeveloperError,
        Cartographic,
        Cartesian3,
        Cartesian4,
        Ellipsoid,
        EllipsoidGeodesic,
        IntersectionTests,
        CesiumMath,
        Matrix4,
        Plane) {
    "use strict";

    /**
     * DOC_TBA
     *
     * @exports PolylinePipeline
     */
    var PolylinePipeline = {};

    var wrapLongitudeInversMatrix = new Matrix4();
    var wrapLongitudeOrigin = new Cartesian4();
    var wrapLongitudeXZNormal = new Cartesian4();
    var wrapLongitudeXZPlane = new Plane(Cartesian3.ZERO, 0.0);
    var wrapLongitudeYZNormal = new Cartesian4();
    var wrapLongitudeYZPlane = new Plane(Cartesian3.ZERO, 0.0);
    var wrapLongitudeIntersection = new Cartesian3();
    var wrapLongitudeOffset = new Cartesian3();

    var carto1 = new Cartographic();
    var carto2 = new Cartographic();
    var cartesian = new Cartesian3();
    var ellipsoidGeodesic = new EllipsoidGeodesic();
    //Returns subdivided line scaled to ellipsoid surface starting at p1 and ending at p2.
    //Result includes p1, but not include p2.  This function is called for a sequence of line segments,
    //and this prevents duplication of end point.
    function generateCartesianArc(p1, p2, granularity, ellipsoid) {
        var separationAngle = Cartesian3.angleBetween(p1, p2);
        var numPoints = Math.ceil(separationAngle/granularity);
        var result = new Array(numPoints*3);
        var start = ellipsoid.cartesianToCartographic(p1, carto1);
        var end = ellipsoid.cartesianToCartographic(p2, carto2);

        ellipsoidGeodesic.setEndPoints(start, end);
        var surfaceDistanceBetweenPoints = ellipsoidGeodesic.getSurfaceDistance() / (numPoints);

        var index = 0;
        start.height = 0;
        var cart = ellipsoid.cartographicToCartesian(start, cartesian);
        result[index++] = cart.x;
        result[index++] = cart.y;
        result[index++] = cart.z;

        for (var i = 1; i < numPoints; i++) {
            var carto = ellipsoidGeodesic.interpolateUsingSurfaceDistance(i * surfaceDistanceBetweenPoints, carto2);
            cart = ellipsoid.cartographicToCartesian(carto, cartesian);
            result[index++] = cart.x;
            result[index++] = cart.y;
            result[index++] = cart.z;
        }

        return result;
    }

    var scaleN = new Cartesian3();
    var scaleP = new Cartesian3();
    function computeHeight(p, h, ellipsoid) {
        var n = scaleN;

        ellipsoid.geodeticSurfaceNormal(p, n);
        Cartesian3.multiplyByScalar(n, h, n);
        Cartesian3.add(p, n, p);

        return p;
    }

    /**
     * Breaks a {@link Polyline} into segments such that it does not cross the &plusmn;180 degree meridian of an ellipsoid.
     * @memberof PolylinePipeline
     *
     * @param {Array} positions The polyline's Cartesian positions.
     * @param {Matrix4} [modelMatrix=Matrix4.IDENTITY] The polyline's model matrix. Assumed to be an affine
     * transformation matrix, where the upper left 3x3 elements are a rotation matrix, and
     * the upper three elements in the fourth column are the translation.  The bottom row is assumed to be [0, 0, 0, 1].
     * The matrix is not verified to be in the proper form.
     *
     * @returns {Object} An object with a <code>positions</code> property that is an array of positions and a
     * <code>segments</code> property.
     *
     * @see PolygonPipeline.wrapLongitude
     * @see Polyline
     * @see PolylineCollection
     *
     * @example
     * var polylines = new PolylineCollection();
     * var polyline = polylines.add(...);
     * var positions = polyline.getPositions();
     * var modelMatrix = polylines.modelMatrix;
     * var segments = PolylinePipeline.wrapLongitude(positions, modelMatrix);
     */
    PolylinePipeline.wrapLongitude = function(positions, modelMatrix) {
        var cartesians = [];
        var segments = [];

        if (defined(positions) && positions.length > 0) {
            modelMatrix = defaultValue(modelMatrix, Matrix4.IDENTITY);
            var inverseModelMatrix = Matrix4.inverseTransformation(modelMatrix, wrapLongitudeInversMatrix);

            var origin = Matrix4.multiplyByPoint(inverseModelMatrix, Cartesian3.ZERO, wrapLongitudeOrigin);
            var xzNormal = Matrix4.multiplyByVector(inverseModelMatrix, Cartesian4.UNIT_Y, wrapLongitudeXZNormal);
            var xzPlane = Plane.fromPointNormal(origin, xzNormal, wrapLongitudeXZPlane);
            var yzNormal = Matrix4.multiplyByVector(inverseModelMatrix, Cartesian4.UNIT_X, wrapLongitudeYZNormal);
            var yzPlane = Plane.fromPointNormal(origin, yzNormal, wrapLongitudeYZPlane);

            var count = 1;
            cartesians.push(Cartesian3.clone(positions[0]));
            var prev = cartesians[0];

            var length = positions.length;
            for ( var i = 1; i < length; ++i) {
                var cur = positions[i];

                // intersects the IDL if either endpoint is on the negative side of the yz-plane
                if (Plane.getPointDistance(yzPlane, prev) < 0.0 || Plane.getPointDistance(yzPlane, cur) < 0.0) {
                    // and intersects the xz-plane
                    var intersection = IntersectionTests.lineSegmentPlane(prev, cur, xzPlane, wrapLongitudeIntersection);
                    if (defined(intersection)) {
                        // move point on the xz-plane slightly away from the plane
                        var offset = Cartesian3.multiplyByScalar(xzNormal, 5.0e-9, wrapLongitudeOffset);
                        if (Plane.getPointDistance(xzPlane, prev) < 0.0) {
                            Cartesian3.negate(offset, offset);
                        }

                        cartesians.push(Cartesian3.add(intersection, offset));
                        segments.push(count + 1);

                        Cartesian3.negate(offset, offset);
                        cartesians.push(Cartesian3.add(intersection, offset));
                        count = 1;
                    }
                }

                cartesians.push(Cartesian3.clone(positions[i]));
                count++;

                prev = cur;
            }

            segments.push(count);
        }

        return {
            positions : cartesians,
            lengths : segments
        };
    };

    /**
     * Removes adjacent duplicate positions in an array of positions.
     *
     * @memberof PolylinePipeline
     *
     * @param {Array} positions The array of {Cartesian3} positions.
     *
     * @returns {Array} A new array of positions with no adjacent duplicate positions.  Positions are shallow copied.
     *
     * @exception {DeveloperError} positions is required.
     *
     * @example
     * // Returns [(1.0, 1.0, 1.0), (2.0, 2.0, 2.0)]
     * var positions = [
     *     new Cartesian3(1.0, 1.0, 1.0),
     *     new Cartesian3(1.0, 1.0, 1.0),
     *     new Cartesian3(2.0, 2.0, 2.0)];
     * var nonDuplicatePositions = PolylinePipeline.removeDuplicates(positions);
     */
    PolylinePipeline.removeDuplicates = function(positions) {
        if (!defined(positions )) {
            throw new DeveloperError('positions is required.');
        }

        var length = positions.length;
        if (length < 2) {
            return positions.slice(0);
        }

        var cleanedPositions = [];
        cleanedPositions.push(positions[0]);

        for (var i = 1; i < length; ++i) {
            var v0 = positions[i - 1];
            var v1 = positions[i];

            if (!Cartesian3.equals(v0, v1)) {
                cleanedPositions.push(v1); // Shallow copy!
            }
        }

        return cleanedPositions;
    };

    /**
     * Subdivides polyline and raises all points to the ellipsoid surface
     *
     * @memberof PolylinePipeline
     *
     * @param {Array} positions The array of positions of type {Cartesian3}.
     * @param {Number} [granularity = CesiumMath.RADIANS_PER_DEGREE] The distance, in radians, between each latitude and longitude. Determines the number of positions in the buffer.
     * @param {Ellipsoid} [ellipsoid = Ellipsoid.WGS84] The ellipsoid on which the positions lie.
     *
     * @returns {Array} A new array of positions of type {Number} that have been subdivided and raised to the surface of the ellipsoid.
     *
     * @exception {DeveloperError} positions is required
     *
     * @example
     * var positions = ellipsoid.cartographicArrayToCartesianArray([
     *      Cartographic.fromDegrees(-105.0, 40.0),
     *      Cartographic.fromDegrees(-100.0, 38.0),
     *      Cartographic.fromDegrees(-105.0, 35.0),
     *      Cartographic.fromDegrees(-100.0, 32.0)
     * ]));
     * var surfacePositions = PolylinePipeline.scaleToSurface(positions);
     */
    PolylinePipeline.scaleToSurface = function(positions, granularity, ellipsoid) {
        if (!defined(positions)) {
            throw new DeveloperError('positions is required');
        }
        granularity = defaultValue(granularity, CesiumMath.RADIANS_PER_DEGREE);
        ellipsoid = defaultValue(ellipsoid, Ellipsoid.WGS84);

        var length = positions.length;
        var newPositions = [];
        for (var i = 0; i < length - 1; i++) {
            var p0 = positions[i];
            var p1 = positions[i+1];
            newPositions = newPositions.concat(generateCartesianArc(p0, p1, granularity, ellipsoid));
        }

        var lastPoint = positions[length-1];
        var carto = ellipsoid.cartesianToCartographic(lastPoint, carto1);
        carto.height = 0;
        var cart = ellipsoid.cartographicToCartesian(carto, cartesian);
        newPositions.push(cart.x, cart.y, cart.z);

        return newPositions;
    };

    /**
     * Raises the positions to the given height.
     *
     * @memberof PolylinePipeline
     *
     * @param {Array} positions The array of type {Number} representing positions.
     * @param {Number|Array} height A number or array of numbers representing the heights of each position.
     * @param {Ellipsoid} [ellipsoid = Ellipsoid.WGS84] The ellipsoid on which the positions lie.
     * @param {Array} [result] An array to place the resultant positions in.
     *
     * @returns {Array} The array of positions scaled to height.

     * @exception {DeveloperError} positions must be defined.
     * @exception {DeveloperError} height must be defined.
     * @exception {DeveloperError} result.length must be equal to positions.length
     * @exception {DeveloperError} height.length must be equal to positions.length
     *
     * @example
     * var p1 = ellipsoid.cartographicToCartesian(Cartographic.fromDegrees(-105.0, 40.0));
     * var p2 = ellipsoid.cartographicToCartesian(Cartographic.fromDegrees(-100.0, 38.0));
     * var positions = [p1.x, p1.y, p1.z, p2.x, p2.y, p2.z];
     * var heights = [1000, 1000, 2000, 2000];
     *
     * var raisedPositions = PolylinePipeline.scaleToGeodeticHeight(positions, heights);
     */
     PolylinePipeline.scaleToGeodeticHeight = function(positions, height, ellipsoid, result) {
        if (!defined(positions)) {
            throw new DeveloperError('positions must be defined.');
        }
        if (!defined(height)) {
            throw new DeveloperError('height must be defined');
        }
        ellipsoid = defaultValue(ellipsoid, Ellipsoid.WGS84);

        var length = positions.length;
        var i;
        var p = scaleP;
        var newPositions;
        if (defined(result)) {
            if (result.length !== positions.length) {
                throw new DeveloperError('result.length must be equal to positions.length');
            }
            newPositions = result;
        } else {
            newPositions = new Array(positions.length);
        }

        if (height === 0) {
            for(i = 0; i < length; i+=3) {
                p = ellipsoid.scaleToGeodeticSurface(Cartesian3.fromArray(positions, i, p), p);
                newPositions[i] = p.x;
                newPositions[i + 1] = p.y;
                newPositions[i + 2] = p.z;
            }
            return newPositions;
        }

        var h;
        if (Array.isArray(height)) {
            if (height.length !== length/3) {
                throw new DeveloperError('height.length must be equal to positions.length');
            }
            for (i = 0; i < length; i += 3) {
                h = height[i/3];
                p = Cartesian3.fromArray(positions, i, p);
                p = computeHeight(p, h, ellipsoid);
                newPositions[i] = p.x;
                newPositions[i + 1] = p.y;
                newPositions[i + 2] = p.z;
            }
        } else {
            h = height;
            for (i = 0; i < length; i += 3) {
                p = Cartesian3.fromArray(positions, i, p);
                p = computeHeight(p, h, ellipsoid);
                newPositions[i] = p.x;
                newPositions[i + 1] = p.y;
                newPositions[i + 2] = p.z;
            }
        }

        return newPositions;
    };

    return PolylinePipeline;
});

/*global define*/
define('Core/WallGeometryLibrary',[
        './defined',
        './Cartographic',
        './Cartesian3',
        './DeveloperError',
        './EllipsoidTangentPlane',
        './PolygonPipeline',
        './PolylinePipeline',
        './Math',
        './WindingOrder'
    ], function(
        defined,
        Cartographic,
        Cartesian3,
        DeveloperError,
        EllipsoidTangentPlane,
        PolygonPipeline,
        PolylinePipeline,
        CesiumMath,
        WindingOrder) {
    "use strict";

    /**
     * private
     */
    var WallGeometryLibrary = {};

    function subdivideHeights(p0, p1, h0, h1, granularity) {
        var angleBetween = Cartesian3.angleBetween(p0, p1);
        var numPoints = Math.ceil(angleBetween/granularity);
        var heights = new Array(numPoints);
        var i;
        if (h0 === h1) {
            for (i = 0; i < numPoints; i++) {
                heights[i] = h0;
            }
            return heights;
        }

        var dHeight = h1 - h0;
        var heightPerVertex = dHeight / (numPoints);

        for (i = 1; i < numPoints; i++) {
            var h = h0 + i*heightPerVertex;
            heights[i] = h;
        }

        heights[0] = h0;
        return heights;
    }

    function latLonEquals(c0, c1) {
        return ((CesiumMath.equalsEpsilon(c0.latitude, c1.latitude, CesiumMath.EPSILON6)) && (CesiumMath.equalsEpsilon(c0.longitude, c1.longitude, CesiumMath.EPSILON6)));
    }

    var scratchCartographic1 = new Cartographic();
    var scratchCartographic2 = new Cartographic();
    function removeDuplicates(ellipsoid, positions, topHeights, bottomHeights) {
        var hasBottomHeights = (defined(bottomHeights));
        var hasTopHeights = (defined(topHeights));
        var cleanedPositions = [];
        var cleanedTopHeights = [];
        var cleanedBottomHeights = hasBottomHeights ? [] : undefined;

        var length = positions.length;
        if (length < 2) {
            return positions.slice(0);
        }

        var v0 = positions[0];
        cleanedPositions.push(v0);
        var c0 = ellipsoid.cartesianToCartographic(v0, scratchCartographic1);
        if (hasTopHeights) {
            c0.height = topHeights[0];
        }
        cleanedTopHeights.push(c0.height);
        if (hasBottomHeights) {
            cleanedBottomHeights.push(bottomHeights[0]);
        }
        for (var i = 1; i < length; ++i) {
            var v1 = positions[i];
            var c1 = ellipsoid.cartesianToCartographic(v1, scratchCartographic2);
            if (hasTopHeights) {
                c1.height = topHeights[i];
            }
            if (!latLonEquals(c0, c1)) {
                cleanedPositions.push(v1); // Shallow copy!
                cleanedTopHeights.push(c1.height);
                if (hasBottomHeights) {
                    cleanedBottomHeights.push(bottomHeights[i]);
                }
            } else if (c0.height < c1.height) {
                cleanedTopHeights[i-1] = c1.height;
            }

            c0 = c1.clone(c0);
        }

        return {
            positions: cleanedPositions,
            topHeights: cleanedTopHeights,
            bottomHeights: cleanedBottomHeights
        };
    }

    /**
     * @private
     */
    WallGeometryLibrary.computePositions = function(ellipsoid, wallPositions, maximumHeights, minimumHeights, granularity, duplicateCorners) {
        var o = removeDuplicates(ellipsoid, wallPositions, maximumHeights, minimumHeights);

        wallPositions = o.positions;
        maximumHeights = o.topHeights;
        minimumHeights = o.bottomHeights;

        if (wallPositions.length < 2) {
            throw new DeveloperError('unique positions must be greater than or equal to 2');
        }
        var hasMinHeights = (defined(minimumHeights));

        if (wallPositions.length >= 3) {
            // Order positions counter-clockwise
            var tangentPlane = EllipsoidTangentPlane.fromPoints(wallPositions, ellipsoid);
            var positions2D = tangentPlane.projectPointsOntoPlane(wallPositions);

            if (PolygonPipeline.computeWindingOrder2D(positions2D) === WindingOrder.CLOCKWISE) {
                wallPositions.reverse();
                maximumHeights.reverse();

                if (hasMinHeights) {
                    minimumHeights.reverse();
                }
            }
        }

        var i;
        var length = wallPositions.length;
        var newMaxHeights = [];
        var newMinHeights = (hasMinHeights) ? [] : undefined;
        var newWallPositions = [];
        for (i = 0; i < length-1; i++) {
            var p1 = wallPositions[i];
            var p2 = wallPositions[i + 1];
            var h1 = maximumHeights[i];
            var h2 = maximumHeights[i + 1];
            newMaxHeights = newMaxHeights.concat(subdivideHeights(p1, p2, h1, h2, granularity));
            if (duplicateCorners) {
                newMaxHeights.push(h2);
            }

            if (hasMinHeights) {
                p1 = wallPositions[i];
                p2 = wallPositions[i + 1];
                h1 = minimumHeights[i];
                h2 = minimumHeights[i + 1];
                newMinHeights = newMinHeights.concat(subdivideHeights(p1, p2, h1, h2, granularity));
                if (duplicateCorners) {
                    newMinHeights.push(h2);
                }
            }

            if (duplicateCorners) {
                newWallPositions = newWallPositions.concat(PolylinePipeline.scaleToSurface([p1, p2], granularity, ellipsoid));
            }
        }

        if (!duplicateCorners) {
            newWallPositions = PolylinePipeline.scaleToSurface(wallPositions, granularity, ellipsoid);
            newMaxHeights.push(maximumHeights[length-1]);
            if (hasMinHeights) {
                newMinHeights.push(minimumHeights[length-1]);
            }
        }
        var bottomPositions = (hasMinHeights) ? PolylinePipeline.scaleToGeodeticHeight(newWallPositions, newMinHeights, ellipsoid) : newWallPositions.slice(0);
        var topPositions = PolylinePipeline.scaleToGeodeticHeight(newWallPositions, newMaxHeights, ellipsoid);

        return {
            newWallPositions: newWallPositions,
            bottomPositions: bottomPositions,
            topPositions: topPositions
        };
    };

    return WallGeometryLibrary;
});
/*global define*/
define('Core/WallGeometry',[
        './defaultValue',
        './defined',
        './BoundingSphere',
        './Cartesian3',
        './ComponentDatatype',
        './IndexDatatype',
        './DeveloperError',
        './Ellipsoid',
        './Geometry',
        './GeometryAttribute',
        './GeometryAttributes',
        './Math',
        './PrimitiveType',
        './VertexFormat',
        './WallGeometryLibrary'
    ], function(
        defaultValue,
        defined,
        BoundingSphere,
        Cartesian3,
        ComponentDatatype,
        IndexDatatype,
        DeveloperError,
        Ellipsoid,
        Geometry,
        GeometryAttribute,
        GeometryAttributes,
        CesiumMath,
        PrimitiveType,
        VertexFormat,
        WallGeometryLibrary) {
    "use strict";

    var scratchCartesian3Position1 = new Cartesian3();
    var scratchCartesian3Position2 = new Cartesian3();
    var scratchCartesian3Position3 = new Cartesian3();
    var scratchCartesian3Position4 = new Cartesian3();
    var scratchCartesian3Position5 = new Cartesian3();
    var scratchBinormal = new Cartesian3();
    var scratchTangent = new Cartesian3();
    var scratchNormal = new Cartesian3();

    /**
     * A description of a wall, which is similar to a KML line string. A wall is defined by a series of points,
     * which extrude down to the ground. Optionally, they can extrude downwards to a specified height.
     *
     * @alias WallGeometry
     * @constructor
     *
     * @param {Array} positions An array of Cartesian objects, which are the points of the wall.
     * @param {Number} [options.granularity=CesiumMath.RADIANS_PER_DEGREE] The distance, in radians, between each latitude and longitude. Determines the number of positions in the buffer.
     * @param {Array} [maximumHeights] An array parallel to <code>positions</code> that give the maximum height of the
     *        wall at <code>positions</code>. If undefined, the height of each position in used.
     * @param {Array} [minimumHeights] An array parallel to <code>positions</code> that give the minimum height of the
     *        wall at <code>positions</code>. If undefined, the height at each position is 0.0.
     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid for coordinate manipulation
     * @param {VertexFormat} [options.vertexFormat=VertexFormat.DEFAULT] The vertex attributes to be computed.
     *
     * @exception {DeveloperError} positions is required.
     * @exception {DeveloperError} positions and maximumHeights must have the same length.
     * @exception {DeveloperError} positions and minimumHeights must have the same length.
     *
     * @see WallGeometry#createGeometry
     * @see WallGeometry#fromConstantHeight
     *
     * @example
     * var positions = [
     *   Cartographic.fromDegrees(19.0, 47.0, 10000.0),
     *   Cartographic.fromDegrees(19.0, 48.0, 10000.0),
     *   Cartographic.fromDegrees(20.0, 48.0, 10000.0),
     *   Cartographic.fromDegrees(20.0, 47.0, 10000.0),
     *   Cartographic.fromDegrees(19.0, 47.0, 10000.0)
     * ];
     *
     * // create a wall that spans from ground level to 10000 meters
     * var wall = new WallGeometry({
     *     positions : ellipsoid.cartographicArrayToCartesianArray(positions)
     * });
     * var geometry = WallGeometry.createGeometry(wall);
     */
    var WallGeometry = function(options) {
        options = defaultValue(options, defaultValue.EMPTY_OBJECT);

        var wallPositions = options.positions;
        var maximumHeights = options.maximumHeights;
        var minimumHeights = options.minimumHeights;

        if (!defined(wallPositions)) {
            throw new DeveloperError('positions is required.');
        }

        if (defined(maximumHeights) && maximumHeights.length !== wallPositions.length) {
            throw new DeveloperError('positions and maximumHeights must have the same length.');
        }

        if (defined(minimumHeights) && minimumHeights.length !== wallPositions.length) {
            throw new DeveloperError('positions and minimumHeights must have the same length.');
        }

        var vertexFormat = defaultValue(options.vertexFormat, VertexFormat.DEFAULT);
        var granularity = defaultValue(options.granularity, CesiumMath.RADIANS_PER_DEGREE);
        var ellipsoid = defaultValue(options.ellipsoid, Ellipsoid.WGS84);

        this._positions = wallPositions;
        this._minimumHeights = minimumHeights;
        this._maximumHeights = maximumHeights;
        this._vertexFormat = vertexFormat;
        this._granularity = granularity;
        this._ellipsoid = ellipsoid;
        this._workerName = 'createWallGeometry';
    };

    /**
     * A description of a wall, which is similar to a KML line string. A wall is defined by a series of points,
     * which extrude down to the ground. Optionally, they can extrude downwards to a specified height.
     *
     * @memberof WallGeometry
     *
     * @param {Array} positions An array of Cartesian objects, which are the points of the wall.
     * @param {Number} [maximumHeight] A constant that defines the maximum height of the
     *        wall at <code>positions</code>. If undefined, the height of each position in used.
     * @param {Number} [minimumHeight] A constant that defines the minimum height of the
     *        wall at <code>positions</code>. If undefined, the height at each position is 0.0.
     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid for coordinate manipulation
     * @param {VertexFormat} [options.vertexFormat=VertexFormat.DEFAULT] The vertex attributes to be computed.
     *
     * @exception {DeveloperError} positions is required.
     *
     * @see WallGeometry#createGeometry
     *
     * @example
     * var positions = [
     *   Cartographic.fromDegrees(19.0, 47.0, 10000.0),
     *   Cartographic.fromDegrees(19.0, 48.0, 10000.0),
     *   Cartographic.fromDegrees(20.0, 48.0, 10000.0),
     *   Cartographic.fromDegrees(20.0, 47.0, 10000.0),
     *   Cartographic.fromDegrees(19.0, 47.0, 10000.0)
     * ];
     *
     * // create a wall that spans from 10000 meters to 20000 meters
     * var wall = WallGeometry.fromConstantHeights({
     *     positions : ellipsoid.cartographicArrayToCartesianArray(positions),
     *     minimumHeight : 20000.0,
     *     maximumHeight : 10000.0
     * });
     * var geometry = WallGeometry.createGeometry(wall);
     */
    WallGeometry.fromConstantHeights = function(options) {
        options = defaultValue(options, defaultValue.EMPTY_OBJECT);

        var positions = options.positions;
        if (!defined(positions)) {
            throw new DeveloperError('options.positions is required.');
        }

        var minHeights;
        var maxHeights;

        var min = options.minimumHeight;
        var max = options.maximumHeight;

        var doMin = defined(min);
        var doMax = defined(max);
        if (doMin || doMax) {
            var length = positions.length;
            minHeights = (doMin) ? new Array(length) : undefined;
            maxHeights = (doMax) ? new Array(length) : undefined;

            for (var i = 0; i < length; ++i) {
                if (doMin) {
                    minHeights[i] = min;
                }

                if (doMax) {
                    maxHeights[i] = max;
                }
            }
        }

        var newOptions = {
            positions : positions,
            maximumHeights : maxHeights,
            minimumHeights : minHeights,
            ellipsoid : options.ellipsoid,
            vertexFormat : options.vertexFormat
        };
        return new WallGeometry(newOptions);
    };

    /**
     * Computes the geometric representation of a wall, including its vertices, indices, and a bounding sphere.
     * @memberof WallGeometry
     *
     * @param {WallGeometry} wallGeometry A description of the wall.
     * @returns {Geometry} The computed vertices and indices.
     *
     * @exception {DeveloperError} unique positions must be greater than or equal to 2.
     */
    WallGeometry.createGeometry = function(wallGeometry) {
        var wallPositions = wallGeometry._positions;
        var minimumHeights = wallGeometry._minimumHeights;
        var maximumHeights = wallGeometry._maximumHeights;
        var vertexFormat = wallGeometry._vertexFormat;
        var granularity = wallGeometry._granularity;
        var ellipsoid = wallGeometry._ellipsoid;

        var pos = WallGeometryLibrary.computePositions(ellipsoid, wallPositions, maximumHeights, minimumHeights, granularity, true);
        var newWallPositions = pos.newWallPositions;
        var bottomPositions = pos.bottomPositions;
        var topPositions = pos.topPositions;

        var length = newWallPositions.length;
        var size = length * 2;

        var positions = vertexFormat.position ? new Float64Array(size) : undefined;
        var normals = vertexFormat.normal ? new Float32Array(size) : undefined;
        var tangents = vertexFormat.tangent ? new Float32Array(size) : undefined;
        var binormals = vertexFormat.binormal ? new Float32Array(size) : undefined;
        var textureCoordinates = vertexFormat.st ? new Float32Array(size / 3 * 2) : undefined;

        var positionIndex = 0;
        var normalIndex = 0;
        var binormalIndex = 0;
        var tangentIndex = 0;
        var stIndex = 0;

        // add lower and upper points one after the other, lower
        // points being even and upper points being odd
        var normal = scratchNormal;
        var tangent = scratchTangent;
        var binormal = scratchBinormal;
        var recomputeNormal = true;
        length /= 3;
        var i;
        for (i = 0; i < length; ++i) {
            var i3 = i * 3;
            var topPosition = Cartesian3.fromArray(topPositions, i3, scratchCartesian3Position1);
            var bottomPosition = Cartesian3.fromArray(bottomPositions, i3, scratchCartesian3Position2);
            if (vertexFormat.position) {
                // insert the lower point
                positions[positionIndex++] = bottomPosition.x;
                positions[positionIndex++] = bottomPosition.y;
                positions[positionIndex++] = bottomPosition.z;

                // insert the upper point
                positions[positionIndex++] = topPosition.x;
                positions[positionIndex++] = topPosition.y;
                positions[positionIndex++] = topPosition.z;
            }

            if (vertexFormat.normal || vertexFormat.tangent || vertexFormat.binormal) {
                var nextPosition;
                var nextTop = new Cartesian3();
                var groundPosition = Cartesian3.fromArray(newWallPositions, i3, scratchCartesian3Position2);
                if (i + 1 < length) {
                    nextPosition = Cartesian3.fromArray(newWallPositions, i3 + 3, scratchCartesian3Position3);
                    nextTop = Cartesian3.fromArray(topPositions, i3 + 3, scratchCartesian3Position5);
                }

                if (recomputeNormal) {
                    var scalednextPosition = Cartesian3.subtract(nextTop, topPosition, scratchCartesian3Position4);
                    var scaledGroundPosition = Cartesian3.subtract(groundPosition, topPosition, scratchCartesian3Position1);
                    normal = Cartesian3.normalize(Cartesian3.cross(scaledGroundPosition, scalednextPosition, normal), normal);
                    recomputeNormal = false;
                }

                if (Cartesian3.equalsEpsilon(nextPosition, groundPosition, CesiumMath.EPSILON6)) {
                    recomputeNormal = true;
                } else {
                    if (vertexFormat.tangent) {
                        tangent = Cartesian3.normalize(Cartesian3.subtract(nextPosition, groundPosition, tangent), tangent);
                    }
                    if (vertexFormat.binormal) {
                        binormal = Cartesian3.normalize(Cartesian3.cross(normal, tangent, binormal), binormal);
                    }
                }

                if (vertexFormat.normal) {
                    normals[normalIndex++] = normal.x;
                    normals[normalIndex++] = normal.y;
                    normals[normalIndex++] = normal.z;

                    normals[normalIndex++] = normal.x;
                    normals[normalIndex++] = normal.y;
                    normals[normalIndex++] = normal.z;
                }

                if (vertexFormat.tangent) {
                    tangents[tangentIndex++] = tangent.x;
                    tangents[tangentIndex++] = tangent.y;
                    tangents[tangentIndex++] = tangent.z;

                    tangents[tangentIndex++] = tangent.x;
                    tangents[tangentIndex++] = tangent.y;
                    tangents[tangentIndex++] = tangent.z;
                }

                if (vertexFormat.binormal) {
                    binormals[binormalIndex++] = binormal.x;
                    binormals[binormalIndex++] = binormal.y;
                    binormals[binormalIndex++] = binormal.z;

                    binormals[binormalIndex++] = binormal.x;
                    binormals[binormalIndex++] = binormal.y;
                    binormals[binormalIndex++] = binormal.z;
                }
            }

            if (vertexFormat.st) {
                var s = i / (length - 1);

                textureCoordinates[stIndex++] = s;
                textureCoordinates[stIndex++] = 0.0;

                textureCoordinates[stIndex++] = s;
                textureCoordinates[stIndex++] = 1.0;
            }
        }

        var attributes = new GeometryAttributes();

        if (vertexFormat.position) {
            attributes.position = new GeometryAttribute({
                componentDatatype : ComponentDatatype.DOUBLE,
                componentsPerAttribute : 3,
                values : positions
            });
        }

        if (vertexFormat.normal) {
            attributes.normal = new GeometryAttribute({
                componentDatatype : ComponentDatatype.FLOAT,
                componentsPerAttribute : 3,
                values : normals
            });
        }

        if (vertexFormat.tangent) {
            attributes.tangent = new GeometryAttribute({
                componentDatatype : ComponentDatatype.FLOAT,
                componentsPerAttribute : 3,
                values : tangents
            });
        }

        if (vertexFormat.binormal) {
            attributes.binormal = new GeometryAttribute({
                componentDatatype : ComponentDatatype.FLOAT,
                componentsPerAttribute : 3,
                values : binormals
            });
        }

        if (vertexFormat.st) {
            attributes.st = new GeometryAttribute({
                componentDatatype : ComponentDatatype.FLOAT,
                componentsPerAttribute : 2,
                values : textureCoordinates
            });
        }

        // prepare the side walls, two triangles for each wall
        //
        //    A (i+1)  B (i+3) E
        //    +--------+-------+
        //    |      / |      /|    triangles:  A C B
        //    |     /  |     / |                B C D
        //    |    /   |    /  |
        //    |   /    |   /   |
        //    |  /     |  /    |
        //    | /      | /     |
        //    +--------+-------+
        //    C (i)    D (i+2) F
        //

        var numVertices = size / 3;
        size -= 6;
        var indices = IndexDatatype.createTypedArray(numVertices, size);

        var edgeIndex = 0;
        for (i = 0; i < numVertices - 2; i += 2) {
            var LL = i;
            var LR = i + 2;
            var pl = Cartesian3.fromArray(positions, LL * 3, scratchCartesian3Position1);
            var pr = Cartesian3.fromArray(positions, LR * 3, scratchCartesian3Position2);
            if (Cartesian3.equalsEpsilon(pl, pr, CesiumMath.EPSILON6)) {
                continue;
            }
            var UL = i + 1;
            var UR = i + 3;

            indices[edgeIndex++] = UL;
            indices[edgeIndex++] = LL;
            indices[edgeIndex++] = UR;
            indices[edgeIndex++] = UR;
            indices[edgeIndex++] = LL;
            indices[edgeIndex++] = LR;
        }

        return new Geometry({
            attributes : attributes,
            indices : indices,
            primitiveType : PrimitiveType.TRIANGLES,
            boundingSphere : new BoundingSphere.fromVertices(positions)
        });
    };

    return WallGeometry;
});

/*global define*/
define('Core/Color',[
        './defaultValue',
        './defined',
        './freezeObject',
        './DeveloperError',
        './FeatureDetection',
        './Math'
    ], function(
        defaultValue,
        defined,
        freezeObject,
        DeveloperError,
        FeatureDetection,
        CesiumMath) {
    "use strict";

    function hue2rgb(m1, m2, h) {
        if (h < 0) {
            h += 1;
        }
        if (h > 1) {
            h -= 1;
        }
        if (h * 6 < 1) {
            return m1 + (m2 - m1) * 6 * h;
        }
        if (h * 2 < 1) {
            return m2;
        }
        if (h * 3 < 2) {
            return m1 + (m2 - m1) * (2 / 3 - h) * 6;
        }
        return m1;
    }

    /**
     * A color, specified using red, green, blue, and alpha values,
     * which range from <code>0</code> (no intensity) to <code>1.0</code> (full intensity).
     * @param {Number} [red=1.0] The red component.
     * @param {Number} [green=1.0] The green component.
     * @param {Number} [blue=1.0] The blue component.
     * @param {Number} [alpha=1.0] The alpha component.
     *
     * @constructor
     * @alias Color
     *
     * @see Packable
     */
    var Color = function(red, green, blue, alpha) {
        /**
         * The red component.
         * @type {Number}
         * @default 1.0
         */
        this.red = defaultValue(red, 1.0);
        /**
         * The green component.
         * @type {Number}
         * @default 1.0
         */
        this.green = defaultValue(green, 1.0);
        /**
         * The blue component.
         * @type {Number}
         * @default 1.0
         */
        this.blue = defaultValue(blue, 1.0);
        /**
         * The alpha component.
         * @type {Number}
         * @default 1.0
         */
        this.alpha = defaultValue(alpha, 1.0);
    };

    /**
     * Creates a new Color specified using red, green, blue, and alpha values
     * that are in the range of 0 to 255, converting them internally to a range of 0.0 to 1.0.
     * @memberof Color
     *
     * @param {Number} [red=255] The red component.
     * @param {Number} [green=255] The green component.
     * @param {Number} [blue=255] The blue component.
     * @param {Number} [alpha=255] The alpha component.
     * @returns {Color} A new color instance.
     */
    Color.fromBytes = function(red, green, blue, alpha) {
        red = Color.byteToFloat(defaultValue(red, 255.0));
        green = Color.byteToFloat(defaultValue(green, 255.0));
        blue = Color.byteToFloat(defaultValue(blue, 255.0));
        alpha = Color.byteToFloat(defaultValue(alpha, 255.0));
        return new Color(red, green, blue, alpha);
    };

    var scratchArrayBuffer;
    var scratchUint32Array;
    var scratchUint8Array;
    if (FeatureDetection.supportsTypedArrays()) {
        scratchArrayBuffer = new ArrayBuffer(4);
        scratchUint32Array = new Uint32Array(scratchArrayBuffer);
        scratchUint8Array = new Uint8Array(scratchArrayBuffer);
    }

    /**
     * Creates a new Color from a single numeric unsigned 32-bit RGBA value, using the endianness
     * of the system.
     *
     * @memberof Color
     *
     * @param {Number} rgba A single numeric unsigned 32-bit RGBA value.
     * @returns {Color} A new color instance.
     *
     * @example
     * var color = Color.fromRgba(0x67ADDFFF);
     *
     * @see Color#toRgba
     */
    Color.fromRgba = function(rgba) {
        // scratchUint32Array and scratchUint8Array share an underlying array buffer
        scratchUint32Array[0] = rgba;
        return Color.fromBytes(scratchUint8Array[0], scratchUint8Array[1], scratchUint8Array[2], scratchUint8Array[3]);
    };

    /**
     * Creates a Color instance from hue, saturation, and lightness.
     * @memberof Color
     *
     * @param {Number} [hue=0] The hue angle 0...1
     * @param {Number} [saturation=0] The saturation value 0...1
     * @param {Number} [lightness=0] The lightness value 0...1
     * @param {Number} [alpha=1.0] The alpha component 0...1
     * @returns {Color} The color object.
     *
     * @see <a href="http://www.w3.org/TR/css3-color/#hsl-color">CSS color values</a>
     */
    Color.fromHsl = function(hue, saturation, lightness, alpha) {
        hue = defaultValue(hue, 0.0) % 1.0;
        saturation = defaultValue(saturation, 0.0);
        lightness = defaultValue(lightness, 0.0);
        alpha = defaultValue(alpha, 1.0);

        var red = lightness;
        var green = lightness;
        var blue = lightness;

        if (saturation !== 0) {
            var m2;
            if (lightness < 0.5) {
                m2 = lightness * (1 + saturation);
            } else {
                m2 = lightness + saturation - lightness * saturation;
            }

            var m1 = 2.0 * lightness - m2;
            red = hue2rgb(m1, m2, hue + 1 / 3);
            green = hue2rgb(m1, m2, hue);
            blue = hue2rgb(m1, m2, hue - 1 / 3);
        }

        return new Color(red, green, blue, alpha);
    };

    /**
     * Creates a random color using the provided options. For reproducible random colors, you should
     * call {@link CesiumMath#setRandomNumberSeed} once at the beginning of your application.
     * @memberof Color
     *
     * @param {Object} [options] Object containing the options.
     * @param {Number} [options.red] If specified, the red component to use instead of a randomized value.
     * @param {Number} [options.minimumRed=0.0] The maximum red value to generate if none was specified.
     * @param {Number} [options.maximumRed=1.0] The minimum red value to generate if none was specified.
     * @param {Number} [options.green] If specified, the green component to use instead of a randomized value.
     * @param {Number} [options.minimumGreen=0.0] The maximum green value to generate if none was specified.
     * @param {Number} [options.maximumGreen=1.0] The minimum green value to generate if none was specified.
     * @param {Number} [options.blue] If specified, the blue component to use instead of a randomized value.
     * @param {Number} [options.minimumBlue=0.0] The maximum blue value to generate if none was specified.
     * @param {Number} [options.maximumBlue=1.0] The minimum blue value to generate if none was specified.
     * @param {Number} [options.alpha] If specified, the alpha component to use instead of a randomized value.
     * @param {Number} [options.minimumAlpha=0.0] The maximum alpha value to generate if none was specified.
     * @param {Number} [options.maximumAlpha=1.0] The minimum alpha value to generate if none was specified.
     * @param {Color} [result] The object to store the result in, if undefined a new instance will be created.
     *
     * @returns {Color} The modified result parameter or a new instance if result was undefined.
     *
     * @exception {DeveloperError} minimumRed must be less than or equal to maximumRed.
     * @exception {DeveloperError} minimumGreen must be less than or equal to maximumGreen.
     * @exception {DeveloperError} minimumBlue must be less than or equal to maximumBlue.
     * @exception {DeveloperError} minimumAlpha must be less than or equal to maximumAlpha.
     *
     * @example
     * //Create a completely random color
     * var color = Color.fromRandom();
     *
     * //Create a random shade of yellow.
     * var color = Color.fromRandom({
     *     red : 1.0,
     *     green : 1.0,
     *     alpha : 1.0
     * });
     *
     * //Create a random bright color.
     * var color = Color.fromRandom({
     *     minimumRed : 0.75,
     *     minimumGreen : 0.75,
     *     minimumBlue : 0.75,
     *     alpha : 1.0
     * });
     */
    Color.fromRandom = function(options, result) {
        options = defaultValue(options, defaultValue.EMPTY_OBJECT);

        var red = options.red;
        if (!defined(red)) {
            var minimumRed = defaultValue(options.minimumRed, 0);
            var maximumRed = defaultValue(options.maximumRed, 1.0);

            if (minimumRed > maximumRed) {
                throw new DeveloperError("minimumRed must be less than or equal to maximumRed");
            }
            red = minimumRed + (CesiumMath.nextRandomNumber() * (maximumRed - minimumRed));
        }

        var green = options.green;
        if (!defined(green)) {
            var minimumGreen = defaultValue(options.minimumGreen, 0);
            var maximumGreen = defaultValue(options.maximumGreen, 1.0);

            if (minimumGreen > maximumGreen) {
                throw new DeveloperError("minimumGreen must be less than or equal to maximumGreen");
            }
            green = minimumGreen + (CesiumMath.nextRandomNumber() * (maximumGreen - minimumGreen));
        }

        var blue = options.blue;
        if (!defined(blue)) {
            var minimumBlue = defaultValue(options.minimumBlue, 0);
            var maximumBlue = defaultValue(options.maximumBlue, 1.0);

            if (minimumBlue > maximumBlue) {
                throw new DeveloperError("minimumBlue must be less than or equal to maximumBlue");
            }
            blue = minimumBlue + (CesiumMath.nextRandomNumber() * (maximumBlue - minimumBlue));
        }

        var alpha = options.alpha;
        if (!defined(alpha)) {
            var minimumAlpha = defaultValue(options.minimumAlpha, 0);
            var maximumAlpha = defaultValue(options.maximumAlpha, 1.0);

            if (minimumAlpha > maximumAlpha) {
                throw new DeveloperError("minimumAlpha must be less than or equal to maximumAlpha");
            }
            alpha = minimumAlpha + (CesiumMath.nextRandomNumber() * (maximumAlpha - minimumAlpha));
        }

        if (!defined(result)) {
            return new Color(red, green, blue, alpha);
        }

        result.red = red;
        result.green = green;
        result.blue = blue;
        result.alpha = alpha;
        return result;
    };

    //#rgb
    var rgbMatcher = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i;
    //#rrggbb
    var rrggbbMatcher = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;
    //rgb(), rgba(), or rgb%()
    var rgbParenthesesMatcher = /^rgba?\(\s*([0-9.]+%?)\s*,\s*([0-9.]+%?)\s*,\s*([0-9.]+%?)(?:\s*,\s*([0-9.]+))?\s*\)$/i;
    //hsl(), hsla(), or hsl%()
    var hslParenthesesMatcher = /^hsla?\(\s*([0-9.]+)\s*,\s*([0-9.]+%)\s*,\s*([0-9.]+%)(?:\s*,\s*([0-9.]+))?\s*\)$/i;

    /**
     * Creates a Color instance from a CSS color value.
     * @memberof Color
     *
     * @param {String} color The CSS color value in #rgb, #rrggbb, rgb(), rgba(), hsl(), or hsla() format.
     * @returns {Color} The color object, or undefined if the string was not a valid CSS color.
     *
     * @exception {DeveloperError} color is required.
     *
     * @example
     * var cesiumBlue = Color.fromCssColorString('#67ADDF');
     * var green = Color.fromCssColorString('green');
     *
     * @see <a href="http://www.w3.org/TR/css3-color">CSS color values</a>
     */
    Color.fromCssColorString = function(color) {
        if (!defined(color)) {
            throw new DeveloperError('color is required');
        }

        var namedColor = Color[color.toUpperCase()];
        if (defined(namedColor)) {
            return namedColor.clone();
        }

        var matches = rgbMatcher.exec(color);
        if (matches !== null) {
            return new Color(parseInt(matches[1], 16) / 15.0,
                             parseInt(matches[2], 16) / 15.0,
                             parseInt(matches[3], 16) / 15.0);
        }

        matches = rrggbbMatcher.exec(color);
        if (matches !== null) {
            return new Color(parseInt(matches[1], 16) / 255.0,
                             parseInt(matches[2], 16) / 255.0,
                             parseInt(matches[3], 16) / 255.0);
        }

        matches = rgbParenthesesMatcher.exec(color);
        if (matches !== null) {
            return new Color(parseFloat(matches[1]) / ('%' === matches[1].substr(-1) ? 100.0 : 255.0),
                             parseFloat(matches[2]) / ('%' === matches[2].substr(-1) ? 100.0 : 255.0),
                             parseFloat(matches[3]) / ('%' === matches[3].substr(-1) ? 100.0 : 255.0),
                             parseFloat(defaultValue(matches[4], '1.0')));
        }

        matches = hslParenthesesMatcher.exec(color);
        if (matches !== null) {
            return Color.fromHsl(parseFloat(matches[1]) / 360.0,
                                 parseFloat(matches[2]) / 100.0,
                                 parseFloat(matches[3]) / 100.0,
                                 parseFloat(defaultValue(matches[4], '1.0')));
        }

        return undefined;
    };

    /**
     * The number of elements used to pack the object into an array.
     * @Type {Number}
     */
    Color.packedLength = 4;

    /**
     * Stores the provided instance into the provided array.
     * @memberof Color
     *
     * @param {Color} value The value to pack.
     * @param {Array} array The array to pack into.
     * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
     *
     * @exception {DeveloperError} value is required.
     * @exception {DeveloperError} array is required.
     */
    Color.pack = function(value, array, startingIndex) {
        if (!defined(value)) {
            throw new DeveloperError('value is required');
        }

        if (!defined(array)) {
            throw new DeveloperError('array is required');
        }

        startingIndex = defaultValue(startingIndex, 0);

        array[startingIndex++] = value.red;
        array[startingIndex++] = value.green;
        array[startingIndex++] = value.blue;
        array[startingIndex] = value.alpha;
    };

    /**
     * Retrieves an instance from a packed array.
     * @memberof Color
     *
     * @param {Array} array The packed array.
     * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
     * @param {Color} [result] The object into which to store the result.
     *
     * @exception {DeveloperError} array is required.
     */
    Color.unpack = function(array, startingIndex, result) {
        if (!defined(array)) {
            throw new DeveloperError('array is required');
        }

        startingIndex = defaultValue(startingIndex, 0);

        if (!defined(result)) {
            result = new Color();
        }
        result.red = array[startingIndex++];
        result.green = array[startingIndex++];
        result.blue = array[startingIndex++];
        result.alpha = array[startingIndex];
        return result;
    };

    /**
     * Converts a 'byte' color component in the range of 0 to 255 into
     * a 'float' color component in the range of 0 to 1.0.
     * @memberof Color
     *
     * @param {Number} number The number to be converted.
     * @returns {number} The converted number.
     */
    Color.byteToFloat = function(number) {
        return number / 255.0;
    };

    /**
     * Converts a 'float' color component in the range of 0 to 1.0 into
     * a 'byte' color component in the range of 0 to 255.
     * @memberof Color
     *
     * @param {Number} number The number to be converted.
     * @returns {number} The converted number.
     */
    Color.floatToByte = function(number) {
        return number === 1.0 ? 255.0 : (number * 256.0) | 0;
    };

    /**
     * Duplicates a Color.
     * @memberof Color
     *
     * @param {Color} color The Color to duplicate.
     * @param {Color} [result] The object to store the result in, if undefined a new instance will be created.
     * @returns {Color} The modified result parameter or a new instance if result was undefined. (Returns undefined if color is undefined)
     */
    Color.clone = function(color, result) {
        if (!defined(color)) {
            return undefined;
        }
        if (!defined(result)) {
            return new Color(color.red, color.green, color.blue, color.alpha);
        }
        result.red = color.red;
        result.green = color.green;
        result.blue = color.blue;
        result.alpha = color.alpha;
        return result;
    };

    /**
     * Returns true if the first Color equals the second color.
     * @memberof Color
     *
     * @param {Color} left The first Color to compare for equality.
     * @param {Color} right The second Color to compare for equality.
     * @returns {Boolean} <code>true</code> if the Colors are equal; otherwise, <code>false</code>.
     */
    Color.equals = function(left, right) {
        return (left === right) || //
               (defined(left) && //
                defined(right) && //
                left.red === right.red && //
                left.green === right.green && //
                left.blue === right.blue && //
                left.alpha === right.alpha);
    };

    /**
     * Returns a duplicate of a Color instance.
     * @memberof Color
     *
     * @param {Color} [result] The object to store the result in, if undefined a new instance will be created.
     * @returns {Color} The modified result parameter or a new instance if result was undefined.
     */
    Color.prototype.clone = function(result) {
        return Color.clone(this, result);
    };

    /**
     * Returns true if this Color equals other.
     * @memberof Color
     *
     * @param {Color} other The Color to compare for equality.
     * @returns {Boolean} <code>true</code> if the Colors are equal; otherwise, <code>false</code>.
     */
    Color.prototype.equals = function(other) {
        return Color.equals(this, other);
    };

    /**
     * Returns <code>true</code> if this Color equals other componentwise within the specified epsilon.
     * @memberof Color
     *
     * @param {Color} other The Color to compare for equality.
     * @param {Number} [epsilon=0.0] The epsilon to use for equality testing.
     * @returns {Boolean} <code>true</code> if the Colors are equal within the specified epsilon; otherwise, <code>false</code>.
     */
    Color.prototype.equalsEpsilon = function(other, epsilon) {
        return (this === other) || //
               ((defined(other)) && //
                (Math.abs(this.red - other.red) <= epsilon) && //
                (Math.abs(this.green - other.green) <= epsilon) && //
                (Math.abs(this.blue - other.blue) <= epsilon) && //
                (Math.abs(this.alpha - other.alpha) <= epsilon));
    };

    /**
     * Creates a string representing this Color in the format '(red, green, blue, alpha)'.
     * @memberof Color
     *
     * @returns {String} A string representing this Color in the format '(red, green, blue, alpha)'.
     */
    Color.prototype.toString = function() {
        return '(' + this.red + ', ' + this.green + ', ' + this.blue + ', ' + this.alpha + ')';
    };

    /**
     * Creates a string containing the CSS color value for this color.
     * @memberof Color
     *
     * @returns {String} The CSS equivalent of this color.
     * @see <a href="http://www.w3.org/TR/css3-color/#rgba-color">CSS RGB or RGBA color values</a>
     */
    Color.prototype.toCssColorString = function() {
        var red = Color.floatToByte(this.red);
        var green = Color.floatToByte(this.green);
        var blue = Color.floatToByte(this.blue);
        if (this.alpha === 1) {
            return 'rgb(' + red + ',' + green + ',' + blue + ')';
        }
        return 'rgba(' + red + ',' + green + ',' + blue + ',' + this.alpha + ')';
    };

    /**
     * Converts this color to an array of red, green, blue, and alpha values
     * that are in the range of 0 to 255.
     * @memberof Color
     *
     * @param {Array} [result] The array to store the result in, if undefined a new instance will be created.
     * @returns {Array} The modified result parameter or a new instance if result was undefined.
     */
    Color.prototype.toBytes = function(result) {
        var red = Color.floatToByte(this.red);
        var green = Color.floatToByte(this.green);
        var blue = Color.floatToByte(this.blue);
        var alpha = Color.floatToByte(this.alpha);

        if (!defined(result)) {
            return [red, green, blue, alpha];
        }
        result[0] = red;
        result[1] = green;
        result[2] = blue;
        result[3] = alpha;
        return result;
    };

    /**
     * Converts this color to a single numeric unsigned 32-bit RGBA value, using the endianness
     * of the system.
     *
     * @memberof Color
     *
     * @returns {Number} A single numeric unsigned 32-bit RGBA value.
     *
     * @example
     * var rgba = Color.BLUE.toRgba();
     *
     * @see Color.fromRgba
     */
    Color.prototype.toRgba = function() {
        // scratchUint32Array and scratchUint8Array share an underlying array buffer
        scratchUint8Array[0] = Color.floatToByte(this.red);
        scratchUint8Array[1] = Color.floatToByte(this.green);
        scratchUint8Array[2] = Color.floatToByte(this.blue);
        scratchUint8Array[3] = Color.floatToByte(this.alpha);
        return scratchUint32Array[0];
    };

    /**
     * An immutable Color instance initialized to CSS color #F0F8FF
     * <span class="colorSwath" style="background: #F0F8FF;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.ALICEBLUE = freezeObject(Color.fromCssColorString('#F0F8FF'));

    /**
     * An immutable Color instance initialized to CSS color #FAEBD7
     * <span class="colorSwath" style="background: #FAEBD7;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.ANTIQUEWHITE = freezeObject(Color.fromCssColorString('#FAEBD7'));

    /**
     * An immutable Color instance initialized to CSS color #00FFFF
     * <span class="colorSwath" style="background: #00FFFF;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.AQUA = freezeObject(Color.fromCssColorString('#00FFFF'));

    /**
     * An immutable Color instance initialized to CSS color #7FFFD4
     * <span class="colorSwath" style="background: #7FFFD4;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.AQUAMARINE = freezeObject(Color.fromCssColorString('#7FFFD4'));

    /**
     * An immutable Color instance initialized to CSS color #F0FFFF
     * <span class="colorSwath" style="background: #F0FFFF;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.AZURE = freezeObject(Color.fromCssColorString('#F0FFFF'));

    /**
     * An immutable Color instance initialized to CSS color #F5F5DC
     * <span class="colorSwath" style="background: #F5F5DC;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.BEIGE = freezeObject(Color.fromCssColorString('#F5F5DC'));

    /**
     * An immutable Color instance initialized to CSS color #FFE4C4
     * <span class="colorSwath" style="background: #FFE4C4;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.BISQUE = freezeObject(Color.fromCssColorString('#FFE4C4'));

    /**
     * An immutable Color instance initialized to CSS color #000000
     * <span class="colorSwath" style="background: #000000;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.BLACK = freezeObject(Color.fromCssColorString('#000000'));

    /**
     * An immutable Color instance initialized to CSS color #FFEBCD
     * <span class="colorSwath" style="background: #FFEBCD;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.BLANCHEDALMOND = freezeObject(Color.fromCssColorString('#FFEBCD'));

    /**
     * An immutable Color instance initialized to CSS color #0000FF
     * <span class="colorSwath" style="background: #0000FF;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.BLUE = freezeObject(Color.fromCssColorString('#0000FF'));

    /**
     * An immutable Color instance initialized to CSS color #8A2BE2
     * <span class="colorSwath" style="background: #8A2BE2;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.BLUEVIOLET = freezeObject(Color.fromCssColorString('#8A2BE2'));

    /**
     * An immutable Color instance initialized to CSS color #A52A2A
     * <span class="colorSwath" style="background: #A52A2A;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.BROWN = freezeObject(Color.fromCssColorString('#A52A2A'));

    /**
     * An immutable Color instance initialized to CSS color #DEB887
     * <span class="colorSwath" style="background: #DEB887;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.BURLYWOOD = freezeObject(Color.fromCssColorString('#DEB887'));

    /**
     * An immutable Color instance initialized to CSS color #5F9EA0
     * <span class="colorSwath" style="background: #5F9EA0;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.CADETBLUE = freezeObject(Color.fromCssColorString('#5F9EA0'));
    /**
     * An immutable Color instance initialized to CSS color #7FFF00
     * <span class="colorSwath" style="background: #7FFF00;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.CHARTREUSE = freezeObject(Color.fromCssColorString('#7FFF00'));

    /**
     * An immutable Color instance initialized to CSS color #D2691E
     * <span class="colorSwath" style="background: #D2691E;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.CHOCOLATE = freezeObject(Color.fromCssColorString('#D2691E'));

    /**
     * An immutable Color instance initialized to CSS color #FF7F50
     * <span class="colorSwath" style="background: #FF7F50;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.CORAL = freezeObject(Color.fromCssColorString('#FF7F50'));

    /**
     * An immutable Color instance initialized to CSS color #6495ED
     * <span class="colorSwath" style="background: #6495ED;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.CORNFLOWERBLUE = freezeObject(Color.fromCssColorString('#6495ED'));

    /**
     * An immutable Color instance initialized to CSS color #FFF8DC
     * <span class="colorSwath" style="background: #FFF8DC;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.CORNSILK = freezeObject(Color.fromCssColorString('#FFF8DC'));

    /**
     * An immutable Color instance initialized to CSS color #DC143C
     * <span class="colorSwath" style="background: #DC143C;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.CRIMSON = freezeObject(Color.fromCssColorString('#DC143C'));

    /**
     * An immutable Color instance initialized to CSS color #00FFFF
     * <span class="colorSwath" style="background: #00FFFF;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.CYAN = freezeObject(Color.fromCssColorString('#00FFFF'));

    /**
     * An immutable Color instance initialized to CSS color #00008B
     * <span class="colorSwath" style="background: #00008B;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.DARKBLUE = freezeObject(Color.fromCssColorString('#00008B'));

    /**
     * An immutable Color instance initialized to CSS color #008B8B
     * <span class="colorSwath" style="background: #008B8B;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.DARKCYAN = freezeObject(Color.fromCssColorString('#008B8B'));

    /**
     * An immutable Color instance initialized to CSS color #B8860B
     * <span class="colorSwath" style="background: #B8860B;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.DARKGOLDENROD = freezeObject(Color.fromCssColorString('#B8860B'));

    /**
     * An immutable Color instance initialized to CSS color #A9A9A9
     * <span class="colorSwath" style="background: #A9A9A9;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.DARKGRAY = freezeObject(Color.fromCssColorString('#A9A9A9'));

    /**
     * An immutable Color instance initialized to CSS color #006400
     * <span class="colorSwath" style="background: #006400;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.DARKGREEN = freezeObject(Color.fromCssColorString('#006400'));

    /**
     * An immutable Color instance initialized to CSS color #A9A9A9
     * <span class="colorSwath" style="background: #A9A9A9;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.DARKGREY = Color.DARKGRAY;

    /**
     * An immutable Color instance initialized to CSS color #BDB76B
     * <span class="colorSwath" style="background: #BDB76B;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.DARKKHAKI = freezeObject(Color.fromCssColorString('#BDB76B'));

    /**
     * An immutable Color instance initialized to CSS color #8B008B
     * <span class="colorSwath" style="background: #8B008B;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.DARKMAGENTA = freezeObject(Color.fromCssColorString('#8B008B'));

    /**
     * An immutable Color instance initialized to CSS color #556B2F
     * <span class="colorSwath" style="background: #556B2F;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.DARKOLIVEGREEN = freezeObject(Color.fromCssColorString('#556B2F'));

    /**
     * An immutable Color instance initialized to CSS color #FF8C00
     * <span class="colorSwath" style="background: #FF8C00;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.DARKORANGE = freezeObject(Color.fromCssColorString('#FF8C00'));

    /**
     * An immutable Color instance initialized to CSS color #9932CC
     * <span class="colorSwath" style="background: #9932CC;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.DARKORCHID = freezeObject(Color.fromCssColorString('#9932CC'));

    /**
     * An immutable Color instance initialized to CSS color #8B0000
     * <span class="colorSwath" style="background: #8B0000;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.DARKRED = freezeObject(Color.fromCssColorString('#8B0000'));

    /**
     * An immutable Color instance initialized to CSS color #E9967A
     * <span class="colorSwath" style="background: #E9967A;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.DARKSALMON = freezeObject(Color.fromCssColorString('#E9967A'));

    /**
     * An immutable Color instance initialized to CSS color #8FBC8F
     * <span class="colorSwath" style="background: #8FBC8F;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.DARKSEAGREEN = freezeObject(Color.fromCssColorString('#8FBC8F'));

    /**
     * An immutable Color instance initialized to CSS color #483D8B
     * <span class="colorSwath" style="background: #483D8B;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.DARKSLATEBLUE = freezeObject(Color.fromCssColorString('#483D8B'));

    /**
     * An immutable Color instance initialized to CSS color #2F4F4F
     * <span class="colorSwath" style="background: #2F4F4F;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.DARKSLATEGRAY = freezeObject(Color.fromCssColorString('#2F4F4F'));

    /**
     * An immutable Color instance initialized to CSS color #2F4F4F
     * <span class="colorSwath" style="background: #2F4F4F;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.DARKSLATEGREY = Color.DARKSLATEGRAY;

    /**
     * An immutable Color instance initialized to CSS color #00CED1
     * <span class="colorSwath" style="background: #00CED1;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.DARKTURQUOISE = freezeObject(Color.fromCssColorString('#00CED1'));

    /**
     * An immutable Color instance initialized to CSS color #9400D3
     * <span class="colorSwath" style="background: #9400D3;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.DARKVIOLET = freezeObject(Color.fromCssColorString('#9400D3'));

    /**
     * An immutable Color instance initialized to CSS color #FF1493
     * <span class="colorSwath" style="background: #FF1493;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.DEEPPINK = freezeObject(Color.fromCssColorString('#FF1493'));

    /**
     * An immutable Color instance initialized to CSS color #00BFFF
     * <span class="colorSwath" style="background: #00BFFF;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.DEEPSKYBLUE = freezeObject(Color.fromCssColorString('#00BFFF'));

    /**
     * An immutable Color instance initialized to CSS color #696969
     * <span class="colorSwath" style="background: #696969;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.DIMGRAY = freezeObject(Color.fromCssColorString('#696969'));

    /**
     * An immutable Color instance initialized to CSS color #696969
     * <span class="colorSwath" style="background: #696969;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.DIMGREY = Color.DIMGRAY;

    /**
     * An immutable Color instance initialized to CSS color #1E90FF
     * <span class="colorSwath" style="background: #1E90FF;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.DODGERBLUE = freezeObject(Color.fromCssColorString('#1E90FF'));

    /**
     * An immutable Color instance initialized to CSS color #B22222
     * <span class="colorSwath" style="background: #B22222;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.FIREBRICK = freezeObject(Color.fromCssColorString('#B22222'));

    /**
     * An immutable Color instance initialized to CSS color #FFFAF0
     * <span class="colorSwath" style="background: #FFFAF0;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.FLORALWHITE = freezeObject(Color.fromCssColorString('#FFFAF0'));

    /**
     * An immutable Color instance initialized to CSS color #228B22
     * <span class="colorSwath" style="background: #228B22;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.FORESTGREEN = freezeObject(Color.fromCssColorString('#228B22'));

    /**
     * An immutable Color instance initialized to CSS color #FF00FF
     * <span class="colorSwath" style="background: #FF00FF;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.FUSCHIA = freezeObject(Color.fromCssColorString('#FF00FF'));

    /**
     * An immutable Color instance initialized to CSS color #DCDCDC
     * <span class="colorSwath" style="background: #DCDCDC;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.GAINSBORO = freezeObject(Color.fromCssColorString('#DCDCDC'));

    /**
     * An immutable Color instance initialized to CSS color #F8F8FF
     * <span class="colorSwath" style="background: #F8F8FF;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.GHOSTWHITE = freezeObject(Color.fromCssColorString('#F8F8FF'));

    /**
     * An immutable Color instance initialized to CSS color #FFD700
     * <span class="colorSwath" style="background: #FFD700;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.GOLD = freezeObject(Color.fromCssColorString('#FFD700'));

    /**
     * An immutable Color instance initialized to CSS color #DAA520
     * <span class="colorSwath" style="background: #DAA520;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.GOLDENROD = freezeObject(Color.fromCssColorString('#DAA520'));

    /**
     * An immutable Color instance initialized to CSS color #808080
     * <span class="colorSwath" style="background: #808080;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.GRAY = freezeObject(Color.fromCssColorString('#808080'));

    /**
     * An immutable Color instance initialized to CSS color #008000
     * <span class="colorSwath" style="background: #008000;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.GREEN = freezeObject(Color.fromCssColorString('#008000'));

    /**
     * An immutable Color instance initialized to CSS color #ADFF2F
     * <span class="colorSwath" style="background: #ADFF2F;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.GREENYELLOW = freezeObject(Color.fromCssColorString('#ADFF2F'));

    /**
     * An immutable Color instance initialized to CSS color #808080
     * <span class="colorSwath" style="background: #808080;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.GREY = Color.GRAY;

    /**
     * An immutable Color instance initialized to CSS color #F0FFF0
     * <span class="colorSwath" style="background: #F0FFF0;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.HONEYDEW = freezeObject(Color.fromCssColorString('#F0FFF0'));

    /**
     * An immutable Color instance initialized to CSS color #FF69B4
     * <span class="colorSwath" style="background: #FF69B4;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.HOTPINK = freezeObject(Color.fromCssColorString('#FF69B4'));

    /**
     * An immutable Color instance initialized to CSS color #CD5C5C
     * <span class="colorSwath" style="background: #CD5C5C;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.INDIANRED = freezeObject(Color.fromCssColorString('#CD5C5C'));

    /**
     * An immutable Color instance initialized to CSS color #4B0082
     * <span class="colorSwath" style="background: #4B0082;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.INDIGO = freezeObject(Color.fromCssColorString('#4B0082'));

    /**
     * An immutable Color instance initialized to CSS color #FFFFF0
     * <span class="colorSwath" style="background: #FFFFF0;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.IVORY = freezeObject(Color.fromCssColorString('#FFFFF0'));

    /**
     * An immutable Color instance initialized to CSS color #F0E68C
     * <span class="colorSwath" style="background: #F0E68C;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.KHAKI = freezeObject(Color.fromCssColorString('#F0E68C'));

    /**
     * An immutable Color instance initialized to CSS color #E6E6FA
     * <span class="colorSwath" style="background: #E6E6FA;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.LAVENDER = freezeObject(Color.fromCssColorString('#E6E6FA'));

    /**
     * An immutable Color instance initialized to CSS color #FFF0F5
     * <span class="colorSwath" style="background: #FFF0F5;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.LAVENDAR_BLUSH = freezeObject(Color.fromCssColorString('#FFF0F5'));

    /**
     * An immutable Color instance initialized to CSS color #7CFC00
     * <span class="colorSwath" style="background: #7CFC00;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.LAWNGREEN = freezeObject(Color.fromCssColorString('#7CFC00'));

    /**
     * An immutable Color instance initialized to CSS color #FFFACD
     * <span class="colorSwath" style="background: #FFFACD;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.LEMONCHIFFON = freezeObject(Color.fromCssColorString('#FFFACD'));

    /**
     * An immutable Color instance initialized to CSS color #ADD8E6
     * <span class="colorSwath" style="background: #ADD8E6;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.LIGHTBLUE = freezeObject(Color.fromCssColorString('#ADD8E6'));

    /**
     * An immutable Color instance initialized to CSS color #F08080
     * <span class="colorSwath" style="background: #F08080;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.LIGHTCORAL = freezeObject(Color.fromCssColorString('#F08080'));

    /**
     * An immutable Color instance initialized to CSS color #E0FFFF
     * <span class="colorSwath" style="background: #E0FFFF;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.LIGHTCYAN = freezeObject(Color.fromCssColorString('#E0FFFF'));

    /**
     * An immutable Color instance initialized to CSS color #FAFAD2
     * <span class="colorSwath" style="background: #FAFAD2;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.LIGHTGOLDENRODYELLOW = freezeObject(Color.fromCssColorString('#FAFAD2'));

    /**
     * An immutable Color instance initialized to CSS color #D3D3D3
     * <span class="colorSwath" style="background: #D3D3D3;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.LIGHTGRAY = freezeObject(Color.fromCssColorString('#D3D3D3'));

    /**
     * An immutable Color instance initialized to CSS color #90EE90
     * <span class="colorSwath" style="background: #90EE90;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.LIGHTGREEN = freezeObject(Color.fromCssColorString('#90EE90'));

    /**
     * An immutable Color instance initialized to CSS color #D3D3D3
     * <span class="colorSwath" style="background: #D3D3D3;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.LIGHTGREY = Color.LIGHTGRAY;

    /**
     * An immutable Color instance initialized to CSS color #FFB6C1
     * <span class="colorSwath" style="background: #FFB6C1;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.LIGHTPINK = freezeObject(Color.fromCssColorString('#FFB6C1'));

    /**
     * An immutable Color instance initialized to CSS color #20B2AA
     * <span class="colorSwath" style="background: #20B2AA;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.LIGHTSEAGREEN = freezeObject(Color.fromCssColorString('#20B2AA'));

    /**
     * An immutable Color instance initialized to CSS color #87CEFA
     * <span class="colorSwath" style="background: #87CEFA;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.LIGHTSKYBLUE = freezeObject(Color.fromCssColorString('#87CEFA'));

    /**
     * An immutable Color instance initialized to CSS color #778899
     * <span class="colorSwath" style="background: #778899;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.LIGHTSLATEGRAY = freezeObject(Color.fromCssColorString('#778899'));

    /**
     * An immutable Color instance initialized to CSS color #778899
     * <span class="colorSwath" style="background: #778899;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.LIGHTSLATEGREY = Color.LIGHTSLATEGRAY;

    /**
     * An immutable Color instance initialized to CSS color #B0C4DE
     * <span class="colorSwath" style="background: #B0C4DE;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.LIGHTSTEELBLUE = freezeObject(Color.fromCssColorString('#B0C4DE'));

    /**
     * An immutable Color instance initialized to CSS color #FFFFE0
     * <span class="colorSwath" style="background: #FFFFE0;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.LIGHTYELLOW = freezeObject(Color.fromCssColorString('#FFFFE0'));

    /**
     * An immutable Color instance initialized to CSS color #00FF00
     * <span class="colorSwath" style="background: #00FF00;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.LIME = freezeObject(Color.fromCssColorString('#00FF00'));

    /**
     * An immutable Color instance initialized to CSS color #32CD32
     * <span class="colorSwath" style="background: #32CD32;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.LIMEGREEN = freezeObject(Color.fromCssColorString('#32CD32'));

    /**
     * An immutable Color instance initialized to CSS color #FAF0E6
     * <span class="colorSwath" style="background: #FAF0E6;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.LINEN = freezeObject(Color.fromCssColorString('#FAF0E6'));

    /**
     * An immutable Color instance initialized to CSS color #FF00FF
     * <span class="colorSwath" style="background: #FF00FF;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.MAGENTA = freezeObject(Color.fromCssColorString('#FF00FF'));

    /**
     * An immutable Color instance initialized to CSS color #800000
     * <span class="colorSwath" style="background: #800000;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.MAROON = freezeObject(Color.fromCssColorString('#800000'));

    /**
     * An immutable Color instance initialized to CSS color #66CDAA
     * <span class="colorSwath" style="background: #66CDAA;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.MEDIUMAQUAMARINE = freezeObject(Color.fromCssColorString('#66CDAA'));

    /**
     * An immutable Color instance initialized to CSS color #0000CD
     * <span class="colorSwath" style="background: #0000CD;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.MEDIUMBLUE = freezeObject(Color.fromCssColorString('#0000CD'));

    /**
     * An immutable Color instance initialized to CSS color #BA55D3
     * <span class="colorSwath" style="background: #BA55D3;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.MEDIUMORCHID = freezeObject(Color.fromCssColorString('#BA55D3'));

    /**
     * An immutable Color instance initialized to CSS color #9370DB
     * <span class="colorSwath" style="background: #9370DB;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.MEDIUMPURPLE = freezeObject(Color.fromCssColorString('#9370DB'));

    /**
     * An immutable Color instance initialized to CSS color #3CB371
     * <span class="colorSwath" style="background: #3CB371;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.MEDIUMSEAGREEN = freezeObject(Color.fromCssColorString('#3CB371'));

    /**
     * An immutable Color instance initialized to CSS color #7B68EE
     * <span class="colorSwath" style="background: #7B68EE;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.MEDIUMSLATEBLUE = freezeObject(Color.fromCssColorString('#7B68EE'));

    /**
     * An immutable Color instance initialized to CSS color #00FA9A
     * <span class="colorSwath" style="background: #00FA9A;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.MEDIUMSPRINGGREEN = freezeObject(Color.fromCssColorString('#00FA9A'));

    /**
     * An immutable Color instance initialized to CSS color #48D1CC
     * <span class="colorSwath" style="background: #48D1CC;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.MEDIUMTURQUOISE = freezeObject(Color.fromCssColorString('#48D1CC'));

    /**
     * An immutable Color instance initialized to CSS color #C71585
     * <span class="colorSwath" style="background: #C71585;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.MEDIUMVIOLETRED = freezeObject(Color.fromCssColorString('#C71585'));

    /**
     * An immutable Color instance initialized to CSS color #191970
     * <span class="colorSwath" style="background: #191970;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.MIDNIGHTBLUE = freezeObject(Color.fromCssColorString('#191970'));

    /**
     * An immutable Color instance initialized to CSS color #F5FFFA
     * <span class="colorSwath" style="background: #F5FFFA;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.MINTCREAM = freezeObject(Color.fromCssColorString('#F5FFFA'));

    /**
     * An immutable Color instance initialized to CSS color #FFE4E1
     * <span class="colorSwath" style="background: #FFE4E1;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.MISTYROSE = freezeObject(Color.fromCssColorString('#FFE4E1'));

    /**
     * An immutable Color instance initialized to CSS color #FFE4B5
     * <span class="colorSwath" style="background: #FFE4B5;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.MOCCASIN = freezeObject(Color.fromCssColorString('#FFE4B5'));

    /**
     * An immutable Color instance initialized to CSS color #FFDEAD
     * <span class="colorSwath" style="background: #FFDEAD;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.NAVAJOWHITE = freezeObject(Color.fromCssColorString('#FFDEAD'));

    /**
     * An immutable Color instance initialized to CSS color #000080
     * <span class="colorSwath" style="background: #000080;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.NAVY = freezeObject(Color.fromCssColorString('#000080'));

    /**
     * An immutable Color instance initialized to CSS color #FDF5E6
     * <span class="colorSwath" style="background: #FDF5E6;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.OLDLACE = freezeObject(Color.fromCssColorString('#FDF5E6'));

    /**
     * An immutable Color instance initialized to CSS color #808000
     * <span class="colorSwath" style="background: #808000;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.OLIVE = freezeObject(Color.fromCssColorString('#808000'));

    /**
     * An immutable Color instance initialized to CSS color #6B8E23
     * <span class="colorSwath" style="background: #6B8E23;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.OLIVEDRAB = freezeObject(Color.fromCssColorString('#6B8E23'));

    /**
     * An immutable Color instance initialized to CSS color #FFA500
     * <span class="colorSwath" style="background: #FFA500;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.ORANGE = freezeObject(Color.fromCssColorString('#FFA500'));

    /**
     * An immutable Color instance initialized to CSS color #FF4500
     * <span class="colorSwath" style="background: #FF4500;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.ORANGERED = freezeObject(Color.fromCssColorString('#FF4500'));

    /**
     * An immutable Color instance initialized to CSS color #DA70D6
     * <span class="colorSwath" style="background: #DA70D6;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.ORCHID = freezeObject(Color.fromCssColorString('#DA70D6'));

    /**
     * An immutable Color instance initialized to CSS color #EEE8AA
     * <span class="colorSwath" style="background: #EEE8AA;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.PALEGOLDENROD = freezeObject(Color.fromCssColorString('#EEE8AA'));

    /**
     * An immutable Color instance initialized to CSS color #98FB98
     * <span class="colorSwath" style="background: #98FB98;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.PALEGREEN = freezeObject(Color.fromCssColorString('#98FB98'));

    /**
     * An immutable Color instance initialized to CSS color #AFEEEE
     * <span class="colorSwath" style="background: #AFEEEE;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.PALETURQUOISE = freezeObject(Color.fromCssColorString('#AFEEEE'));

    /**
     * An immutable Color instance initialized to CSS color #DB7093
     * <span class="colorSwath" style="background: #DB7093;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.PALEVIOLETRED = freezeObject(Color.fromCssColorString('#DB7093'));

    /**
     * An immutable Color instance initialized to CSS color #FFEFD5
     * <span class="colorSwath" style="background: #FFEFD5;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.PAPAYAWHIP = freezeObject(Color.fromCssColorString('#FFEFD5'));

    /**
     * An immutable Color instance initialized to CSS color #FFDAB9
     * <span class="colorSwath" style="background: #FFDAB9;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.PEACHPUFF = freezeObject(Color.fromCssColorString('#FFDAB9'));

    /**
     * An immutable Color instance initialized to CSS color #CD853F
     * <span class="colorSwath" style="background: #CD853F;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.PERU = freezeObject(Color.fromCssColorString('#CD853F'));

    /**
     * An immutable Color instance initialized to CSS color #FFC0CB
     * <span class="colorSwath" style="background: #FFC0CB;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.PINK = freezeObject(Color.fromCssColorString('#FFC0CB'));

    /**
     * An immutable Color instance initialized to CSS color #DDA0DD
     * <span class="colorSwath" style="background: #DDA0DD;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.PLUM = freezeObject(Color.fromCssColorString('#DDA0DD'));

    /**
     * An immutable Color instance initialized to CSS color #B0E0E6
     * <span class="colorSwath" style="background: #B0E0E6;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.POWDERBLUE = freezeObject(Color.fromCssColorString('#B0E0E6'));

    /**
     * An immutable Color instance initialized to CSS color #800080
     * <span class="colorSwath" style="background: #800080;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.PURPLE = freezeObject(Color.fromCssColorString('#800080'));

    /**
     * An immutable Color instance initialized to CSS color #FF0000
     * <span class="colorSwath" style="background: #FF0000;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.RED = freezeObject(Color.fromCssColorString('#FF0000'));

    /**
     * An immutable Color instance initialized to CSS color #BC8F8F
     * <span class="colorSwath" style="background: #BC8F8F;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.ROSYBROWN = freezeObject(Color.fromCssColorString('#BC8F8F'));

    /**
     * An immutable Color instance initialized to CSS color #4169E1
     * <span class="colorSwath" style="background: #4169E1;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.ROYALBLUE = freezeObject(Color.fromCssColorString('#4169E1'));

    /**
     * An immutable Color instance initialized to CSS color #8B4513
     * <span class="colorSwath" style="background: #8B4513;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.SADDLEBROWN = freezeObject(Color.fromCssColorString('#8B4513'));

    /**
     * An immutable Color instance initialized to CSS color #FA8072
     * <span class="colorSwath" style="background: #FA8072;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.SALMON = freezeObject(Color.fromCssColorString('#FA8072'));

    /**
     * An immutable Color instance initialized to CSS color #F4A460
     * <span class="colorSwath" style="background: #F4A460;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.SANDYBROWN = freezeObject(Color.fromCssColorString('#F4A460'));

    /**
     * An immutable Color instance initialized to CSS color #2E8B57
     * <span class="colorSwath" style="background: #2E8B57;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.SEAGREEN = freezeObject(Color.fromCssColorString('#2E8B57'));

    /**
     * An immutable Color instance initialized to CSS color #FFF5EE
     * <span class="colorSwath" style="background: #FFF5EE;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.SEASHELL = freezeObject(Color.fromCssColorString('#FFF5EE'));

    /**
     * An immutable Color instance initialized to CSS color #A0522D
     * <span class="colorSwath" style="background: #A0522D;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.SIENNA = freezeObject(Color.fromCssColorString('#A0522D'));

    /**
     * An immutable Color instance initialized to CSS color #C0C0C0
     * <span class="colorSwath" style="background: #C0C0C0;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.SILVER = freezeObject(Color.fromCssColorString('#C0C0C0'));

    /**
     * An immutable Color instance initialized to CSS color #87CEEB
     * <span class="colorSwath" style="background: #87CEEB;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.SKYBLUE = freezeObject(Color.fromCssColorString('#87CEEB'));

    /**
     * An immutable Color instance initialized to CSS color #6A5ACD
     * <span class="colorSwath" style="background: #6A5ACD;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.SLATEBLUE = freezeObject(Color.fromCssColorString('#6A5ACD'));

    /**
     * An immutable Color instance initialized to CSS color #708090
     * <span class="colorSwath" style="background: #708090;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.SLATEGRAY = freezeObject(Color.fromCssColorString('#708090'));

    /**
     * An immutable Color instance initialized to CSS color #708090
     * <span class="colorSwath" style="background: #708090;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.SLATEGREY = Color.SLATEGRAY;

    /**
     * An immutable Color instance initialized to CSS color #FFFAFA
     * <span class="colorSwath" style="background: #FFFAFA;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.SNOW = freezeObject(Color.fromCssColorString('#FFFAFA'));

    /**
     * An immutable Color instance initialized to CSS color #00FF7F
     * <span class="colorSwath" style="background: #00FF7F;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.SPRINGGREEN = freezeObject(Color.fromCssColorString('#00FF7F'));

    /**
     * An immutable Color instance initialized to CSS color #4682B4
     * <span class="colorSwath" style="background: #4682B4;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.STEELBLUE = freezeObject(Color.fromCssColorString('#4682B4'));

    /**
     * An immutable Color instance initialized to CSS color #D2B48C
     * <span class="colorSwath" style="background: #D2B48C;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.TAN = freezeObject(Color.fromCssColorString('#D2B48C'));

    /**
     * An immutable Color instance initialized to CSS color #008080
     * <span class="colorSwath" style="background: #008080;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.TEAL = freezeObject(Color.fromCssColorString('#008080'));

    /**
     * An immutable Color instance initialized to CSS color #D8BFD8
     * <span class="colorSwath" style="background: #D8BFD8;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.THISTLE = freezeObject(Color.fromCssColorString('#D8BFD8'));

    /**
     * An immutable Color instance initialized to CSS color #FF6347
     * <span class="colorSwath" style="background: #FF6347;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.TOMATO = freezeObject(Color.fromCssColorString('#FF6347'));

    /**
     * An immutable Color instance initialized to CSS color #40E0D0
     * <span class="colorSwath" style="background: #40E0D0;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.TURQUOISE = freezeObject(Color.fromCssColorString('#40E0D0'));

    /**
     * An immutable Color instance initialized to CSS color #EE82EE
     * <span class="colorSwath" style="background: #EE82EE;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.VIOLET = freezeObject(Color.fromCssColorString('#EE82EE'));

    /**
     * An immutable Color instance initialized to CSS color #F5DEB3
     * <span class="colorSwath" style="background: #F5DEB3;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.WHEAT = freezeObject(Color.fromCssColorString('#F5DEB3'));

    /**
     * An immutable Color instance initialized to CSS color #FFFFFF
     * <span class="colorSwath" style="background: #FFFFFF;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.WHITE = freezeObject(Color.fromCssColorString('#FFFFFF'));

    /**
     * An immutable Color instance initialized to CSS color #F5F5F5
     * <span class="colorSwath" style="background: #F5F5F5;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.WHITESMOKE = freezeObject(Color.fromCssColorString('#F5F5F5'));

    /**
     * An immutable Color instance initialized to CSS color #FFFF00
     * <span class="colorSwath" style="background: #FFFF00;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.YELLOW = freezeObject(Color.fromCssColorString('#FFFF00'));

    /**
     * An immutable Color instance initialized to CSS color #9ACD32
     * <span class="colorSwath" style="background: #9ACD32;"></span>
     *
     * @constant
     * @type {Color}
     */
    Color.YELLOWGREEN = freezeObject(Color.fromCssColorString('#9ACD32'));

    return Color;
});

/*global define*/
define('Core/EncodedCartesian3',[
        './Cartesian3',
        './defined',
        './DeveloperError'
    ], function(
        Cartesian3,
        defined,
        DeveloperError) {
    "use strict";

    /**
     * A fixed-point encoding of a {@link Cartesian3} with 64-bit floating-point components, as two {@link Cartesian3}
     * values that, when converted to 32-bit floating-point and added, approximate the original input.
     * <p>
     * This is used to encode positions in vertex buffers for rendering without jittering artifacts
     * as described in <a href="http://blogs.agi.com/insight3d/index.php/2008/09/03/precisions-precisions/">Precisions, Precisions</a>.
     * </p>
     *
     * @alias EncodedCartesian3
     * @constructor
     *
     * @see czm_modelViewRelativeToEye
     * @see czm_modelViewProjectionRelativeToEye
     */
    var EncodedCartesian3 = function() {
        /**
         * The high bits for each component.  Bits 0 to 22 store the whole value.  Bits 23 to 31 are not used.
         * <p>
         * The default is {@link Cartesian3.ZERO}.
         * </p>
         *
         * @type {Cartesian3}
         * @default {@link Cartesian3.ZERO}
         */
        this.high = Cartesian3.clone(Cartesian3.ZERO);

        /**
         * The low bits for each component.  Bits 7 to 22 store the whole value, and bits 0 to 6 store the fraction.  Bits 23 to 31 are not used.
         * <p>
         * The default is {@link Cartesian3.ZERO}.
         * </p>
         *
         * @type {Cartesian3}
         * @default {@link Cartesian3.ZERO}
         */
        this.low = Cartesian3.clone(Cartesian3.ZERO);
    };

    /**
     * Encodes a 64-bit floating-point value as two floating-point values that, when converted to
     * 32-bit floating-point and added, approximate the original input.  The returned object
     * has <code>high</code> and <code>low</code> properties for the high and low bits, respectively.
     * <p>
     * The fixed-point encoding follows <a href="http://blogs.agi.com/insight3d/index.php/2008/09/03/precisions-precisions/">Precisions, Precisions</a>.
     * </p>
     * @memberof EncodedCartesian3
     *
     * @param {Number} value The floating-point value to encode.
     * @param {Object} [result] The object onto which to store the result.
     *
     * @returns {Object} The modified result parameter or a new instance if one was not provided.
     *
     * @exception {DeveloperError} value is required.
     *
     * @example
     * var value = 1234567.1234567;
     * var splitValue = EncodedCartesian3.encode(value);
     */
    EncodedCartesian3.encode = function(value, result) {
        if (!defined(value)) {
            throw new DeveloperError('value is required');
        }

        if (!defined(result)) {
            result = {
                high : 0.0,
                low : 0.0
            };
        }

        var doubleHigh;
        if (value >= 0.0) {
            doubleHigh = Math.floor(value / 65536.0) * 65536.0;
            result.high = doubleHigh;
            result.low = value - doubleHigh;
        } else {
            doubleHigh = Math.floor(-value / 65536.0) * 65536.0;
            result.high = -doubleHigh;
            result.low = value + doubleHigh;
        }

        return result;
    };

    var scratchEncode = {
        high : 0.0,
        low : 0.0
    };

    /**
     * Encodes a {@link Cartesian3} with 64-bit floating-point components as two {@link Cartesian3}
     * values that, when converted to 32-bit floating-point and added, approximate the original input.
     * <p>
     * The fixed-point encoding follows <a href="http://blogs.agi.com/insight3d/index.php/2008/09/03/precisions-precisions/">Precisions, Precisions</a>.
     * </p>
     * @memberof EncodedCartesian3
     *
     * @param {Cartesian3} cartesian The cartesian to encode.
     * @param {EncodedCartesian3} [result] The object onto which to store the result.
     * @returns {EncodedCartesian3} The modified result parameter or a new EncodedCartesian3 instance if one was not provided.
     *
     * @exception {DeveloperError} cartesian is required.
     *
     * @example
     * var cart = new Cartesian3(-10000000.0, 0.0, 10000000.0);
     * var encoded = EncodedCartesian3.fromCartesian(cart);
     */
    EncodedCartesian3.fromCartesian = function(cartesian, result) {
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required');
        }

        if (!defined(result)) {
            result = new EncodedCartesian3();
        }

        var high = result.high;
        var low = result.low;

        EncodedCartesian3.encode(cartesian.x, scratchEncode);
        high.x = scratchEncode.high;
        low.x = scratchEncode.low;

        EncodedCartesian3.encode(cartesian.y, scratchEncode);
        high.y = scratchEncode.high;
        low.y = scratchEncode.low;

        EncodedCartesian3.encode(cartesian.z, scratchEncode);
        high.z = scratchEncode.high;
        low.z = scratchEncode.low;

        return result;
    };

    var encodedP = new EncodedCartesian3();

    /**
     * Encodes the provided <code>cartesian</code>, and writes it to an array with <code>high</code>
     * components followed by <code>low</code> components, i.e. <code>[high.x, high.y, high.z, low.x, low.y, low.z]</code>.
     * <p>
     * This is used to create interleaved high-precision position vertex attributes.
     * </p>
     *
     * @param {Cartesian3} cartesian The cartesian to encode.
     * @param {Array} cartesianArray The array to write to.
     * @param {Number} index The index into the array to start writing.  Six elements will be written.
     *
     * @exception {DeveloperError} cartesian is required.
     * @exception {DeveloperError} cartesianArray is required.
     * @exception {DeveloperError} index must be a number greater than or equal to 0.
     *
     * @example
     * var positions = [
     *    new Cartesian3(),
     *    // ...
     * ];
     * var encodedPositions = new Float32Array(2 * 3 * positions.length);
     * var j = 0;
     * for (var i = 0; i < positions.length; ++i) {
     *   EncodedCartesian3.writeElement(positions[i], encodedPositions, j);
     *   j += 6;
     * }
     */
    EncodedCartesian3.writeElements = function(cartesian, cartesianArray, index) {
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required');
        }

        if (!defined(cartesianArray)) {
            throw new DeveloperError('cartesianArray is required');
        }

        if (typeof index !== 'number' || index < 0) {
            throw new DeveloperError('index must be a number greater than or equal to 0.');
        }

        EncodedCartesian3.fromCartesian(cartesian, encodedP);
        var high = encodedP.high;
        var low = encodedP.low;

        cartesianArray[index] = high.x;
        cartesianArray[index + 1] = high.y;
        cartesianArray[index + 2] = high.z;
        cartesianArray[index + 3] = low.x;
        cartesianArray[index + 4] = low.y;
        cartesianArray[index + 5] = low.z;
    };

    return EncodedCartesian3;
});

/*global define*/
define('Core/Tipsify',[
        './defaultValue',
        './defined',
        './DeveloperError'
    ], function(
        defaultValue,
        defined,
        DeveloperError) {
    "use strict";

    /**
     * Encapsulates an algorithm to optimize triangles for the post
     * vertex-shader cache.  This is based on the 2007 SIGGRAPH paper
     * 'Fast Triangle Reordering for Vertex Locality and Reduced Overdraw.'
     * The runtime is linear but several passes are made.
     *
     * @exports Tipsify
     *
     * @see <a href='http://gfx.cs.princeton.edu/pubs/Sander_2007_%3ETR/tipsy.pdf'>
     * Fast Triangle Reordering for Vertex Locality and Reduced Overdraw</a>
     * by Sander, Nehab, and Barczak
     */
    var Tipsify = {};

    /**
     * Calculates the average cache miss ratio (ACMR) for a given set of indices.
     *
     * @param {Array} description.indices Lists triads of numbers corresponding to the indices of the vertices
     *                        in the vertex buffer that define the geometry's triangles.
     * @param {Number} [description.maximumIndex] The maximum value of the elements in <code>args.indices</code>.
     *                                     If not supplied, this value will be computed.
     * @param {Number} [description.cacheSize=24] The number of vertices that can be stored in the cache at any one time.
     *
     * @exception {DeveloperError} indices is required.
     * @exception {DeveloperError} indices length must be a multiple of three.
     * @exception {DeveloperError} cacheSize must be greater than two.
     *
     * @returns {Number} The average cache miss ratio (ACMR).
     *
     * @example
     * var indices = [0, 1, 2, 3, 4, 5];
     * var maxIndex = 5;
     * var cacheSize = 3;
     * var acmr = Tipsify.calculateACMR({indices : indices, maxIndex : maxIndex, cacheSize : cacheSize});
     */
    Tipsify.calculateACMR = function(description) {
        description = defaultValue(description, defaultValue.EMPTY_OBJECT);
        var indices = description.indices;
        var maximumIndex = description.maximumIndex;
        var cacheSize = defaultValue(description.cacheSize, 24);

        if (!defined(indices)) {
            throw new DeveloperError('indices is required.');
        }

        var numIndices = indices.length;

        if (numIndices < 3 || numIndices % 3 !== 0) {
            throw new DeveloperError('indices length must be a multiple of three.');
        }
        if (maximumIndex <= 0) {
            throw new DeveloperError('maximumIndex must be greater than zero.');
        }
        if (cacheSize < 3) {
            throw new DeveloperError('cacheSize must be greater than two.');
        }

        // Compute the maximumIndex if not given
        if (!defined(maximumIndex)) {
            maximumIndex = 0;
            var currentIndex = 0;
            var intoIndices = indices[currentIndex];
            while (currentIndex < numIndices) {
                if (intoIndices > maximumIndex) {
                    maximumIndex = intoIndices;
                }
                ++currentIndex;
                intoIndices = indices[currentIndex];
            }
        }

        // Vertex time stamps
        var vertexTimeStamps = [];
        for ( var i = 0; i < maximumIndex + 1; i++) {
            vertexTimeStamps[i] = 0;
        }

        // Cache processing
        var s = cacheSize + 1;
        for ( var j = 0; j < numIndices; ++j) {
            if ((s - vertexTimeStamps[indices[j]]) > cacheSize) {
                vertexTimeStamps[indices[j]] = s;
                ++s;
            }
        }

        return (s - cacheSize + 1) / (numIndices / 3);
    };

    /**
     * Optimizes triangles for the post-vertex shader cache.
     *
     * @param {Array} description.indices Lists triads of numbers corresponding to the indices of the vertices
     *                        in the vertex buffer that define the geometry's triangles.
     * @param {Number} [description.maximumIndex] The maximum value of the elements in <code>args.indices</code>.
     *                                     If not supplied, this value will be computed.
     * @param {Number} [description.cacheSize=24] The number of vertices that can be stored in the cache at any one time.
     *
     * @exception {DeveloperError} indices is required.
     * @exception {DeveloperError} indices length must be a multiple of three.
     * @exception {DeveloperError} cacheSize must be greater than two.
     *
     * @returns {Array} A list of the input indices in an optimized order.
     *
     * @example
     * var indices = [0, 1, 2, 3, 4, 5];
     * var maxIndex = 5;
     * var cacheSize = 3;
     * var reorderedIndices = Tipsify.tipsify({indices : indices, maxIndex : maxIndex, cacheSize : cacheSize});
     */
    Tipsify.tipsify = function(description) {
        description = defaultValue(description, defaultValue.EMPTY_OBJECT);
        var indices = description.indices;
        var maximumIndex = description.maximumIndex;
        var cacheSize = defaultValue(description.cacheSize, 24);

        var cursor;

        function skipDeadEnd(vertices, deadEnd, indices, maximumIndexPlusOne) {
            while (deadEnd.length >= 1) {
                // while the stack is not empty
                var d = deadEnd[deadEnd.length - 1]; // top of the stack
                deadEnd.splice(deadEnd.length - 1, 1); // pop the stack

                if (vertices[d].numLiveTriangles > 0) {
                    return d;
                }
            }

            while (cursor < maximumIndexPlusOne) {
                if (vertices[cursor].numLiveTriangles > 0) {
                    ++cursor;
                    return cursor - 1;
                }
                ++cursor;
            }
            return -1;
        }

        function getNextVertex(indices, cacheSize, oneRing, vertices, s, deadEnd, maximumIndexPlusOne) {
            var n = -1;
            var p;
            var m = -1;
            var itOneRing = 0;
            while (itOneRing < oneRing.length) {
                var index = oneRing[itOneRing];
                if (vertices[index].numLiveTriangles) {
                    p = 0;
                    if ((s - vertices[index].timeStamp + (2 * vertices[index].numLiveTriangles)) <= cacheSize) {
                        p = s - vertices[index].timeStamp;
                    }
                    if ((p > m) || (m === -1)) {
                        m = p;
                        n = index;
                    }
                }
                ++itOneRing;
            }
            if (n === -1) {
                return skipDeadEnd(vertices, deadEnd, indices, maximumIndexPlusOne);
            }
            return n;
        }

        if (!defined(indices)) {
            throw new DeveloperError('indices is required.');
        }
        var numIndices = indices.length;

        if (numIndices < 3 || numIndices % 3 !== 0) {
            throw new DeveloperError('indices length must be a multiple of three.');
        }
        if (maximumIndex <= 0) {
            throw new DeveloperError('maximumIndex must be greater than zero.');
        }
        if (cacheSize < 3) {
            throw new DeveloperError('cacheSize must be greater than two.');
        }

        // Determine maximum index
        var maximumIndexPlusOne = 0;
        var currentIndex = 0;
        var intoIndices = indices[currentIndex];
        var endIndex = numIndices;
        if (defined(maximumIndex)) {
            maximumIndexPlusOne = maximumIndex + 1;
        } else {
            while (currentIndex < endIndex) {
                if (intoIndices > maximumIndexPlusOne) {
                    maximumIndexPlusOne = intoIndices;
                }
                ++currentIndex;
                intoIndices = indices[currentIndex];
            }
            if (maximumIndexPlusOne === -1) {
                return 0;
            }
            ++maximumIndexPlusOne;
        }

        // Vertices
        var vertices = [];
        for ( var i = 0; i < maximumIndexPlusOne; i++) {
            vertices[i] = {
                numLiveTriangles : 0,
                timeStamp : 0,
                vertexTriangles : []
            };
        }
        currentIndex = 0;
        var triangle = 0;
        while (currentIndex < endIndex) {
            vertices[indices[currentIndex]].vertexTriangles.push(triangle);
            ++(vertices[indices[currentIndex]]).numLiveTriangles;
            vertices[indices[currentIndex + 1]].vertexTriangles.push(triangle);
            ++(vertices[indices[currentIndex + 1]]).numLiveTriangles;
            vertices[indices[currentIndex + 2]].vertexTriangles.push(triangle);
            ++(vertices[indices[currentIndex + 2]]).numLiveTriangles;
            ++triangle;
            currentIndex += 3;
        }

        // Starting index
        var f = 0;

        // Time Stamp
        var s = cacheSize + 1;
        cursor = 1;

        // Process
        var oneRing = [];
        var deadEnd = []; //Stack
        var vertex;
        var intoVertices;
        var currentOutputIndex = 0;
        var outputIndices = [];
        var numTriangles = numIndices / 3;
        var triangleEmitted = [];
        for (i = 0; i < numTriangles; i++) {
            triangleEmitted[i] = false;
        }
        var index;
        var limit;
        while (f !== -1) {
            oneRing = [];
            intoVertices = vertices[f];
            limit = intoVertices.vertexTriangles.length;
            for ( var k = 0; k < limit; ++k) {
                triangle = intoVertices.vertexTriangles[k];
                if (!triangleEmitted[triangle]) {
                    triangleEmitted[triangle] = true;
                    currentIndex = triangle + triangle + triangle;
                    for ( var j = 0; j < 3; ++j) {
                        // Set this index as a possible next index
                        index = indices[currentIndex];
                        oneRing.push(index);
                        deadEnd.push(index);

                        // Output index
                        outputIndices[currentOutputIndex] = index;
                        ++currentOutputIndex;

                        // Cache processing
                        vertex = vertices[index];
                        --vertex.numLiveTriangles;
                        if ((s - vertex.timeStamp) > cacheSize) {
                            vertex.timeStamp = s;
                            ++s;
                        }
                        ++currentIndex;
                    }
                }
            }
            f = getNextVertex(indices, cacheSize, oneRing, vertices, s, deadEnd, maximumIndexPlusOne);
        }

        return outputIndices;
    };

    return Tipsify;
});

/*global define*/
define('Core/GeometryPipeline',[
        './barycentricCoordinates',
        './defaultValue',
        './defined',
        './DeveloperError',
        './Cartesian2',
        './Cartesian3',
        './Cartesian4',
        './Cartographic',
        './EncodedCartesian3',
        './Intersect',
        './IntersectionTests',
        './Math',
        './Matrix3',
        './Matrix4',
        './Plane',
        './GeographicProjection',
        './ComponentDatatype',
        './IndexDatatype',
        './PrimitiveType',
        './Tipsify',
        './BoundingSphere',
        './Geometry',
        './GeometryAttribute'
    ], function(
        barycentricCoordinates,
        defaultValue,
        defined,
        DeveloperError,
        Cartesian2,
        Cartesian3,
        Cartesian4,
        Cartographic,
        EncodedCartesian3,
        Intersect,
        IntersectionTests,
        CesiumMath,
        Matrix3,
        Matrix4,
        Plane,
        GeographicProjection,
        ComponentDatatype,
        IndexDatatype,
        PrimitiveType,
        Tipsify,
        BoundingSphere,
        Geometry,
        GeometryAttribute) {
    "use strict";

    /**
     * Content pipeline functions for geometries.
     *
     * @exports GeometryPipeline
     *
     * @see Geometry
     * @see Context#createVertexArrayFromGeometry
     */
    var GeometryPipeline = {};

    function addTriangle(lines, index, i0, i1, i2) {
        lines[index++] = i0;
        lines[index++] = i1;

        lines[index++] = i1;
        lines[index++] = i2;

        lines[index++] = i2;
        lines[index] = i0;
    }

    function trianglesToLines(triangles) {
        var count = triangles.length;
        var size = (count / 3) * 6;
        var lines = IndexDatatype.createTypedArray(count, size);

        var index = 0;
        for ( var i = 0; i < count; i += 3, index += 6) {
            addTriangle(lines, index, triangles[i], triangles[i + 1], triangles[i + 2]);
        }

        return lines;
    }

    function triangleStripToLines(triangles) {
        var count = triangles.length;
        if (count >= 3) {
            var size = (count - 2) * 6;
            var lines = IndexDatatype.createTypedArray(count, size);

            addTriangle(lines, 0, triangles[0], triangles[1], triangles[2]);
            var index = 6;

            for ( var i = 3; i < count; ++i, index += 6) {
                addTriangle(lines, index, triangles[i - 1], triangles[i], triangles[i - 2]);
            }

            return lines;
        }

        return new Uint16Array();
    }

    function triangleFanToLines(triangles) {
        if (triangles.length > 0) {
            var count = triangles.length - 1;
            var size = (count - 1) * 6;
            var lines = IndexDatatype.createTypedArray(count, size);

            var base = triangles[0];
            var index = 0;
            for ( var i = 1; i < count; ++i, index += 6) {
                addTriangle(lines, index, base, triangles[i], triangles[i + 1]);
            }

            return lines;
        }

        return new Uint16Array();
    }

    /**
     * Converts a geometry's triangle indices to line indices.  If the geometry has an <code>indices</code>
     * and its <code>primitiveType</code> is <code>TRIANGLES</code>, <code>TRIANGLE_STRIP</code>,
     * <code>TRIANGLE_FAN</code>, it is converted to <code>LINES</code>; otherwise, the geometry is not changed.
     * <p>
     * This is commonly used to create a wireframe geometry for visual debugging.
     * </p>
     *
     * @param {Geometry} geometry The geometry to modify.
     *
     * @returns {Geometry} The modified <code>geometry</code> argument, with its triangle indices converted to lines.
     *
     * @exception {DeveloperError} geometry is required.
     * @exception {DeveloperError} geometry.primitiveType must be TRIANGLES, TRIANGLE_STRIP, or TRIANGLE_FAN.
     *
     * @example
     * geometry = GeometryPipeline.toWireframe(geometry);
     */
    GeometryPipeline.toWireframe = function(geometry) {
        if (!defined(geometry)) {
            throw new DeveloperError('geometry is required.');
        }

        var indices = geometry.indices;
        if (defined(indices)) {
            switch (geometry.primitiveType.value) {
                case PrimitiveType.TRIANGLES.value:
                    geometry.indices = trianglesToLines(indices);
                    break;
                case PrimitiveType.TRIANGLE_STRIP.value:
                    geometry.indices = triangleStripToLines(indices);
                    break;
                case PrimitiveType.TRIANGLE_FAN.value:
                    geometry.indices = triangleFanToLines(indices);
                    break;
                default:
                    throw new DeveloperError('geometry.primitiveType must be TRIANGLES, TRIANGLE_STRIP, or TRIANGLE_FAN.');
            }

            geometry.primitiveType = PrimitiveType.LINES;
        }

        return geometry;
    };

    /**
     * Creates a new {@link Geometry} with <code>LINES</code> representing the provided
     * attribute (<code>attributeName</code>) for the provided geometry.  This is used to
     * visualize vector attributes like normals, binormals, and tangents.
     *
     * @param {Geometry} geometry The <code>Geometry</code> instance with the attribute.
     * @param {String} [attributeName='normal'] The name of the attribute.
     * @param {Number} [length=10000.0] The length of each line segment in meters.  This can be negative to point the vector in the opposite direction.
     *
     * @returns {Geometry} A new <code>Geometry<code> instance with line segments for the vector.
     *
     * @exception {DeveloperError} geometry is required.
     * @exception {DeveloperError} geometry.attributes.position is required.
     * @exception {DeveloperError} geometry.attributes must have an attribute with the same name as the attributeName parameter.
     *
     * @example
     * var geometry = GeometryPipeline.createLineSegmentsForVectors(instance.geometry, 'binormal', 100000.0),
     */
    GeometryPipeline.createLineSegmentsForVectors = function(geometry, attributeName, length) {
        if (!defined(geometry)) {
            throw new DeveloperError('geometry is required.');
        }

        if (!defined(geometry.attributes.position)) {
            throw new DeveloperError('geometry.attributes.position is required.');
        }

        attributeName = defaultValue(attributeName, 'normal');

        if (!defined(geometry.attributes[attributeName])) {
            throw new DeveloperError('geometry.attributes must have an attribute with the same name as the attributeName parameter, ' + attributeName + '.');
        }

        length = defaultValue(length, 10000.0);

        var positions = geometry.attributes.position.values;
        var vectors = geometry.attributes[attributeName].values;
        var positionsLength = positions.length;

        var newPositions = new Float64Array(2 * positionsLength);

        var j = 0;
        for (var i = 0; i < positionsLength; i += 3) {
            newPositions[j++] = positions[i];
            newPositions[j++] = positions[i + 1];
            newPositions[j++] = positions[i + 2];

            newPositions[j++] = positions[i] + (vectors[i] * length);
            newPositions[j++] = positions[i + 1] + (vectors[i + 1] * length);
            newPositions[j++] = positions[i + 2] + (vectors[i + 2] * length);
        }

        var newBoundingSphere;
        var bs = geometry.boundingSphere;
        if (defined(bs)) {
            newBoundingSphere = new BoundingSphere(bs.center, bs.radius + length);
        }

        return new Geometry({
            attributes : {
                position : new GeometryAttribute({
                    componentDatatype : ComponentDatatype.DOUBLE,
                    componentsPerAttribute : 3,
                    values : newPositions
                })
            },
            primitiveType : PrimitiveType.LINES,
            boundingSphere : newBoundingSphere
        });
    };

    /**
     * Creates an object that maps attribute names to unique indices for matching
     * vertex attributes and shader programs.
     *
     * @param {Geometry} geometry The geometry, which is not modified, to create the object for.
     *
     * @returns {Object} An object with attribute name / index pairs.
     *
     * @exception {DeveloperError} geometry is required.
     *
     * @example
     * var attributeIndices = GeometryPipeline.createAttributeIndices(geometry);
     * // Example output
     * // {
     * //   'position' : 0,
     * //   'normal' : 1
     * // }
     *
     * @see Context#createVertexArrayFromGeometry
     * @see ShaderCache
     */
    GeometryPipeline.createAttributeIndices = function(geometry) {
        if (!defined(geometry)) {
            throw new DeveloperError('geometry is required.');
        }

        // There can be a WebGL performance hit when attribute 0 is disabled, so
        // assign attribute locations to well-known attributes.
        var semantics = [
            'position',
            'positionHigh',
            'positionLow',

            // From VertexFormat.position - after 2D projection and high-precision encoding
            'position3DHigh',
            'position3DLow',
            'position2DHigh',
            'position2DLow',

            // From Primitive
            'pickColor',

            // From VertexFormat
            'normal',
            'st',
            'binormal',
            'tangent'
        ];

        var attributes = geometry.attributes;
        var indices = {};
        var j = 0;
        var i;
        var len = semantics.length;

        // Attribute locations for well-known attributes
        for (i = 0; i < len; ++i) {
            var semantic = semantics[i];

            if (defined(attributes[semantic])) {
                indices[semantic] = j++;
            }
        }

        // Locations for custom attributes
        for (var name in attributes) {
            if (attributes.hasOwnProperty(name) && (!defined(indices[name]))) {
                indices[name] = j++;
            }
        }

        return indices;
    };

    /**
     * Reorders a geometry's attributes and <code>indices</code> to achieve better performance from the GPU's pre-vertex-shader cache.
     *
     * @param {Geometry} geometry The geometry to modify.
     *
     * @returns {Geometry} The modified <code>geometry</code> argument, with its attributes and indices reordered for the GPU's pre-vertex-shader cache.
     *
     * @exception {DeveloperError} geometry is required.
     * @exception {DeveloperError} Each attribute array in geometry.attributes must have the same number of attributes.
     *
     * @example
     * geometry = GeometryPipeline.reorderForPreVertexCache(geometry);
     *
     * @see GeometryPipeline.reorderForPostVertexCache
     */
    GeometryPipeline.reorderForPreVertexCache = function(geometry) {
        if (!defined(geometry)) {
            throw new DeveloperError('geometry is required.');
        }

        var numVertices = Geometry.computeNumberOfVertices(geometry);

        var indices = geometry.indices;
        if (defined(indices)) {
            var indexCrossReferenceOldToNew = new Int32Array(numVertices);
            for ( var i = 0; i < numVertices; i++) {
                indexCrossReferenceOldToNew[i] = -1;
            }

            // Construct cross reference and reorder indices
            var indicesIn = indices;
            var numIndices = indicesIn.length;
            var indicesOut = IndexDatatype.createTypedArray(numVertices, numIndices);

            var intoIndicesIn = 0;
            var intoIndicesOut = 0;
            var nextIndex = 0;
            var tempIndex;
            while (intoIndicesIn < numIndices) {
                tempIndex = indexCrossReferenceOldToNew[indicesIn[intoIndicesIn]];
                if (tempIndex !== -1) {
                    indicesOut[intoIndicesOut] = tempIndex;
                } else {
                    tempIndex = indicesIn[intoIndicesIn];
                    indexCrossReferenceOldToNew[tempIndex] = nextIndex;

                    indicesOut[intoIndicesOut] = nextIndex;
                    ++nextIndex;
                }
                ++intoIndicesIn;
                ++intoIndicesOut;
            }
            geometry.indices = indicesOut;

            // Reorder attributes
            var attributes = geometry.attributes;
            for ( var property in attributes) {
                if (attributes.hasOwnProperty(property) &&
                        defined(attributes[property]) &&
                        defined(attributes[property].values)) {

                    var attribute = attributes[property];
                    var elementsIn = attribute.values;
                    var intoElementsIn = 0;
                    var numComponents = attribute.componentsPerAttribute;
                    var elementsOut = ComponentDatatype.createTypedArray(attribute.componentDatatype, elementsIn.length);
                    while (intoElementsIn < numVertices) {
                        var temp = indexCrossReferenceOldToNew[intoElementsIn];
                        for (i = 0; i < numComponents; i++) {
                            elementsOut[numComponents * temp + i] = elementsIn[numComponents * intoElementsIn + i];
                        }
                        ++intoElementsIn;
                    }
                    attribute.values = elementsOut;
                }
            }
        }

        return geometry;
    };

    /**
     * Reorders a geometry's <code>indices</code> to achieve better performance from the GPU's
     * post vertex-shader cache by using the Tipsify algorithm.  If the geometry <code>primitiveType</code>
     * is not <code>TRIANGLES</code> or the geometry does not have an <code>indices</code>, this function has no effect.
     *
     * @param {Geometry} geometry The geometry to modify.
     * @param {Number} [cacheCapacity=24] The number of vertices that can be held in the GPU's vertex cache.
     *
     * @returns {Geometry} The modified <code>geometry</code> argument, with its indices reordered for the post-vertex-shader cache.
     *
     * @exception {DeveloperError} geometry is required.
     * @exception {DeveloperError} cacheCapacity must be greater than two.
     *
     * @example
     * geometry = GeometryPipeline.reorderForPostVertexCache(geometry);
     *
     * @see GeometryPipeline.reorderForPreVertexCache
     * @see <a href='http://gfx.cs.princeton.edu/pubs/Sander_2007_%3ETR/tipsy.pdf'>
     * Fast Triangle Reordering for Vertex Locality and Reduced Overdraw</a>
     * by Sander, Nehab, and Barczak
     */
    GeometryPipeline.reorderForPostVertexCache = function(geometry, cacheCapacity) {
        if (!defined(geometry)) {
            throw new DeveloperError('geometry is required.');
        }

        var indices = geometry.indices;
        if ((geometry.primitiveType.value === PrimitiveType.TRIANGLES.value) && (defined(indices))) {
            var numIndices = indices.length;
            var maximumIndex = 0;
            for ( var j = 0; j < numIndices; j++) {
                if (indices[j] > maximumIndex) {
                    maximumIndex = indices[j];
                }
            }
            geometry.indices = Tipsify.tipsify({
                indices : indices,
                maximumIndex : maximumIndex,
                cacheSize : cacheCapacity
            });
        }

        return geometry;
    };

    function copyAttributesDescriptions(attributes) {
        var newAttributes = {};

        for ( var attribute in attributes) {
            if (attributes.hasOwnProperty(attribute) &&
                    defined(attributes[attribute]) &&
                    defined(attributes[attribute].values)) {

                var attr = attributes[attribute];
                newAttributes[attribute] = new GeometryAttribute({
                    componentDatatype : attr.componentDatatype,
                    componentsPerAttribute : attr.componentsPerAttribute,
                    normalize : attr.normalize,
                    values : []
                });
            }
        }

        return newAttributes;
    }

    function copyVertex(destinationAttributes, sourceAttributes, index) {
        for ( var attribute in sourceAttributes) {
            if (sourceAttributes.hasOwnProperty(attribute) &&
                    defined(sourceAttributes[attribute]) &&
                    defined(sourceAttributes[attribute].values)) {

                var attr = sourceAttributes[attribute];

                for ( var k = 0; k < attr.componentsPerAttribute; ++k) {
                    destinationAttributes[attribute].values.push(attr.values[(index * attr.componentsPerAttribute) + k]);
                }
            }
        }
    }

    /**
     * Splits a geometry into multiple geometries, if necessary, to ensure that indices in the
     * <code>indices</code> fit into unsigned shorts.  This is used to meet the WebGL requirements
     * when {@link Context#getElementIndexUint} is <code>false</code>.
     * <p>
     * If the geometry does not have any <code>indices</code>, this function has no effect.
     * </p>
     *
     * @param {Geometry} geometry The geometry to be split into multiple geometries.
     *
     * @returns {Array} An array of geometries, each with indices that fit into unsigned shorts.
     *
     * @exception {DeveloperError} geometry is required.
     * @exception {DeveloperError} geometry.primitiveType must equal to PrimitiveType.TRIANGLES, PrimitiveType.LINES, or PrimitiveType.POINTS
     * @exception {DeveloperError} All geometry attribute lists must have the same number of attributes.
     *
     * @example
     * var geometries = GeometryPipeline.fitToUnsignedShortIndices(geometry);
     */
    GeometryPipeline.fitToUnsignedShortIndices = function(geometry) {
        if (!defined(geometry)) {
            throw new DeveloperError('geometry is required.');
        }

        if ((defined(geometry.indices)) &&
            ((geometry.primitiveType.value !== PrimitiveType.TRIANGLES.value) &&
             (geometry.primitiveType.value !== PrimitiveType.LINES.value) &&
             (geometry.primitiveType.value !== PrimitiveType.POINTS.value))) {
            throw new DeveloperError('geometry.primitiveType must equal to PrimitiveType.TRIANGLES, PrimitiveType.LINES, or PrimitiveType.POINTS.');
        }

        var geometries = [];

        // If there's an index list and more than 64K attributes, it is possible that
        // some indices are outside the range of unsigned short [0, 64K - 1]
        var numberOfVertices = Geometry.computeNumberOfVertices(geometry);
        if (defined(geometry.indices) && (numberOfVertices > CesiumMath.SIXTY_FOUR_KILOBYTES)) {
            var oldToNewIndex = [];
            var newIndices = [];
            var currentIndex = 0;
            var newAttributes = copyAttributesDescriptions(geometry.attributes);

            var originalIndices = geometry.indices;
            var numberOfIndices = originalIndices.length;

            var indicesPerPrimitive;

            if (geometry.primitiveType.value === PrimitiveType.TRIANGLES.value) {
                indicesPerPrimitive = 3;
            } else if (geometry.primitiveType.value === PrimitiveType.LINES.value) {
                indicesPerPrimitive = 2;
            } else if (geometry.primitiveType.value === PrimitiveType.POINTS.value) {
                indicesPerPrimitive = 1;
            }

            for ( var j = 0; j < numberOfIndices; j += indicesPerPrimitive) {
                for (var k = 0; k < indicesPerPrimitive; ++k) {
                    var x = originalIndices[j + k];
                    var i = oldToNewIndex[x];
                    if (!defined(i)) {
                        i = currentIndex++;
                        oldToNewIndex[x] = i;
                        copyVertex(newAttributes, geometry.attributes, x);
                    }
                    newIndices.push(i);
                }

                if (currentIndex + indicesPerPrimitive > CesiumMath.SIXTY_FOUR_KILOBYTES) {
                    geometries.push(new Geometry({
                        attributes : newAttributes,
                        indices : newIndices,
                        primitiveType : geometry.primitiveType,
                        boundingSphere : geometry.boundingSphere
                    }));

                    // Reset for next vertex-array
                    oldToNewIndex = [];
                    newIndices = [];
                    currentIndex = 0;
                    newAttributes = copyAttributesDescriptions(geometry.attributes);
                }
            }

            if (newIndices.length !== 0) {
                geometries.push(new Geometry({
                    attributes : newAttributes,
                    indices : newIndices,
                    primitiveType : geometry.primitiveType,
                    boundingSphere : geometry.boundingSphere
                }));
            }
        } else {
            // No need to split into multiple geometries
            geometries.push(geometry);
        }

        return geometries;
    };

    var scratchProjectTo2DCartesian3 = new Cartesian3();
    var scratchProjectTo2DCartographic = new Cartographic();

    /**
     * Projects a geometry's 3D <code>position</code> attribute to 2D, replacing the <code>position</code>
     * attribute with separate <code>position3D</code> and <code>position2D</code> attributes.
     * <p>
     * If the geometry does not have a <code>position</code>, this function has no effect.
     * </p>
     *
     * @param {Geometry} geometry The geometry to modify.
     * @param {String} attributeName The name of the attribute.
     * @param {String} attributeName3D The name of the attribute in 3D.
     * @param {String} attributeName2D The name of the attribute in 2D.
     * @param {Object} [projection=new GeographicProjection()] The projection to use.
     *
     * @returns {Geometry} The modified <code>geometry</code> argument with <code>position3D</code> and <code>position2D</code> attributes.
     *
     * @exception {DeveloperError} geometry is required.
     * @exception {DeveloperError} attributeName is required.
     * @exception {DeveloperError} attributeName3D is required.
     * @exception {DeveloperError} attributeName2D is required.
     * @exception {DeveloperError} geometry must have attribute matching the attributeName argument.
     * @exception {DeveloperError} The attribute componentDatatype must be ComponentDatatype.DOUBLE.
     *
     * @example
     * geometry = GeometryPipeline.projectTo2D(geometry, 'position', 'position3D', 'position2D');
     */
    GeometryPipeline.projectTo2D = function(geometry, attributeName, attributeName3D, attributeName2D, projection) {
        if (!defined(geometry)) {
            throw new DeveloperError('geometry is required.');
        }

        if (!defined(attributeName)) {
            throw new DeveloperError('attributeName is required.');
        }

        if (!defined(attributeName3D)) {
            throw new DeveloperError('attributeName3D is required.');
        }

        if (!defined(attributeName2D)) {
            throw new DeveloperError('attributeName2D is required.');
        }

        var attribute = geometry.attributes[attributeName];
        if (!defined(attribute)) {
            throw new DeveloperError('geometry must have attribute matching the attributeName argument: ' + attributeName + '.');
        }

        if (attribute.componentDatatype.value !== ComponentDatatype.DOUBLE.value) {
            throw new DeveloperError('The attribute componentDatatype must be ComponentDatatype.DOUBLE.');
        }

        projection = (defined(projection)) ? projection : new GeographicProjection();
        var ellipsoid = projection.getEllipsoid();

        // Project original values to 2D.
        var values3D = attribute.values;
        var projectedValues = new Float64Array(values3D.length);
        var index = 0;

        for ( var i = 0; i < values3D.length; i += 3) {
            var value = Cartesian3.fromArray(values3D, i, scratchProjectTo2DCartesian3);
            var lonLat = ellipsoid.cartesianToCartographic(value, scratchProjectTo2DCartographic);
            var projectedLonLat = projection.project(lonLat, scratchProjectTo2DCartesian3);

            projectedValues[index++] = projectedLonLat.x;
            projectedValues[index++] = projectedLonLat.y;
            projectedValues[index++] = projectedLonLat.z;
        }

        // Rename original cartesians to WGS84 cartesians.
        geometry.attributes[attributeName3D] = attribute;

        // Replace original cartesians with 2D projected cartesians
        geometry.attributes[attributeName2D] = new GeometryAttribute({
            componentDatatype : ComponentDatatype.DOUBLE,
            componentsPerAttribute : 3,
            values : projectedValues
        });
        delete geometry.attributes[attributeName];

        return geometry;
    };

    var encodedResult = {
        high : 0.0,
        low : 0.0
    };

    /**
     * Encodes floating-point geometry attribute values as two separate attributes to improve
     * rendering precision using the same encoding as {@link EncodedCartesian3}.
     * <p>
     * This is commonly used to create high-precision position vertex attributes.
     * </p>
     *
     * @param {Geometry} geometry The geometry to modify.
     * @param {String} attributeName The name of the attribute.
     * @param {String} attributeHighName The name of the attribute for the encoded high bits.
     * @param {String} attributeLowName The name of the attribute for the encoded low bits.
     *
     * @returns {Geometry} The modified <code>geometry</code> argument, with its encoded attribute.
     *
     * @exception {DeveloperError} geometry is required.
     * @exception {DeveloperError} attributeName is required.
     * @exception {DeveloperError} attributeHighName is required.
     * @exception {DeveloperError} attributeLowName is required.
     * @exception {DeveloperError} geometry must have attribute matching the attributeName argument.
     * @exception {DeveloperError} The attribute componentDatatype must be ComponentDatatype.DOUBLE.
     *
     * @example
     * geometry = GeometryPipeline.encodeAttribute(geometry, 'position3D', 'position3DHigh', 'position3DLow');
     *
     * @see EncodedCartesian3
     */
    GeometryPipeline.encodeAttribute = function(geometry, attributeName, attributeHighName, attributeLowName) {
        if (!defined(geometry)) {
            throw new DeveloperError('geometry is required.');
        }

        if (!defined(attributeName)) {
            throw new DeveloperError('attributeName is required.');
        }

        if (!defined(attributeHighName)) {
            throw new DeveloperError('attributeHighName is required.');
        }

        if (!defined(attributeLowName)) {
            throw new DeveloperError('attributeLowName is required.');
        }

        var attribute = geometry.attributes[attributeName];

        if (!defined(attribute)) {
            throw new DeveloperError('geometry must have attribute matching the attributeName argument: ' + attributeName + '.');
        }

        if (attribute.componentDatatype.value !== ComponentDatatype.DOUBLE.value) {
            throw new DeveloperError('The attribute componentDatatype must be ComponentDatatype.DOUBLE.');
        }

        var values = attribute.values;
        var length = values.length;
        var highValues = new Float32Array(length);
        var lowValues = new Float32Array(length);

        for (var i = 0; i < length; ++i) {
            EncodedCartesian3.encode(values[i], encodedResult);
            highValues[i] = encodedResult.high;
            lowValues[i] = encodedResult.low;
        }

        var componentsPerAttribute = attribute.componentsPerAttribute;

        geometry.attributes[attributeHighName] = new GeometryAttribute({
            componentDatatype : ComponentDatatype.FLOAT,
            componentsPerAttribute : componentsPerAttribute,
            values : highValues
        });
        geometry.attributes[attributeLowName] = new GeometryAttribute({
            componentDatatype : ComponentDatatype.FLOAT,
            componentsPerAttribute : componentsPerAttribute,
            values : lowValues
        });
        delete geometry.attributes[attributeName];

        return geometry;
    };

    var scratchCartesian3 = new Cartesian3();
    var scratchCartesian4 = new Cartesian4();

    function transformPoint(matrix, attribute) {
        if (defined(attribute)) {
            var values = attribute.values;
            var length = values.length;
            for (var i = 0; i < length; i += 3) {
                Cartesian3.unpack(values, i, scratchCartesian3);
                Matrix4.multiplyByPoint(matrix, scratchCartesian3, scratchCartesian4);
                Cartesian3.pack(scratchCartesian4, values, i);
            }
        }
    }

    function transformVector(matrix, attribute) {
        if (defined(attribute)) {
            var values = attribute.values;
            var length = values.length;
            for (var i = 0; i < length; i += 3) {
                Cartesian3.unpack(values, i, scratchCartesian3);
                Matrix3.multiplyByVector(matrix, scratchCartesian3, scratchCartesian3);
                scratchCartesian3 = Cartesian3.normalize(scratchCartesian3, scratchCartesian3);
                Cartesian3.pack(scratchCartesian3, values, i);
            }
        }
    }

    var inverseTranspose = new Matrix4();
    var normalMatrix = new Matrix3();

    /**
     * Transforms a geometry instance to world coordinates.  This is used as a prerequisite
     * to batch together several instances with {@link GeometryPipeline.combine}.  This changes
     * the instance's <code>modelMatrix</code> to {@see Matrix4.IDENTITY} and transforms the
     * following attributes if they are present: <code>position</code>, <code>normal</code>,
     * <code>binormal</code>, and <code>tangent</code>.
     *
     * @param {GeometryInstance} instance The geometry instance to modify.
     *
     * @returns {GeometryInstance} The modified <code>instance</code> argument, with its attributes transforms to world coordinates.
     *
     * @exception {DeveloperError} instance is required.
     *
     * @example
     * for (var i = 0; i < instances.length; ++i) {
     *   GeometryPipeline.transformToWorldCoordinates(instances[i]);
     * }
     * var geometry = GeometryPipeline.combine(instances);
     *
     * @see GeometryPipeline.combine
     */
    GeometryPipeline.transformToWorldCoordinates = function(instance) {
        if (!defined(instance)) {
            throw new DeveloperError('instance is required.');
        }

        var modelMatrix = instance.modelMatrix;

        if (Matrix4.equals(modelMatrix, Matrix4.IDENTITY)) {
            // Already in world coordinates
            return instance;
        }

        var attributes = instance.geometry.attributes;

        // Transform attributes in known vertex formats
        transformPoint(modelMatrix, attributes.position);

        if ((defined(attributes.normal)) ||
            (defined(attributes.binormal)) ||
            (defined(attributes.tangent))) {

            Matrix4.inverse(modelMatrix, inverseTranspose);
            Matrix4.transpose(inverseTranspose, inverseTranspose);
            Matrix4.getRotation(inverseTranspose, normalMatrix);

            transformVector(normalMatrix, attributes.normal);
            transformVector(normalMatrix, attributes.binormal);
            transformVector(normalMatrix, attributes.tangent);
        }

        var boundingSphere = instance.geometry.boundingSphere;

        if (defined(boundingSphere)) {
            instance.geometry.boundingSphere = BoundingSphere.transform(boundingSphere, modelMatrix, boundingSphere);
        }

        instance.modelMatrix = Matrix4.IDENTITY.clone();

        return instance;
    };

    function findAttributesInAllGeometries(instances) {
        var length = instances.length;

        var attributesInAllGeometries = {};

        var attributes0 = instances[0].geometry.attributes;
        var name;

        for (name in attributes0) {
            if (attributes0.hasOwnProperty(name) &&
                    defined(attributes0[name]) &&
                    defined(attributes0[name].values)) {

                var attribute = attributes0[name];
                var numberOfComponents = attribute.values.length;
                var inAllGeometries = true;

                // Does this same attribute exist in all geometries?
                for (var i = 1; i < length; ++i) {
                    var otherAttribute = instances[i].geometry.attributes[name];

                    if ((!defined(otherAttribute)) ||
                        (attribute.componentDatatype.value !== otherAttribute.componentDatatype.value) ||
                        (attribute.componentsPerAttribute !== otherAttribute.componentsPerAttribute) ||
                        (attribute.normalize !== otherAttribute.normalize)) {

                        inAllGeometries = false;
                        break;
                    }

                    numberOfComponents += otherAttribute.values.length;
                }

                if (inAllGeometries) {
                    attributesInAllGeometries[name] = new GeometryAttribute({
                        componentDatatype : attribute.componentDatatype,
                        componentsPerAttribute : attribute.componentsPerAttribute,
                        normalize : attribute.normalize,
                        values : ComponentDatatype.createTypedArray(attribute.componentDatatype, numberOfComponents)
                    });
                }
            }
        }

        return attributesInAllGeometries;
    }

    /**
     * Combines geometry from several {@link GeometryInstance} objects into one geometry.
     * This concatenates the attributes, concatenates and adjusts the indices, and creates
     * a bounding sphere encompassing all instances.
     * <p>
     * If the instances do not have the same attributes, a subset of attributes common
     * to all instances is used, and the others are ignored.
     * </p>
     * <p>
     * This is used by {@link Primitive} to efficiently render a large amount of static data.
     * </p>
     *
     * @param {Array} [instances] The array of {@link GeometryInstance} objects whose geometry will be combined.
     *
     * @returns {Geometry} A single geometry created from the provided geometry instances.
     *
     * @exception {DeveloperError} instances is required and must have length greater than zero.
     * @exception {DeveloperError} All instances must have the same modelMatrix.
     * @exception {DeveloperError} All instance geometries must have an indices or not have one.
     * @exception {DeveloperError} All instance geometries must have the same primitiveType.
     *
     * @example
     * for (var i = 0; i < instances.length; ++i) {
     *   GeometryPipeline.transformToWorldCoordinates(instances[i]);
     * }
     * var geometry = GeometryPipeline.combine(instances);
     *
     * @see GeometryPipeline.transformToWorldCoordinates
     */
    GeometryPipeline.combine = function(instances) {
        if ((!defined(instances)) || (instances.length < 1)) {
            throw new DeveloperError('instances is required and must have length greater than zero.');
        }

        var length = instances.length;

        var name;
        var i;
        var j;
        var k;

        var m = instances[0].modelMatrix;
        var haveIndices = (defined(instances[0].geometry.indices));
        var primitiveType = instances[0].geometry.primitiveType;

        for (i = 1; i < length; ++i) {
            if (!Matrix4.equals(instances[i].modelMatrix, m)) {
                throw new DeveloperError('All instances must have the same modelMatrix.');
            }

            if ((defined(instances[i].geometry.indices)) !== haveIndices) {
                throw new DeveloperError('All instance geometries must have an indices or not have one.');
            }

            if (instances[i].geometry.primitiveType.value !== primitiveType.value) {
                throw new DeveloperError('All instance geometries must have the same primitiveType.');
            }
        }

        // Find subset of attributes in all geometries
        var attributes = findAttributesInAllGeometries(instances);
        var values;
        var sourceValues;
        var sourceValuesLength;

        // Combine attributes from each geometry into a single typed array
        for (name in attributes) {
            if (attributes.hasOwnProperty(name)) {
                values = attributes[name].values;

                k = 0;
                for (i = 0; i < length; ++i) {
                    sourceValues = instances[i].geometry.attributes[name].values;
                    sourceValuesLength = sourceValues.length;

                    for (j = 0; j < sourceValuesLength; ++j) {
                        values[k++] = sourceValues[j];
                    }
                }
            }
        }

        // Combine index lists
        var indices;

        if (haveIndices) {
            var numberOfIndices = 0;
            for (i = 0; i < length; ++i) {
                numberOfIndices += instances[i].geometry.indices.length;
            }

            var numberOfVertices = Geometry.computeNumberOfVertices(new Geometry({
                attributes : attributes,
                primitiveType : PrimitiveType.POINTS
            }));
            var destIndices = IndexDatatype.createTypedArray(numberOfVertices, numberOfIndices);

            var destOffset = 0;
            var offset = 0;

            for (i = 0; i < length; ++i) {
                var sourceIndices = instances[i].geometry.indices;
                var sourceIndicesLen = sourceIndices.length;

                for (k = 0; k < sourceIndicesLen; ++k) {
                    destIndices[destOffset++] = offset + sourceIndices[k];
                }

                offset += Geometry.computeNumberOfVertices(instances[i].geometry);
            }

            indices = destIndices;
        }

        // Create bounding sphere that includes all instances
        var center = new Cartesian3();
        var radius = 0.0;
        var bs;

        for (i = 0; i < length; ++i) {
            bs = instances[i].geometry.boundingSphere;
            if (!defined(bs)) {
                // If any geometries have an undefined bounding sphere, then so does the combined geometry
                center = undefined;
                break;
            }

            Cartesian3.add(bs.center, center, center);
        }

        if (defined(center)) {
            Cartesian3.divideByScalar(center, length, center);

            for (i = 0; i < length; ++i) {
                bs = instances[i].geometry.boundingSphere;
                var tempRadius = Cartesian3.magnitude(Cartesian3.subtract(bs.center, center)) + bs.radius;

                if (tempRadius > radius) {
                    radius = tempRadius;
                }
            }
        }

        return new Geometry({
            attributes : attributes,
            indices : indices,
            primitiveType : primitiveType,
            boundingSphere : (defined(center)) ? new BoundingSphere(center, radius) : undefined
        });
    };

    var normal = new Cartesian3();
    var v0 = new Cartesian3();
    var v1 = new Cartesian3();
    var v2 = new Cartesian3();

    /**
     * Computes per-vertex normals for a geometry containing <code>TRIANGLES</code> by averaging the normals of
     * all triangles incident to the vertex.  The result is a new <code>normal</code> attribute added to the geometry.
     * This assumes a counter-clockwise winding order.
     *
     * @param {Geometry} geometry The geometry to modify.
     *
     * @returns {Geometry} The modified <code>geometry</code> argument with the computed <code>normal</code> attribute.
     *
     * @exception {DeveloperError} geometry is required.
     * @exception {DeveloperError} geometry.attributes.position.values is required.
     * @exception {DeveloperError} geometry.indices is required.
     * @exception {DeveloperError} geometry.indices length must be greater than 0 and be a multiple of 3.
     * @exception {DeveloperError} geometry.primitiveType must be {@link PrimitiveType.TRIANGLES}.
     *
     * @example
     * GeometryPipeline.computeNormal(geometry);
     */
    GeometryPipeline.computeNormal = function(geometry) {
        if (!defined(geometry)) {
            throw new DeveloperError('geometry is required.');
        }

        var attributes = geometry.attributes;
        var indices = geometry.indices;

        if (!defined(attributes.position) || !defined(attributes.position.values)) {
            throw new DeveloperError('geometry.attributes.position.values is required.');
        }

        if (!defined(indices)) {
            throw new DeveloperError('geometry.indices is required.');
        }

        if (indices.length < 2 || indices.length % 3 !== 0) {
            throw new DeveloperError('geometry.indices length must be greater than 0 and be a multiple of 3.');
        }

        if (geometry.primitiveType.value !== PrimitiveType.TRIANGLES.value) {
            throw new DeveloperError('geometry.primitiveType must be PrimitiveType.TRIANGLES.');
        }

        var vertices = geometry.attributes.position.values;
        var numVertices = geometry.attributes.position.values.length / 3;
        var numIndices = indices.length;
        var normalsPerVertex = new Array(numVertices);
        var normalsPerTriangle = new Array(numIndices / 3);
        var normalIndices = new Array(numIndices);

        for ( var i = 0; i < numVertices; i++) {
            normalsPerVertex[i] = {
                indexOffset : 0,
                count : 0,
                currentCount : 0
            };
        }

        var j = 0;
        for (i = 0; i < numIndices; i += 3) {
            var i0 = indices[i];
            var i1 = indices[i + 1];
            var i2 = indices[i + 2];
            var i03 = i0 * 3;
            var i13 = i1 * 3;
            var i23 = i2 * 3;

            v0.x = vertices[i03];
            v0.y = vertices[i03 + 1];
            v0.z = vertices[i03 + 2];
            v1.x = vertices[i13];
            v1.y = vertices[i13 + 1];
            v1.z = vertices[i13 + 2];
            v2.x = vertices[i23];
            v2.y = vertices[i23 + 1];
            v2.z = vertices[i23 + 2];

            normalsPerVertex[i0].count++;
            normalsPerVertex[i1].count++;
            normalsPerVertex[i2].count++;

            Cartesian3.subtract(v1, v0, v1);
            Cartesian3.subtract(v2, v0, v2);
            normalsPerTriangle[j] = Cartesian3.cross(v1, v2);
            j++;
        }

        var indexOffset = 0;
        for (i = 0; i < numVertices; i++) {
            normalsPerVertex[i].indexOffset += indexOffset;
            indexOffset += normalsPerVertex[i].count;
        }

        j = 0;
        var vertexNormalData;
        for (i = 0; i < numIndices; i += 3) {
            vertexNormalData = normalsPerVertex[indices[i]];
            var index = vertexNormalData.indexOffset + vertexNormalData.currentCount;
            normalIndices[index] = j;
            vertexNormalData.currentCount++;

            vertexNormalData = normalsPerVertex[indices[i + 1]];
            index = vertexNormalData.indexOffset + vertexNormalData.currentCount;
            normalIndices[index] = j;
            vertexNormalData.currentCount++;

            vertexNormalData = normalsPerVertex[indices[i + 2]];
            index = vertexNormalData.indexOffset + vertexNormalData.currentCount;
            normalIndices[index] = j;
            vertexNormalData.currentCount++;

            j++;
        }

        var normalValues = new Float32Array(numVertices * 3);
        for (i = 0; i < numVertices; i++) {
            var i3 = i * 3;
            vertexNormalData = normalsPerVertex[i];
            if (vertexNormalData.count > 0) {
                Cartesian3.clone(Cartesian3.ZERO, normal);
                for (j = 0; j < vertexNormalData.count; j++) {
                    Cartesian3.add(normal, normalsPerTriangle[normalIndices[vertexNormalData.indexOffset + j]], normal);
                }
                Cartesian3.normalize(normal, normal);
                normalValues[i3] = normal.x;
                normalValues[i3 + 1] = normal.y;
                normalValues[i3 + 2] = normal.z;
            } else {
                normalValues[i3] = 0.0;
                normalValues[i3 + 1] = 0.0;
                normalValues[i3 + 2] = 1.0;
            }
        }

        geometry.attributes.normal = new GeometryAttribute({
            componentDatatype : ComponentDatatype.FLOAT,
            componentsPerAttribute : 3,
            values : normalValues
        });

        return geometry;
    };

    var normalScratch = new Cartesian3();
    var normalScale = new Cartesian3();
    var tScratch = new Cartesian3();

    /**
     * Computes per-vertex binormals and tangents for a geometry containing <code>TRIANGLES</code>.
     * The result is new <code>binormal</code> and <code>tangent</code> attributes added to the geometry.
     * This assumes a counter-clockwise winding order.
     * <p>
     * Based on <a href="http://www.terathon.com/code/tangent.html">Computing Tangent Space Basis Vectors
     * for an Arbitrary Mesh</a> by Eric Lengyel.
     * </p>
     *
     * @param {Geometry} geometry The geometry to modify.
     *
     * @returns {Geometry} The modified <code>geometry</code> argument with the computed <code>binormal</code> and <code>tangent</code> attributes.
     *
     * @exception {DeveloperError} geometry is required.
     * @exception {DeveloperError} geometry.attributes.position.values is required.
     * @exception {DeveloperError} geometry.attributes.normal.values is required.
     * @exception {DeveloperError} geometry.attributes.st.values is required.
     * @exception {DeveloperError} geometry.indices is required.
     * @exception {DeveloperError} geometry.indices length must be greater than 0 and be a multiple of 3.
     * @exception {DeveloperError} geometry.primitiveType must be {@link PrimitiveType.TRIANGLES}.
     *
     * @example
     * GeometryPipeline.computeBinormalAndTangent(geometry);
     */
    GeometryPipeline.computeBinormalAndTangent = function(geometry) {
        if (!defined(geometry)) {
            throw new DeveloperError('geometry is required.');
        }

        var attributes = geometry.attributes;
        var indices = geometry.indices;

        if (!defined(attributes.position) || !defined(attributes.position.values)) {
            throw new DeveloperError('geometry.attributes.position.values is required.');
        }

        if (!defined(attributes.normal) || !defined(attributes.normal.values)) {
            throw new DeveloperError('geometry.attributes.normal.values is required.');
        }

        if (!defined(attributes.st) || !defined(attributes.st.values)) {
            throw new DeveloperError('geometry.attributes.st.values is required.');
        }

        if (!defined(indices)) {
            throw new DeveloperError('geometry.indices is required.');
        }

        if (indices.length < 2 || indices.length % 3 !== 0) {
            throw new DeveloperError('geometry.indices length must be greater than 0 and be a multiple of 3.');
        }

        if (geometry.primitiveType.value !== PrimitiveType.TRIANGLES.value) {
            throw new DeveloperError('geometry.primitiveType must be PrimitiveType.TRIANGLES.');
        }

        var vertices = geometry.attributes.position.values;
        var normals = geometry.attributes.normal.values;
        var st = geometry.attributes.st.values;

        var numVertices = geometry.attributes.position.values.length / 3;
        var numIndices = indices.length;
        var tan1 = new Array(numVertices * 3);

        for ( var i = 0; i < tan1.length; i++) {
            tan1[i] = 0;
        }

        var i03;
        var i13;
        var i23;
        for (i = 0; i < numIndices; i += 3) {
            var i0 = indices[i];
            var i1 = indices[i + 1];
            var i2 = indices[i + 2];
            i03 = i0 * 3;
            i13 = i1 * 3;
            i23 = i2 * 3;
            var i02 = i0 * 2;
            var i12 = i1 * 2;
            var i22 = i2 * 2;

            var ux = vertices[i03];
            var uy = vertices[i03 + 1];
            var uz = vertices[i03 + 2];

            var wx = st[i02];
            var wy = st[i02 + 1];
            var t1 = st[i12 + 1] - wy;
            var t2 = st[i22 + 1] - wy;

            var r = 1.0 / ((st[i12] - wx) * t2 - (st[i22] - wx) * t1);
            var sdirx = (t2 * (vertices[i13] - ux) - t1 * (vertices[i23] - ux)) * r;
            var sdiry = (t2 * (vertices[i13 + 1] - uy) - t1 * (vertices[i23 + 1] - uy)) * r;
            var sdirz = (t2 * (vertices[i13 + 2] - uz) - t1 * (vertices[i23 + 2] - uz)) * r;

            tan1[i03] += sdirx;
            tan1[i03 + 1] += sdiry;
            tan1[i03 + 2] += sdirz;

            tan1[i13] += sdirx;
            tan1[i13 + 1] += sdiry;
            tan1[i13 + 2] += sdirz;

            tan1[i23] += sdirx;
            tan1[i23 + 1] += sdiry;
            tan1[i23 + 2] += sdirz;
        }

        var binormalValues = new Float32Array(numVertices * 3);
        var tangentValues = new Float32Array(numVertices * 3);

        for (i = 0; i < numVertices; i++) {
            i03 = i * 3;
            i13 = i03 + 1;
            i23 = i03 + 2;

            var n = Cartesian3.fromArray(normals, i03, normalScratch);
            var t = Cartesian3.fromArray(tan1, i03, tScratch);
            var scalar = Cartesian3.dot(n, t);
            Cartesian3.multiplyByScalar(n, scalar, normalScale);
            Cartesian3.normalize(Cartesian3.subtract(t, normalScale, t), t);

            tangentValues[i03] = t.x;
            tangentValues[i13] = t.y;
            tangentValues[i23] = t.z;

            Cartesian3.normalize(Cartesian3.cross(n, t, t), t);

            binormalValues[i03] = t.x;
            binormalValues[i13] = t.y;
            binormalValues[i23] = t.z;
        }

        geometry.attributes.tangent = new GeometryAttribute({
            componentDatatype : ComponentDatatype.FLOAT,
            componentsPerAttribute : 3,
            values : tangentValues
        });

        geometry.attributes.binormal = new GeometryAttribute({
            componentDatatype : ComponentDatatype.FLOAT,
            componentsPerAttribute : 3,
            values : binormalValues
        });

        return geometry;
    };

    function indexTriangles(geometry) {
        if (defined(geometry.indices)) {
            return geometry;
        }

        var numberOfVertices = Geometry.computeNumberOfVertices(geometry);
        if (numberOfVertices < 3) {
            throw new DeveloperError('The number of vertices must be at least three.');
        }

        if (numberOfVertices % 3 !== 0) {
            throw new DeveloperError('The number of vertices must be a multiple of three.');
        }

        var indices = IndexDatatype.createTypedArray(numberOfVertices, numberOfVertices);
        for (var i = 0; i < numberOfVertices; ++i) {
            indices[i] = i;
        }

        geometry.indices = indices;
        return geometry;
    }

    function indexTriangleFan(geometry) {
        var numberOfVertices = Geometry.computeNumberOfVertices(geometry);
        if (numberOfVertices < 3) {
            throw new DeveloperError('The number of vertices must be at least three.');
        }

        var indices = IndexDatatype.createTypedArray(numberOfVertices, (numberOfVertices - 2) * 3);
        indices[0] = 1;
        indices[1] = 0;
        indices[2] = 2;

        var indicesIndex = 3;
        for (var i = 3; i < numberOfVertices; ++i) {
            indices[indicesIndex++] = i - 1;
            indices[indicesIndex++] = 0;
            indices[indicesIndex++] = i;
        }

        geometry.indices = indices;
        geometry.primitiveType = PrimitiveType.TRIANGLES;
        return geometry;
    }

    function indexTriangleStrip(geometry) {
        var numberOfVertices = Geometry.computeNumberOfVertices(geometry);
        if (numberOfVertices < 3) {
            throw new DeveloperError('The number of vertices must be at least 3.');
        }

        var indices = IndexDatatype.createTypedArray(numberOfVertices, (numberOfVertices - 2) * 3);
        indices[0] = 0;
        indices[1] = 1;
        indices[2] = 2;

        if (numberOfVertices > 3) {
            indices[3] = 0;
            indices[4] = 2;
            indices[5] = 3;
        }

        var indicesIndex = 6;
        for (var i = 3; i < numberOfVertices - 1; i += 2) {
            indices[indicesIndex++] = i;
            indices[indicesIndex++] = i - 1;
            indices[indicesIndex++] = i + 1;

            if (i + 2 < numberOfVertices) {
                indices[indicesIndex++] = i;
                indices[indicesIndex++] = i + 1;
                indices[indicesIndex++] = i + 2;
            }
        }

        geometry.indices = indices;
        geometry.primitiveType = PrimitiveType.TRIANGLES;
        return geometry;
    }

    function indexLines(geometry) {
        if (defined(geometry.indices)) {
            return geometry;
        }

        var numberOfVertices = Geometry.computeNumberOfVertices(geometry);
        if (numberOfVertices < 2) {
            throw new DeveloperError('The number of vertices must be at least two.');
        }

        if (numberOfVertices % 2 !== 0) {
            throw new DeveloperError('The number of vertices must be a multiple of 2.');
        }

        var indices = IndexDatatype.createTypedArray(numberOfVertices, numberOfVertices);
        for (var i = 0; i < numberOfVertices; ++i) {
            indices[i] = i;
        }

        geometry.indices = indices;
        return geometry;
    }

    function indexLineStrip(geometry) {
        var numberOfVertices = Geometry.computeNumberOfVertices(geometry);
        if (numberOfVertices < 2) {
            throw new DeveloperError('The number of vertices must be at least two.');
        }
        var indices = IndexDatatype.createTypedArray(numberOfVertices, (numberOfVertices - 1) * 2);

        indices[0] = 0;
        indices[1] = 1;

        var indicesIndex = 2;
        for (var i = 2; i < numberOfVertices; ++i) {
            indices[indicesIndex++] = i - 1;
            indices[indicesIndex++] = i;
        }

        geometry.indices = indices;
        geometry.primitiveType = PrimitiveType.LINES;
        return geometry;
    }

    function indexLineLoop(geometry) {
        var numberOfVertices = Geometry.computeNumberOfVertices(geometry);
        if (numberOfVertices < 2) {
            throw new DeveloperError('The number of vertices must be at least two.');
        }

        var indices = IndexDatatype.createTypedArray(numberOfVertices, numberOfVertices * 2);

        indices[0] = 0;
        indices[1] = 1;

        var indicesIndex = 2;
        for (var i = 2; i < numberOfVertices; ++i) {
            indices[indicesIndex++] = i - 1;
            indices[indicesIndex++] = i;
        }

        indices[indicesIndex++] = numberOfVertices - 1;
        indices[indicesIndex] = 0;

        geometry.indices = indices;
        geometry.primitiveType = PrimitiveType.LINES;
        return geometry;
    }

    function indexPrimitive(geometry) {
        switch (geometry.primitiveType.value) {
        case PrimitiveType.TRIANGLE_FAN.value:
            return indexTriangleFan(geometry);
        case PrimitiveType.TRIANGLE_STRIP.value:
            return indexTriangleStrip(geometry);
        case PrimitiveType.TRIANGLES.value:
            return indexTriangles(geometry);
        case PrimitiveType.LINE_STRIP.value:
            return indexLineStrip(geometry);
        case PrimitiveType.LINE_LOOP.value:
            return indexLineLoop(geometry);
        case PrimitiveType.LINES.value:
            return indexLines(geometry);
        }

        return geometry;
    }

    function offsetPointFromXZPlane(p, isBehind) {
        if (Math.abs(p.y) < CesiumMath.EPSILON11){
            if (isBehind) {
                p.y = -CesiumMath.EPSILON11;
            } else {
                p.y = CesiumMath.EPSILON11;
            }
        }
    }

    var c3 = new Cartesian3();
    function getXZIntersectionOffsetPoints(p, p1, u1, v1) {
        Cartesian3.add(p, Cartesian3.multiplyByScalar(Cartesian3.subtract(p1, p, c3), p.y/(p.y-p1.y), c3), u1);
        Cartesian3.clone(u1, v1);
        offsetPointFromXZPlane(u1, true);
        offsetPointFromXZPlane(v1, false);
    }

    var u1 = new Cartesian3();
    var u2 = new Cartesian3();
    var q1 = new Cartesian3();
    var q2 = new Cartesian3();

    var splitTriangleResult = {
        positions : new Array(7),
        indices : new Array(3 * 3)
    };

    function splitTriangle(p0, p1, p2) {
        // In WGS84 coordinates, for a triangle approximately on the
        // ellipsoid to cross the IDL, first it needs to be on the
        // negative side of the plane x = 0.
        if ((p0.x >= 0.0) || (p1.x >= 0.0) || (p2.x >= 0.0)) {
            return undefined;
        }

        var p0Behind = p0.y < 0.0;
        var p1Behind = p1.y < 0.0;
        var p2Behind = p2.y < 0.0;

        offsetPointFromXZPlane(p0, p0Behind);
        offsetPointFromXZPlane(p1, p1Behind);
        offsetPointFromXZPlane(p2, p2Behind);

        var numBehind = 0;
        numBehind += p0Behind ? 1 : 0;
        numBehind += p1Behind ? 1 : 0;
        numBehind += p2Behind ? 1 : 0;

        var indices = splitTriangleResult.indices;

        if (numBehind === 1) {
            indices[1] = 3;
            indices[2] = 4;
            indices[5] = 6;
            indices[7] = 6;
            indices[8] = 5;

            if (p0Behind) {
                getXZIntersectionOffsetPoints(p0, p1, u1, q1);
                getXZIntersectionOffsetPoints(p0, p2, u2, q2);

                indices[0] = 0;
                indices[3] = 1;
                indices[4] = 2;
                indices[6] = 1;
            } else if (p1Behind) {
                getXZIntersectionOffsetPoints(p1, p2, u1, q1);
                getXZIntersectionOffsetPoints(p1, p0, u2, q2);

                indices[0] = 1;
                indices[3] = 2;
                indices[4] = 0;
                indices[6] = 2;
            } else if (p2Behind) {
                getXZIntersectionOffsetPoints(p2, p0, u1, q1);
                getXZIntersectionOffsetPoints(p2, p1, u2, q2);

                indices[0] = 2;
                indices[3] = 0;
                indices[4] = 1;
                indices[6] = 0;
            }
        } else if (numBehind === 2) {
            indices[2] = 4;
            indices[4] = 4;
            indices[5] = 3;
            indices[7] = 5;
            indices[8] = 6;

            if (!p0Behind) {
                getXZIntersectionOffsetPoints(p0, p1, u1, q1);
                getXZIntersectionOffsetPoints(p0, p2, u2, q2);

                indices[0] = 1;
                indices[1] = 2;
                indices[3] = 1;
                indices[6] = 0;
            } else if (!p1Behind) {
                getXZIntersectionOffsetPoints(p1, p2, u1, q1);
                getXZIntersectionOffsetPoints(p1, p0, u2, q2);

                indices[0] = 2;
                indices[1] = 0;
                indices[3] = 2;
                indices[6] = 1;
            } else if (!p2Behind) {
                getXZIntersectionOffsetPoints(p2, p0, u1, q1);
                getXZIntersectionOffsetPoints(p2, p1, u2, q2);

                indices[0] = 0;
                indices[1] = 1;
                indices[3] = 0;
                indices[6] = 2;
            }
        }

        var positions = splitTriangleResult.positions;
        positions[0] = p0;
        positions[1] = p1;
        positions[2] = p2;
        splitTriangleResult.length = 3;

        if (numBehind === 1 || numBehind === 2) {
            positions[3] = u1;
            positions[4] = u2;
            positions[5] = q1;
            positions[6] = q2;
            splitTriangleResult.length = 7;
        }

        return splitTriangleResult;
    }

    function computeTriangleAttributes(i0, i1, i2, dividedTriangle, normals, binormals, tangents, texCoords) {
        if (!defined(normals) && !defined(binormals) && !defined(tangents) && !defined(texCoords)) {
            return;
        }

        var positions = dividedTriangle.positions;
        var p0 = positions[0];
        var p1 = positions[1];
        var p2 = positions[2];

        var n0, n1, n2;
        var b0, b1, b2;
        var t0, t1, t2;
        var s0, s1, s2;
        var v0, v1, v2;
        var u0, u1, u2;

        if (defined(normals)) {
            n0 = Cartesian3.fromArray(normals, i0 * 3);
            n1 = Cartesian3.fromArray(normals, i1 * 3);
            n2 = Cartesian3.fromArray(normals, i2 * 3);
        }

        if (defined(binormals)) {
            b0 = Cartesian3.fromArray(binormals, i0 * 3);
            b1 = Cartesian3.fromArray(binormals, i1 * 3);
            b2 = Cartesian3.fromArray(binormals, i2 * 3);
        }

        if (defined(tangents)) {
            t0 = Cartesian3.fromArray(tangents, i0 * 3);
            t1 = Cartesian3.fromArray(tangents, i1 * 3);
            t2 = Cartesian3.fromArray(tangents, i2 * 3);
        }

        if (defined(texCoords)) {
            s0 = Cartesian2.fromArray(texCoords, i0 * 2);
            s1 = Cartesian2.fromArray(texCoords, i1 * 2);
            s2 = Cartesian2.fromArray(texCoords, i2 * 2);
        }

        for (var i = 3; i < positions.length; ++i) {
            var point = positions[i];
            var coords = barycentricCoordinates(point, p0, p1, p2);

            if (defined(normals)) {
                v0 = Cartesian3.multiplyByScalar(n0, coords.x, v0);
                v1 = Cartesian3.multiplyByScalar(n1, coords.y, v1);
                v2 = Cartesian3.multiplyByScalar(n2, coords.z, v2);

                var normal = Cartesian3.add(v0, v1);
                Cartesian3.add(normal, v2, normal);
                Cartesian3.normalize(normal, normal);

                normals.push(normal.x, normal.y, normal.z);
            }

            if (defined(binormals)) {
                v0 = Cartesian3.multiplyByScalar(b0, coords.x, v0);
                v1 = Cartesian3.multiplyByScalar(b1, coords.y, v1);
                v2 = Cartesian3.multiplyByScalar(b2, coords.z, v2);

                var binormal = Cartesian3.add(v0, v1);
                Cartesian3.add(binormal, v2, binormal);
                Cartesian3.normalize(binormal, binormal);

                binormals.push(binormal.x, binormal.y, binormal.z);
            }

            if (defined(tangents)) {
                v0 = Cartesian3.multiplyByScalar(t0, coords.x, v0);
                v1 = Cartesian3.multiplyByScalar(t1, coords.y, v1);
                v2 = Cartesian3.multiplyByScalar(t2, coords.z, v2);

                var tangent = Cartesian3.add(v0, v1);
                Cartesian3.add(tangent, v2, tangent);
                Cartesian3.normalize(tangent, tangent);

                tangents.push(tangent.x, tangent.y, tangent.z);
            }

            if (defined(texCoords)) {
                u0 = Cartesian2.multiplyByScalar(s0, coords.x, u0);
                u1 = Cartesian2.multiplyByScalar(s1, coords.y, u1);
                u2 = Cartesian2.multiplyByScalar(s2, coords.z, u2);

                var texCoord = Cartesian2.add(u0, u1);
                Cartesian2.add(texCoord, u2, texCoord);

                texCoords.push(texCoord.x, texCoord.y);
            }
        }
    }

    function wrapLongitudeTriangles(geometry) {
        var attributes = geometry.attributes;
        var positions = attributes.position.values;
        var normals = (defined(attributes.normal)) ? attributes.normal.values : undefined;
        var binormals = (defined(attributes.binormal)) ? attributes.binormal.values : undefined;
        var tangents = (defined(attributes.tangent)) ? attributes.tangent.values : undefined;
        var texCoords = (defined(attributes.st)) ? attributes.st.values : undefined;
        var indices = geometry.indices;

        var newPositions = Array.prototype.slice.call(positions, 0);
        var newNormals = (defined(normals)) ? Array.prototype.slice.call(normals, 0) : undefined;
        var newBinormals = (defined(binormals)) ? Array.prototype.slice.call(binormals, 0) : undefined;
        var newTangents = (defined(tangents)) ? Array.prototype.slice.call(tangents, 0) : undefined;
        var newTexCoords = (defined(texCoords)) ? Array.prototype.slice.call(texCoords, 0) : undefined;
        var newIndices = [];

        var len = indices.length;
        for (var i = 0; i < len; i += 3) {
            var i0 = indices[i];
            var i1 = indices[i + 1];
            var i2 = indices[i + 2];

            var p0 = Cartesian3.fromArray(positions, i0 * 3);
            var p1 = Cartesian3.fromArray(positions, i1 * 3);
            var p2 = Cartesian3.fromArray(positions, i2 * 3);

            var result = splitTriangle(p0, p1, p2);
            if (defined(result)) {
                newPositions[i0 * 3 + 1] = result.positions[0].y;
                newPositions[i1 * 3 + 1] = result.positions[1].y;
                newPositions[i2 * 3 + 1] = result.positions[2].y;

                if (result.length > 3) {
                    var positionsLength = newPositions.length / 3;
                    for(var j = 0; j < result.indices.length; ++j) {
                        var index = result.indices[j];
                        if (index < 3) {
                            newIndices.push(indices[i + index]);
                        } else {
                            newIndices.push(index - 3 + positionsLength);
                        }
                    }

                    for (var k = 3; k < result.positions.length; ++k) {
                        var position = result.positions[k];
                        newPositions.push(position.x, position.y, position.z);
                    }
                    computeTriangleAttributes(i0, i1, i2, result, newNormals, newBinormals, newTangents, newTexCoords);
                } else {
                    newIndices.push(i0, i1, i2);
                }
            } else {
                newIndices.push(i0, i1, i2);
            }
        }

        geometry.attributes.position.values = new Float64Array(newPositions);

        if (defined(newNormals)) {
            attributes.normal.values = ComponentDatatype.createTypedArray(attributes.normal.componentDatatype, newNormals);
        }

        if (defined(newBinormals)) {
            attributes.binormal.values = ComponentDatatype.createTypedArray(attributes.binormal.componentDatatype, newBinormals);
        }

        if (defined(newTangents)) {
            attributes.tangent.values = ComponentDatatype.createTypedArray(attributes.tangent.componentDatatype, newTangents);
        }

        if (defined(newTexCoords)) {
            attributes.st.values = ComponentDatatype.createTypedArray(attributes.st.componentDatatype, newTexCoords);
        }

        var numberOfVertices = Geometry.computeNumberOfVertices(geometry);
        geometry.indices = IndexDatatype.createTypedArray(numberOfVertices, newIndices);
    }

    function wrapLongitudeLines(geometry) {
        var attributes = geometry.attributes;
        var positions = attributes.position.values;
        var indices = geometry.indices;

        var newPositions = Array.prototype.slice.call(positions, 0);
        var newIndices = [];

        var xzPlane = Plane.fromPointNormal(Cartesian3.ZERO, Cartesian3.UNIT_Y);

        var length = indices.length;
        for ( var i = 0; i < length; i += 2) {
            var i0 = indices[i];
            var i1 = indices[i + 1];

            var prev = Cartesian3.fromArray(positions, i0 * 3);
            var cur = Cartesian3.fromArray(positions, i1 * 3);

            if (Math.abs(prev.y) < CesiumMath.EPSILON6){
                if (prev.y < 0.0) {
                    prev.y = -CesiumMath.EPSILON6;
                } else {
                    prev.y = CesiumMath.EPSILON6;
                }

                newPositions[i0 * 3 + 1] = prev.y;
            }

            if (Math.abs(cur.y) < CesiumMath.EPSILON6){
                if (cur.y < 0.0) {
                    cur.y = -CesiumMath.EPSILON6;
                } else {
                    cur.y = CesiumMath.EPSILON6;
                }

                newPositions[i1 * 3 + 1] = cur.y;
            }

            newIndices.push(i0);

            // intersects the IDL if either endpoint is on the negative side of the yz-plane
            if (prev.x < 0.0 || cur.x < 0.0) {
                // and intersects the xz-plane
                var intersection = IntersectionTests.lineSegmentPlane(prev, cur, xzPlane);
                if (defined(intersection)) {
                    // move point on the xz-plane slightly away from the plane
                    var offset = Cartesian3.multiplyByScalar(Cartesian3.UNIT_Y, 5.0 * CesiumMath.EPSILON9);
                    if (prev.y < 0.0) {
                        Cartesian3.negate(offset, offset);
                    }

                    var index = newPositions.length / 3;
                    newIndices.push(index, index + 1);

                    var offsetPoint = Cartesian3.add(intersection, offset);
                    newPositions.push(offsetPoint.x, offsetPoint.y, offsetPoint.z);

                    Cartesian3.negate(offset, offset);
                    Cartesian3.add(intersection, offset, offsetPoint);
                    newPositions.push(offsetPoint.x, offsetPoint.y, offsetPoint.z);
                }
            }

            newIndices.push(i1);
        }

        geometry.attributes.position.values = new Float64Array(newPositions);
        var numberOfVertices = Geometry.computeNumberOfVertices(geometry);
        geometry.indices = IndexDatatype.createTypedArray(numberOfVertices, newIndices);
    }

    /**
     * Splits the geometry's primitives, by introducing new vertices and indices,that
     * intersect the International Date Line so that no primitives cross longitude
     * -180/180 degrees.  This is not required for 3D drawing, but is required for
     * correcting drawing in 2D and Columbus view.
     *
     * @param {Geometry} geometry The geometry to modify.
     *
     * @returns {Geometry} The modified <code>geometry</code> argument, with it's primitives split at the International Date Line.
     *
     * @exception {DeveloperError} geometry is required.
     *
     * @example
     * geometry = GeometryPipeline.wrapLongitude(geometry);
     */
    GeometryPipeline.wrapLongitude = function(geometry) {
        if (!defined(geometry)) {
            throw new DeveloperError('geometry is required.');
        }

        var boundingSphere = geometry.boundingSphere;
        if (defined(boundingSphere)) {
            var minX = boundingSphere.center.x - boundingSphere.radius;
            if (minX > 0 || BoundingSphere.intersect(boundingSphere, Cartesian4.UNIT_Y) !== Intersect.INTERSECTING) {
                return geometry;
            }
        }

        indexPrimitive(geometry);
        if (geometry.primitiveType.value === PrimitiveType.TRIANGLES.value) {
            wrapLongitudeTriangles(geometry);
        } else if (geometry.primitiveType.value === PrimitiveType.LINES.value) {
            wrapLongitudeLines(geometry);
        }

        return geometry;
    };

    return GeometryPipeline;
});

/*global define*/
define('Scene/PrimitivePipeline',[
        '../Core/defined',
        '../Core/defaultValue',
        '../Core/Color',
        '../Core/ComponentDatatype',
        '../Core/DeveloperError',
        '../Core/FeatureDetection',
        '../Core/Geometry',
        '../Core/GeometryAttribute',
        '../Core/GeometryPipeline',
        '../Core/Matrix4'
    ], function(
        defined,
        defaultValue,
        Color,
        ComponentDatatype,
        DeveloperError,
        FeatureDetection,
        Geometry,
        GeometryAttribute,
        GeometryPipeline,
        Matrix4) {
    "use strict";

    // Bail out if the browser doesn't support typed arrays, to prevent the setup function
    // from failing, since we won't be able to create a WebGL context anyway.
    if (!FeatureDetection.supportsTypedArrays()) {
        return {};
    }

    function transformToWorldCoordinates(instances, primitiveModelMatrix, allow3DOnly) {
        var toWorld = !allow3DOnly;
        var length = instances.length;
        var i;

        if (!toWorld && (length > 1)) {
            var modelMatrix = instances[0].modelMatrix;

            for (i = 1; i < length; ++i) {
                if (!Matrix4.equals(modelMatrix, instances[i].modelMatrix)) {
                    toWorld = true;
                    break;
                }
            }
        }

        if (toWorld) {
            for (i = 0; i < length; ++i) {
                GeometryPipeline.transformToWorldCoordinates(instances[i]);
            }
        } else {
            // Leave geometry in local coordinate system; auto update model-matrix.
            Matrix4.clone(instances[0].modelMatrix, primitiveModelMatrix);
        }
    }

    function addPickColorAttribute(instances, pickIds) {
        var length = instances.length;

        for (var i = 0; i < length; ++i) {
            var instance = instances[i];
            var geometry = instance.geometry;
            var attributes = geometry.attributes;
            var positionAttr = attributes.position;
            var numberOfComponents = 4 * (positionAttr.values.length / positionAttr.componentsPerAttribute);

            attributes.pickColor = new GeometryAttribute({
                componentDatatype : ComponentDatatype.UNSIGNED_BYTE,
                componentsPerAttribute : 4,
                normalize : true,
                values : new Uint8Array(numberOfComponents)
            });

            var pickColor = pickIds[i];
            var red = Color.floatToByte(pickColor.red);
            var green = Color.floatToByte(pickColor.green);
            var blue = Color.floatToByte(pickColor.blue);
            var alpha = Color.floatToByte(pickColor.alpha);
            var values = attributes.pickColor.values;

            for (var j = 0; j < numberOfComponents; j += 4) {
                values[j] = red;
                values[j + 1] = green;
                values[j + 2] = blue;
                values[j + 3] = alpha;
            }
        }
    }

    function getCommonPerInstanceAttributeNames(instances) {
        var length = instances.length;

        var attributesInAllInstances = [];
        var attributes0 = instances[0].attributes;
        var name;

        for (name in attributes0) {
            if (attributes0.hasOwnProperty(name)) {
                var attribute = attributes0[name];
                var inAllInstances = true;

                // Does this same attribute exist in all instances?
                for (var i = 1; i < length; ++i) {
                    var otherAttribute = instances[i].attributes[name];

                    if (!defined(otherAttribute) ||
                        (attribute.componentDatatype.value !== otherAttribute.componentDatatype.value) ||
                        (attribute.componentsPerAttribute !== otherAttribute.componentsPerAttribute) ||
                        (attribute.normalize !== otherAttribute.normalize)) {

                        inAllInstances = false;
                        break;
                    }
                }

                if (inAllInstances) {
                    attributesInAllInstances.push(name);
                }
            }
        }

        return attributesInAllInstances;
    }

    function addPerInstanceAttributes(instances, names) {
        var length = instances.length;
        for (var i = 0; i < length; ++i) {
            var instance = instances[i];
            var instanceAttributes = instance.attributes;
            var geometry = instance.geometry;
            var numberOfVertices = Geometry.computeNumberOfVertices(geometry);

            var namesLength = names.length;
            for (var j = 0; j < namesLength; ++j) {
                var name = names[j];
                var attribute = instanceAttributes[name];
                var componentDatatype = attribute.componentDatatype;
                var value = attribute.value;
                var componentsPerAttribute = value.length;

                var buffer = ComponentDatatype.createTypedArray(componentDatatype, numberOfVertices * componentsPerAttribute);
                for (var k = 0; k < numberOfVertices; ++k) {
                    buffer.set(value, k * componentsPerAttribute);
                }

                geometry.attributes[name] = new GeometryAttribute({
                    componentDatatype : componentDatatype,
                    componentsPerAttribute : componentsPerAttribute,
                    normalize : attribute.normalize,
                    values : buffer
                });
            }
        }
    }

    function geometryPipeline(parameters) {
        var instances = parameters.instances;
        var pickIds = parameters.pickIds;
        var projection = parameters.projection;
        var uintIndexSupport = parameters.elementIndexUintSupported;
        var allow3DOnly = parameters.allow3DOnly;
        var vertexCacheOptimize = parameters.vertexCacheOptimize;
        var modelMatrix = parameters.modelMatrix;

        var i;
        var length = instances.length;
        var primitiveType = instances[0].geometry.primitiveType;
        for (i = 1; i < length; ++i) {
            if (instances[i].geometry.primitiveType.value !== primitiveType.value) {
                throw new DeveloperError('All instance geometries must have the same primitiveType.');
            }
        }

        // Unify to world coordinates before combining.
        transformToWorldCoordinates(instances, modelMatrix, allow3DOnly);

        // Clip to IDL
        if (!allow3DOnly) {
            for (i = 0; i < length; ++i) {
                GeometryPipeline.wrapLongitude(instances[i].geometry);
            }
        }

        // Add pickColor attribute for picking individual instances
        addPickColorAttribute(instances, pickIds);

        // add attributes to the geometry for each per-instance attribute
        var perInstanceAttributeNames = getCommonPerInstanceAttributeNames(instances);
        addPerInstanceAttributes(instances, perInstanceAttributeNames);

        // Optimize for vertex shader caches
        if (vertexCacheOptimize) {
            for (i = 0; i < length; ++i) {
                GeometryPipeline.reorderForPostVertexCache(instances[i].geometry);
                GeometryPipeline.reorderForPreVertexCache(instances[i].geometry);
            }
        }

        // Combine into single geometry for better rendering performance.
        var geometry = GeometryPipeline.combine(instances);

        // Split positions for GPU RTE
        var attributes = geometry.attributes;
        var name;
        if (!allow3DOnly) {
            for (name in attributes) {
                if (attributes.hasOwnProperty(name) && attributes[name].componentDatatype.value === ComponentDatatype.DOUBLE.value) {
                    var name3D = name + '3D';
                    var name2D = name + '2D';

                    // Compute 2D positions
                    GeometryPipeline.projectTo2D(geometry, name, name3D, name2D, projection);

                    GeometryPipeline.encodeAttribute(geometry, name3D, name3D + 'High', name3D + 'Low');
                    GeometryPipeline.encodeAttribute(geometry, name2D, name2D + 'High', name2D + 'Low');
                }
            }
        } else {
            for (name in attributes) {
                if (attributes.hasOwnProperty(name) && attributes[name].componentDatatype.value === ComponentDatatype.DOUBLE.value) {
                    GeometryPipeline.encodeAttribute(geometry, name, name + '3DHigh', name + '3DLow');
                }
            }
        }

        if (!uintIndexSupport) {
            // Break into multiple geometries to fit within unsigned short indices if needed
            return GeometryPipeline.fitToUnsignedShortIndices(geometry);
        }

        // Unsigned int indices are supported.  No need to break into multiple geometries.
        return [geometry];
    }

    function createPerInstanceVAAttributes(geometry, attributeIndices, names) {
        var vaAttributes = [];
        var attributes = geometry.attributes;

        var length = names.length;
        for (var i = 0; i < length; ++i) {
            var name = names[i];
            var attribute = attributes[name];

            var componentDatatype = attribute.componentDatatype;
            if (componentDatatype.value === ComponentDatatype.DOUBLE.value) {
                componentDatatype = ComponentDatatype.FLOAT;
            }

            var typedArray = ComponentDatatype.createTypedArray(componentDatatype, attribute.values);
            vaAttributes.push({
                index : attributeIndices[name],
                componentDatatype : componentDatatype,
                componentsPerAttribute : attribute.componentsPerAttribute,
                normalize : attribute.normalize,
                values : typedArray
            });

            delete attributes[name];
        }

        return vaAttributes;
    }

    function computePerInstanceAttributeIndices(instances, vertexArrays, attributeIndices) {
        var indices = [];

        var names = getCommonPerInstanceAttributeNames(instances);
        var length = instances.length;
        var offsets = {};
        var vaIndices = {};

        for (var i = 0; i < length; ++i) {
            var instance = instances[i];
            var numberOfVertices = Geometry.computeNumberOfVertices(instance.geometry);

            var namesLength = names.length;
            for (var j = 0; j < namesLength; ++j) {
                var name = names[j];
                var index = attributeIndices[name];

                var tempVertexCount = numberOfVertices;
                while (tempVertexCount > 0) {
                    var vaIndex = defaultValue(vaIndices[name], 0);
                    var va = vertexArrays[vaIndex];
                    var vaLength = va.length;

                    var attribute;
                    for (var k = 0; k < vaLength; ++k) {
                        attribute = va[k];
                        if (attribute.index === index) {
                            break;
                        }
                    }

                    if (!defined(indices[i])) {
                        indices[i] = {};
                    }

                    if (!defined(indices[i][name])) {
                        indices[i][name] = {
                            dirty : false,
                            value : instance.attributes[name].value,
                            indices : []
                        };
                    }

                    var size = attribute.values.length / attribute.componentsPerAttribute;
                    var offset = defaultValue(offsets[name], 0);

                    var count;
                    if (offset + tempVertexCount < size) {
                        count = tempVertexCount;
                        indices[i][name].indices.push({
                            attribute : attribute,
                            offset : offset,
                            count : count
                        });
                        offsets[name] = offset + tempVertexCount;
                    } else {
                        count = size - offset;
                        indices[i][name].indices.push({
                            attribute : attribute,
                            offset : offset,
                            count : count
                        });
                        offsets[name] = 0;
                        vaIndices[name] = vaIndex + 1;
                    }

                    tempVertexCount -= count;
                }
            }
        }

        return indices;
    }

    /**
     * @private
     */
    var PrimitivePipeline = {};

    /**
     * @private
     */
    PrimitivePipeline.combineGeometry = function(parameters) {
        var clonedParameters = {
            instances : parameters.instances,
            pickIds : parameters.pickIds,
            ellipsoid : parameters.ellipsoid,
            projection : parameters.projection,
            elementIndexUintSupported : parameters.elementIndexUintSupported,
            allow3DOnly : parameters.allow3DOnly,
            vertexCacheOptimize : parameters.vertexCacheOptimize,
            modelMatrix : Matrix4.clone(parameters.modelMatrix)
        };
        var geometries = geometryPipeline(clonedParameters);
        var attributeIndices = GeometryPipeline.createAttributeIndices(geometries[0]);

        var instances = clonedParameters.instances;
        var perInstanceAttributeNames = getCommonPerInstanceAttributeNames(instances);

        var perInstanceAttributes = [];
        var length = geometries.length;
        for (var i = 0; i < length; ++i) {
            var geometry = geometries[i];
            perInstanceAttributes.push(createPerInstanceVAAttributes(geometry, attributeIndices, perInstanceAttributeNames));
        }

        var indices = computePerInstanceAttributeIndices(instances, perInstanceAttributes, attributeIndices);

        return {
            geometries : geometries,
            modelMatrix : clonedParameters.modelMatrix,
            attributeIndices : attributeIndices,
            vaAttributes : perInstanceAttributes,
            vaAttributeIndices : indices
        };
    };

    /*
     * The below functions are needed when transferring typed arrays to/from web
     * workers. This is a workaround for:
     *
     * https://bugzilla.mozilla.org/show_bug.cgi?id=841904
     */

    function stupefyTypedArray(typedArray) {
        return {
            type : typedArray.constructor.name,
            buffer : typedArray.buffer
        };
    }

    var typedArrayMap = {
        Int8Array : Int8Array,
        Uint8Array : Uint8Array,
        Int16Array : Int16Array,
        Uint16Array : Uint16Array,
        Int32Array : Int32Array,
        Uint32Array : Uint32Array,
        Float32Array : Float32Array,
        Float64Array : Float64Array
    };

    function unStupefyTypedArray(typedArray) {
        return new typedArrayMap[typedArray.type](typedArray.buffer);
    }

    /**
     * @private
     */
    PrimitivePipeline.transferGeometry = function(geometry, transferableObjects) {
        var typedArray;
        var attributes = geometry.attributes;
        for (var name in attributes) {
            if (attributes.hasOwnProperty(name) &&
                    defined(attributes[name]) &&
                    defined(attributes[name].values)) {
                typedArray = attributes[name].values;

                if (transferableObjects.indexOf(attributes[name].values.buffer) < 0) {
                    transferableObjects.push(typedArray.buffer);
                }

                if (!defined(typedArray.type)) {
                    attributes[name].values = stupefyTypedArray(typedArray);
                }
            }
        }

        if (defined(geometry.indices)) {
            typedArray = geometry.indices;
            transferableObjects.push(typedArray.buffer);

            if (!defined(typedArray.type)) {
                geometry.indices = stupefyTypedArray(geometry.indices);
            }
        }
    };

    /**
     * @private
     */
    PrimitivePipeline.transferGeometries = function(geometries, transferableObjects) {
        var length = geometries.length;
        for (var i = 0; i < length; ++i) {
            PrimitivePipeline.transferGeometry(geometries[i], transferableObjects);
        }
    };

    /**
     * @private
     */
    PrimitivePipeline.transferPerInstanceAttributes = function(perInstanceAttributes, transferableObjects) {
        var length = perInstanceAttributes.length;
        for (var i = 0; i < length; ++i) {
            var vaAttributes = perInstanceAttributes[i];
            var vaLength = vaAttributes.length;
            for (var j = 0; j < vaLength; ++j) {
                var typedArray = vaAttributes[j].values;
                transferableObjects.push(typedArray.buffer);
                vaAttributes[j].values = stupefyTypedArray(typedArray);
            }
        }
    };

    /**
     * @private
     */
    PrimitivePipeline.transferInstances = function(instances, transferableObjects) {
        var length = instances.length;
        for (var i = 0; i < length; ++i) {
            var instance = instances[i];
            PrimitivePipeline.transferGeometry(instance.geometry, transferableObjects);
        }
    };

    /**
     * @private
     */
    PrimitivePipeline.receiveGeometry = function(geometry) {
        var attributes = geometry.attributes;
        for (var name in attributes) {
            if (attributes.hasOwnProperty(name) &&
                    defined(attributes[name]) &&
                    defined(attributes[name].values)) {
                attributes[name].values = unStupefyTypedArray(attributes[name].values);
            }
        }

        if (defined(geometry.indices)) {
            geometry.indices = unStupefyTypedArray(geometry.indices);
        }
    };

    /**
     * @private
     */
    PrimitivePipeline.receiveGeometries = function(geometries) {
        var length = geometries.length;
        for (var i = 0; i < length; ++i) {
            PrimitivePipeline.receiveGeometry(geometries[i]);
        }
    };

    /**
     * @private
     */
    PrimitivePipeline.receivePerInstanceAttributes = function(perInstanceAttributes) {
        var length = perInstanceAttributes.length;
        for (var i = 0; i < length; ++i) {
            var vaAttributes = perInstanceAttributes[i];
            var vaLength = vaAttributes.length;
            for (var j = 0; j < vaLength; ++j) {
                vaAttributes[j].values = unStupefyTypedArray(vaAttributes[j].values);
            }
        }
    };

    /**
     * @private
     */
    PrimitivePipeline.receiveInstances = function(instances) {
        var length = instances.length;
        for (var i = 0; i < length; ++i) {
            var instance = instances[i];
            PrimitivePipeline.receiveGeometry(instance.geometry);
        }
    };

    return PrimitivePipeline;
});

/*global define*/
define('Workers/createTaskProcessorWorker',[
        '../Core/defaultValue',
        '../Core/defined'
    ], function(
        defaultValue,
        defined) {
    "use strict";

    /**
     * Creates an adapter function to allow a calculation function to operate as a Web Worker,
     * paired with TaskProcessor, to receive tasks and return results.
     *
     * @exports createTaskProcessorWorker
     *
     * @param {Function} workerFunction A function that takes as input two arguments:
     * a parameters object, and an array into which transferable result objects can be pushed,
     * and returns as output a result object.
     * @returns {Function} An adapter function that handles the interaction with TaskProcessor,
     * specifically, task ID management and posting a response message containing the result.
     *
     * @example
     * function doCalculation(parameters, transferableObjects) {
     *   // calculate some result using the inputs in parameters
     *   return result;
     * }
     *
     * return createTaskProcessorWorker(doCalculation);
     * // the resulting function is compatible with TaskProcessor
     *
     * @see TaskProcessor
     * @see <a href='http://www.w3.org/TR/workers/'>Web Workers</a>
     * @see <a href='http://www.w3.org/TR/html5/common-dom-interfaces.html#transferable-objects'>Transferable objects</a>
     */
    var createTaskProcessorWorker = function(workerFunction) {
        var postMessage;
        var transferableObjects = [];
        var responseMessage = {
            id : undefined,
            result : undefined,
            error : undefined
        };

        return function(event) {
            /*global self*/
            var data = event.data;

            transferableObjects.length = 0;
            responseMessage.id = data.id;
            responseMessage.error = undefined;
            responseMessage.result = undefined;

            try {
                responseMessage.result = workerFunction(data.parameters, transferableObjects);
            } catch (e) {
                responseMessage.error = e;
            }

            if (!defined(postMessage)) {
                postMessage = defaultValue(self.webkitPostMessage, self.postMessage);
            }

            try {
                postMessage(responseMessage, transferableObjects);
            } catch (e) {
                // something went wrong trying to post the message, post a simpler
                // error that we can be sure will be cloneable
                responseMessage.result = undefined;
                responseMessage.error = 'postMessage failed with error: ' + e + '\n  with responseMessage: ' + JSON.stringify(responseMessage);
                postMessage(responseMessage);
            }
        };
    };

    return createTaskProcessorWorker;
});
/*global define*/
define('Workers/createWallGeometry',[
        '../Core/WallGeometry',
        '../Core/Ellipsoid',
        '../Scene/PrimitivePipeline',
        './createTaskProcessorWorker'
    ], function(
        WallGeometry,
        Ellipsoid,
        PrimitivePipeline,
        createTaskProcessorWorker) {
    "use strict";

    function createWallGeometry(parameters, transferableObjects) {
        var wallGeometry = parameters.geometry;
        wallGeometry._ellipsoid = Ellipsoid.clone(wallGeometry._ellipsoid);

        var geometry = WallGeometry.createGeometry(wallGeometry);
        PrimitivePipeline.transferGeometry(geometry, transferableObjects);

        return {
            geometry : geometry,
            index : parameters.index
        };
    }

    return createTaskProcessorWorker(createWallGeometry);
});
}());