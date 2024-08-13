import React, { useState } from "react";
import CustomModal from "../../modal/CustomModal";

interface SetProfileProps {
    openProfile: boolean;
    setOpenProfile: React.Dispatch<React.SetStateAction<boolean>>;
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

const SetProfile: React.FC<SetProfileProps> = ({ openProfile, setOpenProfile }) => {
    const [paletteIndex, setPaletteIndex] = useState<number | null>(null);
    const [profileName, setProfileName] = useState<string>("");

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileName(e.target.value);
    };

    const handleSubmit = () => {
        if (!profileName) {
            alert("프로필 이름을 입력해주세요.");
            return;
        }

        const payload = {
            colorIndex: paletteIndex,
            title: profileName,
        };

        console.log("페이로드 >>", payload);
        setOpenProfile(false);
    };

    const handleCloseModal = () => {
        setOpenProfile(false);
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
