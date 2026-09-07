import { Ionicons } from "@expo/vector-icons";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useEffect, useState } from "react";
import Fonts from "../constants/font";
import useThemeStore from "../repository/store";
import DarkTheme from "../theme/darkTheme";
import LightTheme from "../theme/lightTheme";
import { FILTER } from "../constants/filter";
import FilterService from "../services/FilterService";
import capitalize from "../utils/capitalize";
import {SORT} from "../constants/sort";
import SortService from "../services/SortService";


// Renders the task list toolbar and opens the sort options sheet.
const Organize = ({fetchTasks})=>{
  const isDark = useThemeStore((state) => state.isDark);
  const theme = isDark ? DarkTheme : LightTheme;
  const [isSortVisible, setIsSortVisible] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedSort, setSelectedSort] = useState("");





  useEffect(()=>{
    const fetch = async()=>{
       const filterType = await FilterService.getFilter();
       const sortBy = await SortService.getSort();


       setSelectedFilter(capitalize(filterType));
       setSelectedSort(capitalize(sortBy));
    }


    fetch();
  },[])

  // Opens the sort-by sheet so the user can choose a sorting option.
  const handleSortTask = async (sortBy) => {
    setSelectedSort(capitalize(sortBy));

    if (sortBy === SORT.DUE_DATE) {
      await SortService.setSort(SORT.DUE_DATE);
    } else if (sortBy === SORT.NEWEST) {
      await SortService.setSort(SORT.NEWEST);
    } else if (sortBy === SORT.OLDEST) {
      await SortService.setSort(SORT.OLDEST);
    }

    fetchTasks();
    setIsSortVisible(false);
  };


/**Filters the tasks base on the filter keyword i.e all, completed or pending */  
const handleFilterTask = async(filter)=>{
    setSelectedFilter(capitalize(filter));


    if (filter === FILTER.ALL){

        await FilterService.setFilter(FILTER.ALL);

    }
    else if (filter === FILTER.COMPLETED){
        await FilterService.setFilter(FILTER.COMPLETED);
    }
    else if (filter === FILTER.PENDING){
        await FilterService.setFilter(FILTER.PENDING);
    }


    fetchTasks();
    console.log("reach here")

    setIsFilterVisible(false);
}



    return(
        <View style={styles.container}>
            <View style = {styles.left}>
                <View style = {{display:"flex", width:"100%", height:"50%",   flexDirection:"row",justifyContent:"flex-start",}}>
                    <TouchableOpacity activeOpacity={1} onPress={()=> setIsSortVisible(true)}>
                        <Ionicons name="swap-vertical" size={20} color={theme.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={()=> setIsSortVisible(true)}>
                    </TouchableOpacity>
                </View>
               
            </View>

            <View style = {styles.center}>
                <Text style={{fontSize:15, color:theme.text, fontFamily:Fonts.BodySemiBold}}>{selectedFilter}</Text>
            </View>

            <View style = {styles.right}>
                <TouchableOpacity activeOpacity={1} onPress={()=> setIsFilterVisible(true)}>
                     <Ionicons name="filter-outline" size={20} color={theme.icon}  />
                </TouchableOpacity>

            </View>



            {/**Sort Modal */}
            <Modal transparent visible={isSortVisible} animationType="slide" onRequestClose={() => setIsSortVisible(false)}>
                <TouchableOpacity activeOpacity={1} style={styles.modalOverlay} onPress={() => setIsSortVisible(false)}>
                    <View style={[styles.sheet, { backgroundColor: theme.background }]}> 
                        <View style={styles.sheetHeader}>
                            <Ionicons name="swap-vertical" style={{paddingTop:3}} size={20} color={theme.icon} />
                            <Text style={[styles.sheetTitle, { color: theme.text }]}>Sort By</Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.optionRow, selectedSort === capitalize(SORT.DUE_DATE) && styles.optionRowActive]}
                            onPress={()=> handleSortTask(SORT.DUE_DATE)}
                        >
                            <Ionicons name="calendar-outline" color={selectedSort === capitalize(SORT.DUE_DATE) ? theme.primary : theme.icon} size={23} />
                            <Text style={[styles.optionText, { color: selectedSort === capitalize(SORT.DUE_DATE) ? theme.primary : theme.text }]}>Due dates</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.optionRow, selectedSort === capitalize(SORT.NEWEST) && styles.optionRowActive]}
                            onPress={() => handleSortTask(SORT.NEWEST)}
                        >
                            <Ionicons name="arrow-down-circle-outline" color={selectedSort === capitalize(SORT.NEWEST) ? theme.primary : theme.success} size={23} />
                            <Text style={[styles.optionText, { color: selectedSort === capitalize(SORT.NEWEST) ? theme.primary : theme.text }]}>Newest</Text>
                        </TouchableOpacity>


                        <TouchableOpacity
                            style={[styles.optionRow, selectedSort === capitalize(SORT.OLDEST) && styles.optionRowActive]}
                            onPress={() => handleSortTask(SORT.OLDEST)}
                        >
                            <Ionicons name="arrow-up-circle-outline" color={selectedSort === capitalize(SORT.OLDEST) ? theme.primary : theme.success} size={23} />
                            <Text style={[styles.optionText, { color: selectedSort === capitalize(SORT.OLDEST) ? theme.primary : theme.text }]}>Oldest</Text>
                        </TouchableOpacity>



                    </View>
                </TouchableOpacity>
            </Modal>



            {/**Filter Modal.................................................................................................................*/}
            <Modal transparent visible={isFilterVisible} animationType="slide" onRequestClose={() => setIsFilterVisible(false)}>
                <TouchableOpacity activeOpacity={1} style={styles.modalOverlay} onPress={() => setIsFilterVisible(false)}>
                    <View style={[styles.sheet, { backgroundColor: theme.background }]}> 
                        <View style={styles.sheetHeader}>
                            <Ionicons name="filter-outline" style={{paddingTop:3}} size={20} color={theme.icon} />
                            <Text style={[styles.sheetTitle, { color: theme.text }]}>Filter</Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.optionRow, selectedFilter === "All" && styles.optionRowActive]}
                            onPress={()=> handleFilterTask(FILTER.ALL)}
                        >
                            <Ionicons name="list" color={selectedFilter === "All" ? theme.primary : theme.icon} size={23} />
                            <Text style={[styles.optionText, { color: selectedFilter === "All" ? theme.primary : theme.text }]}>All</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.optionRow, selectedFilter === "Completed" && styles.optionRowActive]}
                            onPress={()=> handleFilterTask(FILTER.COMPLETED)}
                        >
                            <Ionicons name="checkmark-circle" color={selectedFilter === "Completed" ? theme.primary : theme.success} size={23} />
                            <Text style={[styles.optionText, { color: selectedFilter === "Completed" ? theme.primary : theme.text }]}>Completed</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.optionRow, selectedFilter === "Pending" && styles.optionRowActive]}
                            onPress={() => handleFilterTask(FILTER.PENDING)}
                        >
                            <Ionicons name="time-outline" color={selectedFilter === "Pending" ? theme.primary : theme.icon} size={23} />
                            <Text style={[styles.optionText, { color: selectedFilter === "Pending" ? theme.primary : theme.text }]}>Pending</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            
        </View>
    )
}



const styles = StyleSheet.create({
    container:{
        height:40,
        width:"100%",
        paddingHorizontal:10,
        display:"flex",
        flexDirection:"row"
        
    },

    left:{
        width:'30%',
        height:"100%",
        // backgroundColor:"green",
        justifyContent:"center",

    },

    center:{
        width:"40%",
        height:"100%",
        alignItems:"center",
        justifyContent:"center"

    },

    right:{
        width:'30%',
        height:"100%",
        alignItems:"flex-end",
        justifyContent:"center",
        // backgroundColor:"#c9c9c9"
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.25)",
    },
    sheet: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 24,
    },
    sheetHeader: {
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0,0,0,0.08)",
        marginBottom: 8,
        display:"flex",
        flexDirection:"row"
    },
    sheetTitle: {
        fontSize: 16,
        fontFamily: Fonts.HeaderSemiBold,
        marginLeft:5,
        // backgroundColor:"red",

        // marginBottom:5
    },
    optionRow: {
        display:"flex",
        flexDirection:"row",
        paddingVertical: 14,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    optionRowActive: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
    },
    optionText: {
        marginLeft:5,
        fontSize: 15,
        fontFamily: Fonts.BodyRegular,
    }



})

export default Organize;