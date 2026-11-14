import { db } from "./db.mjs";
import {
  DeleteCommand,
  GetCommand,
  UpdateCommand,
  QueryCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "node:crypto";
import createError from "http-errors";

// deleteMatch
export const deleteMatch = async (tournamentId, matchId) => {
  try {
    const command = new DeleteCommand({
      TableName: "cupify-matches",
      Key: {
        tournamentId: tournamentId,
        id: matchId,
      },
    });
    await db.send(command);
    return true;
  } catch (error) {
    console.log("Error deleting match:", error);
    throw createError(500, error.message || "Error deleting match");
  }
};

// getMatchById
export const getMatchById = async (tournamentId, matchId) => {
  try {
    const command = new GetCommand({
      TableName: "cupify-matches",
      Key: {
        tournamentId: tournamentId,
        id: matchId,
      },
    });
    const { Item } = await db.send(command);
    return Item;
  } catch (error) {
    console.log("Error getting match by ID:", error);
    throw createError(500, error.message || "Error getting match by ID");
  }
};

// updateMatchResult
export const updateMatchResult = async (
  tournamentId,
  matchId,
  homeScore,
  awayScore,
) => {
  try {
    const command = new UpdateCommand({
      TableName: "cupify-matches",
      Key: {
        tournamentId: tournamentId,
        id: matchId,
      },
      UpdateExpression:
        "SET homeScore = :homeScore, awayScore = :awayScore, #status = :completed",
      ConditionExpression: "#status = :scheduled",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: {
        ":homeScore": homeScore,
        ":awayScore": awayScore,
        ":completed": "completed",
        ":scheduled": "scheduled",
      },
      ReturnValues: "ALL_NEW",
    });
    const { Attributes } = await db.send(command);
    return Attributes;
  } catch (error) {
    if (error.name === "ConditionalCheckFailedException") {
      throw createError(
        409,
        "Result is already set or match is not in scheduled status",
      );
    }
    console.log("Error updating match result:", error);
    throw createError(500, error.message || "Error updating match result");
  }
};

// getMatchesByTournamentId
export const getMatchesByTournamentId = async (tournamentId) => {
  try {
    const params = {
      TableName: "cupify-matches",
      KeyConditionExpression: "tournamentId = :tournamentId",
      ExpressionAttributeValues: {
        ":tournamentId": tournamentId,
      },
    };

    const matches = [];
    let lastKey;

    // DynamoDB Query can return multiple pages of results.
    do {
        const { Items, LastEvaluatedKey } = await db.send(
            new QueryCommand({
                ...params,
                ...(lastKey && { ExclusiveStartKey: lastKey }),
            })
        );

        matches.push(...(Items ?? []));
        // Continue from the last evaluated key until all pages are retrieved.
        lastKey = LastEvaluatedKey;
    } while (lastKey);

    return matches;

  } catch (error) {
    console.log("Error getting matches by tournament ID:", error);
    throw createError(500, "Error getting matches");
  }
};

export const createMatch = async (
  tournamentId,
  homeTeamId,
  awayTeamId,
  date,
) => {
  const match = {
    id: randomUUID(),
    tournamentId,
    homeTeamId,
    awayTeamId,
    date,
    status: "scheduled",
    homeScore: null,
    awayScore: null,
  };

  await db.send(
    new PutCommand({
      TableName: "cupify-matches",
      Item: match,
    }),
  );

  return match;
};

// updateMatch
export const updateMatch = async (
  tournamentId,
  matchId,
  homeTeamId,
  awayTeamId,
  date
) => {
  try {
    const command = new UpdateCommand({
      TableName: "cupify-matches",

      Key: {
        tournamentId,
        id: matchId,
      },

      UpdateExpression:
        "SET homeTeamId = :homeTeamId, awayTeamId = :awayTeamId, #date = :date",

      ConditionExpression:
        "attribute_exists(id) AND #status = :scheduled",

      ExpressionAttributeNames: {
        "#status": "status",
        "#date": "date",
      },

      ExpressionAttributeValues: {
        ":homeTeamId": homeTeamId,
        ":awayTeamId": awayTeamId,
        ":date": date,
        ":scheduled": "scheduled",
      },

      ReturnValues: "ALL_NEW",
    });

    const { Attributes } = await db.send(command);

    return Attributes;

  } catch (error) {
    if (error.name === "ConditionalCheckFailedException") {
      throw createError(409, "Match is no longer scheduled or does not exist");
    }

    console.log("Error updating match:", error);
    throw createError(500, "Error updating match");
  }
};
