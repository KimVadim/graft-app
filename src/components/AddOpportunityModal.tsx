import { Button, DatePicker, Form, Input, InputNumber, Modal, Spin } from "antd";
import React, { useState } from "react"
import dayjs from 'dayjs';
import { addOpty, getSheetDataParam } from "../service/appServiceBackend.ts";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store.ts";
import { BUTTON_TEXT, Payment, PAYMENT_TYPE, Product, PRODUCT } from "../constants/dictionaries.ts";
import { AddOpportunity, FieldFormat, FieldPlaceholder, FieldRules, FieldStyle, ModalTitle, OpportunityField } from "../constants/appConstant.ts";
import { Selector, Toast } from "antd-mobile";
import TextArea from "antd/es/input/TextArea";
import { formattedPhone } from "../service/utils.ts";
import { setQuote } from "../slices/quoteSlice.ts";
import { setContact } from "../slices/contactSlice.ts";
import { setOpportunity } from "../slices/opportunitySlice.ts";
import { TimePicker } from 'antd';

const format = 'HH:mm';



export const AddOpportunityModal: React.FC<AddOpportunityModalProps> = ({setIsAddOpty, isAddOpty, setLoading, loading, view}) => {
    const [form] = Form.useForm();
    const dispatch: AppDispatch = useDispatch();
    const [phone, setPhone] = useState("+7");
    const handleSubmit = (values: AddOpportunity) => {
      setLoading(true);
      addOpty(values).then((optyId) => {
        getSheetDataParam(view === 'Storage' ? 'Storage' : 'Renter').then((response) => {
            dispatch(setOpportunity(response?.opportunities));
            dispatch(setQuote(response?.quote));
            dispatch(setContact(response?.contact));
        })
        setLoading(false);
        setIsAddOpty(false);
        optyId
          ? Toast.show({content: <div><b>Готово!</b><div>Договор № {optyId}</div></div>, icon: 'success', duration: 3000 })
          : Toast.show({content: `Ошибка!`, icon: 'fail', duration: 3000 });
      });
    };
    const actions = {
      handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedPhoneStr = formattedPhone(e.target.value);

        setPhone(formattedPhoneStr);
        form.setFieldsValue({ phone: formattedPhoneStr });
      },
      handlePayPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedPhoneStr = formattedPhone(e.target.value);

        form.setFieldsValue({ payPhone: formattedPhoneStr });
      }
    }

    return (
      <Modal
        title={ModalTitle.AddOpportunity}
        open={isAddOpty}
        onCancel={() => {
          setIsAddOpty(false);
          form.resetFields();
        }}
        style={{ maxWidth: '80%' }}
        footer={null}
      >
        <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            phone: '+7',
            depositAmount: 5000,
            saunaNum: 'SaunaFour',
            payType: Payment.GoldAN,
            [OpportunityField.PaymentDate]: dayjs(dayjs().format(FieldFormat.Date), FieldFormat.Date),
          }}
          onFinish={handleSubmit}
        >
          <Form.Item
            label={OpportunityField.LastNameLabel}
            name={OpportunityField.LastName}
          >
            <Input style={FieldStyle.InputStyle}/>
          </Form.Item>
          <Form.Item
            label={OpportunityField.FisrtNameLabel}
            name={OpportunityField.FisrtName}
            rules={[FieldRules.Required, FieldRules.ClientName]}
          >
            <Input style={FieldStyle.InputStyle} />
          </Form.Item>
          <Form.Item
            label={OpportunityField.PhoneLabel}
            name={OpportunityField.Phone}
            rules={[FieldRules.Required, FieldRules.PhoneFormat]}
          >
            <Input
              value={phone}
              placeholder="+7 (777) 123-45-67"
              onChange={actions.handlePhoneChange}
              maxLength={18}
              style={FieldStyle.InputStyle}
            />
          </Form.Item>
          {/*<Form.Item
            label={OpportunityField.PayPhoneFlgLabel}
            name={OpportunityField.PayPhoneFlg}
          >
            <Switch onChange={(value) => setHiddenItem(value)}/>
          </Form.Item>*/}
          <Form.Item
            label={OpportunityField.PayTypeLabel}
            name={OpportunityField.PayType}
            rules={[FieldRules.Required]}
          >
            <Selector
              options={PAYMENT_TYPE}
              onChange={(arr) =>
                form.setFieldsValue({
                  [OpportunityField.PayType]: arr
                })
              }
            />
          </Form.Item>
          <Form.Item
            label={OpportunityField.DepositAmountLabel}
            name={OpportunityField.DepositAmount}
            rules={[FieldRules.PaymentAmount, FieldRules.Required]}
          >
            <InputNumber style={FieldStyle.InputStyle} />
          </Form.Item>
          <Form.Item
            label={OpportunityField.SaunaNumLabel}
            name={OpportunityField.SaunaNum}
            rules={[FieldRules.Required]}
          >
            <Selector
              options={PRODUCT}
              value={form.getFieldValue(OpportunityField.SaunaNum)}
              onChange={(arr) =>
                form.setFieldsValue({
                  [OpportunityField.SaunaNum]: arr
                })
              }
            />
            <TimePicker defaultValue={dayjs('12:08', format)} format={format} />
          </Form.Item>
          <Form.Item
            label={view==='Storage' ? OpportunityField.CommentStorageLabel : OpportunityField.CommentLabel}
            name={OpportunityField.Comment}
            rules={[FieldRules.Required]}
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
            label={OpportunityField.PaymentDateLabel}
            name={OpportunityField.PaymentDate}
            rules={[FieldRules.Required]}
            hidden={view && view==='Storage' ? true : false}
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
            <Button onClick={() => setIsAddOpty(false)} style={{ marginLeft: 8,  marginTop: 10}}>
              {BUTTON_TEXT.Cancel}
            </Button>
          </Form.Item>
        </Form>
        </Spin>
      </Modal>
    )
}