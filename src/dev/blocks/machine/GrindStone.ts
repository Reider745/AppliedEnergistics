let GrindStoneRecipe = new MachineRegisty.RecipePool("grindstone")
    .add([new ItemStack(264, 1, 0)], [new ItemStack(263, 9, 0)]);

let GrindStoneUI = new UI.StandartWindow({
    standard: {
		header: {
			text: {
				text: "Grind Stone"
			},
		},
		inventory: {
			standard: true
		},
		background: {
			standard: true
		}
	},

    elements: {
        //"input1": {type: "slot", x: 60, y: 60, size: 100},
       // "input2": {type: "slot", x: 60+110, y: 60, size: 100},
        //"input3": {type: "slot", x: 60+220, y: 60, size: 100},

        "input1": {type: "slot", x: 650, y: 300, size: 100},
        "output1": {type: "slot", x: 760, y: 300, size: 100},

        //"output1": {type: "slot", x: 60+610, y: 300, size: 100},
        //"output2": {type: "slot", x: 60+110+610, y: 300, size: 100},
        //"output3": {type: "slot", x: 60+220+610, y: 300, size: 100}
    }
});

class GrindStoneTile extends Machine {
    public getInputSlots(side?: number): string[] {
        return ["input1"];
       // return ["input1", "input2", "input3"];
    }

    public getOutputSlots(side?: number): string[] {
        return ["output1"]
        //return ["output1", "output2", "output3"]
    }

    public canDegradationProgres(): boolean {
        return false;
    }

    public canEnergySystem(): boolean {
        return true;
    }

    public getProgressMax(): number {
        return 100;
    }

    public getResult(input: ItemInstance[]): MachineRegisty.RecipeData {
        return GrindStoneRecipe.get(input);
    }

    public getScreenByName(screenName: string): UI.IWindow {
        return GrindStoneUI;
    }
}


BlockRegistry.registerBlock(new MachineBlock("ae_grind_stone", "Grind stone", [["grindstone_side", 0], ["grindstone", 0], ["grindstone_side", 0], ["grindstone_front", 0], ["grindstone_side", 0], ["grindstone_side", 0]], null, GrindStoneTile));


class GrindStonePenTile extends TileEntityBase implements EnergyTile {
    constructor(id: number){
        super();

        TileEntity.registerPrototype(id ,this);
    }

    public energy: boolean;
    public tick_: number;
    public data_: number;

    public energyTick(type: string, node: EnergyTileNode): void {
        if(this.energy){
            node.add(10);
            this.energy = false;
        }
    }

    public energyReceive(type: string, amount: number, voltage: number): number {
        return 0;
    }

    public isConductor(type: string): boolean {
		return true;
	}

	public canReceiveEnergy(side: number, type: string): boolean {
		return false;
	}

	public canExtractEnergy(side: number, type: string): boolean {
		return true;
	}

    public onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
        this.tick_ = this.tick_ || -20;
        let time = World.getThreadTime() ;
        if(time - this.tick_ >= 10 && !this.energy){
            this.energy = true;
            let data = this.data_ || 0;
            data = data + 1 > 3 ? 0 : data + 1;
            this.data_ = data;
            this.blockSource.setBlock(this.x, this.y, this.z, this.blockID, [2, 4, 3, 5][data]);
            this.tick_ = time;
        }
        return false;
    }
}

let ModelsPen = [
    new RenderUtil.Model().add(7/16, 7/18, 7/16, 9/16, 9/16, 12/16, "planks"),
    new RenderUtil.Model().add(7/16, 7/18, 4/16, 9/16, 9/16, 9/16, "planks"),
    new RenderUtil.Model().add(7/16, 7/18, 7/16, 12/16, 9/16, 9/16, "planks"),
    new RenderUtil.Model().add(4/16, 7/18, 7/16, 9/16, 9/16, 9/16, "planks"),
];
for(let i in ModelsPen)
    ModelsPen[i].add(7/16, 0, 7/16, 9/16, 7/16, 9/16, "planks")


BlockRegistry.registerBlock(new MachineBlock("ae_grind_stone_pen", "Pen", [["planks", 0], ["planks", 0], ["planks", 0], ["planks", 0], ["planks", 0], ["planks", 0]], ModelsPen, GrindStonePenTile));
EnergyTileRegistry.addEnergyTypeForId(BlockID.ae_grind_stone_pen, Ae);
