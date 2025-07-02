const mongoose = require("mongoose");
const Schema = mongoose.Schema;




const postSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        default: "https://images.pexels.com/photos/1324803/pexels-photo-1324803.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        type: String,
        set: (v) => v === "" ? "https://images.pexels.com/photos/1324803/pexels-photo-1324803.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" : v,
    },
    comment: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

const Post = mongoose.model("Post", postSchema);

module.exports = Post;

