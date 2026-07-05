import { Button, DatePicker, Form, Input, InputNumber, Spin } from "antd";
import React, { useState } from "react"
import dayjs from 'dayjs';
import { addOrder, getOrder } from "../service/appServiceBackend";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { BUTTON_TEXT, Payment, PAYMENT_TYPE, PRODUCT, PRODUCT_PRICE_MAP, Recommendation, RECOMMENDATION_TYPE } from "../constants/dictionaries.js";
import { AddOrder, FieldFormat, FieldPlaceholder, FieldRules, FieldStyle, OrderField } from "../constants/appConstant.js";
import { CascadePickerView, Selector, Toast, Popup } from "antd-mobile";
import TextArea from "antd/es/input/TextArea";
import { formattedPhone } from "../service/utils";
import { setOrder } from "../slices/orderSlice.js";
import { PickerValue } from "antd-mobile/es/components/picker-view";

interface AddOrderModalProps {
  setIsAddOrder: (isOpen: boolean) => void;
  isAddOrder: boolean;
  setLoading: (isOpen: boolean) => void;
  loading: boolean;
  view?: string;
}

export type ProductKey = keyof typeof PRODUCT_PRICE_MAP;

const HOURS = [
  ...Array.from({ length: 14 }, (_, i) => 10 + i), // 10–23
  0,
  1,
  2,
];

export const OrderTime = HOURS.map((h) => {
  const hour = String(h).padStart(2, "0");

  return {
    label: hour,
    value: hour,
    children: ["00", "15", "30", "45"].map((min) => ({
      label: min,
      value: min,
    })),
  };
});

export const AddOrderModal: React.FC<AddOrderModalProps> = ({setIsAddOrder, isAddOrder, setLoading, loading}) => {
    const [form] = Form.useForm();
    const dispatch: AppDispatch = useDispatch();
    const [phone, setPhone] = useState("");
    const handleSubmit = (values: AddOrder) => {
      setLoading(true);
      addOrder(values).then((orderId) => {
        getOrder().then((response) => {
            dispatch(setOrder(response?.orders));
        });
        setLoading(false);
        setIsAddOrder(false);
        orderId
          ? Toast.show({content: <div><b>Готово!</b><div>Договор № {orderId}</div></div>, icon: 'success', duration: 3000 })
          : Toast.show({content: `Ошибка!`, icon: 'fail', duration: 3000 });
      });
    };
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

    const [isPopupStartOpen, setIsPopupStartOpen] = useState(false);
    const [selectedTime, setSelectedTime] = useState<PickerValue[]>([]);
    const [timeField, setTimeField] = useState<string | null>(null);

    const handleTimeChange = (val: PickerValue[]) => {
      setSelectedTime(val);
    };

    const handleTimeConfirm = () => {
      if (!selectedTime.length) return;

      const hour = String(selectedTime[0] ?? '0');
      const minute = String(selectedTime[1] ?? '00');
      const formattedTime = `${hour.padStart(2, '0')}:${minute}`;

      form.setFieldsValue({
        [timeField as string]: formattedTime
      });

      setIsPopupStartOpen(false);
    };

    return (
      <Popup
        visible={isAddOrder}
        showCloseButton
        onClose={() => {
          setIsAddOrder(false);
          form.resetFields();
        }}
        onMaskClick={() => {
          setIsAddOrder(false);
          form.resetFields();
        }}
      >
        <div
          style={{
            maxWidth: '480px',
            width: '100%',
            margin: '0 auto',
            padding: '0 16px',
            boxSizing: 'border-box',
            overflowY: 'auto',
            maxHeight: '75vh',
            marginTop: '20px',
            marginBottom: '20px'
          }}
        >
          <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              saunaNum: ['SaunaFour'],
              prepaySource: [Payment.GoldAN],
              orderDate: dayjs(dayjs().format(FieldFormat.Date), FieldFormat.Date),
              price: 5000,
              [OrderField.Recommendation]: Recommendation.TwoGis
            }}
            onFinish={handleSubmit}
          >
            <Form.Item
              label={OrderField.FisrtNameLabel}
              name={OrderField.FisrtName}
              rules={[FieldRules.Required, FieldRules.ClientName]}
            >
              <Input style={FieldStyle.InputStyle} />
            </Form.Item>
            <Form.Item
              label={OrderField.PhoneLabel}
              name={OrderField.Phone}
              rules={[
                FieldRules.Required
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
              label={OrderField.PrepaySourceLabel}
              name={OrderField.PrepaySource}
              rules={[FieldRules.Required]}
            >
              <Selector
                options={PAYMENT_TYPE}
                onChange={(value) => {
                    form.setFieldsValue({
                      [OrderField.PrepaySource]: value
                    });
                    if (value[0] === Payment.No) {
                      form.setFieldsValue({
                        [OrderField.PrepayAmount]: 0
                      });
                    }
                  }
                }
              />
            </Form.Item>
            <Form.Item
              label={OrderField.PrepayAmountLabel}
              name={OrderField.PrepayAmount}
              rules={[FieldRules.PaymentAmount, FieldRules.Required]}
            >
              <InputNumber style={FieldStyle.InputStyle} />
            </Form.Item>
            <Form.Item
              label={OrderField.SaunaNumLabel}
              name={OrderField.SaunaNum}
              rules={[FieldRules.Required]}
            >
              <Selector
                options={PRODUCT}
                value={form.getFieldValue(OrderField.SaunaNum)}
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
              label="Стоимость"
              name="price"
            >
              <InputNumber style={FieldStyle.InputStyle}/>
            </Form.Item>
            <Form.Item
              label="Количество человек"
              name="peopleCount"
              rules={[{ required: true, message: 'Укажите количество человек' }]}
              initialValue={2}
            >
              <InputNumber
                min={1}
                max={20}
                style={FieldStyle.InputStyle}
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
              label={OrderField.RecommendationLabel}
              name={OrderField.Recommendation}
              rules={[FieldRules.Required]}
            >
              <Selector
                options={RECOMMENDATION_TYPE}
                onChange={(arr) =>
                  form.setFieldsValue({
                    [OrderField.Recommendation]: arr
                  })
                }
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
            <Form.Item
              label={OrderField.OrderDateLabel}
              name={OrderField.OrderDate}
              rules={[FieldRules.Required]}
            >
              <DatePicker
                style={FieldStyle.InputStyle}
                format={FieldFormat.Date}
                inputReadOnly={true}
                placeholder={FieldPlaceholder.Date}
                defaultValue={dayjs(dayjs().format(FieldFormat.Date), FieldFormat.Date)}
              />
            </Form.Item>
            <Form.Item style={{ textAlign: "center" }}>
              <Button type="primary" htmlType="submit">
                {BUTTON_TEXT.Add}
              </Button>
              <Button onClick={() => setIsAddOrder(false)} style={{ marginLeft: 8,  marginTop: 10}}>
                {BUTTON_TEXT.Cancel}
              </Button>
            </Form.Item>
          </Form>
          </Spin>
        <Popup
          visible={isPopupStartOpen}
          showCloseButton
          onClose={() => setIsPopupStartOpen(false)}
          onMaskClick={() => setIsPopupStartOpen(false)}
        >
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CascadePickerView
              options={OrderTime}
              value={selectedTime}
              onChange={handleTimeChange}
              style={{ width: '300px' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              type="primary"
              onClick={handleTimeConfirm}
              style={{ width: '300px', marginTop: 10, marginBottom: 40 }}
            >
              {BUTTON_TEXT.Ok}
            </Button>
          </div>

        </Popup>
      </div>
      </Popup>
    )
}