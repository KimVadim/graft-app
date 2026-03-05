import { AutoCenter, CascadePickerView, Popup, Selector, Toast } from 'antd-mobile';
import React, { useState } from 'react';
import { Button, Form }  from 'antd';
import { UserContactOutline, PhonebookOutline } from 'antd-mobile-icons';
import { Input } from 'antd';
import { FieldPlaceholder, FieldRules, FieldStyle, OrderField, UpdateOrder } from '../constants/appConstant.ts';
import { BUTTON_TEXT, PRODUCT, PRODUCT_PRICE_MAP } from '../constants/dictionaries.ts';
import { formattedPhone } from '../service/utils.ts';
import { OrderTime, ProductKey } from './AddOrderModal.tsx';
import { updateOrder } from '../service/appServiceBackend.ts';

interface ButtonChangeModalProps {
  record: any;
  type: string;
  fieldName: string;
  disabled?: boolean;
  updateData: (valuse: UpdateOrder) => void;
}

const { TextArea } = Input;

export const ButtonChangeModal: React.FC<ButtonChangeModalProps> = ({ record, type, fieldName, updateData, disabled }) => {
  const [form] = Form.useForm();
  const [phone, setPhone] = useState("");
  const [isUserInfo, setIsUserInfo] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (record) {
      form.setFieldsValue({
        [OrderField.Phone]: record.phone,
        [OrderField.SaunaNum]: record.sauna_num ? [record.sauna_num] : [],
        [OrderField.StartTime]: record.start_time,
        [OrderField.EndTime]: record.end_time,
        [OrderField.Comment]: record.comment,
      });

      setPhone(record.phone);
    }
  }, [record, form]);

  const actions = {
    handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      const cursorPos = e.target.selectionStart || 0;
      const formatted = formattedPhone(input);
      form.setFieldValue('phone', formatted);

      setTimeout(() => {
        const inputElement = e.target as HTMLInputElement;
        if (inputElement.setSelectionRange) {
          const newPos = Math.min(cursorPos + (formatted.length - input.length), formatted.length);
          inputElement.setSelectionRange(newPos, newPos);
        }
      }, 0);
      setPhone(formatted);
    },
  }

  const iconView = () => {
    if (type === 'TextArea') {
      return (<UserContactOutline fontSize={40} />)
    } else if (type === 'PhoneInput') {
      return (<PhonebookOutline fontSize={40} />)
    }
  }

const handleSubmit = async (values: UpdateOrder) => {
    const payload = {
      ...values,
      orderId: record.id, // 👈 добавляем id заказа
    };

    const orderId = await updateOrder(payload);

    if (orderId) {
      Toast.show({
        content: (
          <div>
            <b>Готово!</b>
            <div>Договор № {orderId}</div>
          </div>
        ),
        icon: 'success',
        duration: 3000
      });

      setIsUserInfo(false);
    } else {
      Toast.show({
        content: `Ошибка!`,
        icon: 'fail',
        duration: 3000
      });
    }
  };

  const [isPopupStartOpen, setIsPopupStartOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string[]>([]);
  const [timeField, setTimeField] = useState<string | null>(null);

  const handleTimeChange = (val: string[]) => {
    setSelectedTime(val);
  };

  const handleTimeConfirm = () => {
    if (!selectedTime.length) return;

    const [hour, minute] = selectedTime;
    const formattedTime = `${hour.padStart(2, '0')}:${minute}`;

    form.setFieldsValue({
      [timeField as string]: formattedTime
    });

    setIsPopupStartOpen(false);
  };
  console.log(record)
  return (
    <>
      <Button
        icon={iconView()}
        variant="filled"
        onClick={() => setIsUserInfo(true)}
        size='large'
        style={{ height: 55, width: 55, marginLeft: '30px' }}
        color="primary"
        disabled={disabled}
      />
      <Popup
        visible={isUserInfo}
        showCloseButton
        onClose={() => {setIsUserInfo(false);}}
        onMaskClick={() => setIsUserInfo(false)}
        bodyStyle={{ height: '50vh' }}
      >
        <AutoCenter style={{ marginTop: '20px' }}>
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              label={OrderField.PhoneLabel}
              name={OrderField.Phone}
              rules={[
                FieldRules.Required//, FieldRules.PhoneFormat
              ]}
            >
              <Input
                value={phone}
                placeholder="+7 (777) 123-45-67"
                onChange={actions.handlePhoneChange}
                maxLength={18}
                style={FieldStyle.InputStyle}
              />
            </Form.Item>
            <Form.Item
              label={OrderField.SaunaNumLabel}
              name={OrderField.SaunaNum}
              rules={[FieldRules.Required]}
            >
              <Selector
                options={PRODUCT}
                onChange={(arr) => {
                  const saunaKey = arr[0] as ProductKey;

                  form.setFieldsValue({
                    [OrderField.SaunaNum]: arr,
                    price: PRODUCT_PRICE_MAP[saunaKey]
                  });
                }}
              />
            </Form.Item>
            <Form.Item
              label={OrderField.StartTimeLabel}
              name={OrderField.StartTime}
              rules={[FieldRules.Required]}
            >
              <Input
                style={FieldStyle.InputStyle}
                readOnly
                onClick={() => {
                  setTimeField(OrderField.StartTime);
                  setIsPopupStartOpen(true);
                }}
              />
            </Form.Item>
            <Form.Item
              label={OrderField.EndTimeLabel}
              name={OrderField.EndTime}
              rules={[FieldRules.Required]}
            >
              <Input
                style={FieldStyle.InputStyle}
                readOnly
                onClick={() => {
                  setTimeField(OrderField.EndTime);
                  setIsPopupStartOpen(true);
                }}
              />
            </Form.Item>
            <Form.Item
              label={OrderField.CommentLabel}
              name={OrderField.Comment}
            >
              <TextArea
                showCount
                maxLength={300}
                placeholder={FieldPlaceholder.Comment}
                autoSize={{ minRows: 2, maxRows: 4 }}
                style={FieldStyle.AreaStyle}
              />
            </Form.Item>
            <Form.Item style={{ textAlign: "center" }}>
              <Button type="primary" htmlType="submit">
                {BUTTON_TEXT.Add}
              </Button>
              <Button onClick={() => {}} style={{ marginLeft: 8,  marginTop: 10}}>
                {BUTTON_TEXT.Cancel}
              </Button>
            </Form.Item>
          </Form>
        </AutoCenter>
      </Popup>
      <Popup
        visible={isPopupStartOpen}
        showCloseButton
        onClose={() => setIsPopupStartOpen(false)}
        onMaskClick={() => setIsPopupStartOpen(false)}
      >
        <CascadePickerView
          options={OrderTime}
          value={selectedTime}
          onChange={handleTimeChange}
        />

        <Button
          type="primary"
          onClick={handleTimeConfirm}
          style={{ width: '100%', marginTop: 10, marginBottom: 40 }}
        >
          {BUTTON_TEXT.Ok}
        </Button>
      </Popup>
    </>
  )
}