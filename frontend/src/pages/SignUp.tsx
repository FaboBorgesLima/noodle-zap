import { FC, useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import { UserService } from "../services/userService";

export const SignUp: FC = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [error, setError] = useState({
        email: "",
        name: "",
        password: "",
        repeatPassword: "",
    });
    const navigate = useNavigate();

    function onChangePassword(password: string, repeatPassword: string) {
        setPassword(password);

        setRepeatPassword(repeatPassword);

        let errorClone = { ...error };

        if (password != repeatPassword) {
            errorClone.repeatPassword = "password does not match";
        } else {
            errorClone.repeatPassword = "";
        }

        if (password.length < 6) {
            errorClone.password = "password must contain atleast 6 characters";
        } else {
            errorClone.password = "";
        }

        setError(errorClone);
    }

    return (
        <div className="container mx-auto m-4">
            <Form
                onSubmit={async () => {
                    const user = await UserService.create(
                        name.trim(),
                        password,
                        email
                    );
                    if (error.email || error.name || error.password) return;

                    if (user) {
                        navigate("/logged", { replace: true });
                        return;
                    }

                    setError({
                        ...error,
                        email: "email or name already exits",
                        name: "email or name already exits",
                    });
                }}
                className="flex flex-col gap-4 frame p-4 lg:w-1/2 mx-auto"
            >
                <label className="form-label text-center">
                    Name
                    <input
                        value={name}
                        onChange={(ev) => {
                            const newName = ev.target.value.trimStart();
                            setName(newName);

                            const errorClone = { ...error };

                            if (newName.trimEnd().length < 3) {
                                errorClone.name =
                                    "name must contain atleast 3 characters";
                            } else {
                                errorClone.name = "";
                            }

                            setError(errorClone);
                        }}
                        type="text"
                        placeholder="name"
                        required
                        className={`form-input ${
                            error.name
                                ? "border border-solid border-red-500"
                                : ""
                        }`}
                        pattern=".{3,}"
                    ></input>
                </label>
                {error.name ? (
                    <span className="text-center text-bold font-bold text-red-500">
                        {error.name}
                    </span>
                ) : (
                    <></>
                )}
                <label className="form-label text-center">
                    Email
                    <input
                        value={email}
                        onChange={(ev) => {
                            setEmail(ev.target.value);
                            setError({ ...error, email: "" });
                        }}
                        type="email"
                        required
                        placeholder="email"
                        className={`form-input ${
                            error.email
                                ? "border border-solid border-red-500"
                                : ""
                        }`}
                    ></input>
                </label>
                {error.email ? (
                    <span className="text-center text-bold font-bold text-red-500">
                        {error.email}
                    </span>
                ) : (
                    <></>
                )}
                <label className="form-label text-center">
                    Password
                    <input
                        value={password}
                        onChange={(ev) => {
                            onChangePassword(ev.target.value, repeatPassword);
                        }}
                        type="password"
                        required
                        pattern=".{6,}"
                        placeholder="password"
                        className="form-input "
                    ></input>
                </label>
                {error.password ? (
                    <span className="text-center text-bold font-bold text-red-500">
                        {error.password}
                    </span>
                ) : (
                    <></>
                )}
                <label className="form-label text-center ">
                    Repeat Password
                    <input
                        value={repeatPassword}
                        onChange={(ev) => {
                            onChangePassword(password, ev.target.value);
                        }}
                        type="password"
                        placeholder="password"
                        className={`form-input ${
                            error.repeatPassword
                                ? "border border-solid border-red-500"
                                : ""
                        }`}
                        required
                    ></input>
                </label>
                {error.repeatPassword ? (
                    <span className="text-center text-bold font-bold text-red-500">
                        {error.repeatPassword}
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
