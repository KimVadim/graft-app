import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
// @ts-ignore
import './index.css';
import App from './App';
import { App as AntdApp } from 'antd';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AntdApp>
        <App />
      </AntdApp>
    </Provider>
  </React.StrictMode>
);
