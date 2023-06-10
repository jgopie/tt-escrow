const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const prisma = require('../config/dbConn');

// @desc Get all users
// @route GET /users
// @access Private

const getAllUsers = asyncHandler(async (req, res) => {
    const allUsers = await prisma.user.findMany();
    if (!allUsers) {
        return res.status(400).json({ message: "No Users Found" });
    }
    return res.json({ users: allUsers });
});

// @desc creates new User
// @route POST /users
// @access Private

const createNewUser = asyncHandler(async (req, res) => {
    const { userName, userEmail } = req.body;
    if (!userName || !userEmail) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Check for duplicate email
    const duplicate = await prisma.user.findFirst({ where: { email: userEmail } });

    if (duplicate) {
        return res.status(409).json({ message: "Duplicate Email Address" });
    }

    // TODO: Implement password functionality

    await prisma.user.create({
        data: {
            name: userName,
            email: userEmail
        }
    });

    res.status(201).json({ message: `New User ${userName} created` });
});

// @desc updates User
// @route PATCH /users
// @access Private

const updateUser = asyncHandler(async (req, res) => {
    const { userId, userName, userEmail, userActive } = req.body;

    if (!id || !userName || !userEmail || typeof userActive !== 'boolean') {
        return res.status(400).json({ message: 'All Fields are required.' });
    }

    const user = await prisma.user.findFirst({ where: { id: userId } });

    if (!user) {
        return res.status(400).json({ message: "User not found." });
    }
    // TODO: Password support

    await prisma.user.update({
        where: { id: userId },
        data: {
            name: userName,
            email: userEmail,
            active: userActive
        }
    });
    res.status(200).json({ message: "User successfully updated." });
});

// @desc deletes User
// @route DELETE /users
// @access Private

const deleteUser = asyncHandler(async (req, res) => {
    const { userID } = req.body;
    if (!id) {
        return res.status(400).json({ message: "User ID Required." });
    }
    // TODO: Check for active transactions before deleting user.
    const user = prisma.user.findFirst({ where: { id: userID } });

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    await prisma.user.delete({ where: { id: userID } });
    res.status(200).json({ message: "User deleted" });
});

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}