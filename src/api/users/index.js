import UsersHandler from './handler.js';
import UsersService from '../../services/UsersService.js';
import userRoutes from './routes.js';

export default {
  name: 'users',
  version: '1.0.0',
  register: async (server) => {
    const usersService = new UsersService();
    const usersHandler = new UsersHandler(usersService);
    server.route(userRoutes(usersHandler));
  },
};