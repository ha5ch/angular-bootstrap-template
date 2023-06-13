import { Component, Input } from '@angular/core';
import { ComputedSizeComponent } from '../util/computed-size.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends ComputedSizeComponent {
  @Input('title') title!: string;

  protected override get refName(): string {
    return 'header';
  }
}
