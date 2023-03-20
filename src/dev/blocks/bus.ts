function funcAddedBus(){
	let tile = funcAddedFacede.apply(this, arguments);
	if(tile)
		tile.tick = CALBLE_TICK;
}
const SIZE_BUS_UI = 64;
let BusUi = new UI.StandardWindow({
	standard: {
		header: {
			text: {
				text: "Bus"
			},
		},
		inventory: {
			standard: true
		},
		background: {
			standard: true
		}
	},
	elements: {
		"mode": {type: "button", x: 60, y: 60, bitmap: "bus_mode_0", scale: SIZE_BUS_UI/24, clicker: {
			onClick(_, container: any){
				container.sendEvent("event", {
					name: "newMode"
				});
			}
		}}
	}
});
const LIST_SLOT = 3;
(function(){
	for(let i = 0;i < LIST_SLOT;i++)
		BusUi.getContent().elements["slot_"+i] = {type: "slot", x: 60+SIZE_BUS_UI/24*30+SIZE_BUS_UI*i, y: 60, size: SIZE_BUS_UI}
})();
class BusSubTile extends SubTile {
	constructor(data: any){
		super(data);
		this.useTick = true;
	}

	public open(container: ItemContainer, client: NetworkClient, str: string): void {
		this.sendClient({
			name: "updateBitmapMode",
			mode: this.data.mode || 0
		});
		let size = this.getSize();
		for(let i = 0;i < size;i++){
			let slot = this.getItemBySlot(i);
			container.setSlot("slot_"+i, slot.id, slot.count, slot.data, slot.extra||null);
		}
		container.sendChanges();
	}

	public close(container: ItemContainer, client: NetworkClient): void {
		this.data.slots = [];
		let size = this.getSize();
		for(let i = 0;i < size;i++){
			let slot = container.getSlot("slot_"+i);
			this.data.slots.push({id: slot.id, count: slot.count, data: slot.data, extra: slot.extra});
			container.setSlot("slot_"+i, 0, 0, 0, null);
		}
		this.controller.save();
	}

	public serverEvent(data: any): void {
		if(data.name == "newMode"){
			this.data.mode = this.data.mode || 0;
			this.data.mode += 1;
			if(this.data.mode > 1)
				this.data.mode = 0;
			this.sendClient({
				name: "updateBitmapMode",
				mode: this.data.mode
			});
		}
	}
	public getDrops(): ItemInstance[] {
		let result = super.getDrops();
		let size = this.getSize();
		for(let i = 0;i < size;i++)
			result.push(this.getItemBySlot(i));
		return result;
	}

	public getItemBySlot(slot: number): ItemInstance {
		if(!this.data.slots) this.data.slots = [];
		return this.data.slots[slot]||EMPTY_ITEM;
	}

	public isTransferItem(item: ItemInstance, mode: number = this.data.mode): boolean {
		if(mode == 1){//white list
			let size = this.getSize();
			for(let i = 0;i < size;i++){
				let slot = this.getItemBySlot(i);
				if(item.id == slot.id) return true;
			}
			return false;
		}//black list
		let size = this.getSize();
		for(let i = 0;i < size;i++){
			let slot = this.getItemBySlot(i);
			if(item.id == slot.id) return false;
		}
		return true;
		
	}

	public tick(): void {
		if(World.getThreadTime() % this.getSpeed() != 0 || !this.tile.controller) return;
		this.busLogic();
	}

	public getSize(): number {
		return LIST_SLOT;
	}

	public getSpeed(): number {
		return 20;
	}

	public getTransferCount(): number {
		return 1;
	}

	public getConnectionCable(): number {
		return 3/16;
	}

	public busLogic(): void {

	}

	static clientEvent(container: com.zhekasmirnov.innercore.api.mod.ui.container.UiAbstractContainer, window: UI.IWindow, content: com.zhekasmirnov.innercore.api.mod.ui.window.WindowContent, data: any): void {
		if(data.name == "updateBitmapMode" && content)
			content.elements.mode.bitmap = "bus_mode_"+data.mode;
		SubTileController.sendServer(data, {});
	}

	static canAdded(sides: any): boolean {
		return SubTileController.canAdded(sides, ["bus", "display"])
	}

	static getScreenByName(value: any, container: any): UI.IWindow {
		return BusUi;
	}
};

function createBus(nameid: string, prot: Messageable<BusSubTile>, model: RenderUtil.Model){
    const texId = "ae_bus_"+nameid;
	IDRegistry.genItemID(texId); 
	Item.createItem(texId, "Bus "+nameid, {name: "", meta: 0}, {stack: 64, isTech: false});

    const id = ItemID[texId];
	Item.registerUseFunctionForID(id, funcAddedBus);
	AppliedEnergistics.setFlag(id, "bus");
	SubTileController.registry(id, prot)

	SubTileController.registerRotate(texId, model);
	model.setItemModel(id);
}
class BusImportSubTile extends BusSubTile {
	public busLogic(): void {
		let pos = World.getRelativeCoords(this.tile.x, this.tile.y, this.tile.z, this.side);
		let storage = StorageInterface.getStorage(this.tile.blockSource, pos.x, pos.y, pos.z);
		if(!storage) return;
		let slots = storage.getOutputSlots(World.getInverseBlockSide(this.side));
		for(let i in slots){
			let slot = slots[i];
			let item = new ItemStack(storage.getSlot(slot));
			if(item.id != 0 && this.isTransferItem(item)){
				let items = this.tile.controller.getItems();
				let count = this.getTransferCount();
				if(item.count - count < 0)
					count += item.count - count;
				if(item.count < 1 || count < 1)
					break;
				if(item.count - count < 1)
					storage.setSlot(slot, 0, 0, 0, null);
				else
					storage.setSlot(slot, item.id, item.count - count, item.data, item.extra);
				item.count = count;
				(function(items){
					for(let i in items){
						let it = items[i];
						if(it.id == item.id && it.data == item.data && !item.extra && !it.extra){
							it.count += item.count;
							return;
						}
					}
					items.push(item);
				})(items);
				items = this.tile.controller.setItems(items);
				for(let i in items)
					storage.addItem(items[i]);
				break;
			}
		}
	}

	static getNameModel(): string {
		return "ae_bus_import";
	}
};
createBus("import", BusImportSubTile, ImportBus(null, "charger_side"));

class BusExportSubTile extends BusSubTile {
	public busLogic(): void {
		let pos = World.getRelativeCoords(this.tile.x, this.tile.y, this.tile.z, this.side);
		let storage = StorageInterface.getStorage(this.tile.blockSource, pos.x, pos.y, pos.z);
		if(!storage) return;
		let items = this.tile.controller.getItems();
		for(let i in items){
			let item = items[i];
			if(this.isTransferItem(item)){
				let count = this.getTransferCount();
				if(item.count - count < 0)
					count += item.count - count;
				if(item.count < 1)
					item = {id: 0, count: 0, data: 0, extra: null};
				if(count < 1) return;
				let transfer = storage.addItem({id: item.id, count: count, data: item.data, extra: item.extra}, World.getInverseBlockSide(this.side));
				if(transfer < 1) continue;
				item.count -= transfer;
				this.tile.controller.setItems(items);//надо пофиксить баг с добавлением предмета в никуда
				
				break;
			}
		}
	}

	static getNameModel(): string {
		return "ae_bus_export";
	}
};
createBus("export", BusExportSubTile, ExportBus(null, "charger_side"));