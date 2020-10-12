class Resource {
    constructor() {
        this.collection = new Map();
    }
    add(source) {
        if (!this.collection.has(source.id)) {
            this.collection.set(source.id, source);
        }
        else {
            console.log(new Error(`Resource ${source.id} is isset`));
        }
    }
    addList(list) {
        for (let item of list) {
            this.add(item);
        }
    }

    get(id) {
        return this.collection.get(id);
    }

    values() {
        return this.collection.values();
    }

    keys() {
        return this.collection.keys();
    }

    all() {
        return this.collection;
    }

    load() {
        var promises = [];

        for (let item of this.collection.values()) {
            promises.push(item.load())
        }

        return Promise.all(promises);
    }
}

module.exports = Resource;