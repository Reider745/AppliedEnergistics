let RecipeCarver = new MachineRegisty.RecipePool("carver");

let CarverUI = new UI.StandardWindow({
    standard: {
		header: {
			text: {
				text: "Carver"
			},
		},
		inventory: {
			standard: true
		},
		background: {
			standard: true
		}
	},
});

class CarverTile extends Machine {
    public getInputSlots(side?: number): string[] {
        return ["input1", "input2", "input3"];
    }

    public getOutputSlots(side?: number): string[] {
        return ["output"];
    }

    public getResult(input: ItemInstance[]): MachineRegisty.RecipeData {
        return RecipeCarver.get(input);
    }

    public canEnergySystem(): boolean {
        return true;
    }

    public getProgressMax(): number {
        return 100;
    }

    public getScreenByName(screenName: string): UI.IWindow {
        return CarverUI;
    }
};

BlockRegistry.registerBlock(new MachineBlcok("ae_carver", "Carver", [["charger_side", 0]], Carver, CarverTile));