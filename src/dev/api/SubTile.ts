class SubTile {
    public tile: TileEntity.TileEntityPrototype;
    public side: number;
    public data: any;
    public useTick: boolean;
    public controller: SubTileController;
    public self_id: number = -1;

    constructor(data: any){
        this.data = data;
        this.useTick = false;
    }

    public setTile(tile: TileEntity.TileEntityPrototype): SubTile {
        this.tile = tile;
        return this;
    }
    public setSide(side: number): SubTile {
        this.side = side;
        return this;
    }
    public setController(controller: SubTileController): SubTile {
        this.controller = controller;
        return this;
    }
    public setSelfId(id: number): SubTile {
        this.self_id = id;
        return this;
    }

    public getSavedData(): any {
        return this.data;
    }
    public getItem(): ItemInstance {
        return this.data;
    }

    public getDrops(): ItemInstance[] {
        return [{id: this.data.id, count: 1, data: 0}];
    }

    public getConnectionCable(): number {
        return 0;
    }

    public getEnergy(): number {
        return 0;
    }

    public click(id: number, count: number, data: number, extra: ItemExtraData, coords: Callback.ItemUseCoordinates, player: number): any{

    }
    public tick(){

    }
    public serverEvent(data: any){

    }
    public getScreenName(): string {
        return "main";
    }

    public sendClient(data: any): void {
        Dimensions
        data.id = this.data.id;
        data.self_id = this.self_id;
        data.additional = {
            x: this.tile.x,
            y: this.tile.y,
            z: this.tile.z,
            dimension: this.tile.dimension
        };
        this.tile.container.sendEvent("event", data);
    }

    public close(container: ItemContainer, client: NetworkClient): void {

    }

    public open(container: ItemContainer, client: NetworkClient, str: string): void {

    }

    static clientEvent(container: com.zhekasmirnov.innercore.api.mod.ui.container.UiAbstractContainer, window: UI.IWindow, content: Nullable<UI.WindowContent>, data: any): void {
        
    }
    static getNameModel(): Nullable<string> {
        return null;
    }
    static canAdded(sides: any): boolean {
        return false;
    }
    static getScreenByName(value: any, container: any): Nullable<UI.IWindow> {
        return null;
    }
};

interface Messageable<T> {
    new(...args: any[]): T;
    getNameModel(): string;
}
function floor(num){
	let symbols = String(num).split("");
	symbols.length = 6;
	let r = "";
	for(let i in symbols)
		r+=symbols[i];
	return Number(r);
}
class SubTileController {
    static all_tile: {[key: string]: Messageable<SubTile>} = {};

    public tiles: SubTile[][] = [];
    private tile: TileEntity.TileEntityPrototype;
    constructor(data: any, tile: TileEntity.TileEntityPrototype){
        this.tile = tile;
        if(!data.sides) data.sides = [[], [], [], [], [], []];
        let id = 0;
        for(let i in data.sides){
            let side = data.sides[i];
            let arr = [];
            for(let a in side){
                arr.push(new SubTileController.all_tile[side[a].id](side[a])
                    .setTile(tile)
                    .setController(this)
                    .setSelfId(id)
                    .setSide(Number(i)));
                id++;
            }
            this.tiles.push(arr);
        }
        tile.container.sendEvent("linkToServer", {x: tile.x, y: tile.y, z: tile.z, dimension: tile.dimension});
    }

    public useAll(name: string, args: any[] = []): void {
        for(let side in this.tiles)
            this.useAllToSide(Number(side), name, args);
    }

    public useAllToSide(side: number, name: string, args: any[] = []): void{
        let tiles = this.tiles[side];
        for(let i in tiles)
            tiles[i][name].apply(tiles[i], args);
            //if(tiles[i][name]) tiles[i][name].apply(tiles[i], args);
    }

    public forEach(func: (tile: SubTile) => void): void {
        for(let side in this.tiles){
            let tiles = this.tiles[side];
            for(let i in tiles)
                func(tiles[i]);
        }
    }

    public getUseAll(name: string, args: any[] = []): Nullable<any> {
        for(let side in this.tiles){
            let result = this.getUseAllToSide(Number(side), name, args);
            if(result) return result;
        }
        return null;
    }

    public getTiles(): SubTile[][] {
        return this.tiles;
    }

    public getTilesBySide(side: number): SubTile[] {
        return this.tiles[side];
    }

    public getUseAllToSide(side: number, name: string, args: any[] = []): Nullable<any> {
        let tiles = this.tiles[side];
        for(let i in tiles){
            //if(tiles[i][name]){
            let result = tiles[i][name].apply(tiles[i], args);
            if(result) return result;
        }
        return null;
    }

    public getSubTile(id: number): Nullable<SubTile> {
        for(let side in this.tiles){
            let tiles = this.tiles[side];
            for(let i in tiles)
                if(tiles[i].self_id == id)
                    return tiles[i];
        }
        return null;
    }

    public useMethodById(id: number | SubTile, name: string, args: any[] = []): void {
        if(typeof id == "number") id = this.getSubTile(id);
        id[name].apply(id, args);
    }

    private cache_use_tick = null;

    public canUseTick(): boolean {
        if(this.cache_use_tick != null) return this.cache_use_tick;
        for(let side in this.tiles){
            let tiles = this.tiles[side];
            for(let i in tiles)
                if(tiles[i].useTick){
                    this.cache_use_tick = true;
                    return true;
                }
        }
        return false;
    }

    public click(id, count,  data, coords, player, extra, name): void {
        name = name === undefined || typeof name !== "string" ? "click" : name;
		const x = floor(coords.vec.x - coords.x);
		const y = floor(coords.vec.y - coords.y);
		const z = floor(coords.vec.z - coords.z);
        for(let i in this.tiles){
            let side = this.tiles[i];
            for(let a in side){
                let tile = side[a];
                let model = CacheFacede.get(SubTileController.getSubTile(side[a].data.id).getNameModel()+"_"+i);
                if(model.isClick(x, y, z)){
                    let result;
                    if(tile[name])
                        result = {value: tile[name].apply(tile, [id, count, data, extra, coords, player]), id: tile.getItem().id, self_id: tile.self_id};
                    else
                        result = {};
                    if(name != "click") return result;
                        return;
                }
            }
        }
    }
    public dropItem(): void {
        for(let side in this.tiles){
            let tiles = this.tiles[side];
            for(let i in tiles){
                let drops = tiles[i].getDrops();
                for(let a in drops)
                    this.tile.blockSource.spawnDroppedItem(this.tile.x, this.tile.y, this.tile.z, drops[a].id, drops[a].count, drops[a].data, drops[a].extra||null);
            }
        }
		BlockRenderer.unmapCollisionAndRaycastModelAtCoords(this.tile.dimension, this.tile.x, this.tile.y, this.tile.z);
    }
    public save(){
        this.tile.data.sides = [];
        for(let i in this.tiles){
            let side = this.tiles[i];
            let arr = [];
            for(let a in side)
                arr.push(side[a].getSavedData());
            this.tile.data.sides.push(arr);
        }
    }

    static canAdded(sides: any, flags: string[]): boolean {
        for(let i in sides)
			if(flags.indexOf(AppliedEnergistics.getFlag(sides[i].id)) != -1)
				return false;
		return true;
    }

    static {
        Network.addServerPacket("sub_tile.send_server", function(client: NetworkClient, data: any){
            let tile = TileEntity.getTileEntity(data.client.additional.x, data.client.additional.y, data.client.additional.z, BlockSource.getDefaultForDimension(data.client.additional.dimension));
            getController(tile).sendServer(data.client.self_id, data.data);
        });
    }

    public sendServer(id: number, data: any): void {
        for(let i in this.tiles){
            let tiles = this.tiles[i];
            for(let a in tiles)
                if(tiles[a].self_id == id)
                    tiles[a].serverEvent(data);
        }
    }

    static send(x: number, y: number, z: number, id: number, data: any, dimension: number = Entity.getDimension(Player.get())): void {
        SubTileController.sendServer({
            self_id: id,
            additional: {
                x: x,
                y: y,
                z: z,
                dimension: dimension
            }
        }, data);
    }
    public sendToTile(tile: TileEntity.TileEntityPrototype, id: number, data: any): void {
        SubTileController.send(tile.x, tile.y, tile.z, id, data, tile.dimension);
    }
    static sendServer(client: any, data: any): void {
        Network.sendToServer("sub_tile.send_server", {
            client: client,
            data: data
        });
    }

    static registry(id: number, tile: Messageable<SubTile>): void {
        tile.prototype.model = tile.getNameModel();
        this.all_tile[id] = tile;
    }
    static canSubTile(id: number): boolean{
        return !!this.getSubTile(id);
    }
    static getSubTile(id: number): any {
        return this.all_tile[id];
    }
    static registerRotate(cache: string, model: RenderUtil.Model){
        for(let i = 0;i < 6;i++)
            CacheFacede.add(cache+"_"+i, model.rotate(i));
    }
}
function getController(tile: TileEntity.TileEntityPrototype): SubTileController {
    let controller = tile.controller_sub_tile;
    if(!controller){
        controller = new SubTileController(tile.data, tile);
        tile.controller_sub_tile = controller;
        return controller;
    }
    return controller;
}
function uptController(tile: TileEntity.TileEntityPrototype): void {
    tile.controller_sub_tile = new SubTileController(tile.data, tile);
}