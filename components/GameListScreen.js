import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import SQLiteService from "../services/SQLiteService";
import { Button, Icon, ListItem, Text } from "@rneui/themed";

export default function GameListScreen({ navigation }) {

    const isFocused = useIsFocused();
    const [gameList, setGameList] = useState([]);
    const [game, setGame] = useState({
        title: 'testi'
    })

    const handleGameFetch = () => {
        SQLiteService.fetchGame()
        .then(data => setGameList(data))
        .catch(err => console.error(err))
    }

    const handleAddGame = () => {
        SQLiteService.addGame({game})
        .then(() => handleGameFetch())
        .catch(err = console.error)
    }

    useEffect(() => {
        if(isFocused) {
            handleGameFetch();
        }  

    }, [isFocused])

    renderItem = ({ item }) => (
        <ListItem bottomDivider
            onPress={() => navigation.navigate('Peli', {gameData: {
                title: item.title,
                id: item.id
            }})}
        >
            <ListItem.Content style={styles.listContainer}>
                <ListItem.Title>{item.title}</ListItem.Title>
            </ListItem.Content>
        </ListItem>
    )

    renderHeader = () => (
        <View style={styles.listHeader}>
            <Text h2>Testipesti</Text>
            <Button radius={'sm'} type="solid" 
                onPress={() => handleAddGame()}
            >
                Lisää
                <Icon name='add' />
            </Button>
        </View>
    )

    return(
        <View style={styles.container}>
            <FlatList
                style={styles.list}
                ListHeaderComponent={renderHeader}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderItem}
                data={gameList}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center', 
    },
    list: {
        width: '100%',
        textAlign: 'center'
    },
    listHeader: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 10
    },
    input: {
        width: '100%',
        margin: 5,
    },
    inputLabel: {
        marginTop: 10
    },
    button: {
        width: 200
    },
    listContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    listSubContainer: {
        flexDirection: 'row'
    },
    subtitle: {
        color: 'gray'
    },
    icon: {
        fontSize: 20
    }
  });