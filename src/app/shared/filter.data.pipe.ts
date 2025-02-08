import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'filterData',
  // pure: false
})
export class FilterDataPipe implements PipeTransform {
  transform(value: any[], filterData: string): any[] {
    if (!value || value.length === 0 || !filterData) {
      // console.log("Pipe: No data or filterData is empty.");
      return value;
    }

    const lowerCaseFilter = filterData.toLowerCase();
     return value.filter(item => {
    //   // Check if name or otherPayer matches the filter string
      return (item.value.cpt && item.value.cpt.toString().toLowerCase().includes(lowerCaseFilter)) ||
             (item.value.insurance && item.value.insurance.toString().toLowerCase().includes(lowerCaseFilter))  ||
             (item.value.denials && item.value.denials.toString().toLowerCase().includes(lowerCaseFilter)) ||
             (item.value.remark && item.value.remark.toString().toLowerCase().includes(lowerCaseFilter)) ||
             (item.value.note && item.value.note.toString().toLowerCase().includes(lowerCaseFilter));
    });

  }
}