import { Alert, StyleSheet, View } from "react-native"
import { Icon, Input, Text, Button } from "@rneui/themed"
import ValidationService from "../services/ValidationService";


export default function AddGameDialog({ game, setGame, handleAddGame, toggleAddOverlay}) {

    const handleAdd = () => {
        if(ValidationService.validateText(game.title)) {
            handleAddGame();
            toggleAddOverlay();
            setGame({...game, title: ''});
        }
        else {
            Alert.alert(
                'Virheellinen syöte!',
                'Pelin nimi ei voi olla tyhjä',
                [
                    { text: 'OK', onPress: () => {}}
                ]
            )
        }
    }

    const handleClose = () => {
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
            />
            <View style={styles.buttonContainer}>
                <Button color="green"
                    onPress={() => handleAdd()}
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
        padding: 10,
        marginTop: 10
        
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '80%'
    }
})