import React, { useState } from 'react';
import { AutoComplete, Button, DatePicker, Form, InputNumber, Spin } from 'antd';
import { FieldFormat, FieldPlaceholder, FieldRules, FieldStyle, ModalTitle, OpportunityField, MenuType, OrderFieldData, OrderItemField, MenuFieldData, AddOrderItem } from '../constants/appConstant.ts';
import { formatPhoneNumber } from '../service/utils.ts';
import { addOrderItem, closeOpty, getOrder, updateOpty } from '../service/appServiceBackend.ts';
import { Dialog, Popup, Divider, Space, Card, Toast, AutoCenter } from 'antd-mobile'
import { BUTTON_TEXT, MODAL_TEXT } from '../constants/dictionaries.ts';
import dayjs from 'dayjs';
import { StopOutline } from 'antd-mobile-icons';
import { ButtonChangeModal } from './ButtonChangeModal.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store.ts';
import { setOrderItem } from '../slices/orderitemSlice.ts';

interface OpportunityModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  record: any;
}

export const OpportunityModal: React.FC<OpportunityModalProps> = ({ isModalOpen, setIsModalOpen, record }) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const optyPayDate = new Date(record?.[OpportunityField.OrderDate]);
  const orderId = record?.[OrderFieldData.Id]
  const [isPopupItemOpen, setIsPopupItemOpen] = useState(false);
  const [formItem] = Form.useForm();
  const [options, setOptions] = useState<{ menuId: String; sales: number; price: number; value: string; label: string }[]>([]);
  const menuData = useSelector((state: RootState) => state.menu.menu) as unknown as MenuType[];
  const dispatch: AppDispatch = useDispatch();

  const actions = {
    handleSubmit: (optyId: string) => {
      setLoading(true);
      closeOpty(optyId).then(() => {
        setLoading(false);
        setIsModalOpen(false);
      });
    },
    handleUpdateOpty: (value: string, fieldName: string) => {
      setLoading(true);
      updateOpty({orderId, [fieldName]: value}).then(() => {
        setLoading(false);
        setIsModalOpen(false);
        Toast.show({content: <div><b>Готово!</b><div>Договор обновлен</div></div>, icon: 'success', duration: 3000 })
      });
    },
    handleAddItem: (values: AddOrderItem) => {
      setLoading(true);
      addOrderItem(values).then((orderId) => {
        getOrder().then((response) => {
          dispatch(setOrderItem(response?.orderItem));
        })
        setLoading(false);
        setIsPopupItemOpen(false)
        orderId
          ? Toast.show({content: <div><b>Готово!</b><div>Договор № {orderId}</div></div>, icon: 'success', duration: 3000 })
          : Toast.show({content: `Ошибка!`, icon: 'fail', duration: 3000 });
      });
    },
    handleSearch: (value: string) => {
        if (!menuData) return;
        const filteredOptions = menuData
          .filter(item => item[MenuFieldData.MenuStatus] === 'Active')
          .filter(item =>
            item[MenuFieldData.MenuName].toLowerCase().includes(value.toLowerCase())
          )
          .slice(0, 7)
          .map(item => ({
            menuId: item[MenuFieldData.Id],
            sales: item[MenuFieldData.Sales],
            price: item[MenuFieldData.Price],
            value: `${item[MenuFieldData.Id]} - ${item[MenuFieldData.MenuName]}`,
            label: `${item[MenuFieldData.Id]} - ${item[MenuFieldData.MenuName]}`,
          }));

        setOptions(filteredOptions);
      },
  };

  let parsedDate = optyPayDate && dayjs(optyPayDate);
  return (
    <Popup
      visible={isModalOpen}
      showCloseButton
      onClose={() => {setIsModalOpen(false);}}
      onMaskClick={() => {setIsModalOpen(false);}}
    >
      <Space justify='center' block>
      <Spin spinning={loading}>
        <div
          style={{
            height: '55vh',
            overflowY: 'scroll',
            padding: '20px',
            marginBottom: '30px',
            justifyContent: 'center',
            maxWidth: '360px',
          }}
        >
          <Card title={ModalTitle.OrderDetail}>
            <div style={{ display: 'flex', flexDirection: 'row', gap: 8, paddingTop: '10px' }}>
              <span>
                <strong>{`${OpportunityField.FullNameLabel}: `}</strong> {record?.[OrderFieldData.FirstName]}
              </span>
            </div>
            <p className="opty-card">
              <strong>{`${OpportunityField.SaunaPriceLabel}: `}</strong>
              {record?.[OrderFieldData.SaunaNum]}/
              {Number(record?.[OrderFieldData.Price])?.toLocaleString("ru-RU")}
            </p>
            <p className="opty-card"><strong>{`${OpportunityField.PhoneLabel}: `}</strong>
              <a
                className="phone-link"
                href={`tel:${record?.[OrderFieldData.Phone]}`}
                style={{ textDecoration: "none", color: "blue" }}
              >
                {formatPhoneNumber(record?.[OrderFieldData.Phone])}
              </a>
            </p>
            <p className="opty-card">
              <strong>{`${OpportunityField.TimePeopleCountLabel}: `}</strong>
              {record?.[OrderFieldData.StartTime]}-{record?.[OrderFieldData.EndTime]}/
              {record?.[OrderFieldData.PeopleCount]}
            </p>
            <div style={{ display: 'flex', flexDirection: 'row', gap: 8, paddingTop: '10px' }}>
              <span>
                <strong>{`${OpportunityField.OrderDate}: `}</strong>
                <DatePicker
                  format={FieldFormat.Date}
                  inputReadOnly={true}
                  placeholder={FieldPlaceholder.Date}
                  disabledDate={(current) => current && current.isBefore(parsedDate, 'day')}
                  value={optyPayDate ? parsedDate : undefined}
                  allowClear={false}
                  needConfirm={true}
                  onChange={(value) => {
                    if (value) {
                      const day = value.date();
                      const month = value.month() + 1; // месяцы начинаются с 0
                      const year = value.year();
                      actions.handleUpdateOpty(`${month}/${day}/${year}`, OrderFieldData.OrderDt);
                    }
                  }}
                />
              </span>
            </div>
            <p className="opty-card">
              <strong>{`${OpportunityField.CommentLabel}: `}</strong>
              {record?.[OrderFieldData.Comment]}
            </p>
            <AutoCenter style={{ marginTop: '20px' }}>
              <Button
                icon={<StopOutline fontSize={40} />}
                variant="filled"
                onClick={async () => {
                  const confirmed = await Dialog.confirm({
                    content: MODAL_TEXT.OptyCloseText,
                    confirmText: BUTTON_TEXT.Ok,
                    cancelText: BUTTON_TEXT.Cancel,
                  });

                  if (confirmed) {
                    actions.handleSubmit(orderId);
                  }
                }}
                size='large'
                style={{ height: 55, width: 55 }}
                color="primary"
              />
              <Button
                icon={<StopOutline fontSize={40} />}
                variant="filled"
                onClick={() => setIsPopupItemOpen(true) }
                size='large'
                style={{ height: 55, width: 55 }}
                color="primary"
              />
              <ButtonChangeModal
                record={record}
                type='TextArea'
                fieldName={OrderFieldData.Comment}
                updateData={actions.handleUpdateOpty}
              />
              <ButtonChangeModal
                record={record}
                type='PhoneInput'
                fieldName={OrderFieldData.EndTime}
                updateData={actions.handleUpdateOpty}
              />
            </AutoCenter>
          </Card>
          <Divider>Платежи</Divider>
        </div>
      </Spin>
      </Space>
      <Popup
        visible={isPopupItemOpen}
        showCloseButton
        onClose={() => setIsPopupItemOpen(false)}
        onMaskClick={() => setIsPopupItemOpen(false)}
      >
        <Form
          form={formItem}
          layout="vertical"
          initialValues={{
            phone: '+7',
            prepayAmount: 5000,
            saunaNum: ['SaunaFour'],
            orderDate: dayjs(dayjs().format(FieldFormat.Date), FieldFormat.Date),
            price: 5000,
          }}
          onFinish={actions.handleAddItem}
        >
          <Form.Item
            label={OrderItemField.ItemNameLabel}
            name={OrderItemField.ItemName}
            rules={[FieldRules.Required]}
          >
            <AutoComplete
              onSearch={actions.handleSearch}
              placeholder={FieldPlaceholder.MenuName}
              options={options}
              onSelect={(value: string, option: any) => {
                formItem.setFieldsValue({
                  sales: option.sales,
                  price: option.price,
                  menuId: option.menuId,
                });
              }}
              style={FieldStyle.InputStyle}
            />
          </Form.Item>
          <Form.Item
            label={OrderItemField.CountLabel}
            name={OrderItemField.Count}
            rules={[FieldRules.PaymentAmount, FieldRules.Required]}
          >
            <InputNumber style={FieldStyle.InputStyle} />
          </Form.Item>
          <Form.Item
            label={OrderItemField.SalesLabel}
            name={OrderItemField.Sales}
            rules={[FieldRules.PaymentAmount, FieldRules.Required]}
          >
            <InputNumber style={FieldStyle.InputStyle} readOnly/>
          </Form.Item>
          <Form.Item
            label={OrderItemField.PriceLabel}
            name={OrderItemField.Price}
          >
            <InputNumber style={FieldStyle.InputStyle} readOnly/>
          </Form.Item>
          <Form.Item
            label={OrderItemField.ItemDateLabel}
            name={OrderItemField.ItemDate}
            rules={[FieldRules.Required]}
          >
            <DatePicker
              style={FieldStyle.InputStyle}
              format={FieldFormat.Date}
              inputReadOnly={true}
              placeholder={FieldPlaceholder.Date}
              defaultValue={dayjs(dayjs().format(FieldFormat.Date), FieldFormat.Date)}
              disabled
            />
          </Form.Item>
          <Form.Item name={OrderItemField.MenuId} hidden={true}></Form.Item>
          <Form.Item style={{ textAlign: "center", marginBottom: 50 }}>
            <Button type="primary" htmlType="submit">
              {BUTTON_TEXT.Add}
            </Button>
            <Button onClick={() => setIsPopupItemOpen(false)} style={{ marginLeft: 8,  marginTop: 10}}>
              {BUTTON_TEXT.Cancel}
            </Button>
          </Form.Item>
        </Form>
      </Popup>
    </Popup>
  );
};