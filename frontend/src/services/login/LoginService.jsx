import api from "../../api/auth";

const LoginServices = (userID, password) => {
    return api.post("/login", { userID, password });
};

const LogoutServices = () => {
    return api.post("/logout");
};

export { LoginServices,LogoutServices };