function registerDecorsBlock(texture, name){
    let block_base = new BlockBase("ae_"+texture);
    block_base.addVariation(name, [[texture, 0]], true);
    BlockRegistry.registerBlock(block_base);
    JsonFacade.push({id: "BlockID.ae_"+texture});

    BlockRegistry.createSlabs("ae_"+texture+"_slab", "ae_"+texture+"_double_slab", [
        {name: name, texture: [[texture, 0]], inCreative: true}
    ])
    Recipes.addShaped({id: BlockID["ae_"+texture+"_slab"], count: 6, data: 0}, [
        "   ",
        "aaa",
        "   "
    ], ["a", block_base.id, 0]);

    BlockRegistry.createStairs("ae_"+texture+"_stairs", [
        {name: name, texture: [[texture, 0]], inCreative: true}
    ]);
    Recipes.addShaped({id: BlockID["ae_"+texture+"_stairs"], count: 4, data: 0}, [
        "a  ",
        "aa ",
        "aaa"
    ], ["a", block_base.id, 0]);

    Item.addCreativeGroup(texture, name, [
        block_base.id,
        BlockID["ae_"+texture+"_slab"],
        BlockID["ae_"+texture+"_stairs"]
    ])
}


registerDecorsBlock("fluix_block", "Fluix block");
registerDecorsBlock("sky_stone_block", "Sky stone block");
registerDecorsBlock("sky_stone_brick", "Sky stone brick");
registerDecorsBlock("sky_stone_small_brick", "Sky stone small brick");
registerDecorsBlock("smooth_sky_stone_block", "Smooth sky stone block");

Translation.addTranslation("Fluix block", {
    ru: "Изменчивый блок"
});

Translation.addTranslation("Sky stone block", {
    ru: "Небесный каменный блок"
});

Translation.addTranslation("Sky stone brick", {
    ru: "Небесный каменный кирпич"
});

Translation.addTranslation("Sky stone small brick", {
    ru: "Небесный камень маленький кирпич"
});

Translation.addTranslation("Smooth sky stone block", {
    ru: "Гладкий небесный камень"
});