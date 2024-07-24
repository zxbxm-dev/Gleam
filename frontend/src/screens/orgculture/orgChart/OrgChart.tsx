import React, { useState, useEffect } from "react";
import {
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
  attachment: string;
}

const MemberPopover: React.FC<{ member: Person, isOpen: boolean, onOpen: () => void, onClose: () => void }> = ({ member, isOpen, onOpen, onClose }) => (
  <Popover
    isOpen={isOpen}
    onClose={onClose}
    onOpen={onOpen}
    placement={'top'}
  >
    <PopoverTrigger>
      <div style={{ cursor: 'pointer' }} onClick={isOpen ? onClose : onOpen}>{member.username} | {member.position}</div>
    </PopoverTrigger>
    <Portal>
      <PopoverContent className='custom_popover'>
        <PopoverHeader className='custom_popover_header'>{member.department} - {member.team}</PopoverHeader>
        <PopoverCloseButton />
        <PopoverBody className='custom_popover_body'>
          <div className='custom_popover_body_left'>
            <img src={member.attachment ? member.attachment : UserIcon} alt="UserIcon" className="user_icon" />
            <div>{member.username}</div>
            <div>{member.position}</div>
          </div>
          <div className='custom_popover_body_right'>
            <div className='custom_popover_body_right_div'>
              <div>연락처</div>
              <div>{member.phoneNumber}</div>
            </div>
            <div className='custom_popover_body_right_div'>
              <div>메일주소</div>
              <div>{member.usermail}</div>
            </div>
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
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

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
        const approveduser = response.data.filter((item: any) => item.status === 'approved');
        setPersonData(approveduser);
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
  const algoHead = getPersonByPosition('알고리즘 연구실', '연구실장');
  const homomorphicHead = getPersonByPosition('동형분석 연구실', '연구실장');

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
                          <MemberPopover
                            member={member}
                            isOpen={openPopoverId === member.userId}
                            onOpen={() => setOpenPopoverId(member.userId)}
                            onClose={() => setOpenPopoverId(null)}
                          />
                        </div>
                      ))}
                    </div>
                  </TreeNode>
                  <TreeNode label={<div className="nodeicon5">개발 2팀</div>} >
                    <div className="TeamColumn">
                      {getSortedTeamMembers('개발 2팀').map(member => (
                        <div key={member.userId} className="nodeicon6">
                          <MemberPopover
                            member={member}
                            isOpen={openPopoverId === member.userId}
                            onOpen={() => setOpenPopoverId(member.userId)}
                            onClose={() => setOpenPopoverId(null)}
                          />
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
                          <MemberPopover
                            member={member}
                            isOpen={openPopoverId === member.userId}
                            onOpen={() => setOpenPopoverId(member.userId)}
                            onClose={() => setOpenPopoverId(null)}
                          />
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
                          <MemberPopover
                            member={member}
                            isOpen={openPopoverId === member.userId}
                            onOpen={() => setOpenPopoverId(member.userId)}
                            onClose={() => setOpenPopoverId(null)}
                          />
                        </div>
                      ))}
                    </div>
                  </TreeNode>
                  <TreeNode label={<div className="nodeicon5">지원팀</div>} >
                    <div className="TeamColumn">
                      {getSortedTeamMembers('지원팀').map(member => (
                        <div key={member.userId} className="nodeicon6">
                          <MemberPopover
                            member={member}
                            isOpen={openPopoverId === member.userId}
                            onOpen={() => setOpenPopoverId(member.userId)}
                            onClose={() => setOpenPopoverId(null)}
                          />
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
                          <MemberPopover
                            member={member}
                            isOpen={openPopoverId === member.userId}
                            onOpen={() => setOpenPopoverId(member.userId)}
                            onClose={() => setOpenPopoverId(null)}
                          />
                        </div>
                      ))}
                    </div>
                  </TreeNode>
                  <TreeNode label={<div className="nodeicon5">기획팀</div>} >
                    <div className="TeamColumn">
                      {getSortedTeamMembers('기획팀').map(member => (
                        <div key={member.userId} className="nodeicon6">
                          <MemberPopover
                            member={member}
                            isOpen={openPopoverId === member.userId}
                            onOpen={() => setOpenPopoverId(member.userId)}
                            onClose={() => setOpenPopoverId(null)}
                          />
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
                          <MemberPopover
                            member={member}
                            isOpen={openPopoverId === member.userId}
                            onOpen={() => setOpenPopoverId(member.userId)}
                            onClose={() => setOpenPopoverId(null)}
                          />
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
                          <MemberPopover
                            member={member}
                            isOpen={openPopoverId === member.userId}
                            onOpen={() => setOpenPopoverId(member.userId)}
                            onClose={() => setOpenPopoverId(null)}
                          />       </div>
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
                      {getSortedTeamMembers('API 개발팀').map(member => (
                        <div key={member.userId} className="nodeicon7">
                          <MemberPopover
                            member={member}
                            isOpen={openPopoverId === member.userId}
                            onOpen={() => setOpenPopoverId(member.userId)}
                            onClose={() => setOpenPopoverId(null)}
                          />
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