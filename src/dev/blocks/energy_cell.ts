function createEnergyCell(texture, start){
	let datas = [];
	for(let i = 0;i < 9;i++)
		datas.push({
			name: "Energy cell "+i,
			texture: [[texture, 0]],
			inCreative: true
		});
	IDRegistry.genBlockID("ae_"+texture);
	Block.createBlock("ae_"+texture, datas, BLOCK_TYPE_STONE);

	class Cell extends AppliedTile {
		defaultValues: {energy: 0};

		public getType(): string {
			return "energy_cell";
		}

		public getStorageMax(): number {
			return start * (this.blockSource.getBlockData(this.x, this.y, this.z)+1);
		}
	}
	
	new Cell(BlockID["ae_"+texture]);
}
createEnergyCell("dense_energy_cell", 100000);
createEnergyCell("energy_cell", 1000);