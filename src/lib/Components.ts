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

export class Event extends Component {
    message: string;
    ticks: number;

    constructor(message: string, ticks: number = 20) {
        super("Event");
        this.message = message;
        this.ticks = ticks;
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

export class Description extends Component {
    value: string;
    constructor(value: string) {
        super("Description");
        this.value = value;
    }
}

// HUMAN COMPONENTS

export class Human extends Component {
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

export enum FacilityType {
    ReproductionChamber,
    MeatGrinder,
    SolitaryConfinement,
}

export class Facility extends Component {
    capacity: number;
    cost: number;
    purchased: boolean;
    unlocked: boolean;
    type: FacilityType;

    constructor(
        type: FacilityType,
        capacity: number,
        cost: number,
        unlocked: boolean = false,
        purchased: boolean = false,) {
        super("Facility");
        this.type = type;
        this.capacity = capacity;
        this.cost = cost;
        this.unlocked = unlocked;
        this.purchased = purchased;
    }
}
