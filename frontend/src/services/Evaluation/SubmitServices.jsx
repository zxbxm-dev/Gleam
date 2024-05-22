import api from "../../api/auth";

const FileSubmit = (formData) => {
    return api.post("/fileSubmit", formData);
};

export { FileSubmit };
