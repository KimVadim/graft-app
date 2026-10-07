import React, { useState } from 'react';
import { Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Space } from 'antd-mobile';
import { supabase } from '../lib/supabase';
import { setUser } from '../slices/userSlice';
import { AppDispatch } from '../store';
import { FieldPlaceholder } from '../constants/appConstant';

const EMAIL_DOMAIN = '@pa.kz';

type FieldType = {
  username?: string;
  password?: string;
};

const toEmail = (login: string) => {
  const clean = login.trim().toLowerCase();
  return clean.endsWith(EMAIL_DOMAIN) ? clean : `${clean}${EMAIL_DOMAIN}`;
};

const Login: React.FC = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const handleSubmit = async (values: FieldType) => {
    setError('');
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: toEmail(values.username ?? ''),
      password: values.password ?? '',
    });

    setLoading(false);

    if (error || !data.user) {
      setError('Неверный логин или пароль');
      return;
    }

    const login = (values.username ?? '').trim().toLowerCase();
    localStorage.setItem('login', login);
    dispatch(setUser(login));
    navigate('/order');
  };

  return (
    <Space justify='center' block>
      <Form
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 16 }}
        style={{ paddingTop: '75%' }}
        onFinish={handleSubmit}
      >
        <Form.Item<FieldType>
          label='Пользователь'
          name='username'
          rules={[{ required: true, message: FieldPlaceholder.EnterUsername }]}
        >
          <Input autoCapitalize='none' autoCorrect='off' />
        </Form.Item>

        <Form.Item<FieldType>
          label='Пароль'
          name='password'
          rules={[{ required: true, message: FieldPlaceholder.EnterPassword }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label={null}>
          <Button type='primary' htmlType='submit' loading={loading}>
            Войти
          </Button>
        </Form.Item>

        {error && <p>{error}</p>}
      </Form>
    </Space>
  );
};

export default Login;