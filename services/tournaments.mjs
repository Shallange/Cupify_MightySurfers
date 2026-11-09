import { db } from './db.mjs';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import createError from 'http-errors';

export const getTournamentById = async (id) => { 
    try {
        const command = new GetCommand({ 
            TableName: 'cupify-tournaments', 
            Key : { id : id } 
        }); 
        const { Item } = await db.send(command);
        return Item;
    } catch (error) {
        console.log('ERROR: ', error); 
        throw createError(500, error.message);
    }
}