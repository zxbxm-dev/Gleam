import React, { useState } from "react";
import "./HumanResource.scss";
import { Link } from "react-router-dom";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';


const HumanResource = () => {
  const [isEditing, setIsEditing] = useState(false);

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="content">
      <div className="content_header">
        <Link to={"/human-resources"} className="sub_header">인사 정보 관리</Link>
      </div>
      
      <div className="content_container">
          <Tabs variant='enclosed'>
            <TabList>
              <Tab _selected={{bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)'}} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)'>인사기록카드</Tab>
              <Tab _selected={{bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)'}} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)'>근로자명부</Tab>
              <Tab _selected={{bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)'}} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)'>인사이동</Tab>
            </TabList>

            <TabPanels bg='white' border='1px solid #DEDEDE' borderBottomRadius='10px' borderRightRadius='10px' className="tab_container">
              <TabPanel display='flex' flexDirection='column'>
                <div style={{display: 'flex', flexDirection: 'row-reverse', width: '100%', height: '5vh' ,borderBottom: '1px solid #DCDCDC', gap: '10px'}}>
                  {isEditing ? (
                    <>
                      <button className="adds_button" onClick={handleToggleEdit}>등록</button>
                      <button className="edits_button">취소</button>
                    </>
                  ) : (
                    <>
                      <button className="edits_button" onClick={handleToggleEdit}>수정</button>
                      <button className="downloads_button">다운로드</button>
                    </>
                  )}
                </div>
                <div>
                  인사기록카드
                </div>
                
              </TabPanel>

              <TabPanel display='flex' flexDirection='column'>
                <div style={{display: 'flex', flexDirection: 'row-reverse', width: '100%', height: '5vh' ,borderBottom: '1px solid #DCDCDC', gap: '10px'}}>
                  {isEditing ? (
                    <>
                      <button className="adds_button" onClick={handleToggleEdit}>등록</button>
                      <button className="edits_button">취소</button>
                    </>
                  ) : (
                    <>
                      <button className="edits_button" onClick={handleToggleEdit}>수정</button>
                      <button className="downloads_button">다운로드</button>
                    </>
                  )}
                </div>
                <div>
                  근로자명부
                </div>
                
              </TabPanel>

              <TabPanel display='flex' justifyContent='center'>
                
                
              </TabPanel>
            </TabPanels>
          </Tabs>
      </div>  
      
    </div>
  );
};

export default HumanResource;