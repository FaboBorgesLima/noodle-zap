db.createUser({
    user: process.env.MONGO_INITDB_USERNAME,
    pwd: process.env.MONGO_INITDB_PASSWORD,
    roles: [{ role: "readWrite", db: process.env.MONGO_INITDB_DATABASE }],
});
db.createCollection("posts", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            title: "posts object",
            required: ["usr", "title", "text", "comments"],
            properties: {
                usr: {
                    bsonType: "object",
                    title: "user that made the post",
                    required: ["id", "name"],
                    properties: {
                        name: {
                            bsonType: "string",
                            minLength: 3,
                            maxLength: 255,
                        },
                        id: {
                            bsonType: "int",
                        },
                    },
                },
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
                    items: {
                        bsonType: "object",
                        title: "user that made the comment",
                        required: ["_id", "usr", "text"],
                        properties: {
                            _id: {
                                bsonType: "objectId",
                            },
                            usr: {
                                title: "user that commented",
                                bsonType: "object",
                                required: ["id", "name"],
                                properties: {
                                    id: {
                                        bsonType: "int",
                                    },
                                    name: {
                                        bsonType: "string",
                                        minLength: 3,
                                        maxLength: 255,
                                    },
                                },
                            },
                            text: {
                                bsonType: "string",
                                minLength: 3,
                                maxLength: 500,
                            },
                        },
                    },
                },
            },
        },
    },
});
