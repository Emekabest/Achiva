import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TaskListScreen from '../screens/tasklist/TaskListScreen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import AddTaskScreen from '../screens/addtask/AddTaskScreen';
import useThemeStore from '../repository/store';
import DarkTheme from '../theme/darkTheme';
import LightTheme from '../theme/lightTheme';
import SplashScreen from '../screens/splashscreen/SplashScreen';



const AppNavigator = () => {
const Stack = createStackNavigator();
const isDark = useThemeStore((state) => state.isDark);
const theme = isDark ? DarkTheme : LightTheme;



  
  


  return (
    <NavigationContainer>
      <StatusBar style={isDark ? 'light' : 'dark'} translucent={true} />

      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="splashscreen" component={SplashScreen} />
          <Stack.Screen name="tasklist" component={TaskListScreen} />
          <Stack.Screen name="addtask" component={AddTaskScreen} />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};



const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});

export default AppNavigator;