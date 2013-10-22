"use strict"

var inSphere = require("../in-sphere.js")

require("tape")(function(t) {

  console.log(inSphere([
      [0,-1],
      [1,0],
      [0,1],
      [-1,0]
    ]))

  t.end()
})