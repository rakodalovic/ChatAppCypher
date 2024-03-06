import React from 'react';
import { format } from 'date-fns';
import './Message.css';
import Reflector from '../enigma/Reflector';
import { rotorA, rotorB, rotorC } from "../enigma/Rotors";
import {encryptStringXXTEA, decryptStringXXTEA} from "../xxtea/XXTEA.js"

const config1 = {1: rotorC, 2: rotorB, 3:rotorA}
const Message = ({ text, sender, dateTime, encode, selectedAlgorithm }) => {
  const formattedDateTime = format(new Date(dateTime), 'HH:mm');
  var decTextEnigma = Reflector(text,config1,-5,0,0,26,26);
  var decript_data_xxtea = decryptStringXXTEA(text, 1234567890);
  return (
    <div className="message-container">
      <div className="message-sender">{`${sender}: `}</div>
      {encode ?
      (<div className="message-text">{selectedAlgorithm === 'Enigma' ? decTextEnigma : decript_data_xxtea}</div>) :
      (<div className="message-text">{text}</div>)
      }
      <div className="message-datetime">{formattedDateTime}</div>
    </div>
  );
};

export default Message;
