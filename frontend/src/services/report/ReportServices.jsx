import api from "../../api/auth";

const submitReport = (formData) => {
    return api.post("/submitReport", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

const uploadOutline = (formData) => {
    return api.post("/uploadOutline", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

const getOutline = () => {
    return api.get("/getOutline");
};

export { submitReport, uploadOutline, getOutline };