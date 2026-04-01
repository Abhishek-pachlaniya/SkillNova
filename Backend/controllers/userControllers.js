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

// Backend/controllers/userController.js

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User nahi mila!" });

    // 🛠️ Sabke liye common fields update karo
    user.name = req.body.name || user.name;
    user.bio = req.body.bio || user.bio;
    user.location = req.body.location || user.location;

    // 🛠️ Role ke hisaab se fields handle karo
    if (user.role === 'engineer') {
      user.skills = req.body.skills || user.skills;
      user.experience = req.body.experience || user.experience;
      user.githubUrl = req.body.githubUrl || user.githubUrl;
      user.linkedinUrl = req.body.linkedinUrl || user.linkedinUrl;
      user.portfolioUrl = req.body.portfolioUrl || user.portfolioUrl;
    } else {
      // ✅ Mohit (Client) ke liye company field update
      user.company = req.body.company || user.company;
    }

    const updatedUser = await user.save();
    
    const userResponse = updatedUser.toObject();
    delete userResponse.password;
    res.json(userResponse);
  } catch (error) {
    // 🛑 Agar yahan error aaya toh hi "Update failed" dikhega
    res.status(500).json({ message: "Update failed!", error: error.message });
  }
};

// Get Public Profile of an Engineer
export const getPublicProfile = async (req, res) => {
  try {
    // ID se user dhoondo aur password field ko exclude (-password) kar do
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: "Bhai, ye user nahi mila!" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error: Profile fetch nahi ho payi." });
  }
};