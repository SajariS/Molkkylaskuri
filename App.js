import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import GameListScreen from './components/GameListScreen';
import SQLiteService from './services/SQLiteService';
import GameScreen from './components/GameScreen';

const Stack = createNativeStackNavigator();

export default function App() {

  useEffect(() => {
   SQLiteService.initialize()
   .catch(err => console.error(err))
  }, [])

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Lista" component={GameListScreen} />
          <Stack.Screen name="Peli" component={GameScreen} />
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

