export const frame = (resources, source, x, y, width, height) => {
    let texture, imageFrame;
    if (typeof source === 'string') {
        if (resources[source]) {
            texture = resources[source].texture;
        }
    } else if (source instanceof Texture) {
        texture = source;
    }
    if (!texture) {
        console.log(`Please load the ${source} texture into the cache`);
    } else {
        texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        imageFrame = new Rectangle(x, y, width, height);
        texture.frame = imageFrame;
        return texture;
    }
};

export const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};