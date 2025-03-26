const { login, signUp, verifyEmail } = require('../services/authService');

const loginController = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { token } = await login(email, password);
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const signUpController = async (req, res) => {
    const { email, name, password, conPassword } = req.body;
    try {
        console.log(req.body);
        if (!email || !name || !password || !conPassword) {
            return res.status(400).json({ 'error': "All fields are required" });
        }

        if (password !== conPassword) {
            return res.status(400).json({ 'error': "Password does not match" });
        }

        const { newUser } = await signUp(email, name, password);
        return res.status(200).json({ message: 'Please check your email for a verification link.' });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const verifyEmailController = async (req, res) => {
    const { token } = req.query;
    try {
        const result = await verifyEmail(token);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    loginController,
    signUpController,
    verifyEmailController,
};
