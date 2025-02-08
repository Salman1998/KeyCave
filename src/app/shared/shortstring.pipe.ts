import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'shorten'
})

export class ShortString implements PipeTransform{

    transform(value: any) {
        if(value?.length <= 80 || value === undefined || value === null){
            return value;
        }
        return value?.substr(0, 80) + ' ...'
    }

}