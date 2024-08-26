// описать класс со статическими методами
const path = require("path");
const postsModel = require(path.join(__dirname, "../models/posts.js"));
const { ObjectId } = require("bson");

class PostsSecvice {
    static async createPost(userid, postdata) {
        const userId = userid;
        const postData = postdata;

        const post = {
            author: new ObjectId(userId),
            likes: 0,
            comments: [],
            created: new Date()
        }

        Object.entries(postData).forEach(([key, value]) => {
            post[key] = value;
        });

        const newPost = new postsModel(post);
        const createdPost = await newPost.save();
        return createdPost.toObject();
    };

    static async getPostById(postid) {
        const postId = postid;
        const post = await postsModel.findById(postId)
            .populate({ path: "author" })
            .populate("comments");
        if (!post) {
            throw new Error("post not found");
        }
        return post.toObject();
    };

    static async putPostById(userid, postid, updateddata) {
        const userId = userid;
        const postId = postid;
        const updatedData = updateddata;

        let updatedPost = null;

        const foundPost = await postsModel.findById(postId);
        if (!foundPost) {
            throw new Error("Post not found");
        }
        // let likes = foundPost.toObject().likes;

        if (!(new ObjectId(userId)).equals(foundPost.toObject().author)) {
            throw new Error("Unauthorized to update this post");
        };

        let obj = {};
        if (updatedData.content) {
            obj.content = updatedData.content;
        };
        if (updatedData.image) {
            obj.image = updatedData.image;
        };
        updatedPost = await postsModel.findByIdAndUpdate(
            postId,
            { $set: obj },
            { new: true }
        );
        return updatedPost.toObject();
    };

    //для лайков и комментариев сделать отдельный энпоинт
    // if (updatedData.likes || updatedData.comments) {
    //     let obj = null;
    //     Object.entries(updatedData).forEach((key, value) => {
    //         obj[key] = value;
    //     });
    //     updatedPost = await postsModel.findByIdAndUpdate(
    //         postId,
    //         { $addToSet: obj },
    //         { new: true }
    //     );
    // }


    static async deletePostById(userid, postid) {
        const userId = userid;
        const postId = postid;

        const foundPost = await postsModel.findById(postId);
        if (!foundPost) {
            throw new Error("Post not found");
        }

        if (!(new ObjectId(userId)).equals(foundPost.toObject().author)) {
            throw new Error("Unauthorized to delete this post");
        };
        const deletedPost = await postsModel.findByIdAndDelete(postId)
            .populate("comments");

        return deletedPost.toObject();
    };

    static async getPosts() { };
};

module.exports = PostsSecvice;