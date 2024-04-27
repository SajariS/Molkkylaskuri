import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import SQLiteService from "../services/SQLiteService";
import { Button, ButtonGroup, Header, Icon, ListItem, Overlay, Text } from "@rneui/themed";
import AddGameDialog from "./AddGameDialog";
import DeleteGameDialog from "./DeleteGameDialog";
import SettingsDialog from "./SettingsDialog";

export default function GameListScreen({ navigation }) {

    const isFocused = useIsFocused();
    const [gameList, setGameList] = useState([]);
    const [game, setGame] = useState({
        title: ''
    });
    const [visibleAdd, setVisibleAdd] = useState(false);
    const [visibleRemove, setVisibleRemove] = useState(false);
    const [visibleSettings, setVisibleSettings] = useState(false);
    const [removeGameId, setRemoveGameId] = useState(null);

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

    const handleDeleteGame = (gameId) => {
        SQLiteService.removeGame(gameId)
        .then(() => handleGameFetch())
        .catch(err => console.error(err))
    }

    const handleLongPress = (gameId) => {
        setRemoveGameId(gameId);
        toggleRemoveOverlay();
    }

    const toggleAddOverlay = () => {
        setVisibleAdd(!visibleAdd);
    }

    const toggleRemoveOverlay = () => {
        setVisibleRemove(!visibleRemove);
    }

    const toggleSettingsOverlay = () => {
        setVisibleSettings(!visibleSettings);
    }

    const handleReset = () => {
        SQLiteService.resetDb()
        .then(() => handleGameFetch())
        .catch(error => console.error(error))
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
            onLongPress={() => handleLongPress(item.id)}
        >
            <ListItem.Content style={styles.listContainer}>
                <View>
                <ListItem.Title style={styles.listTitle}>{item.title}</ListItem.Title>
                {item.winner !== null ? 
                <ListItem.Subtitle style={styles.listSubtitle}>
                    Voittaja: {item.winner}    
                </ListItem.Subtitle>
                :
                <ListItem.Subtitle style={styles.listSubtitle}>
                    Peli kesken
                </ListItem.Subtitle>
                }
                </View>
                <ListItem.Chevron 
                    color="black"
                    size={25}
                />
            </ListItem.Content>
        </ListItem>
    )

    renderHeader = () => (
        <View style={styles.listHeader}>
            <Text h2>Pelit</Text>
            <View style={styles.headerContainer}>
                <Button
                    onPress={() => toggleAddOverlay()}
                >
                    
                    <Icon 
                        name="add"
                        color="white"
                        size={25}
                    />
                </Button>
                <Button
                    onPress={() => toggleSettingsOverlay()}
                    
                >
                    <Icon
                        name="settings"
                        color="white"
                        size={25}
                    />
                </Button>
            </View>
        </View>
    )

    return(
        <View style={styles.container}>
            <Header 
                centerComponent={{ text: 'Mölkkylaskuri', style: styles.headerTitle }}
            />
            <Overlay isVisible={visibleAdd} onBackdropPress={toggleAddOverlay}>
                <AddGameDialog game={game} setGame={setGame} handleAddGame={handleAddGame} toggleAddOverlay={toggleAddOverlay} />
            </Overlay>
            <Overlay isVisible={visibleRemove} onBackdropPress={toggleRemoveOverlay}>
                <DeleteGameDialog gameId={removeGameId} setGameId={setRemoveGameId} handleDeleteGame={handleDeleteGame} toggleOverlay={toggleRemoveOverlay}/>
            </Overlay>
            <Overlay isVisible={visibleSettings} onBackdropPress={toggleSettingsOverlay}>
                <SettingsDialog handleReset={handleReset} toggleOverlay={toggleSettingsOverlay}/>
            </Overlay>
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
    headerContainer: {
        padding: 10,
        flexDirection: 'row',
        width: 135,
        justifyContent: 'space-between'
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
    listTitle: {
        fontWeight: 'bold',
        fontSize: 20
    },
    listSubtitle: {
        color: 'gray'
    },
    headerTitle: {
        color: 'white',
        fontSize: 25
    }

  });