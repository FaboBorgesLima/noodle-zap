import { FC } from "react";
import { UserMongoDb } from "../schemas/userMongodb";

type MiniProfileProps = { user: UserMongoDb };

export const MiniProfile: FC<MiniProfileProps> = (props) => {
    return (
        <section>
            <h2 className="text-2xl font-bold">{props.user.name}</h2>
        </section>
    );
};
