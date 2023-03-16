namespace EntityAI {
    interface _AI<T> {
        new(entity: number, i: number): T;
    }

    export class AI {
        public entity: number;
        public remove: boolean = false;
        public list_id: number;
        public navigation: Entity.PathNavigation;

        constructor(entity: number, i: number){
            this.entity = entity;
            this.list_id = i;
            this.navigation = Entity.getPathNavigation(entity);
        }

        public canCreate(): boolean {
            return true;
        }

        public create(): void {

        }

        public canTick(): boolean {
            return true;
        }

        public tick(): void {

        }

        public dead(attacker: number, damageType: number): void {

        }

        public hurt(attacker: number, damageValue: number, damageType: number, someBool1: boolean, someBool2: boolean): void {

        }

        public removeAi(): void {

        }

        public update(): void {
            this.tick();
        }

        public destroy(): void {
            EntityAI.remove(this);
        }
    }

    let ALL_AI: {[stringId: string]: _AI<AI>[]} = {};
    export let LIST: AI[] = [];

    export function register(textId: string, ai: _AI<AI>){
        ALL_AI[textId] = ALL_AI[textId] || []
        ALL_AI[textId].push(ai);
    }

    export function add(entity: number){
        let textId = Entity.getTypeName(entity);
        let list_ai = ALL_AI[textId];
        if(list_ai){
            for(let i in list_ai){
                let _ai = new list_ai[i](entity, LIST.length);
                if(!_ai.canCreate())
                    return;
                _ai.create();
                if(_ai.canTick())
                    Updatable.addUpdatable({
                        update() {
                            _ai.update();
                            this.remove = _ai.remove;   
                        }
                    });
                LIST.push(_ai);
            }
        }
    }

    export function getAiByEntity(entity: number): Nullable<AI> {
        for(let i in LIST)
            if(LIST[i].entity == entity)
                return LIST[i];
        return null;
    }

    export function event(entity: number, name: string, args: any[]): void {
        let ai = getAiByEntity(entity);
        if(ai){
            ai[name].apply(ai, args);
        }
    }

    export function remove(ai: AI){
        if(!ai) return;
        ai.removeAi();
        ai.remove = true;
        LIST.splice(ai.list_id, 1);
        for(let i in LIST)
            LIST[i].list_id = Number(i);
    }
}

Callback.addCallback("EntityDeath", (entity, attacker, damageType) => {
    EntityAI.event(entity, "dead", [attacker, damageType]);
});


Callback.addCallback("EntityHurt", (attacker, entity, damageValue, damageType, someBool1, someBool2) => {
    EntityAI.event(entity, "hurt", [attacker, damageValue, damageType, someBool1, someBool2]);
});

Callback.addCallback("LevelLeft", () => {
    EntityAI.LIST = [];
});

Callback.addCallback("EntityAdded", (ent) => {
    EntityAI.add(ent);
});

Callback.addCallback("EntityRemoved", (ent) => {
    EntityAI.remove(EntityAI.getAiByEntity(ent));
});