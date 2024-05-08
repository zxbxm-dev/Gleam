import React, { useState } from 'react';
import "./Login.scss";
import { useNavigate } from "react-router-dom";
import {
  Login_Logo,
} from "../../assets/images/index";
// import { userState } from '../../recoil/atoms';
import { Input } from '@chakra-ui/react';
// import { useRecoilState } from 'recoil';
import { LoginServices } from "../../services/login/LoginService";
import {
  Modal,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  useDisclosure,
  ModalBody,
} from '@chakra-ui/react';
import { Link } from "react-router-dom";

const Login = () => {
  let navigate = useNavigate();
  const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: isAddModalClose } = useDisclosure();
  const { isOpen: isViewModalOpen, onOpen: onViewModalOpen, onClose: onViewModalClose } = useDisclosure();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await LoginServices(username, password);

      navigate('/announcement');
    } catch (error) {
      console.error('Login failed:', error);
      onAddModalOpen();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login_container">
      <img className='Linker' src={Login_Logo} alt="Login_Logo" />
      <Input
        placeholder='아이디를 입력해 주세요. '
        size='lg'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyPress={handleKeyPress}
        className='InputClass'
        focusBorderColor='#746E58.400'
      />
      <Input
        placeholder='패스워드를 입력해 주세요.'
        size='lg'
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyPress}
        className='InputClass'
        focusBorderColor='#746E58.400'
      />
      <button className="login_btn" onClick={handleLogin}>로그인</button>

      <div className='GoRegis'>
        <Link to="/register" className='span'>회원가입</Link>&nbsp; | &nbsp;<Link to="/findId" className='span'>아이디 찾기</Link>&nbsp; | &nbsp;<Link to="resetpw" className='span'>비밀번호 재설정</Link>
      </div>
      <Modal isOpen={isAddModalOpen} onClose={isAddModalClose} size='xl' isCentered={true}>
        <ModalContent width="400px" height='200px' borderRadius='5px'>
          <ModalHeader className='ModalHeader' paddingLeft="15px" height='34px' color='white' bg='#746E58' border='0' fontFamily='var(--font-family-Noto)' borderTopRadius='5px' fontSize="14px">알림</ModalHeader>
          <ModalBody className='ModalBody'>
            아이디 또는 패스워드가 다릅니다.
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Login;