import "./AttendanceRegist.scss";
import { Link } from "react-router-dom";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

const AttendanceRegist = () => {

  const generateDivs = () => {
    const divs = [];
    for (let i = 0; i < 30; i++) {
      for (let j = 0; j < 31; j++) {
        divs.push(<div className="conta" key={`${i}-${j}`}>&nbsp;</div>);
      }
    }
    return divs;
  };

  const DateDivs = () => {
    const daysOfWeek = ["월", "화", "수", "목", "금", "토", "일"];
    const divs = [];
    for (let j = 0; j < 31; j++) {
        const dayOfWeek = daysOfWeek[(j + 4) % 7];
        divs.push(<div className="dateconta" key={`${j}`}>{j + 1}일<br/>{dayOfWeek}요일</div>);
    }
    return divs;
  };

  const months = [
    { name: '1월', key: 'january' },
    { name: '2월', key: 'february' },
    { name: '3월', key: 'march' },
    { name: '4월', key: 'april' },
    { name: '5월', key: 'may' },
    { name: '6월', key: 'june' },
    { name: '7월', key: 'july' },
    { name: '8월', key: 'august' },
    { name: '9월', key: 'september' },
    { name: '10월', key: 'october' },
    { name: '11월', key: 'november' },
    { name: '12월', key: 'december' },
  ];

  return (
    <div className="content">
      <div className="content_header">
        <div className="main_header">근태관리</div>
        <div className="main_header">＞</div>
        <Link to={"/attendance-regist"} className="sub_header">출근부</Link>
      </div>
      
      <div className="content_container">
        <Tabs variant='enclosed'>
          <TabList>
            {months.map(month => (
              <Tab key={month.key} _selected={{bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)'}} width='136.7px' bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)'>{month.name}</Tab>
            ))}
          </TabList>

          <TabPanels bg='white' height='790px' border='1px solid #DEDEDE' borderBottomRadius='10px'>
            {months.map(month => (
              <TabPanel key={month.key} className="container_attendance">
                {DateDivs()}
                {generateDivs()}
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </div>  
    </div>
  );
};

export default AttendanceRegist;
