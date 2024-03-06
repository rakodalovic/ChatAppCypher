import React, { useEffect, useState } from 'react';
//import axios from 'axios';
import "./Chat.css"
import Message from './Message';
import { rotorA, rotorB, rotorC } from '../enigma/Rotors.js';
import { Enigma } from '../enigma/Enigma.js';
//import { Reflector } from '../enigma/Reflector.js';
import { connection } from '../index.js';
import {encryptStringXXTEA, decryptStringXXTEA} from "../xxtea/XXTEA.js"
import {convertBase64} from "../fileConversion/ConvertFile.js"


const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sender, setSender] = useState('');
  const [encode,setEncode] = useState(true);
  const config1 = {1: rotorA, 2: rotorB, 3:rotorC}
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('Enigma');
  const [chatLabel, setChatLabel] = useState('Enigma Chat');
  const [selectedFile, setSelectedFile] = useState(null);
  //console.log(poruka);
  useEffect(() => {
      connection.on('RecieveOldMessages', (params) => {
        setMessages(params);
      })

      connection.on('RecieveMessage', (params) => {
        setMessages(m => [...m, params]);
      })
  },[])
  
  const handleSendMessage = async(e) => {
    
    e.preventDefault();
    
    var encTextEnigma = Enigma(text,config1,0,0,5,26,26);
    //console.log(encText);
    var encrypt_data_xxtea = encryptStringXXTEA(text, 1234567890);
    const message = {text: selectedAlgorithm === 'Enigma' ? encTextEnigma : encrypt_data_xxtea,sender};
    //console.log(text);
    connection.invoke('SendMessage', message)
    setText('');
    //axios.post('http://localhost:5110/api/Message', message)
    if(selectedFile){
      handleFileUpload();
    };
  };
  const handleChangeAlgoritham = (e) => {
    setSelectedAlgorithm((prevAlgorithm) =>
    prevAlgorithm === 'Enigma' ? 'XXTEA' : 'Enigma')

    setChatLabel((prevLabel) =>
    prevLabel === 'Enigma Chat' ? 'XXTEA Chat' : 'Enigma Chat'
  );
    //console.log(selectedAlgorithm)
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };
  
  const handleFileUpload = () =>{
    
    const byteFile = convertBase64(selectedFile);
    console.log(byteFile);
    //console.log(selectedFile);
    //const mes = {text: byteFile}
    //connection.invoke('SendMessage', mes);
  }

  return (
    <div className="chat-container">
      <div><h1>{chatLabel}</h1></div>
      <div className = "cipherButtonContainer"><button className='cipherButton' onClick={handleChangeAlgoritham}>Promeni algoritam</button> </div>
      <div className="main-message-container">
        {messages.map((message) => (
          <Message key={message.id} text={message.text} sender={message.sender} dateTime={message.sendTime} encode={encode} selectedAlgorithm={selectedAlgorithm}/>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Unesite poruku..."
          className="input-text"
        />
        <input
          type="text"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          placeholder="Username..."
          className="input-sender"
        />
        <button onClick={handleSendMessage}>{selectedFile ? 'Pošalji fajl' : 'Pošalji'}</button>
        <button onClick={(e) => setEncode(!encode)}>Sakrij</button>
      </div>

      <div className="file-input-wrapper">
      <input
        type="file"
        className="file-input"
        onChange={handleFileChange}
      />
      <div className="file-name-display">
        {selectedFile ? selectedFile.name : 'Izaberite fajl'}
      </div>
    </div>
    </div>
  );
};

export default Chat;
