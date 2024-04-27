import { useIsFocused } from "@react-navigation/native";
import { Button, Input, Overlay, Text, Icon, ListItem, Header } from "@rneui/themed";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import SQLiteService from "../services/SQLiteService";
import AddPlayerDialog from "./AddPlayerDialog";
import RemovePlayerDialog from "./RemovePlayerDialog";
import AddPointsDialog from "./AddPointsDialog";
import GameService from "../services/GameService";
import { ListItemChevron } from "@rneui/base/dist/ListItem/ListItem.Chevron";
import { ListItemSubtitle } from "@rneui/base/dist/ListItem/ListItem.Subtitle";


export default function GameScreen({ navigation, route }) {

    const { gameData } = route.params;
    const isFocused = useIsFocused();
    const [game, setGame] = useState({
        title: '',
        id: null
    });
    const [players, setPlayers] = useState([]);
    const [visibleAdd, setVisibleAdd] = useState(false);
    const [visibleRemove, setVisibleRemove] = useState(false);
    const [visiblePoints, setVisiblePoints] = useState(false);
    const [removePlayerId, setRemovePlayerId] = useState(null);
    const [turn, setTurn] = useState({});

    const handleUpdate = () => {
        SQLiteService.updateGame(gameData.id)
        .then(data => {
            setPlayers(data);
        })
        .catch(err => console.error(err))
    }

    const handleGameFetch = (gameId) => {
        SQLiteService.fetchGameById(gameId)
        .then(data => setGame(data))
        .catch(error => console.error(error))
    }

    const toggleAddOverlay = () => {
        setVisibleAdd(!visibleAdd);
    }

    const toggleRemoveOverlay = () => {
        setVisibleRemove(!visibleRemove);
    }

    const togglePointsOverlay = () => {
        setVisiblePoints(!visiblePoints)
    }

    const handleLongPress = (playerId) => {
        setRemovePlayerId(playerId);
        toggleRemoveOverlay();
    }

    const handlePress = (playerData) => {
        console.log(playerData);
        setTurn(playerData);
        togglePointsOverlay();
    }

    const handlePlayerRemove = (playerId) => {
        SQLiteService.removeConnection(game.id, playerId)
        .then(() => handleUpdate())
        .catch(err => console.error(err))
    }

    const handleWin = (username) => {
        if(game.winner === null) {
            SQLiteService.setWinner(game.id, username)
            .then(() => handleGameFetch(game.id))
            .catch(error => console.error(error))
        }
    }

    const handleTurn = (playerData, points) => {
        GameService.handleTurn(playerData, game.id, points)
        .then(points => {
            if(points === 50) {
                handleWin(playerData.username);
            }
            handleUpdate();
        })
        .catch(error => console.error(error))
    }

    const handleNavi = () => {
        navigation.navigate('Lista')
    }

    useEffect(() => {
        if(isFocused) {
            /*setGame({...game,
                title: gameData.title,
                id: gameData.id
            }) */
            handleGameFetch(gameData.id);
            handleUpdate();
        }
    }, [isFocused])

    const renderItem = ({ item }) => {

        const strikes= [];
        for(let i = 0; i < item.strikes; i++) {
            strikes.push(<Icon key={i.toString()} name="clear" size={20} color="red"/>);
        }

        return(
            <ListItem bottomDivider
                onLongPress={() => handleLongPress(item.id)}
                onPress={() => handlePress(item)}
            >
                <ListItem.Content style={styles.listContainer}>
                    <View>
                        <ListItem.Title style={styles.listTitle}>
                            {item.username}
                        </ListItem.Title>
                        <ListItem.Subtitle style={styles.listSubtitle}>
                            Pisteet: {item.points}
                        </ListItem.Subtitle>
                    </View>
                    <ListItemSubtitle>
                        <View style={styles.strikeContainer}>{strikes}</View>
                    </ListItemSubtitle>
                    <ListItemChevron
                        solid={true}
                        color="black"
                        size={25}
                    />
                </ListItem.Content>
            </ListItem>
        )
    }

    const renderHeader = () => (
        <View style={styles.listHeader}>
            <View>
                <Text h2>{game.title}</Text>
                {game.winner === null ? 
                <>
                    <Text> </Text>
                </>
                :
                <>
                    <Text>Voittaja: {game.winner}</Text>
                </>
                }
            </View>

            <Button radius={'sm'} type="solid" 
                onPress={() => toggleAddOverlay()}
            >
                <Icon 
                    name="add"
                    color="white"
                    size={25}
                />
            </Button>
        </View>
    )

    return(
        <View style={styles.container}>
            <Header 
                centerComponent={{ text: 'Mölkkylaskuri ', style: styles.headerTitle}}
                leftComponent={{ icon: 'west', color: 'white', size: 25, onPress: () => handleNavi()}}
            />
            <Overlay isVisible={visibleAdd} onBackdropPress={toggleAddOverlay}>
                <AddPlayerDialog game={game} handleUpdate={handleUpdate} toggleOverlay={toggleAddOverlay} gamePlayers={players} />
            </Overlay>
            <Overlay isVisible={visibleRemove} onBackdropPress={toggleRemoveOverlay}>
                <RemovePlayerDialog playerId={removePlayerId} setPlayerId={setRemovePlayerId} handlePlayerRemove={handlePlayerRemove} toggleOverlay={toggleRemoveOverlay} />
            </Overlay>
            <Overlay isVisible={visiblePoints} onBackdropPress={togglePointsOverlay}>
                <AddPointsDialog handleTurn={handleTurn} toggleOverlay={togglePointsOverlay} turn={turn} setTurn={setTurn}/>
            </Overlay>
            <FlatList
                style={styles.list}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderItem}
                ListHeaderComponent={renderHeader}
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
    },
    strikeContainer: {
        flex: 1,
        flexDirection: 'row', 
        width: 100,
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