import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import {
  FourchainsLogo,
  UserIcon_dark,
  UserIcon,
} from "../../../assets/images/index";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { PersonData } from "../../../services/person/PersonServices";
import CustomPopover from "../../../components/popover/CustomPopover";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  Portal,
} from '@chakra-ui/react';

interface Person {
  userId: string;
  username: string;
  position: string;
  department: string;
  team: string;
  phoneNumber?: string;
  usermail?: string;
  entering: Date;
}

const MemberPopover: React.FC<{ member: Person }> = ({ member }) => (
  <Popover placement={'top'}>
    <PopoverTrigger>
      <div style={{ cursor: 'pointer' }}>{member.username} | {member.position}</div>
    </PopoverTrigger>
    <Portal>
      <PopoverContent width='400px' height='200px' border='0' borderRadius='1px' boxShadow='rgba(100, 100, 111, 0.1) 0px 7px 29px 0px'>
        <PopoverHeader height='34px' color='white' bg='#746E58' border='0' fontFamily='var(--font-family-Noto-B)' fontSize='14px' borderTopRightRadius='5px' borderTopLeftRadius='5px'>{member.department} - {member.team}</PopoverHeader>
        <PopoverCloseButton color='white' />
        <PopoverBody display='flex' flexDirection='row' alignItems='center' borderBottomLeftRadius='5px' borderBottomRightRadius='5px'>
          <div style={{ width: '140px', height: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <img src={UserIcon} alt="UserIcon" style={{ width: '70px', height: '70px' }} />
            <div style={{ fontSize: '16px', fontFamily: 'var(--font-family-Noto-M)' }}>{member.username}</div>
            <div style={{ fontSize: '16px', fontFamily: 'var(--font-family-Noto-M)' }}>{member.position}</div>
          </div>
          <div style={{ width: '300px', height: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '14px', color: '#909090', fontFamily: 'var(--font-family-Noto-M)' }}>연락처</div>
            <div style={{ fontSize: '16px', fontFamily: 'var(--font-family-Noto-M)' }}>{member.phoneNumber}</div>
            <div style={{ fontSize: '14px', color: '#909090', fontFamily: 'var(--font-family-Noto-M)', marginTop: '20px' }}>메일주소</div>
            <div style={{ fontSize: '16px', fontFamily: 'var(--font-family-Noto-M)' }}>{member.usermail}</div>
          </div>
        </PopoverBody>
      </PopoverContent>
    </Portal>
  </Popover>
);

const OrgChart = () => {
  const [personData, setPersonData] = useState<Person[] | null>(null);
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

  if (!personData) {
    return <div></div>;
  }

 
  const getSortedTeamMembers = (teamName: string) => {
    return personData
      .filter((person: Person) => person.team === teamName)
      .sort((a: Person, b: Person) => new Date(a.entering).getTime() - new Date(b.entering).getTime());
  };

  return (
    <div className="content">
      {/* <div className="content_header">
        <div className="main_header">조직문화</div>
        <div className="main_header">＞</div>
        <Link to={"/orgchart"} className="sub_header">인사조직도</Link>
      </div> */}

      <div className="content_container">
        <Tabs variant='enclosed' onChange={(index) => setActiveTab(index)}>
          <TabList>
            <Tab _selected={{ bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)' }} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)' height={tabHeights[0]} marginTop={tabMargins[0]}>본사</Tab>
            <Tab _selected={{ bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)' }} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)' height={tabHeights[1]} marginTop={tabMargins[1]}>R&D 연구센터</Tab>
          </TabList>

          <TabPanels bg='white' border='1px solid #DEDEDE' borderBottomRadius='10px' borderRightRadius='10px' className="orgchart_tab_container">
            <TabPanel display='flex' marginRight="70px" justifyContent='center' className="TabPanel">

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
                      {getSortedTeamMembers('개발 1팀').map(member => (
                        <div key={member.userId} className="nodeicon6">
                          <MemberPopover member={member} />
                        </div>
                      ))}
                    </div>
                  </TreeNode>
                  <TreeNode label={<div className="nodeicon5">개발 2팀</div>} >
                    <div className="TeamColumn">
                      {getSortedTeamMembers('개발 2팀').map(member => (
                        <div key={member.userId} className="nodeicon6">
                          <MemberPopover member={member} />
                        </div>
                      ))}
                    </div>
                  </TreeNode>
                </TreeNode>

                <TreeNode label={
                  <CustomPopover 
                    direction={'right'}
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
                      {getSortedTeamMembers('블록체인 1팀').map(member => (
                        <div key={member.userId} className="nodeicon6">
                          <MemberPopover member={member} />
                        </div>
                      ))}
                    </div>
                  </TreeNode>
                </TreeNode>

                <TreeNode
                  label={
                  <CustomPopover 
                    direction={'left'}
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
                      {getSortedTeamMembers('관리팀').map(member => (
                        <div key={member.userId} className="nodeicon6">
                          <MemberPopover member={member} />
                        </div>
                      ))}
                    </div>
                  </TreeNode>
                  <TreeNode label={<div className="nodeicon5">지원팀</div>} >
                    <div className="TeamColumn">
                      {getSortedTeamMembers('지원팀').map(member => (
                        <div key={member.userId} className="nodeicon6">
                          <MemberPopover member={member} />
                        </div>
                      ))}
                    </div>
                  </TreeNode>
                  <TreeNode label={<div className="nodeicon5">시설팀</div>} />
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
                      {getSortedTeamMembers('기획팀').map(member => (
                        <div key={member.userId} className="nodeicon6">
                          <MemberPopover member={member} />
                        </div>
                      ))}
                    </div>
                  </TreeNode>
                  <TreeNode label={<div className="nodeicon5">디자인팀</div>} >
                    <div className="TeamColumn">
                      {getSortedTeamMembers('디자인팀').map(member => (
                        <div key={member.userId} className="nodeicon6">
                          <MemberPopover member={member} />
                        </div>
                      ))}
                    </div>
                  </TreeNode>
                </TreeNode>

              </Tree>
            </TabPanel>

            <TabPanel display='flex' justifyContent='center' className="TabPanel">
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
                      {getSortedTeamMembers('AI 연구팀').map(member => (
                        <div key={member.userId} className="nodeicon7">
                          <MemberPopover member={member} />
                        </div>
                      ))}
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
                      {getSortedTeamMembers('동형분석 연구팀').map(member => (
                        <div key={member.userId} className="nodeicon7">
                          <MemberPopover member={member} />
                        </div>
                      ))}
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
                      {getSortedTeamMembers('AI 개발팀').map(member => (
                        <div key={member.userId} className="nodeicon7">
                          <MemberPopover member={member} />
                        </div>
                      ))}
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