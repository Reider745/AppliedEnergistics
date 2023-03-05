IDRegistry.genBlockID("ae_energy_acceptor");
Block.createBlock("ae_energy_acceptor", [
	{
		name: "Energy acceptor",
		texture: [["energy_acceptor", 0]],
		inCreative: true
	}
], BLOCK_TYPE_CONTROLLER);

class EnergyAcceptor extends AppliedTile {
	constructor(id: number){
		super(id);
		addConnect(id, -1, "ic-wire");	
		EnergyTileRegistry.addEnergyTypeForId(id, EU);
	}
	
	public getType(): string {
		return "energy_acceptor";
	}
	public energyReceive(type, amount, voltage) {
		let controller = this.controller;
		if(controller){
			let add = Math.min(amount, 100);
			let storage = controller.getStorageEnergy();
			let max = controller.getStorageEnergyMax();
			if(storage < max)
				controller.setEnergy(Math.min(storage+add, max));
			else return 0;
			return add;
		}
		return 0;
	}
}
new EnergyAcceptor(BlockID.ae_energy_acceptor)