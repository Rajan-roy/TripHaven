const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");
const Listing = require("./listing"); // ✅ Add this line

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
});

userSchema.plugin(passportLocalMongoose);

// ✅ Middleware to auto-delete listings when user is deleted
userSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Listing.deleteMany({ owner: doc._id });
        console.log(`Deleted all listings of deleted user: ${doc.username}`);
    }
});

module.exports = mongoose.model("User", userSchema);
