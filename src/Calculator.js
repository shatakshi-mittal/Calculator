import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CalculatorScreen = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    loadPreviousCalculations();
  }, []);

  const loadPreviousCalculations = async () => {
    try {
      const storedCalculations = await AsyncStorage.getItem('calculations');
      if (storedCalculations !== null) {
        // stored calculations and display them
        setExpression(storedCalculations);
      }
    } catch (error) {
      console.error('Error loading calculations:', error);
    }
  };

  //save last calculation using async storage
  const saveCalculation = async calculation => {
    try {
      const storedCalculations = await AsyncStorage.getItem('calculations');
      let calculations = storedCalculations
        ? JSON.parse(storedCalculations)
        : [];
      calculations.push(calculation);
      await AsyncStorage.setItem('calculations', JSON.stringify(calculations));
    } catch (error) {
      console.error('Error saving calculation:', error);
    }
  };

  const handleButtonPress = text => {
    if (text === '=') {
      try {
        const evalResult = eval(expression);
        setResult(evalResult.toString());
        saveCalculation(expression + '=' + evalResult);
        setExpression('');
      } catch (error) {
        setResult('Error');
      }
    } else if (text === 'C') {
      setExpression('');
      setResult('');
    } else {
      setExpression(prevExpression => prevExpression + text);
    }
  };

  const renderButton = text => {
    let buttonStyle = styles.button; 
    let buttonTextStyle = styles.buttonText; 

    // Check if the button text is one of the specific buttons to be colored
    if (['/', '-', '+', '*', '=', 'C'].includes(text)) {
      buttonStyle = {...styles.button, backgroundColor: '#FF9A03'};
      buttonTextStyle = {...styles.buttonText, color: '#FFF'};
    }

    return (
      <TouchableOpacity
        style={buttonStyle}
        onPress={() => handleButtonPress(text)}>
        <Text style={buttonTextStyle}>{text}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.expression}>{expression}</Text>
      <Text style={styles.result}>{result}</Text>
      <View style={styles.buttons}>
        <View style={styles.row}>
          {renderButton('7')}
          {renderButton('8')}
          {renderButton('9')}
          {renderButton('/')}
        </View>
        <View style={styles.row}>
          {renderButton('4')}
          {renderButton('5')}
          {renderButton('6')}
          {renderButton('*')}
        </View>
        <View style={styles.row}>
          {renderButton('1')}
          {renderButton('2')}
          {renderButton('3')}
          {renderButton('-')}
        </View>
        <View style={styles.row}>
          {renderButton('C')}
          {renderButton('0')}
          {renderButton('=')}
          {renderButton('+')}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 200,
  },
  expression: {
    fontSize: 30,
    marginBottom: 28,
  },
  result: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  buttons: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  button: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 40,
    backgroundColor: '#D6DACE',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default CalculatorScreen;
