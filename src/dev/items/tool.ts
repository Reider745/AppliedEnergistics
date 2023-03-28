let cutting_knifes: number[] = [];
function registerTools(texture, name, material: ToolMaterial, recipes_items: {material: number}){
    let tools: [string, string[]][] = [["sword", [
        " m ",
        " m ",
        " s "
    ]], ["axe", [
        "mm ",
        "ms ",
        " s"
    ]], ["pickaxe", [
        "mmm",
        " s ",
        " s "
    ]], ["shovel", [
        " m ",
        " s ",
        " s "
    ]], ["hoe", [
        "mm ",
        " s ",
        " s "
    ]]];
    ItemRegistry.addToolMaterial(name, material);
    const translate = Translation.translate(name);
    for(let i in tools){
        let tool = tools[i];
        ItemRegistry.createTool("ae_"+texture+"_"+tool[0], {
            name: name+" "+tool[0],
            icon: texture+"_"+tool[0],
            inCreative: true,
            material: name,
        }, ToolType[tool[0].toUpperCase()]);
        Translation.addTranslation(name+" "+tool[0], {
            ru: translate + " " + Translation.translate(tool[0])
        });
        Item.addCreativeGroup(name, name, [ItemID["ae_"+texture+"_"+tool[0]]]);
        Recipes.addShaped({id: ItemID["ae_"+texture+"_"+tool[0]], count: 1, data: 0}, tool[1], ["m", recipes_items.material, 0, "s", VanillaItemID.stick, 0])
    }
    let item = ItemRegistry.createItem("ae_"+texture+"_cutting_knife", {
        name: name + " cutting knife",
        icon: texture+"_cutting_knife",
        inCreative: true
    });
    item.setMaxStack(1);
    item.setMaxDamage(28);
    item.setCategory(ItemCategory.EQUIPMENT);

    Translation.addTranslation(name + " cutting knife", {
        ru: translate + " режущий нож"
    });
    cutting_knifes.push(item.id);
    Item.addCreativeGroup(name, name, [item.id]);
    Recipes.addShaped({id: item.id, count: 1, data: 0}, [
        "  s",
        "is ",
        "mm "
    ], ["s", VanillaItemID.stick, 0, "i", VanillaItemID.iron_ingot, 0, "m", recipes_items.material, 0]);
}

Translation.addTranslation("sword", {
    ru: "меч"
});

Translation.addTranslation("axe", {
    ru: "топор"
});

Translation.addTranslation("pickaxe", {
    ru: "кирка"
});

Translation.addTranslation("shovel", {
    ru: "лопата"
});

Translation.addTranslation("hoe", {
    ru: "мотыга"
});

Translation.addTranslation("Certus quartz", {
    ru: "Кварц цертус"
});

Translation.addTranslation("Nether quartz", {
    ru: "Кварц"
});

registerTools("certus_quartz", "Certus quartz", {
    level: 2,
    efficiency: 4,
    durability: 132,
    damage: 4
}, {material: ItemID.ae_quartz});
registerTools("nether_quartz", "Nether quartz", {
    level: 3,
    efficiency: 5,
    durability: 152,
    damage: 4
}, {material: VanillaItemID.quartz});