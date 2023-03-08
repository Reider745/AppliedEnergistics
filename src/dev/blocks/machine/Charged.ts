let RecipeCharged = new MachineRegisty.RecipePool("charged")
    .add([new ItemStack(ItemID.ae_quartz, 1)], [new ItemStack(ItemID.ae_charged_quartz, 1)])

class ChargedTile extends Machine {
    public getInputSlots(side?: number): string[] {
        return ["slot"];
    }

    public getOuputSlots(side?: number): string[] {
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
        this.animation = this.animation || new Animation.Item(this.x+.5, this.y+.5, this.z+.5);
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

class ChargedBlock extends BlockRotative {
    constructor(strId: string, name: string, texture: [string, number][], model: RenderUtil.Model){
        super(strId);

        this.addVariation(name, texture, true);
        for(let i = 2;i < 6;i++)
            model.rotate(i).setBlockModel(this.id, i);
        model.rotate(3).setBlockModel(this.id, 0);
        new ChargedTile(this.id, Ae);
    }

    getDrop(coords: Vector, block: Tile, level: number, enchant: ToolAPI.EnchantData, item: ItemStack, region: BlockSource): ItemInstanceArray[] {
        return [[this.id, 1, 0]];
    }
}

BlockRegistry.registerBlock(new ChargedBlock("ae_charged", "charged", [["charger_side", 0]], Charged))