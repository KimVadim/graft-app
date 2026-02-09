import { Menu, MenuProps } from "antd";
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { SettingOutlined } from '@ant-design/icons';

type MenuItem = Required<MenuProps>['items'][number];

export const MenuComp: React.FC = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState('mail');

  const menuItems: MenuItem[] = [
    {
      label: 'Меню',
      key: 'SubMenu',
      icon: <SettingOutlined />,
      children: [
        {
          type: 'group',
          label: 'Основные',
          children: [
            { label: 'Договора', key: '/opportunities' },
            { label: 'Платежи', key: '/payments' },
            { label: 'Контакты', key: '/contacts' },
            { label: 'Расходы', key: '/expenses' },
          ],
        },
        {
          type: 'group',
          label: 'Отчеты',
          children: [
            { label: 'Отчеты CN', key: '/incomereportcn' },
          ],
        },
      ],
    },
  ];

  const onClickMenu: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
    if (e.key) {
      navigate(e.key)
    }
  };

  return (
    <Menu
      onClick={onClickMenu}
      selectedKeys={[current]}
      mode="horizontal"
      items={menuItems}
    />
  );
}
