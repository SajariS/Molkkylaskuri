import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import SQLiteService from "../services/SQLiteService";
import { FlatList, StyleSheet, View } from "react-native";
import { ListItem } from "@rneui/base";

export default function GameListScreen({ navigation }) {

    const isFocused = useIsFocused();
    const [gameList, setGameList] = useState([]);

    useEffect(() => {
        SQLiteService.fetchTable('game')
        .then(data => console.log(data))

    }, [isFocused])

    renderItem = ({ item }) => {
        <ListItem bottomDivider
            onPress={() => console.log('TODO')}
        >
            <ListItem.Content>
                <ListItem.Title>{item.title}</ListItem.Title>
            </ListItem.Content>
        </ListItem>
    }

    return(
        <View style={styles.container}>
            <FlatList
                style={styles.list}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderItem}
                data={{gameList}}
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
  });