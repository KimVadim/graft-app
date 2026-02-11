import React from 'react';
import { Button, DatePicker, Spin } from 'antd';
import { FieldFormat, FieldPlaceholder, ModalTitle, OpportunityField, OpportunityFieldData } from '../constants/appConstant.ts';
import { formatPhoneNumber } from '../service/utils.ts';
import { closeOpty, updateOpty } from '../service/appServiceBackend.ts';
import { Dialog, Popup, Divider, Space, Card, Toast, AutoCenter } from 'antd-mobile'
import { BUTTON_TEXT, MODAL_TEXT } from '../constants/dictionaries.ts';
import dayjs from 'dayjs';
import { StopOutline } from 'antd-mobile-icons';
import { ButtonChangeModal } from './ButtonChangeModal.tsx';

interface OpportunityModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  record: any;
}

export const OpportunityModal: React.FC<OpportunityModalProps> = ({ isModalOpen, setIsModalOpen, record }) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const optyPayDate = new Date(record?.[OpportunityField.OrderDate]);
  const orderId = record?.[OpportunityFieldData.Id]


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
                <strong>{`${OpportunityField.FullNameLabel}: `}</strong> {record?.[OpportunityFieldData.FirstName]}
              </span>
            </div>
            <p className="opty-card">
              <strong>{`${OpportunityField.SaunaPriceLabel}: `}</strong>
              {record?.[OpportunityFieldData.SaunaNum]}/
              {Number(record?.[OpportunityFieldData.Price])?.toLocaleString("ru-RU")}
            </p>
            <p className="opty-card"><strong>{`${OpportunityField.PhoneLabel}: `}</strong>
              <a
                className="phone-link"
                href={`tel:${record?.[OpportunityFieldData.Phone]}`}
                style={{ textDecoration: "none", color: "blue" }}
              >
                {formatPhoneNumber(record?.[OpportunityFieldData.Phone])}
              </a>
            </p>
            <p className="opty-card">
              <strong>{`${OpportunityField.TimePeopleCountLabel}: `}</strong>
              {record?.[OpportunityFieldData.StartTime]}-{record?.[OpportunityFieldData.EndTime]}/
              {record?.[OpportunityFieldData.PeopleCount]}
            </p>
            <div style={{ display: 'flex', flexDirection: 'row', gap: 8, paddingTop: '10px' }}>
              <span>
                <strong>{`${OpportunityField.PayDateLabel}: `}</strong>
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
                      actions.handleUpdateOpty(`${month}/${day}/${year}`, OpportunityFieldData.PaymentDate);
                    }
                  }}
                />
              </span>
            </div>
            <p className="opty-card">
              <strong>{`${OpportunityField.CommentLabel}: `}</strong>
              {record?.[OpportunityFieldData.Comment]}
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
              <ButtonChangeModal
                record={record}
                type='TextArea'
                fieldName={OpportunityFieldData.Comment}
                updateData={actions.handleUpdateOpty}
              />
              <ButtonChangeModal
                record={record}
                type='PhoneInput'
                fieldName={OpportunityFieldData.EndTime}
                updateData={actions.handleUpdateOpty}
              />
            </AutoCenter>
          </Card>
          <Divider>Платежи</Divider>
        </div>
      </Spin>
      </Space>
    </Popup>
  );
};