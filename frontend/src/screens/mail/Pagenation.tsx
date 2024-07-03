import React, { Dispatch, SetStateAction } from "react";
import {
    LeftIcon,
    RightIcon,
} from "../../assets/images/index";


interface PageProps {
    setPage: Dispatch<SetStateAction<number>>;
    filteredMails: any[];
    itemsPerPage: number;
    page: number;
    totalPages: number;
}

const Pagenation: React.FC<PageProps> = ({
    setPage,
    filteredMails,
    itemsPerPage,
    page,
    totalPages
}) => {

    return (
        <div className="mail_pagination">
            {filteredMails.length > itemsPerPage && (
                <div className="Pagination">
                    <img
                        src={LeftIcon}
                        onClick={() => {
                            if (page > 1) {
                                setPage(page - 1);
                            }
                        }}
                        alt="Previous Page"
                    />
                    <input
                        type="text"
                        value={page}
                        className="PageInput"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const inputPage = e.target.value.replace(/\D/g, '');
                            setPage(inputPage ? Number(inputPage) : 0);
                        }}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            if (e.key === 'Enter') {
                                const inputPage = Number(e.currentTarget.value);
                                if (!isNaN(inputPage) && inputPage >= 1 && inputPage <= totalPages) {
                                } else {
                                    setPage(1);
                                }
                            }
                        }}
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                            const inputPage = Number(e.currentTarget.value);
                            if (!isNaN(inputPage) && inputPage >= 1 && inputPage <= totalPages) {
                            } else {
                                setPage(1);
                            }
                        }}
                    />
                    <span> / </span>
                    <span className="PagesTotal">{totalPages}</span>
                    <img
                        src={RightIcon}
                        onClick={() => {
                            if (page < totalPages) {
                                setPage(page + 1);
                            }
                        }}
                        alt="Next Page"
                    />
                </div>
            )}
        </div>
    )
}

export default Pagenation;