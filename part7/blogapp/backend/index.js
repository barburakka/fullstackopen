const server = require('./blogapp')
const config = require('./utils/config')
const logger = require('./utils/logger')

server.connectDB().then(() => {
  server.app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
  })
})