const LAYER = floor(1/190);

let requireMethodFromNativeAPI = ModAPI.requireGlobal("requireMethodFromNativeAPI");
let setRenderLayer = requireMethodFromNativeAPI("api.NativeBlock", "setRenderLayer");
let setRenderType = requireMethodFromNativeAPI("api.NativeBlock", "setRenderType");
let getRenderType = requireMethodFromNativeAPI("api.NativeBlock", "getRenderType");
let BlockLayers = [];

function setBlockLayer(id: number, data: number, layers: [string, number][][]): RenderUtil.Model {
	BlockLayers.push(id);
	let layer = layers.length * LAYER;
	let model = new RenderUtil.Model()
		.addBoxByBlock(null, 0, 0, 0, 1, 1, 1, id, data);
	for(let i = 1;i <= layers.length;i++)
		model.addBoxByBlock(null, -(i*LAYER), -(i*LAYER), -(i*LAYER), 1+i*LAYER, 1+i*LAYER, 1+i*LAYER, layers[i-1]);
		
	model.setBlockModel(id, data);
	return model;
};

Callback.addCallback("LevelDisplayed", function() {
	for(let i in BlockLayers){
		let id = BlockLayers[i];
		setRenderLayer(id, 2);
		setRenderType(id, 99);
	}
});

function FacedeModel(id: number, id2: number, data: number, side: number, textId: string): RenderUtil.Model {
	let model = new RenderUtil.Model();
	const n = "facade_"+side;
	if(side == 0)
		model.addBoxByBlock(n, 0, 0, 0, 1, LAYER, 1, id2, data);
	else if(side == 1)
		model.addBoxByBlock(n, 0, 1-LAYER, 0, 1, 1, 1, id2, data);
	else if(side == 2)
		model.addBoxByBlock(n, 0, 0, 0, 1, 1, LAYER, id2, data);
	else if(side == 3)
		model.addBoxByBlock(n, 0, 0, 1-LAYER, 1, 1, 1, id2, data);
	else if(side == 4)
		model.addBoxByBlock(n, 0, 0, 0, LAYER, 1, 1, id2, data);
	else if(side == 5)
		model.addBoxByBlock(n, 1-LAYER, 0, 0, 1, 1, 1, id2, data);
	if(id) model.setItemModel(id);
	CacheFacede.add(textId+"_"+side, model);
	return model;
}
function TerminalModel(id: number, id2: number | [string, number][], side: number, textId: string){
	let model = new RenderUtil.Model();
	const n = "terminal_"+side;
	const p = 2/16;
	if(side == 0)
		model.addBoxByBlock(n, p, -LAYER, p, 1-p, p, 1-p, id2);
	else if(side == 1)
		model.addBoxByBlock(n, p, 1-p, p, 1-p, 1+LAYER, 1-p, id2);
	else if(side == 2)
		model.addBoxByBlock(n, p, p, -LAYER, 1-p, 1-p, p, id2);
	else if(side == 3)
		model.addBoxByBlock(n, p, p, 1-p, 1-p, 1-p, 1+LAYER, id2);
	else if(side == 4)
		model.addBoxByBlock(n, -LAYER, p, p, p, 1-p, 1-p, id2);
	else if(side == 5)
		model.addBoxByBlock(n, 1-p, p, p, 1+LAYER, 1-p, 1-p, id2);
	if(id) model.setItemModel(id);
	CacheFacede.add(textId+"_"+side, model);
	return model;
}

let width = 4/16/2;
const WIRE_BOXES = [
	{ side: [0, -1, 0], box: [0.5 - width, 0, 0.5 - width, 0.5 + width, 0.5 - width, 0.5 + width], replaced: 1},
	{ side: [0, 1, 0], box: [0.5 - width, 0.5 + width, 0.5 - width, 0.5 + width, 1, 0.5 + width], replaced: 4},
	
	{ side: [0, 0, -1], box: [0.5 - width, 0.5 - width, 0, 0.5 + width, 0.5 + width, 0.5 - width], replaced: 2},
	{ side: [0, 0, 1], box: [0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width, 0.5 + width, 1], replaced: 5},
	
	{ side: [-1, 0, 0], box: [0, 0.5 - width, 0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width], replaced: 0},
	{ side: [1, 0, 0], box: [0.5 + width, 0.5 - width, 0.5 - width, 1, 0.5 + width, 0.5 + width], replaced: 3},
];

function setWireModel(groupName: string, id: number, data: number){
	let group = ICRender.getGroup(groupName);
	group.add(id, data);
	
	
	let render = new RenderUtil.Model();
	render.addBoxByBlock("central", 0.5 - width, 0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width, 0.5 + width, id, data);
	for(let key in WIRE_BOXES){
		let box = WIRE_BOXES[key];
		render.addBoxByBlock(key, box.box[0], box.box[1], box.box[2], box.box[3], box.box[4], box.box[5], id, data, ICRender.BLOCK(box.side[0], box.side[1], box.side[2], group, false));
	}
	render.setBlockModel(id, data);
	BlockRenderer.enableCoordMapping(id, data, render.getICRenderModel());
	CacheFacede.add(id+":"+data, render);
	render = new RenderUtil.Model();
	render.addBoxByBlock("central", 0.5 - width, 0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width, 0.5 + width, id, data);
	let box = WIRE_BOXES[4];
	render.addBoxByBlock(null, box.box[0], box.box[1], box.box[2], box.box[3], box.box[4], box.box[5], id, data, ICRender.BLOCK(box.side[0], box.side[1], box.side[2], group, false));
	box = WIRE_BOXES[5];
	render.addBoxByBlock(null, box.box[0], box.box[1], box.box[2], box.box[3], box.box[4], box.box[5], id, data, ICRender.BLOCK(box.side[0], box.side[1], box.side[2], group, false));
	render.setItemModel(id, data);
}