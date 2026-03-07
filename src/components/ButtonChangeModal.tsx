import { AutoCenter, CascadePickerView, Popup, Selector, Toast } from 'antd-mobile';
import React, { useState } from 'react';
import { Button, Form, Spin }  from 'antd';
import { EditSOutline } from 'antd-mobile-icons';
import { Input } from 'antd';
import { FieldPlaceholder, FieldRules, FieldStyle, OrderField, UpdateOrder } from '../constants/appConstant.ts';
import { BUTTON_TEXT, PRODUCT, PRODUCT_PRICE_MAP } from '../constants/dictionaries.ts';
import { formattedPhone } from '../service/utils.ts';
import { OrderTime, ProductKey } from './AddOrderModal.tsx';
import { updateOrder } from '../service/appServiceBackend.ts';
import { useDispatch, useSelector } from 'react-redux';
import { updateOrderAction } from '../slices/orderSlice.ts';
import { RootState } from '../store.ts';

interface ButtonChangeModalProps {
  orderId: string;
  disabled?: boolean;
  setIsOrderPopup: (isOpen: boolean) => void;
}

const { TextArea } = Input;

export const ButtonChangeModal: React.FC<ButtonChangeModalProps> = ({ orderId, setIsOrderPopup, disabled }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isUserInfo, setIsUserInfo] = React.useState<boolean>(false)
  const [isPopupStartOpen, setIsPopupStartOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string[]>([]);
  const [timeField, setTimeField] = useState<string | null>(null);
  const order = useSelector((state: RootState) =>
    state.order.order.find(o => o.id === orderId)
  );
  React.useEffect(() => {
    if (!order) return;

    form.setFieldsValue({
      [OrderField.Phone]: order?.phone,
      [OrderField.SaunaNum]: order?.sauna_num ? [order.sauna_num] : [],
      [OrderField.StartTime]: order?.start_time,
      [OrderField.EndTime]: order?.end_time,
      [OrderField.Comment]: order?.comment,
    });
  }, [order, form]);

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
    },
    handleClose: () => {
      setIsUserInfo(false);
      form.resetFields();
    },
    handleSubmit: async (values: UpdateOrder) => {
      const payload = {
        ...values,
        orderId,
      };

      try {
        setLoading(true);

        const orderId = await updateOrder(payload).then((result)=> {
          dispatch(updateOrderAction(result?.['data']));

          return result?.['data']?.['id']
        });

        if (!orderId) throw new Error();

        Toast.show({
          content: (<div><b>Готово!</b><div>Заказ № {orderId}</div></div>),
          icon: 'success',
          duration: 3000
        });
        form.resetFields();
        setIsUserInfo(false);
        setIsOrderPopup(false);
      } catch (e) {
        Toast.show({
          content: `Ошибка!`,
          icon: 'fail',
          duration: 3000
        });
      } finally {
        setLoading(false);
      }
    },
    handleTimeChange: (val: string[]) => {
      setSelectedTime(val);
    },
    handleTimeConfirm: () => {
      if (!selectedTime.length) return;

      const [hour, minute] = selectedTime;
      const formattedTime = `${hour.padStart(2, '0')}:${minute}`;

      form.setFieldsValue({
        [timeField as string]: formattedTime
      });

      setIsPopupStartOpen(false);
    }
  }

  return (
    <>
      <Button
        icon={<EditSOutline fontSize={40} />}
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
        bodyStyle={{ height: '50vh' }}
        onClose={actions.handleClose}
        onMaskClick={actions.handleClose}
      >
        <Spin spinning={loading} >
        <AutoCenter style={{ marginTop: '20px' }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={actions.handleSubmit}
            initialValues={{
              [OrderField.Phone]: order?.phone,
              [OrderField.SaunaNum]: order?.sauna_num ? [order.sauna_num] : [],
              [OrderField.StartTime]: order?.start_time,
              [OrderField.EndTime]: order?.end_time,
              [OrderField.Comment]: order?.comment,
            }}
          >
            <Form.Item
              label={OrderField.PhoneLabel}
              name={OrderField.Phone}
              rules={[
                FieldRules.Required//, FieldRules.PhoneFormat
              ]}
            >
              <Input
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
        </Spin>
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
          onChange={actions.handleTimeChange}
        />

        <Button
          type="primary"
          onClick={actions.handleTimeConfirm}
          style={{ width: '100%', marginTop: 10, marginBottom: 40 }}
        >
          {BUTTON_TEXT.Ok}
        </Button>
      </Popup>
    </>
  )
}