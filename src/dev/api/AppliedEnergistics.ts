namespace AppliedEnergistics {
	let flags: {[key: number]:string} = {};
	export function setFlag(id: number, flag: string): void {
		flags[id] = flag;
	}
	export function isFlag(id: number, flag: string): boolean {
		return flags[id] == flag;
	}
	export function getFlag(id: number): Nullable<string> {
		return flags[id];
	}
	let drives: {[key: number]:number} = {};
	
	export function registerDrive(id: number, max: number){
		let extra = new ItemExtraData();
		extra.putInt("value", 0);
		extra.putInt("max", max);
		Item.addToCreative(id, 1, 0, extra);
		drives[id] = max;
	}
	export function getDrive(id: number): number{
		return drives[id];
	}
	
	export function getDriveSlot(container, name): ItemInstance {
		let item = container.getSlot(name);
		let max = this.getDrive(item.id);
		if(max && !item.extra){
			item.extra = new ItemExtraData();
			item.extra.putInt("value", 0);
			item.extra.putInt("max", max);
		}
		return item;
	}
	
	export function setItems(extra: ItemExtraData, items: ItemInstance[]): void {
		extra.putInt("length", items.length);
		for(let i in items){
			let item = items[i];
			extra.putInt("id_"+i, item.id||0);
			extra.putInt("count_"+i, item.count||0);
			extra.putInt("data_"+i, item.data||0);
			if(item.extra)
				extra.putSerializable("extra_"+i, item.extra);
			else
				extra.putInt("enabledExtra_"+i, 1);
		}
	}
	export function getItems(extra: ItemExtraData): ItemInstance[] {
		let items = [];
		for(let i = 0;i < extra.getInt("length", 0);i++)
			items.push({
				id: extra.getInt("id_"+i, 0),
				count: extra.getInt("count_"+i, 0),
				data: extra.getInt("data_"+i, 0),
				extra: (function(){
					if(extra.getInt("enabledExtra_"+i) == 1)
						return extra.getSerializable("extra_"+i);
					return undefined;
				})()
			});
		return items;
	}
};