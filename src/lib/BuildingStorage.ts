import { writable } from 'svelte/store';
import { humans, HumanData } from './HumanStorage';

export class BuildingData {
    name: string;
    unlocked: boolean;
    purchased: boolean;
    capacity: number;
    tick(users: HumanData[]): void { }

    constructor(name: string, unlocked: boolean, capacity: number) {
        this.name = name;
        this.unlocked = unlocked;
        this.capacity = capacity;
        this.purchased = false;
    }
}

export class ReproductionChamber extends BuildingData {
    constructor(
    ) {
        super(
            "Reproduction Chamber",
            true,
            10)
    }
    tick(users: HumanData[]) {
        let couples = Math.floor(users.length / 2);

        for (let i = 0; i < couples; i++) {
            if (Math.random() <= 0.5) {
                humans.createHuman()

                if (Math.random() <= 0.01) {
                    humans.createHuman()
                }
            }
        }
    }
}

export const built = writable<BuildingData[]>([])
export const available = writable<BuildingData[]>([
    new ReproductionChamber()
])

