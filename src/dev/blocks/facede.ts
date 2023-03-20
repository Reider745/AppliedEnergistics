ItemRegistry.createItem("ae_facade_cable_anchor", {
	name: "Cable_anchor",
	icon: "",
	inCreative: true
});
new RenderUtil.Model()
	.add(5/16, 7/16, 7/16, 10/16, 9/16, 9/16, "charger_side")
	.setItemModel(ItemID.ae_facade_cable_anchor);

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

	Recipes.addShaped({id: ItemID[facade], count: 1, data: 0}, [
		" b ",
		"bab",
		" b "
	], ["a", id, 0, "b", ItemID.ae_facade_cable_anchor, 0]);
	Item.addCreativeGroup("facade", "Facade", [ItemID[facade]]);
}
let JsonFacade: {id: string, textId?: string, datas?: number[]}[] = FileTools.ReadJSON(__dir__+"facede.json");
Callback.addCallback("ModsLoaded", function(){
	for(let i in JsonFacade){
		let obj = JsonFacade[i];
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