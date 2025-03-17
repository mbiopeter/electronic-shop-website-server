const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Customer = require('../models/customers');
require('dotenv').config();

const sendConfirmationEmail = async (email, verificationLink, type) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: "Shoppers Support <support@shoppers.com>",
        to: email,
        subject: type === 'verify' ? "Verify Your Email Address" : "Your Email Has Been Verified! 🎉",
        html: type === 'verify' ? `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto;">
                <h2 style="color: #333;">Welcome to Affirm!</h2>
                <p style="font-size: 16px;">Thank you for signing up. Please click the link below to verify your email address and activate your account:</p>
                <a href="${verificationLink}" style="font-size: 16px; color: #007bff;">Verify Your Email</a>
                <p style="font-size: 14px; color: #555;">If you didn't sign up, you can safely ignore this email.</p>
                <p style="font-size: 14px; color: #555;">Best Regards,<br>Affirm Support Team</p>
            </div>
        `: `<div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto;">
            <h2 style="color: #333;">Welcome to Affirm!</h2>
            <p style="font-size: 16px;">Thank you for confirming your email address. You’re now all set to enjoy shopping with us. We’re thrilled to have you as part of our community, and we promise you’ll have a fantastic shopping experience.</br>
            Start exploring our amazing deals and products now, and enjoy all the perks of shopping exclusively with us!</p>
            <p style="font-size: 14px; color: #555;">Best Regards,<br>Affirm Support Team</p>
        </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Verification email sent successfully");
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
    }
};

const generateVerificationToken = (email) => {
    return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const generateAuthToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const signUp = async (email, name, password) => {
    try {
        const existingUser = await Customer.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = generateVerificationToken(email);

        const newUser = await Customer.create({
            email,
            name,
            password: hashedPassword,
            verified: false,
            verificationCode: verificationToken,
        });

        const verificationLink = `http://localhost:5000/auth/verify?token=${verificationToken}&email=${email}`;
        const emailType = 'verify';
        await sendConfirmationEmail(email, verificationLink, emailType);

        return { newUser };
    } catch (error) {
        throw new Error(error.message || 'An error occurred during sign-up');
    }
};

const verifyEmail = async (token, email) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await Customer.findOne({ where: { email: decoded.email } });

        console.log(user);
        if (!user) {
            throw new Error('User not found');
        }

        if (user.verified) {
            throw new Error('Email already verified');
        }
        await Customer.update({ verified: true, verificationCode: null }, { where: { email } });
        const emailType = 'success';
        const verificationLink = null;
        await sendConfirmationEmail(email, verificationLink, emailType);
        return { message: 'Email successfully verified!' };
    } catch (error) {
        throw new Error(error.message || 'An error occurred during email verification');
    }
};

const login = async (email, password) => {
    try {
        email = email?.trim();
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        const user = await Customer.findOne({ where: { email } });
        if (!user) {
            throw new Error('User does not exist');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid password');
        }

        // Ensure user is verified before generating a token
        if (!user.verified) {
            throw new Error('Please verify your email address first');
        }

        const token = generateAuthToken(user);
        return { token };
    } catch (error) {
        throw new Error(error.message || 'An error occurred during login');
    }
};

module.exports = {
    signUp,
    verifyEmail,
    login,
};
