const userSchema = {
    bsonType: "object",
    title: "user schema",
    required: ["id", "name", "email"],
    properties: {
        name: {
            bsonType: "string",
            minLength: 3,
            maxLength: 255,
        },
        id: {
            bsonType: "int",
        },
        email: {
            bsonType: "string",
        },
    },
};
const likeSchema = {
    bsonType: "object",
    title: "like schema",
    required: ["dt", "usr", "_id"],
    properties: {
        _id: {
            bsonType: "objectId",
        },
        usr: userSchema,
        dt: {
            bsonType: "date",
        },
    },
};
const commentSchema = {
    bsonType: "object",
    title: "comment schema",
    required: ["_id", "usr", "text", "dt"],
    properties: {
        _id: {
            bsonType: "objectId",
        },
        usr: userSchema,
        text: {
            bsonType: "string",
            minLength: 3,
            maxLength: 500,
        },
        dt: {
            bsonType: "date",
        },
        nLike: {
            bsonType: "int",
        },
        nComment: {
            bsonType: "int",
        },
    },
};
const postSchema = {
    bsonType: "object",
    title: "post schema",
    required: ["usr", "title", "text", "comments", "likes", "dt"],
    properties: {
        usr: userSchema,
        title: {
            bsonType: "string",
            minLength: 3,
            maxLength: 255,
        },
        text: {
            bsonType: "string",
            minLength: 3,
            maxLength: 5000,
        },
        comments: {
            bsonType: "array",
            items: commentSchema,
            maxItems: 10,
        },
        likes: {
            bsonType: "array",
            items: likeSchema,
            maxItems: 10,
        },
        dt: {
            bsonType: "date",
        },
    },
};

db.createUser({
    user: process.env.MONGO_INITDB_USERNAME,
    pwd: process.env.MONGO_INITDB_PASSWORD,
    roles: [{ role: "readWrite", db: process.env.MONGO_INITDB_DATABASE }],
});
db.createCollection("posts", {
    validator: {
        $jsonSchema: postSchema,
    },
});
db.createCollection("likes", {
    validator: {
        $jsonSchema: likeSchema,
    },
});
db.createCollection("comments", {
    validator: {
        $jsonSchema: commentSchema,
    },
});
