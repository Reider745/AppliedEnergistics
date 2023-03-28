class BlockOre extends BlockBase {
    protected drop: number;
    constructor(strId: string, name: string, texture: [string, number], drop: number){
        super(strId);
        this.drop = drop;
        this.addVariation(name, [texture], true);
        this.setBlockMaterial("stone", 3);
    }

    getDrop(coords: Vector, block: Tile, level: number, enchant: ToolAPI.EnchantData, item: ItemStack, region: BlockSource): ItemInstanceArray[] {
        return [[this.drop, Math.floor(Math.random()+2)+1, 0]]
    }
}
class QuartzItem extends ItemCommon {
    constructor(strId: string, name: string, icon: Item.TextureData){
        super(strId, name, icon);
    }
}

ItemRegistry.registerItem(new QuartzItem("ae_quartz", "Quartz", {
    name: "material_certus_quartz_crystal",
    data: 0
}));
ItemRegistry.registerItem(new QuartzItem("ae_charged_quartz", "Charged quartz", {
    name: "material_certus_quartz_crystal_charged",
    data: 0
}));
BlockRegistry.registerBlock(new BlockOre("ae_quartz_ore", "Quartz ore", ["quartz_ore", 0], ItemID.ae_quartz));
BlockRegistry.registerBlock(new BlockOre("ae_charged_quartz_ore", "Charged quartz ore", ["charged_quartz_ore", 0], ItemID.ae_charged_quartz));

Translation.addTranslation("Quartz ore", {
    ru: "Кварцевая руда"
});

Translation.addTranslation("Charged quartz ore", {
    ru: "Заряженная кварцевая руда"
});

Translation.addTranslation("Quartz", {
    ru: "Кварц"
});

Translation.addTranslation("Charged quartz", {
    ru: "Заряженный кварц"
});


Callback.addCallback("GenerateChunk", function(X, Z, random, id, chunkSeed, worldSeed, dimensionSeed){
    for(let i = 0;i < 4;i++)
        if(random.nextFloat() < .8)
            GenerationUtils.generateOre(X*16+random.nextInt(16), 10+random.nextInt(40), Z*16+random.nextInt(16), BlockID.ae_quartz_ore, 0, 4, false, dimensionSeed);
        else
        GenerationUtils.generateOre(X*16+random.nextInt(16), 10+random.nextInt(40), Z*16+random.nextInt(16), BlockID.ae_charged_quartz_ore, 0, 4, false, dimensionSeed);
});