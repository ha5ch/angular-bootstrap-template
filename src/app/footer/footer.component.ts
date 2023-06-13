import { Component } from '@angular/core';
import { ComputedSizeComponent } from '../util/computed-size.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent extends ComputedSizeComponent {
  protected override get refName(): string {
    return 'footer';
  }
}
