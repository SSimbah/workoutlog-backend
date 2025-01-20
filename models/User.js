// import mongoose from "mongoose";

// const userSchema = new Schema({
//     username: { type: String, required: true },
//     email: { type: String, required: true },
//     password: { type: String, required: true },
//     dateCreated: { type: Date}
// });

// module.exports = {
//     Users: mongoose.model("Users", userSchema),
// };

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: [true, "Please provide username"] },
    email: { type: String, required: [true, "Please provide email"] },
    password: { type: String, required: [true, "Please provide a password"] }
});

const Users = mongoose.model("User", userSchema, "Users");

export default Users;
