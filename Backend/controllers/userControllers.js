import User from '../models/User.js';

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