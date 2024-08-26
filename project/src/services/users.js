// описать класс со статическими методами
const path = require("path");
const usersModel = require(path.join(__dirname, "../models/users.js"));
const bcrypt = require(path.join(__dirname, "../core/bcrypt.js"));
const { ObjectId } = require("bson");

class UsersSecvice {
    static async createUser(email, username, password) {
        if (typeof email !== "string") {
            throw new Error("email must be a string");
        };
        if (email.trim() === "") {
            throw new Error("email required");
        };
        if (typeof username !== "string") {
            throw new Error("username must be a string");
        };
        if (username.trim() === "") {
            throw new Error("username required");
        };
        if (typeof password !== "string") {
            throw new Error("password must be a string");
        };
        if (password.trim() === "") {
            throw new Error("password required");
        };

        const foundUser = await usersModel.findOne({ email: email });
        if (foundUser) {
            throw new Error("user with this email already exists");
        };
        //hash password
        const hashedPassword = await bcrypt.hashPass(password);
        const user = {
            email: email,
            username: username,
            password: hashedPassword,
            followers: [],
            following: [],
            blocks: [],
            bio: "",
            avatar: "",
        }

        const newUser = new usersModel(user);
        const createdUser = await newUser.save();
        return createdUser;
    };

    static async getUser(email, password) {
        if (typeof email !== "string") {
            throw new Error("email must be a string");
        };
        if (email.trim() === "") {
            throw new Error("email required");
        };
        const regExp = /^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/g;
        if (!regExp.test(email)) {
            throw new Error("invalid email");
        };
        if (typeof password !== "string") {
            throw new Error("password must be a string");
        };
        if (password.trim() === "") {
            throw new Error("password required");
        };

        const foundUser = (await usersModel.findOne({ email: email })).toObject();
        if (!foundUser) {
            throw new Error("user not found");
        };
        const isPasswordMatch = await bcrypt.comparePass(password, foundUser.password);
        if (!isPasswordMatch) {
            throw new Error("incorrect password");
        };
        return foundUser;
    }

    static async getUserById(id) {
        if (typeof id !== "string") {
            throw new Error("user id must be a string");
        };
        if (id.trim() === "") {
            throw new Error("user id required");
        };
        const userId = id;
        const user = await usersModel.findById({ _id: new ObjectId(userId) })
            .populate("followers")
            .populate("following")
            .populate("blocks");
        if (!user) {
            throw new Error("user not found");
        }
        return user.toObject();
    };

    static async putUserById(id, updatedData) {
        //Добавить замену пароля(хеширование) и аватарки
        if (typeof id !== "string") {
            throw new Error("user id must be a string");
        };
        if (id.trim() === "") {
            throw new Error("user id required");
        };
        if (!updatedData) {
            throw new Error("no data for update");
        }
        const userId = id;
        let updatedUser = null;
        if (updatedData.email || updatedData.username || updatedData.password || updatedData.bio || updatedData.avatar) {
            updatedUser = await usersModel.findByIdAndUpdate(
                userId,
                updatedData,
                { new: true });
        }

        if (updatedData.followers || updatedData.following || updatedData.blocks) {
            let user = await usersModel.findById({ _id: new ObjectId(userId) });
            if (!user) {
                throw new Error("user not found");
            }
            user = user.toObject();

            for (let [field, value] of Object.entries(updatedData)) {
                let obj = {};
                obj[field] = updatedData[`${field}`];
                if (user[field].some(item => item.equals(new ObjectId(value)))) {
                    updatedUser = await usersModel.findByIdAndUpdate(
                        userId,
                        { $pull: obj },
                        { new: true }
                    );
                } else {
                    updatedUser = await usersModel.findByIdAndUpdate(
                        userId,
                        { $addToSet: obj },
                        { new: true }
                    );
                }
            }
        };

        if (!updatedUser) {
            throw new Error("user not found");
        }
        return updatedUser;
    };

    static async deleteUserById(id) {
        if (typeof id !== "string") {
            throw new Error("user id must be a string");
        };
        if (id.trim() === "") {
            throw new Error("user id required");
        };
        const userId = id;
        const foundUser = await usersModel.findByIdAndDelete(userId)
            .populate("followers")
            .populate("following")
            .populate("blocks");
        if (!foundUser) {
            throw new Error("user not found");
        }
        return foundUser.toObject();
    };

    static async getUsers() { };
}

module.exports = UsersSecvice;