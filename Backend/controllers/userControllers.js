import User from '../models/User.js';
import bcrypt from 'bcryptjs'; 

// 1. Get User Profile (Logged-in user ke liye)
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User nahi mila!' });
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// 2. Update Profile (Photo + Data update logic)
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User nahi mila!" });

    // 📸 Photo Update (If file exists from Multer/Cloudinary)
    if (req.file) {
      user.avatar = req.file.path; 
    }

    // 🛠️ Common Fields Update
    // Body se data uthao, agar nahi hai toh purana wala hi rehne do
    user.name = req.body.name || user.name;
    user.bio = req.body.bio || user.bio;
    user.location = req.body.location || user.location;
    user.githubUrl = req.body.githubUrl || user.githubUrl;
    user.linkedinUrl = req.body.linkedinUrl || user.linkedinUrl;
    user.portfolioUrl = req.body.portfolioUrl || user.portfolioUrl;

    // 🚀 Role-Specific Logic
    if (user.role === 'engineer') {
  if (req.body.skills) {
    // Agar frontend se "React, Node" jaisi string aa rahi hai
    if (typeof req.body.skills === 'string') {
      user.skills = req.body.skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s !== "");
    } else if (Array.isArray(req.body.skills)) {
      user.skills = req.body.skills;
    }
  }
  user.experience = req.body.experience || user.experience;
} else if (user.role === 'client') {
      // Mohit (Client) ke liye company field
      user.company = req.body.company || user.company;
    }

    const updatedUser = await user.save();
    
    // Security: Password hata do response se
    const userResponse = updatedUser.toObject();
    delete userResponse.password;
    
    res.json(userResponse);
  } catch (error) {
    console.error("Update Error:", error.message);
    res.status(500).json({ 
      message: "Update fail ho gaya lala!", 
      error: error.message 
    });
  }
};

// 3. Get Public Profile (Doosre users ke liye)
export const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: "Bhai, ye user nahi mila!" });
    }

    res.json(user);
  } catch (err) {
    console.error("Public Profile Error:", err);
    res.status(500).json({ message: "Server error: Profile fetch nahi ho payi." });
  }
};
// userControllers.js ke sabse neeche ye add kar

// 4. Get All Engineers (For AI Search Page default view)
export const getAllEngineers = async (req, res) => {
  try {
    // Database se saare engineers uthao, par unka password mat bhejna
    const engineers = await User.find({ role: 'engineer' }).select('-password');
    res.json(engineers);
  } catch (err) {
    console.error("Fetch Engineers Error:", err);
    res.status(500).json({ message: "Server error: Engineers fetch nahi ho paye." });
  }
};

// Opar bcrypt import zaroor karna!


export const updateUserSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Basic Info
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Role specific
    if (user.role === 'engineer') {
        user.skills = req.body.skills || user.skills;
        user.experience = req.body.experience || user.experience;
        user.portfolio = req.body.portfolio || user.portfolio;
    } else if (user.role === 'client') {
        user.companyDetails = req.body.companyDetails || user.companyDetails;
    }

    // 🔒 PROPER PASSWORD UPDATE LOGIC
    if (req.body.newPassword && req.body.currentPassword) {
      // 1. Check if current password is correct
      const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password galat hai bhai!" });
      }
      
      // 2. Hash new password and save
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.newPassword, salt);
    } else if (req.body.newPassword && !req.body.currentPassword) {
        return res.status(400).json({ message: "Puraana password bhi dena padega!" });
    }

    // Notifications
    if (req.body.notifications !== undefined) {
        user.notifications = req.body.notifications;
    }

    const updatedUser = await user.save();
    
    // Response se password hata do
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.json({
      user: userResponse,
      message: "Settings ekdum jhakaas update ho gayi! 🔥"
    });

  } catch (error) {
    console.error("Settings Update Error:", error);
    res.status(500).json({ message: 'Server error during settings update' });
  }
};