import { AutoComplete, Button, DatePicker, Form, InputNumber, Modal, Spin } from "antd";
import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store.ts";
import { addPayment, getSheetDataParam } from "../service/appServiceBackend.ts";
import { BUTTON_TEXT, PAYMENT_TYPE, Product } from "../constants/dictionaries.ts";
import {
  AddPayment,
  FieldFormat,
  FieldPlaceholder,
  FieldRules,
  FieldStyle,
  ModalTitle,
  OpportunityFieldData,
  OrderType,
  PaymentField,
  Stage } from "../constants/appConstant.ts";
import dayjs from "dayjs";
import { Selector, Toast } from "antd-mobile";
import { setOrder } from "../slices/orderSlice.ts";

interface AddPaymentModalProps {
  setIsAddPayment: (isOpen: boolean) => void;
  isAddPayment: boolean;
  setLoading: (isOpen: boolean) => void;
  loading: boolean;
  view: string
}

export const AddPaymentModal: React.FC<AddPaymentModalProps> = ({
    setIsAddPayment,
    isAddPayment,
    setLoading,
    loading,
    view
  }) => {
    const [form] = Form.useForm();
    const dispatch: AppDispatch = useDispatch();
    const [options, setOptions] = useState<{ apartNum: String; optyId: string; value: string; label: string }[]>([]);
    const optyData = useSelector((state: RootState) => state.order.order) as unknown as OrderType[];

    const actions = {
      handleSearch: (value: string) => {
        if (!optyData) return;
        const selectedProduct = form.getFieldValue(PaymentField.Product);
        const filteredOptions = optyData
          .filter(item => {
            if ([Product.SaunaFour].includes(selectedProduct)) {
              return true;
            }
            // иначе — только Signed
            return item[OpportunityFieldData.Stage] === Stage.Signed;
          })
          .filter(item =>
            item[OpportunityFieldData.FullName].toLowerCase().includes(value.toLowerCase()) ||
            item[OpportunityFieldData.ApartNum].toLowerCase().includes(value.toLowerCase())
          )
          .slice(0, 7)
          .map(item => ({
            optyId: item[OpportunityFieldData.Id],
            apartNum: item[OpportunityFieldData.ApartNum],
            conId: item[OpportunityFieldData.Contact],
            value: `${item[OpportunityFieldData.ApartNum]} - ${item[OpportunityFieldData.FullName]}`,
            label: `${item[OpportunityFieldData.ApartNum]} - ${item[OpportunityFieldData.FullName]}`
          }));

        setOptions(filteredOptions);
      },
      handleSubmit: (values: AddPayment) => {
        setLoading(true)
        addPayment(values).then((paymentId) => {
          paymentId && getSheetDataParam(view==='Storage' ? 'Storage' : 'Renter').then((response) => {
              dispatch(setOrder(response?.opportunities));
          })
          setLoading(false);
          setIsAddPayment(false);
          form.resetFields();
          paymentId
            ? Toast.show({content: <div><b>Готово!</b><div>Платеж № {paymentId}</div></div>, icon: 'success', duration: 3000 })
            : Toast.show({content: `Ошибка!`, icon: 'fail', duration: 3000 });
        });
      },
    }
    return (
      <Modal
        title={ModalTitle.AddPayment}
        open={isAddPayment}
        onCancel={() => {
          setIsAddPayment(false);
          form.resetFields();
        }}
        style={{ maxWidth: '80%' }}
        footer={null}
      >
        <Spin spinning={loading}>
          <Form
            form={form}
            onFinish={actions.handleSubmit}
            onFinishFailed={(e) => {
              const fieldName = e?.['errorFields']?.[0]?.['name']?.[0];
              fieldName === 'optyId' && Toast.show({content: `Неверный договор!`, icon: 'fail', duration: 2000 });
            }}
            layout="vertical"
            initialValues={{
              //[PaymentField.Product]: view === 'Storage' ? Product.StorageS : Product.Rent180,
              [PaymentField.PaymentDate]: dayjs(dayjs().format(FieldFormat.Date), FieldFormat.Date),
            }}
          >
            <Form.Item
              label={PaymentField.AmountLabel}
              name={PaymentField.Amount}
              rules={[FieldRules.Required, FieldRules.PaymentAmount]}
            >
              <InputNumber style={FieldStyle.InputStyle} />
            </Form.Item>
            <Form.Item
              label={PaymentField.OptyNameLabel}
              name={PaymentField.OptyName}
              rules={[FieldRules.Required]}
            >
              <AutoComplete
                onSearch={actions.handleSearch}
                placeholder={FieldPlaceholder.OptyName}
                options={options}
                onSelect={(value: string, option: any) => {
                  form.setFieldsValue({
                    optyId: option.optyId,
                    conId: option.conId,
                    apartNum: option.apartNum,
                  });
                }}
                style={FieldStyle.InputStyle}
              />
            </Form.Item>
            <Form.Item
              label={PaymentField.PaymnetTypeLabel}
              name={PaymentField.PaymentType}
              rules={[FieldRules.Required]}
            >
              <Selector
                options={PAYMENT_TYPE}
                onChange={(arr) => {
                  arr.length > 0 && form.setFieldsValue({[PaymentField.PaymentType]: arr[0]});
                }}
              />
            </Form.Item>
            <Form.Item
              label={PaymentField.PaymentDateLabel}
              name={PaymentField.PaymentDate}
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
              <Button onClick={() => setIsAddPayment(false)} style={{ marginLeft: 8,  marginTop: 10}}>
                {BUTTON_TEXT.Cancel}
              </Button>
            </Form.Item>
            <Form.Item name={PaymentField.OptyId} hidden={true} rules={[FieldRules.Required]}></Form.Item>
            <Form.Item name={PaymentField.ApartNum} hidden={true} ></Form.Item>
            <Form.Item name={PaymentField.ContactId} hidden={true}></Form.Item>
          </Form>
        </Spin>
      </Modal>
    )
}