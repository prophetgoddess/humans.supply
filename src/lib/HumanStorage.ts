import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

export class HumanData {
    id: string;
    mood: number;
    available: boolean;

    constructor() {
        this.id = uuidv4();
        this.mood = 0.0;
        this.available = true;
    }
}

const { subscribe, set, update } = writable<HumanData[]>([
    new HumanData(), new HumanData()
]);

export const humans = {
    subscribe,
    createHuman: () => update((ls) => [...ls, new HumanData()]),
    toggleAvailable: (id: string) => update((ls) => ls.map(h => {
        if (h.id === id) {
            return Object.assign({}, h, { available: !h.available })
        }
        return h;
    })),
    killHumans: (n: number = 1) => {
        let killed = 0;

        update((ls) => {
            return ls.filter((h) => {
                if (h.available && killed < n) {
                    killed++;
                    return false;
                }
                return true;
            })
        })

        return killed;
    }
}