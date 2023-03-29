function createStorage(storages: number[], prefix: string, texture2: string): void{
	let pre_component: ItemBase = null;
	for(let storage of storages){
		let component = ItemRegistry.createItem("ae_material_cell"+storage+"k_part", {
			name: storage+"k ME Storage Component",
			icon: texture2.replace("{num}", String(storage)),
			category: ItemCategory.ITEMS
		});

		Translation.addTranslation(storage+"k ME Storage Component", {
			ru: storage+"k ME Компонент хранилища"
		});

		let disk = ItemRegistry.createItem("ae_storage_"+storage, {
			name: "Disk storage "+storage+"k",
			icon: prefix+storage+"k",
			stack: 1,
			category: ItemCategory.ITEMS
		})

		Translation.addTranslation("Disk storage "+storage+"k", {
			ru: "Диск хранения "+storage+"k"
		});

		AppliedEnergistics.registerDrive(ItemID["ae_storage_"+storage], storage*1000);

		let arr: [number, number][] = pre_component ? [[ItemID.crystal_seed_certus, 3], [ItemID.ae_quartz, 0], [ItemID.ae_charged_quartz, 0]] : [[1, 0]];
		let mask: string[] = pre_component ? ["rcr","igi","rir"] : ["rqr","qpq","rgr"];
		for(let item of arr)
			Recipes.addShaped({id: component.id, count: 1, data: 0}, mask, ["r", VanillaItemID.redstone, 0, "p", ItemID.ae_material_logic_processor, 0, "q", item[0], item[1], "c", ItemID.ae_material_calculation_processor, 0, "i", pre_component?.id || 1, 0, "g", BlockID.ae_quartz_glass, 0]);
		
		
		Recipes.addShaped({id: disk.id, count: 1, data: 0}, [
			"grg",
			"rcr",
			"iii"
		], ["g", BlockID.ae_quartz_glass, 0, "r", VanillaItemID.redstone, 0, "c", component.id, 0, "i", VanillaItemID.iron_ingot, 0]);
		pre_component = component;
		Item.addCreativeGroup("drive", "Drive", [disk.id, component.id]);
	}
}
createStorage([1, 4, 16, 64], "storage_cell_", "material_cell{num}k_part");