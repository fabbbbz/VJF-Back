module.exports = function validateEmail(email) {
    // Regular expression for email search pattern
    var reEmail = /^[^\s@]+@[^\s@]+$/;
    // If email's pattern is found in variable reEmail return true
    if (reEmail.test(email)) {
        return (true)
    }
    // Else if email's pattern cannot be found in variable reEmail return false
    else {
        return (false)
    }
}