"use strict"

var inSphere = require("../in-sphere.js")
var twoProduct = require("two-product")

require("tape")(function(t) {

  t.equals(inSphere([
      [0,-1],
      [1,0],
      [0,1],
      [-0.5,0]
    ]), 1)

  t.equals(inSphere([
      [0,-1],
      [1,0],
      [0,1],
      [-1,0]
    ]), 0)

  t.equals(inSphere([
      [0,-1],
      [1,0],
      [0,1],
      [-1.5,0]
    ]), -1 )

  var x = 1e-64
  for(var i=0; i<128; ++i) {
    t.equals(inSphere([
        [0,x],
        [-x,-x],
        [x,-x],
        [0,0]
      ]), 1, "sphere test:" + x)
    x *= 10
  }

  t.end()
})