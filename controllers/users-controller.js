import * as dao from '../users/users-dao.js';

let currentUser = null;

const UsersController = app => {
    const createUser = async (req, res) => {
        const user = req.body
        const actualUser = await dao.createUser(user)
        res.json(actualUser)
    };
    const register = async (req, res) => {
        const user = req.body;
        const existingUser = await dao.findUserByUsername(user.email);
        if (existingUser) {  // email not unique -> already existing
            res.sendStatus(403);  // TODO: handle 403 in client!
            return;
        } else {
            const currentUser = await dao.createUser(user);
            req.session['currentUser'] = currentUser;
            res.json(currentUser);
        }
    };
    const findAllUsers = async (req, res) => {
        const users = await dao.findAllUsers();
        res.json(users);
    };
    const deleteUser = async (req, res) => {
        const uid = req.params.uid;
        const status = await dao.deleteUser(uid);
        res.json(status);
    };
    const updateUser = async (req, res) => {
        const uid = req.params.uid;
        const updates = req.body;
        const status = await dao.updateUser(uid, updates);
        res.json(status);
    };
    const login = async (req, res) => {
        const credentials = req.body;
        const existingUser = await dao.findByCredentials(credentials);
        if (existingUser) {
            req.session['currentUser'] = existingUser;
            res.json(existingUser);
            return;
        } else {  // TODO: handle 403 in client!
            res.sendStatus(403);
        }
    };
    const profile = async (req, res) => {
        if (currentUser) {
            res.json(currentUser);
            return;
        } else {
            res.sendStatus(403);
        }
    };
    const logout = (req, res) => {
        currentUser = null;
        res.sendStatus(200);
    };

    app.post('/users', createUser);
    app.post('/register', register)
    app.get('/users', findAllUsers);
    app.delete('/users/:uid', deleteUser);
    app.put('/users/:uid', updateUser);
    app.post('/login', login);
    app.post('/profile', profile);
    app.post('/logout', logout);
};
export default UsersController;