ModAPI.registerAPI("AppliedEnergistics", {
    MachineRegisty: MachineRegisty,
    Machine: Machine,
    MachineBlcok: MachineBlock,
    AppliedTile: AppliedTile,
    SubTile: SubTile,
    SubTileController: SubTileController,
    AppliedEnergistics: AppliedEnergistics,
    requireGlobal(cmd){
        return cmd;
    }
});