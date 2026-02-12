import { AutoCenter, Popup } from 'antd-mobile';
import React from 'react';
import { Button }  from 'antd';
import { UserContactOutline, PhonebookOutline } from 'antd-mobile-icons';
import { Input } from 'antd';
import { FieldPlaceholder, FieldStyle } from '../constants/appConstant.ts';
import { BUTTON_TEXT } from '../constants/dictionaries.ts';
import { formattedPhone } from '../service/utils.ts';

interface ButtonChangeModalProps {
  record: any;
  type: string;
  fieldName: string;
  updateData: (fieldValue: string, fieldName: string) => void;
}

const { TextArea } = Input;

export const ButtonChangeModal: React.FC<ButtonChangeModalProps> = ({ record, type, fieldName, updateData }) => {
  let value = record?.[fieldName]
  const [isUserInfo, setIsUserInfo] = React.useState<boolean>(false)
  const [newValue, setNewValue] = React.useState(value || '')
  React.useEffect(() => {
    setNewValue(value);
  }, [value]);

  const actions = {
    handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const formattedPhoneStr = formattedPhone(e.target.value);

      setNewValue(formattedPhoneStr);
    },
  }

  const iconView = () => {
    if (type === 'TextArea') {
      return (<UserContactOutline fontSize={40} />)
    } else if (type === 'PhoneInput') {
      return (<PhonebookOutline fontSize={40} />)
    }
  }

  return (
    <>
      <Button
        icon={iconView()}
        variant="filled"
        onClick={() => setIsUserInfo(true)}
        size='large'
        style={{ height: 55, width: 55, marginLeft: '30px' }}
        color="primary"
      />
      <Popup
        visible={isUserInfo}
        showCloseButton
        onClose={() => {setIsUserInfo(false);}}
        onMaskClick={() => setIsUserInfo(false)}
        bodyStyle={{ height: '40vh' }}
      >
        <AutoCenter style={{ marginTop: '20px' }}>
        { type === 'TextArea' && <TextArea
          showCount
          maxLength={200}
          placeholder={FieldPlaceholder.Comment}
          autoSize={{ minRows: 3, maxRows: 7 }}
          style={FieldStyle.AreaStyle}
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
        />}
        { type === 'PhoneInput' && <Input
          value={newValue}
          placeholder="+7 (777) 123-45-67"
          onChange={actions.handlePhoneChange}
          maxLength={18}
          style={FieldStyle.InputStyle}
        />}
        <Button type="primary" htmlType="submit" onClick={() => {
          updateData(newValue, fieldName)
          setIsUserInfo(false)
        }}>
          {BUTTON_TEXT.Save}
        </Button>
        <Button onClick={() => setIsUserInfo(false)} style={{ marginLeft: 8,  marginTop: 10}}>
          {BUTTON_TEXT.Cancel}
        </Button>
        </AutoCenter>
      </Popup>
    </>
  )
}