const cron = require('node-cron');
const Tea = require('../model/Tea');
const io = require('../src/index').io;

let items = [];
let currentId = 0;

function createItem(data) {
    const newItem = new Tea(++currentId, data.person, data.description, data.levelOfSpicy);
    items.push(newItem);
    return newItem.toJSON();
}

function getAllItems() {
    return items.map(item => item.toJSON());
}

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}


function createEntity(){
    const newItem = new Tea(++currentId, generateRandomString(10), generateRandomString(50), Math.random()%1000000000);
    items.push(newItem);
    return newItem;
}

function getItemById(id) {
    const item = items.find(item => item.id === id);
    return item ? item.toJSON() : null;
}

function updateItem(id, data) {
    const itemIndex = items.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        items[itemIndex].person = data.person || items[itemIndex].person;
        items[itemIndex].description = data.description || items[itemIndex].description;
        items[itemIndex].levelOfSpicy = data.levelOfSpicy || items[itemIndex].levelOfSpicy;
        return items[itemIndex].toJSON();
    }
    return null;
}
cron.schedule('*/10 * * * * *', function() {
    const newItem = createEntity();
    io.emit('New Entity', newItem);
});

function deleteItem(id) {
    const itemIndex = items.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        items.splice(itemIndex, 1);
        return true;
    }
    return false;
}

module.exports = { createItem, getAllItems, getItemById, updateItem, deleteItem };
