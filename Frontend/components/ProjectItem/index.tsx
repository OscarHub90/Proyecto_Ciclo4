import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import styles from './styles';


interface ProjectItemProps {
  project: {
    id: string,
    nombreProyecto: string,
    objetivoGen:string,
    avances:{
      id:string,
      descripAvance:string,
    },
    users: string[]
  }
}


const ProjectItem = ({ project }: ProjectItemProps) => {
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate('NewInscripcion', {id:project.id})
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
        <Text style={styles.title}>{project.nombreProyecto}</Text>
        <Text style={styles.title}>{project.objetivoGen}</Text>
      </View>
      {/*<View style={styles.time}>
        <Text style={styles.time}>{project.createdAt}</Text>
  </View>*/}
      
    
    </Pressable>
        </View>
    
  )

}

export default ProjectItem