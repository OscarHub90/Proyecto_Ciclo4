import React, { useState, useEffect, useRef } from 'react'
import { View, TextInput, Pressable } from 'react-native'
import { useMutation, gql } from '@apollo/client';
import alert from '../Alert';

import Checkbox from '../Checkbox';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const UPDATE_TODO = gql`
mutation updateAvance($id:ID!, $descripAvance: String!, $observacion: String!) {
  updateAvance(id: $id, descripAvance: $descripAvance, observacion: $obsevacion) {
    id
		descripAvance
    observacion
    proyecto {
      id
      nombreProyecto
    users{
      id
      nombre
    }
     
    }
  }
}
`;


const DELETE_TODO = gql`
mutation DeleteToDo($deleteToDoId: ID!) {
  deleteToDo(id: $deleteToDoId)
}
`;

interface ToDoItemProps {
  todo: {
    id: string;
    descripAvance: string;
    observacion: string;
  },
}

interface ProjectItemProps {
  project: {
    id: string,
    nombreProyecto: string,
    objetivoGen:string,
    users: string[]
  }
}

const ToDoItem = ({ todo }: ToDoItemProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const [descripAvance, setDescripAvance] = useState('');
  const [observacion, setObservacion] = useState('');
  const navigation=useNavigation();

  const [updateItem] = useMutation(UPDATE_TODO);
  const input = useRef(null);

  const [deleteToDo, {  error }] = useMutation(DELETE_TODO);
  if (error) {
    alert('Error eliminando ToDo, por favor intente de nuevo')
  }



  const removeToDo = () => {
    deleteToDo({
      variables: {
        id: todo.id,
      }
    })
  };


  



  useEffect(() => {
    if (!todo) { return }

    setObservacion(todo.observacion);
    setDescripAvance(todo.descripAvance); 
  }, [todo])

  useEffect(() => {
    if (input.current) {
      (input.current as HTMLElement)?.focus();}
  }, [input])

 


  return (
    <><><View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 3 }}>
      {/* Checkbox */}
      {/*<Checkbox
        isChecked={isChecked}
        onPress={() => {
          setIsChecked(!isChecked);
          callUpdateItem();
        } } />*/}

      {/* Text Input */}
      
      <TextInput
        ref={input}
        value={descripAvance}
        onChangeText={setDescripAvance}
        style={{
          flex: 1,
          fontSize: 18,
          color: 'black',
          marginLeft: 12,
        }}
        editable={false}
        multiline
        
        blurOnSubmit />
        <TextInput
        ref={input}
        value={observacion}
        onChangeText={setObservacion}
        style={{
          flex: 1,
          fontSize: 18,
          color: 'black',
          marginLeft: 12,
        }}
        editable={false}
        multiline
        
        blurOnSubmit />
    </View></><Pressable onPress={removeToDo}><FontAwesome name="remove" size={24} color="white" /></Pressable></>
  )
}

export default ToDoItem