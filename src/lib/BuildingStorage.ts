import { writable } from 'svelte/store';
import { humans, HumanData } from './HumanStorage';

export class BuildingData {
    name: string;
    unlocked: boolean;
    purchased: boolean;
    tick(users: HumanData[]): void { }

    constructor(name: string, unlocked: boolean) {
        this.name = name;
        this.unlocked = unlocked;
        this.purchased = false;
    }
}

export class ReproductionChamber extends BuildingData {
    constructor(
        name: string = "Reproduction Chamber",
        unlocked: boolean = true
    ) {
        super(name, unlocked)
    }
    tick(users: HumanData[]) {
        console.log("tick");
        let couples = Math.floor(users.length / 2);

        for (let i = 0; i < couples; i++) {
            humans.createHuman()
        }
    }
}

export const built = writable<BuildingData[]>([])
export const available = writable<BuildingData[]>([
    new ReproductionChamber()
])

