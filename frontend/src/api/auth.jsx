import axios from 'axios';

const userToken = localStorage.getItem('user');

const api = axios.create({
    baseURL: '/api', // 백엔드 기본 url
    headers: {
        'Content-type': 'application/json',
        Authorization: userToken ? `Bearer ${userToken}` : '', // 토큰 값이 없을 경우 빈 문자열로 설정
    },
});

export default api;