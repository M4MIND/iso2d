class Screen {
    constructor(core) {
        this._core = core;
        this._width = document.body.clientWidth;
        this._height = document.body.clientHeight;

        document.addEventListener('resize', e => {
            this._width = document.body.clientWidth;
            this._height = document.body.clientHeight;
        });
    }
}

module.exports = Screen;