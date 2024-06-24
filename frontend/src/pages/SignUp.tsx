import { FC, useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import { UserService } from "../services/userService";

export const SignUp: FC = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    return (
        <div className="container mx-auto m-4">
            <Form
                onSubmit={async () => {
                    const user = await UserService.create(
                        name,
                        password,
                        email
                    );
                    if (user) navigate("logged");
                }}
                className="flex flex-col gap-4 frame p-4"
            >
                <label className="form-label">
                    Name
                    <input
                        value={name}
                        onChange={(ev) => {
                            setName(ev.target.value);
                        }}
                        type="text"
                        placeholder="name"
                        className="form-input"
                    ></input>
                </label>
                <label className="form-label">
                    Email
                    <input
                        value={email}
                        onChange={(ev) => {
                            setEmail(ev.target.value);
                        }}
                        type="email"
                        placeholder="email"
                        className="form-input"
                    ></input>
                </label>

                <label className="form-label">
                    Password
                    <input
                        value={password}
                        onChange={(ev) => {
                            setPassword(ev.target.value);
                        }}
                        type="password"
                        placeholder="password"
                        className="form-input"
                    ></input>
                </label>

                <button type="submit" className="form-btn">
                    submit
                </button>
            </Form>
        </div>
    );
};
