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
            properties: {
                usr: {
                    bsonType: "object",
                    title: "user that made the post",
                    properties: {
                        name: {
                            bsonType: "string",
                            minLength: 3,
                            maxLength: 255,
                        },
                        usrId: {
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
                        properties: {
                            name: {
                                bsonType: "string",
                                minLength: 3,
                                maxLength: 255,
                            },
                            usrId: {
                                bsonType: "int",
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
