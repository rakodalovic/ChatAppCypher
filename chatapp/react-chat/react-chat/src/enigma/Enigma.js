import { rotorA, rotorB, rotorC } from "./Rotors";
import { Plugboard, alphabet } from "./Plugboard";

    
    const config1 = {1: rotorA, 2: rotorB, 3:rotorC}
    const config2 = {1: rotorA, 2: rotorC, 3:rotorB}
    const config3 = {1: rotorB, 2: rotorA, 3:rotorC}
    const config4 = {1: rotorB, 2: rotorC, 3:rotorA}
    const config5 = {1: rotorC, 2: rotorA, 3:rotorB}
    const config6 = {1: rotorC, 2: rotorB, 3:rotorA}

     export function Enigma(
        message,
        configuration,
        offsetRotor1=0,
        offsetRotor2=0,
        offsetRotor3=0,
        rotatePoint1=26,
        rotatePoint2=26,
        ){
            let rotor1= configuration[1];
            let rotor2= configuration[2];
            let rotor3= configuration[3];

            let counterRotor1=offsetRotor1;
            let counterRotor2=offsetRotor2;
            let counterRotor3=offsetRotor3;

            let messageArr = message.toLowerCase().split('')//pretvaramo u mala slova
            let MessageArrNoSpace = messageArr.filter(el => el!==' ')//da nema razmaka
            let messageArrAsNumbers = MessageArrNoSpace.map(el => Plugboard[el]);
            
            let codedMessage1 = messageArrAsNumbers.map(el =>{
                let result = rotor3[(rotor2[(rotor1[(el + counterRotor1)%26] + counterRotor2)%26] + counterRotor3)%26];
                //console.log("rotor 1",rotor1[(el + counterRotor1)%26]);
                //console.log("rotor 2",rotor2[(rotor1[(el + counterRotor1)%26] + counterRotor2)%26]);
                //console.log("rotor 3",rotor3[(rotor2[(rotor1[(el + counterRotor1)%26] + counterRotor2)%26] + counterRotor3)%26]);
                counterRotor1 = (counterRotor1 + 1)%26;

                if(counterRotor1 === rotatePoint1){
                    counterRotor2=(counterRotor2+1)%26;
                }
                if(counterRotor2 === rotatePoint2){
                    counterRotor3=(counterRotor3+1)%26;
                }

                return result;
                
            });



        return codedMessage1.map(el => alphabet[el]).join('');
        }


