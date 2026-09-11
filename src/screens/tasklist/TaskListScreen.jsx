import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../../components/Header';
import DrawerNavigation from '../../components/DrawerNavigation';
import Constants from 'expo-constants';
import TaskListCard from './components/TaskListCard';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import TaskService from '../../services/TaskService';
import VoiceInput from '../../components/VoiceInput';
import { Ionicons } from '@expo/vector-icons';
import Fonts from '../../constants/font';
import DarkTheme from '../../theme/darkTheme';
import LightTheme from '../../theme/lightTheme';
import useThemeStore from '../../repository/store';
import Organize from '../../components/Organize';
import FilterService from '../../services/FilterService';
import filterTasks from '../../utils/filterTask';
import sortTasks from '../../utils/sortTask';
import SortService from '../../services/SortService';


const statusBarHeight = Constants.statusBarHeight;

const TaskListScreen = () => {
  const isDark = useThemeStore((state) => state.isDark);
  const theme = isDark ? DarkTheme : LightTheme;

  const [listItems, setListItems] = useState([])
  const [tasks, setTasks] = useState([]);
  const [isRecordingMode, setIsRecordingMode] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);






  
  useFocusEffect(
      useCallback(()=>{
        
        fetchTasks();


      return () => {
      
      };

    },[])
  )




  // Loads the latest tasks from storage and refreshes the list UI.
  const fetchTasks = async()=>{
    // await TaskService.clearAllTask();
    const data = await TaskService.getAllTasks();


    const tasksFilter = filterTasks(data, await FilterService.getFilter());
    
    const sortedTask = sortTasks(tasksFilter, await SortService.getSort()); 

    setTasks(sortedTask);
  }




  useEffect(()=>{

    setListItems(tasks)
  },[tasks])


  // Syncs the voice-recording state from the floating input component.
  const handleRecordingModeViaExternalComponent = (mode)=>{

    setIsRecordingMode(mode);

  }


  // Renders the appropriate UI element for each list item, including the filter row.
  const allListItems = useCallback((task)=>{

    return(
      <TaskListCard
        key={task.id}
        id={task.id}
        title={task.title}
        desc={task.description}
        dueDate={task.dueDate}
        isCompleted={task.isCompleted}
        fetchTasks={fetchTasks}
      />
    )



  })



  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
        <Header title="Achiva" onMenuPress={() => setIsDrawerVisible(true)} />

          <Organize fetchTasks={fetchTasks} />


        {
          tasks.length === 0 ?

            <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
              <Ionicons name="clipboard-outline" size={100} color={theme.textSecondary} />
              <Text style={{fontSize:25, fontFamily:Fonts.BodyRegular, color:theme.textSecondary }}>No Task</Text>
            </View> 

            :

          <ScrollView
            style={[styles.listContainer, { backgroundColor: theme.background }]}
            contentContainerStyle={[styles.listContent, { backgroundColor: theme.background }]}
            showsVerticalScrollIndicator={false}
          >

              {listItems.map((item) => (
                  allListItems(item)
              ))}
          </ScrollView> 
        }

        
        <>
            {isRecordingMode && ( <View style={styles.overlay} /> )}

            <VoiceInput 
              handleRecordingModeViaExternalComponent={handleRecordingModeViaExternalComponent} 
              fetchTasks={fetchTasks}
            />
        </>

        <DrawerNavigation
          visible={isDrawerVisible}
          onClose={() => setIsDrawerVisible(false)}
        />
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    paddingTop: statusBarHeight,
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 20,
  },
  
 overlay:{
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.13)",
    zIndex: 1,
  }


});

export default TaskListScreen;