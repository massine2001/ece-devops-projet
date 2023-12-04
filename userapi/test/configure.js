const { expect } = require('chai')
const configure = require('../src/configure')

describe('Configure', () => {
  it('load default json configuration file', () => {
    const config = configure()
    expect(config.redis).to.eql({"host": "redis-ece.redis.cache.windows.net", "port": 6379, "password":"70RQTfs271089tlLzcCDtRe0t2frOCj2KAzCaLFhWfk="})
  })
  it('load custom configuration', () => {
    const config_custom = {"custom": "value"}
    const config = configure(config_custom)
    expect(config).to.eql({"redis": {"host": "redis-ece.redis.cache.windows.net", "port": 6379, "password":"70RQTfs271089tlLzcCDtRe0t2frOCj2KAzCaLFhWfk="}, "custom": "value"})
  })
})
