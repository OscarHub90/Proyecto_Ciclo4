import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { useState } from 'react';
import { ActivityIndicator, Alert, Picker, Pressable, TextInput } from 'react-native';
import { Text, View } from '../components/Themed';
import { useMutation, gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import alert from '../components/Alert';


const NEW_TASK_CREATION= gql`
mutation CreateProyecto($nombreProyecto: String!, $objetivoGen: String!, $objetivoEsp: String!, $presupuesto: String!, $fechaFin: String!) {
  createProyecto(nombreProyecto: $nombreProyecto, objetivoGen: $objetivoGen, objetivoEsp: $objetivoEsp, presupuesto: $presupuesto, fechaFin: $fechaFin) {
    id
    nombreProyecto
    objetivoGen
    objetivoEsp
    fechaFin
    estado
    fase
    users {
      id
      nombre
    }
  }
}
`;

const NewProyectScreen =() => {
  const [nombreProyecto, setNombreProyecto]=useState("")
  const [objetivoGen, setObjetivoGen]=useState("")
  const [objetivoEsp, setObjetivoEsp]=useState("")
  const [presupuesto, setPresupuesto]=useState("")
  const [fechaFin, setFechaFin]=useState("")

  const navegation= useNavigation();

  // mutation[0] : A function to trigger the mutation
  // mutation[1] : result object 
  //    { data,error, loading }
  const [newTask, { data, error, loading }] = useMutation(NEW_TASK_CREATION);
  if (error) {
    Alert.alert('Error registrando tarea, por favor intente de nuevo')
  }

  {/*if (data){
    AsyncStorage.setItem("token",data.signUp.token)
    .then(()=>{
      AsyncStorage.setItem("rol",data.signUp.rol)
      if (data.signUp.rol=="Estudiante"){
        navegation.navigate("Home")
      }
    })
  }*/}
  const reload = ()=>{
    window.location.reload();
  }

  if (data) {
        alert("Proyecto creado Correctamente")
        navegation.navigate("Projects");
        reload()
  }


  const onSubmit = () =>{
    newTask({variables: {nombreProyecto, objetivoGen, objetivoEsp, presupuesto, fechaFin}})
  }
 

  return (
    <View style={{padding:20}}>
      <Text style={{
          alignSelf:"center",
          fontSize:25,
          fontWeight:"bold"
      }}>Registro de Nuevo Proyecto</Text>
      
    <TextInput
    placeholder="Nombre del Proyecto"
    value={nombreProyecto}
    onChangeText={setNombreProyecto}
    style={{
      color:"black",
      fontSize:18,
      marginVertical:25,
      width:'50%',
      marginHorizontal:"25%"
    }}
    />
     <TextInput
    placeholder="Objetivo General"
    value={objetivoGen}
    onChangeText={setObjetivoGen}
    style={{
      color:"black",
      fontSize:18,
      marginVertical:25,
      width:'50%',
      marginHorizontal:"25%"
    }}
    />
     <TextInput
    placeholder="Objetivo Especificos"
    value={objetivoEsp}
    onChangeText={setObjetivoEsp}
    style={{
      color:"black",
      fontSize:18,
      marginVertical:25,
      width:'50%',
      marginHorizontal:"25%"
    }}
    />
    <TextInput
    placeholder="Presupuesto"
    value={presupuesto}
    onChangeText={setPresupuesto}
    style={{
      color:"black",
      fontSize:18,
      marginVertical:25,
      width:'50%',
      marginHorizontal:"25%"
    }}
    />
<TextInput
    placeholder="Fecha final"
    value={fechaFin}
    onChangeText={setFechaFin}
    style={{
      color:"black",
      fontSize:18,
      marginVertical:25,
      width:'50%',
      marginHorizontal:"25%"
    }}
    />


<Pressable
onPress={onSubmit} 
  style={{
    backgroundColor:'#004080',
    height:50,
    borderRadius:5,
    alignItems:'center',
    justifyContent:"center",
    marginTop:30,
    width:'50%',
    marginHorizontal:"25%",
  }}
  >
    {loading && <ActivityIndicator />}
    <Text
      style={{
        color:"white",
        fontSize:18,
        fontWeight:"bold"
      }} >
        Crear Proyecto
        </Text>
  </Pressable>
    </View>
  );

  
}

export default NewProyectScreen