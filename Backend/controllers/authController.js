import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js'; // 🚨 Dhyan rakhna ye file banayi ho

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// ==========================================
// 1. REGISTER USER (With Email Verification)
// ==========================================
export const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 🚨 NAYA: Verification Token Banao
        const verifyToken = crypto.randomBytes(20).toString('hex');
        const hashedVerifyToken = crypto.createHash('sha256').update(verifyToken).digest('hex');

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            isVerified: false, // Default false
            verificationToken: hashedVerifyToken
        });

        // 🚨 NAYA: Email Bhejo (Direct login nahi karwayenge ab)
        if (user) {
            const verifyUrl = `http://localhost:5173/verify-email/${verifyToken}`;
            const message = `
                <h3>Welcome to AI-HIRE! 🚀</h3>
                <p>Please verify your email to activate your account by clicking the link below:</p>
                <a href="${verifyUrl}" style="background: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Verify Email</a>
            `;

            try {
                await sendEmail({ to: user.email, subject: 'Verify your AI-HIRE Account', text: message });
                res.status(201).json({ message: "Signup successful! Please check your email to verify your account." });
            } catch (emailError) {
                // Agar email bhejne me error aayi toh user ko wapas delete kar do
                await User.findByIdAndDelete(user._id);
                return res.status(500).json({ message: 'Error sending verification email. Please try again.' });
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


// ==========================================
// 2. VERIFY EMAIL
// ==========================================
export const verifyEmail = async (req, res) => {
    try {
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({ verificationToken: hashedToken });

        if (!user) {
            return res.status(400).json({ message: 'Token invalid hai ya expire ho chuka hai!' });
        }

        // User verify ho gaya!
        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.status(200).json({ message: 'Email Verified successfully! Ab tu login kar sakta hai.' });
    } catch (error) {
        res.status(500).json({ message: 'Verification failed.', error: error.message });
    }
};


// ==========================================
// 3. LOGIN USER (With Verification Check)
// ==========================================
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            
            // 🚨 NAYA: Agar verify nahi hai toh block karo
            if (!user.isVerified) {
                return res.status(401).json({ message: 'Bhai pehle email verify kar le! Inbox check kar.' });
            }

            res.json({
                token: generateToken(user._id),
                user: { 
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar,
                }
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


// ==========================================
// 4. FORGOT PASSWORD
// ==========================================
export const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: "Bhai, is email se koi account nahi hai!" });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins expiry

        await user.save();

        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
        const message = `
            <h3>AI-HIRE Password Reset</h3>
            <p>Kisi ne password reset ki request daali hai. Agar ye tu hai, toh neeche click kar:</p>
            <a href="${resetUrl}" style="background: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Reset Password</a>
            <p>Ye link 10 minute mein expire ho jayega.</p>
        `;

        try {
            await sendEmail({ to: user.email, subject: 'AI-HIRE - Password Reset Request', text: message });
            res.status(200).json({ message: "Email bhej diya gaya hai! Inbox check kar." });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({ message: "Email bhejne mein error aayi." });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error in forgot password", error: error.message });
    }
};


// ==========================================
// 5. RESET PASSWORD
// ==========================================
export const resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Token invalid hai ya expire ho chuka hai!" });
        }

        // 🚨 NAYA: Naye password ko hash karna zaroori hai
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ message: "Mubarak ho! Password reset successful." });
    } catch (error) {
        res.status(500).json({ message: "Server error in reset password", error: error.message });
    }
};