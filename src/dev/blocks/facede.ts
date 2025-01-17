ItemRegistry.createItem("ae_facade_cable_anchor", {
	name: "Cable anchor",
	icon: "",
	inCreative: true
});
new RenderUtil.Model()
	.add(5/16, 7/16, 7/16, 10/16, 9/16, 9/16, "charger_side")
	.setItemModel(ItemID.ae_facade_cable_anchor);

Callback.addCallback("PostLoaded", function(){
	for(let i in cutting_knifes){
		let id = cutting_knifes[i];

		Recipes.addShapeless({id: ItemID.ae_facade_cable_anchor, count: 3, data: 0}, [
			{id: VanillaItemID.iron_ingot, data: 0}, {id: id, data: -1}
		], function(api, field, result, player){
			for(let i = 0; i < field.length; i++){
				if (field[i].id == id){
					field[i].data++;
					if (field[i].data >= Item.getMaxDamage(id))
						field[i].id = field[i].count = field[i].data = 0;
				}else
					api.decreaseFieldSlot(i);
			}
		});
	}
})

let faceds = [];
function createFacede(str_id: string, name: string, id: number, data: number): void {
	Logger.Log("Added facede "+ id + " "+data, AE_LOG);

	const facade = "ae_facade_"+str_id;
	IDRegistry.genItemID(facade); 
	Item.createItem(facade, "Storage facade "+name, {name: "", meta: 0}, {stack: 64, isTech: false});

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

function equalsRenderMesh(mesh1: RenderMesh, mesh2: RenderMesh): boolean {
	let vertices1 = mesh1.getReadOnlyVertexData().vertices;
	let vertices2 = mesh2.getReadOnlyVertexData().vertices;

	if(vertices2.length == 0 || vertices1.length != vertices2.length) 
		return false;

	for(let i = 0;i < vertices1.length;i++)
		if(vertices1[i] != vertices2[i])
			return false;

	return true;
}

let JsonFacade: {id: string, textId?: string, datas?: number[]}[] = FileTools.ReadJSON(__dir__+"facede.json");

let isAddedFacede = false;
Callback.addCallback("LevelDisplayed", () => {
	if(isAddedFacede) return;
	isAddedFacede = true;

	let mesh = ItemModel.getItemRenderMeshFor(1, 1, 0, false);
	let models: ItemModel[] = (() => {
		let result = [];
		let models = ItemModel.getAllModels();
		let it = models.iterator();
		while(it.hasNext())
			result.push(it.next());
		return result;
	})();

	for(let model of models){
		let id = model.id, data = model.data;

		if(!TileEntity.isTileEntityBlock(id) && id != 0 && equalsRenderMesh(mesh, ItemModel.getItemRenderMeshFor(id, 1, data, false)))
			createFacede(
				id+":"+data,
				Translation.translate(Item.getName(id, data)), 
				id, data
			);
	}
});
/*Callback.addCallback("ModsLoaded", function(){
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
});*/