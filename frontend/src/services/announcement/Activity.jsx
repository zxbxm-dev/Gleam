import api from "../../api/auth";

const WriteActiv = (formData) => {
    return api.post("/writeActivity", formData);
};

export { WriteActiv };
