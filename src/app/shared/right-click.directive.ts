import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[dsRightClick]'
})
export class RightClickDirective {

  constructor() { }
  @HostListener('document:contextmenu', ['$event'])
  onRightClick(event: Event): void {
    event.preventDefault(); // Prevent the context menu from appearing
  }

}
