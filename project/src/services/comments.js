// описать класс со статическими методами
const path = require("path");
const commentsModel = require(path.join(__dirname, "../models/comments.js"));
const postsModel = require(path.join(__dirname, "../models/posts.js"));
const { ObjectId } = require("bson");


class CommentsSecvice {
    static async createComment(userid, commentdata) {
        const postId = commentdata.postId;
        let text = commentdata.text;
        const userId = userid;

        const comment = {
            author: new ObjectId(userId),
            text: text,
            dateTime: new Date(),
            likes: 0
        }

        const newComment = new commentsModel(comment);
        const createdComment = await newComment.save();

        const foundPost = await postsModel.updateOne(
            { _id: postId },
            { $push: { comments: createdComment.toObject()._id } }
        );
        return createdComment.toObject();
    };

    static async getCommentById(commentid) {
        const commentId = commentid;
        const comment = await commentsModel.findById(commentId)
            .populate({ path: "author" });
        if (!comment) {
            throw new Error("comment not found");
        }
        return comment.toObject();
    };

    static async putCommentById(userid, commentid, updateddata) {
        const userId = userid;
        const commentId = commentid;
        const updatedData = updateddata;

        let updatedComment = null;

        const foundComment = await commentsModel.findById(commentId);
        if (!foundComment) {
            throw new Error("Comment not found");
        }
        // let likes = foundComment.toObject().likes;

        if (!(new ObjectId(userId)).equals(foundComment.toObject().author)) {
            throw new Error("Unauthorized to update this comment");
        };

        let obj = {};
        if (updatedData.text) {
            obj.text = updatedData.text;
        };

        updatedComment = await commentsModel.findByIdAndUpdate(
            commentId,
            { $set: obj },
            { new: true }
        );
        return updatedComment.toObject();
    };

    static async deleteCommentById(userid, commentid) {
        const userId = userid;
        const commentId = commentid;

        const foundComment = await commentsModel.findById(commentId);
        if (!foundComment) {
            throw new Error("Comment not found");
        }

        if (!(new ObjectId(userId)).equals(foundComment.toObject().author)) {
            throw new Error("Unauthorized to delete this comment");
        };
        const deletedComment = await commentsModel.findByIdAndDelete(commentId);

        return deletedComment.toObject();
    };

    static async getComments() { };
};

module.exports = CommentsSecvice;