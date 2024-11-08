import api from "../../api/auth";

const PersonData = () => {
    return api.get("/checkInformation");
};

const QuitterPersonData = () => {
    return api.get("/checkQuitterList");
}

export { PersonData, QuitterPersonData };
