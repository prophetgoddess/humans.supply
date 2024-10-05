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

export class WorkerFacility extends Component {
    constructor() {
        super("WorkerFacility");
    }
}

export class ProcessorFacility extends Component {
    constructor() {
        super("ProcessorFacility");
    }
}

export class ReproductionChamber extends Component {
    constructor() {
        super("ReproductionChamber");
    }
}

export class MeatGrinder extends Component {
    constructor() {
        super("MeatGrinder");
    }
}