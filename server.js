// Configuration Expres Server

require('./config/connexion')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const app = require('./app')
const ip = require('ip')
const privateIp = ip.address()
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
	console.log(
		`%c ________________________________________
<Vite j'ai faim !! mooooooo !!>
 ----------------------------------------
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`,

		'font-family:monospace'
	)

	console.log(`Network private access via: ${privateIp}:${PORT}`)
	const publicIp = require('public-ip')
	;(async () => {
		console.log(
			'Network public access via: ' + (await publicIp.v4()) + ':' + PORT
		)
	})()
})
