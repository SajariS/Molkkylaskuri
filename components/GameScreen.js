import { useIsFocused } from "@react-navigation/native";
import { Button, Input, Overlay, Text, Icon, ListItem } from "@rneui/themed";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import SQLiteService from "../services/SQLiteService";
import AddPlayerDialog from "./AddPlayerDialog";


export default function GameScreen({ navigation, route }) {

    const { gameData } = route.params;
    const isFocused = useIsFocused();
    const [game, setGame] = useState({
        title: '',
        id: null
    });
    const [players, setPlayers] = useState([]);
    const [visible, setVisible] = useState(false);

    const handleUpdate = () => {
        SQLiteService.updateGame(gameData.id)
        .then(data => setPlayers(data))
        .catch(err => console.error(err))
    }

    const toggleOverlay = () => {
        setVisible(!visible);
    }

    useEffect(() => {
        if(isFocused) {
            setGame({...game,
                title: gameData.title,
                id: gameData.id
            })
            handleUpdate();
        }
    }, [isFocused])

    renderItem = ({ item }) => (
        <ListItem bottomDivider
            onLongPress={() => console.log("Todo poisto dialogi")}
        >
            <ListItem.Content style={styles.listContainer}>
                <ListItem.Title>
                    {item.username}: {item.points}
                </ListItem.Title>
                <Icon 
                    name="add"
                    onPress={() => console.log("TODO pisteen lisäys dialogi")}
                />
            </ListItem.Content>
        </ListItem>
    )

    return(
        <View style={styles.container}>
            <Button 
                title="Lisää pelaaja"
                onPress={() => toggleOverlay()}
            />
            <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
                <AddPlayerDialog game={game} />
            </Overlay>
            <FlatList
                style={styles.list}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderItem}
                data={players}               
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
      width: '100%'
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
    listInput: {
        width: 50
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