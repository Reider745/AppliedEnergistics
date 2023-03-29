namespace MachineRegisty {
    export interface RecipeData {
        input: ItemInstance[],
        output: ItemInstance[],
        info: any
    }

    let groups: {[key: string]: RecipePool} = {}; 
    function getRecipePoolByName(nmae: string): Nullable<RecipePool> {
        return groups[nmae];
    }

    export class RecipePool {
        protected recipes: RecipeData[] = [];
        protected id: string;

        constructor(name: string){
            this.id = name;
            groups[name] = this;
        }

        public getRecipes(): RecipeData[] {
            return this.recipes;
        }

        public setRecipes(recipes: RecipeData[]): RecipePool {
            this.recipes = recipes;
            return this;
        }
        
        public getId(): string {
            return this.id;
        }

        public add(input: ItemInstance[], output: ItemInstance[], info?: any): RecipePool {
            this.recipes.push({input, output, info});
            return this;
        }

        public indexOf(check: ItemInstance[], item: ItemInstance, black: string[]): number {
            for(let i in check){
                let _item = check[i];
                if(black.indexOf(i) != -1) continue;
                if(_item.id == item.id && (_item.data == item.data || item.data == -1) && (_item.count >= item.count || item.count == -1)){
                    black.push(i);
                    return Number(i);
                }
            }
            return -1;
        }

        public itemOf(check: ItemInstance[], item: ItemInstance, black: string[]): Nullable<ItemInstance> {
            let index = this.indexOf(check, item, black);
            if(index == -1) return null;
            return check[index];
        }

        public get(input: ItemInstance[]): Nullable<RecipeData> {
            for(let i in this.recipes){
                let recipe = this.recipes[i];
                let result = true;
                let black: string[] = [];
                for(let a in recipe.input)
                    if(this.indexOf(input, recipe.input[a], black) == -1)
                        result = false;
                if(result && recipe.input.length == input.length) return recipe;
            }
            return null;
        }

        public getPossibleRecipe(input: ItemInstance[]): RecipeData[] {
            let result = [];
            for(let i in this.recipes){
                let recipe = this.recipes[i];
                for(let a in recipe.input)
                    if(this.indexOf(input, recipe.input[a], []) == -1){
                        result.push(recipe);
                        break;
                    }
            }
            return result;
        }

        public canRecipe(input: ItemInstance[]): boolean {
            return !!this.get(input);
        }

        public canPossiblerecipe(input: ItemInstance[]): boolean {
            return !!this.getPossibleRecipe(input);
        }

        public registerRecipeViewer(name: string, icon: number | Tile, content: {
            params?: UI.BindingsSet;
            drawing?: UI.DrawingElements;
            elements: {
                [key: string]: Partial<UI.UIElement>;
            };
        }): RecipePool {
            let self = this;
            Callback.addCallback("CoreConfigured", function(){
                ModAPI.addAPICallback("RecipeViewer", (api: any) => {
                    const Recipe: typeof RecipeType = api.RecipeType;
                    const RecipeRegistry: typeof RecipeTypeRegistry = api.RecipeTypeRegistry;

                    class RecipeViewer extends Recipe {
                        getAllList(): RecipePattern[] {
                            return self.recipes;
                        }
                    }

                    RecipeRegistry.register(self.getId(), new RecipeViewer(name, icon, content));
                });
            });
            return this;
        }
    }
}

class Machine extends TileEntityBase implements EnergyTile {
    public energy: EnergyType;

    constructor(id: number, energy?: EnergyType){
        super();
        StorageInterface.createInterface(id, {
            getInputSlots: this.getInputSlots,
            getOutputSlots: this.getOutputSlots
        });
        TileEntity.registerPrototype(id, this);
        if(energy){
            this.energy = energy;
            EnergyTileRegistry.addEnergyTypeForId(id, Ae);
            addConnect(id);
        }
    }

    public energyTick(type: string, node: EnergyTileNode): void {
        
    }
    public energyReceive(type: string, amount: number, voltage: number): number {
        this.data.energy = this.data.energy || 0;
        let energy = Math.min(this.getEnergyCapacity(), this.data.energy + Math.min(amount, this.getEnergyReceve()));
        let receive = energy - this.data.energy;
        this.data.energy = energy;
        return receive;
    }
    public isConductor(type: string): boolean {
        return true;
    }
    public canReceiveEnergy(side: number, type: string): boolean {
        return true;
    }
    public canExtractEnergy(side: number, type: string): boolean {
        return false;
    }

    public getEnergyReceve(): number {
        return 32;
    }

    public getEnergyСonsumption(): number {
        return 1;
    }

    public getEnergy(): number {
        return this.data.energy;
    }

    public getEnergyCapacity(): number {
        return 1000;
    }

    public canEnergySystem(): boolean {
        return false;
    }

    defaultValues: {progress: 0, energy: 0};

    public getProgress(): number {
        return this.data.progress;
    }

    public getProgressMax(): number {
        return 20;
    }

    public getInputSlots(side?: number): string[] {
        return [];
    }

    public getOutputSlots(side?: number): string[] {
        return [];
    }

    public getResult(input: ItemInstance[]): Nullable<MachineRegisty.RecipeData> {
        return null;
    }

    public canOutput(): boolean {
        return true;
    }

    private checkRecipe(input: ItemInstance[], output: ItemInstance[]): Nullable<MachineRegisty.RecipeData> {
        let result = this.getResult(input);
        if(!this.canOutput()) return result;
        if(result){
            for(let i in output){
                let item1 = output[i];
                let item2 = result.output[i];
                if((item1.id != 0 && (item1.id != item2.id || item1.data != item2.data)) || item1.count + item2.count > Item.getMaxStack(item2.id)) return null;
            }
            return result;
        }
        return result;
    }

    public getItems(slots: string[]): ItemInstance[] {
        let list = [];
        for(let i in slots)
            list.push(this.container.getSlot(slots[i]));
        return list;
    }

    public setItems(slots: string[], items: ItemInstance[], func: (item1: ItemInstance, item2: ItemInstance) => void): void {
        for(let i in slots){
            let slot = slots[i];
            let item = this.container.getSlot(slot);
            func(item, items[i]);
            this.container.setSlot(slot, item);
        }
    }

    public canDegradationProgres(): boolean {
        return true;
    }

    public onTick(): void {
        StorageInterface.checkHoppers(this);

        this.data.progress = this.data.progress || 0;
        this.data.energy = this.data.energy || 0;
        this.container.setScale("energy", this.data.energy/this.getEnergyCapacity());
        this.container.setScale("progress", this.getProgress()/this.getProgressMax());

        let input = this.getItems(this.getInputSlots());
        let output = this.getItems(this.getOutputSlots());

        let result = this.checkRecipe(input, output);

        if(this.canEnergySystem() && this.getEnergy() <= 0){
            this.data.progress = Math.max(0, this.data.progress-1);
            this.container.sendChanges();
            return;
        }

        if(result){
            if(this.getProgress() >= this.getProgressMax()){
                this.setItems(this.getInputSlots(), result.input, (item1, item2) => {
                    if(item2.count != -1) item1.count -= item2.count;
                });
                this.setItems(this.getOutputSlots(), result.output, (item1, item2) => {
                    item1.id = item2.id;
                    item1.count += item2.count;
                });
                this.data.progress = 0;
                this.container.validateAll();
                this.onRecipe();
            }
            this.data.progress++;
            if(this.canEnergySystem()) this.data.energy -= this.getEnergyСonsumption();
            this.onTickRecipe(result);
        }else if(this.canDegradationProgres())
            this.data.progress = Math.max(0, this.data.progress-1);
        
        this.container.sendChanges();
    }

    public onTickRecipe(result: MachineRegisty.RecipeData): void {

    }

    public onRecipe(): void {

    }

    public getScreenName(player: number, coords: Callback.ItemUseCoordinates): string {
        return "main";
    }

    public getScreenByName(screenName: string): UI.IWindow {
        return null;
    }
}

class MachineBlock extends BlockRotative {
    constructor(strId: string, name: string, texture: [string, number][], model: RenderUtil.Model | RenderUtil.Model[], tile: any){
        super(strId);

        this.addVariation(name, texture, true);
        if(model){
            if(!Array.isArray(model)){
                for(let i = 2;i < 6;i++)
                    model.rotate(i).setBlockModel(this.id, i);
                model.rotate(3).setBlockModel(this.id, 0);
            }else{
                for(let i = 2;i < 6;i++)
                    model[i-2].setBlockModel(this.id, i);
                model[0].setBlockModel(this.id, 0);
            }
        }
        new tile(this.id, Ae);
    }

    getDrop(coords: Vector, block: Tile, level: number, enchant: ToolAPI.EnchantData, item: ItemStack, region: BlockSource): ItemInstanceArray[] {
        return [[this.id, 1, 0]];
    }
}


/*let TestRecipePool = new MachineRegisty.RecipePool()
    .add([new ItemStack(264, 1), new ItemStack(264, 1)], [new ItemStack(263, 1)]);

let TestUi = new UI.StandardWindow({
    standard: {
        header: {
            text: {text: "Test"}
        },
        background: {
            standard: true
        },
        inventory: {
            standard: true
        }
    },
    elements: {
        "slot1": {type: "slot", x: 60, y: 60, size: 60},
        "slot2": {type: "slot", x: 60, y: 120, size: 60},
        "result": {type: "slot", x: 180, y: 90, size: 60}
    }
});

class TestMachine extends Machine {
    public getInputSlots(side?: number): string[] {
        return ["slot1", "slot2"];
    }

    public getOuputSlots(side?: number): string[] {
        return ["result"];
    }

    public getProgressMax(): number {
        return 60;
    }

    public getResult(input: ItemInstance[]): MachineRegisty.RecipeData {
        return TestRecipePool.get(input);
    }

    public getScreenByName(screenName: string) {
        return TestUi;
    }
}

new TestMachine(5);*/