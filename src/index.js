import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // ✅ Import BrowserRouter
import { Provider } from "react-redux";
import { store } from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>  {/* ✅ Wrap your app inside this */}
    <Provider store={store}>

      <App />

      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
