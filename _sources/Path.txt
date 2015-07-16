Path
====
This module provides essential path parsing functions to SuperCanvas. Also quite a bit of nifty math

.. function:: getExtents(path)
    
    Get's the extents of the provided path, as a object
    with the keys 'left', 'right', 'top', 'bottom'

    :param path: the path to transform
    :type path: `Array` or `String`
    :rtype: Object

.. function:: each(path, callback[, thisArg = null])

    Iterates over the provided path and calls `callback` for each segment

    This function will take care of shorthand and relative commands for you.

    In addition, this function can be used to map a path and return a new one.

    The callback function signature should look like this:

    .. code-block:: javascript

        function(segment, x, y);

    Usage example:

    .. code-block:: javascript

        Path.each("m1,2 3,4h10", function(segment){
            console.log(segment);
        });

    will yield::

        ["M", 1, 2]
        ["L", 4, 5]
        ["L", 14, 5]

    :param path: The path to iterate over
    :param callback: The callback to call
    :param thisArg: would should `this` refer to in the callback
    :type path: `Array` or `String`
    :type callback: Function
    :rtype: Array

.. function:: parsePath(path)
    
    parses a path into a SuperCanvas compatible path

    :param path: The path to parse
    :type path: String
    :rtype: Array

.. function:: cubicBezierCurve(P0, P1, P2, P3, t)

    returns the value for a cubic bezier at time `t`

    The cubic bezier function looks like:

    $$ B_{P_0,P_1,P_2,P_3}(t) = (1-t)^3P_0 + 3(1-t)^2tP_1 + 3(1-t)t^2P2 + t^3P_3 $$

    :param P0: Control point #0
    :param P1: Control point #1
    :param P2: Control point #2
    :param P3: Control point #3
    :param t: Time of the function
    :type P0: Number
    :type P1: Number
    :type P2: Number
    :type P3: Number
    :rtype: Number

.. function:: cubicBezierCurveDerivative(P0, P1, P2, P3, t)

    returns the derivative of the cubic bezier curve at t, the derivative:

    $$ B'_{P_0,P_1,P_2,P_3}(t) = 3t^2(P_3 - 3P_2 + 3P_1 - P_0) + 6t(P_2 - 2P_1 + P_0) + 3(P_1 - P_0) $$

    :param P0: Control point #0
    :param P1: Control point #1
    :param P2: Control point #2
    :param P3: Control point #3
    :param t: Time of the function
    :type P0: Number
    :type P1: Number
    :type P2: Number
    :type P3: Number
    :rtype: Number

.. function:: cubicBezierCurveZeroes(P0, P1, P2, P3)
    
    returns the two values of `t` where cubic bezier curve will be zero.

    .. warning::

        This function doesn't do bounds checking on the value of `t`. It is up to you to bind it to the range [0, 1]

    Assuming $ a = 3(P_3 - 3P_2 + 3P_1 - P_0) $, $ b = 6(P_2 - 2P_1 + P_0) $, and $ c = 3(P_1 - P_0) $, the function will return the two values yielded by

    $$ \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} $$

    :param P0: Control point #0
    :param P1: Control point #1
    :param P2: Control point #2
    :param P3: Control point #3
    :type P0: Number
    :type P1: Number
    :type P2: Number
    :type P3: Number
    :rtype: Array

.. function:: cubicBezierExtents(P0, P1, P2, P3)
    
    Returns the min and max value of the bezier curve for the control points provided

    :param P0: Control point #0
    :param P1: Control point #1
    :param P2: Control point #2
    :param P3: Control point #3
    :type P0: Number
    :type P1: Number
    :type P2: Number
    :type P3: Number
    :rtype: Array

.. function:: quadraticBezierCurve(P0, P1, P2, t)
    
    returns the value of the quadratic curve at time `t`

    $$ B_{P_0,P_1,P_2}(t) = (1-t)^2P_0 + 2(1-t)tP_1 + t^2P_2 $$

    :param P0: Control point #0
    :param P1: Control point #1
    :param P2: Control point #2
    :param t:
    :type P0: Number
    :type P1: Number
    :type P2: Number
    :type t: Number
    :rtype: Number

.. function:: quadraticBezierCurveDerivative(P0, P1, P2, t)

    Returns the Derivative of the quadratic curve at `t`

    $$ B'_{P_0,P_1,P_2}(t) = -2(1-t)P_0 + 2(1-2)tP_1 + 2tP_2 $$

    :param P0: Control point #0
    :param P1: Control point #1
    :param P2: Control point #2
    :param t: SPILL THE TEA GURL
    :type P0: Number
    :type P1: Number
    :type P2: Number
    :type t: Number
    :rtype: Number

.. function:: quadraticBezierCurveZeroes(P0, P1, P2)
    
    returns the value of `t` at which the derivative a quadratic curve with control points given will be zero

    .. warning::

        This function doesn't do bounds checking on the value of `t`. It is up to you to bind it to the range [0, 1]

    $$ \\dfrac{P_0 - P_1}{P_0 - 2P_1 + P_2} $$

    :param P0: Control point #0
    :param P1: Control point #1
    :param P2: Control point #2
    :type P0: Number
    :type P1: Number
    :type P2: Number
    :rtype: Number

.. function:: quadraticBezierExtents(P0, P2, P3)
    
    returns the extents of the quadratic curve with the provided control points

    :param P0: Control point #0
    :param P1: Control point #1
    :param P2: Control point #2
    :type P0: Number
    :type P1: Number
    :type P2: Number
    :rtype: Array