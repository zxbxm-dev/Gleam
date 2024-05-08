import api from "../../api/auth";

const WriteRegul = (formData) => {
    return api.post("/writeRegul", formData);
};

export { WriteRegul };
