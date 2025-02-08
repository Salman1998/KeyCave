import { Component } from '@angular/core';

@Component({
  selector: 'app-hover-text',
  templateUrl: './hover-text.component.html',
  styleUrl: './hover-text.component.css'
})
export class HoverTextComponent {

  show: boolean = false;
  hoverText: any = '';
  setOut: any;
  
  showText(value: any) {
    this.hoverText = value;

    if( value === '' || value !== null || undefined || value === '-'){

    this.setOut = setTimeout( () => {
      if(this.hoverText.length > 15){
        this.show = true;
      }
    } ,1000)

  }
  }

  hideText(){
    clearTimeout(this.setOut);
    this.show = false;
    this.hoverText = '';
  }

}
