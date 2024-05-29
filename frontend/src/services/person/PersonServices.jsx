import api from "../../api/auth";

const PersonData = () => {
    return api.get("/checkInformation");
};

export { PersonData };
