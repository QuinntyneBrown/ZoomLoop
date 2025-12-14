import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellingOrTrading } from "../../components";

@Component({
  selector: 'app-buy-or-sell-your-car',
  standalone: true,
  imports: [CommonModule, SellingOrTrading],
  templateUrl: './buy-or-sell-your-car.html',
  styleUrl: './buy-or-sell-your-car.scss'
})
export class BuyOrSellYourCar {}
