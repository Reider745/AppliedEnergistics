function registerTools(texture, name, material: ToolMaterial){
    let tools = ["axe", "hoe", "pickaxe", "sword", "shovel"];
    ItemRegistry.addToolMaterial(name, material);
    for(let i in tools){
        let tool = tools[i];
        ItemRegistry.createTool("ae_"+texture+"_"+tool, {
            name: name+" "+tool,
            icon: texture+"_"+tool,
            inCreative: true,
            material: name,
        }, ToolType[tool.toUpperCase()]);
        Item.addCreativeGroup(name, name, [ItemID["ae_"+texture+"_"+tool]]);
    }
}
registerTools("certus_quartz", "Certus quartz", {
    level: 2,
    efficiency: 4,
    durability: 132,
    damage: 4
});
registerTools("nether_quartz", "Nether quartz", {
    level: 3,
    efficiency: 5,
    durability: 152,
    damage: 4
});