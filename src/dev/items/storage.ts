function createStorage(storages: number[], prefix: string): void{
	for(let i in storages){
		let storage = storages[i];
		IDRegistry.genItemID("ae_storage_"+storage); 
		Item.createItem("ae_storage_"+storage, "Disk storage "+storage+"k", {name: prefix+storage+"k", meta: 0}, {stack: 1, isTech: true});
		Translation.addTranslation("Disk storage "+storage+"k", {
			ru: "Диск хранения "+storage+"k"
		});

		AppliedEnergistics.registerDrive(ItemID["ae_storage_"+storage], storage*1000)
	}
}
createStorage([1, 4, 16, 64], "storage_cell_");