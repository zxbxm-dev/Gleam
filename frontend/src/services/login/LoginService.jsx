import api from "../../api/auth";

const LoginServices = (userID, password) => {
    return api.post("/login", { userID, password });
};

const LogoutServices = (userID) => {
    return api.post("/logout", { userID });
};

export { LoginServices,LogoutServices };