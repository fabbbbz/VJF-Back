const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const app = require('./app')
require('./config/connexion')

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}...`))
