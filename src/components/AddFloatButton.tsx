import React from "react"
import { FloatButton } from "antd";
import { DollarOutlined, FileDoneOutlined, PlusOutlined, UserAddOutlined, WalletOutlined } from '@ant-design/icons';

interface AddFloatButtonProps {
    setIsAddOpty?: (isOpen: boolean) => void;
    setIsAddPayment?: (isOpen: boolean) => void;
    setIsAddExpense?: (isOpen: boolean) => void;
    setIsAddContact?: (isOpen: boolean) => void;
}

export const AddFloatButton: React.FC<AddFloatButtonProps> = ({setIsAddOpty, setIsAddPayment, setIsAddExpense, setIsAddContact}) => {
    return (
        <FloatButton.Group
            trigger="click"
            type="primary"
            style={{ insetInlineEnd: 24 }}
            icon={<PlusOutlined />}
        >
            {setIsAddOpty && <FloatButton icon={<FileDoneOutlined />} onClick={() => setIsAddOpty(true)} />}
            {setIsAddPayment && <FloatButton icon={<DollarOutlined />} onClick={() => setIsAddPayment(true)}/>}
            {setIsAddExpense && <FloatButton icon={<WalletOutlined />} onClick={() => setIsAddExpense(true)}/>}
            {setIsAddContact && <FloatButton icon={<UserAddOutlined />} onClick={() => setIsAddContact(true)}/>}
        </FloatButton.Group>
    );
}