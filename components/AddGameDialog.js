import { StyleSheet, View } from "react-native"
import { Icon, Input, Text } from "@rneui/themed"


export default function AddGameDialog({ game, setGame, handleAddGame, toggleAddOverlay}) {

    const addGame = () => {
        handleAddGame();
        toggleAddOverlay();
        setGame({...game, title: ''});
    }

    return(
        <View style={styles.dialogContainer}>
            <Text h3>Anna pelille nimi</Text>
            <Input style={styles.dialogInput}
                placeholder="Nimi"
                value={game.title}
                onChangeText={value => setGame({...game, title: value})}
                rightIcon={
                    <Icon
                        name="add"
                        onPress={() => addGame()}
                    />
                }
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