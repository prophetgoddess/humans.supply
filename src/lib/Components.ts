import { names } from "./data/Names";
import { Component } from "./EntityStorage";

// GENERAL COMPONENTS

export class Money extends Component {
    value: number = 500;

    constructor(amount: number) {
        super("Money");
        this.value = amount;
    }
}

export class Rudeness extends Component {
    value: number;
    constructor(value: number) {
        super("Rudeness")
        {
            this.value = value;
        }
    }
}

export class Name extends Component {
    value: string;
    constructor(value: string) {
        super("Name");
        this.value = value;
    }
}

// HUMAN COMPONENTS

export class Human extends Component {
    mood: number = 0.0;

    constructor() {
        super("Human");
    }
}

export class Working extends Component {
    constructor() {
        super("Working");
    }
}

export class Rude extends Component {
    constructor() {
        super("Rude");
    }
}

export class Obedient extends Component {
    constructor() {
        super("Obedient");
    }
}

// FACILITY COMPONENTS

export class Facility extends Component {
    capacity: number;
    cost: number;
    purchased: boolean;
    unlocked: boolean;

    constructor(
        capacity: number,
        cost: number,
        unlocked: boolean = false,
        purchased: boolean = false,) {
        super("Facility");

        this.capacity = capacity;
        this.cost = cost;
        this.unlocked = unlocked;
        this.purchased = purchased;
    }
}

export class ReproductionChamber extends Component {
    constructor() {
        super(names.ReproductionChamber.singular);
    }
}

export class MeatGrinder extends Component {
    constructor() {
        super(names.MeatGrinder.singular);
    }
}

export class SolitaryConfinement extends Component {
    constructor() {
        super(names.SolitaryConfinement.singular);
    }
}