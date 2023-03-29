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

Recipes.addShaped({id: ItemID.ae_formation_core, count: 2, data: 0}, [
    "abc",
    "",
    ""
], ["a", ItemID.crystal_seed_certus, 0, "b", ItemID.ae_material_fluix_dust, 0, "c", ItemID.ae_material_logic_processor, 0]);

Recipes.addShaped({id: ItemID.ae_display, count: 1, data: 0}, [
    "ab",
    "cd",
    ""
], ["a", ItemID.ae_formation_core, 0, "b", ItemID.ae_display_material, 0, "c", ItemID.ae_material_logic_processor, 0, "d", ItemID.ae_annihilation_core, 0]);

Recipes.addFurnace(BlockID.ae_sky_stone_block, BlockID.ae_smooth_sky_stone_block, 0);


GrindStoneRecipe.add([new ItemStack(ItemID.crystal_seed_fluix, 1, 3)], [new ItemStack(ItemID.ae_material_fluix_dust, 1)])
    .add([new ItemStack(ItemID.ae_quartz, 1)], [new ItemStack(ItemID.ae_material_certus_quartz_dust, 1)])
    .add([new ItemStack(BlockID.ae_quartz_ore, 1)], [new ItemStack(ItemID.ae_material_certus_quartz_dust, 2)])
    .add([new ItemStack(VanillaItemID.quartz, 1)], [new ItemStack(ItemID.ae_material_nether_quartz_dust, 1)]);

RecipeCharged.add([new ItemStack(ItemID.ae_quartz, 1)], [new ItemStack(ItemID.ae_charged_quartz, 1)]);

FluixCryatalRecipe.add([new ItemStack(VanillaItemID.quartz, 1), new ItemStack(VanillaItemID.redstone, 1), new ItemStack(ItemID.ae_charged_quartz, 1)], [new ItemStack(ItemID.ae_material_fluix_crystal, 2)]);
FluixCryatalAI.addItemCheck(ItemID.ae_charged_quartz);