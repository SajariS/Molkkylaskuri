import { Button, Icon, Text } from "@rneui/themed"
import { StyleSheet, View } from "react-native"

export default function DeleteGameDialog({ gameId, setGameId, handleDeleteGame, toggleOverlay}) {

    const handleDelete = () => {
        handleDeleteGame(gameId);
        setGameId(null);
        toggleOverlay();
    }
    
    const handleClose = () => {
        setGameId(null);
        toggleOverlay();
    }

    return(
        <View style={styles.dialogContainer} >
            <Text h3>Poista peli?</Text>
            <View style={styles.buttonContainer}>
                <Button color="green"
                    onPress={() => handleDelete()}
                >
                    <Icon
                        name="done"
                        color="white"
                    />
                </Button>
                <Button color="red"
                    onPress={() => handleClose()}
                >
                    <Icon
                        name="close"
                        color="white"
                    />
                </Button>
            </View>
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
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '80%',
        paddingVertical: 15
    }
})