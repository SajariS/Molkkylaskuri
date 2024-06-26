import * as SQLite from 'expo-sqlite/next';
const db = SQLite.openDatabaseSync('molkkyDb');

const SQLiteService = {

    //Alustus    
    initialize: async () => {
        try {
            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS game (
                    id INTEGER PRIMARY KEY NOT NULL,
                    title TEXT,
                    winner TEXT
                );
                
                CREATE TABLE IF NOT EXISTS player (
                    id INTEGER PRIMARY KEY NOT NULL,
                    username TEXT
                );
                
                CREATE TABLE IF NOT EXISTS gameplayer (
                    game_id INTEGER,
                    player_id INTEGER,
                    points INTEGER,
                    strikes INTEGER,
                    PRIMARY KEY (game_id, player_id),
                    FOREIGN KEY (game_id) REFERENCES game(id),
                    FOREIGN KEY (player_id) REFERENCES player(id)
                );

            `);
            console.log('Initialize onnistui!');
        }
        catch (err) {
            console.error('Error initializing db:' + err);
        }

    },

    //Resetointi
    resetDb: async () => {
        try {
            await db.execAsync(`
                DROP TABLE IF EXISTS game;
                DROP TABLE IF EXISTS player;
                DROP TABLE IF EXISTS gameplayer;
            `);
            SQLiteService.initialize();
        }
        catch (err){
            throw new Error("Error reseting DB: " + err);
        }
    },
    
    //Hae kaikki X rivit ja välitä promise saaduilla arvoilla
    fetchGame: async () => {
        try {
            const data = await db.getAllAsync('SELECT * FROM game');
            if (data === null) {
                return([]);
            }
            else {
                return data;
            }
        }
        catch (err) {
            throw new Error(`Error fetching rows from game: ${err}`);
        }
    },

    //Hae peli id:llä
    fetchGameById: async (gameId) => {
        try {
            const data = await db.getFirstAsync('SELECT * FROM game WHERE id = $gameId', {
                $gameId: gameId
            });
            return data;
        }
        catch (err) {
            throw new Error('Error fetching row from game: ' + err)
        }
    },

    //Hae pelaajat
    fetchPlayer: async () => {
        try {
            const data = await db.getAllAsync('SELECT * FROM player');
            if (data === null) {
                return([]);
            }
            else {
                return data;
            }
        }
        catch (err) {
            throw new Error(`Error fetching rows from player: ${err}`);
        }
    },

    //Hae peli - pelaaja yhteydet
    fetchGamePlayer: async () => {
        try {
            const data = await db.getAllAsync('SELECT * FROM gameplayer');
            if (data === null) {
                return([]);
            }
            else {
                return data;
            }
        }
        catch (err) {
            throw new Error(`Error fetching rows from gameplayer: ${err}`);
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
            await db.runAsync('INSERT INTO gameplayer (game_id, player_id, points, strikes) VALUES ($gameId, $playerId, 0, 0)', {
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
            await db.runAsync('DELETE FROM gameplayer WHERE game_id = $gameId AND player_id = $playerId', {
                $gameId: gameId,
                $playerId: playerId
            });
        }
        catch (err) {
            throw new Error('Error removing connection from DB: ' + err);
        }
    },

    //Poista kaikki pelin yhteydet
    removeGameConnection: async (gameId) => {
        try {
            await db.runAsync('DELETE FROM gameplayer WHERE game_id = $gameId', {
                $gameId: gameId
            });
        }
        catch (err) {
            throw new Error('Error removing connection from DB: ' + err);
        }
    },

    //Poista peli
    removeGame: async (gameId) => {
        try {
            await SQLiteService.removeGameConnection(gameId);
            await db.runAsync('DELETE FROM game WHERE id = $gameId', {
                $gameId: gameId
            });
        }
        catch (err) {
            throw new Error('Error removing connection from DB: ' + err);
        }
    },

    //Poista kaikki pelaajan yhteydet
    removePlayerConnection: async (playerId) => {
        try {
            await db.runAsync('DELETE FROM gameplayer WHERE player_id = $playerId', {
                $playerId: playerId
            });
        }
        catch (err) {
            throw new Error('Error removing connection from DB: ' + err);
        }
    },

    //Poista pelaaja
    removePlayer: async (playerId) => {
        try {
            await SQLiteService.removePlayerConnection(playerId);
            await db.runAsync('DELETE FROM player WHERE id = $playerId', {
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
            throw new Error('Error setting points to DB: ' + err);
        }
    },

    //Päivitä ohi lyönnit
    setStrikes: async (gameId, playerId, strikes) => {
        try {
            await db.runAsync('UPDATE gameplayer SET strikes = $strikes WHERE game_id = $gameId AND player_id = $playerId', {
                $gameId: gameId,
                $playerId: playerId,
                $strikes: strikes
            });
        }
        catch (err) {
            throw new Error('Error setting points to DB: ' + err);
        }
    },

    //Päivitä voittaja peliin
    setWinner: async (gameId, username) => {
        try {
            await db.runAsync('UPDATE game SET winner = $winner WHERE id = $gameId', {
                $gameId: gameId,
                $winner: username
            });
        }
        catch (err) {
            throw new Error('Error setting winner: ' + err);
        }
    },

    //Päivitä pelin tila, yhdistää eri tauluja ja palauttaa pelin tilanteen. Hyvä ajaa esim. pisteiden päivitysten yhteydessä
    updateGame: async (id) => {
        try {
            const data = await db.getAllAsync(`
                SELECT game.title, player.*, gameplayer.points, gameplayer.strikes
                FROM game
                JOIN gameplayer ON game.id = gameplayer.game_id
                JOIN player ON gameplayer.player_id = player.id
                WHERE game.id = $gameId
            `, { $gameId: id });
            return data;
        }
        catch (err) {
            throw new Error('Error updating the game: ' + err);
        }
    }, 
}
 
export default SQLiteService; 