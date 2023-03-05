const BLOCK_TYPE_STONE = Block.createSpecialType({
    solid: false,
    renderlayer: 3,
    destroytime: 1.5,
    explosionres: 30,
    translucency: 0,
    rendertype: 0,
    lightopacity: 15,
    base: 1,renderallfaces: true 
});
const BLOCK_TYPE_CONTROLLER = Block.createSpecialType({
    solid: true,
    renderlayer: 3,
    destroytime: 1.5,
    explosionres: 30,
    translucency: 0,
    rendertype: 0,
    lightopacity: 15,
    lightlevel: 3,
    base: 1
});
const BLOCK_TYPE_CABLE = Block.createSpecialType({
    solid: false,
    renderlayer: 1,
    destroytime: 1.5,
    explosionres: 30,
    translucency: 0,
    rendertype: 0,
    lightopacity: 0,
    base: 20,
    sound: "glass"
});
