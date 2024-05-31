import api from "../../api/auth";

const submitReport = (formData) => {
    return api.post("/submitReport", formData);
};

export { submitReport };