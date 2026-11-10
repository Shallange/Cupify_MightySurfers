export const handler = async (event) => {
    const tournamentId = event.pathParameters.id;

    console.log("Tournament:", tournamentId);

    return {
        statusCode: 200,
        body: JSON.stringify([])
    };
};