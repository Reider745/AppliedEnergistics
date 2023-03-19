namespace Processor {
    export const Calculation = new ItemStack(ItemID.ae_calculation_processor_press, -1, 0);
    export const Engineering = new ItemStack(ItemID.ae_engineering_processor_press, -1, 0);
    export const Logic = new ItemStack(ItemID.ae_logic_processor_press, -1, 0);
    export const Silicon = new ItemStack(ItemID.ae_silicon_press, -1, 0);
}

let RecipeCarver = new MachineRegisty.RecipePool("carver")
    .add([new ItemStack(263, 1, 0), Processor.Calculation, new ItemStack(263, 1, 0)], [new ItemStack(264, 1, 0)]);

let CarverUI = new UI.StandartWindow({
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
    elements: {
        "input1": {type: "slot", x: 500, y: 100, size: 100},
        "input2": {type: "slot", x: 610, y: 210, size: 100},
        "input3": {type: "slot", x: 500, y: 320, size: 100},

        "output": {type: "slot", x: 810, y: 210, size: 100}
    }
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

BlockRegistry.registerBlock(new MachineBlock("ae_carver", "Carver", [["charger_side", 0]], Carver, CarverTile));