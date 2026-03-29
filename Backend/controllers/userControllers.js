import User from '../models/User.js';

// Get User Profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update User Profile
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            // Basic fields update
            user.name = req.body.name || user.name;
            user.bio = req.body.bio || user.bio;
            user.location = req.body.location || user.location;
            user.githubUrl = req.body.githubUrl || user.githubUrl;
            user.linkedinUrl = req.body.linkedinUrl || user.linkedinUrl;
            user.websiteUrl = req.body.websiteUrl || user.websiteUrl;

            // ✅ SKILLS PARSING FIX: Backend mein handle karo string to array conversion
            if (req.body.skills) {
                // String "React, Node" ko array ["React", "Node"] mein convert karo
                user.skills = req.body.skills.split(',').map(skill => skill.trim()).filter(Boolean);
            }

            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};