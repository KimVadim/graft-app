import { Button, Form, Input, InputNumber, Spin } from "antd";
import React, { useEffect } from "react"
import { useDispatch } from "react-redux";
import { addMenu, getMenuData } from "../../service/appServiceBackend";
import TextArea from "antd/es/input/TextArea";
import { BUTTON_TEXT, MENU_TYPE } from "../../constants/dictionaries.js";
import { FieldPlaceholder, FieldRules, FieldStyle } from "../../constants/appConstant.js";
import { Popup, Selector, Toast } from "antd-mobile";
import { AddMenu, MenuFieldData, MenuFieldLabel} from "./MenuMeta";
import { AppDispatch } from "../../store";
import { setMenu } from "../../slices/menuSlice";

interface AddMenuModalProps {
  setIsAddMenu: (isOpen: boolean) => void;
  isAddMenu: boolean;
}

export const AddMenuModal: React.FC<AddMenuModalProps> = ({setIsAddMenu, isAddMenu}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState<boolean>(false);
    const dispatch: AppDispatch = useDispatch();

    // Подписываемся на изменение нужных полей формы для расчетов
    const price = Form.useWatch(MenuFieldData.Price, form);
    const sales = Form.useWatch(MenuFieldData.Sales, form);
    const count = Form.useWatch(MenuFieldData.Count, form);

    useEffect(() => {
      const updates: Record<string, any> = {};

      // 1. Считаем Сумму продаж: Sales * Count
      if (typeof sales === 'number' && typeof count === 'number') {
        updates[MenuFieldData.SalesAmount] = Number((sales * count).toFixed(2));
      } else {
        updates[MenuFieldData.SalesAmount] = undefined;
      }

      if (typeof sales === 'number' && typeof price === 'number' && price > 0) {
        const profitPercent = ((sales - price) / price) * 100;
        updates[MenuFieldData.Percent] = Number(profitPercent.toFixed(2));
      } else {
        updates[MenuFieldData.Percent] = undefined;
      }

      if (typeof price === 'number' && typeof count === 'number') {
        updates[MenuFieldData.Amount] = Number((price * count).toFixed(2));
      } else {
        updates[MenuFieldData.Amount] = undefined;
      }

      form.setFieldsValue(updates);
    }, [price, sales, count, form]);

    const handleSubmit = (values: AddMenu) => {
      console.log('Form values:', values);
      setLoading(true);
      addMenu(values)
        .then((menuId) => {
          return getMenuData().then((response) => {
              dispatch(setMenu(response?.menu));
              return menuId;
          });
        })
        .then((menuId) => {
          setIsAddMenu(false);
          form.resetFields();

          if (menuId) {
            Toast.show({
              content: <div><b>Готово!</b><div>Блюдо/Меню № {menuId}</div></div>,
              icon: 'success',
              duration: 3000
            });
          } else {
            Toast.show({ content: `Ошибка!`, icon: 'fail', duration: 3000 });
          }
        })
        .catch((error) => {
          console.error(error);
          Toast.show({ content: `Произошла ошибка при сохранении`, icon: 'fail', duration: 3000 });
        })
        .finally(() => {
          setLoading(false);
        });
    };

    const handleClose = () => {
      if (loading) return;
      setIsAddMenu(false);
      form.resetFields();
    };

    return (
      <Popup
        visible={isAddMenu}
        showCloseButton={!loading}
        onClose={handleClose}
        onMaskClick={handleClose}
      >
        <Spin spinning={loading} tip="Сохранение...">
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
              disabled={loading}
            >
              <Form.Item
                label={MenuFieldLabel.MenuTypeLabel}
                name={MenuFieldData.TypeName} // Здесь хранится value (например, "hot_dishes")
                rules={[FieldRules.Required]}
              >
                <Selector
                  options={MENU_TYPE}
                  onChange={(arr) => {
                    if (arr.length > 0) {
                      const selectedValue = arr[0];

                      // Ищем объект в вашем словаре MENU_TYPE, чтобы достать текст (label)
                      const selectedOption = MENU_TYPE.find(item => item.value === selectedValue);

                      // Сохраняем отображаемое имя (label) в другое поле формы
                      form.setFieldsValue({
                        [MenuFieldData.MenuType]: selectedOption ? selectedOption.label : ''
                      });
                    } else {
                      // Если выбор сбросили, очищаем текстовое поле
                      form.setFieldsValue({ [MenuFieldData.MenuType]: undefined });
                    }
                  }}
                />
              </Form.Item>

              {/* Скрытое поле внутри формы, чтобы TypeName отправлялся вместе с остальными values в onFinish */}
              <Form.Item name={MenuFieldData.MenuType} noStyle>
                <input type="hidden" />
              </Form.Item>
              <Form.Item
                label={MenuFieldLabel.MenuNameLabel}
                name={MenuFieldData.MenuName}
                rules={[FieldRules.Required]}
              >
                <Input style={FieldStyle.InputStyle} />
              </Form.Item>
              <Form.Item
                label={MenuFieldLabel.PriceLabel}
                name={MenuFieldData.Price}
                rules={[FieldRules.Required, FieldRules.ExpenseAmount]}
              >
                <InputNumber style={FieldStyle.InputStyle} min={0} />
              </Form.Item>
              <Form.Item
                label={MenuFieldLabel.SalesLabel}
                name={MenuFieldData.Sales}
                rules={[FieldRules.Required, FieldRules.ExpenseAmount]}
              >
                <InputNumber style={FieldStyle.InputStyle} min={0} />
              </Form.Item>
              <Form.Item
                label={MenuFieldLabel.CountLabel}
                name={MenuFieldData.Count}
                rules={[FieldRules.Required, FieldRules.ExpenseAmount]}
              >
                <InputNumber style={FieldStyle.InputStyle} min={0} precision={0} />
              </Form.Item>
              <Form.Item
                label={MenuFieldLabel.PercentLabel}
                name={MenuFieldData.Percent}
              >
                <InputNumber style={FieldStyle.InputStyle} readOnly disabled formatter={value => `${value}%`} />
              </Form.Item>
              <Form.Item
                label={MenuFieldLabel.AmountLabel}
                name={MenuFieldData.Amount}
              >
                <InputNumber style={FieldStyle.InputStyle} readOnly disabled />
              </Form.Item>
              <Form.Item
                label={MenuFieldLabel.SalesAmountLabel}
                name={MenuFieldData.SalesAmount}
              >
                <InputNumber style={FieldStyle.InputStyle} readOnly disabled />
              </Form.Item>
              <Form.Item
                label={MenuFieldLabel.CommentLabel}
                name={MenuFieldData.Comment}
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
                <Button type="primary" htmlType="submit" loading={loading}>
                  {BUTTON_TEXT.Add}
                </Button>
                <Button onClick={handleClose} disabled={loading} style={{ marginLeft: 8,  marginTop: 10}}>
                  {BUTTON_TEXT.Cancel}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Spin>
      </Popup>
    )
}