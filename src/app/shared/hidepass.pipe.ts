import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hidepass'
})
export class HidepassPipe implements PipeTransform {

  transform(value: any, visibility: boolean ) {
    if(value === '' || value === undefined || value ===null){
      return value?.replace(value, '-')
    }

    if(!visibility){
      return value;
    }

    return value?.replace(value, `******`);
  }

}
