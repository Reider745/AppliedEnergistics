function createStorage(storages: number[], prefix: string): void{
	for(let i in storages){
		let storage = storages[i];

		/*ItemRegistry.createItem("ae_storage_"+storage, {
			name: "Disk storage "+storage+"k",
			icon: prefix+storage+"k",
			stack: 1
		})*/

		ItemRegistry.createItem("ae_storage_"+storage, {
			name: "Disk storage "+storage+"k",
			icon: prefix+storage+"k",
			stack: 1
		})

		Translation.addTranslation("Disk storage "+storage+"k", {
			ru: "Диск хранения "+storage+"k"
		});

		AppliedEnergistics.registerDrive(ItemID["ae_storage_"+storage], storage*1000)
	}
}
createStorage([1, 4, 16, 64], "storage_cell_");