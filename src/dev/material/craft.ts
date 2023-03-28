class PressItem extends ItemCommon {
    constructor(strId: string, name: string, texture: string){
        super(strId, name, texture);
        this.setMaxStack(1);
    }
}

//press
ItemRegistry.registerItem(new PressItem("ae_calculation_processor_press", "Calculation processor press", "material_calculation_processor_press"));
ItemRegistry.registerItem(new PressItem("ae_engineering_processor_press", "Engineering processor press", "material_engineering_processor_press"));
ItemRegistry.registerItem(new PressItem("ae_logic_processor_press", "Logic processor press", "material_logic_processor_press"));
ItemRegistry.registerItem(new PressItem("ae_silicon_press", "Silicon press", "material_silicon_press"));

Translation.addTranslation("Calculation processor press", {
    ru: "Математический пресс"
});

Translation.addTranslation("Engineering processor press", {
    ru: "Инженеренный пресс"
});

Translation.addTranslation("Logic processor press", {
    ru: "Логический пресс"
});

Translation.addTranslation("Silicon press", {
    ru: "Кремневый пресс"
});