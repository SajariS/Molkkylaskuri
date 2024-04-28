import SQLiteService from "./SQLiteService"

const GameService = {

    handleTurn: async (playerData, gameId, points) => {

        try {
            const newPoints = Number.parseInt(playerData.points) + Number.parseInt(points);

            if(points === 0) {
                const newStrikes = Number.parseInt(playerData.strikes) + 1;
                await SQLiteService.setStrikes(gameId, playerData.id, newStrikes);
                return(0);
            }
            else {

                if(playerData.strikes !== 0) {
                    await SQLiteService.setStrikes(gameId, playerData.id, 0);
                }

                if(newPoints <= 50) {
                    await SQLiteService.setPoints(gameId, playerData.id, newPoints)
                    return(newPoints);
                }
                else if(newPoints > 50) {
                    await SQLiteService.setPoints(gameId, playerData.id, 25)
                    return(25);
                }
            }
        }
        catch (err) {
            throw new Error(err);
        }
    }
}

export default GameService;