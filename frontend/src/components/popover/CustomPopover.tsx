import React from 'react';
import "./CustomPopover.scss";
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
  attachment: string;
}

const CustomPopover: React.FC<CustomPopoverProps> = ({
  direction,
  position,
  dept,
  name,
  phone,
  mail,
  attachment,
}) => {
  
  return (
    <Popover placement={direction}>
      <PopoverTrigger>
        <div className="nodeicon">
          <div className="nodeicon_content">
            <span>{dept}</span>
            <img src={attachment ? attachment : UserIcon_dark} alt="UserIcon_dark" className="UserIcon" />
            <div>{name} | {position}</div>
          </div>
        </div>
      </PopoverTrigger>
      <Portal>
        <PopoverContent className='custom_popover'>
          <PopoverHeader className='custom_popover_header'>{dept}</PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody className='custom_popover_body'>
            <div className='custom_popover_body_left'>
              <img src={UserIcon} alt="UserIcon" className='user_icon'/>
              <div>{name}</div>
              <div>{position}</div>
            </div>
            <div className='custom_popover_body_right'>
              <div className='custom_popover_body_right_div'>
                <div>연락처</div>
                <div>{phone}</div>
              </div>
              <div className='custom_popover_body_right_div'>
                <div>메일주소</div>
                <div>{mail}</div>
              </div>
            </div>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default CustomPopover;
