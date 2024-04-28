import { Button, Icon, Text } from "@rneui/themed"
import { StyleSheet, View } from "react-native"

export default function RemovePlayerDialog({ playerId, setPlayerId, handlePlayerRemove, toggleOverlay }) {

    const handleRemove = () => {
        handlePlayerRemove(playerId);
        setPlayerId(null);
        toggleOverlay();
    }

    const handleClose = () => {
        setPlayerId(null);
        toggleOverlay();
    }

    return(
        <View style={styles.dialogContainer} >
        <Text h3>Poista pelaaja pelistä?</Text>
        <View style={styles.buttonContainer}>
            <Button color="green"
                onPress={() => handleRemove()}
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