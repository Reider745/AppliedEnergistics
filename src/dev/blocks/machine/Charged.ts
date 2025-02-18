let RecipeCharged = new MachineRegisty.RecipePool("charged");

class ChargedTile extends Machine {
    public getInputSlots(side?: number): string[] {
        return ["slot"];
    }

    public getOutputSlots(side?: number): string[] {
        return ["slot"];
    }

    public getResult(input: ItemInstance[]): MachineRegisty.RecipeData {
        return RecipeCharged.get(input);
    }

    public canOutput(): boolean {
        return false;
    }

    public getProgressMax(): number {
        return 100;
    }

    public canEnergySystem(): boolean {
        return true;
    }

    protected animation: Animation.Item;

    public clientLoad(): void {
        this.updateModelClient();
        let self = this;
        this.networkData.addOnDataChangedListener(function(data, is){
            self.updateModelClient();
        });
    }

    public clientUnload(): void {
        if(this.animation) this.animation.destroy();
    }

    @BlockEngine.Decorators.ClientSide
    public updateModelClient(): void {
        this.animation = new Animation.Item(this.x+.5, this.y+.5, this.z+.5);
        this.animation.describeItem({
            id: Network.serverToLocalId(this.networkData.getInt("id", 0)),
            data: this.networkData.getInt("data", 0),
            size: .5
        });
        this.animation.loadCustom(AnimationType.VANILLA({pos: .025}));
    }

    public updateModel(slot: ItemInstance): void {
        this.networkData.putInt("id", slot.id);
        this.networkData.putInt("data", slot.data);
        this.networkData.sendChanges();
    }

    public onRecipe(): void {
        this.updateModel(this.container.getSlot("slot"));
    }

    public onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
        let slot = this.container.getSlot("slot");
        if(slot.id == 0){
            slot.set(item.id, 1, item.data, item.extra || null);
            item.decrease(1);
            new PlayerEntity(player).setCarriedItem(item);
        }else slot.dropAt(this.blockSource, this.x+.5, this.y+.5, this.z+.5);
        this.updateModel(slot);
        slot.validate();
        return false;
    }
}

BlockRegistry.registerBlock(new MachineBlock("ae_charged", "charged", [["charger_side", 0]], Charged, ChargedTile));
RecipeCharged.registerRecipeViewer("Charged", BlockID.ae_charged, {
    elements: {
        input0: {type: "slot", x: 100, y: 100, size: 100},
        output0: {type: "slot", x: 300, y: 100, size: 100}
    }
});