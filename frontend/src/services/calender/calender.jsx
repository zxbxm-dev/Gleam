import api from "../../api/auth";

const writeCalen = (formData) => {
    return api.post("/writecalender", formData);
};

export { writeCalen };
