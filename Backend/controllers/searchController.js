// controllers/searchController.js
import User from '../models/User.js';
import Project from '../models/Project.js';

export const globalSearch = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ engineers: [], clients: [], projects: [], pages: [] });

    const regex = new RegExp(q, 'i');

    // 1. Engineers Search
    const engineers = await User.find({
      role: 'engineer',
      $or: [{ name: regex }, { skills: regex }]
    }).limit(3).select('name avatar role skills');

    // 2. Clients Search (🆕 Naya Section)
    const clients = await User.find({
      role: 'client',
      $or: [{ name: regex }, { company: regex }]
    }).limit(3).select('name avatar role company');

    // 3. Projects Search
    const projects = await Project.find({
      $or: [{ title: regex }, { description: regex }, { tags: regex }]
    }).limit(4).select('title budget status');

    // 4. Static Pages
    const pages = [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Settings', path: '/settings' },
      { name: 'Profile', path: '/profile' },
      { name: 'Chat Matrix', path: '/chat' }
    ].filter(p => p.name.toLowerCase().includes(q.toLowerCase()));

    res.status(200).json({ engineers, clients, projects, pages });
  } catch (error) {
    res.status(500).json({ message: "Search failed", error: error.message });
  }
};