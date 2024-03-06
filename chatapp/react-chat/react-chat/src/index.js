import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {HubConnectionBuilder, HttpTransportType} from '@microsoft/signalr'


export const connection = new HubConnectionBuilder()
    .withUrl("http://localhost:5110/chathub", {
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets
    })
    .build();

async function start() {
    try {
        await connection.start();
        console.log("SignalR Connected.");
        
// connection.invoke('SendMessage', {
//   text: "Ejeje",
//   sender: connection.connectionId
// })
     } catch (err) {
         console.log(err);
         setTimeout(start, 5000);
        }
};

connection.onclose(async () => {
    await start();
});

connection.on('RecieveMessage', (params) => {
  console.log("--------------")
  console.log(params)
  console.log("--------------")
})

start();


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <App />
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
