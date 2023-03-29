Recipes.addShapeless({id: BlockID.ae_fluix_block, count: 1, data: 0}, [
    {id: ItemID.crystal_seed_fluix, data: 3}, 
    {id: ItemID.crystal_seed_fluix, data: 3}, 
    {id: ItemID.crystal_seed_fluix, data: 3}, 
    {id: ItemID.crystal_seed_fluix, data: 3}
]);

Recipes.addShaped({id: BlockID.ae_grind_stone_pen, count: 1, data: 0}, [
    "aaa",
    "  a",
    "  a"
], ["a", VanillaBlockID.planks, 0]);

Recipes.addShaped({id: ItemID.ae_wooden_gear, count: 1, data: 0}, [
    " a ",
    "a a",
    " a "
], ["a", VanillaItemID.stick, 0]);

void function(){
    let arr = [[VanillaItemID.quartz, 0], [ItemID.ae_quartz, 0], [ItemID.ae_charged_quartz, 0]];
    for(let id of arr){
        Recipes.addShaped({id: BlockID.ae_grind_stone, count: 1, data: 0}, [
            "aba",
            "cac",
            "dcd"
        ], ["a", VanillaBlockID.stone, 0, "b", ItemID.ae_wooden_gear, 0, "c", id[0], id[1], "d", VanillaBlockID.cobblestone, 0]);

        Recipes.addShaped({id: ItemID.ae_formation_core, count: 2, data: 0}, [
            "abc",
            "",
            ""
        ], ["a", id[0], id[1], "b", ItemID.ae_material_fluix_dust, 0, "c", ItemID.ae_material_logic_processor, 0]);
    }
}();

void function(){
    let arr = [[VanillaItemID.quartz, 0], [ItemID.crystal_seed_nether, 3]];
    for(let id of arr){
        Recipes.addShaped({id: ItemID.ae_annihilation_core, count: 2, data: 0}, [
            "abc",
            "",
            ""
        ], ["a", id[0], id[1], "b", ItemID.ae_material_fluix_dust, 0, "c", ItemID.ae_material_logic_processor, 0]);
    }
}();

Recipes.addShaped({id: BlockID.ae_smooth_sky_stone_block, count: 1, data: 0}, [
    "a",
    "",
    ""
], ["a", BlockID.ae_sky_stone_small_brick, 0]);

Recipes.addShaped({id: BlockID.ae_sky_stone_small_brick, count: 1, data: 0}, [
    "a",
    "",
    ""
], ["a", BlockID.ae_sky_stone_brick, 0]);

Recipes.addShaped({id: BlockID.ae_sky_stone_brick, count: 1, data: 0}, [
    "a",
    "",
    ""
], ["a", BlockID.ae_smooth_sky_stone_block, 0]);

Recipes.addShaped({id: ItemID.ae_display_material, count: 3, data: 0}, [
    " gi",
    "xyi",
    " gi"
], ["x", VanillaItemID.iron_ingot, 0, "g", VanillaItemID.glowstone_dust, 0, "y", VanillaItemID.redstone, 0, "i", BlockID.ae_quartz_glass, 0]);

Recipes.addShaped({id: ItemID.ae_display, count: 1, data: 0}, [
    "ab",
    "cd",
    ""
], ["a", ItemID.ae_formation_core, 0, "b", ItemID.ae_display_material, 0, "c", ItemID.ae_material_logic_processor, 0, "d", ItemID.ae_annihilation_core, 0]);

Recipes.addFurnace(BlockID.ae_sky_stone_block, BlockID.ae_smooth_sky_stone_block, 0);
Recipes.addFurnace(ItemID.ae_material_nether_quartz_dust, ItemID.ae_silicon, 0);
Recipes.addFurnace(ItemID.ae_material_certus_quartz_dust, ItemID.ae_silicon, 0);

Recipes.addShaped({id: BlockID.ae_controller, count: 1, data: 0}, [
    "sas",
    "aba",
    "sas"
], ["a", ItemID.crystal_seed_fluix, 3, "s", BlockID.ae_smooth_sky_stone_block, 0, "b", ItemID.ae_material_engineering_processor, 0]);

Recipes.addShaped({id: ItemID.crystal_seed_certus, count: 2, data: 0}, [
    "ab",
    "",
    ""
], ["a", VanillaBlockID.sand, -1, "b", ItemID.ae_material_certus_quartz_dust, 0]);

Recipes.addShaped({id: ItemID.crystal_seed_nether, count: 2, data: 0}, [
    "ab",
    "",
    ""
], ["a", VanillaBlockID.sand, -1, "b", ItemID.ae_material_nether_quartz_dust, 0]);

Recipes.addShaped({id: ItemID.crystal_seed_fluix, count: 2, data: 0}, [
    "ab",
    "",
    ""
], ["a", VanillaBlockID.sand, -1, "b", ItemID.ae_material_fluix_dust, 0]);

void function(){
    let arr = [[ItemID.ae_material_fluix_crystal, 0], [ItemID.crystal_seed_fluix, 3]];
    for(let id of arr){
        Recipes.addShaped({id: BlockID.ae_charged, count: 1, data: 0}, [
            "aca",
            "a  ",
            "aca"
        ], ["a", VanillaItemID.iron_ingot, 0, "c", id[0], id[1]]);
        Recipes.addShaped({id: BlockID.ae_network_cable, count: 4, data: DATA_CABLE_DEFAULT}, [
            "ab",
            "b",
            ""
        ], ["a", ItemID.ae_quartz, 0, "b", id[0], id[1]]);
        Recipes.addShaped({id: BlockID.ae_energy_acceptor, count: 1, data: 0}, [
            "igi",
            "gcg",
            "igi"
        ], ["i", VanillaItemID.iron_ingot, 0, "c", id[0], id[1], "g", BlockID.ae_quartz_glass, 0])
        Recipes.addShaped({id: BlockID.ae_carver, count: 1, data: 0}, [
            "ipi",
            "c i",
            "ipi"
        ], ["i", VanillaItemID.iron_ingot, 0, "c", id[0], id[1], "p", VanillaBlockID.sticky_piston, 0]);
    }
}();

void function(){
    let arr = [ItemID.ae_material_certus_quartz_dust, ItemID.ae_material_nether_quartz_dust];
    for(let id of arr)
        Recipes.addShaped({id: BlockID.ae_quartz_glass, count: 4, data: 0}, [
            "dgd",
            "gdg",
            "dgd"
        ], ["d", id, 0, "g", VanillaBlockID.glass, 0]);
}();

Recipes.addShaped({id: BlockID.ae_drive, count: 1, data: 0}, [
    "iei",
    "c c",
    "iei"
], ["i", VanillaItemID.iron_ingot, 0, "e", ItemID.ae_material_engineering_processor, 0, "c", BlockID.ae_network_cable, -1]);


Recipes.addShaped({id: ItemID.ae_bus_export, count: 1, data: 0}, [
    "",
    " c",
    "ipi"
], ["i", VanillaItemID.iron_ingot, 0, "c", ItemID.ae_annihilation_core, 0, "p", VanillaBlockID.sticky_piston, 0]);

Recipes.addShaped({id: ItemID.ae_bus_import, count: 1, data: 0}, [
    "",
    "ici",
    " p "
], ["i", VanillaItemID.iron_ingot, 0, "c", ItemID.ae_formation_core, 0, "p", VanillaBlockID.piston, 0]);

GrindStoneRecipe.add([new ItemStack(ItemID.crystal_seed_fluix, 1, 3)], [ItemID.ae_material_fluix_dust])
    .add([ItemID.ae_material_fluix_crystal], [ItemID.ae_material_fluix_dust])
    .add([ItemID.ae_quartz], [ItemID.ae_material_certus_quartz_dust])
    .add([BlockID.ae_quartz_ore], [new ItemStack(ItemID.ae_material_certus_quartz_dust, 2)])
    .add([VanillaItemID.quartz], [ItemID.ae_material_nether_quartz_dust]);

RecipeCharged.add([new ItemStack(ItemID.ae_quartz, 1)], [new ItemStack(ItemID.ae_charged_quartz, 1)]);

RecipeCarver.add([ItemID.ae_material_engineering_processor_print, VanillaItemID.redstone, ItemID.ae_material_silicon_print], [ItemID.ae_material_engineering_processor])
    .add([Processor.Silicon, ItemID.ae_silicon, 0], [ItemID.ae_material_silicon_print,])
    .add([Processor.Engineering, VanillaItemID.diamond, 0], [ItemID.ae_material_engineering_processor_print])
    .add([ItemID.ae_material_logic_processor_print, VanillaItemID.redstone, ItemID.ae_material_silicon_print], [ItemID.ae_material_logic_processor])
    .add([Processor.Logic, VanillaItemID.gold_ingot, 0], [ItemID.ae_material_logic_processor_print])
    .add([Processor.Calculation, new ItemStack(ItemID.crystal_seed_certus, 1, 3), 0], [ItemID.ae_material_calculation_processor_print])
    .add([ItemID.ae_material_calculation_processor_print, VanillaItemID.redstone, ItemID.ae_material_silicon_print], [ItemID.ae_material_calculation_processor]);

FluixCryatalRecipe.add([VanillaItemID.quartz, VanillaItemID.redstone, ItemID.ae_charged_quartz], [new ItemStack(ItemID.ae_material_fluix_crystal, 2)]);
FluixCryatalAI.addItemCheck(ItemID.ae_charged_quartz);