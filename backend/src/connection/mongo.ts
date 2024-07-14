import { MongoClient } from "mongodb";
import { env } from "../config/env";

const uri = `mongodb://${env.MONGO_INITDB_USERNAME}:${env.MONGO_INITDB_PASSWORD}@mongo:27017/${env.MONGO_INITDB_DATABASE}`;

export const mongoClient = new MongoClient(uri);
