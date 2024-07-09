import { FC, useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import { UserService } from "../services/userService";

export const Login: FC = () => {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="container mx-auto m-4 grow">
            <Form
                onSubmit={async () => {
                    const user = await UserService.login(email, password);
                    if (user) {
                        navigate("/logged");
                        return;
                    }

                    setError(true);
                }}
                className="flex flex-col gap-4 frame p-4 lg:w-1/2 mx-auto"
            >
                <label className="form-label text-center">
                    Email
                    <input
                        value={email}
                        onChange={(ev) => {
                            setError(false);
                            setEmail(ev.target.value);
                        }}
                        type="email"
                        placeholder="email"
                        className="form-input"
                    ></input>
                </label>
                <label className="form-label text-center">
                    Password
                    <input
                        value={password}
                        onChange={(ev) => {
                            setError(false);
                            setPassword(ev.target.value);
                        }}
                        type="password"
                        placeholder="password"
                        className="form-input"
                    ></input>
                </label>
                {error ? (
                    <span className="text-red-500 font-bold text-center">
                        password or email incorrect
                    </span>
                ) : (
                    <></>
                )}
                <button type="submit" className="form-btn">
                    submit
                </button>
            </Form>
        </div>
    );
};
