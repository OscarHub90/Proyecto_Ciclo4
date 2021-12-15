import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import styles from './styles';

interface AvanceItemProps {
  proyecto: {
    id: string,
    nombreProyecto: string,
    objetivoGen:string,
    inscripcion:{
      id:string,
      estadoInscripcion:string,
      fechaInscripcion:string,
    },
    avances:{
      id:string,
      descripAvance:string,
      observacion:string,
      fechaAvance:string,
    },
    user:{
      id:string,
      nombre:string,

    },
  }
}


const AvanceItem = ({ proyecto }: AvanceItemProps) => {
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate('NewAvance', { id:avance.id} )
  }

  const cleanTask = () => {
    //
  }
  
  return (
    <View>
      <Pressable onPress={onPress} style={styles.root}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="file-outline" size={24} color="grey" />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={styles.title}>{proyecto.nombreProyecto}</Text>
      
      <Text style={styles.title}>{proyecto.avances.descripAvance}</Text>
      </View>
      {/*<View style={styles.time}>
        <Text style={styles.time}>{project.createdAt}</Text>
  </View>*/}
      
    
    </Pressable>
        </View>
    
  )

}

export default AvanceItem