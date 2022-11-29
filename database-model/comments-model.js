import mongoose from "mongoose";
import commentSchema from "../schemas/comments-schema.js";

const commentsModel = mongoose.model(
    'CommentsModel', commentSchema
);
export default commentsModel;