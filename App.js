import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SQLiteService from './services/SQLiteService';
import { useEffect } from 'react';

const Stack = createNativeStackNavigator();

export default function App() {

  useEffect(() => {
    SQLiteService.initialize();
  }, [])

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
