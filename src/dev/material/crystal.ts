interface CrystalInfo {
    id: number;
    max: number;
}

const CHANCE = 1/1000;

class CrystalItemAI extends EntityAI.AI {
    
    private static ITEM_LIST: CrystalInfo[] = [];

    public crystal_info: CrystalInfo;
    public region: BlockSource;

    private coordPlus(x: number): number {
        let xx = x - Math.floor(x);
        if(xx > .8)
            return Math.floor(x + .25);
        return Math.floor(x);
    }

    public canWater(x: number, y: number, z: number): boolean {
        y = Math.floor(y-.5);
        x = this.coordPlus(x);
        z = this.coordPlus(z);

        let id = this.region.getBlockId(x, y, z);
        return id == VanillaBlockID.water || id == VanillaBlockID.flowing_water;
    }

    public canCreate(): boolean {
        let item = Entity.getDroppedItem(this.entity);
        for(let i in CrystalItemAI.ITEM_LIST){
            let crystak_info = CrystalItemAI.ITEM_LIST[i];
            if(crystak_info.id == item.id && item.data < crystak_info.max){
                this.crystal_info = crystak_info;
                return true;
            }
        }
        return false;
    }

    public create(): void {
        this.region = BlockSource.getDefaultForActor(this.entity);
    }

    public tick(): void {
        let pos = Entity.getPosition(this.entity);
        if(Math.random() < CHANCE && this.canWater(pos.x, pos.y, pos.z)){
            let item = Entity.getDroppedItem(this.entity);
            Entity.setDroppedItem(this.entity, 0, 0, 0);
            Entity.damageEntity(this.entity, 999999);
            this.region.spawnDroppedItem(pos.x, pos.y, pos.z, item.id, item.count, item.data + 1);
        }
    }

    public static addCrystal(id: number, max: number): void {
        this.ITEM_LIST.push({id, max});
    }
}

let FluixCryatalRecipe = new MachineRegisty.RecipePool("transform")
    .registerRecipeViewer("Transform", ItemID.icon_info, {
        elements: {
            input0: {type: "slot", x: 100, y: 100, size: 100},
            input1: {type: "slot", x: 210, y: 100, size: 100},
            input2: {type: "slot", x: 320, y: 100, size: 100},

            output0: {type: "slot", x: 100, y: 210, size: 100},
        }
    });

class FluixCryatalAI extends CrystalItemAI {
    static item_check: number[] = [];

    public canCreate(): boolean {
        let item = Entity.getDroppedItem(this.entity);
        return FluixCryatalAI.item_check.indexOf(item.id) != -1;
    }

    public onTick(): void {
        let pos = Entity.getPosition(this.entity);
        if(this.canWater(pos.x, pos.y, pos.z)){
            let ents = Entity.getAllInRange(pos, 1, Native.EntityType.ITEM);
            let input: ItemInstance[] = [];

            let dimension = Entity.getDimension(this.entity);
            for(let ent of ents)
                if(Entity.getDimension(ent) == dimension)
                    input.push(Entity.getDroppedItem(ent));

            let recipe = FluixCryatalRecipe.get(input);
            if(recipe){
                for(let item of recipe.output)
                    this.region.spawnDroppedItem(pos.x, pos.y, pos.z, item.id, item.count, item.data, item.extra||null);
                
                for(let ent of ents){
                    let item = Entity.getDroppedItem(ent);
                    item.count -= 1;
                    Entity.setDroppedItem(ent, item.id, item.count, item.data, item.extra || null);
                    if(item.count < 1)
                        Entity.damageEntity(ent, 999999);
                }
            }
        }
    }

    static addItemCheck(id: number): void {
        this.item_check.push(id);
    }
}

EntityAI.register("minecraft:item<>", CrystalItemAI);
EntityAI.register("minecraft:item<>", FluixCryatalAI);

class CrystalItem extends ItemCommon implements ItemBehavior {
    public max: number;
    public name2: string;

    constructor(strId: string, name: string, name2: string, icon: string, max: number){
        super(strId, name, icon);
        CrystalItemAI.addCrystal(this.id, max);
        ItemRegistry.registerItemFuncs(this.id, this);
        JavaItem.setShouldDespawn(this.id, false);
        this.max = max;
        this.name2 = name2;
        for(let i = 1;i < max + 1;i++)
            Item.addToCreative(this.id, 1, i);
        Item.addCreativeGroup("crystal", "Crystal", [this.id]);
    }

    public onIconOverride(item: ItemInstance, isModUi: boolean): Item.TextureData {
        return {name: this.icon.name, data: item.data};
    }

    public onNameOverride(item: ItemInstance, translation: string, name: string): string {
        return (item.data < this.max ? translation : Translation.translate(this.name2))+"\nstage: "+item.data;
    }
}

ItemRegistry.registerItem(new CrystalItem("crystal_seed_certus", "Crystal seed certus", "Crystal certus", "crystal_seed_certus", 3));
ItemRegistry.registerItem(new CrystalItem("crystal_seed_fluix", "Crystal seed fluix", "Fluix crystal", "crystal_seed_fluix", 3));
ItemRegistry.registerItem(new CrystalItem("crystal_seed_nether", "Crystal seed nether", "Crystal nether", "crystal_seed_nether", 3));

Translation.addTranslation("Crystal seed certus", {
    ru: "Хрустальные семена certus"
});
Translation.addTranslation("Crystal certus", {
    ru: "Кристалл цертус"
});

Translation.addTranslation("Crystal seed fluix", {
    ru: "Семена изменчивого кристаллла"
});
Translation.addTranslation("Fluix crystal", {
    ru: "Изменчивый кристалл"
});

Translation.addTranslation("Crystal seed nether", {
    ru: "Семена кристалл кварца нижнего мира"
});
Translation.addTranslation("Crystal nether", {
    ru: "Кристалл кварца нижнего мира"
});