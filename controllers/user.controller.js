import User from "../models/user.model.js";
import Message from "../models/message.model.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // Find all messages involving the logged-in user
        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId },
                { receiverId: loggedInUserId }
            ]
        });

        // Extract unique user IDs from messages
        const userIds = new Set();
        messages.forEach(msg => {
            if (msg.senderId.toString() !== loggedInUserId.toString()) userIds.add(msg.senderId.toString());
            if (msg.receiverId && msg.receiverId.toString() !== loggedInUserId.toString()) userIds.add(msg.receiverId.toString());
        });

        // Find user details for these IDs
        const filteredUsers = await User.find({ _id: { $in: Array.from(userIds) } }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const searchUsers = async (req, res) => {
    try {
        const { email } = req.query;
        const loggedInUserId = req.user._id;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({
            email: email,
            _id: { $ne: loggedInUserId }
        }).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error in searchUsers: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: profilePic },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("error in update profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
