import { Button, Text } from "@rneui/themed";
import { StyleSheet, ScrollView, Alert } from "react-native";


export default function SettingsDialog({ handleReset, toggleOverlay }) {

    const handleButtonPress = () => {
        Alert.alert(
            'Tietokannan nollaus',
            'Haluatko varmasti nollata tietokannan? Kaikki pelit ja pelaajat katoavat tietokannasta',
            [
                {text: 'Kyllä', onPress: () => {
                    handleReset();
                    toggleOverlay();
                }},
                {text: 'Ei', onPress: () => {}}
            ]
        )
    }

    return(
        
        <ScrollView style={styles.dialogContainer} contentContainerStyle={styles.scrollContent}>
            <Text h4 h4Style={styles.header4}>Mölkyn säännöt</Text>
                <Text style={styles.subtitle}>Valmistelu</Text>
                <Text>
                    Numeroidut keilat asetetaan tiiviiseen muodostelmaan. 
                    Heittolinja piirretään 3-4 metrin päähän tästä muodostelmasta. 
                    Pelaajat toimivat vuorotellen pisteiden kirjureina (katso ”Pelin loppu”).
                    </Text>
                <Text style={styles.subtitle}>Heitto järjestys</Text>
                <Text>
                    Ensimmäisessä pelissä heittojärjestys arvotaan. 
                    Seuraavissa peleissä heittojärjestys muodostetaan edellisen pelin tulosten perusteella pienimmästä pistemäärästä suurimpaan.
                </Text>
                <Text style={styles.subtitle}>Aloitus</Text>
                <Text>
                    Ensimmäinen pelaaja heittää heittokapulan keilamuodostelmaa kohti ja yrittää kaataa keiloja. 
                    Heittokapula heitetään aina alakautta.
                    </Text>
                <Text style={styles.subtitle}>Pisteiden lasku</Text>
                <Text>
                    Jos yksi keila kaatuu, pisteet = keilaan kirjoitettu numero. 
                    Jos useampi kuin yksi keila kaatuu, pisteet = kaatuneiden keilojen lukumäärä.
                </Text>
                <Text style={styles.subtitle}>Kaatunut keila</Text>
                <Text>
                    Keilaa ei lasketa kaatuneeksi jos se nojaa toista keilaa tai heittokapulaa vasten. 
                    Heiton jälkeen keilat nostetaan takaisin pystyyn siihen paikkaan, mihin ne ovat heiton tuloksenapäätyneet.
                </Text>
                <Text style={styles.subtitle}>Loppu</Text>
                <Text>Jos pelaaja jää ilman tulosta kolmella peräkkäisellä heittokierroksella, hän putoaa pelistä ja toimii pisteiden kirjurina. 
                    Peli päättyy, kun yksi pelaajista saa kerättyä tasan 50 pistettä. 
                    Jos pelaaja saa yli 50 pistettä, hänen pistemääränsä lasketaan 25 pisteeseen.
                </Text>

            <Text h4 h4Style={styles.header4}>Sovelluksen ominaisuudet</Text>
                <Text style={styles.subtitle}>Aloitus</Text>
                <Text>
                    Laskuriin lisätään pelejä painamalla "lisää" painiketta ja antamalla sille nimen. Nimi voi olla esimerkiksi päivämäärä tai joku muu vastaava.
                    Peliin voi lisätä pelaajia "lisää pelaaja" napista, jolloin voit valita muistista tallennetun nimen peliin tai lisätä uuden "käyttäjän" laskuriin syöttämällä nimen kenttään ja painamalla plussaa.
                    Uutta käyttäjää ei valita suoraan peliin vaan se pitää vielä valita listasta. Kun peliin on lisätty haluttu määrä pelaajia, voidaan peli aloittaa(Laskuri ei estä pelaajien lisäämistä missään kohtaa, joten matti myöhäisetkin pääset mukaan pelaamaan)
                </Text>
                <Text style={styles.subtitle}>Pelin kulku</Text>
                <Text>
                    Laskuri ei pidä tarkkaa listaa vuoroista, joten se jää pelaajien vastuulle(Laskurin listaa voi kuitenkin käyttää järjestyksenä). Heiton jälkeen paina heittäneen pelaajan nimen kohdalta. 
                    Tämä avaa ikkunan, jonka kautta pelaajalle voidaan lisätä 0-12 pistettä. Jos pelaaja heittää 0, eli huti laskuri lisää ruksin pelaaja kohdalle listaan, josta näkee kuinka monta sallittua huti heittoa pelaajalla on jäljellä.
                    Kolmannen huti heiton jälkeen, pelaaja tippuu pelistä, eikä hänelle voi enään lisätä pisteitä.
                    Jos pelaaja heittää yli 50 pistettä, hänen pisteensä "nollataan" 25 pisteeseen.
                </Text>
                <Text style={styles.subtitle}>Pelin lopetus</Text>
                <Text>
                    Jos pelaaja saa heitettyä tasan 50 pistettä, merkataan hänet voittajaksi. Voittajana nimi ilmestyy pelin nimen/tunnuksen alle.
                    Vaikka sääntöjen mukaan peli loppuu, kun ensimmäinen pelaaja saa 50 pistettä, laskuri ei estä pelaamista voiton jälkeen.
                </Text>
            <Text h4 h4Style={styles.header4}>Tietokannan resetointi</Text>
                <Text>Nollaamalla tietokannan, poistat kaikki pelaajat ja pelit muistista</Text>
                <Button
                    onPress={() => handleButtonPress()}
                    title="Nollaa laskuri"
                />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    dialogContainer: {
        borderRadius: 8,
        width: 350,
        maxHeight: 600,
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
    },
    subtitle: {
        fontWeight: 'bold',
        fontVariant: 'small-caps',
        textAlign: 'center'
    },
    scrollContent: {
        padding: 10
    },
    header4: {
        textAlign: 'center'
    }
})