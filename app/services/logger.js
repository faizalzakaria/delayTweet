exports.log = function (tag, msg) {
  console.log('\x1b[32m[%s]\x1b[0m %s', tag, msg)
}
