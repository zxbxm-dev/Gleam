import "./OrgChart.scss";
import { Link } from "react-router-dom";
import {
  FourchainsLogo,
  UserIcon_dark,
  UserIcon,
} from "../../../assets/images/index";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { Tree, TreeNode } from 'react-organizational-chart';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  Portal,
} from '@chakra-ui/react';

const OrgChart = () => {
  return (
    <div className="content">
      <div className="content_header">
        <div className="main_header">조직문화</div>
        <div className="main_header">＞</div>
        <Link to={"/orgchart"} className="sub_header">인사조직도</Link>
      </div>

      <div className="content_container">
        <Tabs variant='enclosed'>
          <TabList>
            <Tab _selected={{ bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)' }} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)'>본사</Tab>
            <Tab _selected={{ bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)' }} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)'>R&D 연구센터</Tab>
          </TabList>

          <TabPanels bg='white' border='1px solid #DEDEDE' borderBottomRadius='10px' borderRightRadius='10px' className="tab_container">
            <TabPanel display='flex' marginRight="70px" justifyContent='center' className="TabPanel">
              <div className="FC_logo">
                <img src={FourchainsLogo} alt="FourchainsLogo" className="Logoimg" />
                <p className="MenuName">인사 조직도</p>
              </div>

              <Tree 
                lineWidth={'1px'} 
                lineColor={'#D3D3D3'} 
                label={
                  <Popover placement="right">
                    <PopoverTrigger>
                      <div className="nodeicon"> 
                        <div className="nodeicon_content">
                          <span>대표이사</span>
                          <img src={UserIcon_dark} alt="UserIcon_dark" className="UserIcon"/> 
                          <div>이정훈 | 대표</div>
                        </div>
                      </div>
                    </PopoverTrigger>
                    <Portal>
                      <PopoverContent width='400px' height='200px' border='0' borderRadius='1px' marginTop='10px' marginRight='10px' boxShadow='rgba(100, 100, 111, 0.1) 0px 7px 29px 0px'>
                        <PopoverHeader height='34px' color='white' bg='#746E58' border='0' fontFamily= 'var(--font-family-Noto-B)' fontSize='14px' borderTopRightRadius='5px' borderTopLeftRadius='5px'>대표이사</PopoverHeader>
                        <PopoverCloseButton color='white' />
                        <PopoverBody display='flex' flexDirection='row' alignItems='center' borderBottomLeftRadius='5px' borderBottomRightRadius='5px'>
                          <div style={{width: '140px', height: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center' ,justifyContent: 'center'}}>
                            <img src={UserIcon} alt="UserIcon" style={{ width: '70px', height: '70px' }}/>
                            <div style={{fontSize: '16px', fontFamily: 'var(--font-family-Noto-M)'}}>이정훈</div>
                            <div style={{fontSize: '16px', fontFamily: 'var(--font-family-Noto-M)'}}>대표이사</div>
                          </div>
                          <div style={{width: '300px', height: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                            <div style={{fontSize: '14px', color: '#909090', fontFamily: 'var(--font-family-Noto-M)'}}>연락처</div>
                            <div style={{fontSize: '16px', fontFamily: 'var(--font-family-Noto-M)'}}>010-0000-0000</div>
                            <div style={{fontSize: '14px', color: '#909090', fontFamily: 'var(--font-family-Noto-M)', marginTop: '20px'}}>메일주소</div>
                            <div style={{fontSize: '16px', fontFamily: 'var(--font-family-Noto-M)'}}>OOOO123456@four-chains.com</div>
                          </div>
                        </PopoverBody>
                      </PopoverContent>
                    </Portal>
                  </Popover>
                  }
                >

                <TreeNode label={
                  <div className="nodeicon"> 
                    <div className="nodeicon_content">
                      <span>임원</span>
                      <img src={UserIcon_dark} alt="UserIcon_dark" className="UserIcon"/> 
                      <div>안후상 | 이사</div>
                    </div>
                  </div>}>
                </TreeNode>
                
                <TreeNode
                  label={
                    <div className="nodeicon"> 
                      <div className="nodeicon_content">
                        <span>관리부</span>
                        <img src={UserIcon_dark} alt="UserIcon_dark" className="UserIcon"/> 
                        <div>이정열 | 부서장</div>
                      </div>
                    </div>
                  }>
                  <TreeNode label={<div className="nodeicon5">관리팀</div>}>
                    <div className="TeamColumn">
                      <div className="nodeicon6">김효은 | 팀장</div>
                      <div className="nodeicon6">우현지 | 사원</div>
                      <div className="nodeicon6">염승희 | 사원</div>
                    </div>
                  </TreeNode>
                  <TreeNode label={<div className="nodeicon5">지원팀</div>} >
                    <div className="TeamColumn">
                      <div className="nodeicon6">김태희 | 팀장</div>
                      <div className="nodeicon6">이주범 | 사원</div>
                    </div>
                  </TreeNode>
                  <TreeNode label={<div className="nodeicon5">시설팀</div>} />
                </TreeNode>

                <TreeNode label={
                  <div className="nodeicon"> 
                    <div className="nodeicon_content">
                      <span>개발부</span>
                      <img src={UserIcon_dark} alt="UserIcon_dark" className="UserIcon"/> 
                      <div>진유빈 | 부서장</div>
                    </div>
                  </div>}>
                  <TreeNode label={<div className="nodeicon5">개발 1팀</div>} >
                    <div className="TeamColumn">
                        <div className="nodeicon6">장현지 | 사원</div>
                        <div className="nodeicon6">구민석 | 사원</div>
                        <div className="nodeicon6">권채림 | 사원</div>
                      </div>
                    </TreeNode>
                  <TreeNode label={<div className="nodeicon5">개발 2팀</div>} >
                    <div className="TeamColumn">
                        <div className="nodeicon6">변도일 | 팀장</div>
                        <div className="nodeicon6">이로운 | 사원</div>
                      </div>
                    </TreeNode>
                </TreeNode>

                <TreeNode label={
                  <div className="nodeicon"> 
                    <div className="nodeicon_content">
                      <span>블록체인 사업부</span>
                      <img src={UserIcon_dark} alt="UserIcon_dark" className="UserIcon"/> 
                      <div>권상원 | 부서장</div>
                    </div>
                  </div>}>
                  <TreeNode label={<div className="nodeicon5" style={{ marginTop: '20px' }}>블록체인 1팀</div>} >
                    <div className="TeamColumn">
                      <div className="nodeicon6">김도환 | 팀장</div>
                      <div className="nodeicon6">권준우 | 사원</div>
                    </div>
                  </TreeNode>
                </TreeNode>

                <TreeNode label={
                  <div className="nodeicon"> 
                    <div className="nodeicon_content">
                      <span>마케팅부</span>
                      <img src={UserIcon_dark} alt="UserIcon_dark" className="UserIcon"/> 
                      <div>김현지 | 부서장</div>
                    </div>
                  </div>}>
                  <TreeNode label={<div className="nodeicon5">기획팀</div>} >
                    <div className="TeamColumn">
                      <div className="nodeicon6">전아름 | 팀장</div>
                      <div className="nodeicon6">함다슬 | 사원</div>
                      <div className="nodeicon6">전규미 | 사원</div>
                    </div>
                  </TreeNode>
                  <TreeNode label={<div className="nodeicon5">디자인팀</div>} >
                    <div className="TeamColumn">
                      <div className="nodeicon6">서주희 | 사원</div>
                    </div>
                  </TreeNode>
                </TreeNode>
              </Tree>
            </TabPanel>

            <TabPanel display='flex' justifyContent='center' className="TabPanel">
              <div className="FC_logo2">
                <img src={FourchainsLogo} alt="FourchainsLogo" width='130px' />
                <p className="MenuName2">R&D 연구센터</p>
                <p className="MenuName">인사 조직도</p>
              </div>
              <Tree lineWidth={'1px'} lineColor={'#D3D3D3'} label={
                  <div className="nodeicon"> 
                    <div className="nodeicon_content">
                      <span>연구 총괄</span>
                      <img src={UserIcon_dark} alt="UserIcon_dark" className="UserIcon"/> 
                      <div>이유정 | 센터장</div>
                    </div>
                  </div>}>

                <TreeNode label={
                  <div className="nodeicon"> 
                    <div className="nodeicon_content">
                      <span>알고리즘 연구실</span>
                      <img src={UserIcon_dark} alt="UserIcon_dark" className="UserIcon"/> 
                      <div>심민지 | 연구실장</div>
                    </div>
                  </div>}>
                  <TreeNode label={<div className="nodeicon3">암호 연구팀</div>} />
                  <TreeNode label={<div className="nodeicon3">AI 연구팀</div>} >
                    <div className="TeamColumn">
                      <div className="nodeicon7">임지현 | 연구원</div>
                      <div className="nodeicon7">김희진 | 연구원</div>
                    </div>
                  </TreeNode>
                </TreeNode>

                <TreeNode label={
                  <div className="nodeicon"> 
                    <div className="nodeicon_content">
                      <span>동형분석 연구실</span>
                      <img src={UserIcon_dark} alt="UserIcon_dark" className="UserIcon"/> 
                      <div>윤민지 | 연구실장</div>
                    </div>
                  </div>}>
                  <TreeNode label={<div className="nodeicon4">동형분석 연구팀</div>} >
                    <div className="TeamColumn">
                      <div className="nodeicon7">이채영 | 연구원</div>
                    </div>
                  </TreeNode>
                </TreeNode>

                <TreeNode label={
                  <div className="nodeicon"> 
                    <div className="nodeicon_content">
                      <span>블록체인 연구실</span>
                      <img src={UserIcon_dark} alt="UserIcon_dark" className="UserIcon"/> 
                      <div>공석</div>
                    </div>
                  </div>}>
                  <TreeNode label={<div className="nodeicon3">크립토 블록체인 연구팀</div>} />
                  <TreeNode label={<div className="nodeicon3">AI 개발팀</div>} >
                    <div className="TeamColumn">
                      <div className="nodeicon7">박소연 | 연구원</div>
                      <div className="nodeicon7">김경현 | 연구원</div>
                    </div>
                  </TreeNode>
                </TreeNode>
              </Tree>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
};


export default OrgChart;