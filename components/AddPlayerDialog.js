import { Icon, Input, ListItem, Text } from "@rneui/themed";
import { useEffect, useState } from "react";
import { StyleSheet, View, Keyboard, Alert } from "react-native";
import SQLiteService from "../services/SQLiteService";
import { FlatList } from "react-native";
import ValidationService from "../services/ValidationService";

export default function AddPlayerDialog({ game, handleUpdate, toggleOverlay }) {

    const [players, setPlayers] = useState([]);
    const [input, setInput] = useState('');

    const handleAddPlayer = () => {
        if(ValidationService.validateText(input)) {
            SQLiteService.addPlayer({ player: {
                username: input
            }})
            .then(() => {
                handlePlayerUpdate();
                Keyboard.dismiss();
            })
            .catch(err => console.error(err))
        }
        else {
            Alert.alert(
                'Virheellinen syöte!',
                'Pelaajan nimi ei voi olla tyhjä',
                [
                    { text: 'OK', onPress: () => console.log("Ok")}
                ]
            )            
        }
    }

    const handlePlayerUpdate = () => {
        SQLiteService.fetchPlayer()
        .then(data => setPlayers(data))
        .catch(err => console.error(err))
    }

    const handleAddConnection = (id) => {
        SQLiteService.addConnection(game.id, id)
        .then(() => {
            handleUpdate();
            toggleOverlay();
        })
        .catch(err => console.error(err))
    }

    const handlePlayerDelete = (playerId) => {
        SQLiteService.removePlayer(playerId)
        .then(() => handlePlayerUpdate())
        .catch(error => console.error(error))
    }

    const handleLongPress = (playerId) => {
        Alert.alert(
            'Pelaajan poisto',
            'Haluatko varmasti poistaa pelaajan?',
            [
                { text: 'Kyllä', onPress: () => handlePlayerDelete(playerId)},
                { text: 'Ei', onPress: () => {}}
            ]
        )
    }


    useEffect(() => {
        handlePlayerUpdate();
    }, [])

    renderItem = ({ item }) => (
        <ListItem bottomDivider
            onPress={() => handleAddConnection(item.id)}
            onLongPress={() => handleLongPress(item.id)}
        >
            <ListItem.Content>
                <ListItem.Title>{item.username}</ListItem.Title>
            </ListItem.Content>
        </ListItem>
    )

    return(
        <View style={styles.dialogContainer}>
            <Text h3>Lisää pelaaja peliin</Text>
            <Input style={styles.dialogInput} 
                placeholder="Nimi"
                onChangeText={value => setInput(value)}
                value={input}
                rightIcon={
                    <Icon
                        name="add"
                        onPress={() => handleAddPlayer()}
                    />
                }
            />
            <FlatList
                style={styles.dialogList} 
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderItem}
                data={players}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    dialogContainer: {
        padding: 20,
        borderRadius: 8,
        alignItems: 'center',
        width: 350,
        height: 500
    },
    dialogList: {
       width: 300
    },
    dialogInput: {
        width: 300,
        padding: 10,    
        marginTop: 10
    }
})