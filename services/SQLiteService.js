//Käytä Expon SQLite (next) kirjastoa
import * as SQLite from 'expo-sqlite/next';

const db = await SQLite.openDatabaseAsync('molkkyDb');

const SQLiteService = {

    //Alustus
    initialize: async () => {
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS game (
                id INTEGER PRIMARY KEY NOT NULL,
                title TEXT,
            );
            CREATE TABLE IF NOT EXISTS player (
                id INTEGER PRIMARY KEY NOT NULL,
                username TEXT,
            );
            CREATE TABLE IF NOT EXISTS gameplayer (
                game_id INTEGER,
                player_id INTEGER,
                points INTEGER,
                PRIMARY KEY (game_id, player_id),
                FOREIGN KEY (game_id) REFERENCES game(id),
                FOREIGN KEY (player_id) REFENCES player(id)
            );
        `);
    },

    //Hae kaikki X rivit ja välitä promise saaduilla arvoilla
    fetchTable: async (table) => {
        try {
            const data = db.getAllAsync('SELECT * FROM ?', [table]);
            return data;
        }
        catch (err) {
            throw new Error(`Error fetching rows from ${table}: ${err}`);
        }
    },

    //Hae saadulla taululla ja id:llä ensimmäinen kyselyä vastaava rivi
    fetchRowById: async (table, id) => {
        try {
            const data = await db.getFirstAsync('SELECT * FROM ? WHERE id = ?', [table, id]);
            if (data.length > 0) {
                return data;
            }
            else {
                throw new Error('No rows found with id: ' + id);
            }
        }
        catch (err) {
            console.error(err);
            throw new Error('Error fetching data from DB: ' + err);
        }
    },

    //Poista rivi saadusta taulusta id:n perusteella
    removeRowById: async (table, id) => {
        try {
            await db.runAsync('DELETE FROM $table WHERE id = $id', {
                $table: table,
                $id: id
            });
        }
        catch (err) {
            throw new Error('Error removing row from DB: ' + err);
        }
    },

    //Lisää rivi game tauluun
    addGame: async ({ game }) => {
        try {
            await db.runAsync('INSERT INTO game (title) VALUES ($title)', { 
                $title: game.title
            });
        }
        catch (err) {
            throw new Error('Error adding game to DB: ' + err);
        }
    },

    //Lisää pelaaja
    addPlayer: async ({ player }) => {
        try {
            await db.runAsync('INSERT INTO player (username) VALUES ($username)',{
                $username: player.username
            });
        }
        catch (err) {
            throw new Error('Error adding player to DB: ' + err);
        }
    },

    //Lisää yhteys game ja player välille, pisteet aluksi 0
    addConnection: async (gameId, playerId) => {
        try {
            await db.runAsync('INSERT INTO gameplayer (game_id, player_id, points) VALUES ($gameId, $playerId, 0)', {
                $gameId: gameId,
                $playerId: playerId
            });
        }
        catch (err) {
            throw new Error('Error adding connection to DB: ' + err);
        }
    },

    //Poista yhteys game ja player väliltä
    removeConnection: async (gameId, playerId) => {
        try {
            await db.runAsync('DELETE FROM gameplayer WHERE game_id = $gameId AND player_id = $playerId)', {
                $gameId: gameId,
                $playerId: playerId
            });
        }
        catch (err) {
            throw new Error('Error removing connection from DB: ' + err);
        }
    },

    //Päivitä pisteitä, pelin kannalta tärkeä
    setPoints: async (gameId, playerId, points) => {
        try {
            await db.runAsync('UPDATE gameplayer SET points = $points WHERE game_id = $gameId AND player_id = $playerId', {
                $gameId: gameId,
                $playerId: playerId,
                $points: points
            });
        }
        catch (err) {
            throw new Error('Error setting points to DB: ' + err)
        }
    },

    //Päivitä pelin tila, yhdistää eri tauluja ja palauttaa pelin tilanteen. Hyvä ajaa esim. pisteiden päivitysten yhteydessä
    updateGame: async (id) => {
        try {
            const data = await db.getAllAsync(`
                SELECT game.*, player.*, gameplayer.points
                FROM game
                JOIN gameplayer ON game.id = gameplayer.game_id
                JOIN player ON gameplayer.player_id = player.id
                WHERE game.id = $gameId
            `, { $gameId: id });

            if (data.length > 0) {
                return data;
            }
            else {
                throw new Error('No game data found from DB with ID: ' + id);
            }
        }
        catch (err) {
            throw new Error('Error updating the game: ' + err);
        }
    },
}

export default SQLiteService;