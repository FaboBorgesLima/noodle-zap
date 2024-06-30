import { Int32, ObjectId } from "mongodb";
export interface CommentSchema {
    _id: ObjectId;
    usr: {
        id: Int32;
        name: string;
    };
    text: string;
}
