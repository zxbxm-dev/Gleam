import api from "../../api/auth";

const WriteAnnounce = (formData) => {
    return api.post("/writeAnno", formData);
};

export { WriteAnnounce };
