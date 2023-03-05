(function(){
	let cables = [];
	
	for(let i in COLORS)
		cables.push({
			name: "Cable",
			texture: [["ae_cable_"+COLORS[i], 0]],
			inCreative: true
		});
	
	IDRegistry.genBlockID("ae_network_cable");
	Block.createBlock("ae_network_cable", cables, BLOCK_TYPE_CABLE);
	for(let i in cables)
		setWireModel("ae", BlockID.ae_network_cable, Number(i));
	AppliedEnergistics.setFlag(BlockID.ae_network_cable, "cable");
		Item.addCreativeGroup("aecables", Translation.translate("Cables"), [
			BlockID.ae_network_cable
		]);
		function getElements(network, name){
			let length = network.getInt(name);
			let result = [];
			for(let i = 0;i < length;i++)
				result[i] = {model: String(network.getString(name+"_"+i)), connection: Number(network.getFloat(name+"_1_"+i))};
			return result;
		}
		
		TileEntity.registerPrototype(BlockID.ae_network_cable, {
			useNetworkItemContainer: true,
			defaultValues: {
				del: true,
				tick: 0,
				sides: null
			},
			containerEvents: {
				event(data){
					getController(this).useAll("serverEvent", [data]);
				}
			},
			client: new RenderUtil.TileEntityClient({
				containerEvents: {
					linkToServer(container, window, content, data){
						for(let key in data)
							this[key] = data[key];
					},
					event(container, window, content, data){
						SubTileController.getSubTile(data.id).clientEvent(container, window, content, data);
					}
				},
				buildModelSide(result, side, model, tiles){
					let central = model.getBoxes()["central"];
					let cable = false;
					for(let i in result){
						model.addModel(CacheFacede.get(result[i].model+"_"+side));
						let connection = result[i].connection;
						if(!connection || cable) continue;
						let box = JSON.parse(JSON.stringify(WIRE_BOXES[side]));
						if(box.replaced < 3)
							box.box[box.replaced] += .5-connection;
						else
							box.box[box.replaced] = box.box[box.replaced-3]+connection-2/16;
							
						model.addBoxByBlock("c"+side, box.box[0], box.box[1], box.box[2], box.box[3], box.box[4], box.box[5], central.id, central.data);
						cable = true;
					}
				},
				buildModel(model){
					let sides = [];
					for(let i = 0;i < 6;i++)
						sides[i] = getElements(this.networkData, i);
					for(let i in sides)
						this.buildModelSide(sides[i], i, model);
				}
			}),
			getEnergy(){
				let controller = getController(this);
				let sum = 0;
				controller.forEach(function(tile){
					sum += tile.getEnergy();
				});
				return sum;
			},
			setElements(name, tiles){
				this.networkData.putInt(name, tiles.length);
				for(let i in tiles){
					this.networkData.putString(name+"_"+i, String(SubTileController.getSubTile(tiles[i].data.id).getNameModel()));
					this.networkData.putFloat(name+"_1_"+i, tiles[i].getConnectionCable());
				}
			},
			load(){
				this.updateModel();
				if(getController(this).canUseTick())
					this.tick = CALBLE_TICK;
				let self = this;
				this.container.addServerCloseListener(function(container, client){
					getController(self).useMethodById(self.self_id, "close", [container, client]);
					self.self_id = undefined;
				});
				this.container.addServerOpenListener(function(container, client, str){
					getController(self).useMethodById(self.self_id, "open", [container, client, str]);
				})
			},
			unload(){
				getController(this).save();
			},
			updateModel(){
				if(this.data.sides === null) this.data.sides = [[], [], [], [], [], []];
				const key = this.blockID+":"+this.blockSource.getBlockData(this.x, this.y, this.z);
				let tiles = getController(this).getTiles();
				for(let i in tiles)
					this.setElements(i, tiles[i]);
				
				RenderUtil.updateModelTileEntity(this.networkData, "facede", key);
				
				this.networkData.sendChanges();
				let model = RenderUtil.getGroup("facede").get(key).copy();
				for(let i in this.data.sides)
					this.client.buildModelSide(this.data.sides[i], i, model, tiles[i]);
				
				BlockRenderer.mapCollisionAndRaycastModelAtCoords(this.dimension, this.x, this.y, this.z, model.getCollisionShape());
			},
			canAdded(id, side){
				let prot = SubTileController.getSubTile(id);
				if(prot){
					if(this.data.sides === null) return true;
					return prot.canAdded(this.data.sides[side]);
				}
				return false;
			},
			add(id, side){
				if(this.data.sides === null) this.data.sides = [[], [], [], [], [], []];
				getController(this).save();
				this.data.sides[side].push({id: id});
				uptController(this);
				this.updateModel();
			},
			destroyBlock(){
				getController(this).dropItem();
			},
			getScreenName(player, coords){
				let item = Entity.getCarriedItem(player);
				let result = getController(this).click(item.id, item.count, item.data, coords, player, item.extra, "getScreenName");
				if(result && typeof result.value == "string"){
					this.self_id = result.self_id;
					return result.value+":"+result.id;
				}
			},
			getScreenByName(name, container){
				let id = name.split(":");
				let machine = SubTileController.getSubTile(id[1]);
				return machine.getScreenByName(id[0], container);
			},
			click(id, count,  data, coords, player, extra){
				getController(this).click(id, count, data, coords, player, extra, "click");
			},
			tick(){
				if(this.data.tick == 5)
					if(this.data.del){
						this.selfDestroy();
						this.tick = undefined;
						return;
					}else{
						this.tick = undefined;
						return;
					}
				this.data.tick++;
			}
		});
})();