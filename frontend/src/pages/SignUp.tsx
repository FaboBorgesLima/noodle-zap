import { FC, useEffect, useState } from "react";
import { Form } from "react-router-dom";
import { instance } from "../connection/instance";

export const SignUp: FC = () => {
    const [response, setResponse] = useState({});
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    return (
        <div className="container mx-auto">
            <Form
                onSubmit={async () => {
                    setResponse(
                        await instance.post("/api/user/create", {
                            name: name,
                            email: email,
                            password: password,
                        })
                    );

                    console.log(response);
                }}
            >
                <input
                    value={name}
                    onChange={(ev) => {
                        setName(ev.target.value);
                    }}
                    type="text"
                    placeholder="name"
                ></input>
                <input
                    value={password}
                    onChange={(ev) => {
                        setPassword(ev.target.value);
                    }}
                    type="text"
                    placeholder="password"
                ></input>
                <input
                    value={email}
                    onChange={(ev) => {
                        setEmail(ev.target.value);
                    }}
                    type="email"
                    placeholder="email"
                ></input>
                <button type="submit">submit</button>
            </Form>
        </div>
    );
};
