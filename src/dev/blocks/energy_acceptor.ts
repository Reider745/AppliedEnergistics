IDRegistry.genBlockID("ae_energy_acceptor");
Block.createBlock("ae_energy_acceptor", [
	{
		name: "Energy acceptor",
		texture: [["energy_acceptor", 0]],
		inCreative: true
	}
], BLOCK_TYPE_CONTROLLER);

class EnergyAcceptor extends AppliedTile implements EnergyTile{
	constructor(id: number){
		super(id);
		addConnect(id, -1, "ic-wire");	
		EnergyTileRegistry.addEnergyTypeForId(id, EU);
	}

	defaultValues: {energy: 0};
	public energyTick(type: string, node: EnergyTileNode): void {
		if(type != "Ae") return;
		let add = Math.min(this.data.energy, 100);
		this.data.energy -= add;
		node.add(add);
	}
	public isConductor(type: string): boolean {
		return true;
	}
	public canReceiveEnergy(side: number, type: string): boolean {
		return true;
	}
	public canExtractEnergy(side: number, type: string): boolean {
		return true;
	}

	public getType(): string {
		return "energy_acceptor";
	}
	public energyReceive(type, amount, voltage): number {
		if(type == "Ae") return 0;
		this.data.energy = this.data.energy || 0;
		let amount_ = amount;
		if(this.data.energy < 100)
			amount_ /= 2;
		let result = 0;

		let controller = this.controller;
		if(controller){
			let add = Math.min(amount_, 100);
			let storage = controller.getStorageEnergy();
			let max = controller.getStorageEnergyMax();
			if(storage < max){
				controller.setEnergy(Math.min(storage+add, max));
				result += add;
			}
		}
		amount_ = amount - result;
		let energy = Math.min(this.data.energy+Math.min(amount_, 64), 100);
		result += energy - this.data.energy;
		this.data.energy = energy;
		return result;
	}
}
new EnergyAcceptor(BlockID.ae_energy_acceptor);
EnergyTileRegistry.addEnergyTypeForId(BlockID.ae_energy_acceptor, Ae);