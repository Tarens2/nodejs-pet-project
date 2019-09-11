// insert new users for test
import { User } from '../entity/User';

export const createUsers = async (connection) => {
  await connection.manager.save(
    connection.manager.create(User, {
      firstName: 'Timber',
      lastName: 'Saw',
      age: 27,
    }),
  );

  await connection.manager.save(
    connection.manager.create(User, {
      firstName: 'Phantom',
      lastName: 'Assassin',
      age: 24,
    }),
  );
};
