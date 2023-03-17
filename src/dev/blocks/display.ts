IDRegistry.genItemID("ae_display"); 
Item.createItem("ae_display", "Display", {name: "", meta: 0}, {stack: 64});

(function(){
	for(let i = 0;i < 6;i++){
		let textures = [];
		for(let a = 0;a < 6;a++)
			if(a == i) textures.push(["ae_terminal", 0]);
			else textures.push(["ae_sides", 0]);
		TerminalModel(ItemID.ae_display, textures, i, "ae_display");
	}
})();

Item.registerUseFunctionForID(ItemID.ae_display, funcAddedFacede);
AppliedEnergistics.setFlag(ItemID.ae_display, "display");

let DisplayUI = new UI.StandardWindow({
	standard: {
		header: {
			text: {
				text: "Display"
			},
		},
		inventory: {
			standard: true
		},
		background: {
			standard: true
		}
	},
	elements: {}
});

function setInventoryFunctions(ui){
	let elements = ui.content.elements;
	for(let key in elements){
		let index = elements[key].index;
		let obj = JSON.parse(JSON.stringify(elements[key]));
		obj.type = "slot";
		obj.bitmap = "_default_slot_empty";
		obj.visual = true;
		obj.source = undefined;
		obj.clicker = {
			onClick(_, container){
				container.sendEvent("event", {
					name: "addedItem",
					count: 1,
					slot: key,
					i: index,
					player: Number(Player.get())
				});
			},
			onLongClick(_, container){
				container.sendEvent("event", {
					name: "addedItem",
					count: 64,
					slot: key,
					i: index,
					player: Number(Player.get())
				});
			}
		}
		elements[key+"_"] = obj;
	}
};
setInventoryFunctions(DisplayUI.getWindow("inventory"));

ModAPI.addAPICallback("ClassicUI", (ClassicUI: ClassicUI) => {
	ClassicUI.registerHandler(BlockID.ae_network_cable, {
		postCreate(group, tile) {
			try{
			let n: any = group.getWindowContent("header").drawing[2];
			if(n.text == "Display")
				setInventoryFunctions(group.getWindow("header"));
			}catch(e){alert(e)}
		}
	})
});

let DisplayTile;

const SETTING_DISPLAY = {
	x: 25,
	y: 25,
	size: 950/12,
	line: 12
};

class DisplaySubTile extends SubTile {
	public open(container: ItemContainer, client: NetworkClient, str: string): void {
		this.data.items = this.tile.controller.getItems();
		this.updateList(this.data.items, SETTING_DISPLAY, this.tile.container);
	}

	public updateList(list, setting, container): void {
		if(list.length == 0)
			this.clearList(container);
		for(let i in list){
			let item = list[i];
			let _i = Number(i);
			let lines = Math.floor(_i / setting.line);
			container.sendEvent("event", {
				id: this.data.id,
				name: "updateSlotClient",
				clear: i == "0",
				slot: "slot_"+i,
				size: setting.size,
				x: setting.x + (_i - (setting.line * lines)) * setting.size,
				y: setting.y + setting.size * lines,
				item: {id: item.id, count: item.count, data: item.data},
				i: i,
			});
		}
	}

	public clearList(container): void{
		container.sendEvent("event", {
			id: this.data.id,
			name: "clear"
		});
	}
	public drop(player, items): void {
		let actor = new PlayerActor(player);
		for(let i in items){
			let item = items[i];
			actor.addItemToInventory(item.id, item.count, item.data, item.extra, true);
		}
	}

	public getConnectionCable(): number {
		return 6/16;
	}

	public serverEvent(data: any): void {
		if(!this.tile.controller) return;
		if(data.name == "addedInventory"){
			this.data.items = this.tile.controller.getItems();
			let item = this.data.items[data.i];
			if(!item) return;
			let count = data.count;
			if(item.count - count < 0)//тут происходит какая-то ошибка item = undefined
				count += item.count - count;//Блять, ну раз происходит ошибка надо было сразу фиксить
			item.count -= count;
			if(item.count < 1)
				this.data.items.splice(data.i, data.i);
			if(count < 1) return;
			this.updateList(this.data.items, SETTING_DISPLAY, this.tile.container);
			this.drop(data.player, this.tile.controller.setItems(this.data.items));
			new PlayerActor(data.player).addItemToInventory(item.id, count, item.data, item.extra, true);
		}else if(data.name == "addedItem"){
			this.data.items = this.tile.controller.getItems();
			let actor = new PlayerActor(data.player);
			let item = actor.getInventorySlot(data.i);
			let count = data.count;
			if(item.count - count < 0)
				count += item.count - count;
			if(item.count < 1)
				item = {id: 0, count: 0, data: 0, extra: null};
			if(count < 1) return;
			
			actor.setInventorySlot(data.i, item.id, item.count - count, item.data, item.extra);
			item.count = count;
			(function(items){
				for(let i in items){
					let it = items[i];
					if(it.id == item.id){
						it.count += item.count;
						return;
					}
				}
				items.push(item);
			})(this.data.items);
			this.drop(data.player, this.tile.controller.setItems(this.data.items));
			this.data.items = this.tile.controller.getItems();
			this.updateList(this.data.items, SETTING_DISPLAY, this.tile.container);
		}
	}


	static clearListClient(content): void{
		for(let key in content.elements){
			let obj = content.elements[key];
			obj.bitmap = "_default_slot_empty";
			obj.visual = true;
			obj.source = undefined;
		}
	}
	static updateSlotClient(name, x, y, size, content, item, i): void {
		if(content)
			content.elements[name] = {type: "slot", x: x, y: y, size: size, source: item, visual: true, clicker: {
				onClick(_, container){
					container.sendEvent("event", {
						name: "addedInventory",
						count: 1,
						slot: name,
						i: i,
						player: Number(Player.get())
					});
				},
				onLongClick(_, container){
					container.sendEvent("event", {
						name: "addedInventory",
						count: 64,
						slot: name,
						i: i,
						player: Number(Player.get())
					});
				}
			}};
	}
	static clientEvent(container: com.zhekasmirnov.innercore.api.mod.ui.container.UiAbstractContainer, window: UI.IWindow, content: Nullable<UI.WindowContent>, data: any): void {
		if(data.name == "updateSlotClient"){
			if(data.clear)
				this.clearListClient(content);
				this.updateSlotClient(data.slot, data.x, data.y, data.size, content, data.item, data.i);
		}else if(data.name == "clear")
		this.clearListClient(content);
	}
	static canAdded(sides: any): boolean {
		return SubTileController.canAdded(sides, ["display"]);
	}
	static getNameModel(): string {
		return "ae_display";
	}
	static getScreenByName(value: any, container: any): UI.IWindow {
		return DisplayUI
	}
}
SubTileController.registry(ItemID.ae_display, DisplaySubTile);