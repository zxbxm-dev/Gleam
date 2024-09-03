import api from "../../api/auth";

const createRoom = (payload) => {
  return api.post("/rooms", payload);
};


export { createRoom };
