import { Directive, HostListener, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[appNumberLimit]'
})
export class NumberLimitDirective {
  @Input() maxLength: number;
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value.length > this.maxLength) {
      input.value = value.slice(0, this.maxLength);
    }
  }

}
