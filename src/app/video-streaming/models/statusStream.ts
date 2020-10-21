export interface StatusStreamInterface {
    INITIAL: number;
    PROGRESS: number;
    FINISHED: number;
}

export enum StatusStream {
    INITIAL = 1,
    PROGRESS = 2,
    FINISHED = 3
}
