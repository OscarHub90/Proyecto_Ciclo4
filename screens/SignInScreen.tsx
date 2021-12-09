import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

export default function SignInScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [email, setEmail]=useState("")
  const [password, setPassword]=useState("")
  // Constante para la navegación del sitio
  const navegation = useNavigation();

  return (
    <View style={{padding:20}}>
      {/*<Text>Log In</Text>*/}
      <TextInput
      placeholder="E-mail"
      value={email}
      onChangeText={setEmail}
      style={{
        color:"black",
        fontSize:18,
        marginVertical:25,
        width:"50%",
        marginHorizontal:"25%"
      }}
    />
    <TextInput
    placeholder="Contraseña"
    value={password}
    onChangeText={setPassword}
    secureTextEntry
    style={{
      color:"black",
      fontSize:18,
      marginVertical:25,
      width:"50%",
      marginHorizontal:"25%"
    }}
  />
  <Pressable
  style={{
    backgroundColor:"#004080",
    height:50,
    borderRadius:8,
    alignItems:"center",
    justifyContent:"center",
    marginTop:30,
    marginVertical:25,
    marginHorizontal:"25%",
    width:"50%"
  }}
  >
    <text
    style={{
      color:"white",
      fontSize:18,
      fontWeight:"bold",
    }}> 
    Iniciar Sesión
    </text>
  </Pressable>

  <Pressable
  style={{
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:10,
    marginHorizontal:"25%",
    width:"50%"
  }}
  >
    <text
    style={{
      color:"#004080",
      fontSize:18,
      fontWeight:"bold",
    }}> 
    Crea tu cuenta
    </text>
  </Pressable>
  
    </View>
  );
}

//export default SignInScreen