let faceds = [];
function createFacede(textId, id, data){
	const facade = "ae_facade_"+textId +(data === 0 ? "" : data);
	IDRegistry.genItemID(facade); 
	Item.createItem(facade, "Storage facade "+textId, {name: "", meta: 0}, {stack: 64, isTech: false});

	const numId = ItemID[facade];

	Item.registerUseFunctionForID(numId, funcAddedFacede);
	AppliedEnergistics.setFlag(numId, "facade");
	class Facade extends SubTile {
		static canAdded(sides: any): boolean {
			return SubTileController.canAdded(sides, ["facade"]);
		}
		static getNameModel(): string {
			return facade;
		}
	}
	SubTileController.registry(numId, Facade);
	FacedeModel(ItemID[facade], id, data, 2, facade);
	for(let i = 0;i < 6;i++)
		FacedeModel(null, id, data, i, facade);
	faceds.push({item: ItemID[facade], id: id});
}
Callback.addCallback("ModsLoaded", function(){
	let json: {id: string, textId?: string, datas?: number[]}[] = FileTools.ReadJSON(__dir__+"facede.json");
	for(let i in json){
		let obj = json[i];
		let split = obj.id.split(".");
		if(split.length == 2) var textId = split[1];
		else var textId = obj.textId;
		if(obj.datas)
			for(let a in obj.datas)
				createFacede(textId, eval(obj.id), obj.datas[a]);
		else
			createFacede(textId, eval(obj.id), 0);
	}
});