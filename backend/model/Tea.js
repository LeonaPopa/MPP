class Tea {
    constructor(id, person, description, levelOfSpicy) {
        this.id = id;
        this.person = person;
        this.description = description;
        this.levelOfSpicy = levelOfSpicy;
    }

    toJSON() {
        return {
            id: this.id,
            person: this.person,
            description: this.description,
            levelOfSpicy: this.levelOfSpicy
        };
    }
}

module.exports = Tea;
