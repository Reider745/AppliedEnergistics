ItemRegistry.createItem("ae_material_calculation_processor_print", {
    name: "Calculation processor print",
    icon: "material_calculation_processor_print"
});

ItemRegistry.createItem("ae_material_calculation_processor", {
    name: "Calculation processor",
    icon: "material_calculation_processor"
});

ItemRegistry.createItem("ae_material_engineering_processor_print", {
    name: "Engineering processor print",
    icon: "material_engineering_processor_print"
});

ItemRegistry.createItem("ae_material_engineering_processor", {
    name: "Engineering processor",
    icon: "material_engineering_processor"
});

ItemRegistry.createItem("ae_material_logic_processor_print", {
    name: "Logic processor",
    icon: "material_logic_processor_print"
});

ItemRegistry.createItem("ae_material_logic_processor", {
    name: "Logic processor",
    icon: "material_logic_processor"
});

ItemRegistry.createItem("ae_material_silicon_print", {
    name: "Silicon print",
    icon: "material_silicon_print"
});

Item.addCreativeGroup("Processor", "Processor", [
    ItemID.ae_material_calculation_processor_print,
    ItemID.ae_material_calculation_processor,

    ItemID.ae_material_engineering_processor_print,
    ItemID.ae_material_engineering_processor,

    ItemID.ae_material_logic_processor_print,
    ItemID.ae_material_logic_processor,

    ItemID.ae_material_silicon_print
]);