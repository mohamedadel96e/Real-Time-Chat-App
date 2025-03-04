import Group from "../models/Group.js";

// Create a Group
export const createGroup = async (req, res) => {
    try {
        const { name, description, members } = req.body;
        const group = await Group.create({ name, description, members, admins: [req.user.id] });
        res.status(201).json(group);
    } catch (error) {
        res.status(500).json({ message: "Error creating group", error });
    }
};

// Add Member to Group
export const addMember = async (req, res) => {
    try {
        await Group.findByIdAndUpdate(req.params.groupId, { $addToSet: { members: req.body.userId } });
        res.status(200).json({ message: "Member added" });
    } catch (error) {
        res.status(500).json({ message: "Error adding member", error });
    }
};

// Remove Member from Group
export const removeMember = async (req, res) => {
    try {
        await Group.findByIdAndUpdate(req.params.groupId, { $pull: { members: req.body.userId } });
        res.status(200).json({ message: "Member removed" });
    } catch (error) {
        res.status(500).json({ message: "Error removing member", error });
    }
};

// Delete a Group
export const deleteGroup = async (req, res) => {
    try {
        await Group.findByIdAndDelete(req.params.groupId);
        res.status(200).json({ message: "Group deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting group", error });
    }
};
