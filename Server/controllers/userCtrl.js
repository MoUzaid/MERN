const User=require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
};

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

const userCtrl = {
    registerUser: async (req, res) => {
        const { name, email, password } = req.body;
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ msg: "Email already registered" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ name, email, password: hashedPassword });
            await user.save();

            const accessToken = createAccessToken({ id: user._id });
            const refreshToken = createRefreshToken({ id: user._id });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            return res.status(201).json({ msg: "User registered successfully", accessToken, user });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    refreshToken: async (req, res) => {
        try {
            const rf_token = req.cookies.refreshToken;
            if (!rf_token) return res.status(400).json({ msg: "No refresh token provided" });

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(403).json({ msg: "Invalid or expired refresh token" });

                const accessToken = createAccessToken({ id: user.id }); // use `user.id` not `user._id`
                return res.json({ accessToken });
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ msg: "User does not exist" });

            const matched = await bcrypt.compare(password, user.password);
            if (!matched) return res.status(400).json({ msg: "Incorrect password" });

            const accessToken = createAccessToken({ id: user._id });
            const refreshToken = createRefreshToken({ id: user._id });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path: '/user/refresh_token',
            });

            return res.json({ msg: 'Logged In successfully', accessToken, user });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    logout: async (req, res) => {
        try {
            res.clearCookie('refreshToken', { path: '/user/refresh_token' });
            return res.json({ msg: "Logged Out" });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
  getUser: async (req, res) => {
    try {
        const user1 = await User.findById(req.user.id).select('-password');
        if (!user1) return res.status(404).json({ msg: "User not found" });

        return res.json(user1); // ✅ Send user data (excluding password)
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
},
addCart: async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(400).json({ msg: "User not found" });
    user.cart = req.body.cart;
    await user.save();

    return res.status(200).json({ msg: "Cart added successfully" });
  } catch (err) {
    console.error("Cart error:", err);
    return res.status(500).json({ msg: err.message });
  }
},
deleteCart: async (req, res) => {
    try {
        // console.log("user Id:"+userId);
        const idToRemove=req.params.id;
        const user=await User.findById(req.user.id);
        console.log("user:"+user);
        if(!user) return res.status(400).json({msg:"User not found"});
          user.cart = user.cart.filter(item => item._id.toString() !== idToRemove);
      // 3. Save updated user
      await user.save();
    return res.json({ msg: "Item removed from cart" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

UpdateAddress: async (req, res) => {
  try {
    const userId = req.user.id; // req.user should be set from your auth middleware
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { address: req.body }, // Update address with request body
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({
      msg: 'Address updated successfully',
      address: updatedUser.address,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
},
  DeleteAddress: async (req, res) => {
  try {
    const result = await User.findByIdAndUpdate(
      req.user.id,
      { $unset: { address: "" } },
      { new: true }
    );

    if (!result) return res.status(400).json({ msg: "User not found" });

    res.json({ msg: "Address deleted successfully" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}
};

module.exports = userCtrl;
