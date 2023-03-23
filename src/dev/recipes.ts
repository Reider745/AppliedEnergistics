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

Recipes.addFurnace(BlockID.ae_sky_stone_block, BlockID.ae_smooth_sky_stone_block, 0);