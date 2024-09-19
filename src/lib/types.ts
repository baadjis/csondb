export type CompareFn<T>=(a:T,b:T)=>number;
export type BooleanFn<T>=(a:T)=>boolean
interface Dictionary<T> {
    [key:string]:T 
}
export type OptionType={
    $limit?:number,
    $skip?:number,
    $sort?:CompareFn<any>|Dictionary<number>
}

export interface SchemaField<T>{
    type:Function,
    required?:boolean,
    default?:T
    validator?:BooleanFn<T>
}
export type DescriptorType={
    [key:string]:SchemaField<any>|DescriptorType
}

/*const isDescriptor=(desc:any):desc is DescriptorType=>{

}*/