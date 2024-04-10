
const Tea = require('../model/Tea');
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

function deleteItem(id) {
    const itemIndex = items.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        items.splice(itemIndex, 1);
        return true;
    }
    return false;
}

module.exports = { createItem, getAllItems, getItemById, updateItem, deleteItem };
