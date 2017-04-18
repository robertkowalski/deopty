const assert = require('assert')
const log = require('winston').cli()

function test (fn, opts = { limit: 2 }) {
  assert(typeof fn === 'function', 'argument must be a function')

  const { limit } = opts
  const deopty = new DeoptyProxy(fn, opts)
  const p = new Proxy(
    fn,
    deopty
  )

  process.on('exit', () => {
    if (deopty.count < limit) {
      log.error('Tested function must be called at least %s times', limit)
    }
  })

  return p
}

class DeoptyProxy {
  constructor (_fn, { limit }) {
    this.count = 0
    this.limit = limit
  }

  apply (target, thisArg, argumentsList) {
    this.count++
    if (this.count === 1) {
      // eslint-disable-next-line no-eval
      eval('%OptimizeFunctionOnNextCall(target)')
    }

    if (this.count === this.limit) {
      printStatus(target, this.opts)
      process.exit(0)
    }
    target.apply(thisArg, argumentsList)
  }
}

function printStatus (fn) {
  const name = fn.name || ''

  // eslint-disable-next-line no-eval
  const status = eval('%GetOptimizationStatus(fn)')
  switch (status) {
    case 1:
      log.info('Function "%s" is optimized', name)
      break
    case 2:
      log.info('Function "%s" is not optimized', name)
      break
    case 3:
      log.info('Function "%s" is always optimized', name)
      break
    case 4:
      log.info('Function "%s" is never optimized', name)
      break
    case 6:
      log.info('Function "%s" is maybe deoptimized', name)
      break
    case 7:
      log.info('Function "%s" is optimized by TurboFan', name)
      break
    default:
      log.info('Unknown optimization status for "%s"', name)
      break
  }
}

module.exports = test
