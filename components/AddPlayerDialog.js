import { Button, Icon, Input, ListItem, Text } from "@rneui/themed"
import { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import SQLiteService from "../services/SQLiteService"
import { FlatList } from "react-native"

export default function AddPlayerDialog({ game }) {

    const [players, setPlayers] = useState([]);
    const [input, setInput] = useState('');

    const handleAddPlayer = () => {
        SQLiteService.addPlayer({ player: {
            username: input
        }})
        .then(() => handlePlayerUpdate())
        .catch(err => console.error(err))
    }

    const handlePlayerUpdate = () => {
        SQLiteService.fetchPlayer()
        .then(data => setPlayers(data))
        .catch(err => console.error(err))
    }

    const handleAddConnection = (id) => {
        SQLiteService.addConnection(game.id, id)
        .catch(err => console.error(err))
    }

    useEffect(() => {
        handlePlayerUpdate();
    }, [])

    renderItem = ({ item }) => (
        <ListItem bottomDivider
            onPress={() => handleAddConnection(item.id)}
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
                label="Uusi pelaaja"
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
        width: 350
    },
    dialogList: {
       width: 300
    },
    dialogInput: {
        width: 300,
        padding: 10
        
    }
})