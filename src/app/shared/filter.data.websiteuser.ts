import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'filterDataWebsiteUser',
  // pure: false
})
export class FilterDataWebsiteUserPipe implements PipeTransform {
  transform(value: any[], filterData: string): any[] {
    if (!value || value.length === 0 || !filterData) {
      // console.log("Pipe: No data or filterData is empty.");
      return value;
    }

    const lowerCaseFilter = filterData.toLowerCase();
     return value.filter(item => {
    //   // Check if name or otherPayer matches the filter string
      return (item.value.createdBy && item.value.createdBy.toString().toLowerCase().includes(lowerCaseFilter))
    });

  }
}