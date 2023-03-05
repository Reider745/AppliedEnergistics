/*IDRegistry.genBlockID("ae_controller");
Block.createBlock("ae_controller", [
	{
		name: "Controller",
		texture: [["ae_controller", 0]],
		inCreative: true
	},
	{
		name: "Controller",
		texture: [["ae_controller_powered", 0]],
		inCreative: true
	}
], BLOCK_TYPE_CONTROLLER);

setBlockLayer(BlockID.ae_controller, 1, [
	[["ae_controller_lights", 0]]
]);

const CHECK_POS = [
	{x: -1, y: 0, z: 0},
	{x: 1, y: 0, z: 0},
	{x: 0, y: -1, z: 0},
	{x: 0, y: 1, z: 0},
	{x: 0, y: 0, z: -1},
	{x: 0, y: 0, z: 1},
];

Block.registerDropFunction("ae_controller", function(){
	return [[BlockID.ae_controller, 1, 0]];
});*/

const CHECK_POS = [
	{x: -1, y: 0, z: 0},
	{x: 1, y: 0, z: 0},
	{x: 0, y: -1, z: 0},
	{x: 0, y: 1, z: 0},
	{x: 0, y: 0, z: -1},
	{x: 0, y: 0, z: 1},
];

interface ControllerCache {
	mechanisms: AppliedTile[],
	cables: any[]
};

class ControllerTile extends TileEntityBase {
	constructor(id: number){
		super();
		TileEntity.registerPrototype(id, this);
		addConnect(id);
	}

	public cache: ControllerCache;
	public energy: number;

	public updateNetwork(x: number, y: number, z: number, tiles?: AppliedTile[], cables?: any[], blocks?: string[]): ControllerCache {
		tiles = tiles || [];
		cables = cables || [];
		blocks = blocks || [];
		for(let i in CHECK_POS){
			let pos = CHECK_POS[i];
			pos = {
				x: pos.x + x,
				y: pos.y + y,
				z: pos.z + z
			};
			if(pos.x == this.x && pos.y == this.y && pos.z == this.z) continue;
			let block = this.blockSource.getBlock(pos.x, pos.y, pos.z);
			if(AppliedEnergistics.isFlag(block.id, "cable")){
				let key = pos.x+":"+pos.y+":"+pos.z;
				let tile = TileEntity.getTileEntity(pos.x, pos.y, pos.z, this.blockSource);
				if(tile) tile.controller = this;
				if(cables.indexOf(key) == -1) cables.push(key);
				else continue
				this.updateNetwork(pos.x, pos.y, pos.z, tiles, cables, blocks);
			}else if(AppliedEnergistics.isFlag(block.id, "block")){
				let key = pos.x+":"+pos.y+":"+pos.z;
				if(blocks.indexOf(key) == -1) blocks.push(key);
				else continue
				
				let tile: any = TileEntity.getTileEntity(pos.x, pos.y, pos.z, this.blockSource);
				if(!tile) tile = TileEntity.addTileEntity(pos.x, pos.y, pos.z, this.blockSource);
				if(!tile) continue;
					
				tile.controller = this;
				tiles.push(tile);
			}else if(block.id == BlockID.ae_controller){
				for(let i in tiles)
				tiles[i].controller = undefined;
				for(let i in cables)
					cables[i].controller = undefined;
					
				return null;
			}
		}
		return {mechanisms: tiles, cables: cables};
	}

	public getStorageEnergy(): number {
		if(!this.cache) return 0;
		let storage = 0;
		for(let i in this.cache.mechanisms){
			let mechanism = this.cache.mechanisms[i];
			if(mechanism.getType() == "energy_cell")
				storage += mechanism.data.energy||0;
		}
		return storage;
	}
	public getStorageEnergyMax(): number{
		if(!this.cache) return 0;
		let storage = 0;
		for(let i in this.cache.mechanisms){
			let mechanism = this.cache.mechanisms[i];
			if(mechanism.getType() == "energy_cell")
				storage += mechanism.getStorageMax();
		}
		return storage;
	}

	public setEnergy(energy: number): number {
		if(!this.cache) return;
		for(let i in this.cache.mechanisms){
			let mechanism = this.cache.mechanisms[i];
			if(mechanism.getType() != "energy_cell") continue;
			if(energy == 0) mechanism.data.energy = 0;
			let max = mechanism.getStorageMax();
			let value = energy - max;
			if(value < 0){
				mechanism.data.energy = energy;
				energy = 0;
			}else{
				mechanism.data.energy = max;
				energy-=max;
			}
		}
		return energy;
	}

	private optimizationArray(array): ItemInstance[]{
		let result = [];
		let items = {};
		for(let i in array){
			let item = array[i];
			if(item.extra){
				result.push(item);
				continue;
			}
			if(items[item.id+":"+item.data])
				items[item.id+":"+item.data].count += item.count;
			else
				items[item.id+":"+item.data] = item;
		}
		for(let key in items)
			result.push(items[key]);
		return result;
	}
	
	public getItems(): ItemInstance[]{
		if(!this.cache) return [];
		let items = [];
		for(let i in this.cache.mechanisms){
			let mechanism = this.cache.mechanisms[i];
			if(mechanism.getType() != "storage") continue;
			pushToArray(items, mechanism.getItems());
		}
		return this.optimizationArray(items);
	}
	
	private mathItems(items, max){
		let count = 0;
		let result = [];
		let not = [];
		for(let i in items){
			let item = items[i];
			if(item.count < 1) continue;
			if(count + item.count <= max){
				count += item.count;
				result.push(item);
			}else if(count <= max){
				let value = max - count;
				count += value;
				result.push({id: item.id, count: value, data: item.data, extra: item.extra});
				item.count -= value;
				not.push(item);
			}else
				not.push(item);
		}
		return {result: result, items: not};
	}
	
	public setItems(items): ItemInstance[] {
		if(!this.cache) return items;
		for(let i in this.cache.mechanisms){
			let mechanism = this.cache.mechanisms[i];
			if(mechanism.getType() != "storage") continue;
			let driver = mechanism.getDrivers();
			for(let a in driver){
				let max = AppliedEnergistics.getDrive(driver[a].item.id);
				if(!max) continue;
				let result = this.mathItems(items, max);
				AppliedEnergistics.setItems(driver[a].item.extra, result.result);
				mechanism.setSlot(driver[a].slot, driver[a].item);
				items = result.items;
			}
		}
		return items;
	}

	public onTick(): void {
		if(World.getThreadTime() % 20 == 0){
			if(this.cache){
				for(let i in this.cache.mechanisms)
					this.cache.mechanisms[i].controller = undefined;
				for(let i in this.cache.cables)
					this.cache.cables[i].controller = undefined;
			}
			this.cache = this.updateNetwork(this.x, this.y, this.z);
			if(this.cache){
				let energy = this.cache.cables.length * 2;
				for(let i in this.cache.mechanisms){
					let mechanism = this.cache.mechanisms[i];
					energy += mechanism.getEnergy();
				}
				this.energy = energy;
			}else{
				this.energy = 0;
			}
			
			let value = this.cache ? this.getStorageEnergy()-this.energy : -1;
			
			if(!this.cache || value < 0)
				this.blockSource.setBlock(this.x, this.y, this.z, this.blockID, 0);
			else{
				this.blockSource.setBlock(this.x, this.y, this.z, this.blockID, 1);
				this.setEnergy(value);
			}
		}
	}

	public destroyBlock(coords: Callback.ItemUseCoordinates, player: number): void {
		let arr = this.updateNetwork(this.x, this.y, this.z);
		if(!arr) return;
		for(let i in arr.mechanisms)
			arr.mechanisms[i].controller = undefined;
		for(let i in arr.cables)
			arr[i].controller = undefined;
	}

	public onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
		Debug.m(this.getStorageEnergy() +"/"+this.getStorageEnergyMax());
		Debug.m(this.energy);
		Debug.m(this.getItems());
		return false;
	}
}

class AppliedTile extends TileEntityBase {
	constructor(id){
		super();
		this.register(id);
		addConnect(id);
		AppliedEnergistics.setFlag(id, "block");
		TileEntity.registerPrototype(id, this);
	}

	public controller: Nullable<ControllerTile>;

	public register(id: number): void {

	}

	public getType(): string {
		return "block";
	}

	public getStorageMax(): number {
		return 0;
	}

	public getEnergy(): number {
		return 0;
	}

	public getItems(): ItemInstance[] {
		return [];
	}

	public getDrivers(): {slot: string, item: ItemInstance}[] {
		return [];
	}

	public setSlot(name: string, item: ItemInstance): void {

	}

	public getScreenName(player: number, coords: Callback.ItemUseCoordinates): string {
		return "main";
	}

	public getScreenByName(screenName: string): UI.IWindow{
        return null;
    }
}

class ControllerBlock extends BlockBase {
	constructor(strId: string, blockType: string | BlockType, name: string, disable: [string, number][], enable: [string, number][], layer: [string, number][][]){
		super(strId, blockType);
		this.addVariation(name, disable, true);
		this.addVariation(name, enable, true);
		setBlockLayer(this.id, 1, layer);
		new ControllerTile(this.id);
	}

	getDrop(coords: Vector, block: Tile, level: number, enchant: ToolAPI.EnchantData, item: ItemStack, region: BlockSource): ItemInstanceArray[] {
		return [[this.id, 1, 0]];
	}
}

BlockRegistry.registerBlock(new ControllerBlock("ae_controller", BLOCK_TYPE_CONTROLLER, "Controller", [["ae_controller", 0]], [["ae_controller_powered", 0]],  [
	[["ae_controller_lights", 0]]
]));