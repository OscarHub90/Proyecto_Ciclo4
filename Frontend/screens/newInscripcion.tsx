import * as React from 'react';
import { useState } from 'react';
import { ActivityIndicator, Alert, Picker, Pressable, TextInput } from 'react-native';
import { Text, View } from '../components/Themed';
import { useMutation, gql, useQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import alert from '../components/Alert';
import { useNavigation, useRoute } from '@react-navigation/native';

const GET_PROJECT = gql`
query getProyecto($id:ID!) {
  getProyecto(id:$id) {
    id
    nombreProyecto
    objetivoGen
    inscripcion{
      id
      fechaInscipcion
      estadoInscripcion
    }
    avance {
      id
      descripAvance
      observacion
    }
  }
}
`

const CREATE_INSCRIPCION = gql`
mutation createInscripcion($proyectoId: ID!) {
  createInscripcion(proyectoId: $proyectoId) {
    id
		fechaInscripcion
    estadoInscripcion
    proyecto {
      id
      nombreProyecto
      avances {
        id
        descripAvance
        observacion
        fechaAvance
      }
    }
  }
}
`



const newAvanceScreen =() => {
  const navigate=useNavigation()
  const route=useRoute();
  const id = route.params.id;

  const {
    data, error, loading
  } = useQuery(GET_PROJECT, { variables: { id }})

  const [
    createInscripcion, { data: createTodoData, error: createTodoError }
  ] = useMutation(CREATE_INSCRIPCION, { refetchQueries: GET_PROJECT });
  
  const createNewItem = () => {
    createInscripcion({
      variables: {
        proyectoId: id,
      }
    })
  alert("Avance registrado correctamente")
  navigate.navigate("InscripcionScreen")
  }

  return (
    <View style={{padding:20}}>
      <Text style={{
          alignSelf:"center",
          fontSize:25,
          fontWeight:"bold"
      }}>Registro Inscripcion</Text>
      
   
<Pressable
onPress={() => createNewItem()} 
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
        Crear Inscripcion
        </Text>
  </Pressable>
    </View>
  );

  
}

export default newAvanceScreen