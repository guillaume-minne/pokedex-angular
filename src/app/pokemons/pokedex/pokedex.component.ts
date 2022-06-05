import { Component, OnInit} from '@angular/core';
import { Pokemon } from 'src/models/pokemon.model';

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.scss']
})
export class PokedexComponent implements OnInit {
  //pokemon ?: Pokemon;
  pokemonId ?: number;

  receiveMessage(event : Event) {
    console.log("event:"+event);
    this.pokemonId = Number(event);
  }

  constructor() { }

  ngOnInit(): void {
  }

}
