/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import NotFoundScreen from '../screens/NotFoundScreen';
import InscripcionScreen from '../screens/InscripcionScreen';
import AvanceScreen from '../screens/AvanceScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import ProjectsScreen from '../screens/ProjectsScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SplashScreen from '../screens/SplashScreen';
import InformationScreen from '../screens/InformationScreen';
import NewProyectScreen from '../screens/newProyectScreen';
import newInscripcion from '../screens/newInscripcion';
import newAvance from '../screens/newAvance';
import NavBar from '../screens/NavBar';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Root" component={SplashScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Screen name="PrejectScreen" component={ProjectsScreen} />
      <Stack.Screen name="Projects" component={ProjectsScreen} />
      <Stack.Screen name="InscripcionScreen" component={InscripcionScreen} />
      <Stack.Screen name="AvanceScreen" component={AvanceScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="NewProject" component={NewProyectScreen} />
      <Stack.Screen name="NewInscripcion" component={newInscripcion} />
      <Stack.Screen name="NewAvance" component={newAvance} />
      <Stack.Screen name="Home" component={NavBar} />
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
 const BottomTab = createBottomTabNavigator<RootTabParamList>();

 function BottomTabNavigator() {
   const colorScheme = useColorScheme();
 
   return (
     <BottomTab.Navigator
       initialRouteName="TabOne"
       screenOptions={{
         tabBarActiveTintColor: Colors[colorScheme].tint,
       }}>
       <BottomTab.Screen
         name="TabOne"
         component={NavBar}
         options={({ navigation }: RootTabScreenProps<'TabOne'>) => ({
           title: 'NavBar',
           tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color="white" />,
         })}
       />
       <BottomTab.Screen
         name="TabTwo"
         component={InformationScreen}
         options={{
           title: 'Información',
           tabBarIcon: ({ color }) => <Entypo name="info-with-circle" size={24} color="white" />,
         }}
       />
       <BottomTab.Screen
         name="TabThree"
         component={InformationScreen}
         options={{
           title: 'Tab3',
           tabBarIcon: ({ color }) => <MaterialIcons name="post-add" size={24} color="white" />,
         }}
       />
     </BottomTab.Navigator>
     
   );
 }
 
 /**
  * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
  */
 function TabBarIcon(props: {
   name: React.ComponentProps<typeof FontAwesome>['name'];
   color: string;
 }) {
   return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
 }