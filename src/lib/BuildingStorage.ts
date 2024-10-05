import { writable } from 'svelte/store';

export class BuildingData {
    name: string;
    unlocked: boolean;
    purchased: boolean;

    constructor(name: string) {
        this.name = name;
        this.unlocked = true;
        this.purchased = false;
    }
}

export const built = writable<BuildingData[]>([])
export const available = writable<BuildingData[]>([
    new BuildingData("Reproduction Chamber")
])
