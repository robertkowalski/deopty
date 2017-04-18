const wrapOptimizedTest = require('.')

function foo (n) {
  const f = 'bar'
  // eval('console.log("f")')
}

const f = wrapOptimizedTest(foo)

// to detect if a function can be optimized it has to be called three times
f()
f()
f()
