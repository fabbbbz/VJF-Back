exports.testApp = async (req, res, next) => {
    try {
        res.json({ result: 'success' })
    } catch (err) {
        res.json({ result: 'false' })
    }
}