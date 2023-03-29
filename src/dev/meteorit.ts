ItemGeneration.newGenerator("ae_meteorit");
ItemGeneration.addItem("ae_meteorit", ItemID.ae_calculation_processor_press, .5, {min: 1, max: 1});
ItemGeneration.addItem("ae_meteorit", ItemID.ae_engineering_processor_press, .5, {min: 1, max: 1});
ItemGeneration.addItem("ae_meteorit", ItemID.ae_logic_processor_press, .5, {min: 1, max: 1});
ItemGeneration.addItem("ae_meteorit", ItemID.ae_silicon_press, .5, {min: 1, max: 1});
ItemGeneration.registerRecipeViewer("ae_meteorit", "Meteorit");

StructurePiece.register(StructurePiece.getDefault({
    chance: 800,
    name: "meteorit",
    checkName: true,
    structure: new Structure.advanced().setProt({
        after(x, y, z, region, packet) {
            let Random: java.util.Random = packet.random
            let radius = Random.nextInt(6)+3;
            StructureUtility.generateShapeOptimization(region, null, x, y, z, radius * radius, 0, 0);
            StructureUtility.generateShapeOptimization(region, null, x, y, z, radius, BlockID.ae_sky_stone_block, 0);
            region.setBlock(x, y, z, 54, 0);
            ItemGeneration.fill("ae_meteorit", x, y, z, Random, region);
        }
    })
}));