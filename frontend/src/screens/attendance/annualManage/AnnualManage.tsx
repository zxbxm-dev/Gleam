import React, { useState } from 'react';
import "../attendanceRegist/AttendanceRegist.scss";
import { Link } from "react-router-dom";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

type Member = [string, number, number, number, string[], string, string];

const AnnualManage = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedScreen, setSelectedScreen] = useState('R&D');

  const handleScreenChange = () => {
    setSelectedScreen(selectedScreen === 'R&D' ? '본사' : 'R&D');
  };

  const handleYearChange = (event: any) => {
    setSelectedYear(parseInt(event.target.value));
  };

  const exportToPDF = () => {
    const element = document.getElementById('table-to-xls');
    if (element) {
      element.style.height = element.scrollHeight + 'px';
      element.style.width = element.scrollWidth + 'px';
      html2canvas(element).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 크기에서 이미지 너비
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // 이미지의 원래 높이에 따른 비율에 따라 조정
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('연차관리.pdf');
        window.location.reload();
      });
    } else {
      console.error('Element not found');
    }
  };

  const members: Member[] = [
    ['권상원', 15, 2, 13.0, ['04.17', '04.18'], '2099-01-01', '2099-01-01'],
    ['진유빈', 15, 1, 14.0, ['04.20'], '2099-01-01', '2099-01-01'],
    ['장현지', 15, 0, 15.0, [''], '2099-01-01', '2099-01-01'],
    ['권채림', 15, 0, 15.0, [''], '2099-01-01', '2099-01-01'],
    ['구민석', 15, 0, 15.0, [''], '2099-01-01', '2099-01-01'],
    ['변도일', 15, 0, 15.0, [''], '2099-01-01', '2099-01-01'],
    ['이로운', 15, 0, 15.0, [''], '2099-01-01', '2099-01-01'],
    ['김현지', 15, 0, 15.0, [''], '2099-01-01', '2099-01-01'],
    ['서주희', 15, 0, 15.0, [''], '2099-01-01', '2099-01-01'],
    ['전아름', 15, 0, 15.0, [''], '2099-01-01', '2099-01-01'],
    ['함다슬', 15, 0, 15.0, [''], '2099-01-01', '2099-01-01'],
    ['전규미', 15, 0, 15.0, [''], '2099-01-01', '2099-01-01'],
    ['김효은', 15, 0, 15.0, [''], '2099-01-01', '2099-01-01'],
    ['우현지', 15, 0, 15.0, [''], '2099-01-01', '2099-01-01'],
    ['염승희', 15, 0, 15.0, [''], '2099-01-01', '2099-01-01'],
    ['김태희', 15, 0, 15.0, [''], '2099-01-01', '2099-01-01'],
    ['이주범', 15, 0, 15.0, [''], '2099-01-01', '2099-01-01'],
  ]


  const CountDivs = () => {
    const countTotal = ["성명", "입사일", "퇴사일", "사용가능", "사용", "잔여"]
    const totalRows = [];
    const tableRows = [];

    totalRows.push(
      <>
        <tr className="countName_annual">
          <td className="total_annual">{countTotal[0]}</td>
        </tr>
        <tr className="countDate_annual">
          <td className="total_annual">{countTotal[1]}</td>
        </tr>
        <tr className="countDate_annual">
          <td className="total_annual">{countTotal[2]}</td>
        </tr>
        <tr className="countTotal_annual">
          <td className="total_annual">{countTotal[3]}</td>
        </tr>
        <tr className="countTotal_annual">
          <td className="total_annual">{countTotal[4]}</td>
        </tr>
        <tr className="countTotal_annual_last">
          <td className="total_annual">{countTotal[5]}</td>
        </tr>
      </>
    )


    for (let k = 0; k < 30; k++) {
      tableRows.push(
        <tr className="countTotal_annual" key={`${k}`}>
          <td className="total_annual" style={{backgroundColor: '#FFF5DC'}}>{k + 1}</td>
        </tr>
      )
    }
    return (
      <table className="CountTable">
        <tbody>
          {totalRows}
          {tableRows}
        </tbody>
      </table>
    );
  }

  const generateDivs = () => {
    const nameRows = [];
    const countfirstRows = [];
    const countsecondRows = [];
    const countthirdRows = [];
    const totalRows = [];
    const datefirstRows = [];
    const datesecondRows = [];

    
    for (let i = 0; i < 1; i++) {
      const rowCells = [];
      for (let j = 0; j < 17; j++) {

        rowCells.push(
          <tr
            className="conta_three_annual"
            key={`${i}-${j}`}
          >
            <td className='conta_name_annual'> {members[j][0]} </td>
          </tr>
        );
      }
      nameRows.push(<td className="sconta" key={i}>{rowCells}</td>);
    }

    for (let i = 0; i < 1; i++) {
      const rowCells = [];
      for (let j = 0; j < 17; j++) {

        rowCells.push(
          <tr
            className="conta_three_annual"
            key={`${i}-${j}`}
          >
            <td className='conta_annual'> 
              <input 
                type="text"
                value={members[j][1]}
              /> 
            </td>
          </tr>
        );
      }
      countfirstRows.push(<td className="sconta" key={i}>{rowCells}</td>);
    }

    for (let i = 0; i < 1; i++) {
      const rowCells = [];
      for (let j = 0; j < 17; j++) {

        rowCells.push(
          <tr
            className="conta_three_annual"
            key={`${i}-${j}`}
          >
            <td className='conta_annual'> {members[j][2]} </td>
          </tr>
        );
      }
      countsecondRows.push(<td className="sconta" key={i}>{rowCells}</td>);
    }

    for (let i = 0; i < 1; i++) {
      const rowCells = [];
      for (let j = 0; j < 17; j++) {

        rowCells.push(
          <tr
            className="conta_three_last_annual"
            key={`${i}-${j}`}
          >
            <td className='conta_annual'> {members[j][1].toFixed(1)} </td>
          </tr>
        );
      }
      countthirdRows.push(<td className="sconta" key={i}>{rowCells}</td>);
    }

    for (let i = 0; i < 30; i++) {
      const rowCells = [];

      for (let j = 0; j < 17; j++) {
        const eventDates = members[j][4]; // 해당 멤버의 이벤트 날짜 배열
        const eventDate = eventDates && eventDates[i] ? eventDates[i] : '';
        rowCells.push(
          <tr
            className="conta_three_annual"
            key={`${i}-${j}`}
          >
            <td className='conta_annual'> {eventDate} </td>
          </tr>
        );
      }
      totalRows.push(<td className="sconta" key={i}>{rowCells}</td>);
    }

    for (let i = 0; i < 1; i++) {
      const rowCells = [];
      for (let j = 0; j < 17; j++) {

        rowCells.push(
          <tr
            className="conta_three_annual"
            key={`${i}-${j}`}
          >
            <td className='conta_date_annual'> {members[j][5]} </td>
          </tr>
        );
      }
      datefirstRows.push(<td className="sconta" key={i}>{rowCells}</td>);
    }

    for (let i = 0; i < 1; i++) {
      const rowCells = [];
      for (let j = 0; j < 17; j++) {

        rowCells.push(
          <tr
            className="conta_three_annual"
            key={`${i}-${j}`}
          >
            <td className='conta_date_annual'> {members[j][6]} </td>
          </tr>
        );
      }
      datesecondRows.push(<td className="sconta" key={i}>{rowCells}</td>);
    }
    
    return (
      <table className="table">
        <tbody>
          {nameRows}
          {datefirstRows}
          {datesecondRows}
          {countfirstRows}
          {countsecondRows}
          {countthirdRows}
          {totalRows}
        </tbody>
      </table>
    );
  };

  return (
    <div className="content">
      <div className="content_header">
        <div className="main_header">근태관리</div>
        <div className="main_header">＞</div>
        <Link to={"/annual-manage"} className="sub_header">연차관리</Link>
      </div>
      <div className='oper_header_right'>
        <select
          name="yearSelect"
          id="yearSelect"
          className='oper_year_select'
          value={selectedYear}
          onChange={handleYearChange}
        >
          <option value={2024}>2024</option>
          <option value={2023}>2023</option>
        </select>
        <button className='oper_download_button' onClick={exportToPDF}>다운로드</button>
        {selectedScreen === 'R&D' ? (
          <button className='rnd_company_button' onClick={handleScreenChange}>
            R&D 센터
          </button>
        ) : (
          <button className='head_company_button' onClick={handleScreenChange}>
            본사
          </button>
        )}
      </div>
      
      <div className="content_container">
        <div className="container">
          <div className="container_attendance" id="table-to-xls">
            {selectedScreen === '본사' ? (
              <div className="Excel_annual">
                <table className="Explan_annual">
                  <tbody>
                    <tr>
                      <td className="TopS_annual">NO.</td>
                      <td className="TopS_annual" colSpan={2}>부서</td>
                    </tr>
                    <tr style={{ fontSize: '14.5px'}}>
                      <td>1</td>
                      <td>알고리즘 연구실</td>
                      <td>블록체인 1팀</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td rowSpan={6}>개발부</td>
                      <td rowSpan={4}>개발 1팀</td>
                    </tr>
                    <tr>
                      <td>3</td>
                    </tr>
                    <tr>
                      <td>4</td>
                    </tr>
                    <tr>
                      <td>5</td>
                    </tr>
                    <tr>
                      <td>6</td>
                      <td rowSpan={2}>개발 2팀</td>
                    </tr>
                    <tr>
                      <td>7</td>
                    </tr>
                    <tr>
                      <td>8</td>
                      <td rowSpan={5}>마케팅부</td>
                      <td rowSpan={2}>디자인팀</td>
                    </tr>
                    <tr>
                      <td>9</td>
                    </tr>
                    <tr>
                      <td>10</td>
                      <td rowSpan={3}>기획팀</td>
                    </tr>
                    <tr>
                      <td>11</td>
                    </tr>
                    <tr>
                      <td>12</td>
                    </tr>
                    <tr>
                      <td>13</td>
                      <td rowSpan={5}>관리부</td>
                      <td rowSpan={3}>관리팀</td>
                    </tr>
                    <tr>
                      <td>14</td>
                    </tr>
                    <tr>
                      <td>15</td>
                    </tr>
                    <tr>
                      <td>16</td>
                      <td rowSpan={2}>지원팀</td>
                    </tr>
                    <tr>
                      <td>17</td>
                    </tr>
                  </tbody>
                </table>
                <div>
                  {CountDivs()}
                  {generateDivs()}
                </div>
              </div>
              
            ) : (
              <div className="Excel_annual">
                <table className="Explan_annual">
                  <tbody>
                    <tr>
                      <td className="TopS_annual">NO.</td>
                      <td className="TopS_annual" colSpan={2}>부서</td>
                    </tr>
                    <tr style={{ fontSize: '14.5px'}}>
                      <td>1</td>
                      <td>블록체인 사업부</td>
                      <td>블록체인 1팀</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td rowSpan={6}>개발부</td>
                      <td rowSpan={4}>개발 1팀</td>
                    </tr>
                    <tr>
                      <td>3</td>
                    </tr>
                    <tr>
                      <td>4</td>
                    </tr>
                    <tr>
                      <td>5</td>
                    </tr>
                    <tr>
                      <td>6</td>
                      <td rowSpan={2}>개발 2팀</td>
                    </tr>
                    <tr>
                      <td>7</td>
                    </tr>
                    <tr>
                      <td>8</td>
                      <td rowSpan={5}>마케팅부</td>
                      <td rowSpan={2}>디자인팀</td>
                    </tr>
                    <tr>
                      <td>9</td>
                    </tr>
                    <tr>
                      <td>10</td>
                      <td rowSpan={3}>기획팀</td>
                    </tr>
                    <tr>
                      <td>11</td>
                    </tr>
                    <tr>
                      <td>12</td>
                    </tr>
                    <tr>
                      <td>13</td>
                      <td rowSpan={5}>관리부</td>
                      <td rowSpan={3}>관리팀</td>
                    </tr>
                    <tr>
                      <td>14</td>
                    </tr>
                    <tr>
                      <td>15</td>
                    </tr>
                    <tr>
                      <td>16</td>
                      <td rowSpan={2}>지원팀</td>
                    </tr>
                    <tr>
                      <td>17</td>
                    </tr>
                  </tbody>
                </table>
                <div>
                  {CountDivs()}
                  {generateDivs()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>  
      
    </div>
  );
};

export default AnnualManage;