namespace MachineRegisty {
    export interface RecipeData {
        input: ItemInstance[],
        output: ItemInstance[]
    }

    export class RecipePool {
        protected recipes: RecipeData[] = [];

        public add(input: ItemInstance[], output: ItemInstance[]): RecipePool {
            this.recipes.push({input, output});
            return this;
        }

        private indexOf(check: ItemInstance[], item: ItemInstance, black: string[]): number {
            for(let i in check){
                let _item = check[i];
                if(_item.id == item.id && (_item.data == item.data || item.data == -1) && _item.count >= item.count){
                    black.push(i);
                    return Number(i);
                }
            }
            return -1;
        }

        public get(input: ItemInstance[]): Nullable<RecipeData> {
            for(let i in this.recipes){
                let recipe = this.recipes[i];
                let result = false;
                let black: string[] = [];
                for(let a in recipe.input){
                    let item = recipe.input[a];
                    if(this.indexOf(input, item, black) == -1){
                        result = false;
                        break;
                    }
                    result = true;
                }
                if(result) return recipe;
            }
            return null;
        }
        public canRecipe(input: ItemInstance[]): boolean {
            return !!this.get(input);
        }
    }
}

class Machine extends TileEntityBase {
    constructor(id: number){
        super();-
        StorageInterface.createInterface(id, {
            getInputSlots: this.getInputSlots,
            getOutputSlots: this.getOuputSlots
        });
        TileEntity.registerPrototype(id, this);
    }

    defaultValues: {progress: 0};

    public getProgress(): number {
        return this.data.progress;
    }

    public getProgressMax(): number {
        return 20;
    }

    public getInputSlots(side?: number): string[] {
        return [];
    }

    public getOuputSlots(side?: number): string[] {
        return [];
    }

    public getResult(input: ItemInstance[]): Nullable<MachineRegisty.RecipeData> {
        return null;
    }

    private checkRecipe(input: ItemInstance[], output: ItemInstance[]): Nullable<MachineRegisty.RecipeData> {
        let result = this.getResult(input);
        if(result){
            for(let i in output){
                let item1 = output[i];
                let item2 = result.output[i];
                if(item1.id != 0 && (item1.id != item2.id || item1.data != item2.data)) return null;
            }
            return result;
        }
        return null;
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

    public onTick(): void {
        StorageInterface.checkHoppers(this);

        let input = this.getItems(this.getInputSlots());
        let output = this.getItems(this.getOuputSlots());

        let result = this.checkRecipe(input, output);

        if(result){
            if(this.getProgress() >= this.getProgressMax()){
                this.setItems(this.getInputSlots(), result.input, (item1, item2) => item1.count -= item2.count);
                this.setItems(this.getOuputSlots(), result.output, (item1, item2) => {
                    item1.id = item2.id;
                    item1.count += item2.count;
                });
                this.data.progress = 0;
                
                this.container.validateAll();
            }
            this.container.setScale("progress", this.getProgress()/this.getProgressMax());
            this.data.progress++;
        }
        
        this.container.sendChanges();
    }

    public getScreenName(player: number, coords: Callback.ItemUseCoordinates): string {
        return "main";
    }

    public getScreenByName(screenName: string): UI.IWindow{
        return null;
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