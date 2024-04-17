class Review {
    constructor(id, teaId, title, content) {
        this.id = id;
        this.teaId = teaId;
        this.title = title;
        this.content = content;
    }

    toJSON() {
        return {
            id: this.id,
            teaId: this.teaId,
            title: this.title,
            content: this.content
        };
    }
}

module.exports = Review;