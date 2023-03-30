class EnergyCellTile extends AppliedTile {
	static cells: {[id: number]: [number, number]} = {};

	defaultValues: {energy: 0};

	constructor(id: number, storage_max: number, data_max: number){
		super(id);
		EnergyCellTile.cells[id] = [storage_max, data_max];
	}

	public getType(): string {
		return "energy_cell";
	}

	public getStorageMax(): number {
		return EnergyCellTile.cells[this.blockID][0];
	}

	public onTick(): void {
		let info = EnergyCellTile.cells[this.blockID];
		this.blockSource.setBlock(this.x, this.y, this.z, this.blockID, Math.floor((this.data.energy||0)/info[0]*info[1]));
	}
}

class EnergyCellBlock extends BlockBase {
	constructor(texture: string, storage_max: number, data_max: number){
		super("ae_"+texture, BLOCK_TYPE_STONE);
		for(let i = 0;i <= data_max;i++)
			this.addVariation("Energy cell", [[texture, i]], i == 0);
		new EnergyCellTile(this.id, storage_max, data_max)
	}

	public getDrop(coords: Vector, block: Tile, level: number, enchant: ToolAPI.EnchantData, item: ItemStack, region: BlockSource): ItemInstanceArray[] {
		return [[this.id, 1, 0]];
	}
}

BlockRegistry.registerBlock(new EnergyCellBlock("energy_cell", 200000, 8));
BlockRegistry.registerBlock(new EnergyCellBlock("dense_energy_cell", 1600000, 8));