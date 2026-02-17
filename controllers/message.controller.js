import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import Group from "../models/group.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image,
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createGroup = async (req, res) => {
    try {
        const { name, participants } = req.body;
        const admin = req.user._id;

        const newGroup = new Group({
            name,
            admin,
            participants: [...participants, admin],
        });

        await newGroup.save();
        res.status(201).json(newGroup);
    } catch (error) {
        console.log("Error in createGroup controller: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getGroups = async (req, res) => {
    try {
        const userId = req.user._id;
        const groups = await Group.find({ participants: userId }).populate("admin", "fullName");
        res.status(200).json(groups);
    } catch (error) {
        console.log("Error in getGroups controller: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getGroupMessages = async (req, res) => {
    try {
        const { id: groupId } = req.params;
        const messages = await Message.find({ groupId });
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getGroupMessages controller: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const sendGroupMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: groupId } = req.params;
        const senderId = req.user._id;

        const newMessage = new Message({
            senderId,
            groupId,
            text,
            image,
        });

        await newMessage.save();

        const group = await Group.findById(groupId);
        group.participants.forEach(participantId => {
            if (participantId.toString() !== senderId.toString()) {
                const receiverSocketId = getReceiverSocketId(participantId.toString());
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("newGroupMessage", { ...newMessage._doc, groupId });
                }
            }
        });

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendGroupMessage controller: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
