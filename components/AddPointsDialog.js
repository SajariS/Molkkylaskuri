import { Button, Slider, Text, Icon } from "@rneui/themed"
import { useState } from "react"
import { StyleSheet, View } from "react-native"

export default function AddPointsDialog({ handleTurn, toggleOverlay, turn, setTurn}) {

    const [points, setPoints] = useState(6);

    const handleAdd = () => {
        handleTurn(turn, points);
        toggleOverlay();
        setTurn({});
    }

    const handleClose = () => {
        toggleOverlay();
        setTurn({});
    }

    return(
        <View style={styles.dialogContainer}>
            {turn.strikes < 3 && turn.points !== 50 ? 
            <>
                <Text h4>Lisää pisteitä</Text>
                <Text h4>{points}</Text>
                <Slider style={styles.slider}
                    maximumValue={12}
                    minimumValue={0}
                    value={points}
                    onValueChange={setPoints}
                    step={1}
                    thumbProps={{
                        children: (
                            <Icon 
                                name="fingerprint"
                                color="white"
                                size={37}
                            />
                        )
                    }}
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
            </>
            : turn.strikes === 3 ? 
            <>
                <Text h4>Pelaaja on tippunut pelistä!</Text>
                <Button color="red"
                        onPress={() => handleClose()}
                    >
                        <Icon
                            name="close"
                            color="white"
                        />
                    </Button>
            </>
            :
            <>
                <Text h4>Pelaajalla on 50 pistettä!</Text>
                <Button color="red"
                        onPress={() => handleClose()}
                    >
                        <Icon
                            name="close"
                            color="white"
                        />
                    </Button>                
            </>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    dialogContainer: {
        padding: 20,
        borderRadius: 8,
        alignItems: 'center',
        width: 350,
    },
    dialogList: {
       width: 300
    },
    dialogInput: {
        width: 300,
        padding: 10,
        marginTop: 10
        
    },
    slider: {
        width: '100%',
        paddingVertical: 40,
        justifyContent: 'center'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '80%',
        paddingVertical: 15
    }
})