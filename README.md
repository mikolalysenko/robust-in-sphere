robust-in-sphere
================
Exact arithmetic test to check if (n+2) points are cospherical.

## Example

```javascript
var inSphere = require("robust-in-sphere")

var points = [
  [0, 1],
  [1, 0],
  [-1, 0],
  [0, -1]
]

console.log(inSphere(points))
```

### `require("robust-in-sphere")(points)`
Tests if a collection of `n+2` points in `n`-dimensional space are cospherical or if the last point is contained in the sphere or not.

* `points` is a list of points

**Returns** A signed integer that gives the orientation of the points
* `+1` if the last point is contained in the oriented sphere defined by the previous two points
* `-1` if the last point is outside the sphere
* `0` is the points are cospherical

## Credits
(c) 2013 Mikola Lysenko. MIT License