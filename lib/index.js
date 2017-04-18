const log = require('winston').cli()

try {
  // eslint-disable-next-line no-eval
  eval(`
    function noop () {}
    %OptimizeFunctionOnNextCall(noop)
  `)
} catch (e) {
  if (e instanceof SyntaxError) {
    log.error('it looks like you did not run node with tracing options, try:')
    log.error('$ node --trace_opt --trace_deopt --allow-natives-syntax $YOUR_FILE\n')
    process.exit(1)
  }

  throw e
}

module.exports = require('./lib.js')
