import { ObjectId } from 'mongodb';
import { authTokenDecoded } from '../types/authTokenTypes';
import jwt from 'jsonwebtoken';

const getUserIdFromToken = (authToken: string): ObjectId => {
    const decodedAuthToken = jwt.decode(authToken.split(' ')[1]) as authTokenDecoded;
    return new ObjectId(decodedAuthToken.id as string);
};

export default getUserIdFromToken;
