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
        <Stack.Navigator
          initialRouteName="Lista"
        >
          <Stack.Screen name="Lista" component={GameListScreen} options={{ headerShown: false}}/>
          <Stack.Screen name="Peli" component={GameScreen} options={{ headerShown: false}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}


