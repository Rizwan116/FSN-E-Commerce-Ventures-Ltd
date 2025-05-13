import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// ✅ Only one BrowserRouter import
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


import { Provider } from "react-redux";
import { store } from "./redux/store";

import { GoogleOAuthProvider } from '@react-oauth/google';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter> {/* ✅ Only one Router wrapper */}
      <Provider store={store}>
        <GoogleOAuthProvider clientId="1096684727945-n3vqh5t3j8hg3dppt4bdjlph6jaq3v8f.apps.googleusercontent.com">
          <App />
        </GoogleOAuthProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
