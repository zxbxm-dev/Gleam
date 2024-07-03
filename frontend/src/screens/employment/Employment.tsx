import { useState, useEffect } from "react";
import {
  SearchIcon
} from "../../assets/images/index";
import { ReactComponent as RightIcon } from "../../assets/images/Common/RightIcon.svg";
import { ReactComponent as LeftIcon } from "../../assets/images/Common/LeftIcon.svg";
import { ReactComponent as LastRightIcon } from "../../assets/images/Common/LastRightIcon.svg";
import { ReactComponent as FirstLeftIcon } from "../../assets/images/Common/FirstLeftIcon.svg";
import Pagination from "react-js-pagination";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  Portal,
} from '@chakra-ui/react';
import CustomModal from "../../components/modal/CustomModal";
import { Input } from '@chakra-ui/react';

import { useQueryClient, useQuery } from "react-query";
import { CheckEmploy, WriteEmploy, EditEmploy, DeleteEmploy } from "../../services/employment/EmploymentService";


const Employment = () => {
  const [page, setPage] = useState<number>(1);
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [employments, setEmployments] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [isAddModalOpen, setAddModalOpen] = useState(false);
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
  
    const employment = employments.find(e => e.id === index);
    if (employment) {
      setForm({
        title: employment.title,
        url: employment.url,
        site: employment.site
      });
    }
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
        queryClient.invalidateQueries("employments");
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
        queryClient.invalidateQueries("employments");
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

  const formData = {
    title: title,
    url: url,
    site: site,
    date: currentDate
  };

  WriteEmploy(formData)
    .then(response => {
      console.log('게시물 작성 성공', response);
      queryClient.invalidateQueries("employments");
      setAddModalOpen(false);
    })
    .catch(error => {
      console.log('게시물 작성 실패', error);
      setAddModalOpen(false);
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
                .map((employment, index) => (
                  <tr key={employment.id} className="board_content">
                    <td>{index + 1}</td>
                    <td className="text_left" onContextMenu={(e) => handleRightClick(employment.id, e)}>
                      <div
                        className="dropdown" // 드롭다운 클래스 추가
                      >
                        {employment.title}
                        {dropdownOpen && ( // 드롭다운 메뉴 열림 여부에 따라 메뉴 표시
                          <div className="dropdown-menu" style={{ position: 'absolute', top: dropdownPosition.y - 70, left: dropdownPosition.x - 210 }}>
                            <Popover placement="right-start">
                              <PopoverTrigger>
                                <button className="dropdown_pin">수정하기</button>
                              </PopoverTrigger>
                              <Portal>
                                <PopoverContent onClick={(e) => e.stopPropagation()} className="employment_popover_content">
                                  <PopoverHeader className="employment_popover_header">채용공고 수정하기</PopoverHeader>
                                  <PopoverCloseButton className="employment_popover_header_close" />
                                  <PopoverBody className="employment_popover_body">
                                    <div className="employment_popover_body_wrap">
                                      <div className="employment_popover_body_wrap_div">
                                        <div className="div_title">공고제목</div>
                                        <input value={form.title} color='#323232' onChange={handleTitleChange}/>
                                      </div>
                                      <div className="employment_popover_body_wrap_div">
                                        <div className="div_title">링크</div>
                                        <input value={form.url} color='#323232' onChange={handleUrlChange}/>
                                      </div>
                                      <div className="employment_popover_body_wrap_div">
                                        <div className="div_title">사이트명</div>
                                        <input value={form.site} color='#323232' onChange={handleSiteChange}/>
                                      </div>
                                    </div>
                                    <div className="button_wrap">
                                      <button className="white_button" onClick={handleEdit}>수정</button>
                                      <button className="cancle_button">취소</button>
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
                    <td className="dropdown url_wrap">
                      <a href={employment.url} target="_blank" rel="noopener noreferrer">{employment.url}</a>
                    </td>
                    <td>{employment.site}</td>
                    <td>{new Date(employment.createdAt).toISOString().substring(0, 10)}</td>
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
            <button className="primary_button" onClick={() => setAddModalOpen(true)}>게시물 작성</button>
          </div>
        </div>
      </div>
      <CustomModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        header={'채용공고 등록하기'}
        footer1={'등록'}
        footer1Class="red-btn"
        onFooter1Click={handleSubmit}
        footer2={'취소'}
        footer2Class="gray-btn"
        onFooter2Click={() => setAddModalOpen(false)}
        width="400px"
        height="250px"
      >
        <div className="body-container">
          <div className="AddTitle">
            <div className="employ_div">공고제목</div>
            <input placeholder='ex) 디자인 채용공고' className="TextInputCon" onChange={handleTitleChange} />
          </div>
          <div className="AddTitle">
            <div className="employ_div">링크</div>
            <input placeholder='내용을 입력해주세요.' className="TextInputCon" onChange={handleUrlChange} />
          </div>
          <div className="AddTitle">
            <div className="employ_div">사이트명</div>
            <input placeholder='내용을 입력해주세요.' className="TextInputCon" onChange={handleSiteChange} />
          </div>
        </div>
      </CustomModal>

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