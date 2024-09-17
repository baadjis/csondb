export type CompareFn<T>=(a:T,b:T)=>number;
interface Dictionary<T> {
    [key:string]:T 
}
export type OptionType={
    limit?:number,
    skip?:number,
    sort?:CompareFn<any>|Dictionary<number>
}