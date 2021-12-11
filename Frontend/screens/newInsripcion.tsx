import * as React from 'react';
import { useState } from 'react';
import { ActivityIndicator, Alert, Picker, Pressable, TextInput } from 'react-native';
import { Text, View } from '../components/Themed';
import { useMutation, gql, useQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import alert from '../components/Alert';
import { useNavigation, useRoute } from '@react-navigation/native';


const CREATE_INCRIPCION = gql`
mutation createInscripcion($proyectoId: ID!) {
  createToDo(proyectoId: $proyectoId) {
    id
		fechaInscripcion
    estadoInscripcion
       
    proyecto {
      id
      nombreProyecto
      }
    users{
      id
      nombre
    }
  }
}
`

const newInscripcionScreen =() => {
  const navegation= useNavigation();
  const [descripAvance, setDescripAvance]=useState("");
  const [observacion, setObservacion]=useState("");
  
  
  //const route=useRoute();
  //const id = route.params.id;

  const [newAvance, { data, error, loading }] = useMutation(CREATE_INSCRIPCION);
  if (error) {
    Alert.alert('Error registrando tarea, por favor intente de nuevo')
  }

  const reload = ()=>{
    window.location.reload();
  }

  if (data) {
        alert("Proyecto creado Correctamente")
        navegation.navigate("ToDoScreen");
        reload()
  }


  const onSubmit = () =>{
    newAvance({variables: {}})
    
  }
 

  

  return (
    <View style={{padding:20}}>
      <Text style={{
          alignSelf:"center",
          fontSize:25,
          fontWeight:"bold"
      }}>Registro de Nuevo Avance</Text>
      
    
    <TextInput
    placeholder="Descripción del Avance"
    value={descripAvance}
    onChangeText={setDescripAvance}
    style={{
      color:"black",
      fontSize:18,
      marginVertical:25,
      width:'50%',
      marginHorizontal:"25%"
    }}
    />
<TextInput
    placeholder="Observación"
    value={observacion}
    onChangeText={setObservacion}
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
        Crear avance
        </Text>
  </Pressable>
    </View>
  );

  
}

export default newInscripcionScreen
