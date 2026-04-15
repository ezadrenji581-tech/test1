import fs from 'fs';
import path from 'path';

const LOCAL_DB_PATH = path.resolve('users_local.json');

export const getLocalUsers = () => {
    if (!fs.existsSync(LOCAL_DB_PATH)) {
        fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify([], null, 2));
        return [];
    }
    try {
        const data = fs.readFileSync(LOCAL_DB_PATH, 'utf8');
        return JSON.parse(data || '[]');
    } catch (e) {
        console.error('Error reading local DB:', e);
        return [];
    }
};

export const saveLocalUsers = (users) => {
    try {
        fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(users, null, 2));
    } catch (e) {
        console.error('Error saving local DB:', e);
    }
};

export const findUserByEmail = (email) => {
    const users = getLocalUsers();
    return users.find(u => u.email === email);
};

export const findUserById = (id) => {
    const users = getLocalUsers();
    return users.find(u => u._id === id);
};

export const createUser = (userData) => {
    const users = getLocalUsers();
    const newUser = {
        _id: Date.now().toString(),
        role: 'user',
        createdAt: new Date(),
        ...userData
    };
    users.push(newUser);
    saveLocalUsers(users);
    return newUser;
};

export const updateUser = (id, updates) => {
    const users = getLocalUsers();
    const index = users.findIndex(u => u._id === id);
    if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        saveLocalUsers(users);
        return users[index];
    }
    return null;
};
