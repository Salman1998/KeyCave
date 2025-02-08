import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'urlShorten'
})

export class UrlShortString implements PipeTransform{

    transform(value: any) {
        if(value?.length < 30){
            return value;
        }
        return value?.substr(0, 30) + ' ....'
    }

}