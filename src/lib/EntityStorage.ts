import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';


export class Component {
    id: string; //FIXME: all my homies hate string compares

    constructor(id: string) {
        this.id = id;
    }
}

export class RelationData {
    other: Entity;
    data: Component;

    constructor(other: Entity, data: Component) {
        this.other = other;
        this.data = data;
    }
}

export class Entity {
    active: boolean;
    id: string;
    components: Component[]

    constructor() {
        this.id = uuidv4();
        this.components = [];
        this.active = true;
    }
}

const { subscribe, set, update } = writable<Entity[]>([]);

export const world = {
    subscribe,
    createEntity: (): Entity => {
        let e = new Entity();
        update((ls) => {
            return [...ls, e]
        })
        return e;
    },
    copyEntity: (e: Entity): Entity => {
        let newEntity = Object.create(e);
        newEntity.id = uuidv4();
        update((ls) => {
            return [...ls, newEntity]
        })
        return newEntity;
    },
    destroyEntity: (e: Entity) => {
        update((ls) => ls.filter((o) => o.id !== e.id))
    },
    setComponent: (e: Entity, component: Component) => {
        update((ls) => {
            return ls.map((en) => {

                if (en.id === e.id) {
                    en.components = en.components.filter((c) => c.id !== component.id)
                    en.components = [...en.components, component]
                }
                return en;
            })
        })
    },
    removeComponent: (e: Entity, id: String) => {
        update((ls) => {
            return ls.map((en) => {
                if (en.id === e.id) {
                    en.components = en.components.filter((c) => id !== c.id)
                }
                return en;
            })
        })
    },

    set: set
}

