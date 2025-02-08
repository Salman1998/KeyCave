import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'filterDataModifier',
  // pure: false
})
export class FilterDataModifierPipe implements PipeTransform {
  transform(value: any[], filterData: string): any[] {
    if (!value || value.length === 0 || !filterData) {
      // console.log("Pipe: No data or filterData is empty.");
      return value;
    }

    const lowerCaseFilter = filterData.toLowerCase();
     return value.filter(item => {
    //   // Check if name or otherPayer matches the filter string
      return (item.value.code && item.value.code.toString().toLowerCase().includes(lowerCaseFilter))  
    });

  }
}