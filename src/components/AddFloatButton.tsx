import React from "react"
import { ConfigProvider, FloatButton } from "antd";
import { FileDoneOutlined, PlusOutlined, WalletOutlined } from '@ant-design/icons';

interface AddFloatButtonProps {
    setIsAddOpty?: (isOpen: boolean) => void;
    setIsAddExpense?: (isOpen: boolean) => void;
}

export const AddFloatButton: React.FC<AddFloatButtonProps> = ({setIsAddOpty, setIsAddExpense}) => {
    return (
        <ConfigProvider
        theme={{
            token: {
            controlHeightLG: 55,
            },
        }}
        >
            <FloatButton.Group
                trigger="click"
                type="primary"
                style={{ insetInlineEnd: 24 }}
                icon={<PlusOutlined style={{ fontSize: 24 }} />}
            >
                {setIsAddOpty && <FloatButton icon={<FileDoneOutlined style={{ fontSize: 24 }} />} onClick={() => setIsAddOpty(true)} />}
                {setIsAddExpense && <FloatButton icon={<WalletOutlined style={{ fontSize: 24 }} />} onClick={() => setIsAddExpense(true)}/>}
            </FloatButton.Group>
        </ConfigProvider>

    );
}