let DriveUI = new UI.StandardWindow({
	standard: {
		header: {
			text: {
				text: "Driver"
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

(function(){
	const X = 500-(180/2);
	const Y = 25;
	const size = 65;
	
	
	let content = DriveUI.getContent();
	for(let x = 0;x < 2;x++)
		for(let y = 0;y < 5;y++)
			content.elements["s_"+x+"_"+y] = {type: "slot", x: X+(x*size), y: Y+(y*size), size: size-5};
})();

class DriveApplied extends AppliedTile {
	useNetworkItemContainer: boolean = true;

	public getDrivers(): { slot: string; item: ItemInstance; }[] {
		let items = [];
		for(let y = 0;y < 5;y++)
			for(let x = 0;x < 2;x++)
				items.push({slot:"s_"+x+"_"+y, item: AppliedEnergistics.getDriveSlot(this.container, "s_"+x+"_"+y)});
		return items;
	}

	public getEnergy(): number {
		let energy = 5;
		let drivers = this.getDrivers();
		for(let i in drivers)
			if(AppliedEnergistics.getDrive(drivers[i].item.id))
				energy += 5;
		return energy;
	}

	public getType(): string {
		return "storage";
	}

	public getItems(): ItemInstance[] {
		let items = [];
		let drivers = this.getDrivers();
		for(let i in drivers)
			if(AppliedEnergistics.getDrive(drivers[i].item.id))
				pushToArray(items, AppliedEnergistics.getItems(drivers[i].item.extra));
		return items;
	}

	public setSlot(name: string, item: ItemInstance): void {
		this.container.setSlot(name, item.id, item.count, item.data, item.extra);
	}

	public getScreenByName(screenName: string): UI.IWindow {
		return DriveUI;
	}
}

class DriveBlock extends BlockRotative {
	constructor(strId: string, name: string, texture: [string, number][]){
		super(strId, BLOCK_TYPE_STONE);
		this.addVariation(name, texture, true);
		new DriveApplied(this.id);
	}
}

BlockRegistry.registerBlock(new DriveBlock("ae_drive", "Drive",  [
	["drive_bottom", 0],
	["drive_top", 0],
	["drive_side", 0],
	["drive_front_flat", 0],
	["drive_side", 0],
	["drive_side", 0]
]));