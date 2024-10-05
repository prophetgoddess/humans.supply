import { writable } from 'svelte/store';
import { humans, HumanData } from './HumanStorage';
import { money } from './MoneyStorage'

export class BuildingData {
    name: string;
    unlocked: boolean;
    purchased: boolean;
    capacity: number;
    cost: number
    tick(users: HumanData[]): void { }

    constructor(name: string, unlocked: boolean, capacity: number, cost: number) {
        this.name = name;
        this.unlocked = unlocked;
        this.capacity = capacity;
        this.cost = cost;
        this.purchased = false;
    }
}

export class ReproductionChamber extends BuildingData {
    constructor(
    ) {
        super(
            "Reproduction Chamber",
            true,
            10,
            50
        )
    }
    tick(users: HumanData[]) {
        let couples = Math.floor(users.length / 2);

        for (let i = 0; i < couples; i++) {
            if (Math.random() <= 0.2) {
                humans.createHuman()

                if (Math.random() <= 0.01) {
                    humans.createHuman()
                }
            }
        }
    }
}

export class MeatGrinder extends BuildingData {
    constructor() {
        super(
            "Meat Grinder",
            true,
            10,
            100
        )
    }
    tick(users: HumanData[]) {
        let killed = humans.killHumans(
            users.length
        )

        money.update((n) => n + killed * 3);
    }
}

export const built = writable<BuildingData[]>([])
export const available = writable<BuildingData[]>([
    new ReproductionChamber(),
    new MeatGrinder()
])

