import { Button, DatePicker, Form, Input, InputNumber, Spin } from "antd";
import React from "react"
import { useDispatch } from "react-redux";
import { addExpense, getExpenseData } from "../../service/appServiceBackend";
import TextArea from "antd/es/input/TextArea";
import { APP_NAME, BUTTON_TEXT, EXPENSE_TYPE, PAYMENT_TYPE } from "../../constants/dictionaries.js";
import { FieldFormat, FieldPlaceholder, FieldRules, FieldStyle } from "../../constants/appConstant.js";
import { Popup, Selector, Toast } from "antd-mobile";
import { AddExpense, ExpenseFieldData, ExpenseFieldLabel } from "./ExpensesMeta";
import { setExpense } from "../../slices/expenseSlice";
import { AppDispatch } from "../../store";
import dayjs from "dayjs";

interface AddExpenseModalProps {
  setIsAddExpense: (isOpen: boolean) => void;
  isAddExpense: boolean;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({setIsAddExpense, isAddExpense}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState<boolean>(false);
    const dispatch: AppDispatch = useDispatch();
    const handleSubmit = (values: AddExpense) => {
      setLoading(true);
      addExpense(values)
        .then((expenseId) => {
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear();
          const currentMonth = currentDate.getMonth() + 1;

          getExpenseData(currentYear, currentMonth).then((response) => {
              dispatch(setExpense(response?.expense));
          });

          setLoading(false);
          setIsAddExpense(false);
          form.resetFields();
          expenseId
            ? Toast.show({content: <div><b>Готово!</b><div>Расход № {expenseId}</div></div>, icon: 'success', duration: 3000 })
            : Toast.show({content: `Ошибка!`, icon: 'fail', duration: 3000 });
        });
    };

    return (
      <>
        <Popup
          visible={isAddExpense}
          showCloseButton
          onClose={() => {
            setIsAddExpense(false);
            form.resetFields();
          }}
          onMaskClick={() => {
            setIsAddExpense(false);
            form.resetFields();
          }}
        >
        <Spin spinning={loading}>
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
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
            >
              <Form.Item
                label={ExpenseFieldLabel.AppNameLabel}
                name={ExpenseFieldData.AppName}
                rules={[FieldRules.Required]}
              >
                <Selector
                  options={APP_NAME}
                  onChange={(arr) => {
                  arr.length > 0 && form.setFieldsValue({[ExpenseFieldData.AppName]: arr[0]});
                  }}
                />
              </Form.Item>
              <Form.Item
                label={ExpenseFieldLabel.ExpenseTypeLabel}
                name={ExpenseFieldData.Type}
                rules={[FieldRules.Required]}
              >
                <Selector
                  options={EXPENSE_TYPE}
                  onChange={(arr) => {
                  arr.length > 0 && form.setFieldsValue({[ExpenseFieldData.Type]: arr[0]});
                  }}
                />
              </Form.Item>
              <Form.Item
                label={ExpenseFieldLabel.ExpenseNameLabel}
              name={ExpenseFieldData.ExpenseName}
                rules={[FieldRules.Required]}
              >
                <Input style={FieldStyle.InputStyle} />
              </Form.Item>
              <Form.Item
                label={ExpenseFieldLabel.SourceLabel}
                name={ExpenseFieldData.Source}
                rules={[FieldRules.Required]}
              >
                <Selector
                  options={PAYMENT_TYPE}
                  onChange={(arr) => {
                    arr.length > 0 && form.setFieldsValue({[ExpenseFieldData.Source]: arr[0]});
                  }}
                />
              </Form.Item>
              <Form.Item
                label={ExpenseFieldLabel.AmountLabel}
                name={ExpenseFieldData.Amount}
                rules={[FieldRules.Required,FieldRules.ExpenseAmount]}
              >
                <InputNumber style={FieldStyle.InputStyle} />
              </Form.Item>
              <Form.Item
                label={ExpenseFieldLabel.ExpenseDateLabel}
                name={ExpenseFieldData.ExpenseDate}
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
              <Form.Item
                label={ExpenseFieldLabel.CommentLabel}
                name={ExpenseFieldData.Comment}
              >
                <TextArea
                  showCount
                  maxLength={1000}
                  placeholder={FieldPlaceholder.Comment}
                  autoSize={{ minRows: 2, maxRows: 4 }}
                  style={FieldStyle.AreaStyle}
                />
              </Form.Item>
              <Form.Item style={{ textAlign: "center" }}>
                <Button type="primary" htmlType="submit">
                  {BUTTON_TEXT.Add}
                </Button>
                <Button onClick={() => setIsAddExpense(false)} style={{ marginLeft: 8,  marginTop: 10}}>
                  {BUTTON_TEXT.Cancel}
                </Button>
              </Form.Item>
            </Form>
          </div>
          </Spin>
        </Popup>
      </>
    )
}
