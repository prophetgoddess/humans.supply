import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

export class HumanData {
    id: string;
    mood: number;
    available: boolean;
    obedient: boolean;
    rude: boolean;

    constructor() {
        this.id = uuidv4();
        this.mood = 0.0;
        this.available = true;
        this.obedient = false;
        this.rude = false;
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
    },
    makeObedient: (n: number = 1) => {
        let obedient = 0;

        update((ls) => {
            return ls.map((h) => {
                if (h.available && obedient < n) {
                    if (Math.random() < 0.1) {
                        obedient++;
                        h.rude = true;
                        return h;
                    }
                    else {
                        obedient++;
                        h.obedient = true;
                        return h;
                    }
                }
                return h;
            })
        })
    }
}