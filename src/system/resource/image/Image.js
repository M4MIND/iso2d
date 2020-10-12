class _Image {
    constructor(url) {
        this.id = url;
        this.image = new Image();
        this.image.src = this.id;
    }
    load() {
        return new Promise((resolve, reject) => {
            this.image.onload = () => {
                resolve(this);
            }

            this.image.onerror = () => {
                console.log(new Error(`Failed to load the resource -> {${this.id}}`));
                reject(this);
            }
        })
    }
}

module.exports = _Image;