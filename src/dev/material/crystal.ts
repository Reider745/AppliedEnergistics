interface CrystalInfo {
    id: number;
    max: number;
}

const CHANCE = 1/1000;

class CrystalItemAI extends EntityAI.AI {
    
    private static ITEM_LIST: CrystalInfo[] = [];

    public crystal_info: CrystalInfo;
    public region: BlockSource;

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
        let blockId = this.region.getBlockId(pos.x, pos.y, pos.z);
        if(Math.random() < CHANCE && (blockId == VanillaBlockID.water || blockId == VanillaBlockID.flowing_water)){
            let item = Entity.getDroppedItem(this.entity);
            Entity.setDroppedItem(this.entity, 0, 0, 0);
            this.region.spawnDroppedItem(pos.x, pos.y, pos.z, item.id, item.count, item.data + 1);
        }
    }

    public static addCrystal(id: number, max: number): void {
        this.ITEM_LIST.push({id, max});
    }
}

EntityAI.register("minecraft:item<>", CrystalItemAI);

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
    }

    public onIconOverride(item: ItemInstance, isModUi: boolean): Item.TextureData {
        return {name: this.icon.name, data: item.data};
    }

    public onNameOverride(item: ItemInstance, translation: string, name: string): string {
        return (item.data < this.max ? translation : this.name2)+"\nstage: "+item.data;
    }
}

ItemRegistry.registerItem(new CrystalItem("crystal_seed_certus", "Crystal seed certus", "Crystal certus", "crystal_seed_certus", 3));
ItemRegistry.registerItem(new CrystalItem("crystal_seed_fluix", "Crystal seed fluix", "Crystal fluix", "crystal_seed_fluix", 3));
ItemRegistry.registerItem(new CrystalItem("crystal_seed_nether", "Crystal seed nether", "Crystal nether", "crystal_seed_nether", 3));