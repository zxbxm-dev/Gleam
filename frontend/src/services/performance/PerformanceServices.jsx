import api from "../../api/auth";

// 인사평가 조회
const CheckPerform = (params) => {
  const queryString = `?username=${params.username}&userID=${params.userID}`;
  return api.get("/checkPerform" + queryString);
}

// 인사평가 제출
const WritePerform = (formData) => {
  return api.post("/writePerform", formData , {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// 인사평가 상세조회
const DetailPerform = (params) => {
  const queryString = `?filename=${params.filename}`;
  return api.get("/fileDetails" + queryString, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/pdf',
    }
  });
};

// 인사평가 삭제
const DeletePerform = async (params) => {
  const queryString = `?filename=${params.filename}`;
  return api.delete("/deleteFile" + queryString);
};

export { CheckPerform, WritePerform, DetailPerform, DeletePerform };