import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import {
  FourchainsLogo,
  UserIcon_dark,
} from "../../../assets/images/index";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { Tree, TreeNode } from 'react-organizational-chart';
import CustomPopover from "../../../components/popover/CustomPopover";
import { PersonData } from "../../../services/person/PersonServices";

const OrgChart = () => {
  const [personData, setPersonData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [tabHeights, setTabHeights] = useState({0: '41px', 1: '35px'});
  const [tabMargins, setTabMargins] = useState({0: '6px', 1: '6px'});
  
  useEffect(() => {
    if (activeTab === 0) {
      setTabHeights({0: '41px', 1: '35px'});
      setTabMargins({0: '0px', 1: '6px'});
    } else {
      setTabHeights({0: '35px', 1: '41px'});
      setTabMargins({0: '6px', 1: '0px'});
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await PersonData();
        setPersonData(response.data);
      } catch (err) {
      }
    };

    fetchData();
  }, []);

  return (
    <div className="content">
      <div className="content_header">
        <div className="main_header">조직문화</div>
        <div className="main_header">＞</div>
        <Link to={"/orgchart"} className="sub_header">인사조직도</Link>
      </div>

      <div className="content_container">
        <Tabs variant='enclosed' onChange={(index) => setActiveTab(index)}>
          <TabList>
            <Tab _selected={{ bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)' }} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)' height={tabHeights[0]} marginTop={tabMargins[0]}>본사</Tab>
            <Tab _selected={{ bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)' }} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)' height={tabHeights[1]} marginTop={tabMargins[1]}>R&D 연구센터</Tab>
          </TabList>

          <TabPanels bg='white' border='1px solid #DEDEDE' borderBottomRadius='10px' borderRightRadius='10px' className="orgchart_tab_container">
            <TabPanel display='flex' marginRight="70px" justifyContent='center' className="TabPanel">
              <div className="FC_logo">
                <img src={FourchainsLogo} alt="FourchainsLogo" className="Logoimg" />
                <p className="MenuName">인사 조직도</p>
              </div>

              <Tree 
                lineWidth={'1px'} 
                lineColor={'#D3D3D3'} 
                label={
                  <CustomPopover 
                    direction={'right'}
                    position={'대표이사'}
                    position2={'이사'}
                    dept={'대표이사'}
                    team={'이사'}
                    name={'이정훈'}
                    phone={'010-0000-0000'}
                    mail={'OOOO@four-chains.com'}
                    />
                  }>

                <TreeNode label={
                  <CustomPopover 
                    direction={'right'}
                    position={'임원'}
                    position2={'이사'}
                    dept={'임원'}
                    team={'이사'}
                    name={'안후상'}
                    phone={'010-0000-0000'}
                    mail={'OOOO@four-chains.com'}
                    />
                  }>
                </TreeNode>
                
                <TreeNode
                  label={
                  <CustomPopover 
                    direction={'right'}
                    position={'관리부'}
                    position2={'부서장'}
                    dept={'관리부'}
                    team={'부서장'}
                    name={'이정열'}
                    phone={'010-0000-0000'}
                    mail={'OOOO@four-chains.com'}
                  />
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
                    </div>
                  </TreeNode>
                  <TreeNode label={<div className="nodeicon5">시설팀</div>} />
                </TreeNode>

                <TreeNode label={
                    <CustomPopover 
                      direction={'right'}
                      position={'개발부'}
                      position2={'부서장'}
                      dept={'개발부'}
                      team={'개발 1팀'}
                      name={'진유빈'}
                      phone={'010-0000-0000'}
                      mail={'OOOO@four-chains.com'}
                  />
                }>
                  <TreeNode label={<div className="nodeicon5">개발 1팀</div>} >
                    <div className="TeamColumn">
                        <div className="nodeicon6">장현지 | 사원</div>
                        <div className="nodeicon6">구민석 | 사원</div>
                        <div className="nodeicon6">박세준 | 사원</div>
                        <div className="nodeicon6">OOO | 사원</div>
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
                  <CustomPopover 
                    direction={'left'}
                    position={'블록체인 사업부'}
                    position2={'부서장'}
                    dept={'블록체인 사업부'}
                    team={'부서장'}
                    name={'권상원'}
                    phone={'010-0000-0000'}
                    mail={'OOOO@four-chains.com'}
                  />
                }>
                  <TreeNode label={<div className="nodeicon5" style={{ marginTop: '20px' }}>블록체인 1팀</div>} >
                    <div className="TeamColumn">
                      <div className="nodeicon6">김도환 | 팀장</div>
                      <div className="nodeicon6">권준우 | 사원</div>
                    </div>
                  </TreeNode>
                </TreeNode>

                <TreeNode label={
                  <CustomPopover 
                    direction={'left'}
                    position={'마케팅부'}
                    position2={'부서장'}
                    dept={'마케팅부'}
                    team={'부서장'}
                    name={'김현지'}
                    phone={'010-0000-0000'}
                    mail={'OOOO@four-chains.com'}
                  />
                }>
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