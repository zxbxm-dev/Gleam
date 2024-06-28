import React, { useState, useEffect } from "react";
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
  spot: string;
  department: string;
  team: string;
  phoneNumber?: string;
  usermail?: string;
  entering: Date;
  attachment : string;
}

const MemberPopover: React.FC<{ member: Person }> = ({ member }) => (
  <Popover placement={'top'}>
    <PopoverTrigger>
      <div style={{ cursor: 'pointer' }}>{member.username} | {member.position}</div>
    </PopoverTrigger>
    <Portal>
      <PopoverContent width='400px' height='200px' border='0' borderRadius='1px' boxShadow='rgba(100, 100, 111, 0.1) 0px 7px 29px 0px'>
        <PopoverHeader height='34px' color='#272727' bg='#76CB7E' border='0' fontFamily='var(--font-family-Noto-M)' fontSize='14px' borderTopRightRadius='5px' borderTopLeftRadius='5px'>{member.department} - {member.team}</PopoverHeader>
        <PopoverCloseButton color='#272727' />
        <PopoverBody display='flex' flexDirection='row' alignItems='center' borderBottomLeftRadius='5px' borderBottomRightRadius='5px'>
          <div style={{ width: '140px', height: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <img src={UserIcon} alt="UserIcon" style={{ width: '70px', height: '70px' }} />
            <div style={{ fontSize: '16px', fontFamily: 'var(--font-family-Noto-M)', marginTop: '10px' }}>{member.username}</div>
            <div style={{ fontSize: '16px', fontFamily: 'var(--font-family-Noto-M)' }}>{member.position}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '14px', color: '#909090', fontFamily: 'var(--font-family-Noto-M)' }}>연락처</div>
            <div style={{ fontSize: '15px', fontFamily: 'var(--font-family-Noto-M)' }}>{member.phoneNumber}</div>
            <div style={{ fontSize: '14px', color: '#909090', fontFamily: 'var(--font-family-Noto-M)', marginTop: '20px' }}>메일주소</div>
            <div style={{ fontSize: '14px', fontFamily: 'var(--font-family-Noto-M)' }}>{member.usermail}</div>
          </div>
        </PopoverBody>
      </PopoverContent>
    </Portal>
  </Popover>
);

const OrgChart = () => {
  const [personData, setPersonData] = useState<Person[] | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [tabHeights, setTabHeights] = useState({ 0: '41px', 1: '35px' });
  const [tabMargins, setTabMargins] = useState({ 0: '6px', 1: '6px' });

  useEffect(() => {
    if (activeTab === 0) {
      setTabHeights({ 0: '41px', 1: '35px' });
      setTabMargins({ 0: '0px', 1: '6px' });
    } else {
      setTabHeights({ 0: '35px', 1: '41px' });
      setTabMargins({ 0: '6px', 1: '0px' });
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


  const getPersonByPosition = (dept: string, position?: string): Person | undefined => {
    if (position) {
      return personData?.find(person => person.department === dept && person.position === position);
    } else {
      return personData?.find(person => person.department === dept);
    }
  };
  const getSortedTeamMembers = (teamName: string) => {
    return personData
      .filter((person: Person) => person.team === teamName)
      .sort((a: Person, b: Person) => new Date(a.entering).getTime() - new Date(b.entering).getTime());
  };

  const ceo = getPersonByPosition('', '대표이사');
  const exec = getPersonByPosition('', '이사');
  const devHead = getPersonByPosition('개발부', '부서장');
  const blockchainHead = getPersonByPosition('블록체인 사업부', '부서장');
  const adminHead = getPersonByPosition('관리부', '부서장');
  const marketingHead = getPersonByPosition('마케팅부', '부서장');
  const rndHead = getPersonByPosition('', '센터장');
  const algoHead = getPersonByPosition('알고리즘 연구실','연구실장');
  const homomorphicHead = getPersonByPosition('동형분석 연구실','연구실장');

  return (
    <div className="content" style={{ padding: '0px 20px' }}>
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
                  ceo && (
                    <CustomPopover
                      direction={'right'}
                      position={ceo.position}
                      dept={'대표이사'}
                      name={ceo.username}
                      attachment={ceo?.attachment}
                      phone={personData.find(person => person.position === '대표이사')?.phoneNumber || 'N/A'}
                      mail={personData.find(person => person.position === '대표이사')?.usermail || 'N/A'}
                    />
                  )
                }>

                <TreeNode label={
                  exec && (
                    <CustomPopover
                      direction={'right'}
                      position={exec.position}
                      dept={'임원'}
                      name={exec.username}
                      attachment={exec?.attachment}
                      phone={personData.find(person => person.position === '이사')?.phoneNumber || 'N/A'}
                      mail={personData.find(person => person.position === '이사')?.usermail || 'N/A'}
                    />
                  )
                }>
                </TreeNode>

                <TreeNode label={
                  devHead && (
                    <CustomPopover
                      direction={'right'}
                      position={devHead.position}
                      dept={devHead.department}
                      name={devHead.username}
                      attachment={devHead?.attachment}
                      phone={personData.find(person => (person.position === '부서장') && (person.department === '개발부'))?.phoneNumber || 'N/A'}
                      mail={personData.find(person => (person.position === '부서장') && (person.department === '개발부'))?.usermail || 'N/A'}
                    />
                  )
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
                  blockchainHead && (
                    <CustomPopover
                      direction={'right'}
                      position={blockchainHead.position}
                      dept={blockchainHead.department}
                      name={blockchainHead.username}
                      attachment={blockchainHead?.attachment}
                      phone={personData.find(person => (person.position === '부서장') && (person.department === '블록체인사업부'))?.phoneNumber || 'N/A'}
                      mail={personData.find(person => (person.position === '부서장') && (person.department === '블록체인사업부'))?.usermail || 'N/A'}
                    />
                  )
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
                    adminHead && (
                      <CustomPopover
                        direction={'right'}
                        position={adminHead.position}
                        dept={adminHead.department}
                        name={adminHead.username}
                        attachment={adminHead?.attachment}
                        phone={personData.find(person => (person.position === '부서장') && (person.department === '관리부'))?.phoneNumber || 'N/A'}
                        mail={personData.find(person => (person.position === '부서장') && (person.department === '관리부'))?.usermail || 'N/A'}
                      />
                    )
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
                  marketingHead && (
                    <CustomPopover
                      direction={'right'}
                      position={marketingHead.position}
                      dept={marketingHead.department}
                      name={marketingHead.username}
                      attachment={marketingHead?.attachment}
                      phone={personData.find(person => (person.position === '부서장') && (person.department === '마케팅부'))?.phoneNumber || 'N/A'}
                      mail={personData.find(person => (person.position === '부서장') && (person.department === '마케팅부'))?.usermail || 'N/A'}
                    />
                  )
                }>
                  <TreeNode label={<div className="nodeicon5">디자인팀</div>} >
                    <div className="TeamColumn">
                      {getSortedTeamMembers('디자인팀').map(member => (
                        <div key={member.userId} className="nodeicon6">
                          <MemberPopover member={member} />
                        </div>
                      ))}
                    </div>
                  </TreeNode>
                  <TreeNode label={<div className="nodeicon5">기획팀</div>} >
                    <div className="TeamColumn">
                      {getSortedTeamMembers('기획팀').map(member => (
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
              <Tree
                lineWidth={'1px'}
                lineColor={'#D3D3D3'}
                label={
                  rndHead && (
                    <CustomPopover
                      direction={'right'}
                      position={rndHead.position}
                      dept={'센터장'}
                      name={rndHead.username}
                      attachment={rndHead?.attachment}
                      phone={personData.find(person => person.position === '센터장')?.phoneNumber || 'N/A'}
                      mail={personData.find(person => person.position === '센터장')?.usermail || 'N/A'}
                    />
                  )
                }>

                <TreeNode label={
                  algoHead && (
                    <CustomPopover
                      direction={'right'}
                      position={algoHead.position}
                      dept={algoHead.department}
                      name={algoHead.username}
                      attachment={algoHead?.attachment}
                      phone={personData.find(person => (person.position === '연구실장') && (person.department === '알고리즘 연구실'))?.phoneNumber || 'N/A'}
                      mail={personData.find(person => (person.position === '연구실장') && (person.department === '알고리즘 연구실'))?.usermail || 'N/A'}
                    />
                  )
                }>
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
                  homomorphicHead && (
                    <CustomPopover
                      direction={'right'}
                      position={homomorphicHead.position}
                      dept={homomorphicHead.department}
                      name={homomorphicHead.username}
                      attachment={homomorphicHead?.attachment}
                      phone={personData.find(person => (person.position === '연구실장') && (person.department === '동형분석 연구실'))?.phoneNumber || 'N/A'}
                      mail={personData.find(person => (person.position === '연구실장') && (person.department === '동형분석 연구실'))?.usermail || 'N/A'}
                    />
                  )
                }>
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
                      <img src={UserIcon_dark} alt="UserIcon_dark" className="UserIcon" />
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