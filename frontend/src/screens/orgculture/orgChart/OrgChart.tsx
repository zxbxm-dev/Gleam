import "./OrgChart.scss";
import { Link } from "react-router-dom";
import {
  FourchainsLogo
} from "../../../assets/images/index";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { Tree, TreeNode } from 'react-organizational-chart';

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
            <Tab _selected={{bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)'}} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)'>본사</Tab>
            <Tab _selected={{bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)'}} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)'>R&D 연구센터</Tab>
          </TabList>

          <TabPanels bg='white' border='1px solid #DEDEDE' borderBottomRadius='10px' borderRightRadius='10px' className="tab_container">
            <TabPanel display='flex' marginRight="70px" justifyContent='center' marginTop='80px'>
              <div className="FC_logo">
                <img src={FourchainsLogo} alt="FourchainsLogo" className="Logoimg"/>
                <p className="MenuName">인사 조직도</p>
              </div>
              <Tree lineWidth={'1px'} lineColor={'#D3D3D3'} label={<div className="nodeicon">대표이사</div>}>
                <TreeNode label={<div className="nodeicon">임원</div>}>
                </TreeNode>
                <TreeNode
                label={
                <div
                className="nodeicon">
                  관리부<br/>
이정열 | 부서장
                  </div>
                }>
                  <TreeNode label={<div className="nodeicon5">관리팀</div>}>
                    <div className="TeamColumn">
                  <div className="nodeicon6">김효은 | 팀장</div>
                  <div className="nodeicon6">우현지 | 사원</div>
                  <div className="nodeicon6">염승희 | 사원</div>
                  <div className="nodeicon6">염승희 | 사원</div>
                  <div className="nodeicon6">염승희 | 사원</div>
                  </div>
                  </TreeNode>
                  <TreeNode label={<div className="nodeicon5">지원팀</div>}/>
                  <TreeNode label={<div className="nodeicon5">시설팀</div>}/>
                </TreeNode>
                <TreeNode label={<div className="nodeicon">개발부</div>}>
                  <TreeNode label={<div className="nodeicon5">개발 1팀</div>}/>
                  <TreeNode label={<div className="nodeicon5">개발 2팀</div>}/>
                </TreeNode>
                <TreeNode label={<div className="nodeicon">블록체인 사업부</div>}>
                  <TreeNode label={<div className="nodeicon5" style={{marginTop:'20px'}}>블록체인 1팀</div>}/>
                </TreeNode>
                <TreeNode label={<div className="nodeicon">마케팅부</div>}>
                  <TreeNode label={<div className="nodeicon5">기획팀</div>}/>
                  <TreeNode label={<div className="nodeicon5">디자인팀</div>}/>
                </TreeNode>
              </Tree>
            </TabPanel>

            <TabPanel display='flex' justifyContent='center' marginTop='150px'>
              <div className="FC_logo2">
                <img src={FourchainsLogo} alt="FourchainsLogo" width='130px'/>
                <p className="MenuName2">R&D 연구센터</p>
                <p className="MenuName">인사 조직도</p>
              </div>
              <Tree lineWidth={'1px'} lineColor={'#D3D3D3'} label={<div className="nodeicon">연구총괄</div>}>
                <TreeNode label={<div className="nodeicon">알고리즘 연구실</div>}>
                  <TreeNode label={<div className="nodeicon3">암호 연구팀</div>}/>
                  <TreeNode label={<div className="nodeicon3">AI 연구팀</div>}/>
                </TreeNode>
                <TreeNode label={<div className="nodeicon">동형분석 연구실</div>}>
                  <div className="nodeline2"></div>
                  <TreeNode label={<div className="nodeicon4">동형분석 연구팀</div>}/>
                </TreeNode>
                <TreeNode label={<div className="nodeicon">블록체인 연구실</div>}>
                  <TreeNode label={<div className="nodeicon3">크립토 블록체인 연구팀</div>}/>
                  <TreeNode label={<div className="nodeicon3">AI 개발팀</div>}/>
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