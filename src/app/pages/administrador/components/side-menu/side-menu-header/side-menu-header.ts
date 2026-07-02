import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'smarttech-side-menu-header',
  imports: [RouterLink],
  templateUrl: './side-menu-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuHeader {}
