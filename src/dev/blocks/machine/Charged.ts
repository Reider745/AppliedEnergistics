class ChargedTile extends Machine {

}

class ChargedBlock extends BlockRotative {
    constructor(strId: string, name: string, texture: [string, number][]){
        super(strId);

        this.addVariation(name, texture, true);
        for(let i = 2;i < 6;i++)
            Charged.rotate(i).setBlockModel(this.id, i);
    }
}

BlockRegistry.registerBlock(new ChargedBlock("ae_charged", "charged", [["stone", 0]]))