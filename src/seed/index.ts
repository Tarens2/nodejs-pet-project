import { createUsers } from './users';
import { WITH_SEEDS } from "../config";

export default async function withSeeds(connection) {
    if (WITH_SEEDS) {
        await createUsers(connection)
    }
}