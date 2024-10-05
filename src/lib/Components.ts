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

// FACILITY COMPONENTS

export enum FacilityType {
    Processor,
    Worker
}

export class Facility extends Component {
    capacity: number;
    cost: number;
    purchased: boolean;
    unlocked: boolean;
    type: FacilityType;

    constructor(
        capacity: number,
        cost: number,
        type: FacilityType,
        unlocked: boolean = false,
        purchased: boolean = false,) {
        super("Facility");

        this.capacity = capacity;
        this.cost = cost;
        this.type = type;
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