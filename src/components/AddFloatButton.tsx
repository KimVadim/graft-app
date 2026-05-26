import React from "react"
import { ConfigProvider, FloatButton } from "antd";
import { FileAddOutlined, FileDoneOutlined, PlusOutlined, WalletOutlined } from '@ant-design/icons';

interface AddFloatButtonProps {
    setIsAddOpty?: (isOpen: boolean) => void;
    setIsAddExpense?: (isOpen: boolean) => void;
    setIsAddMenu?: (isOpen: boolean) => void;
}

export const AddFloatButton: React.FC<AddFloatButtonProps> = ({setIsAddOpty, setIsAddExpense, setIsAddMenu}) => {
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
                {setIsAddMenu && <FloatButton icon={<FileAddOutlined style={{ fontSize: 24 }} />} onClick={() => setIsAddMenu(true)}/>}
            </FloatButton.Group>
        </ConfigProvider>

    );
}