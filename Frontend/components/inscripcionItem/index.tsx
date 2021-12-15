import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import styles from './styles';

interface InscripcionItemProps {
  inscripcion: {
    id: string,
    proyecto:{
      nombreProyecto:string
    }
  }
}


const InscripcionItem = ({ inscripcion }: InscripcionItemProps) => {
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate('NewAvance', { id:inscripcion.id} )
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
        <Text style={styles.title}>{inscripcion.id}</Text>
        <Text style={styles.title}>{inscripcion.proyecto.nombreProyecto}</Text>
      </View>
      {/*<View style={styles.time}>
        <Text style={styles.time}>{project.createdAt}</Text>
  </View>*/}
      
    
    </Pressable>
        </View>
    
  )

}

export default InscripcionItem