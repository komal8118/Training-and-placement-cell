// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// import { EventsProvider } from './context/EventsContext';

// const root = ReactDOM.createRoot(document.getElementById('root'));

// root.render(
//   <React.StrictMode>
//     <EventsProvider>
//       <App />
//     </EventsProvider>
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
// import React from "react";
// import ReactDOM from "react-dom/client";
// import "./index.css";
// import App from "./App";
// import reportWebVitals from "./reportWebVitals";
// import { NotificationsProvider } from "./context/NotificationsContext"; // Correct import
// import { EventsProvider } from "./context/EventsContext"; // Correct import

// const root = ReactDOM.createRoot(document.getElementById("root"));

// root.render(
//   <React.StrictMode>
//     {/* NotificationsProvider must wrap EventsProvider */}
//     <NotificationsProvider>
//       <EventsProvider>
//         <App />
//       </EventsProvider>
//     </NotificationsProvider>
//   </React.StrictMode>
// );

// reportWebVitals();




import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { NotificationsProvider } from "./context/NotificationsContext";
import { EventsProvider } from "./context/EventsContext";
import { Toaster } from "react-hot-toast"; // ✅ Import toast notifications

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <NotificationsProvider>
      <EventsProvider>
        <App />
        <Toaster position="top-right" reverseOrder={false} /> {/* ✅ Add Toast */}
      </EventsProvider>
    </NotificationsProvider>
  </React.StrictMode>
);
