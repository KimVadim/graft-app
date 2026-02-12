import { Col } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store.ts";
import { ProgressBar } from "antd-mobile";
import { OrderFieldData, OrderItemFieldData, OrderItemType, OrderType } from "../constants/appConstant.ts";
import { PaymentProgreesModal } from "./PaymentProgressModal.tsx";

interface PaymentProgreesBarProps {
  setIsPaymentModal: (isOpen: boolean) => void;
  isPaymentModal: boolean;
}

export const PaymentProgreesBar: React.FC<PaymentProgreesBarProps> = ({
    setIsPaymentModal,
    isPaymentModal,
}) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const optyData = useSelector((state: RootState) => state.order.order) as unknown as OrderType[];
    const quotesData = useSelector((state: RootState) => state.orderItem.orderItem) as unknown as OrderItemType[];
    const currentMonthPayments = quotesData?.filter(item => {
        const payDate = new Date(item[OrderItemFieldData.ItemDt]);
        return payDate.getMonth() === currentMonth && payDate.getFullYear() === currentYear && ['Prod_1', 'Rent180', 'Rent185'].includes(item['menu_id']);
    }) || [];
    const currentMonthPaymentsCount = currentMonthPayments.length;
    const optyActiveCount = optyData.filter(x => x[OrderFieldData.Status] === 'Заключили').length;
    const optyAllCount = optyData.length;

    return (
        <Col flex="auto">
            {currentMonthPaymentsCount > 0 && <div onClick={() => setIsPaymentModal(true)} style={{ cursor: 'pointer' }}>
            <ProgressBar
                percent={(currentMonthPaymentsCount/optyActiveCount)*100}
                text={`${Math.floor(((currentMonthPaymentsCount/optyActiveCount)*100) * 10) / 10}% плат. ${currentMonthPaymentsCount}/${optyActiveCount}`}
                style={{
                '--text-width': '120px',
                '--fill-color': 'linear-gradient(to right, var(--adm-color-warning), var(--adm-color-success))',
                }}
            />
            </div>}
            <PaymentProgreesModal
                setIsPaymentModal={setIsPaymentModal}
                isPaymentModal={isPaymentModal}
                payments={currentMonthPayments}
                paymentsCount={currentMonthPaymentsCount}
                optyActiveCount={optyActiveCount}
                optyAllCount={optyAllCount}
            />
        </Col>
    );
}