import api from "../../api/auth";

const LoginServices = (username, password) => {
    return api.post("/login", { username, password });
};

export { LoginServices };