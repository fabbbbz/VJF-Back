exports.testApp = async (req, res, next) => {
    try {
        res.json({ result: 'success', appname: 'Vite Jai Faim!!', version: '0.1' })
    } catch (err) {
        res.statusCode = 400
        res.json({ result: 'false' })
    }
}