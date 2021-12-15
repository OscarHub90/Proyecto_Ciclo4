import * as React from 'react';
import { Alert, FlatList, Pressable, StyleSheet } from 'react-native';
import AvanceItem from '../components/AvanceItem';
import ProjectItem from '../components/ProjectItem';
import { Text, View } from '../components/Themed';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, gql } from '@apollo/client';
import alert from '../components/Alert';
import { AntDesign } from '@expo/vector-icons';

const MY_AVANCE = gql`
query myProyectos {
  myProyectos {
  id
  nombreProyecto
  inscripciones {
    id
    fechaInscripcion
    estadoInscripcion
  }
  avances {
    id
    descripAvance
    observacion
  }
  
  users {
    id
    nombre
  } 
  }
}
`;

export default function AvancesScreen() {
  const navegation= useNavigation();
  const logOut = async () => {
    await AsyncStorage.removeItem('token');
    navegation.navigate("SignIn")
  }

  const newAvance = async () =>{
    navegation.navigate("NewAvance")
  }

  const [avance, setAvances] = useState([]);
   

  const { data, error, loading } = useQuery(MY_AVANCE)

  useEffect(() => {
    if (error) {
      alert("Credeciales equivocadas o Usuario no autorizado")
    }
  }, [error])
  
  useEffect(() => {
    if (data) {
      setAvances(data.myProyectos);
    }
  }, [data]);


  return (
    <View style={styles.container}>
     
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
      
      <Text style={styles.title}>LISTA DE AVANCES - SoftBox_Free</Text>
      <FlatList
        data={avance}
        renderItem={({item}) => <><AvanceItem proyecto={item} /></>}
        style={{ width: '100%' }}
      />
      
      
    </View>

    

  );
}
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
