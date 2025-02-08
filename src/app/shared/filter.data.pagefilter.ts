import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pageFilter',
})
export class PageFilterPipe implements PipeTransform {
  transform(pages: string[], searchText: string): string[] {
    if (!searchText) return pages;
    searchText = searchText.toLowerCase();
    return pages.filter((page) =>
      page.toLowerCase().includes(searchText)
    );
  }
}
