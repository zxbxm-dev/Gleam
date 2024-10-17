import React, { useEffect, useState } from "react";
import CustomModal from "../../modal/CustomModal";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { selectedRoomIdState, ChatRoomProfileState } from "../../../recoil/atoms";
import { changeRoomData } from "../../../services/message/MessageApi";

export interface ChatRoom {
    roomId: number;
    isGroup: boolean;
    hostUserId: string;
    invitedUserIds: string[];
    title: string;
    othertitle: string;
    isSelfChat: boolean;
    unreadCount: number;
    userTitle?: {
      [userId: string]: {
        userId: string;
        username: string;
        company: string | null;
        department: string | null;
        team: string | null;
        position: string | null;
        spot: string | null;
        attachment: string | null;
      };
    };
    subContent: string;
    profileColor: string;
    profileImage: string | null;
    crt: string;
    upt: string;
    dataValues?: {
      roomId: number;
      isGroup: boolean;
      hostUserId: string;
      invitedUserIds: string[];
      title: string;
      userTitle?: { [userId: string]: string };
      subContent: string;
      profileColor: string;
      profileImage: string | null;
      crt: string;
      upt: string;
      updatedAt: string;
    };
  }

interface SetProfileProps {
    openProfile: boolean;
    setOpenProfile: React.Dispatch<React.SetStateAction<boolean>>;
    selectedChatRoom: ChatRoom | null;
}

const ProfilePalette = [
    { color: "#FF96EE", borderColor: "#EC64D6" },
    { color: "#FF9191", borderColor: "#E85D5D" },
    { color: "#F3C639", borderColor: "#E3B337" },
    { color: "#91C06B", borderColor: "#6FA742" },
    { color: "#45995C", borderColor: "#3B814E" },
    { color: "#6AC9FF", borderColor: "#35A7E7" },
    { color: "#618DFF", borderColor: "#366AEF" },
    { color: "#916AFF", borderColor: "#7248E9" },
    { color: "#5C6174", borderColor: "#404558" },
    { color: "#6A5644", borderColor: "#59422D" },
];

const SetProfile: React.FC<SetProfileProps> = ({ openProfile, setOpenProfile, selectedChatRoom }) => {
    const [paletteIndex, setPaletteIndex] = useState<number | null>(null);
    const [profileName, setProfileName] = useState<string>("");
    const [profileColor, setProfileColor] = useState<string>(""); // profileColor 상태 추가
    const selectedRoomId = useRecoilValue(selectedRoomIdState);
    const setChatRoomProfileState = useSetRecoilState(ChatRoomProfileState);

    useEffect(() => {
        if (selectedChatRoom && selectedChatRoom.dataValues) {
            setProfileName(selectedChatRoom.dataValues.title);
            setProfileColor(selectedChatRoom.dataValues.profileColor);
            const index = ProfilePalette.findIndex(
                (palette) => palette.color === selectedChatRoom?.dataValues?.profileColor
            );
            setPaletteIndex(index !== -1 ? index : null); // paletteIndex 설정
        }
    }, [selectedChatRoom]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileName(e.target.value);
    };

    const handleSubmit = async () => {
        if (!profileName.trim() || paletteIndex === null) {
            alert("대화방 이름과 프로필 색상을 모두 입력해주세요.");
            return;
        }

        const payload = {
            roomId: selectedRoomId.roomId,
            othertitle: profileName,
            profileColor: ProfilePalette[paletteIndex].color,
        };

        console.log("Sending payload:", payload);

        try {
            await changeRoomData(payload.roomId, payload.othertitle, payload.profileColor);
            setChatRoomProfileState(true);
            handleCloseModal();
        } catch (error) {
            console.error("프로필 업데이트 실패:", error);
            alert("프로필 업데이트에 실패했습니다. 다시 시도해주세요.");
        }
    };

    const handleCloseModal = () => {
        setOpenProfile(false);
        setProfileName('');
    };

    return (
        <CustomModal
            isOpen={openProfile}
            onClose={handleCloseModal}
            header="대화방 프로필 설정"
            headerTextColor="white"
            footer1="확인"
            footer1Class="green-btn"
            onFooter1Click={handleSubmit}
            footer2="취소"
            footer2Class="gray-btn"
            onFooter2Click={handleCloseModal}
            width="240px"
            height="auto"
        >
            <div className="body-container ProfileSetting">
                <div className="ProfileAndPalette">
                    <div
                        className="Profile"
                        style={{
                            backgroundColor: paletteIndex !== null ? ProfilePalette[paletteIndex].color : "",
                            border: paletteIndex !== null ? `1px solid ${ProfilePalette[paletteIndex].borderColor}` : "",
                        }}
                    >
                        {profileName.charAt(0)}
                    </div>
                    <div className="Palette">
                        {ProfilePalette.map((palette, index) => (
                            <div
                                key={index}
                                style={{ backgroundColor: palette.color }}
                                onClick={() => setPaletteIndex(index)}
                            ></div>
                        ))}
                    </div>
                </div>
                <input
                    placeholder="(필수) 대화방 이름을 입력해주세요."
                    className="TextInputCon"
                    value={profileName}
                    onChange={handleNameChange}
                />
            </div>
        </CustomModal>
    );
};

export default SetProfile;

