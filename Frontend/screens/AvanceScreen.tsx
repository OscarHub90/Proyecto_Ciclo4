import React, {useEffect, useState} from 'react';
import { FlatList, Pressable, StyleSheet, TextInput } from 'react-native';
import { View, Text } from '../components/Themed';
import ToDoItem from '../components/ToDoItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { gql, useMutation, useQuery } from '@apollo/client';
import { AntDesign } from '@expo/vector-icons';

const GET_PROJECT = gql`
query getProyecto($id:ID!) {
  getProyecto(id:$id) {
    id
    nombreProyecto
    fechaInicio
    avances {
      id
      descripAvance
      observacion
      users{
      id
      nombre
      }
    }
  }
}
`

export default function AvanceScreen() {
  const navegation=useNavigation();
  const logOut = async () => {
    await AsyncStorage.removeItem('token');
    navegation.navigate("SignIn")
  }

  const NewAvance = async () => {
    navegation.navigate("NewAvance");
  }
  const [project, setProject] = useState(null);
  const [todo, setTodo] = useState([]);
  //const [title, setTitle] = useState('');

  const route = useRoute();
  const id = route.params.id;

  const {data, error, loading} = useQuery(GET_PROJECT, { variables: { id }})
  //const idTodo =()=>data.id;
  /*const [
    createTodo, { data: createTodoData, error: createTodoError }
  ] = useMutation(CREATE_TODO, { refetchQueries: GET_PROJECT });*/

  useEffect(() => {
    if (error) {
      console.log(error);
      alert('Error fetching project');
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setTodo(data.getTodo);
      //setTitle(data.getProyecto.title);
    }
  }, [data]);

  if (!todo) {
    return null;
  }

  

  return (
    <><View style={styles.container}>
      <Pressable
      onPress={NewAvance} 
      style={{
        backgroundColor:'#004080',
        height:50,
        borderRadius:5,
        alignItems:'center',
        justifyContent:"center",
        
        width:'15%',
        marginHorizontal:"5%",
      }}>  
      <Text
        style={{
          color:"white",
          fontSize:18,
          fontWeight:"bold"
        }}>
          Nuevo Avance
        </Text>
      </Pressable>
      <Pressable
      onPress={logOut} 
      style={{
        backgroundColor:'#004080',
        height:50,
        borderRadius:5,
        alignItems:"center",
        justifyContent:"center",
        marginHorizontal:"85%",
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
      <Text style={styles.title}>LISTA DE AVANCES</Text>
      <FlatList
        data={todo}
        renderItem={({item}) => <><ToDoItem todo={item} /></>}
        style={{ width: '100%' }}
      />
      </View></>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    width:"80%",
    marginHorizontal:"10%"
  },
  
  title: {
    fontSize: 20,
    borderColor:"white",
    borderRadius:2,
    fontWeight: 'bold',
    textAlign:"center",
    padding: 5,
    color:"white",
    width:"80%",
    marginHorizontal:"10%",
    marginBottom:30
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '100%',
  },
});
