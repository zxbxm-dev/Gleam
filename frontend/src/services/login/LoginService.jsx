import api from "../../api/auth";

const LoginServices = (username, password) => {
    return api.post("/login", { username, password });
};

const LogoutServices = (userID) => {
    return api.post("/logout", { userID });
};

export { LoginServices,LogoutServices };