"use strict"

var twoProduct = require("two-product")
var robustSum = require("robust-sum")
var robustDiff = require("robust-subtract")
var robustScale = require("robust-scale")

module.exports = getInSphere

function cofactor(m, c) {
  var result = new Array(m.length-1)
  for(var i=1; i<m.length; ++i) {
    var r = result[i-1] = new Array(m.length-1)
    for(var j=0,k=0; j<m.length; ++j) {
      if(j === c) {
        continue
      }
      r[k++] = m[i][j]
    }
  }
  return result
}

function matrix(n) {
  var result = new Array(n)
  for(var i=0; i<n; ++i) {
    result[i] = new Array(n)
    for(var j=0; j<n; ++j) {
      result[i][j] = ["m[", j, "][", (n-i-2), "]"].join("")
    }
  }
  return result
}

function generateSum(expr) {
  if(expr.length === 1) {
    return expr[0]
  } else if(expr.length === 2) {
    return ["sum(", expr[0], ",", expr[1], ")"].join("")
  } else {
    var m = expr.length>>1
    return ["sum(", generateSum(expr.slice(0, m)), ",", generateSum(expr.slice(m)), ")"].join("")
  }
}

function makeProduct(a, b) {
  if(a.charAt(0) === "m") {
    if(b.charAt(0) === "w") {
      var toks = a.split("]")
      return ["w", b.substr(1), "m", toks[0].substr(2)].join("")
    } else {
      return ["prod(", a, ",", b, ")"].join("")
    }
  } else {
    return makeProduct(b, a)
  }
}

function sign(s) {
  if(s & 1 !== 0) {
    return "-"
  }
  return ""
}

function determinant(m) {
  if(m.length === 2) {
    return [["diff(", makeProduct(m[0][0], m[1][1]), ",", makeProduct(m[1][0], m[0][1]), ")"].join("")]
  } else {
    var expr = []
    for(var i=0; i<m.length; ++i) {
      expr.push(["scale(", generateSum(determinant(cofactor(m, i))), ",", sign(i), m[0][i], ")"].join(""))
    }
    return expr
  }
}

function makeSquare(d, n) {
  var terms = []
  for(var i=0; i<n-2; ++i) {
    terms.push(["prod(m[", d, "][", i, "],m[", d, "][", i, "])"].join(""))
  }
  return generateSum(terms)
}

function orientation(n) {
  var pos = []
  var neg = []
  var m = matrix(n)
  for(var i=0; i<n; ++i) {
    m[0][i] = "1"
    m[n-1][i] = "w"+i
  } 
  for(var i=0; i<n; ++i) {
    if((i&1)===0) {
      pos.push.apply(pos,determinant(cofactor(m, i)))
    } else {
      neg.push.apply(neg,determinant(cofactor(m, i)))
    }
  }
  var posExpr = generateSum(pos)
  var negExpr = generateSum(neg)
  var code = ["function inSphere", n, "(m){"]
  for(var i=0; i<n; ++i) {
    code.push("var w",i,"=",makeSquare(i,n),";")
    for(var j=0; j<n; ++j) {
      if(j !== i) {
        code.push("var w",i,"m",j,"=scale(w",i,",m[",j,"][0]);")
      }
    }
  }
  code.push("var p=", posExpr, ",n=", negExpr, ";\
for(var i=p.length-1,j=n.length-1;i>=0&&j>=0;--i,--j){\
if(p[i]<n[j]){return -1}else if(p[i]>n[j]){return 1}}\
if(i>=0){return p[i]>0?1:(p[i]<0?-1:0)}\
if(j>=0){return n[j]<0?1:(n[j]>0?-1:0)}\
return 0};return inSphere", n)
  var proc = new Function("sum", "diff", "prod", "scale", code.join(""))
  return proc(robustSum, robustDiff, twoProduct, robustScale)
}

var CACHED = [
  function inSphere0() { return 0 },
  function inSphere1() { return 0 },
  function inSphere2() { return 0 },
  function inSphere3(m) { 
    var a = m[0][0], b = m[1][0], c = m[2][0]
    if(a < b) {
      if(a < c) {
        if(c < b) {
          return -1
        } else if(c > b) {
          return 1
        } else {
          return 0
        }
      } else if(a === c) {
        return 0
      } else {
        return 1
      }
    } else {
      if(b < c) {
        if(c < a) {
          return 1
        } else if(c > a) {
          return -1
        } else {
          return 0
        }
      } else if(b === c) {
        return 0
      } else {
        return -1
      }
    }
  }
]

function getInSphere(m) {
  while(CACHED.length <= m.length) {
    CACHED.push(orientation(CACHED.length))
  }
  var p = CACHED[m.length]
  return p(m)
}