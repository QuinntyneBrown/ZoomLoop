// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component } from '@angular/core';
import { LoanInputsPanel } from './loan-inputs-panel';

@Component({
  selector: 'zl-loan-inputs-panel-demo',
  standalone: true,
  imports: [LoanInputsPanel],
  template: `
    <div style="padding: 20px; max-width: 800px; margin: 0 auto;">
      <h1 style="margin-bottom: 30px;">Loan Inputs Panel Demo</h1>
      <zl-loan-inputs-panel></zl-loan-inputs-panel>
    </div>
  `
})
export class LoanInputsPanelDemo {}
