import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// ✅ Only one BrowserRouter import
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


import { Provider } from "react-redux";
import { store } from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter> {/* ✅ Only one Router wrapper */}
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
