import * as React from 'react';
import { useState } from 'react';
import { ActivityIndicator, Alert, Picker, Pressable, TextInput } from 'react-native';
import { Text, View } from '../components/Themed';
import { useMutation, gql, useQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import alert from '../components/Alert';
import { useNavigation, useRoute } from '@react-navigation/native';

const GET_INSCRIPCION = gql`
query getInscripcion($id:ID!) {
  getInscripcion(id:$id) {
    id
    nombreProyecto
    objetivoGen
    avance {
      id
      descripAvance
      observacion
    }
  }
}
`

const CREATE_AVANCE = gql`
mutation createAvance($descripAvance:String!, $observacion:String!, $inscripcionId: ID!) {
  createAvance(descripAvance: $descripAvance, observacion: $observacion, inscripcionId: $inscripcionId) {
    id
		descripAvance
    observacion
    fechaAvance
   
      
    }
  }
`;



const newAvanceScreen =() => {
  const navigate=useNavigation()
  const [descripAvance, setDescripAvance]=useState("")
  const [observacion, setObservacion]=useState("")
  const route=useRoute();
  const id = route.params.id;

  const {
    data, error, loading
  } = useQuery(GET_INSCRIPCION, { variables: { id }})

  const [
    createAvance, { data: createTodoData, error: createTodoError }
  ] = useMutation(CREATE_AVANCE, { refetchQueries: GET_INSCRIPCION });
  
  const createNewItem = () => {
    createAvance({
      variables: {
        descripAvance: descripAvance,
        observacion: observacion,
        inscripcionId: id,
      }
    })
  alert("Avance registrado correctamente")
  navigate.navigate("AvanceScreen")
  }

  return (
    <View style={{padding:20}}>
      <Text style={{
          alignSelf:"center",
          fontSize:25,
          fontWeight:"bold"
      }}>Registro Avance</Text>
      
    <TextInput
    placeholder="Nombre del To Do"
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
    placeholder="Nombre del To Do"
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
        Crear avance
        </Text>
  </Pressable>
    </View>
  );

  
}

export default newAvanceScreen