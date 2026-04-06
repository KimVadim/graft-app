import React from "react"
import { FloatButton } from "antd";
import { FileDoneOutlined, PlusOutlined, WalletOutlined } from '@ant-design/icons';

interface AddFloatButtonProps {
    setIsAddOpty?: (isOpen: boolean) => void;
    setIsAddExpense?: (isOpen: boolean) => void;
}

export const AddFloatButton: React.FC<AddFloatButtonProps> = ({setIsAddOpty, setIsAddExpense}) => {
    return (
        <FloatButton.Group
            trigger="click"
            type="primary"
            style={{ insetInlineEnd: 24 }}
            icon={<PlusOutlined />}
        >
            {setIsAddOpty && <FloatButton icon={<FileDoneOutlined />} onClick={() => setIsAddOpty(true)} />}
            {setIsAddExpense && <FloatButton icon={<WalletOutlined />} onClick={() => setIsAddExpense(true)}/>}
        </FloatButton.Group>
    );
}