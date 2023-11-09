const { expect } = require('chai')
const configure = require('../src/configure')

describe('Configure', () => {
  it('load default json configuration file', () => {
    const config = configure()
    expect(config.redis).to.eql({"host": "ece-devops-projet.redis.cache.windows.net", "port": 6379, "password":"mslEyUxY5x9pj9HPL6wRzjglqFhr2KyGNAzCaFYNpw8="})
  })
  it('load custom configuration', () => {
    const config_custom = {"custom": "value"}
    const config = configure(config_custom)
    expect(config).to.eql({"redis": {"host": "ece-devops-projet.redis.cache.windows.net", "port": 6379, "password":"mslEyUxY5x9pj9HPL6wRzjglqFhr2KyGNAzCaFYNpw8="}, "custom": "value"})
  })
})
