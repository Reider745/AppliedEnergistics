ItemRegistry.createItem("ae_material_certus_quartz_dust", {
    name: "Certus quartz dust",
    icon: "material_certus_quartz_dust"
});

ItemRegistry.createItem("ae_material_fluix_dust", {
    name: "Fluix dust",
    icon: "material_fluix_dust"
});

ItemRegistry.createItem("ae_material_nether_quartz_dust", {
    name: "Nether quartz dust",
    icon: "material_nether_quartz_dust"
});

Item.addCreativeGroup("dust", "Dust", [
    ItemID.ae_material_certus_quartz_dust,
    ItemID.ae_material_fluix_dust,
    ItemID.ae_material_nether_quartz_dust
]);