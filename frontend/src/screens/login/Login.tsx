import React, { useState } from 'react';
import "./Login.scss";
import { useNavigate } from "react-router-dom";
import {
  Login_Logo,
} from "../../assets/images/index";
import { useRecoilState } from 'recoil';
import { userState } from '../../recoil/atoms';
import { Input } from '@chakra-ui/react';

type Member = [string, string, string, string, string, string];

interface User {
  id: string;
  pw: string;
  name: string;
  department: string;
  team: string;
  position: string;
}

const Login = () => {
  let navigate = useNavigate();
  const [user, setUser] = useRecoilState<User>(userState);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const members: Member[] = [
    ['id1', 'pw1', '이정훈', '포체인스 주식회사', '', '대표'],
    ['id2', 'pw2', '안후상', '포체인스 주식회사', '', '이사'],
    ['id3', 'pw3', '이정열', '관리부', '', '부서장'],
    ['id4', 'pw4', '김효은', '관리부', '관리팀', '팀장'],
    ['id5', 'pw5', '우현지', '관리부', '관리팀', '사원'],
    ['id6', 'pw6', '염승희', '관리부', '관리팀', '사원'],
    ['id7', 'pw7', '김태희', '관리부', '지원팀', '팀장'],
    ['id8', 'pw8', '진유빈', '개발부', '', '부서장'],
    ['id9', 'pw9', '장현지', '개발부', '개발 1팀', '사원'],
    ['id10', 'pw10', '권채림', '개발부', '개발 1팀', '사원'],
    ['id11', 'pw11', '구민석', '개발부', '개발 1팀', '사원'],
    ['id12', 'pw12', '변도일', '개발부', '개발 2팀', '팀장'],
    ['id13', 'pw13', '이로운', '개발부', '개발 2팀', '사원'],
    ['id14', 'pw14', '권상원', '블록체인 사업부', '', '부서장'],
    ['id15', 'pw15', '권준우', '블록체인 사업부', '블록체인 1팀', '사원'],
    ['id16', 'pw16', '김도환', '블록체인 사업부', '블록체인 1팀', '사원'],
    ['id17', 'pw17', '김현지', '마케팅부', '', '부서장'],
    ['id18', 'pw18', '전아름', '마케팅부', '기획팀', '팀장'],
    ['id19', 'pw19', '홍다슬', '마케팅부', '기획팀', '사원'],
    ['id20', 'pw20', '서주희', '마케팅부', '디자인팀', '사원'],
  ];

  const handleLogin = () => {
    const foundMember = members.find(member => member[0] === username && member[1] === password);
    if (foundMember) {
      const [userId, userPw, name, department, team, position] = foundMember;
      setUser({
        id: userId,
        pw: userPw,
        name,
        department,
        team,
        position
      });
      console.log(user);
      navigate('/announcement');
    } else {
      alert('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };
  
  return (
    <div className="login_container">
      <img src={Login_Logo} alt="Login_Logo" />
      <Input
        width='20vw'
        placeholder='아이디'
        size='lg'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <Input
        width='20vw'
        placeholder='비밀번호'
        size='lg'
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button className="login_btn" onClick={handleLogin}>로그인</button>
    </div>
  );
};

export default Login;