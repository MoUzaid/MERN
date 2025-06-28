const User = require('../models/User');

const authAdmin = async (req, res, next) => {
    try {
        const id = req.user.id; // Correct way to get user ID
        const user = await User.findById(id); // Use findById instead of findOne

        if (!user || user.role === 0) {
            return res.status(400).json({ msg: "Admin Resources Access Denied" });
        }

        next(); // Allow request to continue
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

module.exports = authAdmin;
