import api from "../../api/auth";

const RegisterServices = (formData) => {
    return api.post("/postResData", formData);
};

export { RegisterServices };