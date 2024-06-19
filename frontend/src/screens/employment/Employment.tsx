import { useState, useEffect } from "react";
import {
  SearchIcon
} from "../../assets/images/index";
import { ReactComponent as RightIcon } from "../../assets/images/Common/RightIcon.svg";
import { ReactComponent as LeftIcon } from "../../assets/images/Common/LeftIcon.svg";
import { ReactComponent as LastRightIcon } from "../../assets/images/Common/LastRightIcon.svg";
import { ReactComponent as FirstLeftIcon } from "../../assets/images/Common/FirstLeftIcon.svg";
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  Portal,
  useDisclosure,
} from '@chakra-ui/react';
import CustomModal from "../../components/modal/CustomModal";
import { Input } from '@chakra-ui/react';

import { useQuery } from "react-query";
import { CheckEmploy, WriteEmploy, EditEmploy, DeleteEmploy } from "../../services/employment/EmploymentService";


const Employment = () => {
  const { isOpen: isAdd, onOpen: AddOpen, onClose: AddClose } = useDisclosure();
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [employments, setEmployments] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clickIdx, setClickIdx] = useState<number | null>(null);
  const [postPerPage, setPostPerPage] = useState<number>(10);
  const [form, setForm] = useState<{
    title: string;
    url: string;
    site: string;
  }>({
    title: '',
    url: '',
    site: '',
  })

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1600) {
        setPostPerPage(10); // Desktop
      } else if (window.innerWidth >= 992) {
        setPostPerPage(8); // Laptop
      } else {
        setPostPerPage(8);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleTitleChange = (event: any) => {
    setForm({ ...form, title: event.target.value })
  };

  const handleUrlChange = (event: any) => {
    setForm({ ...form, url: event.target.value })
  };

  const handleSiteChange = (event: any) => {
    setForm({ ...form, site: event.target.value })
  };

  useEffect(() => {
    const initialEmployments = [
      { id: 1, title: "[신입 환영] 채용공고", url: "https://www.jobkorea.co.kr/", site: "잡코리아", date: "2024-05-01" },
      { id: 2, title: "사무직 채용공고", url: "https://www.jobkorea.co.kr/", site: "잡코리아", date: "2024-05-01" },
      { id: 3, title: "보안 개발자 채용공고입니다 길이서 안보일때는 축ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ", url: "https://www.jobkorea.co.kr/Recruit/GI_Read/44884435?Oem_Code=C1&logpath=1&stext=%ED%8F%AC%EC%B2%B4%EC%9D%B8%EC%8A%A4&listno=2", site: "잡코리아", date: "2024-05-01" },
      { id: 4, title: "	R&D 연구센터 채용...", url: "https://www.jobkorea.co.kr/", site: "잡코리아", date: "2024-05-01" },
      { id: 5, title: "	빅데이터 분석 채용...", url: "https://www.jobkorea.co.kr/", site: "잡코리아", date: "2024-05-01" },
      { id: 6, title: "	[신입 환영] 채용공고", url: "https://www.jobkorea.co.kr/", site: "잡코리아", date: "2024-05-01" },
      { id: 7, title: "	[신입 환영] 채용공고", url: "https://www.jobkorea.co.kr/", site: "잡코리아", date: "2024-05-01" },
      { id: 8, title: "	[신입 환영] 채용공고", url: "https://www.jobkorea.co.kr/", site: "잡코리아", date: "2024-05-01" },
      { id: 9, title: "	[신입 환영] 채용공고", url: "https://www.jobkorea.co.kr/", site: "잡코리아", date: "2024-05-01" },
      { id: 10, title: "[신입 환영] 채용공고", url: "https://www.jobkorea.co.kr/", site: "잡코리아", date: "2024-05-01" },
      { id: 11, title: "[신입 환영] 채용공고", url: "https://www.jobkorea.co.kr/", site: "잡코리아", date: "2024-05-01" },
      { id: 12, title: "[신입 환영] 채용공고", url: "https://www.jobkorea.co.kr/", site: "잡코리아", date: "2024-05-01" },
    ];
    setEmployments(initialEmployments);
  }, []);

  // 채용공고 목록 불러오기
  const fetchEmployments = async () => {
    try {
      const response = await CheckEmploy();
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch data");
    }
  };

  useQuery("employments", fetchEmployments, {
    onSuccess: (data) => setEmployments(data),
    onError: (error) => {
      console.log(error)
    }
  });



  const handlePageChange = (page: number) => {
    setPage(page);
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredEmployments = employments.filter((employment) =>
    employment.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRightClick = (index: number, event: React.MouseEvent<HTMLTableCellElement>) => {
    event.preventDefault();
    setDropdownOpen(true);
    setDropdownPosition({ x: event.pageX, y: event.pageY });
    setClickIdx(index);
  };

  const formatDate = (date: any) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };
  const currentDate = formatDate(new Date());

  // 채용공고 수정하기
  const handleEdit = () => {
    const { title, url, site } = form;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("url", url);
    formData.append("site", site);
    formData.append("date", currentDate);

    EditEmploy(clickIdx, formData)
      .then((response) => {
        console.log("채용공고가 성공적으로 수정되었습니다.", response);
        setDropdownOpen(false);
      })
      .catch((error) => {
        console.error("채용공고 수정에 실패했습니다.", error);
      });
  };

  // 채용공고 삭제하기
  const handleDelete = () => {
    DeleteEmploy(clickIdx)
      .then((response) => {
        console.log("채용공고가 성공적으로 삭제되었습니다.", response);
      })
      .catch((error) => {
        console.error("채용공고 삭제에 실패했습니다.", error);
      });

    setDeleteModalOpen(false);
    setDropdownOpen(false);
  };


  // 채용공고 게시물 작성
  const handleSubmit = () => {

    const { title, url, site } = form;

    if (title === "") {
      alert("공고 제목을 입력해 주세요.")
      return;
    } else if (url === "") {
      alert("링크를 입력해 주세요.")
      return;
    } else if (site === "") {
      alert("사이트명을 입력해 주세요.")
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("url", url);
    formData.append("site", site);
    formData.append("date", currentDate);

    WriteEmploy(formData)
      .then(response => {
        console.log('게시물 작성 성공')
        AddClose();
      })
      .catch(error => {
        console.log('게시물 작성 실패')
        AddClose();
      })
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownOpen && !event.target.closest('.dropdown-menu')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownOpen]);


  return (
    <div className="content">
      <div className="content_container">
        <div className="main_header">
          <div className="header_name">채용공고</div>
          <div className="input-wrapper">
            <input
              type="search"
              className="input_form"
              placeholder="검색할 내용을 입력하세요."
              value={searchTerm}
              onChange={handleSearch}
            />
            <img src={SearchIcon} alt="SearchIcon" className="search-icon" />
          </div>
        </div>

        <div>
          <table className="employment_board_list">
            <colgroup>
              <col width="6%" />
              <col width="29%" />
              <col width="35%" />
              <col width="15%" />
              <col width="15%" />
            </colgroup>
            <thead>
              <tr className="board_header">
                <th>순번</th>
                <th>공고 제목</th>
                <th>URL</th>
                <th>사이트</th>
                <th>등록일</th>
              </tr>
            </thead>
            <tbody className="board_container">
              {filteredEmployments
                .slice((page - 1) * postPerPage, page * postPerPage)
                .map((employment) => (
                  <tr key={employment.id} className="board_content">
                    <td>{employment.id}</td>
                    <td style={{ textAlign: "left", paddingLeft: "100px" }} onContextMenu={(e) => handleRightClick(employment.id, e)}>
                      <div
                        className="dropdown" // 드롭다운 클래스 추가
                      >
                        {employment.title}
                        {dropdownOpen && ( // 드롭다운 메뉴 열림 여부에 따라 메뉴 표시
                          <div className="dropdown-menu" style={{ position: 'absolute', top: dropdownPosition.y - 50, left: dropdownPosition.x - 250 }}>
                            <Popover placement="right-start">
                              <PopoverTrigger>
                                <button className="dropdown_pin">수정하기</button>
                              </PopoverTrigger>
                              <Portal>
                                <PopoverContent onClick={(e) => e.stopPropagation()} width='400px' height='250px' border='0' borderRadius='5px' boxShadow='0px 0px 5px #444' fontSize='14px'>
                                  <PopoverHeader color='white' bg='#746E58' border='0' fontFamily='var(--font-family-Noto-B)' borderTopRadius='5px'>채용공고 수정하기</PopoverHeader>
                                  <PopoverCloseButton color='white' />
                                  <PopoverBody display='flex' flexDirection='column' alignItems='center'>
                                    <div style={{ width: '400px', height: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px', padding: '10px' }}>
                                      <div style={{ fontSize: '14px', color: '#909090', fontFamily: 'var(--font-family-Noto-M)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '80px', textAlign: 'right' }}>공고제목</div>
                                        <Input placeholder='ex) 디자인 채용공고' size='sm' color='#323232' />
                                      </div>
                                      <div style={{ fontSize: '14px', color: '#909090', fontFamily: 'var(--font-family-Noto-M)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '80px', textAlign: 'right' }}>링크</div>
                                        <Input placeholder='내용을 입력해주세요.' size='sm' color='#323232' />
                                      </div>
                                      <div style={{ fontSize: '14px', color: '#909090', fontFamily: 'var(--font-family-Noto-M)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '80px', textAlign: 'right' }}>사이트명</div>
                                        <Input placeholder='내용을 입력해주세요.' size='sm' color='#323232' />
                                      </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                      <button style={{ width: '70px', height: '35px', color: '#746E58', backgroundColor: '#fff', border: '1px solid #746E58', borderRadius: '5px', fontFamily: 'var(--font-family-Noto-B)' }} onClick={handleEdit}>수정</button>
                                      <button style={{ width: '70px', height: '35px', color: '#929292', backgroundColor: '#fff', border: '1px solid #929292', borderRadius: '5px', fontFamily: 'var(--font-family-Noto-B)' }}>취소</button>
                                    </div>
                                  </PopoverBody>
                                </PopoverContent>
                              </Portal>
                            </Popover>
                            <div className="dropdown_pin" onClick={() => setDeleteModalOpen(true)} >삭제하기</div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="dropdown" style={{ textAlign: "left", paddingLeft: "150px", textDecoration: "underline" }}>
                      <a href={employment.url} target="_blank" rel="noopener noreferrer">{employment.url}</a>
                    </td>
                    <td>{employment.site}</td>
                    <td>{employment.date}</td>
                  </tr>
                ))}
            </tbody>
          </table>


          <div className="main_bottom">
            <Pagination
              activePage={page}
              itemsCountPerPage={postPerPage}
              totalItemsCount={filteredEmployments.length}
              pageRangeDisplayed={Math.ceil(filteredEmployments.length / postPerPage)}
              prevPageText={<LeftIcon />}
              nextPageText={<RightIcon />}
              firstPageText={<FirstLeftIcon />}
              lastPageText={<LastRightIcon />}
              onChange={handlePageChange}
            />

            <Popover placement="left-start" isOpen={isAdd} onClose={AddClose}>
              <PopoverTrigger>
                <button className="primary_button" onClick={AddOpen}>게시물 작성</button>
              </PopoverTrigger>
              <Portal>
                <PopoverContent width='400px' height='250px' border='0' borderRadius='5px' boxShadow='0px 0px 5px #444' fontSize='14px'>
                  <PopoverHeader color='white' bg='#746E58' border='0' fontFamily='var(--font-family-Noto-B)' borderTopRadius='5px'>채용공고 등록하기</PopoverHeader>
                  <PopoverCloseButton color='white' />
                  <PopoverBody display='flex' flexDirection='column' alignItems='center'>
                    <div style={{ width: '400px', height: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px', padding: '10px' }}>
                      <div style={{ color: '#909090', fontFamily: 'var(--font-family-Noto-M)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '80px', textAlign: 'right' }}>공고제목</div>
                        <Input placeholder='ex) 디자인 채용공고' size='sm' color='#323232' onChange={handleTitleChange} />
                      </div>
                      <div style={{ color: '#909090', fontFamily: 'var(--font-family-Noto-M)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '80px', textAlign: 'right' }}>링크</div>
                        <Input placeholder='내용을 입력해주세요.' size='sm' color='#323232' onChange={handleUrlChange} />
                      </div>
                      <div style={{ color: '#909090', fontFamily: 'var(--font-family-Noto-M)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '80px', textAlign: 'right' }}>사이트명</div>
                        <Input placeholder='내용을 입력해주세요.' size='sm' color='#323232' onChange={handleSiteChange} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '7px' }}>
                      <button style={{ width: '66px', height: '35px', color: '#fff', backgroundColor: '#746E58', borderRadius: '5px', fontFamily: 'var(--font-family-Noto-B)' }} onClick={handleSubmit}>등록</button>
                      <button style={{ width: '66px', height: '35px', color: '#746E58', backgroundColor: '#fff', border: '1px solid #929292', borderRadius: '5px', fontFamily: 'var(--font-family-Noto-B)' }} onClick={AddClose}>취소</button>
                    </div>
                  </PopoverBody>
                </PopoverContent>
              </Portal>
            </Popover>
          </div>
        </div>
      </div>
      <CustomModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        header={'알림'}
        footer1={'삭제'}
        footer1Class="red-btn"
        onFooter1Click={handleDelete}
        footer2={'취소'}
        footer2Class="gray-btn"
        onFooter2Click={() => setDeleteModalOpen(false)}
      >
        <div>
          삭제하시겠습니까?
        </div>
      </CustomModal>
    </div>
  );
};

export default Employment;