const { expect } = require('chai')
const configure = require('../src/configure')

describe('Configure', () => {
  it('load default json configuration file', () => {
    const config = configure()
    expect(config.redis).to.eql({"host": "ece-redis.redis.cache.windows.net", "port": 6379, "password":"Ob7qivm658U8Xv7XLmModOlP5TNiEWHBCAzCaH4zmJ0="})
  })
  it('load custom configuration', () => {
    const config_custom = {"custom": "value"}
    const config = configure(config_custom)
    expect(config).to.eql({"redis": {"host": "ece-redis.redis.cache.windows.net", "port": 6379, "password":"Ob7qivm658U8Xv7XLmModOlP5TNiEWHBCAzCaH4zmJ0="}, "custom": "value"})
  })
})
