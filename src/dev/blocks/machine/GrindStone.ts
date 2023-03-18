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


BlockRegistry.registerBlock(new MachineBlcok("ae_grind_stone", "Grind stone", [["grindstone_side", 0], ["grindstone_side", 0], ["grindstone_side", 0], ["grindstone_front", 0], ["grindstone_side", 0]], null, GrindStoneTile));