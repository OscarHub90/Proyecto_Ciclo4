import React from "react";

import { Pressable, StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';

import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function NavBar() {

    const navegation=useNavigation()
    const logOut = async () => {
        await AsyncStorage.removeItem('token');
        navegation.navigate("SignIn")
      }
      const Projects = async () => {
        
        navegation.navigate("Projects")
      }
      const Inscrip = async () => {
        
        navegation.navigate("InscripcionScreen")
      }
      const Avanc = async () => {
        
        navegation.navigate("AvanceScreen")
      }
    return (

         <View >
   
     
        <Pressable
        onPress={logOut} 
        style={{
          backgroundColor:'#004080',
          height:50,
          borderRadius:5,
          alignItems:"center",
          justifyContent:"center",
          marginHorizontal:"70%",
          width:'15%',
          position:"absolute"
  
        }}>  
        <Text
          style={{
            color:"white",
            fontSize:18,
            fontWeight:"bold"
          }}>
            Cerrar Sesión
          </Text>
        </Pressable>
        
        <Pressable
        onPress={Projects} 
        style={{
          backgroundColor:'#004080',
          height:50,
          borderRadius:5,
          alignItems:"center",
          justifyContent:"center",
          marginHorizontal:"10%",
          width:'15%',
          position:"absolute"
  
        }}>  
        <Text
          style={{
            color:"white",
            fontSize:18,
            fontWeight:"bold"
          }}>
            lista de proyectos
          </Text>
        </Pressable>
        
        <Pressable
        onPress={Inscrip} 
        style={{
          backgroundColor:'#004080',
          height:50,
          borderRadius:5,
          alignItems:"center",
          justifyContent:"center",
          marginHorizontal:"30%",
          width:'15%',
          position:"absolute"
  
        }}>  
        <Text
          style={{
            color:"white",
            fontSize:18,
            fontWeight:"bold"
          }}>
            Proyectos Inscritos
          </Text>
        </Pressable>

        <Pressable
        onPress={Avanc} 
        style={{
          backgroundColor:'#004080',
          height:50,
          borderRadius:5,
          alignItems:"center",
          justifyContent:"center",
          marginHorizontal:"50%",
          width:'15%',
          position:"absolute"
  
        }}>  
        <Text
          style={{
            color:"white",
            fontSize:18,
            fontWeight:"bold"
          }}>
            Avances
          </Text>
        </Pressable>

      </View>
  
      
  
    );
  }

  export default NavBar
  const styles = StyleSheet.create({
    container: {
      padding: 12,
      width:"80%",
      marginHorizontal:"10%"
    },
    root: {
      flexDirection: 'row',
      width: '100%',
      padding: 10,
    },
    iconContainer: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      backgroundColor: '#404040',
      marginRight: 10,
    },
    title: {
      fontSize: 20,
      borderColor:"white",
      borderRadius:2,
      fontWeight: 'bold',
      textAlign:"center",
      padding: 5,
      color:"black",
      width:"80%",
      marginHorizontal:"10%",
      marginBottom:30
    },
    time: {
      color: 'darkgrey'
    }
  });
  