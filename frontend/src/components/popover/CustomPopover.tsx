import React from 'react';
import {
  UserIcon_dark,
  UserIcon,
} from "../../assets/images/index";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  Portal,
  PlacementWithLogical,
} from '@chakra-ui/react';


interface CustomPopoverProps {
  direction: PlacementWithLogical;
  position: string;
  dept: string;
  name: string;
  phone: string;
  mail: string;
}

const CustomPopover: React.FC<CustomPopoverProps> = ({
  direction,
  position,
  dept,
  name,
  phone,
  mail,
}) => {


  return (
    <Popover placement={direction}>
      <PopoverTrigger>
        <div className="nodeicon">
          <div className="nodeicon_content">
            <span>{dept}</span>
            <img src={UserIcon_dark} alt="UserIcon_dark" className="UserIcon" />
            <div>{name} | {position}</div>
          </div>
        </div>
      </PopoverTrigger>
      <Portal>
        <PopoverContent width='420px' height='200px' border='0' borderRadius='1px' boxShadow='rgba(100, 100, 111, 0.1) 0px 7px 29px 0px'>
          <PopoverHeader height='34px' color='#272727' bg='#76CB7E' border='0' fontFamily='var(--font-family-Noto-M)' fontSize='14px' borderTopRightRadius='5px' borderTopLeftRadius='5px'>{dept}</PopoverHeader>
          <PopoverCloseButton color='#272727' />
          <PopoverBody display='flex' flexDirection='row' alignItems='center' borderBottomLeftRadius='5px' borderBottomRightRadius='5px'>
            <div style={{ width: '140px', height: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <img src={UserIcon} alt="UserIcon" style={{ width: '70px', height: '70px' }} />
              <div style={{ fontSize: '16px', fontFamily: 'var(--font-family-Noto-M)', marginTop: '10px' }}>{name}</div>
              <div style={{ fontSize: '16px', fontFamily: 'var(--font-family-Noto-M)' }}>{position}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '14px', color: '#909090', fontFamily: 'var(--font-family-Noto-M)' }}>연락처</div>
              <div style={{ fontSize: '15px', fontFamily: 'var(--font-family-Noto-M)' }}>{phone}</div>
              <div style={{ fontSize: '14px', color: '#909090', fontFamily: 'var(--font-family-Noto-M)', marginTop: '20px' }}>메일주소</div>
              <div style={{ fontSize: '14px', fontFamily: 'var(--font-family-Noto-M)' }}>{mail}</div>
            </div>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default CustomPopover;
